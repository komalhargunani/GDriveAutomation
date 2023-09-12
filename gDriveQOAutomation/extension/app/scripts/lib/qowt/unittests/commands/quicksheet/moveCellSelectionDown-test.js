/*
 * Test suite for MoveCellSelectionDown command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellSelectionDown',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellSelectionDown,
    PaneManager) {

  'use strict';

  describe('MoveCellSelectionDown command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MoveCellSelectionDown.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MoveCellSelectionDown');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var cmd = MoveCellSelectionDown.create();
        spyOn(PaneManager, 'moveDown');
        cmd.doOptimistic();
        expect(PaneManager.moveDown).toHaveBeenCalledWith(undefined);
      });

      it('should call pane manager method with correct arguments for block ' +
         'move', function() {
           var cmd = MoveCellSelectionDown.create(true);
           spyOn(PaneManager, 'moveDown');
           cmd.doOptimistic();
           expect(PaneManager.moveDown).toHaveBeenCalledWith(true);
         });
    });
  });
});
