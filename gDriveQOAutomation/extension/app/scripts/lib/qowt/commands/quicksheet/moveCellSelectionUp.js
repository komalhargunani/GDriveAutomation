/**
 * @fileoverview Defines a MoveCellSelectionUp command including response
 * behaviours. This command instructs the workbook layout control to change the
 * current cell selection to be the cell that is directly above the anchor cell
 * of the current selection.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param {boolean} byBlock Optional flag to indicate how the selection moves.
 *                          If this flag is true, the selection is moved to
 *                          start of the current data region or end of the
 *                          previous data region depending on location of
 *                          current selection. If the current selection is
 *                          the first populated cell in the current column
 *                          then the selection moves to the first cell in the
 *                          current column.
 *                          If the flag is false, the selection is moved to
 *                          previous row.
 * @return {Object} A MoveCellSelectionUp command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(byBlock) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('MoveCellSelectionUp', true, false);

        _api.doOptimistic = function () {
          PaneManager.moveUp(byBlock);
        };

        return _api;
      };

      // We create a new instance of the object by invoking the module
      // constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
