/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview - This file contents Unit tests for sheetCellHandler.
 *
 * @author alok.guha@synerzip.com (Alok Guha)
 */
define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/dcp/sheetCellHandler',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/fixtures/sheet/sheetCellElementFixture',
  'qowtRoot/models/dcp',
  'qowtRoot/variants/configs/sheet'], function (
    PaneManager,
    Workbook,
    SheetCellHandler,
    ErrorCatcher,
    QOWTSilentError,
    CellFixture,
    DcpModel,
    SheetConfig) {
  'use strict';

  describe('sheet cell DCP Handler tests', function () {
    var handler, index = 1, text = 'someText', editText = 'someText', cell, v,
        containerDiv, cellDCP,
        leftNeighbour = 0,
        rightNeighbour = 2,
        cellFormatting = {rotationAngle: 45};

    beforeEach(function () {
      Workbook.init();
      DcpModel.dcpHandlingRow = 4;
      handler = SheetCellHandler;
      containerDiv = document.createElement('div');
      v = {node: containerDiv};
    });

    afterEach(function () {
      handler = undefined;
      containerDiv = undefined;
      DcpModel.dcpHandlingRow = undefined;
      v = undefined;
      cellDCP = undefined;
    });

    it('should add a new cell at 4,1 as provided config', function () {
      cellDCP = CellFixture.sheetCellElement(index, text, editText,
          leftNeighbour, rightNeighbour, cellFormatting);
      v.el = cellDCP;
      handler.visit(v);
      cell = PaneManager.getActivePane().getRow(4).getCell(1);
      expect(cell).toBeDefined();
      expect(cell.x).toBe(1);
      expect(cell.y).toBe(4);
      expect(cell.cellText).toBe("someText");
      expect(cell.editableText_).toBe("someText");
      expect(cell.rightNeighbourIndex).toBe(2);
      expect(cell.leftNeighbourIndex).toBe(0);
      expect(cell.rotationAngle).toBe(45);
    });

    it('should consider rightNeighbourIndex as ' +
      'SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS, if provided value exceeds ' +
      'maximum no of allowed columns', function () {
      rightNeighbour = 257; // exceeding the value of
      // SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS (256)
      cellDCP = CellFixture.sheetCellElement(index, text, editText,
          leftNeighbour, rightNeighbour, cellFormatting);
      v.el = cellDCP;
      handler.visit(v);
      cell = PaneManager.getActivePane().getRow(4).getCell(1);
      expect(cell).toBeDefined();
      expect(cell.rightNeighbourIndex).
          toBe(SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS);
    });

    it('should assign default values to left and right neighbour indexes and ' +
        'throw silent error to GA if left and right neighbour information is ' +
        'not sent from core', function() {
      leftNeighbour = undefined;
      rightNeighbour = undefined;
      cellFormatting = undefined;
      var defaultLeftNeighbour = -1;
      spyOn(ErrorCatcher, 'handleError');
      cellDCP = CellFixture.sheetCellElement(index, text, editText,
          leftNeighbour, rightNeighbour, cellFormatting);
      v.el = cellDCP;
      handler.visit(v);
      cell = PaneManager.getActivePane().getRow(4).getCell(1);
      expect(cell).toBeDefined();
      expect(cell.leftNeighbourIndex).toBe(defaultLeftNeighbour);
      expect(cell.rightNeighbourIndex).
          toBe(SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS);

      runs(function() {
        expect(ErrorCatcher.handleError).toHaveBeenCalled();
        expect(ErrorCatcher.handleError.callCount).toBe(2);

        expect(ErrorCatcher.handleError.argsForCall[0][0]).
            toEqual(new QOWTSilentError('Left neighbour index is undefined.'));
        expect(ErrorCatcher.handleError.argsForCall[1][0]).
            toEqual(new QOWTSilentError('Right neighbour index is undefined.'));
        expect(ErrorCatcher.handleError.mostRecentCall.args[0]).
            toEqual(ErrorCatcher.handleError.argsForCall[1][0]);
      });
    });
  });
});