/**
 * @fileoverview Defines a SetCellBoldnessOptimistically command including
 * response behaviours. This command instructs the pane manager to set the
 * boldness of the cell Optimistically (in each of the appropriate panes)
 * according to the specified value.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param boldness {boolean} The new boldness setting
 * @return {Object} A SetCellBoldnessOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(boldness) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('SetCellBoldnessOptimistically', true,
            false);

        _api.doOptimistic = function () {
          PaneManager.setCellBoldnessOptimistically(boldness);
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
