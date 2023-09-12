// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview  Slide selection strategies.
 * Defines strategies for slide selection based on user interaction, either
 * through keyboard or mouse.
 *
 * This module mimics Microsoft slide selection behavior.
 * Note: The only exception it differs from Microsoft's behavior -
 *       When there is only one slide active and user uses meta + mouse click
 *       then Microsoft deselects thumb (still showing it in presentation main
 *       slide area). On the other hand, we do not support this behavior, this
 *       means that we will not allow slide to get deselected in this scenario.
 *       This is by design, and we need at least one thumb slide to be active at
 *       any given time.
 *
 * @author rahul.tarafdar@synerzip.com (Rahul Tarafdar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/features/utils'
], function(PubSub, ThumbnailStrip, Features) {

  'use strict';


  // ========== PRIVATE ==========
  var _disableSubscriptionToken,
      _updateThumbCountSubscriptionToken,
      _highlightedThumbs,
      _currentIndex,
      _isEdit,
      _strategyObject,
      _totalThumbnails; // 0 base


  /**
   * Based on current active slide index and new requested slide index, deduce
   * direction that user want to perform.
   *
   * Returns numeric value based on deduced direction.
   * If no movement, then 0 (zero)
   * If movement is upward then 1 (one)
   * If movement is downward then -1 (negative one)
   *
   * @param {Number} currentIndex The active / current slide index.
   * @param {Number} newIndex The new requested slide index.
   * @return {number} Numeric value based on deduced direction.
   *     If no movement, then 0 (zero)
   *     If movement is upward then 1 (one)
   *     If movement is downward then -1 (negative one)
   * @private
   */
  var _getDirection = function(currentIndex, newIndex) {
    var direction = 0;
    if (currentIndex > newIndex) {
      direction = 1; //up
    } else if (currentIndex < newIndex) {
      direction = -1; //down
    }
    return direction;
  };

  /**
   * Makes slide widget active for given slide index.
   * Making active means reflecting the slide in presentation main view area.
   *
   * @param {Number} index The index of slide to make active
   * @return {Object} The Slide widget which this method made active
   * @private
   */
  var _makeThumbActive = function(index) {
    var targetThumb = ThumbnailStrip.thumbnail(index);
    if (targetThumb) {
      ThumbnailStrip.selectItem(index);

      _currentIndex = index;
    }
    return targetThumb;
  };

  /**
   * Handles single selection using keyboard or click.
   *
   * @param {Number} index index for thumbnail to be selected.
   * @private
   */
  var _handleSingleSelection = function(index) {

    // When presentation is loaded, it's first slide selection is invoked by
    // presentation control. This is without user intervention. In this case
    // single selection is happened for first slide. So this is right time to
    // cache total number of slides. We can't do it in this module's init method
    // as when it gets invoked thumbnail strip is not equipped with number of
    // thumbnails, so this is right place to access and cache it.
    if (!_totalThumbnails) {
      _totalThumbnails = ThumbnailStrip.numOfThumbnails() - 1;
    }

    // If requested slide index is out of bound, return the execution control
    // without doing anything. This also means that whatever current selection
    // is not altered.
    if (index < 0 || index > _totalThumbnails) {
      return;
    }

    // If we have current selection then reset / clear it.
    _resetSelection();

    // Make the requested slide active (show in presentation main area),
    // push it to highlighted thumbs stack and highlight it
    var thumb = _makeThumbActive(index);
    if (thumb) {
      _highlightedThumbs.push(thumb, _highlightThumb);
    }
  };

  /**
   *  Range selection is a selection where we have boundary indices and we want
   *  to select every slide in this boundary, including boundary indices.
   *
   *  Current active slide index is already cached, so only remaining boundary
   *  index is passed.
   *
   *  Note: This is assumed for this method that there is an active slide index
   *  cached and it acts as starting boundary index.
   *
   *  Range selection do not change active thumb, i.e. requested slide is not
   *  made active; in fact earlier active slide remains active after this
   *  operation.
   *
   *  This method is directly used for mouse + shift operation.
   *  For keyboard + shift operation, we have to do some range corrections
   *  (cause earlier selection could be non-continuous/random); so this method
   *  is used after range corrections.
   *
   * @param {Number} index The slide index up to which we need to perform
   *     selection from current active slide index
   * @private
   */
  var _handleRangeSelection = function(index) {
    //selection is range from active to requested one
    //Assumption is that there is an active thumb before this operation
    //Active thumb stays intact

    var localCurrentIndex = _currentIndex, thumb;

    // Get operation direction (which is numeric value 0, 1, or -1).
    // This direction value plays an important role in deducing and pushing
    // slides in selection stack
    var direction = _getDirection(localCurrentIndex, index);

    // Reset earlier selection so that we can inject new selection in stack
    _resetSelection();


    // Before we do range operation, check if direction is neutral.
    if (direction === 0) {
      // If direction is neutral, then there is no slide range to be injected in
      // stack but only current active slide needs to be in stack (after
      // clearing earlier selection) and highlighted.
      thumb = ThumbnailStrip.thumbnail(localCurrentIndex);
      _highlightedThumbs.push(thumb, _highlightThumb);
      return;
    }

    // If direction is not neutral, perform range selection.
    // Push selection to stack in sequence such that active slide is on top of
    // stack.
    // In order to do so, start with the end boundary (requested slide index)
    // and end up with current slide index. This is done in same loop, where
    // 'direction' gives real direction to approach current slide index from
    // requested one.
    // After below for loop, our highlighted thumb stack is a sequential
    // selection of thumbs, current active slide being on top.
    for (localCurrentIndex = index;
         localCurrentIndex !== _currentIndex + direction;
         localCurrentIndex = (localCurrentIndex + direction)) {
      thumb = ThumbnailStrip.thumbnail(localCurrentIndex);
      _highlightedThumbs.push(thumb, _highlightThumb);
    }
  };

  /**
   * Range correction is mechanism where random selection is transformed in to
   * sequential selection.
   *
   * This is essential for keyboard + shift operation, where earlier selection
   * could be random / non-continuous.
   *
   * We have followed MicroSoft's behaviour for range correction.
   * In all, range correction follows below strategy
   *
   * 1. Sort the stack (descending). -
   *    1.1 If, with earlier selection was random, sorting will make it as
   *        sequential. Resulting stack could be either continuous or
   *        non-continuous.
   * Note: In earlier selection stack, active slide was on top. After sorting
   *       stack, there are three possibilities for active slide position in
   *       stack
   *    - At top -- If this is the case then our selection is in required
   *            sequential selection.
   *    - At bottom  -- If This is the case then our selection is in required
   *            sequential selection but in reverse order.
   *    - In between top and bottom -- If This is the case then our selection is
   *            not in required sequential selection, and we do need to correct
   *            it such that current active slide is on top. But this leads us
   *            to two solutions based on which part of stack to keep if we
   *            divided stack in to two, active slide being separator.
   *            From observation against Microsoft behaviour, it reveals that MS
   *            keeps the sequential selection of slides less that active slide
   *            index.
   *            As we have our stack sorted in descending order, it is easy for
   *            us to move higher indexed slides. Just chop down from top until
   *            active slide in on top.
   *
   * 2. Check if active slide is on top -
   *    Yes -- We do not need range correction, return the execution control.
   *    No  -- We need range correction, follow next steps
   * 3. Check if active slide is on bottom -
   *    Yes -- We need to reverse the stack such that we have sequential
   *           selection with active slide on top of stack. Reverse and return
   *           the execution control.
   *    No  -- Active slide is neither on top nor at bottom, as we have stack
   *           sorted in descending order, pop from stack until we have active
   *           slide on top.
   *
   * @private
   */
  var _rangeCorrection = function() {

    //sort stack
    _highlightedThumbs.sort(function(thumbA, thumbB) {
      return thumbA.getSlideIndex() - thumbB.getSlideIndex();
    });

    //check if active thumb is on top
    if (_highlightedThumbs.peek().getSlideIndex() === _currentIndex) {
      // active thumb is on top, so we are good to go
      return;
    }
    if (_highlightedThumbs.peek(true).getSlideIndex() ===
        _currentIndex) {
      // active thumb is on bottom, we need to reverse the stack
      _highlightedThumbs.reverse();
      // now stack is reversed and active thumb is on top, we are good to go
      return;
    }
    // active thumb is in between selection range now, we need to chop down
    // stack from top until active thumb is on top

    do {
      var thumb = _highlightedThumbs.pop();
      thumb.highlight(false);
    } while (_highlightedThumbs.peek().getSlideIndex() !== _currentIndex);
  };



  /**
   * Highlight the thumbnail.
   * A very simple function used as callback when we push slide on stack
   * @param {Object} thumb thumbnail to be highlighted.
   * @private
   */
  var _highlightThumb = function(thumb) {
    thumb.highlight(true);
  };

  /**
   * Removes selection from all selected slides
   */
  var _resetSelection = function() {
    // While clearing the stack, use callback to de-highlight slides
    if (_highlightedThumbs) {
      _highlightedThumbs.clear(function(thumbnail) {
        thumbnail.highlight(false);
      });
    }
  };

  /**
   * disable the module.
   * @private
   */
  var _disable = function() {
    _highlightedThumbs = undefined;
    _totalThumbnails = undefined;
    _currentIndex = undefined;
    _strategyObject = undefined;
    _isEdit = undefined;

    PubSub.unsubscribe(_disableSubscriptionToken);
    PubSub.unsubscribe(_updateThumbCountSubscriptionToken);

    _disableSubscriptionToken = undefined;
    _updateThumbCountSubscriptionToken = undefined;
  };

  /**
   * Updates the thumbnail count.
   * Handler for 'qowt:updateThumbCount' PubSub event
   *
   * @param {string} eventType The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   *
   * @private
   */
  var _updateThumbCount = function(eventType, eventData) {
    eventType = eventType || '';
    _totalThumbnails = eventData.thumbCount;
    //If there are no slides left in the presentation reset the selection.
    if (_totalThumbnails === -1) {
      _resetSelection();
    }
  };

  /**
   * Collection of selection strategies
   *
   * It has mainly two strategies
   * 1. Keyboard
   * 2. Mouse
   *
   * Every strategy implements at least one method (treat it like interface
   * method) -- getSelectionMethod(). The job of this method is to deduce and
   * return correct selection method. If unable to deduce then returns undefined
   *
   * Along with getSelectionMethod() method, a strategy can deploy other
   * specialized methods, if required.
   *
   * @type {Object}
   * @private
   */
  var _selectionStrategies = {
    /**
     * Keyboard selection strategy
     */
    keyboard: {

      /**
       * Get selection method for keyboard strategy.
       * This do no return single selection method if shift and meta flags, both
       * are not available.
       *
       * @param {Boolean} shift Flag if shift key is pressed
       * @param {Boolean} meta Flag is meta key is pressed
       * @return {Function/undefined} Function if selection function is deduced
       *     otherwise undefined
       */
      getSelectionMethod: function(shift, meta) {
        // For keyboard navigation, shift precedes over meta when both are true,
        // so check shift first

        // If keypress is using meta key or a combination of shift and meta key
        // then the operation to be preformed is 'move slide'. Hence, we do not
        // perform any selection change on it.
        if (shift && !meta) {
          return _selectionStrategies.keyboard.shift;
        } else if (meta) {
          return undefined;
        }
        return _handleSingleSelection;
      },

      /**
       * 'Keyboard arrow keys + shift' selection method
       *
       * In case of 'keyboard arrow keys + shift' selection, operation is
       * performed on current selection. current selection could be
       * 1. sequential + continuous
       * 2. sequential + non-continuous
       * 3. non-sequential + non-continuous
       *
       * For later two case above, we need to do selection range correction
       * before we perform normal range selection operation using requested
       * slide index
       * @see _rangeCorrection() JSDoc for more details
       *
       * @param {Number} index The requested slide index for shift operation
       */
      shift: function(index) {
        // Get direction for operation
        var direction = _getDirection(_currentIndex, index);

        //before we get bottom thumb and do operate further, need to do range
        //corrections so that we get correct bottom thumb

        _rangeCorrection();

        // For 'keybaord arrow keys + shift' operation we perform range
        // selection operation between current active slide index and requested
        // slide index. But in case of keyboard arrow keys, we get next or
        // previous slides index as requested index. This helps us to deduce the
        // operation direction but we have to find out our own the exact range
        // boundary. This is concluded using bottom thumb's index. So peek the
        // stack at bottom and transform requested index to reflect correct
        // range
        // Note: When we peek at bottom of stack, assumption is that range
        // correction is happened and we have correct state of the stack.
        var bottomThumb = _highlightedThumbs.peek(true);
        index = bottomThumb.getSlideIndex() - direction;

        // If newly formed requested index is out of bound then return the
        // execution control
        if (index > _totalThumbnails || index < 0) {
          return;
        }

        // Perform range selection with newly formed requested index.
        _handleRangeSelection(index);

        // For mouse operation, it is obvious that user can see the requested
        // slide (that why he/she can click on it), but this is not the case
        // when keyboard operations are to be performed.
        // Although, shift operation do not change active slide, but we need to
        // show to user about recently highlighted thumb.
        // To do so, ask the bottom thumb in stack to be visible on screen.
        bottomThumb = _highlightedThumbs.peek(true);
        bottomThumb.makeVisible();
      }
    },

    /**
     * Mouse selection strategy
     */
    mouse: {

      /**
       * Get selection method for Mouse strategy.
       * This do no return single selection method if shift and meta flags, both
       * are not available.
       *
       * @param {Boolean} shift Flag if shift key is pressed
       * @param {Boolean} meta Flag is meta key is pressed
       * @return {Function/undefined} Function if selection function is deduced
       *     otherwise undefined
       */
      getSelectionMethod: function(shift, meta) {
        // For mouse navigation, meta precedes over shift when both are true,
        // so check meta first
        if (meta) {
          return _selectionStrategies.mouse.meta;
        } else if (shift) {
          return _handleRangeSelection;
        }
        return _handleSingleSelection;
      },

      /**
       * Mouse click + meta operation.
       * Meta operation is only effective in case of mouse selection and can
       * lead to random, non-continuous, non-sequential selection.
       *
       * Meta operation also acts as toggling agent for slide selection altering
       * the selection stack.
       *
       * Meta operation do change the active slide.
       *
       * @param {Number} index The requested slide index for meta operation
       */
      meta: function(index) {

        // Get the target thumb where mouse click is happened and get it's
        // highlight state.

        var targetThumb = ThumbnailStrip.thumbnail(index),
            targetOnTop,
            isTargetHighLighted = targetThumb.isHighlighted();

        // Check if target thumb is in highlighted state or not
        if (!isTargetHighLighted) {
          // Thumb is not highlighted, i.e. it is not part of earlier selection.
          // Push the thumb on stack, highlight it. And make the slide as active
          // one
          _highlightedThumbs.push(targetThumb, _highlightThumb);
          _makeThumbActive(index);
          return;
        } else if (_highlightedThumbs.count() <= 1) {
          // Thumb is highlighted, i.e. it is part of earlier selection. Now,
          // check the count of highlighted thumbs. if it is one or less than
          // one then do nothing and return the execution control.
          // This is by design. Microsoft allows to have none of the slides in
          // thumbnail strip to be selected by this mechanism, but we do not
          // want to. We want at least one slide to be active at any given time.
          return;
        }

        // Thumb is highlighted and number of highlighted thumbs are more than
        // one, i.e. target thumb was part of earlier selection and this is the
        // time to de-select it. While doing so, we also need to take care of
        // maintaining active slide using stack, if target thumb was active one.
        targetThumb.highlight(false);

        // Check if target is on top of the stack
        targetOnTop = _highlightedThumbs.peek().getSlideIndex() === index;

        // Check if target is on top of stack
        if (targetOnTop) {
          // Target is on top of stack, pop it.
          _highlightedThumbs.pop();

          // Now we have new top on stack, make it active thumb.
          _makeThumbActive(_highlightedThumbs.peek().getSlideIndex());

        } else {
          // Target is not on top of stack. De-highlight it and remove from
          // stack.
          _highlightedThumbs.remove(function(thumbCheck) {
            return thumbCheck.getSlideIndex() === index;
          });
        }
      }

    }
  };


  // ========== PUBLIC ==========
  var _api = {

    /**
     * Initialize slide selection strategies module
     * @param {Array} highlightedThumbs The thumbs stack which holds highlighted
     *     thumbs. This is initialized by thumbnail strip content manager.
     *     Maintenance is done by slide selection strategies module.
     *     The only reason, it is initialized by thumbnail strip content manager
     *     is that this stack contents are processed by it for further
     *     operations.
     *
     */
    init: function(highlightedThumbs) {
      _highlightedThumbs = highlightedThumbs;
      _strategyObject = {};

      _disableSubscriptionToken = PubSub.subscribe('qowt:disable', _disable);
      _updateThumbCountSubscriptionToken = PubSub.subscribe(
          'qowt:updateThumbCount', _updateThumbCount);
    },

    /**
     * Get appropriate strategy to handle selection of slides.
     *
     * @param {String} navigationType determines click or keydown seelction
     * @param {Boolean} shift whether shift key was pressed
     * @param {Boolean} meta whether meta key was pressed
     * @return {Object} selection strategy
     */
    getStrategy: function(navigationType, shift, meta) {
      // check and cache if edit is enable.
      if (_isEdit === undefined) {
        _isEdit = Features.isEnabled('edit') && Features.isEnabled('pointEdit');
      }
      _currentIndex = ThumbnailStrip.selectedIndex();
      var selectionStrategy;

      if (navigationType !== 'keydown') {
        selectionStrategy = _selectionStrategies.mouse;
      } else {
        selectionStrategy = _selectionStrategies.keyboard;
      }

      if (_isEdit) {
        // When edit is enabled...
        // For keyboard navigation, shift precedes over meta when both are true,
        // so check shift first.
        // For mouse navigation, meta precedes over shift when both are true,
        // so check meta first.
        // Let's ask current selection strategy to choose selection method as
        // per their precedence between shift and meta.
        _strategyObject.select =
            selectionStrategy.getSelectionMethod(shift, meta);
      } else {
        //When edit is disabled always fallback to single selection.
        _strategyObject.select = _handleSingleSelection;
      }

      // Wrap and abstract selection method in an object
      return _strategyObject;
    }
  };

  return _api;
});
