/**
 * @fileoverview Defines a SetCellTextColorOptimistically command including
 * response behaviours. This command instructs the pane manager to set the text
 * color of the cell Optimistically (in each of the appropriate panes) to the
 * specified color
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param textColor {string} The text color - e.g. "blue"
 * @return {Object} A SetCellTextColorOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(textColor) {

      // use module pattern for instance object
      var module = function() {

        if (textColor === undefined) {
          throw ("ERROR: SetCellTextColorOptimistically requires color to be " +
              "defined");
        }

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('SetCellTextColorOptimistically', true,
            false);

        _api.doOptimistic = function () {
          PaneManager.setCellTextColorOptimistically(textColor);
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
