/**
 * @fileoverview Defines a MoveCellRangeSelectionRight command including
 * response behaviours. This command instructs the workbook layout control to
 * change the current cell selection due to a 'shift:right' key combination
 * occurring.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @return {Object} A MoveCellRangeSelectionRight command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var _api =
            CommandBase.create('MoveCellRangeSelectionRight', true, false);

        _api.doOptimistic = function () {
          PaneManager.moveRangeRight();
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
