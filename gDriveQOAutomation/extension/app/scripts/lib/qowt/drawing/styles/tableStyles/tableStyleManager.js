// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview TableStyleManager caches table style,finds and applies table
 * part style to the table cell.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/models/point',
  'qowtRoot/drawing/styles/tableStyles/tableStyleClassFactory',
  'qowtRoot/drawing/styles/tableStyles/tableCellStyleHelper',
  'qowtRoot/drawing/styles/tableStyles/tableCellBorderDefinitions'
], function(
    PointModel,
    TableStyleClassFactory,
    TableCellStyleHelper,
    TableCellBorderDefinitions) {

  'use strict';

  var _tableStyleClassPrefix;
  var _appliedTablePartStyles;
  var _cachedTableStyles = {};
  var _tblStyleClassPrefixMap = {};

  var _api = {

    styleType: {
      cellTextStyle: 'txStyle',
      cellFillStyle: 'fillStyle',
      tblBgFillStyle: 'bgFillStyle',
      cellOutlineStyle: 'outlineStyle'
    },

    /**
     * Caches the table style.
     * @param {Object} tableStyleObj - the text style JSON object.
     */
    cacheTableStyles: function(tableStyleObj) {
      _cachedTableStyles[tableStyleObj.styleId] = tableStyleObj;
    },

    /**
     * Returns the cached table style.
     * @param styleId - style-id of the table-style to fetch
     * @return cached table style for given id
     */
    getCachedTableStyles: function(styleId) {
      return _cachedTableStyles[styleId];
    },

    /**
     * Resets the table styles cache
     */
    resetTableStylesCache: function() {
      _cachedTableStyles = {};
    },

    /**
     * Determines which table part style to apply to cell depending upon it's
     * position and table properties.
     * @param currentRow - the current row
     * @param currentCol - the current column
     */
    findTblPartStyleToApply: function() {
      var currentRow = PointModel.currentTable.currentRow;
      var currentCol = PointModel.currentTable.currentCol;

      _appliedTablePartStyles = [];
      _appliedTablePartStyles.push(TableCellStyleHelper.
          getCornerTblCellStyle(currentRow, currentCol));
      _appliedTablePartStyles.push(TableCellStyleHelper.
          getRowStyle(currentRow));
      _appliedTablePartStyles.push(TableCellStyleHelper.
          getColStyle(currentCol));
      _appliedTablePartStyles.push(TableCellStyleHelper.
          getBandColStyle(currentCol));
      _appliedTablePartStyles.push(TableCellStyleHelper.
          getBandRowStyle(currentRow));
      _appliedTablePartStyles.push(TableStyleClassFactory.wholeTbl.type);
    },

    /**
     * Applies the table cell style classes (text style, fill style and outline
     * style) to the html-element
     * @param htmlElement {HTML} html-element to apply the style class to
     * @param styleType {txStyle, fillStyle, lineStyle or table background
     *        style}
     */
    applyTblCellStyleClasses:
        function(htmlElement, styleType, rowSpan, colSpan) {
      var tablePartStyle;
      for (var i = 0; i <= _appliedTablePartStyles.length; i++) {
        tablePartStyle = _appliedTablePartStyles[i];
        if (tablePartStyle) {
          if (styleType === _api.styleType.cellFillStyle) {
            htmlElement.className +=
                (' ' + TableStyleClassFactory[tablePartStyle].
                    getCellFillStyleClassName(_tableStyleClassPrefix));
          } else if (styleType === _api.styleType.cellTextStyle) {
            htmlElement.className +=
                (' ' + TableStyleClassFactory[tablePartStyle].
                    getCellTxRunStyleClassName(_tableStyleClassPrefix));
          } else if (styleType === _api.styleType.cellOutlineStyle) {
            var cellPosition =
                TableCellStyleHelper.getTblCellPosition(tablePartStyle);
            htmlElement.className +=
                (' ' + TableStyleClassFactory[tablePartStyle].
                    getCellOutlineStyleClassName(_tableStyleClassPrefix,
                    cellPosition));

            //If the cell has rowSpan apply border classes of the table part
            // style to which it spans
            if (rowSpan) {
              cellPosition =
                  TableCellBorderDefinitions.
                      partTypeToCellPositionMap[tablePartStyle].
                        computeCellPosition(
                          (PointModel.currentTable.currentRow + rowSpan - 1),
                           PointModel.currentTable.currentCol);
              htmlElement.className +=
                  (' ' + TableStyleClassFactory[tablePartStyle].
                      getCellOutlineStyleClassName(_tableStyleClassPrefix,
                        cellPosition));
            }

            if (colSpan) {
              cellPosition =
                  TableCellBorderDefinitions.
                      partTypeToCellPositionMap[tablePartStyle].
                        computeCellPosition(PointModel.currentTable.currentRow,
                          (PointModel.currentTable.currentCol + colSpan - 1));
              htmlElement.className +=
                  (' ' + TableStyleClassFactory[tablePartStyle].
                      getCellOutlineStyleClassName(_tableStyleClassPrefix,
                      cellPosition));
            }
          }
        }
      }
    },

    /**
     * Applies the table backgroud style classes to the table html-element
     * @param htmlElement {HTML} html-element to apply the style class to
     * @param styleType {table background style}
     */
    applyTblBgStyleClasses: function(htmlElement, styleType) {
      if (styleType === _api.styleType.tblBgFillStyle &&
          _tableStyleClassPrefix) {
        htmlElement.className +=
            (' ' + TableStyleClassFactory.tblBg.
                getBgFillStyleClassName(_tableStyleClassPrefix));
      }
    },


    /**
     * Set the current table properties (like bandRow,bandCol, firstRow,
     * firstCol, lastRow, lastCol)
     * @param tablePropObj {object} TableProperties json
     * @param noOfRows total number of rows
     * @param noOfCols total number of columns
     */
    updateTableProperties: function(tablePropObj, noOfRows, noOfCols) {
      if (tablePropObj) {
        PointModel.currentTable.tableProps.firstRow =
          tablePropObj.firstRow ? true : false;
        PointModel.currentTable.tableProps.firstCol =
          tablePropObj.firstCol ? true : false;
        PointModel.currentTable.tableProps.lastRow =
          tablePropObj.lastRow ? true : false;
        PointModel.currentTable.tableProps.lastCol =
          tablePropObj.lastCol ? true : false;
        PointModel.currentTable.tableProps.bandRow =
          tablePropObj.bandRow ? true : false;
        PointModel.currentTable.tableProps.bandCol =
          tablePropObj.bandCol ? true : false;

        //update the number of rows and columns
        PointModel.currentTable.noOfRows = noOfRows;
        PointModel.currentTable.noOfCols = noOfCols;
      }
    },

    /**
     * Reset the table properties.
     */
    resetTableProperties: function() {
      PointModel.currentTable.tableProps.firstRow = false;
      PointModel.currentTable.tableProps.firstCol = false;
      PointModel.currentTable.tableProps.lastRow = false;
      PointModel.currentTable.tableProps.lastCol = false;
      PointModel.currentTable.tableProps.bandRow = false;
      PointModel.currentTable.tableProps.bandCol = false;

      //Reset the number of Rows and Column
      PointModel.currentTable.noOfRows = undefined;
      PointModel.currentTable.noOfCols = undefined;

      //Reset the currentRow and currentCol
      PointModel.currentTable.currentRow = undefined;
      PointModel.currentTable.currentCol = undefined;

      //Reset the table style class prefix
      _tableStyleClassPrefix = undefined;
    },

    /**
     * Get the style class name for Table style
     * @param tableStyleId {String} - table style id
     */
    computeClassPrefix: function(tableStyleId) {
      var firstIndex = tableStyleId.indexOf('{') + 1;
      var lastIndex = tableStyleId.indexOf('}');

      if (PointModel.currentPHLevel === 'sld' &&
          PointModel.slideColorMap[PointModel.SlideId]) {
        _tableStyleClassPrefix =
            "tblStyl_" + PointModel.MasterSlideId + "_" +
                PointModel.SlideLayoutId + "_" + PointModel.SlideId + "_" +
                  tableStyleId.substring(firstIndex, lastIndex);
      } else if ((PointModel.currentPHLevel === 'sldlt' ||
          PointModel.currentPHLevel === 'sld') &&
          PointModel.slideLayoutMap[PointModel.SlideLayoutId].clrMap) {
        _tableStyleClassPrefix =
            "tblStyl_" + PointModel.MasterSlideId + "_" +
                PointModel.SlideLayoutId + "_" +
                tableStyleId.substring(firstIndex, lastIndex);
      } else {
        _tableStyleClassPrefix =
            "tblStyl_" + PointModel.MasterSlideId + "_" +
                tableStyleId.substring(firstIndex, lastIndex);
      }
    },

    /**
     * get the table style prefix which was set using 'setClassPrefix'
     */
    getClassPrefix: function() {
      return _tableStyleClassPrefix;
    },

    /**
     * Checks whether there is need to create css for tablestyle. If yes, then
     * add current table style Id to list.
     * @param tableStyleId
     * @return true if need to creat Css, otherwise false
     */
    shouldCreateCssForTableStyle: function(/* styleId */) {
        //First check for current slide-master there is entry of tableStyle. If
        // not, then create  the css for current table style.
        if (!_tblStyleClassPrefixMap[_tableStyleClassPrefix]) {
          _tblStyleClassPrefixMap[_tableStyleClassPrefix] =
              _tableStyleClassPrefix;
          return true;
        }
      return false;
    }

  };

  return _api;
});
