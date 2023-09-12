// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview TableCellBorderDefintion defines cell border defintion as per
 * table style partType
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/models/point'
], function(PointModel) {

  'use strict';

  /**
   * Return the cell position for wholeTbl part style as per current row and
   * curent column
   * @param currentRow - The currnet Row
   * @param currentCol - The current column
   * @return cellPosition - Position of cell (top_left, top_right, top_center,
   *                        bottom_left, bottom_right, bottom_center, left,
   *                        right, center)
   */
  var _computeWholeTblCellPosition = function(currentRow, currentCol) {
    var cellPosition;

    if (currentRow === 0) {
      if (currentCol === 0) {
        cellPosition = 'top_left';
      } else if (currentCol === (PointModel.currentTable.noOfCols - 1)) {
        cellPosition = 'top_right';
      } else {
        cellPosition = "top_center";
      }
    } else if (currentRow === (PointModel.currentTable.noOfRows - 1)) {
      if (currentCol === 0) {
        cellPosition = "bottom_left";
      } else if (currentCol === (PointModel.currentTable.noOfCols - 1)) {
        cellPosition = 'bottom_right';
      } else {
        cellPosition = "bottom_center";
      }
    } else if (currentRow !== 0) {
      if (currentCol === 0) {
        cellPosition = "left";
      } else if (currentCol === (PointModel.currentTable.noOfCols - 1)) {
        cellPosition = "right";
      } else {
        cellPosition = "center";
      }
    }
    return cellPosition;
  };

  /**
   * Return the cell poition for Row part types (band1H, band2H, firstRow,
   * lastRow)
   * @param currentRow - The current row
   * @param currentCol - The current column
   * @return cellPosition - The position of cell in a Row (left, right, center)
   */
  var _computeRowWiseCellPosition = function(currentRow, currentCol) {
    currentRow = currentRow || 0;
    var cellPosition;
    if (currentCol === 0) {
      cellPosition = "left";
    } else if (currentCol === (PointModel.currentTable.noOfCols - 1)) {
      cellPosition = "right";
    } else if (currentCol !== (PointModel.currentTable.noOfCols - 1)) {
      cellPosition = "center";
    }
    return cellPosition;
  };

  /**
   * Return the cell position for column part types (band1V, band2V, firstCol,
   * lastCol)
   * @param currentRow - The current Row
   * @param currentCol - The current column
   * @reuturn cellPosition - the position of cell in column (top, center,
   *          bottom)
   */
  var _computeColumnWiseCellPosition = function(currentRow /* currentCol */) {
    var cellPosition;
    if (currentRow === 0) {
      cellPosition = "top";
    } else if (currentRow === (PointModel.currentTable.noOfRows - 1)) {
      cellPosition = "bottom";
    } else if (currentRow !== (PointModel.currentTable.noOfRows - 1)) {
      cellPosition = "center";
    }
    return cellPosition;
  };

  /**
   * Returns the cell position for corner cell part Types (seCell,swCell, neCell
   * ,nwCell)
   * @param currentRow
   * @param currentCol
   */
  var _computeCornerCellPosition = function(/* currentRow, currentCol */) {
    return "corner";
  };

  /**
   * Row wise part type definitions (band1H,band2H,firstRow,lastRow)
   */
  var _rowPartTypesDefinition = {
    left: {top: 'top', left: 'left', right: 'insideV', bottom: 'bottom'},
    right: {top: 'top', left: 'insideV', right: 'right', bottom: 'bottom'},
    center: {top: 'top', left: 'insideV', right: 'insideV', bottom: 'bottom'}
  };

  /**
   * Column wise part type definitions (band1V,band2V,firstCol,lastCol)
   */
  var _columnPartTypesDefinition = {
    top: {top: 'top', left: 'left', right: 'right', bottom: 'insideH'},
    center: {top: 'insideH', left: 'left', right: 'right', bottom: 'insideH'},
    bottom: {top: 'insideH', left: 'left', right: 'right', bottom: 'bottom'}
  };

  /**
   * Corner wise part type definition (seCell,swCell, neCell, nwCell)
   */
  var _cornerPartTypesDefinition = {
    corner: {top: 'top', left: 'left', right: 'right', bottom: 'bottom'}
  };


  var _api = {

    /**
     * Table cell border defintions as per cell position for each part type.
     */
    cellBdrDefinitionPerPosition: {
      wholeTbl: {
        top_left:
          {top: 'top', left: 'left', right: 'insideV', bottom: 'insideH'},
        top_right:
          {top: 'top', left: 'insideV', right: 'right', bottom: 'insideH'},
        top_center:
          {top: 'top', left: 'insideV', right: 'insideV', bottom: 'insideH'},
        left:
          {top: 'insideH', left: 'left', right: 'insideV', bottom: 'insideH'},
        right:
          {top: 'insideH', left: 'insideV', right: 'right', bottom: 'insideH'},
        center:
          {
            top: 'insideH', left: 'insideV', right: 'insideV', bottom: 'insideH'
          },
        bottom_left:
          {top: 'insideH', left: 'left', right: 'insideV', bottom: 'bottom'},
        bottom_right:
          {top: 'insideH', left: 'insideV', right: 'right', bottom: 'bottom'},
        bottom_center:
          {top: 'insideH', left: 'insideV', right: 'insideV', bottom: 'bottom'}
      },
      band1H: _rowPartTypesDefinition,
      band2H: _rowPartTypesDefinition,
      firstRow: _rowPartTypesDefinition,
      lastRow: _rowPartTypesDefinition,
      firstCol: _columnPartTypesDefinition,
      lastCol: _columnPartTypesDefinition,
      band1V: _columnPartTypesDefinition,
      band2V: _columnPartTypesDefinition,
      seCell: _cornerPartTypesDefinition,
      swCell: _cornerPartTypesDefinition,
      neCell: _cornerPartTypesDefinition,
      nwCell: _cornerPartTypesDefinition
    },

    /**
     * Call the proper method to get the cell position as per part type
     */
    partTypeToCellPositionMap: {
      wholeTbl: {
        computeCellPosition: _computeWholeTblCellPosition
      },
      band1H: {
        computeCellPosition: _computeRowWiseCellPosition
      },
      band2H: {
        computeCellPosition: _computeRowWiseCellPosition
      },
      firstRow: {
        computeCellPosition: _computeRowWiseCellPosition
      },
      lastRow: {
        computeCellPosition: _computeRowWiseCellPosition
      },
      firstCol: {
        computeCellPosition: _computeColumnWiseCellPosition
      },
      lastCol: {
        computeCellPosition: _computeColumnWiseCellPosition
      },
      band1V: {
        computeCellPosition: _computeColumnWiseCellPosition
      },
      band2V: {
        computeCellPosition: _computeColumnWiseCellPosition
      },
      seCell: {
        computeCellPosition: _computeCornerCellPosition
      },
      swCell: {
        computeCellPosition: _computeCornerCellPosition
      },
      neCell: {
        computeCellPosition: _computeCornerCellPosition
      },
      nwCell: {
        computeCellPosition: _computeCornerCellPosition
      }
    }

  };

  return _api;
});

