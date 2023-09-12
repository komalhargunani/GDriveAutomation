// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the SetCellWrapTextOptimistically command
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */

define([
  'qowtRoot/commands/quicksheet/setCellWrapTextOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellWrapTextOptimistically, PaneManager) {

  'use strict';

  describe('SetCellWrapTextOptimistically command', function() {

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var wrapText = true;
        var cmd = SetCellWrapTextOptimistically.create(wrapText);
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('SetCellWrapTextOptimistically');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var wrapText = false;
        var cmd = SetCellWrapTextOptimistically.create(wrapText);
        spyOn(PaneManager, 'setCellWrapTextOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellWrapTextOptimistically).
            toHaveBeenCalledWith(wrapText);
      });
    });
  });
});
