/*
 * Test suite for MoveCellSelectionUp command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellSelectionUp',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellSelectionUp,
    PaneManager) {

  'use strict';

  describe('MoveCellSelectionUp command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MoveCellSelectionUp.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MoveCellSelectionUp');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the pane manager', function() {
        var cmd = MoveCellSelectionUp.create();
        spyOn(PaneManager, 'moveUp');
        cmd.doOptimistic();
        expect(PaneManager.moveUp).toHaveBeenCalledWith(undefined);
      });

      it('should call pane manager method with correct arguments for block ' +
         'move', function() {
           var cmd = MoveCellSelectionUp.create(true);
           spyOn(PaneManager, 'moveUp');
           cmd.doOptimistic();
           expect(PaneManager.moveUp).toHaveBeenCalledWith(true);
         });
    });
  });
});
