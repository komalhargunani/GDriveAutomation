/**
 * @fileoverview Test suite for the SetCellHorizontalAlignmentOptimistically
 * command
 */

define([
  'qowtRoot/commands/quicksheet/setCellHorizontalAlignmentOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellHorizontalAlignmentOptimistically, PaneManager) {

  'use strict';

  describe('SetCellHorizontalAlignmentOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully if given a font ' +
          'size parameter', function() {
            var alignPos = 'r';
            var cmd = SetCellHorizontalAlignmentOptimistically.create(alignPos);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SetCellHorizontalAlignmentOptimistically');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
         });

      it('constructor should throw if given no parameter', function() {
        expect(function() {
            SetCellHorizontalAlignmentOptimistically.create();
        }).toThrow();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var alignPos = 'r';
        var cmd = SetCellHorizontalAlignmentOptimistically.create(alignPos);
        spyOn(PaneManager, 'setCellHorizontalAlignmentOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellHorizontalAlignmentOptimistically).
            toHaveBeenCalledWith(alignPos);
      });
    });
  });
});
