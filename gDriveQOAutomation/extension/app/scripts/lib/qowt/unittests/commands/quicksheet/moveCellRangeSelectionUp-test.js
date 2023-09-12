/*
 * Test suite for MoveCellRangeSelectionUp command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellRangeSelectionUp',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellRangeSelectionUp,
    PaneManager) {

  'use strict';

  describe('MoveCellRangeSelectionUp command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MoveCellRangeSelectionUp.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MoveCellRangeSelectionUp');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var cmd = MoveCellRangeSelectionUp.create();
        spyOn(PaneManager, 'moveRangeUp');
        cmd.doOptimistic();
        expect(PaneManager.moveRangeUp).toHaveBeenCalled();
      });
    });
  });
});
