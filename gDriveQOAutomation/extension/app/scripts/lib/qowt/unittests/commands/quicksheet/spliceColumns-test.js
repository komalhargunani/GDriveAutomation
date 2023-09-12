// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the spliceColumns command
 */

define([
  'qowtRoot/commands/quicksheet/spliceColumns',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/models/sheet',
  'qowtRoot/controls/grid/paneManager'
], function(spliceColumns, Workbook, SheetModel, PaneManager) {

  'use strict';

  describe('spliceColumns command', function() {
    beforeEach(function() {
      SheetModel.activeSheetIndex = 1;
      Workbook.init();
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
      Workbook.reset();
    });

    describe('creation', function() {
      it('constructor should throw if index is not given as an argument',
          function() {
            expect(function() {
              spliceColumns.create(undefined, 2);
            }).toThrow('ERROR: SpliceColumns requires index');
          });
      it('constructor should create a command even if numOfCols is missing',
          function() {
            var cmd = spliceColumns.create(2);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SpliceCols');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.onSuccess).toBeDefined();
            expect(cmd.dcpData().name).toBe('spc');
            expect(cmd.dcpData().si).toBe(1);
            expect(cmd.dcpData().ci).toBe(2);
            expect(cmd.dcpData().nu).toBe(1);
            expect(cmd.dcpData().de).toBe(undefined);
          });
      it('constructor should create a insert command if valid parameters ' +
          'are specified', function() {
            var cmd = spliceColumns.create(3, 4);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SpliceCols');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.onSuccess).toBeDefined();
            expect(cmd.dcpData().name).toBe('spc');
            expect(cmd.dcpData().si).toBe(1);
            expect(cmd.dcpData().ci).toBe(3);
            expect(cmd.dcpData().nu).toBe(4);
            expect(cmd.dcpData().de).toBe(undefined);
          });
      it('constructor should create a delete command if valid parameters ' +
          'are specified', function() {
            var cmd = spliceColumns.create(2, 4, true);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SpliceCols');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.onSuccess).toBeDefined();
            expect(cmd.dcpData().name).toBe('spc');
            expect(cmd.dcpData().si).toBe(1);
            expect(cmd.dcpData().ci).toBe(2);
            expect(cmd.dcpData().nu).toBe(4);
            expect(cmd.dcpData().de).toBe(true);
          });
      it("doOptimistic should call pane manager's correct method in case of " +
          'insert', function() {
            spyOn(PaneManager, 'deleteColumns').andCallFake(
                function() {return 0;});
            spyOn(PaneManager, 'insertColumns').andCallFake(
                function() {return 0;});
            var cmd = spliceColumns.create(2, 4);
            cmd.doOptimistic();
            expect(PaneManager.deleteColumns).not.toHaveBeenCalled();
            expect(PaneManager.insertColumns).toHaveBeenCalled();
          });
      it("doOptimistic should call pane manager's correct method in case of " +
          'delete', function() {
            spyOn(PaneManager, 'deleteColumns').andCallFake(
                function() {return 0;});
            spyOn(PaneManager, 'insertColumns').andCallFake(
                function() {return 0;});
            var cmd = spliceColumns.create(2, 4, true);
            cmd.doOptimistic();
            expect(PaneManager.deleteColumns).toHaveBeenCalled();
            expect(PaneManager.insertColumns).not.toHaveBeenCalled();
          });
      it("doRevert should call pane manager's correct method in case of insert",
          function() {
            spyOn(PaneManager, 'deleteColumns').andCallFake(function() {
              return 0;
            });
            spyOn(PaneManager, 'insertColumns').andCallFake(function() {
              return {operation: 'insert'};
            });
            var cmd = spliceColumns.create(2, 4);
            cmd.doOptimistic();
            cmd.doRevert();
            expect(PaneManager.deleteColumns).toHaveBeenCalled();
            expect(PaneManager.insertColumns).toHaveBeenCalled();
          });
      it("doRevert should call pane manager's correct method in case of delete",
          function() {
            spyOn(PaneManager, 'insertColumns').andCallFake(function() {
              return 0;
            });
            spyOn(PaneManager, 'deleteColumns').andCallFake(function() {
              return {operation: 'delete'};
            });
            var cmd = spliceColumns.create(2, 4, true);
            cmd.doOptimistic();
            cmd.doRevert();
            expect(PaneManager.deleteColumns).toHaveBeenCalled();
            expect(PaneManager.insertColumns).toHaveBeenCalled();
          });
    });
  });
});

