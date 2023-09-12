/*
 * Test suite for MoveCellRangeSelectionLeft command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellRangeSelectionLeft',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellRangeSelectionLeft,
    PaneManager) {

  'use strict';

  describe('MoveCellRangeSelectionLeft command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MoveCellRangeSelectionLeft.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MoveCellRangeSelectionLeft');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var cmd = MoveCellRangeSelectionLeft.create();
        spyOn(PaneManager, 'moveRangeLeft');
        cmd.doOptimistic();
        expect(PaneManager.moveRangeLeft).toHaveBeenCalled();
      });
    });
  });
});
