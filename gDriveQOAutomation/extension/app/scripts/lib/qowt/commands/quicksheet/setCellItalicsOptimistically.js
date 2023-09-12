/**
 * @fileoverview Defines a SetCellItalicsOptimistically command including
 * response behaviours. This command instructs the pane manager to set the
 * italics state of the cell Optimistically (in each of the appropriate panes)
 * according to the specified value
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param italics {boolean} The new italics setting
 * @return {Object} A SetCellItalicsOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(italics) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('SetCellItalicsOptimistically', true,
            false);

        _api.doOptimistic = function () {
          PaneManager.setCellItalicsOptimistically(italics);
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
