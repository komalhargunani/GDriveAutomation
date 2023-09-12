/*
 * Test suite for MoveCellSelectionRight command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellSelectionRight',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellSelectionRight,
    PaneManager) {

  'use strict';

  describe('MoveCellSelectionRight command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MoveCellSelectionRight.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MoveCellSelectionRight');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var cmd = MoveCellSelectionRight.create();
        spyOn(PaneManager, 'moveRight');
        cmd.doOptimistic();
        expect(PaneManager.moveRight).toHaveBeenCalledWith(undefined);
      });

      it('should call pane manager method with correct arguments for block ' +
         'move', function() {
           var cmd = MoveCellSelectionRight.create(true);
           spyOn(PaneManager, 'moveRight');
           cmd.doOptimistic();
           expect(PaneManager.moveRight).toHaveBeenCalledWith(true);
         });
    });
  });
});
