/**
 * @fileoverview Defines a SetCellFontFaceOptimistically command including
 * response behaviours. This command instructs the pane manager to set the
 * font face of the cell Optimistically (in each of the appropriate panes) to
 * the specified font.
 *
 *  @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param fontFace {string} The font face setting - e.g. "Arial"
 * @return {Object} A SetCellFontFaceOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(fontFace) {

      // use module pattern for instance object
      var module = function() {

        if (fontFace === undefined) {
          throw (
              "ERROR: SetCellFontFaceOptimistically requires font face to be " +
              "defined");
        }

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('SetCellFontFaceOptimistically', true,
            false);

        _api.doOptimistic = function () {
          PaneManager.setCellFontFaceOptimistically(fontFace);
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
