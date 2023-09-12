define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function(
    CommandBase,
    PaneManager) {

  'use strict';

  var factory_ = {

    /**
     * @constructor
     *
     * Defines a SetCellStrikethroughOptimistically command including response
     * behaviours. This command instructs the pane manager to set the
     * strikethrough of the cell Optimistically (in each of the appropriate
     * panes) according to the specified value.
     *
     * @param {Boolean} isStrikethrough - The new strikethrough setting
     * @return {Object} A SetCellStrikethroughOptimistically command
     */
    create: function(isStrikethrough) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var api_ = CommandBase.create('SetCellStrikethroughOptimistically',
            true, false);

        api_.doOptimistic = function() {
          PaneManager.setCellStrikethroughOptimistically(isStrikethrough);
        };

        return api_;
      };

      // We create a new instance of the object by invoking the module
      // constructor function.
      var instance = module();
      return instance;
    }
  };

  return factory_;
});
