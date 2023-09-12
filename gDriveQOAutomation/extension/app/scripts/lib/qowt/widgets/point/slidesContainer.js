/**
 * Slides Container
 * =================
 *
 * The slides container widget encapsulates the part of the HTML DOM
 * representing
 * a presentation that displays a slides container and provides methods to zoom.
 *
 * It creates two nested HTML elements to implement zooming:
 * - An outer node with id and class "qowt-point-slides-container".
 * - An inner node with id and class "qowt-point-slides-zoom-container".
 *
 * @constructor     Constructor for the Slides Container widget.
 * @return {object} A SlidesContainer widget.
 */
define([
  'qowtRoot/controls/point/animation/transitionManager',
  'qowtRoot/controls/point/animation/animationRequestHandler',
  'qowtRoot/widgets/point/slide',
  'qowtRoot/widgets/point/slidenotes',
  'qowtRoot/models/point',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/features/utils',
  'third_party/lo-dash/lo-dash.min'
], function(
    TransitionManager,
    AnimationRequestHandler,
    Slide,
    SlideNotes,
    PointModel,
    PubSub,
    ThumbnailStrip,
    LayoutsManager,
    Features) {

  'use strict';

  var _kSlidesContainer_Node = {
    Tag: 'div',
    Class: 'qowt-point-slides-container'
  },
  _kSlidesZoomContainer_Node = {
    Tag: 'div',
    Class: 'qowt-point-slides-zoom-container'
  };

  var EMPTY_SLIDE_INDEX = "EMPTY";

  /**
   * Private data
   * @api private
   */
  var _slidesContainerNode;
  var _toast;
  var _slidesZoomContainerNode, _currentSlide,
      _previousSlide, _destroyToken, _nextSlide, debouncedThumbUpdateFunc_,
      KDebounce_Wait_ = 500, tokenEdit_, thumbnailUpdated_ = true;

  var _slideBackup; // used to backup slide while swapping
  // Holds layer values (z-index values) for slide widgets.
  var layer = {
    bottom: 1,
    // z-index 1
    middle: 2,
    // z-index 2
    top: 3     // z-index 3
  };

  /**
   * Navigation local model
   * Maintains slide index to which navigation will happen, used
   * in case of slide show
   */
  var _navigation = {
    /**
     * slide index to which navigation will happen
     */
    toSlide: undefined
  };

  /**
   * Setup for slide show.
   * Populates previous and next slide widgets with appropriate contents.
   *
   * this function call is made from
   * presentation widgets, in which case its a request
   * to enter into slide show mode.
   * When this happens we need to show animation effect to current slide, as if
   * previous slide is empty and black in color and do slide transition
   *
   * In this case we need to do following
   * 1. make previous slide empty and black in color
   * 2. show current slide transition from previous slide.
   */
  var _setupForSlideShow = function() {
    // The request is coming from presentation and it says
    // to enter into slide show mode.
    _nextSlide.showSlide(false);

    _previousSlide.empty();
    _previousSlide.innerNode().style.backgroundColor = "black";

    _previousSlide.setLayer(layer.middle);
    _previousSlide.showSlide(true);

    _currentSlide.setLayer(layer.top);
    _currentSlide.showSlide(false);

    var currentSlideIndex = ThumbnailStrip.selectedIndex();

    // Setup animations for the current slide
    AnimationRequestHandler.setupAnimations(currentSlideIndex,
        _getSlideSize());

    window.setTimeout(function() {
      TransitionManager.displaySlideAnimation(_previousSlide,
          _currentSlide, _afterSlideDisplayed);
    }, 50);
  };

  /**
   * Fetch slide to previous slide widget for given slide index
   * @param index the slide index
   */
  var _addPrevious = function(index) {
    if (index !== 0) {
      _getThumbnailDataInSlide(index - 1, _previousSlide);
    } else {
      // make previous slide widget empty
      _previousSlide.empty();
      _previousSlide.setSlideIndex(EMPTY_SLIDE_INDEX);
    }
  };

  /**
   * Fetch the previous slide for given slide index
   * @param index the slide index
   */
  var _addNext = function(index) {
    // PointModel.numberOfSlidesInPreso is the total slide count in presentation
    if ((index + 1) !== PointModel.numberOfSlidesInPreso) {
      _getThumbnailDataInSlide(index + 1, _nextSlide);
    } else {
      //make next slide widget empty
      _nextSlide.empty();
      _nextSlide.setSlideIndex(EMPTY_SLIDE_INDEX);
    }
  };

  /**
   * This method performs task after slide is displayed for a slide index
   * This method also acts as a call back for transition manager which invokes
   * it after slide animation is done and slide is displayed completely.
   * @param details the details about animation done slide
   * details object is in format -- {'type':'transition',
   * 'slideIndex': _slideIndex, "withEffect" : effectName}
   */
  var _afterSlideDisplayed = function(/* details */) {
    var doneSlideIndex = _navigation.toSlide;

    /**
     * If previous slide is empty then we have two scenarios in which it can
     * happen
     * 1. current slide is at top i.e. first slide
     * 2. presentation had entered in slide show mode
     *
     * For second case we had previous slide made empty and black in color,
     * so we need to revert it; and if we do same for first case then its
     * harmless.
     */
    if (_previousSlide.isEmpty()) {
      _previousSlide.innerNode().style.backgroundColor = "";
      _addPrevious(doneSlideIndex);
    }

    // We need to start object animation automatically when the first animation
    // is not on click (ie. with or after previous).
    if (PointModel.slideShowMode &&
        AnimationRequestHandler.isAnimationToBePlayed(
            ThumbnailStrip.selectedIndex())) {
      AnimationRequestHandler.playAutomatic();
    }
  };

  /**
   * Navigation strategies
   *
   * Navigation can happen in 4 ways
   * 1. step up - navigation to previous slide
   * 2. step down - navigation to next slide
   * 3. jump up - navigation to earlier slide but not sequential previous
   * 4. jump down - navigation to later slide but not sequential next
   *
   * So, correspondingly, we have four strategies, and every strategy implements
   * navigateToSlide() method which client of this strategy collection
   * will use ultimately.
   */
  var _navigatorStrategies = {

    /**
     * Step up navigation strategy
     */
    stepUp: {
      /**
       * If we are trying to view previous slide, following should be done -
       * 1. next Slide = current Slide (reuse)
       * 2. current Slide = previous Slide (reuse)
       * 3. previous Slide = current Slide - 1 (fetch)
       * @param slideIndex the slide index to which navigation will happen
       */
      navigateToSlide: function(slideIndex) {
        _slideBackup = _nextSlide;

        _nextSlide = _currentSlide;
        _nextSlide.setLayer(layer.middle);
        _nextSlide.node().classList.remove('qowt-selectText');
        _nextSlide.showSlide(true);

        _currentSlide = _previousSlide;
        _currentSlide.setLayer(layer.top);
        _currentSlide.showSlide(false);

        if (_currentSlide.isEmpty() ||
            !_api.isThumbClonedCompletely(slideIndex)) {
          _getThumbnailDataInSlide(slideIndex, _currentSlide);
        }

        _previousSlide = _slideBackup;
        _previousSlide.setLayer(layer.bottom);
        _previousSlide.showSlide(false);

        _addPrevious(slideIndex);

        if (PointModel.slideShowMode === true) {
          AnimationRequestHandler.setupAnimationHistory(slideIndex,
              _getSlideSize());
          TransitionManager.displaySlideAnimation(_nextSlide,
              _currentSlide, _afterSlideDisplayed);
        } else {
          _currentSlide.showSlide(true);
          _api.enableTextSelection();
        }
      }
    },

    /**
     * Jump up navigation strategy
     */
    jumpUp: {
      /**
       * If navigation is up and but not adjacent previous then its a jump
       * and we need to fetch all slide widgets (current, previous, and next)
       *
       * @param slideIndex the slide index to which navigation will happen
       */
      navigateToSlide: function(slideIndex) {
        _currentSlide.setLayer(layer.top);
        _getThumbnailDataInSlide(slideIndex, _currentSlide);
        _addPrevious(slideIndex);
        _addNext(slideIndex);

        if (PointModel.slideShowMode === true) {
          /**
           * Note: Right now we cant jump in slide show mode,
           * but, if 'go to slide' feature added in slide show mode,
           * then below provision
           */
          _currentSlide.showSlide(false);
          AnimationRequestHandler.setupAnimations(slideIndex, _getSlideSize());
          TransitionManager.displaySlideAnimation(_nextSlide,
              _currentSlide, _afterSlideDisplayed);
        } else {
          _currentSlide.showSlide(true);
          _api.enableTextSelection();
        }
      }
    },

    /**
     * Step down navigation strategy
     */
    stepDown: {
      /**
       * If we are trying to view next slide, following should be done -
       * 1. previous slide = current slide (reuse)
       * 2. current slide = next slide (reuse)
       * 3. next slide = current slide + 1 (fetch)
       */
      navigateToSlide: function(slideIndex) {
        _slideBackup = _previousSlide;

        _previousSlide = _currentSlide;
        _previousSlide.setLayer(layer.middle);
        _previousSlide.node().classList.remove('qowt-selectText');
        _previousSlide.showSlide(true);

        _currentSlide = _nextSlide;
        _currentSlide.setLayer(layer.top);
        _currentSlide.showSlide(false);

        if (_currentSlide.isEmpty() ||
            !_api.isThumbClonedCompletely(slideIndex)) {
          _getThumbnailDataInSlide(slideIndex, _currentSlide);
        }

        _nextSlide = _slideBackup;
        _nextSlide.setLayer(layer.bottom);
        _nextSlide.showSlide(false);

        _addNext(slideIndex);

        if (PointModel.slideShowMode === true) {
          AnimationRequestHandler.setupAnimations(slideIndex, _getSlideSize());
          TransitionManager.displaySlideAnimation(_previousSlide,
              _currentSlide, _afterSlideDisplayed);
        } else {
          _currentSlide.showSlide(true);
          _api.enableTextSelection();
        }
      }
    },

    /**
     * Jump down navigation strategy
     */
    jumpDown: {
      /**
       * If navigation is down but not adjacent next then its a jump
       * and we need to fetch all slide widgets (current, previous, and next)
       *
       * @param slideIndex the slide index to which navigation will happen
       */
      navigateToSlide: function(slideIndex) {

        _currentSlide.setLayer(layer.top);
        _getThumbnailDataInSlide(slideIndex, _currentSlide);
        _addNext(slideIndex);
        _addPrevious(slideIndex);

        if (PointModel.slideShowMode === true) {
          /**
           * Note: Right now we cant jump in slide show mode,
           * but, if 'go to slide' feature added in slide show mode, then below
           * provision
           */
          _currentSlide.showSlide(false);
          AnimationRequestHandler.setupAnimations(slideIndex, _getSlideSize());
          TransitionManager.displaySlideAnimation(_previousSlide,
              _currentSlide, _afterSlideDisplayed);
        } else {
          _currentSlide.showSlide(true);
          _api.enableTextSelection();
        }
      }
    }

  };

  /**
   * Populates previous and next slide widgets
   * @param slideIndex the slide index for which previous and next slide
   * widgets to populate
   * @api private
   */
  var _setSlide = function(slideIndex) {
    var currentSlideIndex = _currentSlide.getSlideIndex();

    // Make sure to update pending edits for current slide before we change our
    // focus to other slide. Exception would be the case where requested slide
    // for selection is current slide. In this case thumbnail update would
    // happen after debounce time.
    if (slideIndex !== currentSlideIndex) {
      // TODO (Rahul Tarafdar) Need to cancel debounced function, however, api
      // is missing from current lodash lib. It will be available in coming
      // lodash version. When it is available and we do update lodash, uncomment
      // below line to cancel debounce function when we fix http://crbug/433311
      // IF not cancelled, we may end up in an extra thumbnail update
      //debouncedThumbUpdateFunc_.cancel()
      doThumbUpdate_();
    }

    // do nothing we are at correct slide
    if (currentSlideIndex === slideIndex && !_currentSlide.isEmpty()) {
      return;
    }

    if (_currentSlide.isEmpty() || !_api.isThumbClonedCompletely(slideIndex)) {
      _getThumbnailDataInSlide(slideIndex, _currentSlide);
      _addPrevious(slideIndex);
      _addNext(slideIndex);
    } else {
      /**
       * Navigation can happen in 4 ways
       * 1. step up - navigation to previous slide
       * 2. step down - navigation to next slide
       * 3. jump up - navigation to earlier slide but not sequential previous
       * 4. jump down - navigation to later slide but not sequential next
       *
       * This problem is dealt using strategy pattern, where step up, step down,
       * jump up, and jump down algorithms are clubbed into navigator strategies
       * collection and assigning appropriate strategy dynamically as per
       * navigation.
       */
      var navigator;
      if (currentSlideIndex > slideIndex) {
        // slide up navigation
        if ((currentSlideIndex - slideIndex) > 1) {
          // slide up navigation jump
          navigator = _navigatorStrategies.jumpUp;
        } else {
          // slide up navigation step
          navigator = _navigatorStrategies.stepUp;
        }
      } else if (currentSlideIndex < slideIndex) {
        // slide down navigation
        if ((slideIndex - currentSlideIndex) > 1) {
          // slide down navigation jump
          navigator = _navigatorStrategies.jumpDown;
        } else {
          // slide down navigation step
          navigator = _navigatorStrategies.stepDown;
        }
      }

      _navigation.toSlide = slideIndex;
      navigator.navigateToSlide(slideIndex);
    }
  };

  /**
   * Clone the thumbnail data into slide widget
   * @param slideIndex - index of slide to be cloned
   * @param slideWidget - the slide widget into which thumbnail data is to be
   * cloned
   */
  var _getThumbnailDataInSlide = function(slideIndex, slideWidget) {
    var slideNode = slideWidget.innerNode();

    var thumb = ThumbnailStrip.thumbnail(slideIndex);
    if (thumb) {
      slideWidget.empty();
      slideWidget.setSlideIndex(slideIndex);
      var thumbNode = thumb.innerNode();
      if (thumbNode.hasChildNodes()) {
        LayoutsManager.cloneSlide(thumbNode, slideNode, slideIndex);

        // Removes kTHUMB_ID_PREFIX to the IDs of all the elements inside slide
        slideWidget.changeSlideInnerElementsId();
        slideWidget.handleParentShapes();
      }
    }
  };

  /**
   * Gets slide number of div which is provided
   * @param slideWidget {widget} slide widget
   */
  var _getSlideId = function(slideWidget){
    var slideNode = slideWidget.innerNode().parentNode;

    return slideNode ? parseInt(slideNode.id.split("-")[3], 10) : undefined;
  };

  /**
   * @api private
   */
  var _api = {

    /**
     * Initialisation method that is called on construction of the widget.
     * This method should cause no HTML render tree relayouts to occur.
     * @api public
     */
    init: function() {
      if (_slidesContainerNode) {
              throw new Error('slidesContainer.init() called multiple times.');
      }
      _slidesContainerNode = document.createElement(_kSlidesContainer_Node.Tag);
      _slidesContainerNode.id = _kSlidesContainer_Node.Class;
      _slidesContainerNode.className = _kSlidesContainer_Node.Class;

      _slidesZoomContainerNode =
          document.createElement(_kSlidesZoomContainer_Node.Tag);
      _slidesZoomContainerNode.id = _kSlidesZoomContainer_Node.Class;
      _slidesZoomContainerNode.className = _kSlidesZoomContainer_Node.Class;
      _slidesContainerNode.appendChild(_slidesZoomContainerNode);

      _toast = document.createElement('paper-toast');
      _slidesContainerNode.appendChild(_toast);

      /*
       * Instantiate previous slide, current slide and next slide widgets
       * We are creating only three slide widgets in the main slide view.
       * 1. previous slide
       * 2. current slide
       * 3. next slide
       * For creating slide widgets there is no need to send the 'slideIndex'
       * to the constructor, since slideIndex is used to dispatch events only
       * incase of thumbnail creation.
       * SlideIndex will be sent only while creating the 'nail' for thumbnails
       * (in thumbNailStrip.js)
       *
       * -1 value depicts that its a placeholder and not a actual slide number
       */
      _previousSlide = Slide.create(EMPTY_SLIDE_INDEX,
          _slidesZoomContainerNode);
      _previousSlide.setLayer(layer.bottom);
      _currentSlide = Slide.create(EMPTY_SLIDE_INDEX,_slidesZoomContainerNode);
      _currentSlide.setLayer(layer.top);
      _api.enableTextSelection();
      _nextSlide = Slide.create(EMPTY_SLIDE_INDEX, _slidesZoomContainerNode);
      _nextSlide.setLayer(layer.middle);
      debouncedThumbUpdateFunc_ = _.debounce(doThumbUpdate_, KDebounce_Wait_,
          false);
      tokenEdit_ = PubSub.subscribe('qowt:ss:editApplied',
          function() {
            thumbnailUpdated_ = false;
            debouncedThumbUpdateFunc_();
          });
      _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
    },

    /**
     * @return {Boolean} Returns true if thumbnail is updated for slide edits,
     *                   else returns false.
     */
    isThumbnailUpdated: function() {
      return thumbnailUpdated_;
    },

    /**
     * Show a toast at location provided.
     *
     * @param {Number} left left of toast
     * @param {Number} top top of toast
     * @param {String} message toast text
     */
    showToast: function(left, top, message) {
      _toast.text = message;
      _toast.style.left = left;
      _toast.style.top = top;
      _toast.show();
    },

    /**
     * Remove the html elements from their parents and destroy all references.
     */
    destroy: function() {

      if (_slidesZoomContainerNode && _slidesZoomContainerNode.parentNode) {
        _slidesZoomContainerNode.parentNode.
          removeChild(_slidesZoomContainerNode);
      }
      if (_slidesContainerNode && _slidesContainerNode.parentNode) {
        _slidesContainerNode.parentNode.removeChild(_slidesContainerNode);
      }
      _reset();
    },
    /**
     * Every widget has an appendTo() method.
     * This is used to attach the HTML elements of the widget to a specified
     * node in the HTML DOM.
     * Here the slides container div element is appended as a child
     * to the specified node.
     *
     * @param node {object} The HTML node that this widget is to attach
     * itself to
     * @method appendTo(node)
     */
    appendTo: function(node) {
      if (node === undefined) {
        throw new Error("appendTo - missing node parameter!");
      }

      if (_slidesContainerNode) {
        node.appendChild(_slidesContainerNode);
      }
    },

    /**
     * Returns the SlidesContainer node.
     *
     * @return element {object} the slides-container HTML element
     * @method node()
     */
    node: function() {
      return _slidesContainerNode;
    },

    /**
     * Set up for slide show.
     * Populates previous and next slide widgets.
     */
    setupForSlideShow: _setupForSlideShow,

    /**
     * Make all slides widgets empty viz. previous, current, and next
     */
    emptySlidesContainer: function() {
      _currentSlide.empty();
      _previousSlide.empty();
      _nextSlide.empty();
    },

    /**
     * Get current slide widget.
     */
    getCurrentSlideWidget: function() {
      return _currentSlide;
    },

    /**
     * Get previous slide widget.
     */
    getPreviousSlideWidget: function() {
      return _previousSlide;
    },

    /**
     * Get next slide widget.
     */
    getNextSlideWidget: function() {
      return _nextSlide;
    },

    /**
     * Gets slides zoom container node
     * @return {DOM} HTML div of slides zoom container
     */
    getSlidesZoomContainerNode: function() {
      return _slidesZoomContainerNode;
    },

    /**
     * Set slide in current slide widget for given slide index.
     *
     * @param slideIndex - index of current slide
     */
    setSlide: _setSlide,

    /**
     * Empties the currentSlide forcing it to re-render.
     * @param {Number} slideIndex - index of slide to be cleared.
     */
    clearSlideContainer: function() {
      _currentSlide.empty();
    },

    /**
     * removes the webkit shadow from the div when slide show mode is on
     * and re attaches it when slide show mode is exited
     */
    toggleShadow: function() {
      var slidesArr = [_previousSlide, _currentSlide, _nextSlide];
      for (var i = 0; i < slidesArr.length; i++) {
        var slide = slidesArr[i].node();
        if (slide.classList.contains("qowt-point-slide-shadow")) {
          slide.classList.remove("qowt-point-slide-shadow");
        }
        else {
          slide.classList.add("qowt-point-slide-shadow");
        }
      }
    },

    /**
     * Gets the slide container height.
     * WARNING: Calling this method causes a relayout of
     * the HTML DOM render tree!
     *
     * @return {integer} The height
     * @method height()
     */
    height: function() {
      return _slidesContainerNode.offsetHeight;
    },

    /**
     * Sets the slide container height.
     *
     * @param height {integer} The height
     * @method setHeight(height)
     */
    setHeight: function(height) {
      _slidesContainerNode.style.height = height + "px";
    },

    /**
     * Checks whether all elements from thumb node is cloned to slide.
     * @param slideNumber {integer} index of slide for which thumb node is to be
     *                              checked.
     */
    isThumbClonedCompletely: function(slideNumber) {
      var thumb = ThumbnailStrip.thumbnail(slideNumber);
      var slideWidget,
        previousSlideId =_getSlideId(_previousSlide),
        nextSlideId = _getSlideId(_nextSlide);

      if (thumb) {
        var thumbNode = thumb.innerNode();
        if (slideNumber === nextSlideId) {
          slideWidget = _nextSlide;
        } else if (slideNumber === previousSlideId) {
          slideWidget = _previousSlide;
        } else {
          slideWidget = _currentSlide;
        }

        return (thumbNode.childElementCount ===
          slideWidget.innerNode().childElementCount);
      }
    },

    /**
     * Removes already added layout div
     * @param rootEl {DOM} HTML div from which layout div to be deleted
     * @param Id {string} Index of element to be deleted
     */
    removeAddedLayout: function(rootEl, Id) {
      if (rootEl.hasChildNodes()) {
        for (var node = rootEl.firstChild; node; node = node.nextSibling) {
          if (node.id.indexOf(Id) !== -1) {
            rootEl.removeChild(node);
          }
        }
      }
    },

    /**
     * Allow the user to select the text while in non Slideshow mode
     */
    enableTextSelection: function() {
      // For viewer, we need to allow user to select text.
      if (!Features.isEnabled('edit')) {
        _currentSlide.node().classList.add('qowt-selectText');
      }
    },

    /**
     * Disable the text selection in Slideshow mode
     */
    disableTextSelection: function() {
      _currentSlide.node().classList.remove("qowt-selectText");
    }
};

  /**
   * Update thumbnail with edit changes done on slide workspace area.
   * @private
   */
  var doThumbUpdate_ = function() {
    if (!thumbnailUpdated_) {
      var slideIndex = _currentSlide.getSlideIndex();
      var slideNode = _currentSlide.innerNode();

      var thumb = ThumbnailStrip.thumbnail(slideIndex);
      if (_currentSlide && thumb) {
        thumb.empty();
        thumb.setSlideIndex(slideIndex);
        var thumbNode = thumb.innerNode();
        LayoutsManager.cloneSlide(slideNode, thumbNode, slideIndex);

        // add kTHUMB_ID_PREFIX to the IDs of all the elements inside slide
        thumb.changeSlideInnerElementsId();
        // TODO (Rahul Tarafdar) do we need to call below commented method?
        // This was called when we clone from thumb to slide workspace.
        // Currently it does not break any tests and use cases.
        // slideWidget.handleParentShapes();

        // Thumbnail is updated with edit changes done on slide workspace area.
        // Similarly update thumbnail with speaker notes.
        var currentSlideWidget = _api.getCurrentSlideWidget();
        SlideNotes.cloneSpeakerNotesIntoThumbnail(currentSlideWidget);
      }
      thumbnailUpdated_ = true;
    }
  };

  var _reset = function() {
    PubSub.unsubscribe(tokenEdit_);
    PubSub.unsubscribe(_destroyToken);
    tokenEdit_ = undefined;
    debouncedThumbUpdateFunc_ = undefined;
    _destroyToken = undefined;
    _slidesContainerNode = undefined;
    _slidesZoomContainerNode = undefined;
    _previousSlide = undefined;
    _currentSlide = undefined;
    _nextSlide = undefined;
  };

  var _getSlideSize = function() {
    return {
      width: _currentSlide.width(),
      height: _currentSlide.height()
    };
  };

  return _api;
});
