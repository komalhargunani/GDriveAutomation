/**
 * @fileoverview Defines a setCellBackgroundColorOptimistically command
 * including response behaviours. This command instructs the pane manager
 * to set the background color of the cell Optimistically (in each of the
 * appropriate panes) to the specified color
 *
 *  @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param backgroundColor {string} The background color - e.g. "green"
 * @return {Object} A setCellBackgroundColorOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(backgroundColor) {

      // use module pattern for instance object
      var module = function() {

        if (backgroundColor === undefined) {
          throw (
              "ERROR: SetCellBackgroundColorOptimistically requires color to " +
              "be defined");
        }

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('SetCellBackgroundColorOptimistically',
            true, false);

        _api.doOptimistic = function () {
          PaneManager.setCellBackgroundColorOptimistically(backgroundColor);
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
