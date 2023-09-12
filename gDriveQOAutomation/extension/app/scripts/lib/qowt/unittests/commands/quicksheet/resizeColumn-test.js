/*
 * Test suite for ResizeColumn command
 */

define([
  'qowtRoot/commands/quicksheet/resizeColumn',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/savestate/saveStateManager',
  'qowtRoot/utils/typeUtils'
], function(
    ResizeColumn,
    Workbook,
    PaneManager,
    SaveStateManager,
    TypeUtils) {

  'use strict';

  describe('ResizeColumn command', function() {

    var constructorThrowCheck = function(colIndex, deltaX, throwMsg) {
      expect(function() {
        ResizeColumn.create(colIndex, deltaX);
      }).toThrow(throwMsg);
    };

    beforeEach(function() {
      Workbook.init();
    });

    afterEach(function() {
      Workbook.reset();
    });

    describe('creation', function() {
      it('constructor should throw if no column index is given as ' +
          'an argument', function() {
            constructorThrowCheck(undefined, 5,
                'ERROR: ResizeColumn requires a column index');
          });

      it('constructor should throw if no width delta value is given as an ' +
          'argument', function() {
            constructorThrowCheck(1, undefined,
                'ERROR: ResizeColumn requires a width delta value');
          });

      it('constructor should throw if an invalid column index is given as ' +
          'an argument', function() {
            constructorThrowCheck(500, 10,
                'ERROR: ResizeColumn requires a valid column index');
          });

      it('constructor should create a command successfully with ' +
          'valid parameters', function() {
            var colIndex = 1;
            var deltaX = 10;
            var cmd = ResizeColumn.create(colIndex, deltaX);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('ResizeColumn');
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
        var colIndex = 1;
        var deltaX = 10;
        var cmd = ResizeColumn.create(colIndex, deltaX);
        spyOn(PaneManager, 'resizeColumn');
        expect(SaveStateManager.isSaved()).toBe(true);
        cmd.doOptimistic();
        expect(SaveStateManager.isSaved()).toBe(false);
      });

      it('doOptimistic() method talk to the pane manager', function() {
        var colIndex = 1;
        var deltaX = 10;
        var cmd = ResizeColumn.create(colIndex, deltaX);
        spyOn(PaneManager, 'resizeColumn');
        cmd.doOptimistic();
        expect(PaneManager.resizeColumn).
            toHaveBeenCalledWith(colIndex, deltaX);
      });
    });
  });
});
