/*
 * Test suite for MoveCellSelectionToClickPos command
 */

define([
  'qowtRoot/commands/quicksheet/moveCellSelectionToClickPos',
  'qowtRoot/controls/grid/paneManager'
], function(
    MoveCellSelectionToClickPos,
    PaneManager) {

  'use strict';

  describe('MoveCellSelectionToClickPos command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {

      it('constructor should throw if no event is given as an argument',
         function() {
           expect(function() {
             MoveCellSelectionToClickPos.create();
           }).toThrow('ERROR: MoveCellSelectionToClickPos command ' +
               'requires an event');
         }
      );

      it('constructor should create a command successfully with an ' +
          'event param', function() {
            var evt = document.createEvent('Event');
            var cmd = MoveCellSelectionToClickPos.create(evt);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('MoveCellSelectionToClickPos');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
          });

      it('doOptimistic() method should talk to the pane manager', function() {
        var evt = document.createEvent('Event');
        var cmd = MoveCellSelectionToClickPos.create(evt);
        spyOn(PaneManager, 'moveToClickPos');
        cmd.doOptimistic();
        expect(PaneManager.moveToClickPos).toHaveBeenCalledWith(evt);
      });
    });
  });
});
