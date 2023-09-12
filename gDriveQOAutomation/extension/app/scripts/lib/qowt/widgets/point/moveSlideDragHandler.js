/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Class for move slide handling.
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(PubSub, I18n, ThumbnailStrip) {

  'use strict';

  var filmStripDiv, tooltipDiv, thumbnailStrip, scrollerThumb;
  var xMousePos = 0;
  var yMousePos = 0;

  /**
   * A drag handler for dragging the currently selected slide(s).
   * @constructor
   */
  var MoveSlideDragHandler = function(slides) {
    /**
     * Context object for all callbacks.
     * @type {Object}
     * @private
     */
    this.slides_ = slides;

    /**
     * Start location for dragging.
     * @private
     */
    this.x_ = null;
    this.y_ = null;
  };

  MoveSlideDragHandler.prototype.constructor = MoveSlideDragHandler;

  MoveSlideDragHandler.prototype.onMouseDown = function() {
    thumbnailStrip = ThumbnailStrip.node();
    scrollerThumb = thumbnailStrip.parentNode;

    xMousePos = 0;
    yMousePos = 0;

    //Create the line bar and tooltip if not already created
    if (!filmStripDiv) {
      _createFilmStrip();
    }
    if (!tooltipDiv) {
      _createToolTip();
    }
    scrollerThumb.addEventListener('scroll', this.onScroll, false);
  };

  MoveSlideDragHandler.prototype.onDragStart = function(event) {
    // If user directly starts dragging from any thumbnail then selection is not
    // fired. Select the thumbnail explicitly if its not already selected.
    _executeThumbnailSelection(event);
    thumbnailStrip.classList.add('qowt-point-move-cursor');

    filmStripDiv.style.visibility = 'visible';
    tooltipDiv.style.visibility = 'visible';
    tooltipDiv.textContent = I18n.getMessage(
                                 "tooltip_move_slide", [this.slides_.length]);
  };

  MoveSlideDragHandler.prototype.onDrag = function(event) {
    xMousePos = event.detail.x;
    yMousePos = event.detail.y;

    //Get the slide node from where the dragging has started.
    var slideNode = _getSelectedSlideNode(event.target);

    var tooltipComputedStyle = window.getComputedStyle(tooltipDiv);
    tooltipDiv.style.left = xMousePos - parseFloat(tooltipComputedStyle.width);
    if ((parseFloat(scrollerThumb.scrollTop) + yMousePos) <=
        parseFloat(scrollerThumb.scrollHeight)) {
      tooltipDiv.style.top = yMousePos -
          parseFloat(tooltipComputedStyle.height) + scrollerThumb.scrollTop;
    }

    if (slideNode) {
      var currentClientRect = slideNode.getBoundingClientRect();
      var slideStart = currentClientRect.top;
      var slideHeight = currentClientRect.height;
      var cursorPositionWithinSlide = yMousePos - slideStart;

      //Calculate in which half of the slide the current cursor position falls.
      var cursorPosWithRespectToDraggedSlide = cursorPositionWithinSlide /
          slideHeight;

      // The target position will always be with respect to the slide that we
      // started dragging. So first, move the filmstrip to the thumbnail in
      // whose area the current mouse position is.
      if (cursorPosWithRespectToDraggedSlide > 0) {
        // slide drag in downward direction
        while (cursorPosWithRespectToDraggedSlide > 1) {
          var nextSlide = slideNode.nextSibling;
          if (nextSlide === filmStripDiv) {
            nextSlide = nextSlide.nextSibling;
          }
          if (nextSlide !== null) {
            slideNode = nextSlide;
            cursorPosWithRespectToDraggedSlide--;
          } else {
            break;
          }
        }
      } else {
        // slide dragged in upward direction
        while (cursorPosWithRespectToDraggedSlide < 0) {
          var previousSlide = slideNode.previousSibling;
          if (previousSlide === filmStripDiv) {
            previousSlide = previousSlide.previousSibling;
          }
          if (previousSlide !== null) {
            slideNode = previousSlide;
            cursorPosWithRespectToDraggedSlide++;
          } else {
            break;
          }
        }
      }


      // Once we have reached the slide in whose the area the current mouse
      // position is, determine whether the slide needs to be inserted above
      // the slide or below the slide.
      if (cursorPosWithRespectToDraggedSlide < 0) {
        //position the filmstrip above the previous slide
        thumbnailStrip.insertBefore(filmStripDiv, slideNode.previousSibling);
      } else if (cursorPosWithRespectToDraggedSlide >= 0 &&
          cursorPosWithRespectToDraggedSlide < 0.5) {
        //position the filmstrip above the slide
        thumbnailStrip.insertBefore(filmStripDiv, slideNode);
      } else {
        //position the filmstrip below the slide
        thumbnailStrip.insertBefore(filmStripDiv, slideNode.nextSibling);
      }
    }
  };

  MoveSlideDragHandler.prototype.onDragEnd = function() {
    //Get the position of the line bar and fire the move command
    thumbnailStrip.classList.remove('qowt-point-move-cursor');
    filmStripDiv.style.visibility = 'hidden';
    tooltipDiv.style.visibility = 'hidden';

    // Publish Slide Move Action
    var siblingNode, direction, moveSlideToPosition;
    if (filmStripDiv.previousSibling === null) {
      moveSlideToPosition = 1;
    } else {
      siblingNode = filmStripDiv.previousSibling;
      moveSlideToPosition = ThumbnailStrip.getThumbnailIndexFromDiv(
          siblingNode) + 2;
    }

    this.slides_ = this.slides_.sort(function(a, b) {
      return a.getSlideIndex() - b.getSlideIndex();
    });

    // Get the direction in which the slides are to be moved based on the first
    // slide(with the least slide index to be moved) and the calculated position
    // where it has to be moved.
    direction = _calculateDirection(this.slides_, moveSlideToPosition);

    // When atleast one of the slides are being moved in the down direction
    // reduce the moveSlideToPosition by 1.
    // Eg: Slide 1 is to be moved below slide 2 using drag. The resulting
    // sequence should be 2, 1, 3. The user has dropped the slide after 2 so as
    // per the above calculation the resulting index would be 3.
    // However, since the slide is above the specified index, giving the index
    // as 3 would move it below the 3rd slide so the sequence will be 2, 3, 1.
    // Hence, reduce the calculated index by 1.
    if (direction === 'down') {
      var allMovedDown = true;
      for (var i = 0; i < this.slides_.length; i++) {
        if (moveSlideToPosition <= this.slides_[i].getSlideIndex() + 1) {
          allMovedDown = false;
        }
      }
      moveSlideToPosition--;
      // If move slides contain a combination of move up and move down scenarios
      // then start reordering in ascending order only. Hence, set direction to
      // 'up'
      if (!allMovedDown) {
        direction = 'up';
      }
    }

    var slideMovedEventData = {
      action: 'moveSlide',
      context: {
        contentType: 'slideManagement',
        position: direction,
        command: {
          moveSlideToPosition: moveSlideToPosition
        }
      }
    };

    PubSub.publish('qowt:requestAction', slideMovedEventData);
  };

  MoveSlideDragHandler.prototype.onMouseUp = function() {
    scrollerThumb.removeEventListener('scroll', this.onScroll);
  };

  MoveSlideDragHandler.prototype.onScroll = function() {
    // upon scroll set left to 0 to prevent the thumbnail strip to scroll
    // horizontally
    scrollerThumb.scrollLeft = 0;
  };

  /**
   * This method is solely for the purpose of unit tests.
   */
  MoveSlideDragHandler.prototype.reset = function() {
    filmStripDiv = undefined;
    tooltipDiv = undefined;
    thumbnailStrip = undefined;
    scrollerThumb = undefined;
  };

  /**
   * Create the filmstrip div
   * @private
   */
  var _createFilmStrip = function() {
    filmStripDiv = document.createElement('div');
    filmStripDiv.id = 'qowt-point-move-slide-filmstrip';
    filmStripDiv.classList.add('qowt-point-filmstrip');
    thumbnailStrip.appendChild(filmStripDiv);
  };

  /**
   * Create the tooltip div
   * @private
   */
  var _createToolTip = function() {
    tooltipDiv = document.createElement('div');
    tooltipDiv.id = 'qowt-point-move-slide-tooltip';
    tooltipDiv.classList.add('qowt-point-tooltip');
    scrollerThumb.appendChild(tooltipDiv);
  };

  /**
   * Return the thumbnail div related to the slide which is clicked.
   * @param {object} target HTML element which was clicked.
   * @return {object} HTML element related to slide which was clicked.
   * @private
   */
  var _getSelectedSlideNode = function(target) {
    var divType = target.getAttribute('qowt-divtype');
    while (divType !== 'thumbnail') {
      target = target.parentElement;
      if (target === null) {
        return undefined;
      }
      divType = target.getAttribute('qowt-divtype');
    }
    return target;
  };

  /**
   * Calculate the direction in which the slides have to be moved depending upon
   * moveToSlidePosition specified.
   *
   * @param {Object} slidesToBeMoved slides that are to be moved
   * @param {Number} moveToSlidePosition index to which the slides are to be
   *                                     moved.
   *
   * @return {String} direction in which the slides are to be moved.
   * @private
   */
  var _calculateDirection = function(slidesToBeMoved, moveToSlidePosition) {
    if (moveToSlidePosition <= slidesToBeMoved[0].getSlideIndex() + 1) {
      return 'up';
    } else {
      return 'down';
    }
  };

  /**
   * Publish selection events for thumbnail.
   * @param {Number} index index of thumbnail to be selected
   * @param {object} event key down event
   * @private
   */
  var _executeThumbnailSelection = function(event) {
    var target;
    if (event.target) {
      target = _getSelectedSlideNode(event.target);
    }
    if (target) {
      var _index = ThumbnailStrip.getThumbnailIndexFromDiv(target);
      if (_index !== undefined) {
        if (ThumbnailStrip.thumbnail(_index).isHighlighted()) {
          PubSub.publish('qowt:requestFocus', {contentType: 'slideManagement'});
        } else {
          var _contextData = {
            contentType: 'slideManagement',
            index: _index,
            meta: false,
            shift: false,
            type: event.type
          };
          // Clear any selection in slide
          PubSub.publish('qowt:clearSlideSelection');
          PubSub.publish('qowt:requestFocus', _contextData);
        }
      }
    }
  };
  return MoveSlideDragHandler;
});
