// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellWrapTextOptimistically command including
 * response behaviours. This command instructs the pane manager to set the
 * wrapText of the cell Optimistically (in each of the appropriate panes)
 * according to the specified value.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 * @param wrapText {boolean} The new wrapText setting
 * @return {Object} A SetCellWrapTextOptimistically command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager'
], function (
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function(wrapText) {

      // extend default command (optimistic==true, callsService==false)
      var _api = CommandBase.create('SetCellWrapTextOptimistically', true,
          false);

      _api.doOptimistic = function() {
        PaneManager.setCellWrapTextOptimistically(wrapText);
      };
      return _api;
    }
  };

  return _factory;
});
