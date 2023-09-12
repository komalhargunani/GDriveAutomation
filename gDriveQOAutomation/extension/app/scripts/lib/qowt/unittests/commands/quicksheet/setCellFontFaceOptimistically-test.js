/**
 * @fileoverview Test suite for the SetCellFontFaceOptimistically command
 */

define([
  'qowtRoot/commands/quicksheet/setCellFontFaceOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellFontFaceOptimistically, PaneManager) {

  'use strict';

  describe('SetCellFontFaceOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully if given a font ' +
          'face parameter', function() {
            var fontFace = 'Arial';
            var cmd = SetCellFontFaceOptimistically.create(fontFace);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SetCellFontFaceOptimistically');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
         });

      it('constructor should throw if given no parameter', function() {
        expect(function() {
            SetCellFontFaceOptimistically.create();
        }).toThrow();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var fontFace = 'Arial';
        var cmd = SetCellFontFaceOptimistically.create(fontFace);
        spyOn(PaneManager, 'setCellFontFaceOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellFontFaceOptimistically).
            toHaveBeenCalledWith(fontFace);
      });
    });
  });
});
