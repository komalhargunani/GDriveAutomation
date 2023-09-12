/**
 * @fileoverview Defines an InjectCellRef command including response behaviours.
 * This command instructs the workbook layout control to inject a cell ref into
 * the focused text widget (either the formula bar or the floating editor). The
 * appropriate cell ref - e.g. "B23" - is deduced from the trigger event that is
 * passed to the command constructor.
 *
 * This event can be a mousedown event or an arrow keydown event.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @return {Object} An InjectCellRef command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/workbook'
], function (
    CommandBase,
    Workbook) {

  'use strict';

  var _factory = {

    create: function(event) {

      // use module pattern for instance object
      var module = function() {

        if(event === undefined) {
          throw new Error("ERROR: InjectCellRef command requires an event");
        }

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('InjectCellRef', true, false);

        _api.doOptimistic = function () {
          Workbook.injectCellRef(event);
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
