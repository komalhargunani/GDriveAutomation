/**
 * @fileoverview Test suite for the SetCellBoldnessOptimistically command
 */

define([
  'qowtRoot/commands/quicksheet/setCellBoldnessOptimistically',
  'qowtRoot/controls/grid/paneManager'
], function(SetCellBoldnessOptimistically, PaneManager) {

  'use strict';

  describe('SetCellBoldnessOptimistically command', function() {
    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var boldness = true;
        var cmd = SetCellBoldnessOptimistically.create(boldness);
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('SetCellBoldnessOptimistically');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var boldness = false;
        var cmd = SetCellBoldnessOptimistically.create(boldness);
        spyOn(PaneManager, 'setCellBoldnessOptimistically');
        cmd.doOptimistic();
        expect(PaneManager.setCellBoldnessOptimistically).
            toHaveBeenCalledWith(boldness);
      });
    });
  });
});
