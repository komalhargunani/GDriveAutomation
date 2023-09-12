/*
 * Test suite for MoveCellRangeSelectionDown command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellRangeSelectionDown',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellRangeSelectionDown,
    PaneManager) {

  'use strict';

  describe('MoveCellRangeSelectionDown command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MoveCellRangeSelectionDown.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MoveCellRangeSelectionDown');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var cmd = MoveCellRangeSelectionDown.create();
        spyOn(PaneManager, 'moveRangeDown');
        cmd.doOptimistic();
        expect(PaneManager.moveRangeDown).toHaveBeenCalled();
      });
    });
  });
});
