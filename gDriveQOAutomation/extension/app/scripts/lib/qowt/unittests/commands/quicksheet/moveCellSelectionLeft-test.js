/*
 * Test suite for MoveCellSelectionLeft command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellSelectionLeft',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellSelectionLeft,
    PaneManager) {

  'use strict';

  describe('MoveCellSelectionLeft command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MoveCellSelectionLeft.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MoveCellSelectionLeft');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var cmd = MoveCellSelectionLeft.create();
        spyOn(PaneManager, 'moveLeft');
        cmd.doOptimistic();
        expect(PaneManager.moveLeft).toHaveBeenCalledWith(undefined);
      });

      it('should call pane manager method with correct arguments for block ' +
         'move', function() {
           var cmd = MoveCellSelectionLeft.create(true);
           spyOn(PaneManager, 'moveLeft');
           cmd.doOptimistic();
           expect(PaneManager.moveLeft).toHaveBeenCalledWith(true);
         });
    });
  });
});
