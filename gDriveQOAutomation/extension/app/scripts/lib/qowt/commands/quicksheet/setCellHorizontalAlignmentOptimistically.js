/**
 * @fileoverview Defines a SetCellHorizontalAlignmentOptimistically command
 * including response behaviours. This command instructs the pane manager to set
 * the horizontal alignment of the cell Optimistically (in each of the
 * appropriate panes) to the specified position
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param alignmentPos {string} The horizontal alignment position - e.g. "r"
 * @return {Object} A SetCellHorizontalAlignmentOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(alignmentPos) {

      // use module pattern for instance object
      var module = function() {

        if (alignmentPos === undefined) {
          throw ("ERROR: SetCellHorizontalAlignmentOptimistically requires " +
              "alignment position to be defined");
        }

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create(
            'SetCellHorizontalAlignmentOptimistically', true, false);

        _api.doOptimistic = function () {
          PaneManager.setCellHorizontalAlignmentOptimistically(alignmentPos);
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
