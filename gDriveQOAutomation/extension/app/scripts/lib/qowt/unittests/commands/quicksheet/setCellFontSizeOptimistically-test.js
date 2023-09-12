/**
 * @fileoverview Test suite for the SetCellFontSizeOptimistically command
 */

define([
  'qowtRoot/commands/quicksheet/setCellFontSizeOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellFontSizeOptimistically, PaneManager) {

  'use strict';

  describe('SetCellFontSizeOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully if given a font ' +
          'size parameter', function() {
            var fontSize = '24';
            var cmd = SetCellFontSizeOptimistically.create(fontSize);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SetCellFontSizeOptimistically');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
         });

      it('constructor should throw if given no parameter', function() {
        expect(function() {
            SetCellFontSizeOptimistically.create();
        }).toThrow();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var fontSize = '24';
        var cmd = SetCellFontSizeOptimistically.create(fontSize);
        spyOn(PaneManager, 'setCellFontSizeOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellFontSizeOptimistically).
            toHaveBeenCalledWith(fontSize);
      });
    });
  });
});
