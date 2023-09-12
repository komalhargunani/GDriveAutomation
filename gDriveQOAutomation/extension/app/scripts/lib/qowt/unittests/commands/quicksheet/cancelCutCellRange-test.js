// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the CancelCutCellRange command
 */

define([
  'qowtRoot/commands/quicksheet/cancelCutCellRange',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/grid/paneManager'
], function(CancelCutCellRange, Workbook, PaneManager) {

  'use strict';

  describe('CancelCutCellRange command', function() {

    beforeEach(function() {
      Workbook.init();
    });

    afterEach(function() {
      Workbook.reset();
    });

    describe('creation', function() {
      it('constructor should create a command successfully with no parameters',
          function() {
            var cmd = CancelCutCellRange.create();
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('CancelCutCellRange');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(false);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onSuccess).toBeDefined();
            expect(cmd.dcpData().name).toBe('ccp');
          });

      it('should call PaneManger to un highlight cells on success', function() {
        spyOn(PaneManager, 'unhighlightCells');
        var cmd = CancelCutCellRange.create();
        expect(cmd).toBeDefined();
        cmd.onSuccess();
        expect(PaneManager.unhighlightCells).toHaveBeenCalled();
      });
    });
  });
});

