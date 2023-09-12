// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Helper class to get the appropariate table cell style
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/drawing/styles/tableStyles/tableStyleClassFactory',
  'qowtRoot/drawing/styles/tableStyles/tableCellBorderDefinitions'
], function(
    PointModel,
    TableStyleClassFactory,
    TableCellBorderDefinitions) {

  'use strict';


  var _api = {

    /**
     * Returns the table corner cell part Style (neCell,nwCell, seCell, swCell).
     * @param currentRow - the current row
     * @param currentCol - the current column
     */
    getCornerTblCellStyle: function(currentRow, currentCol) {
      var tblCornerStyle;

      if (currentRow === 0 && PointModel.currentTable.tableProps.firstRow) {
        if (currentCol === 0 && PointModel.currentTable.tableProps.firstCol) {
          tblCornerStyle = TableStyleClassFactory.nwCell.type;
        } else if (currentCol === (PointModel.currentTable.noOfCols - 1) &&
            PointModel.currentTable.tableProps.lastCol) {
          tblCornerStyle = TableStyleClassFactory.neCell.type;
        }
      } else if (currentRow === (PointModel.currentTable.noOfRows - 1) &&
          PointModel.currentTable.tableProps.lastRow) {
        if (currentCol === 0 && PointModel.currentTable.tableProps.firstCol) {
          tblCornerStyle = TableStyleClassFactory.swCell.type;
        } else if (currentCol === (PointModel.currentTable.noOfCols - 1) &&
            PointModel.currentTable.tableProps.lastCol) {
          tblCornerStyle = TableStyleClassFactory.seCell.type;
        }
      }

      return tblCornerStyle;
    },

    /**
     * Returns the Row style (firstRow or lastRow)
     * @param currentRow
     */
    getRowStyle: function(currentRow) {
      var rowStyle;
      if (currentRow === 0 && PointModel.currentTable.tableProps.firstRow) {
        rowStyle = TableStyleClassFactory.firstRow.type;
      } else if (currentRow === (PointModel.currentTable.noOfRows - 1) &&
          PointModel.currentTable.tableProps.lastRow) {
        rowStyle = TableStyleClassFactory.lastRow.type;
      }
      return rowStyle;
    },

    /**
     * Returns the column style (firstColumn or lastColumn)
     * @param currentCol
     */
    getColStyle: function(currentCol) {
      var colStyle;
      if (currentCol === 0 && PointModel.currentTable.tableProps.firstCol) {
        colStyle = TableStyleClassFactory.firstCol.type;
      } else if (currentCol === (PointModel.currentTable.noOfCols - 1) &&
          PointModel.currentTable.tableProps.lastCol) {
        colStyle = TableStyleClassFactory.lastCol.type;
      }
      return colStyle;
    },

    /**
     * Returns the applied band part type to column
     * @param currentRow
     */
    getBandRowStyle: function(currentRow) {
      var bandRow;
      if (PointModel.currentTable.tableProps.bandRow) {
        if (PointModel.currentTable.tableProps.firstRow) {
          bandRow =
              ((currentRow % 2) !== 0 ) ? TableStyleClassFactory.band1H.type :
                  TableStyleClassFactory.band2H.type;
        } else {
          bandRow =
              ((currentRow % 2) === 0 ) ? TableStyleClassFactory.band1H.type :
                  TableStyleClassFactory.band2H.type;
        }
      }
      return bandRow;
    },

    /**
     * Returns the applied band part type to column
     * @param currentCol
     */
    getBandColStyle: function(currentCol) {
      var bandCol;
      if (PointModel.currentTable.tableProps.bandCol) {
        if (PointModel.currentTable.tableProps.firstCol) {
          bandCol =
              ((currentCol % 2) !== 0 ) ? TableStyleClassFactory.band1V.type :
                  TableStyleClassFactory.band2V.type;
        } else {
          bandCol =
              ((currentCol % 2) === 0 ) ? TableStyleClassFactory.band1V.type :
                  TableStyleClassFactory.band2V.type;
        }
      }
      return bandCol;
    },

    /**
     * Returns the poition of cell in table as per given row and column.
     * @param tablePartStyle
     */
    getTblCellPosition: function(tablePartStyle) {
      var currentRow = PointModel.currentTable.currentRow;
      var currentCol = PointModel.currentTable.currentCol;
      var cellPosition =
          TableCellBorderDefinitions.partTypeToCellPositionMap[tablePartStyle].
              computeCellPosition(currentRow, currentCol);

      return cellPosition;
    }


  };

  return _api;
});
