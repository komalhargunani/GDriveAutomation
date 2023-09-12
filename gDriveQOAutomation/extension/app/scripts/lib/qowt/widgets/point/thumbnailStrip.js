/**
 * Thumbnail Strip
 * ==============
 *
 * The thumbnail strip widget encapsulates the part of the HTML DOM representing
 * a presentation that displays the thumbnails on the left side of the screen.
 * The thumbnail strip widget manages the construction and logic of this area.
 *
 * The size etc. of the strip can be set in the CSS file
 * (class qowt-point-thumbnail-strip)
 *
 * The strip listens to the following 2 events: "qowt:pointThumbnailClicked"
 * and "qowt:slideLoaded".
 *
 * 'pointThumbnailClicked' is usually dispatched by a thumbnail in the strip.
 *
 * 'slideLoaded' is usually dispatched by the command manager when the contents
 * of a slide have been loaded.
 *
 * Both of the events above cause the strip to dispatch event
 * "qowt:pointSetSlide", which is usually received by the controller.
 * It then clones the content of the thumbnail into the slide view.
 * Note that 'qowt:pointSetSlide' is only dispatched after 'qowt:slideLoaded'
 * if the currently selected slide was loaded.
 *
 * The strip also listens to the event "keydown" and it reacts to arrow up and
 * down keys to scroll the strip.
 *
 * The strip is populated by first creating a number of empty thumbnails.
 * Then the DCP handlers start loading the slides and filling the thumbnails
 * with content.
 * DCP handlers access individual thumbnails with the method thumbnail(x)
 * where x is the index of the thumbnail.
 *
 * @constructor     Constructor for the Thumbnail Strip widget.
 * @return {object} A Thumbnail Strip widget.
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/models/transientAction',
  'qowtRoot/presentation/slideChartsManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/cssManager',
  'qowtRoot/variants/configs/point',
  'qowtRoot/widgets/point/slide'
], function(
    PointModel,
    TransientActionModel,
    SlideChartsManager,
    PubSub,
    CssManager,
    PointConfig,
    Slide) {

  'use strict';

  var _kThumbnailStrip_Node = {
    Tag: 'div',
    Class: 'qowt-point-thumbnail-strip'
  };

  /**
   * @api private
   */
  var _nails = [],
      _node,
      _parentNode,
      _selectedItem,
      _destroyToken,
      _selectSlideToken,
      _nextSlideToken,
      _previousSlideToken,
      _highlightedThumbs;

  /**
   * @api public
   */
  var _api = {

    /**
     * initialise the thumbnail strip; should be called by the presentation
     * layout control (or whomever includes this widget)
     */
    init: function() {
      if (_node) {
        throw new Error('thumbnailStrip.init() called multiple times.');
      }
      _node = window.document.createElement(_kThumbnailStrip_Node.Tag);
      _node.id = _kThumbnailStrip_Node.Class;
      _node.className = _kThumbnailStrip_Node.Class;
      _node.setAttribute("aria-label", "Slide strip. Use tab to play." +
        "  Use arrows for slide navigation.");

      _selectSlideToken = PubSub.subscribe("qowt:selectSlide",
          _selectSlideListener);
      _nextSlideToken = PubSub.subscribe("qowt:nextSlide", _nextSlideListener);
      _previousSlideToken = PubSub.subscribe("qowt:previousSlide",
          _previousSlideListener);
      _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
    },

    /**
     * Clears the set of thumbnails. Unit test helper method
     *
     * @method clearThumbs()
     */
    clearThumbs: function() {
      _nails = [];
    },

    /**
     * Creates a set of thumbnails. The thumbnails are actually just empty
     * placeholders as they don't have any content yet.
     *
     * @param num {integer} the number of thumbnails to be created
     * @method createNumOfThumbs()
     */
    createNumOfThumbs: function(num) {
      var newNails = [];
      var newNail;

      // We need the css to get the size of the thumbs
      // so force all cached css to be written to the DOM
      CssManager.flushCache();

      for (var x = 0; x < num; x++) {
        newNail = _createNewNail(x);
        newNails[x] = newNail;
      }
      _nails = newNails;

      //On loading presentation, we implicitly select the first thumbnail.
      //So activate thumbnailStripTool for the same.
      PubSub.publish('qowt:requestFocus', {contentType: 'slideManagement',
        index: 0});
      _node.focus();
    },

    /**
     * Reorder the thumbnails. This method updates the
     * thumbnails indexes and the references to the slides widgets and it is
     * called bythe slideManagement tool.
     *
     * @param draggedSlideIndex {integer} index of the dragged slide
     * @param droppedPosition {integer} position where the dragged slide is
     * dropped
     *
     * @method reorderThumbnails(draggedSlideIndex, droppedPosition)
     */
    reorderThumbnails: function(draggedSlideIndex, droppedPosition) {
      if ((draggedSlideIndex === undefined || !_nails[draggedSlideIndex]) ||
          (droppedPosition === undefined || !_nails[droppedPosition])) {
        return;
      }
      var tmpNail;
      tmpNail = _nails[droppedPosition];
      _nails[droppedPosition] = _nails[draggedSlideIndex];
      _nails[droppedPosition].setSlideIndex(droppedPosition);

      if (draggedSlideIndex < droppedPosition) {
        for (var i = draggedSlideIndex; i <= droppedPosition - 1; i++) {
          if (i < droppedPosition - 1) {
            _nails[i] = _nails[i + 1];
          } else {
            _nails[i] = tmpNail;
          }
          _nails[i].setSlideIndex(i);
        }
      } else if (draggedSlideIndex > droppedPosition) {
        for (var ii = draggedSlideIndex; ii >= droppedPosition + 1; ii--) {
          if (ii > droppedPosition + 1) {
            _nails[ii] = _nails[ii - 1];
          } else {
            _nails[ii] = tmpNail;
          }
          _nails[ii].setSlideIndex(ii);
        }
      }
      _nails[droppedPosition].showSlide(true);

      // If the slide has to be inserted at the end then specify the
      // sibling as null so that it gets reordered to the end of the
      // parent.
      if (droppedPosition === _nails.length - 1) {
        _node.insertBefore(_nails[droppedPosition].node(), null);
      } else {
        _node.insertBefore(_nails[droppedPosition].node(),
            _nails[droppedPosition + 1].node());
      }
    },

    /**
     * Returns a specific thumbnail in the strip.
     *
     * @param index {integer} the index of thumbnail to be returned
     * @return {object} specific thumbnail
     * @method thumbnail()
     */
    thumbnail: function(index) {
      return _nails[index];
    },

    /**
     * Move Slides and update numbering.
     *
     * @param {Object} slides slide indices to be moved.
     * @param {Number} indexToMove slide index to which the slides have to be
     * moved.
     * @param {String} position position in which the slide needs to be moved
     *                 up/down/start/end
     */
    moveSlides: function(slides, indexToMove, position) {
      switch (position) {
        case 'down':
        case'end':
          for (var i2 = slides.length - 1; i2 >= 0; i2--, indexToMove--) {
            _api.reorderThumbnails(slides[i2] - 1, indexToMove - 1);
            _selectedItem = indexToMove - 1;
          }
          break;
        default:
          for (var i = 0; i < slides.length; i++, indexToMove++) {
            _api.reorderThumbnails(slides[i] - 1, indexToMove - 1);
            _selectedItem = indexToMove - 1;
          }
          break;
      }
      //Set the current slide as empty and then refresh the slide container.
      PubSub.publish('qowt:clearSlideContainer', {});
      PubSub.publish('qowt:pointSetSlide', { 'slide': _selectedItem });
    },

    /**
     * Returns the number of thumbnails in the strip.
     *
     * @return {integer} The number of thumbs.
     * @method numOfThumbnails()
     */
    numOfThumbnails: function() {
      return _nails.length;
    },

    /**
     * Deletes all the thumbnails specified, updates numbering.
     * Handles next selection on strip and slide container.
     *
     * @param {Object} slides slide indices to be deleted.
     */
    deleteSlides: function(slides) {
      var numberOfSlides = slides.length;
      var indexToBeSelected = Number.POSITIVE_INFINITY;
      var thumbCount = _api.numOfThumbnails();
      for (var i = 0; i < numberOfSlides; i++) {
        var index = slides[i] - 1;
        var slideNode = _api.thumbnail(index).node();
        slideNode.parentNode.removeChild(slideNode);

        _nails.splice(index, 1);

        //Refresh the slide container post delete action.
        PubSub.publish('qowt:clearSlideContainer', {});
        SlideChartsManager.deleteSlideEntryFromChartMap(slideNode);
        PointModel.numberOfSlidesInPreso--;
        thumbCount--;
        indexToBeSelected = Math.min(indexToBeSelected, index);
      }

      //Update total number of thumbnails.
      PubSub.publish('qowt:updateThumbCount', {
        thumbCount: thumbCount - 1
      });


      if (_nails.length !== 0) {
        _updateNumbering();

        indexToBeSelected = Math.min(indexToBeSelected, _nails.length - 1);

        _nails[_nails.length - 1].showSlide(true);

        //Select the next available slide.
        PubSub.publish('qowt:requestFocus', {
          contentType: 'slideManagement',
          index: indexToBeSelected,
          meta: false,
          shift: false,
          type: 'click'
        });
      } else {
        // Disable all menu items and unlock screen if no slides are left in
        // the presentation
        PubSub.publish('qowt:presentationEmpty');
        PubSub.publish('qowt:unlockScreen');
      }
      TransientActionModel.clearTransientValues();
    },

    /**
     * Returns the index of the selected item
     *
     * @return {integer} index of the selected item
     * @method selectedIndex()
     */
    selectedIndex: function() {
      return _selectedItem;
    },

    /**
     * Sets highlighted thumbs array.
     * @param {object} highlightedThumbs array of highlighted thumbnails.
     */
    setHighlightedThumbs: function(highlightedThumbs) {
      _highlightedThumbs = highlightedThumbs;
    },

    /**
     * Returns highlighted thumbnails.
     * @return {array} array of highlighted thumbnails.
     */
    getHighlightedThumbs: function() {
      return _highlightedThumbs;
    },

    /**
     * Show or hide the strip.
     *
     * @param show {boolean} Show (true) or hide (false) the strip
     * @method showStrip()
     */
    showStrip: function(show) {
      if (show) {
        _node.style.display = 'block';
      } else {
        _node.style.display = 'none';
      }
    },

    /**
     * Returns the node of the strip
     *
     * @return {object} the node of the strip
     * @method node()
     */
    node: function() {
      return _node;
    },

    /**
     * Every widget has an appendTo() method.
     * This is used to attach the HTML elements of the widget to a
     * specified node in the HTML DOM.
     * Here the strip div element is appended as a child to the specified node.
     *
     * @param node {object} The HTML node that this widget is to attach
     * itself to
     * @method appendTo(node)
     */
    appendTo: function(node) {
      if (node === undefined) {
        throw new Error("appendTo - missing node parameter!");
      }

      _parentNode = node;
      _parentNode.appendChild(_node);

      // now that the thumbnail strip is added to the parent,
      // make sure it has focus so that it starts grabbing
      // key events to allow the user to navigate through
      // the slide deck
      _node.tabIndex = "-1";
      _node.focus();
    },

    /**
     * Attach the specified widget to this widget.
     * Here the specified cell thumbnail is attached to this strip widget
     *
     * @param nail {object} A thumbnail widget
     * @method attachWidget(nail)
     */
    attachWidget: function(nail) {
      if (nail === undefined) {
        throw new Error("attachWidget - missing nail parameter!");
      }
      _nails[nail.index()] = nail;
    },

    /**
     * Makes sure that the currently selected thumbnail
     * (_selectedItem) is visible on the screen
     *
     * @method makeSelectedVisible()
     */
    makeSelectedVisible: function() {
      if (typeof _selectedItem !== 'undefined' && _nails[_selectedItem]) {
        _nails[_selectedItem].node().scrollIntoView();
      }
    },

    /**
     * Selects a slide in the thumbnail strip and
     * sends a qowt:pointSetSlide event to the Presentation control that then
     * will clone the thumbnail into the main slide.
     *
     * @param index {integer} the index of thumbnail to be selected
     * @method selectItem(index)
     */
    selectItem: function(index) {
      _selectItem(index);
    },

    /**
     * Inserts a thumb node at specified index and updates numbering.
     *
     * @param {Number} index index at which slide has to be inserted (0 base).
     */
    insertSlide: function(index) {
      var newThumb = _createNewNail(index);
      _nails.splice(index, 0, newThumb);

      // The newly added thumb is added at the end of thumbnail strip node
      // during creation. So if the actual position at which the new slide needs
      // to be added is the last position then there is no need to reorder it
      // within the strip.
      if (index !== _nails.length - 1) {
        _node.insertBefore(_nails[index].node(), _nails[index + 1].node());
      }
      _updateNumbering();
    },

    /**
     * Remove the html elements from their parents and destroy all references.
     */
    destroy: function() {

      if (_node && _node.parentNode) {
        _node.parentNode.removeChild(_node);
      }
      _reset();
    },

    /**
     * Get the index of the thumbnail div passed.
     * @param {object} thumbDiv HTML element for thumb
     * @return {Number} index of thumbnail
     * @private
     */
    getThumbnailIndexFromDiv: function(thumbDiv) {
      var label = thumbDiv.getAttribute('aria-label');
      while (label === undefined || label === null) {
        thumbDiv = thumbDiv.parentElement;
        if (thumbDiv === null) {
          return undefined;
        }
        label = thumbDiv.getAttribute('aria-label');
      }
      return label.split('slide ')[1] - 1;
    },

    /**
     * Get all the thumbnails in the presentation.
     * @return {Array} an array of thumb nodes
     */
    getThumbnails: function() {
      var thumbs = [];
      for (var i = 0; i < _nails.length; i++) {
        thumbs[i] = _nails[i];
      }
      return thumbs;
    }
  };

  /**
   * @api private
   */
  var _selectItem = function(index) {
    if (index === undefined || !_nails[index]) {
      return;
    }

    for (var i = 0; i < _nails.length; i++) {
      if (_nails[i]) {
        _nails[i].setSelected(false);
      }
    }

    if (_nails[index]) {
      _nails[index].setSelected(true);
      _selectedItem = index;
      PubSub.publish("qowt:pointSetSlide", { 'slide': _selectedItem });
    }
  };

  /**
   * Update the numbering of thumbnails in the strip.
   *
   * @private
   */
  var _updateNumbering = function() {
    for (var i = 0; i < _nails.length; i++) {
      _nails[i].setSlideIndex(i);
    }
  };

  var _reset = function() {
    PubSub.unsubscribe(_destroyToken);
    PubSub.unsubscribe(_selectSlideToken);
    PubSub.unsubscribe(_nextSlideToken);
    PubSub.unsubscribe(_previousSlideToken);
    _nextSlideToken = undefined;
    _selectSlideToken = undefined;
    _previousSlideToken = undefined;
    _destroyToken = undefined;
    _node = undefined;
  };

  /**
   * Handler for qowt:selectSlide event published by PubSub
   * @param eventType the event type qowt:selectSlide
   * @param eventData the event data containing slide index to select
   */
  var _selectSlideListener = function(eventType, eventData) {
    eventType = eventType || '';
    if (eventData.slide) {
      _selectItem(eventData.slide);
    }
  };

  /**
   * Handler for qowt:nextSlide event published by PubSub
   * @param eventType the event type qowt:nextSlide
   * @param eventData the event data
   */
  var _nextSlideListener = function(/* eventType, eventData */) {
    var newIndex = _selectedItem + 1;
    if (newIndex !== PointModel.numberOfSlidesInPreso) {
      _selectItem(newIndex);
    }
  };

  /**
   * Handler for qowt:previousSlide event published by PubSub
   * @param eventType the event type qowt:previousSlide
   * @param eventData the event data
   */
  var _previousSlideListener = function(/* eventType, eventData */) {
    if (_selectedItem !== 0) {
      _selectItem(_selectedItem - 1);
    }
  };

  /**
   * Create a new thumbnail node.
   *
   * @param {Number} index index of new thumbnail node to be created.
   * @return {Object} Slide widget
   *
   * @private
   */
  var _createNewNail = function(index) {
    var newNail = Slide.create(index, _node, true);

    // Applying the scaling to the thumb and updating the size of the
    // container
    var thumbWidth = newNail.width();
    var thumbHeight = newNail.height();

    // we have to adjust the scale factor here to cope with differing sized
    // slides this is to ensure that the thumbnail we produce fits in to the
    // thumbnail strip
    var scaleFactor = PointConfig.kTHUMBNAIL_RESIZE_SCALE *
        (PointConfig.kTHUMBNAIL_STRIP_WIDTH / thumbWidth);

    newNail.innerNode().style['-webkit-transform'] =
        'scale(' + scaleFactor + ')';

    newNail.setWidth(parseInt((thumbWidth -
        PointConfig.kTHUMBNAIL_SIZE_ADJUST) * scaleFactor, 10));
    newNail.setHeight(parseInt((thumbHeight -
        PointConfig.kTHUMBNAIL_SIZE_ADJUST) * scaleFactor, 10));

    newNail.node().style.marginBottom =
        PointConfig.kGAP_BETWEEN_THUMBNAILS + 'px';

    return newNail;
  };

  return _api;
});
