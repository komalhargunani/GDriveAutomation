/*
 * Test suite for MoveCellRangeSelectionRight command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellRangeSelectionRight',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellRangeSelectionRight,
    PaneManager) {

  'use strict';

  describe('MoveCellRangeSelectionRight command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MoveCellRangeSelectionRight.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MoveCellRangeSelectionRight');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var cmd = MoveCellRangeSelectionRight.create();
        spyOn(PaneManager, 'moveRangeRight');
        cmd.doOptimistic();
        expect(PaneManager.moveRangeRight).toHaveBeenCalled();
      });
    });
  });
});
