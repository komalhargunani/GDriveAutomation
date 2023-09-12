// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The sheet text tool is activated by the sheet selection
 * manager whenever the current selection is the content of a cell.
 * This happens when the user is editing the content of a cell.
 *
 * The sheet text tool is responsible for listening for signals and events
 * (which stem from user gestures) that affect the edit - for example, when
 * the user hits the 'Enter' key it signifies that they have finished making
 * their edit.
 * The sheet text tool must translate these signals and events into the
 * intended operation that the user is wishing to perform, and then initiate
 * the execution of that operation. Ultimately the sheet text tool translates
 * the user's intentions into various 'qowt:doAction' signals, which the tool
 * publishes.
 *
 * The sheet text tool has two modes: 'normal' mode - which is employed when
 * the text being edited is not a formula, and 'formula' mode - which is
 * employed when the text being edited is a formula. A user gesture may be
 * interpreted differently depending on which mode the sheet text tool is
 * operating in when the gesture occurs.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/behaviours/action/commonActionHandler',
  'qowtRoot/utils/domUtils',
  'qowtRoot/models/sheet',
  'qowtRoot/tools/sheet/textHelpers/normalTextHelper',
  'qowtRoot/tools/sheet/textHelpers/formulaTextHelper'
  ], function(
    PubSub,
    PaneManager,
    SheetSelectionManager,
    DomListener,
    NavigationUtils,
    CommonActionHandler,
    DomUtils,
    SheetModel,
    NormalTextHelper,
    FormulaTextHelper) {

  'use strict';

  var _requestActionSubs,
    _observer,

    _active = false,

    _helper,

    _contentType = 'sheetText',

    _kFloating_Editor_Class = "qowt-floating-editor",
    _kScroller_Class = "qowt-scroller",

    // Signals that are subscribed to
    _kSignal_RequestAction = "qowt:requestAction",

    // Signals that are published
    _kSignal_DoAction = "qowt:doAction",

    _kSignal_SheetCommitChanges = 'qowt:sheet:commitChanges',

    // Actions
    _kAction_MirrorText = "mirrorText",

    // Keys that the tool is interested in
    _kTabKeyCode = 9,
    _kEnterKeyCode = 13,
    _kEscapeKeyCode = 27,
    _kArrowLeftKeyCode = 37,
    _kArrowUpKeyCode = 38,
    _kArrowRightKeyCode = 39,
    _kArrowDownKeyCode = 40,

    _actionHandlers = {},
    _zoomContainerDiv,
    _formulaBarDiv,
    _rowHeaderDiv,
    _colHeaderDiv,
    _nfDialogContainer,
    _baconBar,
    commitChangeSubs_,
    processKeyUp_;

  var _api = {

    /**
     * Must specify a name to identify this tool
     */
    name: 'sheetText',

    /**
     * Initializes sheet text tool.
     */
    init: function() {
      _addBehaviours();
    },

    /**
     * Called by the Tools Manager when this tool is made the active tool
     */
    activate: function() {
      _initComponentRefs();
      _addListeners();
      _determineMode();
      _active = true;
    },

    /**
     * Called by the Tools Manager when this tool is made non-active
     */
    deactivate: function() {
      _removeListeners();
      _clearMode();
      _active = false;
    },

    /**
     * Checks whether the tool is currently active or not
     *
     * @returns {boolean} True if the tool is currently active, otherwise false
     */
    isActive: function() {
      return _active;
    },

    /**
     * Called by an action handler to register itself with the Sheet Text Tool.
     */
    registerActionHandler: function(actions, callback) {
      actions.forEach(function(action) {
        _actionHandlers[action] = _actionHandlers[action] || [];
        _actionHandlers[action].push(callback);
      });
    }
  };

  // VVVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVVV

  var _initComponentRefs = function() {
    if(!_zoomContainerDiv) {
      _zoomContainerDiv =
        document.getElementById("qowt-sheet-zoom-container");
    }
    if(!_formulaBarDiv) {
      _formulaBarDiv =
        document.getElementById("qowt-sheet-formula-bar-container");
    }
    if(!_baconBar) {
      var toolbar = document.querySelector('qowt-main-toolbar');
      if (toolbar) {
        _baconBar = toolbar.getElement('qowt-message-bar#baconBar');
      }
    }
    if(!_rowHeaderDiv) {
      _rowHeaderDiv =
        document.getElementsByClassName("qowt-sheet-row-header-container")[0];
    }
    if(!_colHeaderDiv) {
      _colHeaderDiv =
        document.getElementsByClassName("qowt-sheet-col-header-container")[0];
    }
    if(!_nfDialogContainer) {
      _nfDialogContainer =
        document.getElementById("qowt-number-format-dialog-container");
    }
  };

  var _addListeners = function() {
    _requestActionSubs = PubSub.subscribe(_kSignal_RequestAction,
      _handleRequestAction);

    DomListener.add(_api.name, document, 'keydown', _onKeyDown);
    DomListener.add(_api.name, document, 'keyup', _onKeyUp);

    // create an observer for mutation events on the focused text widget's
    // node to detect any change to the text content of the node.
    // Note that we need to use mutation events to detect changes - rather
    // than just key events - because changes to the text can occur by the
    // user selecting 'paste' from the system context menu or by selecting
    // and some of the text and deleting it, or dragging it to a new position
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && (selectionObj.contentType === _contentType) &&
      (selectionObj.textWidget)) {
      var node = selectionObj.textWidget.getNode();
      var MutationObserverFunc = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
      if(MutationObserverFunc && node) {
        _observer = new MutationObserverFunc(_onMutationEvent);
        var config = {subtree: true, characterData: true, childList: true};
        _observer.observe(node, config);
      }
    }

    var panes = PaneManager.getAllPanes();
    for (var i = 0; i < panes.length; i++) {
      DomListener.add(_api.name, panes[i].getPaneNode(), 'mousedown',
        _onMouseDownOnPane, true);
    }

    DomListener.add(_api.name, PaneManager.getPanesContainerNode(),
      'mousedown', _onMouseDownOnPanesContainer, true);

    DomListener.add(_api.name, _rowHeaderDiv, 'mousedown',
      _onMouseDownHeader, true);
    DomListener.add(_api.name, _colHeaderDiv, 'mousedown',
      _onMouseDownHeader, true);
    // Let the qowt-sheet-pane handle the mousedown event instead of
    // qowt-sheet-zoom-container wherever these two elements overlap.
    // This makes sure that qowt-sheet-pane is used as the current target
    // and when the row and column coordinates are calculated by walking
    // offsetParent tree it starts at qowt-sheet-pane.
    DomListener.add(_api.name, _zoomContainerDiv, 'mousedown',
      _onMouseDownOtherAreas, false);
    DomListener.add(_api.name, _formulaBarDiv, 'mousedown',
      _onMouseDownOtherAreas, true);
    DomListener.add(_api.name, _baconBar, 'mousedown',
      _onMouseDownOtherAreas, false);
    DomListener.add(_api.name, _nfDialogContainer, 'mousedown',
      _onMouseDownOtherAreas, true);

    DomListener.add(_api.name, document,
      'contextmenu', _onContextMenuEvent, true);

    commitChangeSubs_ =
        PubSub.subscribe(_kSignal_SheetCommitChanges, handleCommitChanges_);
  };

  var _removeListeners = function() {
    PubSub.unsubscribe(_requestActionSubs);
    PubSub.unsubscribe(commitChangeSubs_);
    _requestActionSubs = undefined;

    DomListener.removeGroup(_api.name);

    if(_observer) {
      _observer.disconnect();
      _observer = undefined;
    }
  };

  var _determineMode = function() {
    var newHelper = NormalTextHelper;
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && selectionObj.textWidget) {
      var text = selectionObj.textWidget.getDisplayText();
      if(text && (text.indexOf("=") === 0)) {
        newHelper = FormulaTextHelper;
      }
    }
    if(!_helper) {
      _helper = newHelper;
      _helper.init();
    }
    else if(_helper.mode !== newHelper.mode) {
      _helper.reset();
      _helper = newHelper;
      _helper.init();
    }
  };

  var _clearMode = function() {
    _helper.reset();
    _helper = undefined;
  };

  var _handleRequestAction = function(eventType, eventData) {
    if(eventData) {
      var actionHandlers = _actionHandlers[eventData.action];
      if(actionHandlers) {
        eventData.helper = _helper;
        actionHandlers.forEach(function(handler) {
          handler.call(this, eventData);
        });
      } else {
        _api.handleCommonAction(eventType, eventData);
      }
    }
  };

  var _onKeyDown = function(event) {
    processKeyUp_ = true;
    switch (event.keyCode) {
      case _kArrowLeftKeyCode:
      case _kArrowUpKeyCode:
      case _kArrowRightKeyCode:
      case _kArrowDownKeyCode:
        // an arrow key should be interpreted according to the current mode
        _helper.onArrowKeyDown(event);
        break;
      default:
        break;
    }
  };

  var _onKeyUp = function(event) {
    // Ignore keyUp event if keyDown(occurred before keyUp) is not handled
    // by sheetTextTool. It could happen when sheetTextTool is activated
    // after keyDown on document.
    // one of such use case is formula bar getting focused after Tab keyDown
    // event on button bar. Focus on formulaBar activates sheetTextTool and
    // keyUp of Tab would cause commitCell action, which is not required.
    // Example:--
    // Tab keyPress on 'ButtonBar'
    //
    //       keyDown ->  Focus FormulaBar -> activate sheetTextTool
    //
    //       keyUp   -> sheetTextTool does commitCellEdit which is wrong
    //
    // Ignore keyUp events if keyDown event which occurred before it is not
    // handled by sheetTextTool
    try {
      if (processKeyUp_ && !isEventDispatchedFromMainToolbar(event)) {
        switch (event.keyCode) {
          case _kEnterKeyCode:
            if (event.shiftKey) {
              // Shift + Enter to enter a newline character
              _helper.doInjectNewlineCharacter();
            } else {
              // Enter signifies that the user wants to commit the edit
              _helper.doCommitCellEdit(event);
            }
            break;
          case _kTabKeyCode:
            // Tab signifies that the user wants to commit the edit
            _helper.doCommitCellEdit(event);
            break;
          case _kEscapeKeyCode:
            // Escape signifies that the user wants to cancel the edit
            _cancelCellEdit();
            break;
          default:
            // determine if the mode has changed as a result
            // of the change to the text in the text widget
            _determineMode();
            break;
        }
      }
    } catch (e) {
      console.warn('SheetTexTool: Failed to process keyUp event ' + e);
    } finally {
      processKeyUp_ = false;
    }
  };

  var _onMutationEvent = function() {
    _mirrorText();
    _helper.onMutationEvent();
  };

  var _onMouseDownOnPanesContainer = function(event) {
    _helper.onMouseDownOnPanesContainer(event);
  };

  var _onMouseDownOnPane = function(event) {
    // prevent the mousedown event from propagating, which would cause the
    // active editing widget to receive a 'blur' event (we want this tool to
    // control when the blur happens) and would also cause the selection gesture
    // handler to receive it and change the currently selected cell (we want to
    // change the current selection as part of the 'commitCellEdit' command).
    if(event.stopPropagation) {
      event.stopPropagation();
    }

    if((typeof(event.target.className) !== "string") ||
      (event.target.className === "")) {
      // the mousedown occurred on a chart or an image,
      // so commit the edit regardless of the mode
      _helper.doCommitCellEdit(event);
    }
    else if((event.target) &&
      (!event.target.classList.contains(_kFloating_Editor_Class)) &&
      (!event.target.classList.contains(_kScroller_Class))) {
      // the mousedown occurred on a cell, so take action according to the mode
      _helper.onMouseDownOnPane(event);
    }
  };


  var _onMouseDownHeader = function(event) {
    _helper.doCommitCellEdit(event);
  };

  var _onMouseDownOtherAreas = function(event) {
    var cl, commitText = false;
    if(event && event.target) {
      cl = event.target.className;
    }

    if((!cl || !cl.indexOf) ||
      // mousedown event on the formula bar area except the editor
      (cl.indexOf("qowt-sheet-formula-bar") !== -1 &&
        cl.indexOf("qowt-sheet-formula-bar-editor") === -1) ||
      // mousedown event on the bottom-left or
      // top-right corner or on the top-left corner
      (cl.indexOf("qowt-sheet-zoom-area") !== -1 ||
        cl.indexOf("qowt-sheet-header") !== -1)) {
      commitText = true;
    }
    else if(cl.indexOf("qowt-sheet-pane") !== -1 ) {
      // the mousedown event occurred on the bottom-right corner or on
      // the scroll bar - only commit if it occurred on the bottom-right corner
      var minX = _colHeaderDiv.clientWidth + _rowHeaderDiv.clientWidth;
      var minY =
        DomUtils.absolutePos(_rowHeaderDiv).top + _rowHeaderDiv.clientHeight;
      if(event.zoomedY >= minY && event.zoomedX >= minX) {
        commitText = true;
      }
    }
    else if(DomUtils.contains(_nfDialogContainer, event.target)) {
      // the mousedown event occurred on the number format dialog -
      // we need to commit the edit for two reasons:
      // 1) we get the number format from the core, so before we can
      //    change it we must submit the edit (the same happens in Excel)
      // 2) the active text editor loses focus
      commitText = true;
    }

    if(commitText) {
      if(event.stopPropagation) {
        event.stopPropagation();
      }
      _helper.doCommitCellEdit(event);
    }
  };

  var _onContextMenuEvent = function(event) {
    // we can prevent the default right-click context menu from appearing
    // (we want to manage operations such as cut/copy/paste ourselves)
    if(event && event.preventDefault) {
      event.preventDefault();
    }
  };

  var _mirrorText = function() {
    // the text in the active text editor has changed -
    // mirror the changes in the inactive text editor
    PubSub.publish(_kSignal_DoAction, {
      'action': _kAction_MirrorText,
      'context': {
        contentType: _contentType
      }
    });
  };

  var _cancelCellEdit = function() {
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && (selectionObj.contentType === _contentType) &&
      (selectionObj.textWidget)) {
      selectionObj.textWidget.cancel();
    }

    SheetModel.lastAnchorCell = undefined;
  };

  var _addBehaviours = function() {
    CommonActionHandler.addBehaviour(_api);
  };

  var handleCommitChanges_ = function(signal, signalData) {
    if (signal && signal === _kSignal_SheetCommitChanges) {
      if (signalData && signalData.commitEvent) {
        _helper.doCommitCellEdit(signalData.commitEvent);
      }
    }
  };

  /**
   * Returns true if event is dispatched from formula bar or floating editor.
   *
   * @param {Object} event
   */
  var isEventDispatchedFromMainToolbar = function(event) {
    var mainToolBar = _.find(event.path, function(node) {

      return (node && (NavigationUtils.isTargetWithinMainToolbar(node)));
    });
    return (mainToolBar ? true : false);
  };

  return _api;
});
