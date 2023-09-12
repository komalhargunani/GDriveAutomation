/*
 * Test suite for CompleteCellEdit command
 */

define([
  'qowtRoot/commands/quicksheet/completeCellEdit',
  'qowtRoot/controls/grid/workbook'
], function(
    CompleteCellEdit,
    Workbook) {

  'use strict';

  describe('CompleteCellEdit command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully given no ' +
          'parameter', function() {
            var cmd = CompleteCellEdit.create();
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('CompleteCellEdit');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
          });

      it('constructor should create a command successfully given ' +
          'a "true" parameter', function() {
            var cancelled = true;
            var cmd = CompleteCellEdit.create(cancelled);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('CompleteCellEdit');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
          });

      it('constructor should create a command successfully given ' +
          'a "false" parameter', function() {
            var cancelled = false;
            var cmd = CompleteCellEdit.create(cancelled);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('CompleteCellEdit');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(false);
            expect(cmd.doOptimistic).toBeDefined();
          });

      it('doOptimistic() method should talk to the workbook layout control',
         function() {
           var cancelled = true;
           var cmd = CompleteCellEdit.create(cancelled);
           spyOn(Workbook, 'completeCellEdit');
           cmd.doOptimistic();
           expect(Workbook.completeCellEdit).
               toHaveBeenCalledWith(cancelled, undefined);
         });

      it('doOptimistic() method should set a timeout method', function() {
        var cancelled = false;
        var obj = {
          'foo': 'bar',
          'dispatchEvent': function() {}
        };
        var cmd = CompleteCellEdit.create(cancelled, obj);
        spyOn(Workbook, 'completeCellEdit');
        spyOn(window, 'setTimeout');
        cmd.doOptimistic();
        expect(Workbook.completeCellEdit).
            toHaveBeenCalledWith(cancelled, obj);
      });
    });
  });
});
