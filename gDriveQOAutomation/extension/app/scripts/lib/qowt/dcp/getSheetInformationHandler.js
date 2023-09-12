/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Constructor for the GetSheetInformation DCP Handler.
 * This handler processes the DCP response for a
 * GetSheetInformation command in its visit() method
 *
 * @constructor
 * @return {object} A GetSheetInformation DCP handler
 */
define([
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/features/utils',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/tools/toolManager'
], function(
    Workbook,
    UnitConversionUtils,
    SheetSelectionManager,
    Features,
    SheetModel,
    SheetConfig,
    ToolsManager) {

  'use strict';

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'gsi',

    /**
     * Processes the DCP response for a 'get sheet information' command.
     * This involves updating the sheet model with retrieved information
     * about the sheet, ensuring that the grid has enough rows to display
     * the sheet's content and setting the correct columns widths
     *
     * @param v {object}   The DCP response as a nested JSON object
     * @return {undefined} No object is returned
     */
    visit: function(v) {
      if (!v || !v.el || !v.el.etp || (v.el.etp !== 'gsi')) {
        return undefined;
      }

      var frozenRowIdx = (v.el.fp !== undefined) ? v.el.fp.ri : undefined;
      var frozenColIdx = (v.el.fp !== undefined) ? v.el.fp.ci : undefined;
      Workbook.setFrozenRowIndex(frozenRowIdx);
      Workbook.setFrozenColumnIndex(frozenColIdx);

      SheetModel.numberOfNonEmptyRows = v.el.rc || 0;
      SheetModel.numberOfNonEmptyCols = v.el.cc || 0;

      // 'urh' will be true if rows are hidden by default.
      // This setting is an optimization used when most rows of the sheet
      // are hidden.
      // In this case, instead of writing out every row and
      // specifying hidden, it is much shorter to only have rows that
      // are not hidden, and specify here that rows are hidden by default,
      // and only not hidden if specified.
      SheetModel.rowsHiddenByDefault =
          (v.el.df !== undefined) ? v.el.df.urh : false;


      var defaults = v.el.df;

      // convert the defaultRowHeight from point units to pixel units
      var defaultRowHeight =
                         UnitConversionUtils.convertPointToPixel(defaults.rh);

      // convert the defaultColWidth from point units to pixel units
      var defaultColWidth =
                         UnitConversionUtils.convertPointToPixel(defaults.cw);

      Workbook.setDefaultRowHeight(defaultRowHeight);
      Workbook.setDefaultColumnWidth(defaultColWidth);

      SheetModel.defaultFormatting = defaults.fm;

      if (v.el.hgl) {//hide grid lines.
        Workbook.hideGridLines();
      }

      // if required, increase the number of rows in the baseDiv grid element
      // now that we have the real data from the service on the sheet's last
      // non-empty row
      Workbook.ensureMinimalRowCount(SheetModel.numberOfNonEmptyRows - 1);

      // there is a default column width for all columns
      var numOfCols = SheetConfig.kGRID_DEFAULT_COLS;
      var columnWidths = [];
      for (var colIndex = 0; colIndex < numOfCols; colIndex++) {
        columnWidths[colIndex] = defaultColWidth;
      }

      var sparseColumns = v.el.sc;
      if (sparseColumns) {
        var len = sparseColumns.length;
        for (var i = 0; i < len; i++) {
          var sparseCol = sparseColumns[i];

          // check whether this column has a specific width
          if (sparseCol.cw !== undefined) {

            // convert the column Width from point units to pixel units
            columnWidths[sparseCol.ci] =
                         UnitConversionUtils.convertPointToPixel(sparseCol.cw);
          }

          // check whether this column is hidden
          if (sparseCol.hd) {

            // store the width of the column before it is hidden
            // (for use if the user later unhides the column)
            var colWidget = Workbook.getColumn(sparseCol.ci);
            if (colWidget) {
              colWidget.setPreHiddenWidth(columnWidths[sparseCol.ci]);
              colWidget.setHidden(true);
            }

            // this column will have a width of 0
            columnWidths[sparseCol.ci] = 0;
          }

          // apply formatting if this column has formatting
          Workbook.formatColumn(sparseCol.ci, sparseCol.fm);
        }
      }

      /*
       cache the column widths in the workbook; we will actually set them
       once we receive actual data so that we do all visual changes in one
       go to ensure it looks "snappy" rather than "staggered"
       (see HTMLOFFICE-25)
       */
      Workbook.cacheColumnWidths(columnWidths);

      if(v.el.cs) {
        // this sheet is a chart sheet
        SheetModel.activeChartSheet = true;
        Workbook.showChartSheet();
      }
      else {
        // this sheet is a normal sheet
        SheetModel.activeChartSheet = false;
        Workbook.hideChartSheet();

        // set the seed cell
        var obj;
        var sel = SheetSelectionManager.
          getStoredSelectionForSheet(SheetModel.activeSheetIndex);
        if(sel && sel.contentType && (sel.contentType === 'sheetCell')) {
          // the user has already selected a cell before the getSheetInfo
          // response returned, so keep that selection as the seed cell
          obj = sel;
        }
        else if(Features.isEnabled('edit') &&
                v.el.ari < Workbook.getNumOfRows()) {
          // store the seed cell only if it's within the grid boundaries
          // that we render; if it's beyond this then trySeedSelection()
          // will select cell A,1 by default
          obj = { };
          obj.anchor = { };
          obj.topLeft = { };
          obj.bottomRight = { };
          obj.contentType = 'sheetCell';

          obj.anchor.rowIdx = v.el.ari;
          obj.topLeft.rowIdx = v.el.ari;
          obj.bottomRight.rowIdx = v.el.ari;

          obj.anchor.colIdx = v.el.aci;
          obj.topLeft.colIdx = v.el.aci;
          obj.bottomRight.colIdx = v.el.aci;
        }
        else {
          // the default seed cell is A,1
          obj = { };
          obj.anchor = { };
          obj.topLeft = { };
          obj.bottomRight = { };
          obj.contentType = 'sheetCell';

          obj.anchor.rowIdx = 0;
          obj.topLeft.rowIdx = 0;
          obj.bottomRight.rowIdx = 0;

          obj.anchor.colIdx = 0;
          obj.topLeft.colIdx = 0;
          obj.bottomRight.colIdx = 0;
        }

        SheetModel.seedCell = obj;

        // only try to seed the cell selection if the sheet tab tool
        // is not active (it will be if the user is renaming the sheet)
        if(ToolsManager.activeTool !== 'sheetTab') {
          SheetSelectionManager.trySeedSelection();
        }

      }

      // JELTE TODO: initial zoom scale shoudl be set by app, not here - remove
      // init zoom level with the default value
      // Workbook.setZoomScale(SheetConfig.CurrentZoomValue);

      return undefined;
    }
  };

  return _api;
});
