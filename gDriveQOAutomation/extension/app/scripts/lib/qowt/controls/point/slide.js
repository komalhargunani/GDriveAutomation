// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Slide control would be responsible for handling different
 * behaviors of slide e.g. slide Default behavior for viewer and editor.
 * And add shape behavior that can added and removed using this control.
 * TODO (bhushan.shitole): Currently slide related DOM events are directly
 * managed by slidesContainer widget, we are migrating it from slidesContainer
 * widget to this control as and when required.
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */
define([
  'qowtRoot/controls/point/animation/animationRequestHandler',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/models/point',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/drawing/ghostShape',
  'qowtRoot/features/utils',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/accessibilityUtils',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/point/dragBuilder',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/widgets/shape/shapeTextBody',
  'qowtRoot/widgets/shape/moveShapeDragHandler',
  'qowtRoot/widgets/shape/resizeShapeDragHandler',
  'qowtRoot/models/transientAction',
  'qowtRoot/widgets/drawing/addShapeDragHandler',
  'third_party/lo-dash/lo-dash.min'
], function(
    AnimationRequestHandler,
    QOWTSilentError,
    ErrorCatcher,
    PointModel,
    SlidesContainer,
    PubSub,
    GhostShape,
    Features,
    DomListener,
    AccessibilityUtils,
    NavigationUtils,
    I18n,
    TypeUtils,
    SelectionManager,
    WidgetFactory,
    DragBuilder,
    ThumbnailStrip,
    ShapeTextBodyWidget,
    MoveShapeDragHandler,
    ResizeShapeDragHandler,
    TransientActionModel,
    AddShapeDragHandler) {

  'use strict';

  var _slidesContainerNode, _disableToken, slideSelectionToken_,
      _slideShowStartedToken, _slideShowStoppedToken;

  var _api = {
    /**
     * Function to initialize slide and sets up all the listeners
     */
    init: function() {
      if (_disableToken) {
        throw new Error('slideControl.init() called multiple times.');
      }
      SlidesContainer.init();
      _slidesContainerNode = SlidesContainer.node();
      if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
        GhostShape.init();
        GhostShape.appendTo(_slidesContainerNode);
      }
      _slidesContainerNode.addEventListener('mouseenter',
          slideContainerMouseEnterListener_, false);
      _slidesContainerNode.addEventListener('mousedown',
          slideContainerMouseDownListener_, false);
      _slidesContainerNode.addEventListener('click',
          slideContainerClickListener_, false);
      document.addEventListener('keydown', handleKeyEvent_, true);
      var slideContainer = document.getElementById('qowt-point-presentation');
      DomListener.addListener(slideContainer, 'click', _blurToolbar, true);

      _disableToken = PubSub.subscribe('qowt:disable', _disable);
      slideSelectionToken_ = PubSub.subscribe('qowt:clearSlideSelection',
          _clearSelection);
    },

    /**
     * Append this control to the html node passed as argument
     *
     * @param {HTMLElement} node node to append this control to
     */
    appendTo: function(node) {
      SlidesContainer.appendTo(node);
    },

    /**
     * Add listener for an event
     * @param {String} eventName the event name to listen for
     * @param {Function} callback Can be a reference to a function or an
     *     anonymous function object
     */
    addListener: function(eventName, callback) {
      DomListener.addListener(_slidesContainerNode, eventName, callback);
    },

    /**
     * Remove listener for an event
     * @param {String} eventName the event name to listen for
     * @param {Function} callback Can be a reference to a function or an
     *     anonymous function object
     */
    removeListener: function(eventName, callback) {
      DomListener.removeListener(_slidesContainerNode, eventName, callback);
    },
    /**
     * Add mousedown listener to slide note node
     * @param {HTMLElement} slideNoteNode Slide note element
     */
    addListenerToSlideNote: function(slideNoteNode) {
      slideNoteNode.addEventListener('mousedown',
          slideContainerMouseDownListener_, false);
    }
  };

  /**
   * Clear the selection of any selected shapes/textboxes on the slide.
   * @private
   */
  var _clearSelection = function() {
    var selection = SelectionManager.getSelection();
    while(selection && (selection.contentType === 'shape' ||
      selection.contentType === 'text')) {
      switch (selection.contentType) {
        case 'shape':
          var shape = WidgetFactory.create({fromNode: selection.scope});
          shape.deselect();
          break;
        case 'text':
          var textbox = ShapeTextBodyWidget.create(
            {fromNode: selection.scope});
          textbox.deactivate();
          break;
      }
      selection = SelectionManager.getSelection();
    }
  };

  /**
   * disable the module
   * @private
   */
  var _disable = function() {
    PubSub.unsubscribe(_disableToken);
    PubSub.unsubscribe(_slideShowStartedToken);
    PubSub.unsubscribe(_slideShowStoppedToken);
    PubSub.unsubscribe(slideSelectionToken_);
    _disableToken = undefined;
    _slideShowStartedToken = undefined;
    _slideShowStoppedToken = undefined;
    slideSelectionToken_ = undefined;
    _slidesContainerNode = undefined;
  };

  /**
   * Checks div type validation
   * @param {String} divType type of node
   * @private
   */
  function isNotRootNode_(divType) {
    if (divType !== 'shape' && divType !== 'slide' && divType !== 'grFrm' &&
        divType !== 'textBox' && divType !== 'slideNotes') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets manipulated div as per div type.
   * @param {Node} target HTML div
   * @return {Node} manipulated div
   * @private
   */
  function getSelectedNode_(target) {
    var divType = target.getAttribute('qowt-divtype');
    while (isNotRootNode_(divType)) {
      target = target.parentElement;
      //if target is null then we have travelled up in DOM hierarchy and
      //we were at peak, so do nothing and return
      if (target === null) {
        // here, we are not able to manipulate target based on qowt-divtype so
        // clear selection and return.
        return undefined;
      }
      divType = target.getAttribute('qowt-divtype');
    }
    return target;
  }

  /**
   * Checks clicked shape is within group shape or not.
   * @param {Node} node shape div node.
   * @return {boolean} true if shape is within group shape, false otherwise.
   * @private
   */
  function isShapeWithinGroupShape_(node) {
    if (node && node.parentNode) {
      var divType = node.parentNode.getAttribute('qowt-divtype');
      if (divType === 'groupShape') {
        return true;
      }
    }
    return false;
  }

  /**
   * Listens to the 'mouse enter' event on slide-container.
   * @private
   */
  function slideContainerMouseEnterListener_() {
    var transientAction = TransientActionModel.getPendingTransientActions();
    if (transientAction.action === 'initAddShape' &&
        !PointModel.slideShowMode) {
      _slidesContainerNode.style.cursor = 'crosshair';
    } else {
      _slidesContainerNode.style.cursor = 'default';
    }
  }

  /**
   * Listens to the 'mouse down' event on slide-container.
   * @param {object} event information about mouse down event
   * @private
   */
  function slideContainerMouseDownListener_(event) {
    // If we are in slide show mode, selection is not expected, so simply ignore
    // the mouse down events. The progression to next slide is handled on click
    // events now.

    // Enable selection/dragging only if editing is enabled
    // TODO (bhushan.shitole): Remove this condition once we have a standard
    // point editor.

    if (Features.isEnabled('edit') && Features.isEnabled('pointEdit') &&
        !PointModel.slideShowMode) {
      var transientAction = TransientActionModel.getPendingTransientActions();
      if (transientAction.action === 'initAddShape') {
        var transientContext = transientAction.context;
        if (transientContext && transientContext.prstId) {
          PubSub.publish('qowt:clearSlideSelection');
          PubSub.publish('qowt:requestFocus', {contentType: 'slide'});

          transientContext.isTxtBox = transientContext.isTxtBox ?
              transientContext.isTxtBox : false;
          var handler = new AddShapeDragHandler(_slidesContainerNode,
              transientContext, TransientActionModel.clearTransientValues);
          var kPixelsSq = 3;
          /* amount of motion to consider it a drag */
          var dragBuilder = new DragBuilder(_slidesContainerNode, handler,
              kPixelsSq);
          dragBuilder.build()(event);
        }
      } else {
        var slideClickNode = event.target;
        if (slideClickNode) {
          var targetObject = getSelectedNode_(slideClickNode);
          if (targetObject) {
            PubSub.publish('qowt:clearSlideSelection');
            PubSub.publish('qowt:requestFocus', {contentType: 'slide'});

            var divType = targetObject.getAttribute('qowt-divtype');
            if (!isShapeWithinGroupShape_(targetObject)) {
              handleMouseDownShape_(event, targetObject, divType);
            }
          }
        }
      }
    }
  }

  /**
   * Selects a shape.
   * @param {object} event the mouse down event.
   * @param {Node} node shape div node.
   * @param {String} divType the divType of the target
   * @private
   */
  function handleMouseDownShape_(event, node, divType) {
    var selectable, currentSlideWidget;

    switch (divType) {
      case 'slideNotes':
        var notesTextBody = node.querySelector('[qowt-divtype="textBox"]');
        if (!notesTextBody) {

          var slideNotesDiv = node.getElementById('slide-notes-div');

          currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
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
        }
        break;
      case 'grFrm': // Chart
      case 'shape':
        // Select the shape
        selectable = WidgetFactory.create({fromNode: node});
        if (selectable && TypeUtils.isFunction(selectable.select)) {
          selectable.select();
        }
        var kPixelsSq = 3; /* amount of motion to consider it a drag */
        var handler, dragBuilder;
        // if mouseDown on any location handler then add resize drag handler
        // else add move drag handler.
        currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
        var currentSlideNode = currentSlideWidget.node();
        if (event.target && event.target.hasAttribute('location')) {
          handler = new ResizeShapeDragHandler(selectable, currentSlideNode);
        } else {
          handler = new MoveShapeDragHandler(selectable, currentSlideNode);
        }
        dragBuilder = new DragBuilder(_slidesContainerNode, handler, kPixelsSq);
        dragBuilder.build()(event);
        break;
      case 'textBox':
        // Select text body container
        var selectableNode = getSelectedNode_(node.parentNode);
        selectable = WidgetFactory.create({fromNode: selectableNode});
        if (selectable && TypeUtils.isFunction(selectable.select)) {
          selectable.select();
        }

        // Activate text body
        var textBody = WidgetFactory.create({fromNode: node});
        if (textBody && TypeUtils.isFunction(textBody.activate)) {
          textBody.activate();
        }
    }

    AccessibilityUtils.updateFocusedElementInPoint();

    return;
  }

  /**
   * Listens to the 'click' event on slide-container.
   * @param {object} event Click Event.
   * @private
   */
  function slideContainerClickListener_(event) {
    var isViewer = !(Features.isEnabled('edit') &&
        Features.isEnabled('pointEdit'));

    var lnk = _.isFunction(event.target.getLink) ? event.target.getLink() :
        undefined;
    // If link is clicked in viewer or slideshow mode follow link
    if (lnk !== undefined && (isViewer || PointModel.slideShowMode)) {
      if (isSupportedLink_(lnk)) {
        window.open(lnk, '_blank');
      } else {
        SlidesContainer.showToast(event.x, event.y,
            I18n.getMessage('unsupported_link_message'));
      }
    }

    // If the click is in slideshow mode, but not on a link then switch slides.
    if (!lnk && PointModel.slideShowMode) {
      // If we are in slide show mode, a click advances through slides.
      var slideIndex = ThumbnailStrip.selectedIndex();
      // Play animations for an onClick event
      if (AnimationRequestHandler.isAnimationToBePlayed(slideIndex)) {
        AnimationRequestHandler.playOnClick();
      } else {
        executeThumbnailSelection_(slideIndex + 1);
      }
    }
  }

  var kKeyCodeLeft_ = 37,
      kKeyCodeUp_ = 38,
      kKeyCodeDown_ = 40,
      kKeyCodeRight_ = 39,
      kKeyCodeSpace_ = 32,
      kKeyCodeBackspace_ = 8,
      kKeyCodeDelete_ = 46;

  /**
   * Moves slides by keyboard keys.
   * @param {object} event Key Down Event.
   *
   * @private
   */
  function handleSlideNavigation_(event) {
    var _selectedItem = ThumbnailStrip.selectedIndex();
    switch (event.keyCode) {
      case kKeyCodeUp_:
      case kKeyCodeLeft_:
        executeThumbnailSelection_(_selectedItem - 1, event);
        event.preventDefault();
        break;
      case kKeyCodeDown_:
      case kKeyCodeRight_:
        executeThumbnailSelection_(_selectedItem + 1, event);
        event.preventDefault();
        break;
      case kKeyCodeSpace_:
      case kKeyCodeBackspace_:
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  /**
   * Determines whether the current link is supported by our application or not.
   * @param {String} link - the hyperlink
   * @return {boolean} whether the link is supported or not
   * @private
   */
  function isSupportedLink_(link) {
    return !link.match(/^ppt\/slides|^file:|^..\/|^ppaction:\/\/|.exe$|.pptx$/);
  }

  /**
   * Moves shape by keyboard keys
   * @param {object} event Key Down Event.
   *
   * @private
   */
  function shapeMoveByKeys_(event) {
    // Disable shape move in slide show mode
    if (!PointModel.slideShowMode) {
      var property, operand;
      switch (event.keyCode) {
        case kKeyCodeLeft_:
          property = 'x';
          operand = -1;
          break;
        case kKeyCodeDown_:
          property = 'y';
          operand = 1;
          break;
        case kKeyCodeRight_:
          property = 'x';
          operand = 1;
          break;
        case kKeyCodeUp_:
          property = 'y';
          operand = -1;
          break;
        default:
          return;
      }

      var selection = SelectionManager.getSelection();
      var shapeNode = selection.scope;
      if (shapeNode) {
        var shapeWidget = WidgetFactory.create({fromNode: shapeNode});
        var offsets = shapeWidget.getOffsets();

        var currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
        var currentSlideIndex = currentSlideWidget.getSlideIndex();

        // in MS-point, if shape move is done by key then difference between
        // old and new offsets of shape is 82296 emu
        var kDEFAULT_DISTANCE = 82296;
        offsets[property] = offsets[property] + operand * kDEFAULT_DISTANCE;

        var shapeMovedEventData = {
          action: 'modifyTransform',
          context: {
            command: {
              name: 'modTrfm',
              eid: shapeNode.id,
              xfrm: {
                off: offsets,
                ext: shapeWidget.getExtents(),
                flipH: shapeWidget.isFlippedHorizontal(),
                flipV: shapeWidget.isFlippedVertical()
              },
              sn: currentSlideIndex + 1
            }
          }
        };
        PubSub.publish('qowt:requestAction', shapeMovedEventData);
      } else {
        var silentError = new QOWTSilentError('Selection scope undefined ' +
            'while moving shape in slide');
        ErrorCatcher.handleError(silentError);
      }
    }
  }

  /**
   * Deletes shape by keyboard keys
   * @param {object} event Key Down Event.
   *
   * @private
   */
  function shapeDeleteByKeys_(event) {
    // Disable shape delete in slide show mode
    if (!PointModel.slideShowMode) {
      if (event.keyCode === kKeyCodeBackspace_ ||
          event.keyCode === kKeyCodeDelete_) {
        event.preventDefault();
        var selection = SelectionManager.getSelection();
        var shapeNode = selection.scope;
        if (shapeNode) {
          //TODO:(pankaj.avhad) Disabling deletion of charts for now.
          //Need to remove this when we start supporting deletion of charts.
          if (shapeNode.getAttribute('qowt-divtype') !== 'grFrm') {
            var deleteShapeAction = {
              action: 'deleteShape',
              context: {
                'command': {
                  eid: shapeNode.id
                }
              }
            };
            PubSub.publish('qowt:requestAction', deleteShapeAction);
          }
        } else {
          var silentError = new QOWTSilentError('Selection scope undefined ' +
              'while deleting shape in slide');
          ErrorCatcher.handleError(silentError);
        }
      }
    }
  }

  function _blurToolbar() {
    PubSub.publish('qowt:blurMaintoolbar');
  }

  /**
   * Key handler for slide default behaviour
   * @param {KeyEvent} evt
   * @private
   */
  function handleKeyEvent_(evt) {
    // TODO: Need to find a better solution for handling events on the target
    // element. For now this is done because currently slide is
    // capturing keydown events on document, which is preventing events to
    // children. So even if the target is mainToolbar the keydown event is also
    // listened on slide. Therefore ignoring keydown events if the target is
    // mainToolbar.
    if (evt && (NavigationUtils.isTargetWithinMainToolbar(evt.target))) {
      return;
    }
    if (evt.keyCode) {
      var selection = SelectionManager.getSelection();
      var contentType = selection && selection.contentType;
      switch (contentType) {
        case 'slide':
          handleSlideNavigation_(evt);
          break;
        case 'shape':
          shapeMoveByKeys_(evt);
          shapeDeleteByKeys_(evt);
          break;
        default: break;
      }
    }
  }

  /**
   * Publish selection events for thumbnail.
   * @param {Number} index index of thumbnail to be selected
   * @private
   */
  function executeThumbnailSelection_(index) {
    var _contextData = {
      action: 'slideSelect',
      context: {
        contentType: 'slideManagement',
        index: index
      }
    };
    PubSub.publish('qowt:doAction', _contextData);
  }

  return _api;
});
