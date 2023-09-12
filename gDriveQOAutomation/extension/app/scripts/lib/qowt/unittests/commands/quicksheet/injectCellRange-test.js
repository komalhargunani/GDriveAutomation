/*
 * Test suite for InjectCellRange command
 */

define([
  'qowtRoot/commands/quicksheet/injectCellRange',
  'qowtRoot/controls/grid/workbook'
], function(
    InjectCellRange,
    Workbook) {

  'use strict';

  describe('InjectCellRange command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {

      it('constructor should throw if no event is given as an argument',
         function() {
           expect(function() {
             InjectCellRange.create();
           }).toThrow('ERROR: InjectCellRange command requires an event');
         }
      );

      it('constructor should create a command successfully with an ' +
          'event param', function() {
            var evt = document.createEvent('Event');
            var cmd = InjectCellRange.create(evt);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('InjectCellRange');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
          });

      it('doOptimistic() method should talk to the workbook layout control',
         function() {
           var evt = document.createEvent('Event');
           var cmd = InjectCellRange.create(evt);
           spyOn(Workbook, 'injectCellRange');
           cmd.doOptimistic();
           expect(Workbook.injectCellRange).toHaveBeenCalledWith(evt);
         });
    });
  });
});
