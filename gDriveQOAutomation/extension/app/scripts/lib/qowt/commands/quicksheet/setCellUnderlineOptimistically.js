/**
 * @fileoverview Defines a SetCellUnderlineOptimistically command including
 * response behaviours. This command instructs the pane manager to set the
 * underline state of the cell Optimistically (in each of the appropriate panes)
 * according to the specified value
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param underline {boolean} The new underline setting
 * @return {Object} A SetCellUnderlineOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(underline) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var _api =
            CommandBase.create('SetCellUnderlineOptimistically', true, false);

        _api.doOptimistic = function () {
          PaneManager.setCellUnderlineOptimistically(underline);
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
