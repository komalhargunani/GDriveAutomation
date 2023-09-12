/**
 * Sheet Chart Tool
 * ================
 *
 * The sheet chart tool is activated by the sheet selection manager whenever the
 * current selection is a chart in a spreadsheet.
 *
 * The sheet chart tool is responsible for disabling functionality that isn't
 * permitted on a chart - e.g. edit.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor     Constructor for the Sheet Chart Tool
 * @return {object} The Sheet Chart Tool
 */
define([
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/behaviours/action/commonActionHandler',
  'qowtRoot/pubsub/pubsub'
  ], function(
    Workbook,
    CommonActionHandler,
    PubSub) {

  'use strict';

  var _requestActionSubs,

    // Signals that are subscribed to
  _kSignal_RequestAction = "qowt:requestAction";

  var _api = {

    /**
     * Must specify a name to identify this tool
     */
    name: 'sheetFloaterChart',

    /**
     * Initializes sheet chart tool.
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
      // When a chart is currently 'selected' the user should not be
      // able to edit using the formula bar or the floating editor.
      // To achieve this the tool:
      // 1. Instructs the workbook to disable editing capabilities in the
      //    formula bar
      // 2. Doesn't call Workbook.initiateCellEdit()
      Workbook.disableFormulaBarEdits();

      _requestActionSubs =
        PubSub.subscribe(_kSignal_RequestAction, _handleRequestAction);
    },

    /**
     * Called by the Tools Manager when this tool is made non-active
     *
     * @method deactivate()
     */
    deactivate: function() {
      Workbook.enableFormulaBarEdits();

      PubSub.unsubscribe(_requestActionSubs);
      _requestActionSubs = undefined;
    }
  };

  var _handleRequestAction = function(eventType, eventData) {
    _api.handleCommonAction(eventType, eventData);
  };

  function _addBehaviours() {
    // extend our capabilities with common action handler behaviour
    CommonActionHandler.addBehaviour(_api);
  }

  return _api;
});