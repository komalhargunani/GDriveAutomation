/**
 * Sheet Cell Tool
 * ===============
 *
 * The sheet cell tool is activated by the sheet selection manager as soon as
 * the seed cell selection is rendered when a workbook is opened, and it is the
 * active tool when the current selection is a cell (or cell range).
 *
 * The sheet cell tool is responsible for listening for signals and events
 * (which stem from user gestures) that affect the cells in a workbook - for
 * example, when the user starts typing text into the currently selected cell.
 * The sheet cell tool must translate these signals and events into the intended
 * operation that the user is wishing to perform, and then initiate the
 * execution of that operation - for example, when the user double-clicks on a
 * cell the floating editor should appear. Ultimately the sheet cell tool
 * translates the user's intentions into various 'qowt:doAction' signals, which
 * the tool publishes

 * This tool also listens for requestActions coming from the likes of
 * toolbar buttons, and if the action is valid given our current selection
 * it will convert it in to a proper doAction.
 *
 * @constructor     Constructor for the Sheet Cell Tool
 * @return {object} The Sheet Cell Tool
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/features/utils',
  'qowtRoot/behaviours/action/commonActionHandler'
  ], function(
    PubSub,
    SheetSelectionManager,
    PaneManager,
    Workbook,
    DomListener,
    NavigationUtils,
    Features,
    CommonActionHandler) {

  'use strict';

  var _contentType = 'sheetCell',
      _active = false,

    _paneMgrDblClickSubs,
    _formulaBarFocusedSubs,
    _requestActionSubs,
    _actionHandlers = {},

    // Keys that affect the current selection
    _kArrowLeftKeyCode = 37,
    _kArrowUpKeyCode = 38,
    _kArrowRightKeyCode = 39,
    _kArrowDownKeyCode = 40,
    _kTabKeyCode = 9,
    _kEnterKeyCode = 13,
    _kBackspaceKeyCode = 8,
    _kDeleteKeyCode = 46,
    _kSpaceBarKeyCode = 32,
    _kEscapeKeyCode = 27,
    _kCharacterAKeyCode = 65,

    // Signals that are subscribed to
    _kSignal_WidgetDoubleClick = "qowt:widget:dblClick",
    _kSignal_FormulaBarFocused = "qowt:formulaBar:focused",
    _kSignal_RequestAction = "qowt:requestAction",

    // Signals that are published
    _kSignal_DoAction = "qowt:doAction",

    // Actions
    _kAction_CommitCellEdit = "commitCellEdit",
    _kAction_MoveSelectionUp = "moveSelectionUp",
    _kAction_MoveRangeSelectionUp = "moveRangeSelectionUp",
    _kAction_MoveSelectionDown = "moveSelectionDown",
    _kAction_MoveRangeSelectionDown = "moveRangeSelectionDown",
    _kAction_MoveSelectionLeft = "moveSelectionLeft",
    _kAction_MoveRangeSelectionLeft = "moveRangeSelectionLeft",
    _kAction_MoveSelectionRight = "moveSelectionRight",
    _kAction_MoveRangeSelectionRight = "moveRangeSelectionRight",
    _kAction_CancelCut = "cancelCut";

  var _api = {

    /**
     * Must specify a name to identify this tool
     */
    name: 'sheetCell',

    /**
     * Initializes sheet cell tool.
     */
    init: function() {
      _addBehaviours();
    },

    /**
     * Called by the Tools Manager when this tool is made the active tool
     *
     * @method activate()
     */
    activate: function() {
      // listen for keydown events
      // (set the 'useCapture' param to true to catch these events before the
      // formula bar does)
      DomListener.addListener(document, 'keydown', _onKeyDownEvent, true);

      if(Features.isEnabled('edit')) {
        _paneMgrDblClickSubs =
          PubSub.subscribe(_kSignal_WidgetDoubleClick, _handleWidgetDblClick);
        _formulaBarFocusedSubs =
          PubSub.subscribe(_kSignal_FormulaBarFocused,
            _handleFormulaBarFocused);
      }
      _requestActionSubs =
        PubSub.subscribe(_kSignal_RequestAction, _handleRequestAction);

      _active = true;
    },

    /**
     * Called by the Tools Manager when this tool is made non-active
     *
     * @method deactivate()
     */
    deactivate: function() {
      DomListener.removeListener(document, 'keydown', _onKeyDownEvent, true);

      if(Features.isEnabled('edit')) {
        PubSub.unsubscribe(_paneMgrDblClickSubs);
        _paneMgrDblClickSubs = undefined;

        PubSub.unsubscribe(_formulaBarFocusedSubs);
        _formulaBarFocusedSubs = undefined;
      }
      PubSub.unsubscribe(_requestActionSubs);
      _requestActionSubs = undefined;

      _active = false;
    },

    /**
     * Query if the tool is active.
     *
     * @returns {Boolean} True if active, else false.
     */
    isActive: function() {
      return _active;
    },

    /**
     * Called by an action handler to register itself with the Sheet Cell Tool.
     *
     * @method registerActionHandler()
     */
    registerActionHandler: function(actions, callback) {
      actions.forEach(function(action) {
        _actionHandlers[action] = _actionHandlers[action] || [];
        _actionHandlers[action].push(callback);
      });
    }
  };

  // VVVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVVV

  var _handleWidgetDblClick = function(eventType, eventData) {
    eventType = eventType || '';
    if(eventData && (eventData.contentType === 'pane')) {
      _initiateCellEdit(true);
    }
  };

  var _handleFormulaBarFocused = function() {
    _initiateCellEdit(false);
  };

  var _initiateCellEdit = function(isInlineEdit, seed) {
    Workbook.initiateCellEdit(isInlineEdit, seed);
  };

  var _handleRequestAction = function(eventType, eventData) {
    if(eventData) {
      var actionHandlers = _actionHandlers[eventData.action];
      if(actionHandlers) {
        actionHandlers.forEach(function(handler) {
          handler.call(this, eventData);
        });
      }
      else {
        // We haven't consumed the action directly,
        // so check if it's a common action.
        _api.handleCommonAction(eventType, eventData);
      }
    }
  };

  var _onKeyDownEvent = function(event) {

    // TODO: Need to find a better solution for handling events on the target
    // element. For now this is done because currently sheetCellTool is
    // capturing keydown events on document, which is preventing events to
    // propagate to its children. So even if the target is mainToolbar or
    // hyperlink dialog the keydown event is also listened on cell. Therefore
    // ignoring keydown events if the target is mainToolbar or hyperlink dialog.
    if (event &&
        (event.target.nodeName === 'QOWT-HYPERLINK-DIALOG' ||
        (NavigationUtils.isTargetWithinMainToolbar(event.target)))) {
      return;
    }

    var altModifier = event.altKey;
    var controlModifier = event.ctrlKey;
    var shiftModifier = event.shiftKey;
    var metaModifier = event.metaKey;

    var shiftOnly =
      (shiftModifier && !altModifier && !controlModifier && !metaModifier);
    var noModifiers =
      (!shiftModifier && !altModifier && !controlModifier && !metaModifier);
    var ctrlOrMeta = controlModifier || metaModifier;

    var ctrlOrMetaOnly =
        ((controlModifier || metaModifier) && !shiftModifier && !altModifier);
    switch (event.keyCode) {
      case _kArrowLeftKeyCode:
      {
        // prevent the default behaviour of the browser scrolling left
        event.preventDefault();

        if(shiftModifier) {
          _moveRangeLeft();
        }
        else {
          _moveLeft(ctrlOrMeta);
        }
      }
        break;
      case _kArrowUpKeyCode:
      {
        // prevent the default behaviour of the browser scrolling up
        event.preventDefault();

        if(shiftModifier) {
          _moveRangeUp();
        }
        else {
          _moveUp(ctrlOrMeta);
        }
      }
        break;
      case _kArrowRightKeyCode:
      {
        // prevent the default behaviour of the browser scrolling right
        event.preventDefault();

        if(shiftModifier) {
          _moveRangeRight();
        }
        else {
          _moveRight(ctrlOrMeta);
        }
      }
        break;
      case _kArrowDownKeyCode:
      {
        // prevent the default behaviour of the browser scrolling down
        event.preventDefault();

        if(shiftModifier) {
          _moveRangeDown();
        }
        else {
          _moveDown(ctrlOrMeta);
        }
      }
        break;
      case _kEnterKeyCode:
      {
        if (noModifiers) {
          _moveDown();
        }
        else if (shiftOnly) {
          _moveUp();
        }
      }
        break;
      case _kTabKeyCode:
      {
        if (Features.isEnabled('edit')) {
          // Use tab only in edit product as tab should browse between sheets in
          // viewer product
          if (noModifiers) {
            _moveRight();
          }
          else if (shiftOnly) {
            _moveLeft();
          }

          // prevent the default, which will set focus on the formula bar
          if (event.preventDefault) {
            event.preventDefault();
          }
        }
      }
        break;
      case _kDeleteKeyCode:
      case _kBackspaceKeyCode:
      {
        if (Features.isEnabled('edit')) {
          _commitCellClear(event);
        }
      }
        break;
      case _kEscapeKeyCode:
      {
        if (Features.isEnabled('edit')) {
          _cancelCutOperation(event);
        }
      }
      break;
      case _kCharacterAKeyCode:
        {
          if (ctrlOrMetaOnly) {
            // prevent the default
            if (event.preventDefault) {
              event.preventDefault();
            }
            PaneManager.selectAllCells();
          } else {
            _defaultKeyDownBehavior(event, noModifiers, shiftOnly);
          }
        }
        break;
      default:
        {
          _defaultKeyDownBehavior(event, noModifiers, shiftOnly);
        }
        break;
    }
  };

  var _defaultKeyDownBehavior = function(evt, noModifiers, shiftOnly) {
    if (Features.isEnabled('edit')) {
      var noHarmfulModifiers = (noModifiers || shiftOnly);
      if (noHarmfulModifiers && (evt.keyCode >= _kSpaceBarKeyCode)) {
        // Keys above 32 ("spacebar") are printable so they should initiate
        // edit mode
        _initiateCellEdit(true, evt.keyIdentifier);
      }
    }
  };

  var _moveUp = function(byBlock) {
    _move(_kAction_MoveSelectionUp, byBlock);
  };

  var _moveRangeUp = function() {
    _move(_kAction_MoveRangeSelectionUp);
  };

  var _moveDown = function(byBlock) {
    _move(_kAction_MoveSelectionDown, byBlock);
  };

  var _moveRangeDown = function() {
    _move(_kAction_MoveRangeSelectionDown);
  };

  var _moveLeft = function(byBlock) {
    _move(_kAction_MoveSelectionLeft, byBlock);
  };

  var _moveRangeLeft = function() {
    _move(_kAction_MoveRangeSelectionLeft);
  };

  var _moveRight = function(byBlock) {
    _move(_kAction_MoveSelectionRight, byBlock);
  };

  var _moveRangeRight = function() {
    _move(_kAction_MoveRangeSelectionRight);
  };

  var _move = function(action, byBlock) {
    PubSub.publish(_kSignal_DoAction, {
      'action': action,
      'byBlock': byBlock,
      'context': {
        contentType: _contentType
      }
    });
  };

  var _cancelCutOperation = function() {
    PubSub.publish(_kSignal_DoAction, {
      'action': _kAction_CancelCut,
      'context': {
        contentType: _contentType
      }
    });
  };

  var _commitCellClear = function(event) {
    // prevent the default behaviour of the browser 'going back'
    event.preventDefault();

    var currentSelection = SheetSelectionManager.getCurrentSelection();
    PubSub.publish(_kSignal_DoAction, {
      'action': _kAction_CommitCellEdit,
      'context': {
        fromRowIndex: currentSelection.topLeft.rowIdx,
        fromColIndex: currentSelection.topLeft.colIdx,
        toRowIndex: currentSelection.bottomRight.rowIdx,
        toColIndex: currentSelection.bottomRight.colIdx,
        cellText: '',
        commitEvent: event,
        contentType: _contentType
      }
    });
  };

  function _addBehaviours() {
    // extend our capabilities with common action handler behaviour
    CommonActionHandler.addBehaviour(_api);
  }

  return _api;
});
