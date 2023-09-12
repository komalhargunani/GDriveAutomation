/**
 * Sheet Selection Manager
 * =======================
 *
 * The sheet selection manager is responsible for keeping a store of the
 * currently selected objects in a workbook, so that other modules can ask it
 * for the current selection during run-time.
 * When the selection manager is notified of a new selection it:
 *
 * - Updates its store to cache the new selection context object
 * - Publishes a 'qowt:selectionChanged' signal to notify interested parties
 *   that the selection has changed
 * - Activates the appropriate Tool(s) depending on which type of object(s) is
 *   currently selected -
 * for example, a cell, a chart or an image
 *
 * @constructor     Constructor for the Sheet Selection Manager
 * @return {object} The Sheet Selection Manager
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/sheet'], function(
    PubSub,
    SheetModel) {

  'use strict';

  var _sheetSelections = [],

    _requestFocusSubToken,
    _requestFocusLostSubToken,
    _disableToken,

    _KStack_Max_Count = 10,

    // Signals that are subscribed to
    _kSignal_RequestFocus = "qowt:sheet:requestFocus",
    _kSignal_RequestFocusLost = "qowt:sheet:requestFocusLost",

    // Signals that are published
    _kSignal_SelectionChanged = "qowt:selectionChanged",
    _signal_ToolActivate = "qowt:tool:requestActivate",
    _signal_ToolDeactivate = "qowt:tool:requestDeactivate",

    // Cell content type identifier
    _kCell_Content_Type = 'sheetCell',

  _api = {
    /**
     * Initializes the module.
     */
    init: function() {
      if (_disableToken) {
        throw new Error('sheetSelectionManager.init() called multiple times.');
      }
      _requestFocusSubToken =
          PubSub.subscribe(_kSignal_RequestFocus, _onRequestFocus);
      _requestFocusLostSubToken =
          PubSub.subscribe(_kSignal_RequestFocusLost, _onRequestFocusLost);
      _disableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },

    /**
     * disable the module
     */
     disable: function() {
      PubSub.unsubscribe(_disableToken);
      PubSub.unsubscribe(_requestFocusSubToken);
      PubSub.unsubscribe(_requestFocusLostSubToken);

      _disableToken = undefined;
      _requestFocusSubToken = undefined;
      _requestFocusLostSubToken = undefined;
    },

    /**
     * Returns the stored selection context object for the active sheet
     *
     * @return {object} The selection context object
     * @method getCurrentSelection()
     */
    getCurrentSelection: function() {
      var selectionObj;
      var activeSheetIndex = SheetModel.activeSheetIndex;
      if ((activeSheetIndex !== undefined) &&
        _sheetSelections[activeSheetIndex] &&
        (_sheetSelections[activeSheetIndex].length > 0)) {
        selectionObj = _sheetSelections[activeSheetIndex][
          _sheetSelections[activeSheetIndex].length - 1];
      }
      return selectionObj;
    },

    /**
     * Returns the stored selection context object for the given sheet
     *
     * @return {object} The selection context object
     * @method getStoredSelectionForSheet()
     */
    getStoredSelectionForSheet: function(sheetIndex) {
      var selectionObj;
      if ((sheetIndex !== undefined) && _sheetSelections[sheetIndex] &&
        (_sheetSelections[sheetIndex].length > 0)) {
        selectionObj =
          _sheetSelections[sheetIndex][_sheetSelections[sheetIndex].length - 1];
      }
      return selectionObj;
    },

    /**
     * Seeds the selection in the active sheet.
     * Note that the selection must previously
     * have been stored for the active sheet
     */
    trySeedSelection: function() {
      var anchorRowIdx, anchorColIdx,
          fromRowIdx, fromColIdx,
          toRowIdx, toColIdx;
      if(SheetModel.seedCell) {
        var storedSelectionForActiveSheet = SheetModel.seedCell;
        if (storedSelectionForActiveSheet !== undefined) {
            if (storedSelectionForActiveSheet.anchor !== undefined) {
              anchorRowIdx = storedSelectionForActiveSheet.anchor.rowIdx;
              anchorColIdx = storedSelectionForActiveSheet.anchor.colIdx;
            }
            if (storedSelectionForActiveSheet.topLeft !== undefined) {
              fromRowIdx = storedSelectionForActiveSheet.topLeft.rowIdx;
              fromColIdx = storedSelectionForActiveSheet.topLeft.colIdx;
            }
            if (storedSelectionForActiveSheet.bottomRight !== undefined) {
              toRowIdx = storedSelectionForActiveSheet.bottomRight.rowIdx;
              toColIdx = storedSelectionForActiveSheet.bottomRight.colIdx;
            }
        }

        // process the seed selection
        var obj = {
          anchor: {rowIdx: anchorRowIdx, colIdx: anchorColIdx},
          topLeft: {rowIdx: fromRowIdx, colIdx: fromColIdx},
          bottomRight: {rowIdx: toRowIdx, colIdx: toColIdx},
          contentType: _kCell_Content_Type
        };
        _processNewSelectionForActiveSheet(obj);
      }
    },

    /**
     * Resets the sheet selection manager for the currently active sheet
     */
    reset: function() {
      // publish a 'qowt:selectionChanged' signal for the given sheet
      var selectionObj = _api.getCurrentSelection();
      if (selectionObj !== undefined) {
        var obj = {oldSelection: selectionObj, newSelection: undefined};
        PubSub.publish(_kSignal_SelectionChanged, obj);
      }

      // clear the stack for the given sheet
      _sheetSelections[SheetModel.activeSheetIndex] = [];

      // deactivate the active tool
      PubSub.publish(_signal_ToolDeactivate, undefined);
    }
  };

  var _onRequestFocus = function(eventType, eventData) {
      eventType = eventType || '';
      if (eventData !== undefined) {
        _processNewSelectionForActiveSheet(eventData);
      }
    };

  var _onRequestFocusLost = function() {
    _processLostSelectionForActiveSheet();
  };

  var _processNewSelectionForActiveSheet = function(newSelectionObj) {
    // update the selection store
    var oldSelectionObj = _api.getCurrentSelection();
    _addSelectionForSheet(SheetModel.activeSheetIndex, newSelectionObj);

    // broadcast to interested parties that the selection has changed
    _broadcastSelectionChange(oldSelectionObj);

    // activate the appropriate tool
    PubSub.publish(_signal_ToolActivate, newSelectionObj);
  };

  var _processLostSelectionForActiveSheet = function() {
    // update the selection store
    var oldSelectionObj = _api.getCurrentSelection();
    _removeSelectionForSheet(SheetModel.activeSheetIndex);

    // broadcast to interested parties that the selection has changed
    _broadcastSelectionChange(oldSelectionObj);

    // activate the appropriate tool for the object that is
    // now at the top of the selection stack - or no tool if
    // the stack is now empty
    var selectionObj = _api.getCurrentSelection();
    if(selectionObj) {
      PubSub.publish(_signal_ToolActivate, selectionObj);
    }
    else {
      PubSub.publish(_signal_ToolDeactivate, undefined);
    }
  };

  var _broadcastSelectionChange = function(oldSelectionObj) {
    // publish a 'qowt:selectionChanged' signal
    var newSelectionObj = _api.getCurrentSelection();
    var obj = {oldSelection: oldSelectionObj, newSelection: newSelectionObj};
    PubSub.publish(_kSignal_SelectionChanged, obj);
  };

  var _removeSelectionForSheet = function(sheetIndex) {
    if (sheetIndex !== undefined) {
      _sheetSelections[sheetIndex].pop();
    }
  };

  var _addSelectionForSheet = function(sheetIndex, selectionObj) {
    if (sheetIndex !== undefined) {

      // limit the number of selection context objects on the stack
      if (_sheetSelections[sheetIndex] &&
        (_sheetSelections[sheetIndex].length >= _KStack_Max_Count)) {
        _sheetSelections[sheetIndex].shift();
      }

      _sheetSelections[sheetIndex] = _sheetSelections[sheetIndex] || [];
      _sheetSelections[sheetIndex].push(selectionObj);
    }
  };

  return _api;
});
