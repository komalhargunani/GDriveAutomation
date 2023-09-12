// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit test case for TableStyleHelper
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/models/point',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/drawing/styles/tableStyles/tableCellStyleHelper'
], function(PointModel, TableStyleManager, TableCellStyleHelper) {

  'use strict';

  describe('TableStyle helper Test', function() {

    var _tableStyleManager = TableStyleManager;
    var _tableCellStyleHelper = TableCellStyleHelper;

    beforeEach(function() {
      PointModel.currentTable.noOfRows = 3;
      PointModel.currentTable.noOfCols = 3;
    });

    afterEach(function() {
      _tableStyleManager.resetTableProperties();
    });


    describe(' -getCornerTblCellStyle-', function() {

      it('Table part style type is -nwCell- if table has firstRow and ' +
          'firstColumn properties', function() {
            var row = 0;
            var col = 0;

            PointModel.currentTable.tableProps.firstRow = true;
            PointModel.currentTable.tableProps.firstCol = true;

            var tableCellPartStyle = _tableCellStyleHelper.
                getCornerTblCellStyle(row, col);
            expect(tableCellPartStyle).toEqual('nwCell');

            PointModel.currentTable.tableProps.firstRow = false;
            PointModel.currentTable.tableProps.firstCol = false;
          });

      it('Table part style type is -neCell- if table has firstRow and ' +
          'lastCol properties', function() {
            var row = 0;
            var col = 2;

            PointModel.currentTable.tableProps.firstRow = true;
            PointModel.currentTable.tableProps.lastCol = true;

            var tableCellPartStyle = _tableCellStyleHelper.
                getCornerTblCellStyle(row, col);
            expect(tableCellPartStyle).toEqual('neCell');

            PointModel.currentTable.tableProps.firstRow = false;
            PointModel.currentTable.tableProps.lastCol = false;
          });

      it('Table part style type is -swCell- if table has firstCol and ' +
          'lastRow properties', function() {
            var row = 2;
            var col = 0;

            PointModel.currentTable.tableProps.firstCol = true;
            PointModel.currentTable.tableProps.lastRow = true;

            var tableCellPartStyle = _tableCellStyleHelper.
                getCornerTblCellStyle(row, col);
            expect(tableCellPartStyle).toEqual('swCell');

            PointModel.currentTable.tableProps.firstCol = false;
            PointModel.currentTable.tableProps.lastRow = false;
          });

      it('Table part style type is -seCell- if table has lastRow and lastCol ' +
          'properties', function() {
            var row = 2;
            var col = 2;

            PointModel.currentTable.tableProps.lastRow = true;
            PointModel.currentTable.tableProps.lastCol = true;

            var tableCellPartStyle = _tableCellStyleHelper.
                getCornerTblCellStyle(row, col);
            expect(tableCellPartStyle).toEqual('seCell');

            PointModel.currentTable.tableProps.lastRow = false;
            PointModel.currentTable.tableProps.lastCol = false;
          });

    });

    describe(' -getBandRowStyle-', function() {

      it('Table part style type is -band1H- for first row if table has only ' +
          'bandRow properties', function() {
            var row = 0;

            PointModel.currentTable.tableProps.bandRow = true;

            var tableCellPartStyle = _tableCellStyleHelper.getBandRowStyle(row);
            expect(tableCellPartStyle).toEqual('band1H');

            PointModel.currentTable.tableProps.bandRow = false;
          });

      it('Table part style type is -band1H- for second row if table has ' +
          'firstRow and bandRow properties', function() {
            var row = 1;

            PointModel.currentTable.tableProps.firstRow = true;
            PointModel.currentTable.tableProps.bandRow = true;

            var tableCellPartStyle = _tableCellStyleHelper.getBandRowStyle(row);
            expect(tableCellPartStyle).toEqual('band1H');

            PointModel.currentTable.tableProps.firstRow = false;
            PointModel.currentTable.tableProps.bandRow = false;
          });

      it('Table part style type is -band2H- for second row if table has only ' +
          'bandRow properties', function() {
            var row = 1;
            PointModel.currentTable.tableProps.bandRow = true;

            var tableCellPartStyle = _tableCellStyleHelper.getBandRowStyle(row);
            expect(tableCellPartStyle).toEqual('band2H');

            PointModel.currentTable.tableProps.bandRow = false;
          });

    });

    describe(' -getBandColStyle-', function() {

      it('Table part style type is -band1V- for first column if table has ' +
          'only bandCol property', function() {
            var col = 0;

            PointModel.currentTable.tableProps.bandCol = true;

            var tableCellPartStyle = _tableCellStyleHelper.getBandColStyle(col);
            expect(tableCellPartStyle).toEqual('band1V');

            PointModel.currentTable.tableProps.bandCol = false;
          });

      it('Table part style type is -band1V- for second column if table has ' +
          'firstCol and bandCol properties', function() {
            var col = 1;

            PointModel.currentTable.tableProps.firstCol = true;
            PointModel.currentTable.tableProps.bandCol = true;

            var tableCellPartStyle = _tableCellStyleHelper.getBandColStyle(col);
            expect(tableCellPartStyle).toEqual('band1V');

            PointModel.currentTable.tableProps.firstCol = false;
            PointModel.currentTable.tableProps.bandCol = false;
          });

      it('Table part style type is -band2V- for second column if table has ' +
          'only bandCol properties', function() {
            var col = 1;
            PointModel.currentTable.tableProps.bandCol = true;

            var tableCellPartStyle = _tableCellStyleHelper.getBandColStyle(col);
            expect(tableCellPartStyle).toEqual('band2V');

            PointModel.currentTable.tableProps.bandCol = false;
          });
    });

    describe(' -getRowStyle-', function() {

      it('Table part style type of first row is -firstRow-  if table has ' +
          'firstRow property', function() {
            var row = 0;

            PointModel.currentTable.tableProps.firstRow = true;

            var tableCellPartStyle = _tableCellStyleHelper.getRowStyle(row);
            expect(tableCellPartStyle).toEqual('firstRow');

            PointModel.currentTable.tableProps.firstRow = false;
          });

      it('Table part style type of last row is -lastRow-  if table has ' +
          'lastRow property', function() {
            var row = 2;

            PointModel.currentTable.tableProps.lastRow = true;

            var tableCellPartStyle = _tableCellStyleHelper.getRowStyle(row);
            expect(tableCellPartStyle).toEqual('lastRow');

            PointModel.currentTable.tableProps.lastRow = false;
          });

    });

    describe(' -getColStyle-', function() {

      it('Table part style type of first column is -firstCol-  if table has ' +
          'firstCol property', function() {
            var col = 0;

            PointModel.currentTable.tableProps.firstCol = true;

            var tableCellPartStyle = _tableCellStyleHelper.getColStyle(col);
            expect(tableCellPartStyle).toEqual('firstCol');

            PointModel.currentTable.tableProps.firstCol = false;
          });

      it('Table part style type of last column is -lastCol-  if table has ' +
          'lastCol property', function() {
            var col = 2;

            PointModel.currentTable.tableProps.lastCol = true;

            var tableCellPartStyle = _tableCellStyleHelper.getColStyle(col);
            expect(tableCellPartStyle).toEqual('lastCol');

            PointModel.currentTable.tableProps.lastCol = false;
          });

    });

  });

});
