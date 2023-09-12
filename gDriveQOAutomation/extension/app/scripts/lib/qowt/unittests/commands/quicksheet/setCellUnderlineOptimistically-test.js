/**
 * @fileoverview Test suite for the setCellUnderlineOptimistically command
 */

define([
  'qowtRoot/commands/quicksheet/setCellUnderlineOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellUnderlineOptimistically, PaneManager) {

  'use strict';

  describe('SetCellUnderlineOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var underline = true;
        var cmd = SetCellUnderlineOptimistically.create(underline);
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('SetCellUnderlineOptimistically');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var underline = false;
        var cmd = SetCellUnderlineOptimistically.create(underline);
        spyOn(PaneManager, 'setCellUnderlineOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellUnderlineOptimistically).
            toHaveBeenCalledWith(underline);
      });
    });
  });
});
