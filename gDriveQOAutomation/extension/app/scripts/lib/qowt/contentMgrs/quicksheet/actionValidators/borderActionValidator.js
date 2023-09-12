define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook'
], function(
    PaneManager,
    Workbook
) {
  var _api = {
    isValidAction: function(actionContext) {
      var fromRow = actionContext.fromRowIndex;
      var toRow = actionContext.toRowIndex;
      var fromCol = actionContext.fromColIndex;
      var toCol = actionContext.toColIndex;
      var borders = actionContext.formatting.borders;
      var selectedRowsSpan = toRow - fromRow + 1;
      var selectedColsSpan = toCol - fromCol + 1;
      var horizontalAllowed = false, verticalAllowed = false;

      if (fromRow === undefined && toRow === undefined) {
        fromRow = 0;
        toRow = Workbook.getNumOfRows();
      } else if (fromCol === undefined && toCol === undefined) {
        fromCol = 0;
        toCol = Workbook.getNumOfCols();
      }

      if (borders.hasOwnProperty('insideHorizontal') ||
        borders.hasOwnProperty('insideVertical')) {

        // The following condition validates the 'Horizontal' border depending
        // upon the actions done by the user. If Horizontal border is valid
        // with respect to the selection then we set the boolean
        // 'horizontalAllowed' to true. Following are some scenarios where the
        // whole action or part of it is invalid:
        // 1. User selects horizontal border to be applied to a single / merge
        //    cell or a row.
        // 2. User selects 'all borders' to be applied to a single / merge cell
        //    or a row.
        // 3. User selects inner_borders to be applied to a single / merge cell
        //    or a row.
        if (borders.hasOwnProperty('insideHorizontal') &&
          (!isSingleRowSelected(fromRow, toRow) &&
          !isSingleCellSelected(fromRow, toRow, fromCol, toCol,
          selectedRowsSpan, selectedColsSpan))) {
          horizontalAllowed = true;
        }

        // The following condition validates the 'Vertical' border depending
        // upon the actions done by the user. If Vertical border is valid
        // with respect to the selection then we set the boolean
        // 'verticalAllowed' to true. Following are some scenarios where the
        // whole action or part of it is invalid:
        // 1. User selects vertical border to be applied to a single / merge
        //    cell or a column.
        // 2. User selects 'all borders' to be applied to a single / merge cell
        //    or a column.
        // 3. User selects inner_borders to be applied to a single / merge cell
        //    or a column.
        if (borders.hasOwnProperty('insideVertical') &&
          (!isSingleColumnSelected(fromCol, toCol) &&
            !isSingleCellSelected(fromRow, toRow, fromCol, toCol,
              selectedRowsSpan, selectedColsSpan))) {
          verticalAllowed = true;
        }
      } else {
        horizontalAllowed = true;
        verticalAllowed = true;
      }
      return horizontalAllowed || verticalAllowed;
    }
  };


  /**
   *
   * @param {number} fromRow - The index of the row of the upper-left cell
   * @param {number} toRow - The index of the row of the lower-right cell
   * @return {boolean} - it specifies whether a single row is selected.
   */
  function isSingleRowSelected(fromRow, toRow) {
    return fromRow - toRow === 0;
  }


  /**
   *
   * @param {number} fromCol - The index of the col of the upper-left cell
   * @param {number} toCol - The index of the col of the lower-right cell
   * @return {boolean} - it specifies whether a single column is selected.
   */
  function isSingleColumnSelected(fromCol, toCol) {
    return fromCol - toCol === 0;
  }


  /**
   *
   * @param {number} fromRow - The index of the row of the upper-left cell
   * @param {number} toRow - The index of the row of the lower-right cell
   * @param {number} fromCol - The index of the col of the upper-left cell
   * @param {number} toCol - The index of the col of the lower-right cell
   * @param {number} selectedRowsSpan - The total number of rows in the
   *    selection
   * @param {number} selectedColsSpan - The total number of columns in the
   *    selection
   * @return {boolean} result - it specifies if a single cell is selected
   */
  function isSingleCellSelected(fromRow, toRow, fromCol, toCol,
                                selectedRowsSpan, selectedColsSpan) {
    var singleRowSelected = isSingleRowSelected(fromRow, toRow);
    var singleColumnSelected = isSingleColumnSelected(fromCol, toCol);
    var result = false;
    var row = Workbook.getRow(fromRow);
    var cellObj = row.getCell(fromCol);
    if (singleColumnSelected && singleRowSelected) {
      result = true;
    } else if (cellObj && cellObj.config_.isMergeAnchor) {
      var floaterMgr = PaneManager.getMainPane().getFloaterManager();
      var floater = floaterMgr.findContainingFloater(fromRow, fromCol);
      if (floater && floater.getType() === 'sheetFloaterMergeCell') {
        var rowSpan = floater.rowSpan();
        var colSpan = floater.colSpan();
        result = (rowSpan === selectedRowsSpan && colSpan === selectedColsSpan);
      }
    }
    return result;
  }

  return _api;
});
