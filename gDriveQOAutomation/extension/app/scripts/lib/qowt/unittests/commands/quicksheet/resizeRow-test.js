/*
 * Test suite for ResizeRow command
 */

define([
  'qowtRoot/commands/quicksheet/resizeRow',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/savestate/saveStateManager',
  'qowtRoot/utils/typeUtils'
], function(
    ResizeRow,
    Workbook,
    PaneManager,
    SaveStateManager,
    TypeUtils) {

  'use strict';

  describe('ResizeRow command', function() {

    var constructorThrowCheck = function(rowIndex, deltaY, throwMsg) {
      expect(function() {
        ResizeRow.create(rowIndex, deltaY);
      }).toThrow(throwMsg);
    };

    beforeEach(function() {
      Workbook.init();
    });

    afterEach(function() {
      Workbook.reset();
    });

    describe('creation', function() {
      it('constructor should throw if no row index is given as an argument',
         function() {
           constructorThrowCheck(undefined, 5,
           'ERROR: ResizeRow requires a row index');
         });

      it('constructor should throw if no height delta value is given as ' +
          'an argument', function() {
            constructorThrowCheck(1, undefined,
                'ERROR: ResizeRow requires a deltaY');
          });

      it('constructor should throw if an invalid row index is given as ' +
          'an argument', function() {
            constructorThrowCheck(1000, 5,
                'ERROR: ResizeRow requires a valid row index');
          });

      it('constructor should create a command successfully with ' +
          'valid parameters', function() {
            var rowIndex = 3;
            var deltaY = 15;
            var cmd = ResizeRow.create(rowIndex, deltaY);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('ResizeRow');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(true);
            expect(TypeUtils.isFunction(cmd.dcpData)).toBe(true);
            expect(TypeUtils.isFunction(cmd.doOptimistic)).toBe(true);
            expect(TypeUtils.isFunction(cmd.doRevert)).toBe(true);
            expect(TypeUtils.isFunction(cmd.getInverse)).toBe(true);
            expect(cmd.canInvert).toBe(true);
          });

      it('doOptimistic() method should dirty the document', function() {
        var rowIndex = 3;
        var deltaY = 20;
        var cmd = ResizeRow.create(rowIndex, deltaY);
        spyOn(PaneManager, 'resizeRow');
        expect(SaveStateManager.isSaved()).toBe(true);
        cmd.doOptimistic();
        expect(SaveStateManager.isSaved()).toBe(false);
      });

      it('doOptimistic() method talk to the pane manager', function() {
        var rowIndex = 4;
        var deltaY = 18;
        var cmd = ResizeRow.create(rowIndex, deltaY);
        spyOn(PaneManager, 'resizeRow');
        cmd.doOptimistic();
        expect(PaneManager.resizeRow).toHaveBeenCalledWith(rowIndex, deltaY);
      });
    });
  });
});
