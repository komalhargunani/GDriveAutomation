/**
 * @fileoverview Defines a MoveCellSelectionDown command including response
 * behaviours. This command instructs the workbook layout control to change the
 * current cell selection to be the cell that is directly below the anchor cell
 * of the current selection.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param {boolean} byBlock Optional flag to indicate how the selection moves.
 *                          If this flag is true, the selection is moved to
 *                          start of the next data region or end of the
 *                          current data region depending on location of
 *                          current selection. If the current selection is the
 *                          last populated cell in the current column then the
 *                          selection moves to the last cell in the current
 *                          column.
 *                          If the flag is false, the selection is moved to
 *                          next row.
 * @return {Object} A MoveCellSelectionDown command
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
        var _api = CommandBase.create('MoveCellSelectionDown', true, false);

        _api.doOptimistic = function () {
          PaneManager.moveDown(byBlock);
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
