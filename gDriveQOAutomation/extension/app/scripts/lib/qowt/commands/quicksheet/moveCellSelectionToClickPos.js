/**
 * @fileoverview Defines a MoveCellSelectionToClickPos command including
 * response behaviours. This command instructs the workbook layout control to
 * change the current cell selection to be the cell that is at the position of
 * the given click event.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @return {Object} A MoveCellSelectionToClickPos command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(event) {

      // use module pattern for instance object
      var module = function() {

        if (event === undefined) {
          throw ("ERROR: MoveCellSelectionToClickPos command requires an " +
              "event");
        }

        var _currentTarget = event.currentTarget;

        // extend default command (optimistic==true, callsService==false)
        var _api =
            CommandBase.create('MoveCellSelectionToClickPos', true, false);

        // The currentTarget property of the event object is not available
        // anymore when this method is called, probably because the event object
        // loses some of its context. So we have to save the original current
        // target and add it to the event object
        // TODO: Investigate this change in behaviour (QS-1204)
        _api.doOptimistic = function () {
          event.storedCurrentTarget = _currentTarget;
          PaneManager.moveToClickPos(event);
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
