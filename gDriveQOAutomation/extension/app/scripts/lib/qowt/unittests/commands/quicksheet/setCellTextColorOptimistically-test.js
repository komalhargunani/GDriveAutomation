/**
 * @fileoverview Test suite for the SetCellTextColorOptimistically command
 */

define([
  'qowtRoot/commands/quicksheet/setCellTextColorOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellTextColorOptimistically, PaneManager) {

  'use strict';

  describe('SetCellTextColorOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully if given a ' +
          'color parameter', function() {
            var color = 'green';
            var cmd = SetCellTextColorOptimistically.create(color);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SetCellTextColorOptimistically');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
         });

      it('constructor should throw if given no parameter', function() {
        expect(function() {
            SetCellTextColorOptimistically.create();
        }).toThrow();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var color = 'green';
        var cmd = SetCellTextColorOptimistically.create(color);
        spyOn(PaneManager, 'setCellTextColorOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellTextColorOptimistically).
            toHaveBeenCalledWith(color);
      });
    });
  });
});
