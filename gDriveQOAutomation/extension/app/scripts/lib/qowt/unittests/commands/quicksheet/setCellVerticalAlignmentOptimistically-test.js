/**
 * @fileoverview Test suite for the SetCellVerticalAlignmentOptimistically
 * command
 */

define([
  'qowtRoot/commands/quicksheet/setCellVerticalAlignmentOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellVerticalAlignmentOptimistically, PaneManager) {

  'use strict';

  describe('SetCellVerticalAlignmentOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully if given a font ' +
          'size parameter', function() {
            var alignPos = 'b';
            var cmd = SetCellVerticalAlignmentOptimistically.create(alignPos);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SetCellVerticalAlignmentOptimistically');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
         });

      it('constructor should throw if given no parameter', function() {
        expect(function() {
            SetCellVerticalAlignmentOptimistically.create();
        }).toThrow();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var alignPos = 'b';
        var cmd = SetCellVerticalAlignmentOptimistically.create(alignPos);
        spyOn(PaneManager, 'setCellVerticalAlignmentOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellVerticalAlignmentOptimistically).
            toHaveBeenCalledWith(alignPos);
      });
    });
  });
});
