/**
 * @fileoverview Defines a ResetWorkbook command including response behaviours.
 * This command resets the workbook layout control and cancels all the queued up
 * commands from the command manager
 *
 * @constructor
 * @return {Object}          A ResetWorkbook command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/workbook'
], function(
  CommandBase,
  Workbook) {

  'use strict';

  var _factory = {

    create:function () {
      // optimistic = true, calls service = false
      var _api = CommandBase.create('ResetWorkbook', true, false);

      _api.doOptimistic = function () {
        Workbook.reset();
      };

      return _api;
    }

  };

  return _factory;
});
