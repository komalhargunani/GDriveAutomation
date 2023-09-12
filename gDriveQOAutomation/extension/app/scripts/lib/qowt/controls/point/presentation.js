/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Constructor for the Presentation Layout Control.
 *
 * The presentation layout control has a number of widgets,
 * each of which encapsulates an area of the HTML DOM
 * that represents the workbook on screen:
 *
 * - The ThumbnailStrip widget - which holds thumbnail widgets for the preso
 * - The SlideContainer widget - which holds the slide widget to show current
 *    slide in the preso
 * - The SlideNotes widget - which shows the slide note text
 *
 * You just construct the control by giving it a root node.
 * The control constructs the widgets it needs.
 * Once the presentation is opened ('qowt:pptOpened'), the control starts
 * loading the first set of thumbs (PointConfig.THUMBNAILS_TO_LOAD tells how
 * many thumbs).
 * The control clones a thumb to the slide container when you send an event
 * 'qowt:pointSetSlide' with correct slidenumber. The control listens to the
 * event 'scroll' and makes sure that the correct thumbs are loaded at any given
 * time.
 */
define([
  'common/correction/selectionCorrection',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/widgets/point/slidenotes',
  'qowtRoot/controls/point/thumbnailStrip',
  'qowtRoot/controls/point/animation/transitionManager',
  'qowtRoot/controls/point/animation/animationRequestHandler',
  'qowtRoot/features/utils',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/accessibilityUtils',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/models/point',
  'qowtRoot/models/env',
  'qowtRoot/api/pointAPI',
  'qowtRoot/variants/configs/point',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/widgets/point/slideNotesSplitter',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/presentation/slideZoomManager',
  'qowtRoot/controls/point/slide',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/domUtils',
  'qowtRoot/models/transientFormatting',
  'utils/analytics/presentationMetaDataLogger',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/widgets/shape/shapeTextBody',
], function(
    SelectionCorrection,
    PubSub,
    ThumbnailStrip,
    SlidesContainer,
    SlideNotes,
    ThumbnailStripControl,
    TransitionManager,
    AnimationRequestHandler,
    Features,
    DomListener,
    AccessibilityUtils,
    NavigationUtils,
    PointModel,
    EnvModel,
    PointAPI,
    PointConfig,
    SelectionManager,
    SlideNotesSplitter,
    LayoutsManager,
    SlideZoomManager,
    SlideControl,
    DeprecatedUtils,
    DomTextSelection,
    DomUtils,
    TransientFormattingModel,
    PresentationMetaDataLogger,
    ShapeWidget,
    ShapeTextBodyWidget) {

  'use strict';

  var _viewportHeight, //stores the viewport height, used when resizing and
                      // dragging the slide notes splitter
      _disableToken,
      _destroyToken,
      _formattingChangedToken,
      _pointSetSlideToken,
      _slideShowStoppedToken,
      _pointclearSlideContainerToken,
      _cmdopenPresentationStopToken,
      _cmdgetStylesStopToken,
      _editEnabledToken,
      _editDisabledToken,
      _deleteTextToken,
      _slideNotesSplitterHeight; //stores the slide notes splitter height

  var _kKeyCodeLeft = 37,
      _kKeyCodeUp = 38,
      _kKeyCodeDown = 40,
      _kKeyCodeRight = 39,
      _kKeyCodeBackspace = 8,
      _kKeyCodeSpace = 32,
      _kKeyCodeTab = 9,
      _kKeyCodeEnter = 13;

  var _editLocked = false;

  var _preSlideShowModeZoomLevel;

  var _slideProcessingCount = 0;

  /**
   * Api for transition manager
   * Helps transition manager for entering in and exiting from slide show mode
   */
  var _slideShowMode = {

    /**
     * append this control to the given node
     *
     * @param node {HTMLElement} element to which we should append ourselves
     */
    appendTo: function(node) {
      node.appendChild(_containerDivs.presentation);
    },

    /**
     * function to initialise and set up this presentation layout
     * control singleton.
     * Constructs all the required DIVs and sets up all the listeners
     *
     */
    init: function() {
      _init();
    },

    /**
     * Enters presentation widget into slide show mode.
     * Mostly UI wise changes are made.
     */
    enter: function() {
      // TODO (pankaj.avhad): Remove this condition once we have a standard
      // point editor.
      if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
        // Before entering slide show mode, we have to stop observing
        // slide mutations.
        PubSub.publish('qowt:stopObservingSlideMutations', {});
      }
      Features.disable('edit');
      SlidesContainer.toggleShadow();
      SlidesContainer.disableTextSelection();
    },

    /**
     * Exits presentation widget from slide show mode.
     * Mostly UI wise changes are reverted which are done by
     * _slideShowMode.enter() method.
     */
    exit: function() {
      // if we had any preserved selection and show it
      Features.enable('edit');
      // TODO (pankaj.avhad): Remove this condition once we have a standard
      // point editor.
      if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
        // After exiting the slide show mode, we have to start observing
        // slide mutations.
        PubSub.publish('qowt:startObservingSlideMutations', {});
      }
      AnimationRequestHandler.cleanUp();
      SlidesContainer.toggleShadow();
      SlidesContainer.enableTextSelection();
    }
  };

  var _slideShow = {

    /**
     * Starts slide show
     */
    start: function() {
      PointModel.slideShowMode = true;

      //TODO: currently handling of key events for animation is in
      // thumbnailStripControl. Hence, we need to activate thumbnailStripTool
      // to activate those key listeners. This handling needs to be separated
      // out from thumbnailStripControl and moved to a more appropriate place.
      PubSub.publish('qowt:requestFocus', {contentType: 'slideManagement',
        index: ThumbnailStrip.selectedIndex()});

      SlidesContainer.node().style.backgroundColor = "black";
      TransitionManager.ready();


      _preSlideShowModeZoomLevel = PointConfig.ZOOM.current;
      SlideZoomManager.actualSize();

      SlidesContainer.setupForSlideShow();
    },

    /**
     * Stops slide show
     */
    stop: function() {
      PointModel.slideShowMode = false;

      SlidesContainer.node().style.backgroundColor = "";
      TransitionManager.stop();

      SlideZoomManager.setZoom(_preSlideShowModeZoomLevel);
    }
  };

  var _events = {
    slideLoaded: 'qowt:slideLoaded',
    pointSetSlide: 'qowt:pointSetSlide',
    clearSlideContainer: 'qowt:clearSlideContainer',
    cmdopenPresentationStop: 'qowt:cmdopenPresentationStop',
    cmdgetStylesStop: 'qowt:cmdgetStylesStop'
  };

  var _api = {
    /**
     * function to initialise and set up this presentation layout
     * control singleton.
     * Constructs all the required DIVs and sets up all the listeners
     *
     */
    init: function(node) {
      if (_disableToken) {
        throw new Error('presentation.init() called multiple times.');
      }
      _init(node);
      _disableToken = PubSub.subscribe('qowt:disable', _disable);
      _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
    },
    /**
     * Remove the html elements from their parents and destroy all references.
     */
    destroy: function() {
      if (_containerDivs.thumbs && _containerDivs.thumbs.parentNode) {
        _containerDivs.thumbs.parentNode.removeChild(_containerDivs.thumbs);
      }
      if (_containerDivs.main && _containerDivs.main.parentNode) {
        _containerDivs.main.parentNode.removeChild(_containerDivs.main);
      }
      if (_containerDivs.presentation &&
          _containerDivs.presentation.parentNode) {
        _containerDivs.presentation.parentNode.removeChild(_containerDivs.
            presentation);
      }
      _disable();
    },
    /**
     * Append this control to the html node passed as argument
     *
     * @param node {HTMLElement} node to append this control to
     */
    appendTo: function(node) {
      if (node === undefined) {
        throw new Error("Presentation - missing node parameter!");
      }
      node.appendChild(_containerDivs.presentation);
    },

    /**
     * This function allows us to toggle in to fullScreen
     */
    toggleFullScreen: function() {
      if (document.fullScreenElement || !document.webkitIsFullScreen) {
        var slidesContainerNode = SlidesContainer.node();
        if (slidesContainerNode.requestFullScreen) {
          slidesContainerNode.requestFullScreen();
        } else if (slidesContainerNode.webkitRequestFullScreen) {
          slidesContainerNode.webkitRequestFullScreen(Element.
              ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },

    slideShow: _slideShow,

    //TODO why this introduced here? only to write test cases?
    slideShowMode: _slideShowMode,

    /**
     * Calculates the thumbnails window size relative to the window.innerHeight.
     * Called when loading a presentation and when resizing the browser.
     *
     * @method calculateThumbnailsWindow
     */
    calculateThumbnailsWindow: function() {
      PointConfig.THUMBNAILS_TO_LOAD = Math.
          ceil(window.innerHeight / _thumbHeight) + PointConfig.
              kTHUMBNAILS_EXTRA_BUFFER;
    },

    /**
     * Gets the index of the current active slide.
     *
     * @return {integer} index of currently active slide.
     */
    getCurrentSlideIndex: function() {
      var currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
      return currentSlideWidget.getSlideIndex();
    },

    /**
     * Duplicates given slides and selects the duplicated slides.
     *
     * @param {Array} slides slide indices to be duplicated
     */
    duplicateSlides: function(slides) {
      // Get the maximum of the indices selected and start adding slides from
      // that position. Since the array is already sorted in ascending order,
      // the last slide in the array has the highest index.
      var indexToInsert = parseInt(slides[slides.length - 1], 10);
      var meta = false;
      for (var i = 0; i < slides.length; i++, indexToInsert++) {
        insertSlide_(indexToInsert);

        if (i !== 0) {
          meta = true;
        } else {
          PubSub.publish('qowt:clearSlideSelection');
        }
        selectSlide_(indexToInsert, meta);
      }
    },

    /**
     * Inserts a thumb node at specified index and selects the thumbnail
     * @param {Number} index index at which slide has to be inserted (0 base).
     */
    insertSlide: function(index) {
      insertSlide_(index);
      PubSub.publish('qowt:clearSlideSelection');
      selectSlide_(index);
    }
  };

  /**
   * Inserts a new thumbnail node at the specified index and calls service to
   * fetch data for the slide.
   * @param {Number} index index at which slide has to be inserted (0 base).
   * @private
   */
  var insertSlide_ = function(index) {
    ThumbnailStrip.insertSlide(index);

    PointModel.numberOfSlidesInPreso++;

    //Update total number of thumbnails.
    PubSub.publish('qowt:updateThumbCount', {
      thumbCount: PointModel.numberOfSlidesInPreso - 1
    });
  };

  /**
   * Selects the slide at the specified index
   * @param {Number} index index of the slide to be selected
   * @param {Boolean} meta determines whether the slide has to be added to the
   *                       existing selection (multi-select) or not
   *                       (single selection)
   * @private
   */
  var selectSlide_ = function(index, meta) {
    PubSub.publish('qowt:requestAction', {
      action: 'slideSelect',
      context: {
        contentType: 'slideManagement',
        index: index,
        meta: meta,
        shift: false,
        type: 'click'
      }
    });
  };

  /**
   * Handler for 'qowt:disable' signal.
   * Removes all the listeners and resets all variables.
   * @private
   */
  var _disable = function() {
    DomListener.removeGroup('presentation');
    PubSub.unsubscribe(_disableToken);
    PubSub.unsubscribe(_destroyToken);
    PubSub.unsubscribe(_formattingChangedToken);
    PubSub.unsubscribe(_pointSetSlideToken);
    PubSub.unsubscribe(_slideShowStoppedToken);
    PubSub.unsubscribe(_pointclearSlideContainerToken);
    PubSub.unsubscribe(_cmdopenPresentationStopToken);
    PubSub.unsubscribe(_cmdgetStylesStopToken);
    PubSub.unsubscribe(_editEnabledToken);
    PubSub.unsubscribe(_editDisabledToken);
    PubSub.unsubscribe(_deleteTextToken);

    _containerDivs.thumbs = undefined;
    _containerDivs.main = undefined;
    _containerDivs.presentation = undefined;
    _disableToken = undefined;
    _destroyToken = undefined;
    _formattingChangedToken = undefined;
    _pointSetSlideToken = undefined;
    _slideShowStoppedToken = undefined;
    _pointclearSlideContainerToken = undefined;
    _cmdopenPresentationStopToken = undefined;
    _cmdgetStylesStopToken = undefined;
    _editEnabledToken = undefined;
    _editDisabledToken = undefined;
    _deleteTextToken = undefined;
  };

  // Private data
  var _containerDivs = {},
      _thumbHeight = 200,
      // setting a default value
      _scrollerTop = 0;
  /**
   * Clones the given thumbnail into the main slide.
   * Called by the 'qowt:pointSetSlide' event.
   * If the thumbnail is not loaded yet, then this method will start loading
   * the content.
   * If the slide already has some content, then that content is removed.
   * Then the child nodes of the thumb node are cloned to the slide node.
   * Then canvas content is copied from the thumb to the slide.
   *
   * @private
   * @param eventType {String} name of the event triggered
   * @param eventData {JSON} event info
   * @method _handleSetSlide
   */
  var _handleSetSlide = function(eventType, eventData) {
    eventType = eventType || '';
    var slideIndex = eventData.slide;
    // console.log("LayoutControl _handleSetSlide: " + slideIndex);

    // TODO (bhushan.shitole): Remove this condition once we have a standard
    // point editor.
    if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
      // Before setting new slide into slide area, we have to stop observing
      // slide mutations.
      PubSub.publish('qowt:stopObservingSlideMutations', {});
    }

    var thumb = ThumbnailStrip.thumbnail(slideIndex);

    if (thumb) {
      var thumbNode = thumb.innerNode();
      // Calls makeSelectedVisible only if the selected thumb is not fully
      // visibile on the screen i.e. it ends below the bottom of the viewport or
      // it starts above the top of the viewport
      if (((thumbNode.offsetTop + _thumbHeight - _scrollerTop) >
          window.innerHeight) || ((thumbNode.offsetTop - _scrollerTop) < 0)) {
        ThumbnailStrip.makeSelectedVisible();
      }

      //If the current selected slide is not loaded lock the screen
      if (!thumb.isLoaded() && !thumb.isRequested) {
        //Lock the screen until the command is processed
        PubSub.publish('qowt:lockScreen');
        // TODO(elqursh): Should be signaling contentReceived after slide data
        // is received instead of before requesting slide data.
        PubSub.publish('qowt:contentReceived');
        _slideProcessingCount++;
        PointAPI.getSlide(thumbNode, slideIndex + 1);
        thumb.isRequested = true;
      } else {
        //Unlock screen if the set thumb is loaded
        PubSub.publish('qowt:unlockScreen');
      }

      thumb.showSlide(true);
      SlidesContainer.setSlide(slideIndex);

      _removeChilds(SlideNotes.getSlideNotesNode());

      _setSpeakerNotes(slideIndex);
    }

    SlideZoomManager.zoomToFit();

    // TODO (bhushan.shitole): Remove this condition once we have a standard
    // point editor.
    if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
      // After setting new slide into slide area, we have to start observing
      // slide mutations.
      PubSub.publish('qowt:startObservingSlideMutations', {});
    }
  };

  /**
   * Key handler for thumbnail strip.
   * @param {KeyEvent} evt
   * @private
   */
  var _handleKeyDown = function(evt) {
    // TODO: Need to find a better solution for handling events on the target
    // element. For now this is done because currently presentation is
    // capturing keydown events on document, which is preventing events to
    // propagate to its children. So even if the target is mainToolbar the
    // keydown event is also listened on presentation view. Therefore ignoring
    // keydown events if the target is mainToolbar.
    var numberOfThumb = ThumbnailStrip.numOfThumbnails();
    if(numberOfThumb === 0) {
      return;
    }
    var selection = SelectionManager.getSelection();
    var contentType = selection && selection.contentType;
    var _selectedItem = ThumbnailStrip.selectedIndex();
    if (evt && (NavigationUtils.isTargetWithinMainToolbar(evt.target))) {
      return;
    }
    AccessibilityUtils.updateFocusedElementInPoint();
    if(document.getElementsByTagName('dialog').length === 0) {
      if (!NavigationUtils.isTargetWithinMainToolbar(evt.target)) {
        if(evt.keyCode === _kKeyCodeTab && !evt.shiftKey){
        //This section is handling the tab keydown action on Point
          if (document.activeElement.parentElement.id === "slide-notes-div") {
            selection.contentType = "slideManagement";
            return;
          }
          if (_selectedItem !== undefined) {
            _handleTabAction(_selectedItem);
            if(document.activeElement.tagName !== "BODY" &&
                !NavigationUtils.isTargetWithinMainToolbar(evt.target)) {
              evt.preventDefault();
            }
          }
          return;
        }
      }
      //This section is handling the shift+tab keydown action on Point
        if (evt.keyCode === _kKeyCodeTab && evt.shiftKey) {
          if (document.activeElement.id === "qowt-point-thumbnail-strip" ||
              document.activeElement.tagName === "QOWT-POINT-THUMBNAIL") {
            return;
          }
          _handleShiftTabAction(_selectedItem);
          evt.preventDefault();
          return;
        }
    }

    if (evt.keyCode && contentType === 'slideManagement') {
      _selectedItem = ThumbnailStrip.selectedIndex();
      if (!_handleAnimation(evt, _selectedItem)) {
        // If the event is not consumed by animation handler then pass it for
        // edit handling
        if (!_handleEdit(evt)) {
          //If the event is not consumed by edit handler as well then perform
          //selection change on it.
          if (!_handleSelection(evt, _selectedItem)) {
            return;
          }
        }
      }
      // If the event is consumed by any of the above handlers then prevent the
      // default behavior
      evt.preventDefault();
    }
  };

  /**
   * Handle animations based on key events.
   * @param {Object} event Key Down Event.
   * @param {number} selectedIndex currently selected index
   * @return {boolean} true if event has been consumed, false otherwise
   * @private
   */
  var _handleAnimation = function(event, selectedIndex) {
    var isAnimationHandled = false;
    if (PointModel.slideShowMode) {
      switch (event.keyCode) {
        case _kKeyCodeUp:
        case _kKeyCodeLeft:
        case _kKeyCodeBackspace:
          if (AnimationRequestHandler.isPreviousAnimationToBePlayed(
              selectedIndex)) {
            AnimationRequestHandler.goBackInAnimationHistory();
            isAnimationHandled = true;
          }
          break;
        case _kKeyCodeDown:
        case _kKeyCodeRight:
        case _kKeyCodeSpace:
        case _kKeyCodeEnter:
          // Play animations for keydown events. Keydown events are treated as
          // onClick events for animations
          if (AnimationRequestHandler.isAnimationToBePlayed(selectedIndex)) {
            AnimationRequestHandler.playOnClick();
            isAnimationHandled = true;
          }
          break;
        default:
          break;
      }
    }
    return isAnimationHandled;
  };

  /**
   * Handle edit based on key events.
   * @param {Object} event Key Down Event.
   * @return {boolean} true if event has been consumed, false otherwise
   * @private
   */
  var _handleEdit = function(event) {
    var isEditHandled = false;
    if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
      switch (event.keyCode) {
        case _kKeyCodeEnter:
          // Fire insert action
          _executeSlideEdit('insertSlide');
          isEditHandled = true;
          break;
        case _kKeyCodeBackspace:
          // Fire delete action
          _executeSlideEdit('deleteSlide');
          isEditHandled = true;
          break;
        default:
          break;
      }
    }
    return isEditHandled;
  };

  /**
   * Handle selection change based on key events.
   * @param {Object} event Key Down Event.
   * @param {number} selectedIndex currently selected index
   * @return {boolean} true if event has been consumed, false otherwise
   * @private
   */
  var _handleSelection = function(event, selectedIndex) {
    var isSelectionHandled = false;
    // keydown + metaKey/ctrlKey is a shortcut for move slide so we do not need
    // to change selection if metaKey is pressed
    if (!event.metaKey && !event.ctrlKey) {
      switch (event.keyCode) {
        case _kKeyCodeUp:
        case _kKeyCodeLeft:
        case _kKeyCodeBackspace:
          _executeThumbnailSelection(selectedIndex - 1, event);
          isSelectionHandled = true;
          break;
        case _kKeyCodeDown:
        case _kKeyCodeRight:
        case _kKeyCodeSpace:
        case _kKeyCodeEnter:
          _executeThumbnailSelection(selectedIndex + 1, event);
          isSelectionHandled = true;
          break;
        default:
          break;
      }
    }
    return isSelectionHandled;
  };

  var _handleTabAction = function(index) {
  //On tab key press action this function will find the current
  //focused shape and send it for removing the focus and send the
  //next slide element for the focus.
    var currentSlideId = 'qowt-point-slide-' + index;
    var currentSlide = document.getElementById(currentSlideId);
    var currentSelectionArray = currentSlide
      .childNodes[0].childNodes[2].querySelectorAll('qowt-point-shape');
    currentSelectionArray = removeNonClickableSelections(currentSelectionArray);
    var currentSelection = currentSelectionArray[0];
    if(currentSelectionArray.length === 0) {
      if(document.getElementById('slide-notes-div').childNodes.length > 0) {
        var slideNotesData = ShapeTextBodyWidget.create(
          {fromNode: document.getElementById('slide-notes-div')
          .childNodes[0]});
          slideNotesData.deactivate();
          slideNotesData = ShapeTextBodyWidget.create(
            {fromNode: document.getElementById('slide-notes-div')
            .childNodes[0]});
            slideNotesData.activate();
          return;
      } else {
        var targetObject = document.getElementById('slide-notes-div')
          .parentNode;
        setCaretAtSlideNote(targetObject);
        return;
      }
    }
    if (currentSelectionArray.length !== 0) {
      for(var i = 0; i < currentSelectionArray.length; i++) {
          var divType = currentSelectionArray[i].getAttribute('qowt-divtype');
          if(divType === "shape") {
            var config = { fromId: currentSelectionArray[i].model.eid };
            var shapeWidget = ShapeWidget.create(config);
            if (shapeWidget.isSelected()) {
              removeSelectionOfSlideElement();
              if (i + 1 !== currentSelectionArray.length) {
                setSelectionOfSlideElement(currentSelectionArray[i + 1]);
              } else {
                if(document.getElementById('slide-notes-div').childNodes
                    .length > 0) {
                  slideNotesData = ShapeTextBodyWidget.create(
                    {fromNode: document.getElementById('slide-notes-div')
                    .childNodes[0]});
                    slideNotesData.activate();
                } else {
                  targetObject = document.getElementById('slide-notes-div')
                    .parentNode;
                  setCaretAtSlideNote(targetObject);
                }
              }
              return;
            }
          } else if (divType === "tableCell") {
            var textbox = ShapeTextBodyWidget.create(
              {fromNode: currentSelectionArray[i]
                .getElementById('textBox_container').children[0]
              });
            if (textbox.isActive()) {
              removeSelectionOfSlideElement();
              if (i + 1 !== currentSelectionArray.length) {
                setSelectionOfSlideElement(currentSelectionArray[i + 1]);
              } else {
                if(document.getElementById('slide-notes-div').childNodes
                    .length > 0) {
                  slideNotesData = ShapeTextBodyWidget.create(
                    {fromNode: document.getElementById('slide-notes-div')
                    .childNodes[0]});
                  slideNotesData.activate();
                } else {
                  targetObject = document.getElementById('slide-notes-div')
                    .parentNode;
                  setCaretAtSlideNote(targetObject);
                }
              }
              return;
            }
          }
      }
      setSelectionOfSlideElement(currentSelection);
    }
  };

  var _handleShiftTabAction = function(index) {
  //On shift+tab key press action this function will find the current
  //focused shape and send it for removing the focus and send the
  //previous slide element for the focus.
    var currentSlideId = 'qowt-point-slide-'+index;
    var currentSlide = document.getElementById(currentSlideId);
    var currentSelectionArray = currentSlide
      .childNodes[0].childNodes[2].querySelectorAll('qowt-point-shape');
      currentSelectionArray = removeNonClickableSelections
        (currentSelectionArray);
      if (currentSelectionArray.length !== 0) {
        if (document.activeElement.parentElement.id === "slide-notes-div") {
          setSelectionOfSlideElement(currentSelectionArray
            [currentSelectionArray.length - 1]);
            return;
        }
        for(var i = 0; i < currentSelectionArray.length; i++) {
          if (currentSelectionArray.length !== 0) {
            var divType = currentSelectionArray[i]
              .getAttribute('qowt-divtype');
            if(divType === "shape") {
              var config = { fromId: currentSelectionArray[i].model.eid };
              var shapeWidget = ShapeWidget.create(config);
              if (shapeWidget.isSelected()) {
                removeSelectionOfSlideElement();
                if (i !== 0) {
                  setSelectionOfSlideElement(currentSelectionArray[i - 1]);
                } else {
                  PubSub.publish('qowt:clearSlideSelection');
                  PubSub.publish('qowt:requestFocus',
                  {contentType: 'slideManagement',index: index});
                }
                return;
              }
            } else if (divType === "tableCell") {
              var textbox = ShapeTextBodyWidget.create(
                {fromNode: currentSelectionArray[i]
                  .getElementById('textBox_container').children[0]
                });
              if (textbox.isActive()) {
                removeSelectionOfSlideElement();
                if (i !== 0) {
                  setSelectionOfSlideElement(currentSelectionArray[i - 1]);
                } else {
                  PubSub.publish('qowt:clearSlideSelection');
                  PubSub.publish('qowt:requestFocus',
                  {contentType: 'slideManagement',index: index});
                }
                return;
              }
            }
          }
        }
      } else {
        PubSub.publish('qowt:clearSlideSelection');
        PubSub.publish('qowt:requestFocus',
        {contentType: 'slideManagement',index: index});
      }
  };

  var setCaretAtSlideNote = function(node) {
    //In this function if the selection is at the last element of the slide
    //then on next tab the caret should be placed at slide node.
    PubSub.publish('qowt:requestFocus', {contentType: 'slide'});
    var slideNotesDiv = node.getElementById('slide-notes-div');

    var currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
    var currentSlideIndex = currentSlideWidget.getSlideIndex();
    // slide note insertion should be possible only for non empty
    // presentation
    if (ThumbnailStrip.numOfThumbnails() > 0) {
    var insertSlideNoteAction = {
      action: 'insertSlideNote',
      context: {
        'command': {
          sn: currentSlideIndex + 1,
          rootEl: slideNotesDiv.parentNode
        }
      }
    };
    PubSub.publish('qowt:requestAction', insertSlideNoteAction);
    }
  };

  var removeNonClickableSelections = function(currentSelectionArray) {
    //This function will remove the non selectable shapes from the array.
    var validArray = [];
    for( var j = 0; j < currentSelectionArray.length; j++) {
      if (currentSelectionArray[j].model.grpPrp &&
            !currentSelectionArray[j].model.style) {
              validArray.push(currentSelectionArray[j]);
      } else if (!currentSelectionArray[j].model.grpPrp) {
        validArray.push(currentSelectionArray[j]);
      }
    }
    return validArray;
  };

  var removeSelectionOfSlideElement = function() {
    PubSub.publish('qowt:clearSlideSelection');
  };

  var setSelectionOfSlideElement = function(currentSelection) {
  //This function is written to set the focus and place the caret
  //of the required slide element.
    var divType = currentSelection.getAttribute('qowt-divtype');
    if (divType !== "tableCell") {
      var config = { fromId: currentSelection.model.eid };
      var shapeWidget = ShapeWidget.create(config);
      shapeWidget.select();
    }

    if (currentSelection.getElementById('image_container') &&
      currentSelection.getElementById('image_container').children.
      length === 0) {
      if(divType === "shape") {
        if (currentSelection.model.spPr) {
         var size = currentSelection.querySelectorAll('[ismetafile=true]');
         if (size.length === 0 &&
          currentSelection.getElementById('textBox_container').childElementCount
          > 0) {
            var textbox = ShapeTextBodyWidget.create(
              {fromNode: currentSelection
                .getElementById('textBox_container').children[0]
              });
            textbox.activate();
         }
        } else if (currentSelection.getElementById('textBox_container')
        .childElementCount > 0) {
          textbox = ShapeTextBodyWidget.create(
            {fromNode: currentSelection
              .getElementById('textBox_container').children[0]
            });
          textbox.activate();
        }
      } else if (divType === "tableCell") {
        textbox = ShapeTextBodyWidget.create(
          {fromNode: currentSelection
            .getElementById('textBox_container').children[0]
          });
        textbox.activate();
      }
    }
  };

  /**
   * Publish selection events for thumbnail.
   * @param {Number} index index of thumbnail to be selected
   * @param {object} event key down event
   * @private
   */
  var _executeThumbnailSelection = function(index, event) {
    // Activate metaKey for both
    // 1. command key(Mac)
    // 2. control key(Windows/Ubuntu/Chromebook)
    var meta = event.ctrlKey || event.metaKey;

    var _contextData = {
      contentType: 'slideManagement',
      index: index,
      meta: meta,
      shift: event.shiftKey,
      type: event.type,
      keyIdentifier: event.keyIdentifier
    };
    // Clear any selection in slide
    PubSub.publish('qowt:clearSlideSelection');
    PubSub.publish('qowt:requestFocus', _contextData);
  };

  /**
   * Publish slide edit events.
   * @param {string} action slide edit action to be performed.
   * @private
   */
  var _executeSlideEdit = function(action) {
    // If there are no slides in the presentation or edit is locked and user
    // tries to perform any slide edit operation then return.
    if (ThumbnailStrip.numOfThumbnails() !== 0 && !_editLocked) {
      var contextData = {
        action: action,
        context: {
          contentType: 'slideManagement'
        }
      };
      PubSub.publish('qowt:requestAction', contextData);
    }
  };

  /**
   * Set edit disabled and block edit operations driven through the control
   * @private
   */
  var _disableEdit = function() {
    _editLocked = true;
  };

  /**
   * Set edit enabled and unblock edit operations driven through the control
   * @private
   */
  var _enableEdit = function() {
    _editLocked = false;
  };

  /**
   * Fires clearing of the SlidesContainer.
   *
   * @param {String} eventType name of the event triggered.
   * @param {Object} eventData data related to the event that is triggered.
   *
   * @private
   */
  var _handleClearSlideContainer = function(/* eventType, eventData */) {
    PubSub.publish('qowt:stopObservingSlideMutations', {});
    SlidesContainer.clearSlideContainer();

    //Remove speaker notes
    _removeChilds(SlideNotes.getSlideNotesNode());
    PubSub.publish('qowt:startObservingSlideMutations', {});
  };

  /**
   * Loads slides depending on the scroll event.
   * Called by the 'scroll' event.
   * Start the actual slide loading only when the scrolling has finished.
   * @private
   * @method _onThumbnailsScroll
   */
  var _thumbnailsScrollAnimationFrameID;
  var _onThumbnailsScroll = function() {

    if (!_thumbnailsScrollAnimationFrameID) {
      _thumbnailsScrollAnimationFrameID = window.requestAnimationFrame(
          function() {
            _scrollerTop = _containerDivs.thumbs.scrollTop;
            var indexFirstSlide = Math.round(_scrollerTop / _thumbHeight);
            indexFirstSlide = Math.max(indexFirstSlide - 1, 0);
            _loadSlides(indexFirstSlide);

            window.cancelAnimationFrame(_thumbnailsScrollAnimationFrameID);
            _thumbnailsScrollAnimationFrameID = undefined;
          });
    }
  };

  /**
   * called whenever browser window is resized.
   */
  var _handleResize = function() {
    var resizedOffset = window.innerHeight - _viewportHeight;
    _viewportHeight = window.innerHeight;
    // TODO Rahul Remove pointEdit reference once we have a standard point
    // editor.
    if (!PointModel.slideShowMode && Features.isEnabled('edit') &&
        Features.isEnabled('pointEdit')) {
      _viewportHeight = _viewportHeight - PointConfig.MAIN_TOOLBAR_HEIGHT;
    }

    // If slide container has reached min height than shrink the slide notes
    if (SlidesContainer.height() <= PointConfig.
            kNOTES_SPLITTER_CONTAINMENT_TOP && resizedOffset < 0) {
      SlideNotes.setHeight(Math.max(0, SlideNotes.height() + resizedOffset));
    }
    // If slide container hasn't reached min height than shrink or expand the
    // slide container
    else {
      _updateLayout(SlidesContainer.height() + resizedOffset, true);
    }
    SlideZoomManager.zoomToFit();
    _api.calculateThumbnailsWindow();
  };

  /**
   * Updates the layout when resizing or dragging the slide notes splitter.
   * In particular sets: the height of slides container, the height of the slide
   * notes and the top position of the slide notes splitter.
   * @private
   * @param splitterTop {integer} the top position of the slide notes splitter.
   * @param resizing {boolean} true when resizing the browser window, false when
   * dragging the slide notes splitter.
   * @method _updateLayout
   */
  var _updateLayout = function(splitterTop, resizing) {
    // If we are in slide show mode, move the splitter to the bottom of the
    // screen.
    if (PointModel.slideShowMode) {
      splitterTop = _viewportHeight - _slideNotesSplitterHeight;
    }

    // Set the slides container height considering the slide notes area
    var resizedSlidesContainerHeight;
    resizedSlidesContainerHeight = Math.
        max(PointConfig.kNOTES_SPLITTER_CONTAINMENT_TOP,
            Math.min(_viewportHeight - _slideNotesSplitterHeight,
                splitterTop));
    var resizedSlideNotesHeight = _viewportHeight -
        resizedSlidesContainerHeight - _slideNotesSplitterHeight;

    if (resizing === true || PointModel.slideShowMode) {
      SlideNotesSplitter.setTop(resizedSlidesContainerHeight);
    }
    SlideNotes.setHeight(resizedSlideNotesHeight);
    SlidesContainer.setHeight(resizedSlidesContainerHeight);
  };

  /**
   * Starts loading slides from the slide number 'firstSlide'. Hides all the
   * other slides .
   *
   * @private
   * @param firstSlide {integer} the index of slide from which to start loading
   * the slides (loads PointConfig.THUMBNAILS_TO_LOAD slides)
   * @method _loadSlides
   */
  var _loadSlides = function(firstSlide) {

    //var draggedSlideIndex = ToolsManager.exeMethod('getDraggedSlideIndex');
    var initSlideRenderCount = Math.min((firstSlide +
        PointConfig.THUMBNAILS_TO_LOAD), PointModel.numberOfSlidesInPreso);
    var thumb;
    for (var i = firstSlide; i < initSlideRenderCount; i++) {
      thumb = ThumbnailStrip.thumbnail(i);

      if (!thumb.isLoaded() && !thumb.isVisible() && !thumb.isRequested) {
        // loads slides if they are not loaded already
        // TODO(elqursh): Should be signaling contentReceived after slide data
        // is received instead of before requesting slide data.
        PubSub.publish('qowt:contentReceived');
        _slideProcessingCount++;
        thumb.showSlide(true);
        PointAPI.getSlide(thumb.innerNode(), i + 1);
        thumb.isRequested = true;
      } else {
        thumb.showSlide(true);
      }
    }

    for (var ii = 0; ii < firstSlide - 1; ii++) {
      thumb = ThumbnailStrip.thumbnail(ii);
      // Hides thumbs between 0 - firstSlide
      if (thumb.isVisible()) {
        // Doesn't hide the dragged thumbnail
        thumb.showSlide(false);
      }
    }

    for (var iii = (firstSlide + PointConfig.THUMBNAILS_TO_LOAD);
         iii < PointModel.numberOfSlidesInPreso; iii++) {
      thumb = ThumbnailStrip.thumbnail(iii);
      // Hides thumbs after firstSlide + PointConfig.THUMBNAILS_TO_LOAD
      if (thumb.isVisible()) {
        // Doesn't hide the dragged thumbnail
        thumb.showSlide(false);
      }
    }
  };

  /**
   * removes all childNodes of element
   * @param node {DOM}
   */
  var _removeChilds = function(node) {
    var childNodes;
    if (node.hasChildNodes()) {

      childNodes = node.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        node.removeChild(childNodes[i]);
      }
    }
  };

  /**
   * sets current selected slide's speaker notes to speaker notes div
   * @param slideIndex {integer} the index of slide from of which we have to set
   * speaker note
   */
  var _setSpeakerNotes = function(slideIndex) {

    var thumb = ThumbnailStrip.thumbnail(slideIndex);
    var childNodes;

    if (thumb) {
      var thumbNode = thumb.innerNode();
      var slideDiv;

      if (thumbNode.hasChildNodes()) {
        childNodes = thumbNode.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i].getAttribute('qowt-divtype') === 'slide') {
            slideDiv = childNodes[i];
            break;
          }
        }
      }

      if (slideDiv && slideDiv.slidenotes) {
        var slideNoteDiv = slideDiv.slidenotes.firstChild;
        // Cleanup the slide notes area and append the cached fragment for the
        // slide notes.
        var slideNotesContainer = SlideNotes.getSlideNotesNode();
        _removeChilds(slideNotesContainer);

        var clonedNoteDiv = DeprecatedUtils.cloneDiv(slideNoteDiv);

        slideNotesContainer.appendChild(clonedNoteDiv);
        _updateLayout(_viewportHeight - PointConfig.kNOTES_DEFAULT_HEIGHT,
            true);
        slideNotesContainer.scrollIntoView(true);
        SlideNotesSplitter.show(true);
        SlideNotes.showNotes(true);
      } else {
        _removeChilds(SlideNotes.getSlideNotesNode());
      }
    }
  };

  /**
   * Updates the context with latest selection state and scope and does
   * qowt:updateSelection so as to update the selectionManager with it's
   * context.
   * @private
   */
  var _handleSelectionChanged = function() {
    var selection = SelectionManager.getSelection();

    if (selection && selection.contentType === 'text') {
      var context = DomTextSelection.getRange();

      // If selection change is within the same target scope, update the
      // selection.
      if (context.startContainer && context.endContainer &&
          DomUtils.contains(selection.scope, context.startContainer) &&
          DomUtils.contains(selection.scope, context.endContainer)) {

        context.contentType = 'text';
        context.scope = selection.scope;

        PubSub.publish('qowt:updateSelection', context);

        // Use endParaRPr properties as transient formatting.
        var container = context.startContainer;
        if (container instanceof QowtPointPara && container.isEmpty() &&
            container.model && container.model.endParaRPr) {
          var actionData = {
            action: 'endParaRpr',
            context: {formatting: container.model.endParaRPr}
          };
          TransientFormattingModel.update(actionData);
        }
      }
    }
  };

  /**
   * Called by the 'qowt:slideLoaded' event sent when getSlideContent returns
   * with a success.
   * Set _loadedThumbs for that slide as "true".
   *
   * @private
   * @method _handleSlideLoaded(event)
   */
  var _handleSlideLoaded = function(event) {
    if (!event || !event.detail) {
      return;
    }

    // console.log('Slide Loaded : ' + event.detail.sn);

    // getElementById function from qowt-prototypal-define.js is not working
    // properly, it does not return required element when searching recursively,
    // so need to do by following way.
    var thumb = ThumbnailStrip.thumbnail(event.detail.sn - 1);

    if (LayoutsManager.isReRenderingCurrentSlide() === true) {
      PointAPI.getSlide(thumb.innerNode(), event.detail.sn);
      thumb.isRequested = true;
      return;
    }

    // sn starts from 1 but we want the index
    ThumbnailStrip.thumbnail(event.detail.sn - 1).setLoaded(true);

    if (thumb) {

      // Prepends kTHUMB_ID_PREFIX to the IDs of all the elements inside a
      // thumbnail.
      thumb.changeSlideInnerElementsId();
      thumb.handleParentShapes();
      //hide slide-notes div
      var thumbNode = thumb.innerNode();
      var slideNoteDivs = thumbNode.querySelectorAll('[id=' + PointConfig.
          kTHUMB_ID_PREFIX + 'slide-notes-div]');

      if (slideNoteDivs && slideNoteDivs[0]) {
        slideNoteDivs[0].style.display = "none";
      }
    }

    // If the loaded slide is selected, force the update to the slide area.
    if (ThumbnailStrip.selectedIndex() === event.detail.sn - 1) {
      PubSub.publish('qowt:pointSetSlide', { 'slide': event.detail.sn - 1 });
    }

    // Our thumbnail strip is fully populated, which wihout any user interaction
    // means we are done with opening the file and reaching a steady state.
    // We signal that by publishing 'idle'.
    // TODO dskelton: Improve on the assumption that a fully populated thumbnail
    // strip means that the first selected slide has also been rendered in the
    // main slide container.
    _slideProcessingCount--;
    if (_slideProcessingCount === 0) {
      PubSub.publish('qowt:contentComplete');
    }
  };

  /**
   * Called when Get Styles Stop command has completed successfully.
   * Starts the slide loading process.
   *
   * @private
   * @method _createPresentation()
   */
  var _createPresentation = function() {
    ThumbnailStrip.createNumOfThumbs(PointModel.numberOfSlidesInPreso);

    if (ThumbnailStrip.thumbnail(0)) {
      // Set this only if there are slides..
      _thumbHeight = ThumbnailStrip.thumbnail(0).height() + PointConfig.
          kGAP_BETWEEN_THUMBNAILS;
    }

    _api.calculateThumbnailsWindow();

    /* Disabling for now slides reordering
     if (Features.isEnabled('edit')) {
     if (ToolsManager.activeTool !== 'slideManagement') {
     ToolsManager.setActiveTool('slideManagement');
     }
     } */

    _loadSlides(0);
  };

  /**
   * Called when openPresentation command has completed successfully.
   * get the themes and table styles.
   *
   * @param {string} eventType The command event identifier
   * @param {object} eventData The detail of the completed command.
   * @private
   * @method _getStyles()
   */
  var _getStyles = function(eventType, eventData) {
    eventType = eventType || '';
    if (eventData.success && eventData.success === true) {
      PointAPI.getStyles();
    }
  };

  /**
   * initiates the thumbnail strip opened or closed at presentation open
   * @private
   */
  var _initiateThumbnailStrip = function() {
    if (PointConfig.kThumbnailOpenAtStart) {
      _containerDivs.main.className = 'qowt-point-main-container-normal';
      _containerDivs.thumbs.className = 'qowt-point-thumbnails-container' +
          ' qowt-point-thumbnails-container-open';
    } else {
      _containerDivs.main.className = 'qowt-point-main-container-fullscreen';
      _containerDivs.thumbs.className = 'qowt-point-thumbnails-container' +
          ' qowt-point-thumbnails-container-close';
    }
  };

  /**
   * initializes the event-listeners when the presentation-layout is initialized
   * @private
   */
  var _initEvents = function() {
    //TODO: we are listening system evet here, replace it with qowt event which
    // will be dispatched by app layer.
    DomListener.add('presentation', _containerDivs.thumbs, 'scroll',
        _onThumbnailsScroll);
    DomListener.add('presentation', document, 'selectionchange',
        _handleSelectionChanged);
    // TODO(tushar.bende): Remove this when browser selection issue on double
    // click get fix
    var onDoubleClick = SelectionCorrection.doubleClicked.
        bind(SelectionCorrection);
    DomListener.add('presentation', document, 'dblclick',
        onDoubleClick);
    DomListener.add('presentation', EnvModel.rootNode, _events.slideLoaded,
        _handleSlideLoaded);

    // If the formatting of an element has changed it is possible the
    // selection has become invalid so we need to re-handle it.
    // NOTE: For the browser-initiated 'selectionchange' event - that only
    // gets sent at the end of a complete mutation. It is never sent in the
    // middle of a set of mutations. We want the same sort of behaviour for
    // our qowt-initiated 'formattingChanged'. We synthesize this by
    // handling it in another turn. This prevents an otherwise bad situation
    // where it can be broadcast middway through a mutation that ultimately
    // moves focus out of the document and deactivates the Text Tool part-
    // way through processing a mutation. That's a bad thing. Ultimately we
    // only want to respond to formattingChanged signals once a mutation
    // has completed.
    _formattingChangedToken = PubSub.subscribe('qowt:formattingChanged',
        function() {
          window.setTimeout(_handleSelectionChanged, 0);
        });

    _pointSetSlideToken = PubSub.subscribe(_events.pointSetSlide,
        _handleSetSlide);
    _slideShowStoppedToken = PubSub.subscribe('qowt:slideShowStopped',
        _handleResize);
    _pointclearSlideContainerToken = PubSub.subscribe(
        _events.clearSlideContainer, _handleClearSlideContainer);
    _cmdopenPresentationStopToken = PubSub.subscribe(_events.
        cmdopenPresentationStop, _getStyles);
    _cmdgetStylesStopToken = PubSub.subscribe(_events.cmdgetStylesStop,
        _createPresentation);
    _deleteTextToken =
      PubSub.subscribe('qowt:cmddeleteTextStop', _handleSelectionChanged);
    DomListener.add('presentation', document, 'keydown', _handleKeyDown, true);
    _editDisabledToken = PubSub.subscribe('qowt:lockScreen', _disableEdit);
    _editEnabledToken = PubSub.subscribe('qowt:unlockScreen', _enableEdit);
  };

  var _handleSlideNotesSplitter = function() {
    _updateLayout(SlideNotesSplitter.top(), false);
    SlideZoomManager.zoomToFit();
  };

  /**
   * toggles the slide show mode, on -webkitfullscreenchange- event on slide's
   * container.
   */
  var _toggleSlideShowMode = function() {
    if (PointModel.slideShowMode) {
      _slideShow.stop();
      PubSub.publish('qowt:slideShowStopped');
      // slide notes should be visible after leaving presentation mode
      PubSub.publish('qowt:pointSetSlide',
          { 'slide': ThumbnailStrip.selectedIndex() });
    } else {
      PubSub.publish('qowt:slideShowStarted');
      _slideShow.start();
    }
  };

  /**
   * initializes the slides' container.
   */
  var _initializeSlidesContainer = function() {
    // TODO (bhushan.shitole): Currently slide related DOM events are directly
    // managed by slidesContainer widget, we are migrating it from
    // slidesContainer widget to slide control as required.
    SlideControl.init();
    SlideControl.appendTo(_containerDivs.main);
    var slidesContainerNode = SlidesContainer.node();
    slidesContainerNode.addEventListener('webkitfullscreenchange',
        _toggleSlideShowMode, false);
  };

  /**
   * Constructor of the controller.
   * Creates divs and the widgets for Quickpoint.
   * Starts listening to "qowt:pptOpened", "qowt:pointSetSlide", "scroll"
   *
   * @private
   * @method _init
   */
  var _init = function(rootNode) {

    if(!(Features.isEnabled('edit') && Features.isEnabled('pointEdit'))) {
      rootNode.className += ' qowt-uneditable';
    }
    
    _containerDivs.presentation = document.createElement('div');
    _containerDivs.thumbs = document.createElement('div');

    _containerDivs.main = document.createElement('div');

    // set styles that qowt client should not override:
    var s;
    _containerDivs.presentation.id = "qowt-point-presentation";
    _containerDivs.presentation.className = "qowt-root";
    s = _containerDivs.presentation.style;
    s.overflow = 'hidden';

    // Making the spellcheck false for entire presentation by default.
    _containerDivs.presentation.setAttribute('spellcheck', 'false');

    _containerDivs.main.id = "qowt-point-main-container";

    _containerDivs.presentation.appendChild(_containerDivs.thumbs);
    _containerDivs.presentation.appendChild(_containerDivs.main);

    // Add a shortcut for 'acutal size' since it's not explicit in the UI.
    var actualSizeElm = document.createElement('core-keyboard-shortcut');
    actualSizeElm.setAttribute('keycombo', 'CTRL+0');
    actualSizeElm.setAttribute('keycombo-osx', 'CMD+0');
    actualSizeElm.setAttribute('showShortcut', 'false');
    _containerDivs.presentation.appendChild(actualSizeElm);

    // The SlideNotesSplitter widget must be attached to the DOM
    // before jquery accessors are triggered.
    rootNode.appendChild(_containerDivs.presentation);
    _containerDivs.presentation.addEventListener('keyboard-shortcut',
          SlideZoomManager.actualSize);

    EnvModel.rootNode = _containerDivs.presentation;
    EnvModel.rootContentElement = _containerDivs.main;
    EnvModel.pointsPerEm = 12;
    EnvModel.fontUnit = 'em';

    // TODO(jliebrand): Why is the sub/super script size different for word
    // and point?? We no longer have a text decorator, so we should either
    // handle this in pure CSS; or figure out why they are different and make
    // them the same. I suspect they are different to make it look "just right"
    // but that seems wrong...
    // TextDecorator.setPolicy('sub_or_super_script_font_ratio', '70%');

    // Initialize thumbnail strip control
    ThumbnailStripControl.init();
    ThumbnailStripControl.appendTo(_containerDivs.thumbs);
    PresentationMetaDataLogger.init();
    _initializeSlidesContainer();

    SlideNotesSplitter.init(_handleSlideNotesSplitter);
    SlideNotesSplitter.appendTo(_containerDivs.main);
    _slideNotesSplitterHeight = SlideNotesSplitter.height();

    // TODO Remove pointEdit reference once we have a standard point editor.
    if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
      _viewportHeight = window.innerHeight - PointConfig.MAIN_TOOLBAR_HEIGHT;
    } else {
      _viewportHeight = window.innerHeight;
    }

    SlideNotes.init('');
    SlideNotes.appendTo(_containerDivs.main);
    SlideControl.addListenerToSlideNote(SlideNotes.getSlideNotesNode());

    _initiateThumbnailStrip();

    DomListener.add('presentation', window, 'resize', _handleResize);

    // Initialize transition manager with slide show mode API
    TransitionManager.init();
    TransitionManager.setSlideShowAPI(_slideShowMode);

    _initEvents();
  };

  return _api;
});
