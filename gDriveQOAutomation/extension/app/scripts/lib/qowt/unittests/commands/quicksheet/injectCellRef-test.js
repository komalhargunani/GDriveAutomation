/*
 * Test suite for InjectCellRef command
 */

define([
  'qowtRoot/commands/quicksheet/injectCellRef',
  'qowtRoot/controls/grid/workbook'
], function(
    InjectCellRef,
    Workbook) {

  'use strict';

  describe('InjectCellRef command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {

      it('constructor should throw if no event is given as an argument',
         function() {
           expect(function() {
             InjectCellRef.create();
           }).toThrow('ERROR: InjectCellRef command requires an event');
         }
      );

      it('constructor should create a command successfully with an ' +
          'event param', function() {
            var evt = document.createEvent('Event');
            var cmd = InjectCellRef.create(evt);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('InjectCellRef');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
          });

      it('doOptimistic() method should talk to the workbook layout control',
         function() {
           var evt = document.createEvent('Event');
           var cmd = InjectCellRef.create(evt);
           spyOn(Workbook, 'injectCellRef');
           cmd.doOptimistic();
           expect(Workbook.injectCellRef).toHaveBeenCalledWith(evt);
         });
    });
  });
});
