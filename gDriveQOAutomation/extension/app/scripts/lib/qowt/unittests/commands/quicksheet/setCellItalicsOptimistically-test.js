/**
 * @fileoverview Test suite for the SetCellItalicsOptimistically command
 */

define([
  'qowtRoot/commands/quicksheet/setCellItalicsOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellItalicsOptimistically, PaneManager) {

  'use strict';

  describe('SetCellItalicsOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var italics = true;
        var cmd = SetCellItalicsOptimistically.create(italics);
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('SetCellItalicsOptimistically');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var italics = false;
        var cmd = SetCellItalicsOptimistically.create(italics);
        spyOn(PaneManager, 'setCellItalicsOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellItalicsOptimistically).
            toHaveBeenCalledWith(italics);
      });
    });
  });
});
