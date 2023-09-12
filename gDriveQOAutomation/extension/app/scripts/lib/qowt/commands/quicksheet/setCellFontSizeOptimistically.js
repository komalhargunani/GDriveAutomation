/**
 * @fileoverview Defines a setCellFontSizeOptimistically command including
 * response behaviours. This command instructs the pane manager to set the
 * font size of the cell Optimistically (in each of the appropriate panes) to
 * the specified size.
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param fontSize {string} The font size - e.g. "24"
 * @return {Object} A setCellFontSizeOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(fontSize) {

      // use module pattern for instance object
      var module = function() {

        if (fontSize === undefined) {
          throw (
              "ERROR: SetCellFontSizeOptimistically requires font size to be " +
              "defined");
        }

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('SetCellFontSizeOptimistically', true,
            false);

        _api.doOptimistic = function () {
          PaneManager.setCellFontSizeOptimistically(fontSize);
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
