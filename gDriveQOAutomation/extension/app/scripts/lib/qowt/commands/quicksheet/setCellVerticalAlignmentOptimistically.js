/**
 * @fileoverview Defines a SetCellVerticalAlignmentOptimistically command
 * including response behaviours. This command instructs the pane manager
 * to set the vertical alignment of the cell Optimistically (in each of the
 * appropriate panes) to the specified position
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param alignmentPos {string} The vertical alignment position - e.g. "t"
 * @return {Object} A SetCellVerticalAlignmentOptimistically command
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
          throw ("ERROR: SetCellVerticalAlignmentOptimistically requires " +
              "alignment position to be defined");
        }

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('SetCellVerticalAlignmentOptimistically',
            true, false);

        _api.doOptimistic = function () {
          PaneManager.setCellVerticalAlignmentOptimistically(alignmentPos);
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
