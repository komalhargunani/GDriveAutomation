/**
 * @fileoverview Test suite for the SetCellBackgroundColorOptimistically command
 */

define([
  'qowtRoot/commands/quicksheet/setCellBackgroundColorOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellBackgroundColorOptimistically, PaneManager) {

  'use strict';

  describe('SetCellBackgroundColorOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully if given a color ' +
          'parameter', function() {
            var color = 'green';
            var cmd = SetCellBackgroundColorOptimistically.create(color);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SetCellBackgroundColorOptimistically');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
         });

      it('constructor should throw if given no parameter', function() {
        expect(function() {
            SetCellBackgroundColorOptimistically.create();
        }).toThrow();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var color = 'green';
        var cmd = SetCellBackgroundColorOptimistically.create(color);
        spyOn(PaneManager, 'setCellBackgroundColorOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellBackgroundColorOptimistically).
            toHaveBeenCalledWith(color);
      });
    });
  });
});
