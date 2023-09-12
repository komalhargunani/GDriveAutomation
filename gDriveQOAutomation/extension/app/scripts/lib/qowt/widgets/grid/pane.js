/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Pane
 * ====
 *
 * A grid widget encapsulates the part of the HTML DOM representing
 * a workbook that displays the grid of cells.
 * The grid widget manages the construction and logic of the grid.
 *
 * The grid widget uses <div> elements instead of <table> elements to represent
 * a grid, which is expected to be a more performant design.
 * The grid consists of two structures:
 *
 * - A 'base' div which is used to represent the basic grid-like structure of a
 *   spreadsheet.
 *   A number of row widgets and column widgets are created and attached to the
 *   base div, which results in the base div having a number of child row divs
 *   and child column divs
 *
 * - A 'content' div which is used to contain the populated cells of a
 *   spreadsheet.
 *   A number of cell widgets are created and attached to the content div - one
 *   for each cell in the sheet that contains content and/or non-default
 *   formatting.
 *   This results in the content div having a number of child cell divs
 *
 * Thus the HTML structure of a spreadsheet is as follows, stored in the
 * rootNode of the HTML DOM.
 *
 *      <div id="grid-base" class="grid-base">
 *          <div id="qowt-sheet-col1" class="qowt-sheet-col"></div>
 *          <div id="qowt-sheet-col2" class="qowt-sheet-col"></div>
 *          ..
 *          <div id="qowt-sheet-colM" class="qowt-sheet-col"></div>
 *          <div id="qowt-sheet-row1" class="qowt-sheet-row"></div>
 *          <div id="qowt-sheet-row2" class="qowt-sheet-row"></div>
 *          ..
 *          <div id="qowt-sheet-rowN" class="qowt-sheet-row"></div>
 *      </div>
 *      <div id="grid-content" class="grid-content">
 *          <div id="qowt-sheet-cell-format-3-5" class="qowt-sheet-cell-format"
 *            style="background-color:blue"></div>
 *          <div id="qowt-sheet-cell-content-3-5"
 *            class="qowt-sheet-cell-content"></div>
 *               "Accounts"
 *
 *          <div id="qowt-sheet-cell-format-8-14" class="qowt-sheet-cell-format"
 *            style="border-left-color:yellow"></div>
 *          <div id="qowt-sheet-cell-burst-area-8-14"
 *            class="qowt-sheet-cell-burst-area"></div>
 *              <div id="qowt-sheet-cell-content-8-14"
 *                class="qowt-sheet-cell-content"></div>
 *                  "John Doe Smith"
 *
 *          <div id="qowt-sheet-cell-content-72-75"
 *            class="qowt-sheet-cell-content"></div>
 *              "120,000"
 *
 *          <div id="qowt-sheet-cell-format-4-112"
 *            class="qowt-sheet-cell-format" style="background-color:red"></div>
 *      </div>
 *
 * See SheetCell.create for a detailed description of the different elements of
 * a cell.
 *
 * ###IMPORTANT NOTE
 *
 * Widgets should cause no HTML render tree relayouts
 * to occur in their constructor. This is to prevent many expensive render tree
 * relayouts from occuring during the opening of a workbook or switching of a
 * sheet.
 * If a widget requires to perform operations that will result in a relayout of
 * the render tree then these operations should be captured in a 'layoutBlah()'
 * method in the widget's public API, so that the workbook layout control can
 * dictate when this method is called, at an appropriate moment to take the
 * 'hit' of render tree relayout costs.
 *
 * @constructor
 * @see             src/widgets/grid/row.js
 * @see             src/widgets/grid/column.js
 * @see             src/widgets/grid/cell.js
 * @see             speclets/gridConcepts.markdown
 * @parameter paneElement {object} The HTML element that this pane's base and
 *                                 content divs are appended to as children
 * @parameter isMainPane {boolean}      A flag indicating whether this pane is
 *                                      the main pane; true if it is, otherwise
 *                                      false
 * @return {object} A Pane widget.
 */
define([
  'qowtRoot/controls/grid/floaterManager',
  'qowtRoot/widgets/grid/column',
  'qowtRoot/widgets/grid/row',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/widgets/grid/selectionBox',
  'qowtRoot/widgets/grid/highlightBox',
  'qowtRoot/widgets/grid/floatingEditor',
  'qowtRoot/features/utils'
], function(
    FloaterManager,
    Column,
    Row,
    PubSub,
    DomListener,
    SheetModel,
    SheetConfig,
    SelectionBox,
    HighlightBox,
    FloatingEditor,
    Features) {

  'use strict';

  var _factory = {

    create: function(paneElement, isMainPane) {

      // use module pattern for instance object
      var module = function() {

          /**
           * @api private
           */
          var _kGrid_Base_Node = {
            Tag: "div",
            Class: "pane-base"
          },

            _kGrid_Content_Node = {
              Tag: 'div',
              Class: "pane-content"
            },

            _events = {
              paneKeyDown: "qowt:pane:keydown",
              paneMouseMove: "qowt:pane:mousemove"
            },

            _kArrowLeftKeyCode = 37,
            _kArrowUpKeyCode = 38,
            _kArrowRightKeyCode = 39,
            _kArrowDownKeyCode = 40,
            _defaultRowHeightInPx, _defaultColWidthInPx,

            _paneNode, _baseNode, _contentNode, _columns = [],
            _rows = [],

            _floaterManager,

            _selectionBox,

            _floatingEditor,

            _highlightBoxes = [];

          /**
           * @api private
           */
          var _api = {

            /**
             * Gets the grid's base node
             *
             * @return {object}  The base node
             * @method getBaseNode()
             */
            getBaseNode: function() {
              return _baseNode;
            },

            /**
             * Gets the grid's content node
             *
             * @return {object}  The content node
             * @method getContentNode()
             */
            getContentNode: function() {
              return _contentNode;
            },

            /**
             * Gets the grid's column array
             *
             * @return {Array} The column array
             * @method getColumns()
             */
            getColumns: function() {
              return _columns;
            },

            /**
             * Gets the grid's row array
             *
             * @return {Array}  The row array
             * @method getRows()
             */
            getRows: function() {
              return _rows;
            },

            /**
             * Gets the specified range of rows from the grid's row array
             *
             * @param fromRow {integer}        The index of the first row in the
             *                                 desired range
             * @param toRow {integer}          The index of the last row in the
             *                                 desired range
             * @return {Array}  The row array
             * @method getRowRange()
             */
            getRowRange: function(fromRow, toRow) {
              return _rows.slice(fromRow, toRow + 1);
            },

            /**
             * Gets the number of rows in the grid
             *
             * @return {integer}  The number of rows
             * @method getNumOfRows()
             */
            getNumOfRows: function() {
              return _rows.length;
            },

            /**
             * Gets the number of columns in the grid
             *
             * @return {integer}  The number of columns
             * @method getNumOfCols()
             */
            getNumOfCols: function() {
              return _columns.length;
            },

            /**
             * Gets the row widget for the specified row index
             *
             * @param y {integer}  The row index
             * @return {object}    The row widget
             * @method getRow(y)
             */
            getRow: function(y) {
              return _rows[y];
            },

            /**
             * Gets the column widget for the specified column index
             *
             * @param x {integer}  The column index
             * @return {object}    The column widget
             * @method getColumn(x)
             */
            getColumn: function(x) {
              return _columns[x];
            },

            /**
             * Gets the index of the first row in the pane
             *
             * @return {object} The index of the first row in the pane
             * @method getFirstRowIndex()
             */
            getFirstRowIndex: function() {
              for(var i = 0, len = _rows.length; i < len; i++) {
                if(_rows[i] !== undefined) {
                  break;
                }
              }
              return i;
            },

            getFirstColIndex: function() {
              for(var i = 0, len = _columns.length; i < len; i++) {
                if(_columns[i] !== undefined) {
                  break;
                }
              }
              return i;
            },

            /**
             * Gets the index of the last row in the pane
             *
             * @return {object} The index of the last row in the pane
             * @method getLastRowIndex()
             */
            getLastRowIndex: function() {
              return _api.getNumOfRows() - 1;
            },

            /**
             * Ensures that the grid contains enough rows to display the sheet's
             * content,given the index of the last non-empty row in the sheet.
             * However, the grid can have a maximum of
             * SheetConfig.kGRID_DEFAULT_MAX_ROWS rows and so any content beyond
             * this will not be displayed
             *
             * @param indexOfLastNonEmptyRow {integer}  The index of the last
             *                                          non-empty row
             * @method ensureMinimalRowCount(indexOfLastNonEmptyRow)
             */
            ensureMinimalRowCount: function(indexOfLastNonEmptyRow) {
              indexOfLastNonEmptyRow = indexOfLastNonEmptyRow || 0;

              // ideally we would like to display at least the number of
              // non-empty rows plus a buffer of subsequent empty rows
              var desiredNumberOfRows =
                  (SheetConfig.kGRID_EMPTY_ROWS_BUFFER !== undefined) ?
                      indexOfLastNonEmptyRow +
                          SheetConfig.kGRID_EMPTY_ROWS_BUFFER :
                      indexOfLastNonEmptyRow;
              var actualNumberOfRows = _rows.length;
              if((actualNumberOfRows < desiredNumberOfRows) &&
                  (SheetConfig.kGRID_DEFAULT_MAX_ROWS !== undefined)) {

                // the current number of rows in the grid is less than the
                // desired number of rows so we need to grow the grid, but not
                // over the max number of rows allowed
                // LM TODO: This means that if indexOfLastNonEmptyRow >
                //  SheetConfig.kGRID_DEFAULT_MAX_ROWS
                // then some content will be missing from the end of the grid!
                var totalRowCount =
                    (desiredNumberOfRows < SheetConfig.kGRID_DEFAULT_MAX_ROWS) ?
                        desiredNumberOfRows :
                        SheetConfig.kGRID_DEFAULT_MAX_ROWS;
                var numOfRowsToAdd = totalRowCount - actualNumberOfRows;

                // set doSetWidth = true, it calculates row width for newly
                // added rows
                _addRows(numOfRowsToAdd, actualNumberOfRows, true);

                var config = {};
                _layoutRows(config);
              }
            },

            // LM TODO: do we also want a method ensureMinimalColumnCount()?
            /**
             * Lays out the rows in the grid with their correct heights.
             * The height of a row may be determined by the default row height
             * that is specified in the sheet, a specific height that is
             * specified for that row or the largest height of the cells in that
             * row.
             *
             * This visual change is performed by the grid widget (rather than
             * the row widgets) so that it can process all of the rows in the
             * grid at the same time and ensure that this operation will cause
             * only one relayout of the render tree (this is much more efficient
             * than checking what height a row should be every time a cell gets
             * added to it, which would cause a relayout of the render tree
             * after each cell is added).
             *
             * To further optimise matters, we use a document fragment to load
             * the cells as they come in from the dcp service So once the doc
             * fragment gets added to the DOM, that's when the workbook layout
             * control 'jumps in' and calls this method to quickly tidy up any
             * visual corrections that need to be made.
             *
             * We only check the height for the row range we get given, and
             * update the positions of the rows further down as well as they
             * might have shifted.
             *
             * @see speclets/dcpProcessLoop.markdown
             * @param {object} config - This object contains the row index
             *    information. config = {startingRowIndex:'',endRowIndex:''}
             * @method layoutRowHeights(config, useExistingSpecificHeights)
             */
            layoutRowHeights: function(config, useExistingSpecificHeights) {
              if((config.startRowIndex === undefined) ||
                  (config.endRowIndex === undefined)) {
                return;
              }

              // we want to update the height of each row in the given range -
              // if there is a specific height for a row then this is used;
              // otherwise the height of the row will be automatically
              // calculated based on the maximum height of the cells in the row
              // and the default row height in the sheet
              config.doUpdateHeights = {
                rows: []
              };
              for (var i = config.startRowIndex; i <= config.endRowIndex;
                   i++) {
                var specificHeight;
                specificHeight = undefined;
                if(SheetModel.specificRowHeights[i] !== undefined) {
                  specificHeight = SheetModel.specificRowHeights[i];
                }
                // LM_todo : Chat with Andy about the following comment.
                // This 'isHeightUserDefined' param needs to be better designed
                // to use within this method.
                // It is only set/get in the _layoutRows method called below,
                // which means the following 'else if' statement only has value
                // on the 2nd call of this method (layoutRowHeights).
                // So this branch is only functionality for COLUMN SWITCHING
                // (ie. when doc has already been laid out) & can't be called
                // for example on SHEET SWITCHING, which is why I"ve added the
                // 'useExistingSpecificHeights' parameter above. ie. Need to
                // rework 'isHeightUserDefined' to get rid of this hack arg
                // 'useExistingSpecificHeights'
                else if(useExistingSpecificHeights &&
                    _rows[i].isHeightUserDefined()) {
                  specificHeight = _rows[i].getHeight();
                }
                config.doUpdateHeights.rows.push({
                  rowIdx: i,
                  rowHeight: specificHeight
                });
              }

              config.doUpdatePositions = {
                startingRowIdx: config.startRowIndex + 1
              };
              config.doUpdateBursting = {
                startingRowIdx: config.startRowIndex
              };
              _layoutRows(config);
            },

            /**
             * Lays out the columns in the grid with their correct widths.
             * The actual width of each column is contained in the response to
             * the GetSheetInformation command.
             *
             * This operation does not cause a render tree relayout to occur.
             *
             * @param colWidthsObj {object} A sparse object of column widths,
             *                              containing an 'index:width' pair for
             *                              each column whose width is not the
             *                              default width
             * @method layoutColumnWidths(colWidthArray)
             */
            layoutColumnWidths: function(colWidthsObj) {
              var config = {};
              config.doUpdateWidths = {
                colWidths: colWidthsObj
              };
              config.doUpdatePositions = {
                startingColIdx: 1
              };
              _layoutColumns(config);

              // instruct the cells of the pane to update (in the x-plane only)
              _layoutCellsHoriz();
            },

            /**
             * Resizes a row that has had its height changed by a user gesture.
             *
             * @param rowIndex {integer} The index of the row to be resized
             * @param deltaY {integer}   The difference in pixels of the new
             *                           height from the old height. For
             *                           example, a value of -10 indicates that
             *                           the new height is 10 pixels less
             * @method resizeRow(rowIndex,deltaY)
             */
            resizeRow: function(rowIndex, deltaY) {
              if((rowIndex === undefined) || (deltaY === undefined)) {
                return;
              }

              var config = {};
              config.doUpdateHeights = {
                rows: [{
                  rowIdx: rowIndex,
                  rowHeight: _rows[rowIndex].getHeight() + deltaY
                }]
              };
              config.doUpdatePositions = {
                startingRowIdx: rowIndex + 1
              };
              config.resizeoccured = true;
              //Need to update specificRowHeights after resizing of row.
              var resizedHeight = _rows[rowIndex].getHeight() + deltaY;
              if(resizedHeight !== SheetModel._defaultRowHeightInPx){
                SheetModel.specificRowHeights[rowIndex] = resizedHeight;
              }

              _layoutRows(config);
            },

            /**
             * Get a reference to the object which manages floating widgets
             *
             * @return {object} The object which manages the floaters
             * @method getFloaterManager()
             */
            getFloaterManager: function() {
              return _floaterManager;
            },

            /**
             * Resizes a column that has had its width changed by a user
             * gesture.
             *
             * @param colIndex {integer} The index of the column to be resized
             * @param deltaX {integer}   The difference in pixels of the new
             *                           width from the old width. For example,
             *                           a value of -10 indicates that the new
             *                           width is 10 pixels less
             * @method resizeColumn(colIndex,deltaX)
             */
            resizeColumn: function(colIndex, deltaX) {
              if((colIndex === undefined) || (deltaX === undefined)) {
                return;
              }

              var colWidthObj = {};
              colWidthObj[colIndex] = _columns[colIndex].getWidth() + deltaX;

              // if column width is less than equal to 0 make column as hidden
              var hidden = colWidthObj[colIndex] <= 0;
              _columns[colIndex].setHidden(hidden);

              var config = {};
              config.doUpdateWidths = {
                colWidths: colWidthObj
              };
              config.doUpdatePositions = {
                startingColIdx: colIndex + 1
              };
              config.resizeoccured = true;
              _layoutColumns(config);

              // instruct the cells of the pane to update (in the x-plane only)
              _layoutCellsHoriz();
            },

            /**
             * Hides a row.
             *
             * @param rowIndex {integer} The index of the row to be hidden
             * @method  hideRow(rowIndex)
             */
            hideRow: function(rowIndex) {
              if(rowIndex !== undefined) {
                // resize the row to height 0
                _api.resizeRow(rowIndex, -(_rows[rowIndex].getHeight()));
              }
            },

            /**
             * Hides a column.
             *
             * @param colIndex {integer} The index of the column to be hidden
             * @method hideColumn(colIndex)
             */
            hideColumn: function(colIndex) {
              if(colIndex !== undefined) {
                // resize the column to width 0
                _api.resizeColumn(colIndex, -(_columns[colIndex].getWidth()));
              }
            },

            /*! LM TODO: The implementation of unhideRow() might have to change
             * to support unhiding a row that was RENDERED as hidden (i.e. not
             * manually set to hidden),
             */
            /**
             * Unhides a row.
             *
             * @param rowIndex {integer} The index of the row to be unhidden
             * @method unhideRow(rowIndex)
             */
            unhideRow: function(rowIndex) {
              if(rowIndex !== undefined) {
                // resize the row to the height it was before it was hidden
                _api.resizeRow(rowIndex, _rows[rowIndex].getPreHiddenHeight());
              }
            },

            /*!
             * LM TODO: The implementation of unhideColumn() might have to
             * change to support unhiding a column that was RENDERED as hidden
             * (i.e. not manually set to hidden),
             */
            /**
             * Unhides a column.
             *
             * @param colIndex {integer} The index of the column to be unhidden
             * @method unhideColumn(colIndex)
             */
            unhideColumn: function(colIndex) {
              if(colIndex !== undefined) {
                // resize the column to the width it was before it was hidden
                _api.resizeColumn(colIndex,
                    _columns[colIndex].getPreHiddenWidth());
              }
            },

            /**
             * Inserts a number of rows into the grid
             * Updates also affected rows and moves floaters accordingly.
             *
             * @param {integer} rowIndexToInsertAt The first index of the new
             *                  rows
             * @param {integer} numOfRows The number of rows
             * @param {object} opt_widgets An object which contains:
             *                  floatersToReappend - an array of floater objects
             *                  rowWidgetsToReappend - an array of row widgets
             *                  baseNodesToReappend - doc frag to be appended to
             *                  base node
             *                  contentNodesToReappend - doc frag to be appended
             *                  to content node
             */
            insertRows: function(rowIndexToInsertAt, numOfRows, opt_widgets) {
              _insertRowsColumns(rowIndexToInsertAt, numOfRows,
                  true, opt_widgets);
            },

            /**
             * Inserts a number of cols into the grid
             * Updates also affected cols and moves floaters accordingly.
             *
             * @param {integer} colIndexToInsertAt The first index of the new
             *                  cols
             * @param {integer} numOfCols The number of cols
             * @param {object} opt_widgets An object which contains:
             *                  floatersToReappend - an array of floater objects
             *                  colWidgetsToReappend - an array of col widgets
             *                  baseNodesToReappend - doc frag to be appended to
             *                  base node
             *                  contentNodesToReappend - doc frag to be appended
             *                  to content node
             */
            insertColumns: function(colIndexToInsertAt, numOfCols,
                                      opt_widgets) {
              _insertRowsColumns(colIndexToInsertAt, numOfCols,
                  false, opt_widgets);
            },

            /**
             * Deletes a number of rows from the grid.
             * Updates also affected rows and moves floaters accordingly.
             *
             * @param {integer} rowIndexToDeleteAt The index of the row to
             *                  delete
             * @param {integer} numOfRows The number of rows
             */
            deleteRows: function(rowIndexToDeleteAt, numOfRows) {
              return _deleteRowsColumns(rowIndexToDeleteAt, numOfRows, true);
            },

            /**
             * Deletes a number of cols from the grid.
             * Updates also affected cols and moves floaters accordingly.
             *
             * @param {integer} colIndexToDeleteAt The index of the col to
             *                  delete
             * @param {integer} numOfCols The number of cols
             */
            deleteColumns: function(colIndexToDeleteAt, numOfCols) {
              return _deleteRowsColumns(colIndexToDeleteAt, numOfCols, false);
            },

            /**
             * Resets the grid, wiping all cell content from it.
             * Note that the column widths and row heights are maintained during
             * the reset.
             *
             * @method reset()
             */
            reset: function() {
              _resetBaseNode();
              _resetContentNode();
              SheetModel.specificRowHeights = [];
            },

            /**
             * This method is similar to reset(), with the difference that the
             * Base Node is removed and re-created empty.
             * Called when unfreezing, where we want to keep the panes but
             * we want to empty the top-left, top-right and bottom-right pane.
             *
             * @method clean()
             */
            clean: function() {
              _cleanBaseNode();
              _resetContentNode();
              _columns = [];
              _rows = [];
              SheetModel.specificRowHeights = [];
            },

            /**
             * Replaces the content node of the grid with the specified content
             * node.
             * Used by the ResetGrid command to revert the command if required
             *
             * @method replace(newContent)
             */
            replace: function(newContent) {
              _replaceAllContent(newContent);
              // LM TODO: We should also call ensureMinimalRowCount() here?
              // LM TODO: This method needs to also re-set the appropriate row
              // heights and column widths!
            },

            /**
             * Attach the specified row widget to this widget.
             * Here the specified row widget is attached to this pane widget
             *
             * @param widget {object} A row widget
             * @method attachRowWidget(rowWidget)
             */
            attachRowWidget: function(rowWidget) {
              if(rowWidget === undefined) {
                throw new Error("attachRowWidget - missing widget parameter!");
              }

              _rows[rowWidget.getIndex()] = rowWidget;
            },

            /**
             * Attach the specified column widget to this widget.
             * Here the specified column widget is attached to this pane widget
             *
             * @param widget {object} A column widget
             * @method attachColumnWidget(colWidget)
             */
            attachColumnWidget: function(colWidget) {
              if(colWidget === undefined) {
                throw new Error("attachColumnWidget - missing " +
                                "widget parameter!");
              }

              _columns[colWidget.getIndex()] = colWidget;
            },

            /**
             * Every widget has an appendTo() method.
             * This is used to attach the HTML elements of the widget to a
             * specified node in the HTML DOM.
             * Here the grid's base node and content node are appended as
             * children to the specified node
             *
             * @param node {object} The HTML node that this widget is to attach
             *                      itself to
             * @method appendTo(node)
             */
            appendTo: function(node) {
              if(node === undefined) {
                throw new Error("appendTo - missing node parameter!");
              }

              _paneNode = node;
              _paneNode.appendChild(_baseNode);
              _paneNode.appendChild(_contentNode);
            },

            /**
             * Returns the pane's node
             *
             * @return {object} The pane node
             * @method getPaneNode()
             */
            getPaneNode: function() {
              return _paneNode;
            },

            /**
             * Stores the default row height for rows in the grid
             * This value is also stored in the model so that
             * other modules can easily read it.
             *
             * @param height {number} The default row height in points
             * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
             *  GetSheetInformation-element-schema.json
             * @method setDefaultRowHeight(height)
             */
            setDefaultRowHeight: function(height) {
              _defaultRowHeightInPx = height;
              SheetModel._defaultRowHeightInPx = height;
            },

            /**
             * Returns the default row height for rows in the grid
             *
             * @return The default row height in points
             * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
             *  GetSheetInformation-element-schema.json
             * @method getDefaultRowHeight()
             */
            getDefaultRowHeight: function() {
              return _defaultRowHeightInPx;
            },

            /**
             * Stores the default column width for columns in the grid
             *
             * @param width {number} The default column width in points
             * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
             *  GetSheetInformation-element-schema.json
             * @method setDefaultColumnWidth(width)
             */
            setDefaultColumnWidth: function(width) {
              _defaultColWidthInPx = width;
            },

            /**
             * Returns the default column width for columns in the grid
             *
             * @return The default column width in points
             * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
             *  GetSheetInformation-element-schema.json
             * @method getDefaultColumnWidth()
             */
            getDefaultColumnWidth: function() {
              return _defaultColWidthInPx;
            },

            /**
             * Returns the height of requested rows.
             *
             * @return {array} The heights of requested rows
             * @method getHeightOfRows(rowIndex1, rowIndex2)
             */
            getHeightOfRows: function(rowIndex1, rowIndex2) {
              var retVal = [];

              for(var ii = rowIndex1; ii <= rowIndex2; ii++) {
                var row = _rows[ii];
                if(row !== undefined) {
                  var height = row.getHeight();
                  retVal.push({
                    rowIdx: ii,
                    rowHeight: height
                  });
                }
              }

              return retVal;
            },

            /**
             * Applies the height of supplied rows.
             *
             * @param {array} Array of objects containing rowIndex, heights to
             *                update
             * @method applyHeightToRows(rowIndex1, rowIndex2)
             */
            applyHeightToRows: function(heightInfoArray) {

              if(heightInfoArray && (heightInfoArray.length > 0)) {

                var heightInfoItem = heightInfoArray[0];
                var config = {};
                config.doUpdateHeights = {};
                config.doUpdateHeights.rows = heightInfoArray;
                config.doUpdatePositions = {
                  startingRowIdx: heightInfoItem.rowIdx + 1
                };
                _layoutRows(config);
              }
            },
            /**
             * Hides the grid lines by setting the CSS class to
             * pane-base-no-gridlines.
             * @method hideGridLines()
             */
            hideGridLines: function() {
              _baseNode.className = "pane-base-no-gridlines";
            },
            /**
             * Sets the height of all the columns for this pane.
             * @param uniformColHeight - the height to be set
             * @method setColumnHeight(uniformColHeight)
             */
            setColumnHeight: function(uniformColHeight) {
              var numOfCols = _columns.length;
              for(var colIndex = 0; colIndex < numOfCols; colIndex++) {
                if(_columns[colIndex] !== undefined) {
                  _columns[colIndex].setHeight(uniformColHeight);
                }
              }
            },

          /**
           * Resets the data about frozen headers stored in the row and column
           * widgets.
           * Called when unfreezing the panes.
           */
          resetFrozenHeaders: function() {
            var i, len;
            for (i = 0, len = _rows.length; i < len; i++) {
              if (_rows[i] !== undefined) {
                _rows[i].resetFrozenRowHeader();
              }
            }
            for (i = 0, len = _columns.length; i < len; i++) {
              if (_columns[i] !== undefined) {
                _columns[i].resetFrozenColHeader();
              }
            }
          },

          /**
           * Gets the selection box widget of this pane
           *
           * @return {object} The selection box widget
           * @method getSelectionBox()
           */
          getSelectionBox: function() {
            return _selectionBox;
          },

          /**
           * Positions the selection box of this pane to reflect the given
           * selection context object
           *
           * @param {object} selectionObj The selection context object
           * @param {integer} frozenScrollOffsetX The frozen scroll offset
           *                  X coordinate
           * @param {integer} frozenScrollOffsetY The frozen scroll offset
           *                  Y coordinate
           * @method positionSelectionBox()
           */
          positionSelectionBox: function(selectionObj,
                                         frozenScrollOffsetX,
                                         frozenScrollOffsetY) {
            var anchorRowIdx = selectionObj.anchor.rowIdx;
            var anchorColIdx = selectionObj.anchor.colIdx;
            var fromRowIdx = selectionObj.topLeft.rowIdx;
            var fromColIdx = selectionObj.topLeft.colIdx;
            var toRowIdx = selectionObj.bottomRight.rowIdx;
            var toColIdx = selectionObj.bottomRight.colIdx;

            if(fromRowIdx === undefined && toRowIdx === undefined) {
              fromRowIdx = 0;
              toRowIdx = _rows.length-1;
            }
            if(fromColIdx === undefined && toColIdx === undefined) {
              fromColIdx = 0;
              toColIdx = _columns.length-1;
            }

            var adjustedObj =
                _floaterManager.calculateAdjustedSelectionRange(anchorRowIdx,
                    anchorRowIdx, anchorColIdx, anchorColIdx, true);

            var isRangeFlag =
                ((fromRowIdx !== toRowIdx) || (fromColIdx !== toColIdx)) &&
                              ((fromRowIdx !== adjustedObj.minRowIdx) ||
                                  (toRowIdx !== adjustedObj.maxRowIdx) ||
                              (fromColIdx !== adjustedObj.minColIdx) ||
                                  (toColIdx !== adjustedObj.maxColIdx));
            var rect;

            if(isRangeFlag) {
              // a range is selected so position the selection range node
              rect = _calculateRectForSelection(fromRowIdx, toRowIdx,
                                                fromColIdx, toColIdx,
                                                frozenScrollOffsetX,
                                                frozenScrollOffsetY);
              _selectionBox.positionRangeNode(rect);
              _selectionBox.setRangeNodeVisibility(true);
            } else {
              _selectionBox.setRangeNodeVisibility(false);
            }

            // always set anchor as it may have changed
            rect = _calculateRectForSelection(adjustedObj.minRowIdx,
                adjustedObj.maxRowIdx, adjustedObj.minColIdx,
                adjustedObj.maxColIdx, frozenScrollOffsetX,
                frozenScrollOffsetY);
            _selectionBox.positionAnchorNode(rect);



            // Handling hyperlink
            // Getting the cell where the selection box is positioned currently.
            // If that cell has hyperlink, then showing the hyperlink dialog box
            // else, setting hyperlink dialog box state as hidden.
            if (_rows.length > 0 && anchorRowIdx < _rows.length) {
              var cellWidget = _api.getCorrectCellForHyperlink(anchorRowIdx,
                  anchorColIdx);
              if (cellWidget && cellWidget.hasHyperlink()) {
                _api.showHyperlinkForCell(cellWidget);
              } else {
                _selectionBox.hideHyperlinkDialog();
              }
            } else {
              _selectionBox.hideHyperlinkDialog();
            }
          },

          /**
           * Returns cell widget which is a candidate for hyperlink.
           *
           * If the containing floater for given row and column index is of type
           * merge cell, then it will return the anchor cell of merged cells.
           * Otherwise, it will return the cell widget of given row and column
           * index.
           *
           * @param row - row index
           * @param col - column index
           * @returns {Object} - cell widget
           */
          getCorrectCellForHyperlink: function(row, col) {
            var floaterMgr = _api.getFloaterManager();
            if (floaterMgr) {
              var floater = floaterMgr.findContainingFloater(row, col);
              if (floater && floater.getType() === 'sheetFloaterMergeCell') {
                //Get anchor row and column index of merge cell
                var mergeAnchorRow = floater.y();
                var mergeAnchorCol = floater.x();
                return _rows[mergeAnchorRow].getCell(mergeAnchorCol);
              }
            }
            return _rows[row].getCell(col);
          },

          /**
           * Shows hyperlink dialog box for the selected cell.
           *
           * Note: Since, we are not supporting internal hyperlinks yet,
           * therefore, restricting showing hyperlink dialog when link is
           * internal. However, the check for linkType below must be removed
           * when we have support for internal hyperlinks.
           *
           * @param cellWidget {Object} - cell widget
           */
          showHyperlinkForCell: function(cellWidget) {

            var linkType = cellWidget.getHyperlinkType();
            //TODO: Remove this check for link type, once we have support
            // for internal hyperlink rendering.
            if (linkType === 'External') {
              // passing true for external type of link, for internal type it
              // would be false
              _selectionBox.showHyperlinkDialog(true,
                  cellWidget.getHyperlinkTarget());
            } else {
              return;
            }
          },

          /**
           * Returns true if hyperlink dialog is open.
           * @returns {boolean} - true if hyperlink dialog is showing,
           *                      false if hyperlink dialog is hidden.
           */
          isShowingHyperlinkDialog: function() {
            return _selectionBox.isShowingHyperlinkDialog();
          },

          /**
           * Displays the floating editor.
           * This involves:
           * - Positioning the floating editor over the given (anchor) cell
           * - Configuring the floating editor to have the appropriate cell and
           *   text formatting
           * - Seeding the floating editor with the appropriate text
           * - Giving focus to the floating editor if the 'focusOn' flag is true
           *
           * @param {boolean} focusOn A flag which, if true, indicates that
           *                          focus should be given to the floating
           *                          editor
           * @param {object} selectionObj The selection that the floating editor
           *                              is to appear over
           * @param (integer) frozenScrollOffsetX The frozen X scroll offset
           * @param (integer) frozenScrollOffsetY The frozen Y scroll offset
           * @param {integer or undefined} seed Optional keycode of a character
           *                                    to 'seed' the floating editor
           *                                    with. If this value is undefined
           *                                    then the floating editor will be
           *                                    seeded with the text of the cell
           *                                    that it is positioned over
           *
           * @method displayFloatingEditor(focusOn, selectionObj,
           *  frozenScrollOffsetX, frozenScrollOffsetY, seed)
           */
          displayFloatingEditor: function(focusOn, selectionObj,
                                          frozenScrollOffsetX,
                                          frozenScrollOffsetY, seed) {
            var anchorRowIdx = selectionObj.anchor.rowIdx;
            var anchorColIdx = selectionObj.anchor.colIdx;
            var rowWidget = _rows[anchorRowIdx];
            if(rowWidget) {
              if(!_floatingEditor.isVisible()) {
                var cellWidget =
                    _floaterManager.findContainingFloater(anchorRowIdx,
                                                          anchorColIdx);
                if((cellWidget === undefined) ||
                    (cellWidget.getType() !== "sheetFloaterMergeCell")) {
                  cellWidget = rowWidget.getCell(anchorColIdx);
                }
                _seedFloatingEditor(cellWidget, seed);
                var isWrapped = _formatFloatingEditor(cellWidget, anchorRowIdx,
                    anchorColIdx);
                _positionFloatingEditor(anchorRowIdx, anchorColIdx,
                    frozenScrollOffsetX, frozenScrollOffsetY, isWrapped);
                _setFloatingEditorVisibility(true);
                if(focusOn) {
                  _api.focusOnFloatingEditor();
                }
              }
            }
            else {
              // the target cell is not in this pane, so hide this pane's
              // floating editor
              _setFloatingEditorVisibility(false);
            }
          },

          /**
           * Hides the floating editor
           *
           * @method hideFloatingEditor()
           */
          hideFloatingEditor: function() {
            _setFloatingEditorVisibility(false);
          },

          /**
           * Sets the floating editor node to have focus
           *
           * @method focusOnFloatingEditor()
           */
          focusOnFloatingEditor: function() {
            _floatingEditor.focus();
          },

          /**
           * Indicates whether or not the floating editor
           * of this pane has focus
           *
           * @return {boolean} True if the floating editor
           *                   has focus; otherwise false
           * @method floatingEditorHasFocus()
           */
          floatingEditorHasFocus: function() {
            return _floatingEditor.hasFocus();
          },

          /**
           * Sets the display text of the floating editor
           *
           * @param {string} text The text to display
           */
          setFloatingEditorDisplayText: function(text) {
            _floatingEditor.setDisplayText(text);
          },

          /**
           * Sets the font face of the cell optimistically
           *
           * @param {string} fontFace The font face setting - e.g. "Arial"
           */
          setCellFontFaceOptimistically: function(fontFace) {
            _floatingEditor.setFontFace(fontFace);
          },

          /**
           * Sets the font size of the cell optimistically
           *
           * @param {string} fontSize The font size - e.g. "24"
           */
          setCellFontSizeOptimistically: function(fontSize) {
            _floatingEditor.setFontSize(fontSize);
          },

          /**
           * Sets the text color of the cell optimistically
           *
           * @param {string} textColor The text color - e.g. "blue"
           */
          setCellTextColorOptimistically: function(textColor) {
            _floatingEditor.setTextColor(textColor);
          },

          /**
           * Sets the background color of the cell optimistically
           *
           * @param {string} backgroundColor The background color -
           *                 e.g. "green"
           */
          setCellBackgroundColorOptimistically: function(backgroundColor) {
            _floatingEditor.setBackgroundColor(backgroundColor);
          },

          /**
           * Sets the horizontal alignment position of the cell optimistically
           *
           * @param {string} alignmentPos The horizontal alignment position -
           *                              e.g. "r"
           */
          setCellHorizontalAlignmentOptimistically: function(alignmentPos) {
            _floatingEditor.setHorizontalAlignment(alignmentPos);
          },

          /**
           * Sets the vertical alignment position of the cell optimistically
           *
           * @param {string} alignmentPos The vertical alignment position -
           *                              e.g. "t"
           */
          setCellVerticalAlignmentOptimistically: function(alignmentPos) {
            _floatingEditor.setVerticalAlignment(alignmentPos);
          },

          /**
           * Sets the boldness of the cell optimistically
           *
           * @param {boolean} boldness The boldness setting - e.g. true
           */
          setCellBoldnessOptimistically: function(boldness) {
            _floatingEditor.setBoldness(boldness);
          },

          /**
           * Sets the italics state of the cell optimistically
           *
           * @param {boolean} italics The italics setting - e.g. true
           */
          setCellItalicsOptimistically: function(italics) {
            _floatingEditor.setItalics(italics);
          },

          /**
           * Sets the underline state of the cell optimistically
           *
           * @param {boolean} underline The underline setting - e.g. true
           */
          setCellUnderlineOptimistically: function(underline) {
            _floatingEditor.setUnderline(underline);
          },

          /**
           * Sets the strikethrough state of the cell optimistically
           *
           * @param {Boolean} isStrikethrough - The strikethrough setting.
           */
          setCellStrikethroughOptimistically: function(isStrikethrough) {
            _floatingEditor.setStrikethrough(isStrikethrough);
          },

          /**
           * Sets the wrap text setting of the cell optimistically
           *
           * @param {boolean} wrapText The wrap text setting - e.g. true
           */
          setCellWrapTextOptimistically: function(wrapText) {
            _floatingEditor.setWrapText(wrapText);
          },

          /**
           * Injects a cell ref into the floating editor.
           * The specified object contains the cell ref to inject
           * and a flag indicating whether the user has injected
           * this cell ref using an arrow key or a mousedown event
           *
           * @param obj {object} The config object - e.g.
           *                     { cellRef: "F27",
           *                       byKey: true }
           */
          injectCellRefIntoFloatingEditor: function(obj) {
            _floatingEditor.injectCellRef(obj);
          },

          /**
           * Injects a cell range into the floating editor.
           * The specified object contains the cell range to inject
           * and a flag indicating whether the user has injected
           * this cell range using a shift-arrow key or a mousemove event
           *
           * @param obj {object} The config object - e.g.
           *                     { cellRange: { topLeft: "F27",
           *                                    bottomRight: "H38" },
           *                       byKey: true }
           */
          injectCellRangeIntoFloatingEditor: function(obj) {
            _floatingEditor.injectCellRange(obj);
          },

          /**
           * Get a reference to the floating editor widget of this pane
           *
           * @return {object} The floating editor widget
           * @method getFloatingEditor()
           */
          getFloatingEditor: function() {
            return _floatingEditor;
          },

          /**
           * Highlights the cells that are specified so that they
           * stand out whilst the user is editing a formula.
           *
           * NOTE: This is done by first unhighlighting all cells
           * that are currently highlighted. This is probably not
           * the most efficient approach for updating the highlighted
           * cells but it is by far the easiest way to support the
           * desired coloring order of the highlighted cells after
           * an edit to a formula has occured
           *
           * @param {array} highlights The array of cells to highlight
           * @param {integer} frozenScrollOffsetX The frozen scroll X offset
           * @param {integer} frozenScrollOffsetY The frozen scroll Y offset
           * @method highlightCells(highlights)
           */
          highlightCells: function(highlights, frozenScrollOffsetX,
                                   frozenScrollOffsetY) {
            _api.unhighlightCells();

            if(highlights) {
              var highlightsDocFrag = document.createDocumentFragment();
              var count = highlights.length;
              for(var i = 0; i < count; i++) {
                var highlightObj = highlights[i];
                /* The handling of whole rows and cols here applies only for
                 * cutting rows and cols. It does not apply for selecting
                 * whole rows or cols for formulas. This code should be
                 * revisited
                 * when QS-1489 is fixed.
                 */
                if(highlightObj.colIdx === undefined) {
                  highlightObj.colIdx = 0;
                  if(highlightObj.rangeEnd) {
                    highlightObj.rangeEnd.colIdx = _api.getNumOfCols()-1;
                  }
                }
                if(highlightObj.rowIdx === undefined) {
                  highlightObj.rowIdx = 0;
                  if(highlightObj.rangeEnd) {
                    highlightObj.rangeEnd.rowIdx = _api.getNumOfRows()-1;
                  }
                }
                var rowWidget = _api.getRow(highlightObj.rowIdx);
                var colWidget = _api.getColumn(highlightObj.colIdx);
                var rangeEndRowWidget = rowWidget;
                var rangeEndColWidget = colWidget;
                if(highlightObj.rangeEnd) {
                  rangeEndRowWidget =
                      _api.getRow(highlightObj.rangeEnd.rowIdx);
                  rangeEndColWidget =
                      _api.getColumn(highlightObj.rangeEnd.colIdx);
                }

                if(rowWidget && colWidget &&
                    rangeEndRowWidget && rangeEndColWidget) {
                  // the cell (or cell range) exists in this pane - highlight it

                  // calculate the 'rect' to place the highlight box over the
                  // cell (or cell range), checking for floater objects
                  var adjustedObj =
                      _floaterManager.calculateAdjustedSelectionRange(
                        rowWidget.getIndex(), rangeEndRowWidget.getIndex(),
                        colWidget.getIndex(), rangeEndColWidget.getIndex(),
                        true);
                  var rect = _calculateRectForSelection(adjustedObj.minRowIdx,
                                                        adjustedObj.maxRowIdx,
                                                        adjustedObj.minColIdx,
                                                        adjustedObj.maxColIdx,
                                                        frozenScrollOffsetX,
                                                        frozenScrollOffsetY);
                  var color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[i %
                      SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];

                  var highlightBox = HighlightBox.create(i, color);
                  highlightBox.appendTo(highlightsDocFrag);
                  highlightBox.positionNode(rect);
                  _highlightBoxes.push(highlightBox);
                }
              }

              if(highlightsDocFrag.hasChildNodes()) {
                paneElement.appendChild(highlightsDocFrag);
              }
              highlightsDocFrag = undefined;
            }
          },

          /**
           * Unhighlights all cells in this pane that were
           * highlighted whilst the user was editing a formula
           *
           * @method unhighlightCells()
           */
          unhighlightCells: function() {
            var len = _highlightBoxes.length;
            for(var i = 0; i < len; i++) {
              _highlightBoxes[i].removeFrom(paneElement);
              _highlightBoxes[i] = undefined;
            }
            _highlightBoxes = [];
          },

          /**
           * Shows the cell highlighting in this pane. Used for cut operations.
           */
          showCellHighlighting: function() {
            for (var i = 0; i < _highlightBoxes.length; i++) {
              _highlightBoxes[i].show();
            }
          },

          /**
           * Hides the cell highlighting in this pane. Used for cut operations.
           */
          hideCellHighlighting: function() {
            for (var i = 0; i < _highlightBoxes.length; i++) {
              _highlightBoxes[i].hide();
            }
          },

          /**
           * Query if the cell highlighting is visible.
           *
           * @returns {Boolean} True if visible, else false.
           */
          hasCellHighlighting: function() {
            for (var i = 0; i < _highlightBoxes.length; i++) {
              if (_highlightBoxes[i].isVisible()) {
                return true;
              }
            }
            return false;
          },

          /**
           * Returns the object having visible width and height of the pane.
           * @returns object containing visible height and visible width.
           */
          getVisibleDimension: function() {
            return {
              height: _paneNode.clientHeight,
              width: _paneNode.clientWidth
            };
          },

          /**
           * Updates specificRowHeights cache whenever a row is inserted or
           * deleted. This is needed because inserting or deleting a row will
           * make changes in existing row ids.
           *
           * @param totalRows - total number of rows in a sheet
           */
          updateSpecificRowHeights: function(totalRows) {
            SheetModel.specificRowHeights.length = 0;
            for (var i = 0; i < totalRows; i++) {
              if (SheetModel.RowHeights[i] !==
                  SheetModel._defaultRowHeightInPx) {
                SheetModel.specificRowHeights[i] = SheetModel.RowHeights[i];
              }
            }
          }
        };

          /**
           * @api private
           */
          var _init = function() {
              if(paneElement === undefined) {
                throw new Error("Pane widget constructor - " +
                                "missing pane element!");
              }

              // Get the row and column details for the grid from the
              // platform-specific config file or the default configuration file
              // if no platform-specific overrides are specified.
              if((SheetConfig.kGRID_DEFAULT_ROWS === undefined) ||
                  (SheetConfig.kGRID_DEFAULT_COLS === undefined) ||
                  (SheetConfig.kGRID_DEFAULT_COL_WIDTH === undefined) ||
                  (SheetConfig.kGRID_DEFAULT_ROW_HEIGHT === undefined) ||
                  (SheetConfig.kGRID_GRIDLINE_WIDTH === undefined)) {
                throw new Error("Grid widget - missing initialisation " +
                                "config values!");
              }

              _defaultColWidthInPx = SheetConfig.kGRID_DEFAULT_COL_WIDTH;
              _defaultRowHeightInPx = SheetConfig.kGRID_DEFAULT_ROW_HEIGHT;

              _floaterManager = FloaterManager.create();

          // Initialise the base div and the content div
          _initBaseNode();
          _initContentNode();
          _api.appendTo(paneElement);

          // initialise this pane's selection box
          _selectionBox = SelectionBox.create();
          _selectionBox.appendTo(paneElement);

          if (Features.isEnabled('edit')) {
            // initialise this pane's floating editor
            _floatingEditor = FloatingEditor.create();
            _floatingEditor.appendTo(paneElement);
          }

          // create a temporary cache of specific row heights for this grid
          SheetModel.specificRowHeights = [];

          DomListener.addListener(document, "keydown", _handlePaneKeyDown);
        };

          /**
           * @api private
           */
          var _initBaseNode = function() {
              // Create a div for the base of the grid
              _baseNode = window.document.createElement(_kGrid_Base_Node.Tag);
              _baseNode.id = _kGrid_Base_Node.Class;
              _baseNode.className = _kGrid_Base_Node.Class;
              _baseNode.style.position = "absolute";

              if(isMainPane) {
                _addColumns(SheetConfig.kGRID_DEFAULT_COLS);
                _addRows(SheetConfig.kGRID_DEFAULT_ROWS);
              }
            };

          /**
           * @api private
           */
          var _initContentNode = function() {
              // Create a div the content of the grid
              _contentNode =
                  window.document.createElement(_kGrid_Content_Node.Tag);
              _contentNode.id = _kGrid_Content_Node.Class;
              _contentNode.className = _kGrid_Content_Node.Class;
              _contentNode.style.position = "absolute";

              //                             Reset the floating widgets store
              _floaterManager.reset();
            };

        /**
         * Handles the keydown events for the directional button with or without
         * the shift key and publishes a signal _events.paneKeyDown
         *
         * @param event {Object} The keydown event object
         * @private
         */
        var _handlePaneKeyDown = function(event) {
          switch (event.keyCode) {
            case _kArrowLeftKeyCode:
            {
              PubSub.publish(_events.paneKeyDown, event.shiftKey ?
                  "shift:left" : "left");
            }
              break;
            case _kArrowUpKeyCode:
            {
              PubSub.publish(_events.paneKeyDown, event.shiftKey ?
                  "shift:up" : "up");
            }
              break;
            case _kArrowRightKeyCode:
            {
              PubSub.publish(_events.paneKeyDown, event.shiftKey ?
                  "shift:right" : "right");
            }
              break;
            case _kArrowDownKeyCode:
            {
              PubSub.publish(_events.paneKeyDown, event.shiftKey ?
                  "shift:down" : "down");
            }
              break;
            default:
            {
              return; // ignore all other keys
            }
          }
        };

        /**
         * Performs a layout of the rows in the grid, to ensure that their
         * positions, heights, headers and cells are laid out correctly.
         * A config object is passed to this method which indicates which rows,
         * and which aspects of these rows, require a layout.
         * The config object can have the following 4 properties:
         *
         * - doUpdateBursting : this property, if defined, is an object that
         *   contains:
         *      - property 'startingRowIdx', whose value is the row index to
         *        start checking at for rows that require their bursting to be
         *        updated
         *      or
         *      - property 'rows', whose value is an array of objects, where
         *        each object contains:
         *          - property 'rowIdx', whose value is a specific row index to
         *            check whether that row requires its bursting to be updated
         *
         * - doUpdateHeights : this property, if defined, is an object that
         *  contains:
         *      - property 'rows', whose value is an array of objects, where
         *        each object contains:
         *          - property 'rowIdx', whose value is a specific row index to
         *            check whether that row requires its height to be updated
         *          - (optional) property 'rowHeight', whose value is a
         *            specificheight to set that row to; if this property is
         *            absent then the height of the row is automatically
         *            calculated based on the height of the cells in that
         *            row and the default row height
         *
         * - doUpdatePositions : this property, if defined, is an object that
         *  contains:
         *      - property 'startingRowIdx', whose value is the row index to
         *        start checking at for rows that require their position to be
         *        updated
         *
         * - doUpdateHeaderValues : this property, if defined, is an object that
         *  contains:
         *      - property 'startingRowIdx', whose value is the row index to
         *        start checking at for rows that require their header value to
         *        be updated
         *
         * Not all 4 properties need to be present.
         * For example, the config object for various operations may look as
         * follows:
         *
         * - laying out variable row heights after a workbook has been opened:
         *
         * config.doUpdateHeights = { rows : [{rowIdx : rowIndexAdded1},
         *  {rowIdx : rowIndexAdded1}, {rowIdx : rowIndexAdded3}] };
         * config.doUpdatePositions = { startingRowIdx : 1 };
         * (no bursting or updating of header values is required)
         *
         * - inserting a row:
         *
         * config.doUpdatePositions =
         *  { startingRowIdx : rowIndexToInsertAt + 1 };
         * config.doUpdateHeaderValues =
         *  { startingRowIdx : rowIndexToInsertAt + 1 };
         * (no bursting or updating of heights is required)
         *
         * - resizing a row:
         *
         * config.doUpdateHeights = { rows : [{rowIdx : rowIndexResized}] };
         * config.doUpdatePositions = { startingRowIdx : rowIndexResized + 1 };
         * (no bursting or updating of headers is required)
         *
         * - updating cells (in multiple rows):
         *
         * config.doUpdateBursting =
         *  { rows : [{rowIdx : rowIndexEdited1}, {rowIdx : rowIndexEdited2}] };
         * config.doUpdateHeights =
         *  { rows : [{rowIdx : rowIndexEdited1}, {rowIdx : rowIndexEdited2}] };
         * config.doUpdatePositions = { startingRowIdx : rowIndexEdited1 + 1 };
         * (no updating of headers is required)
         *
         * Note that this method performs the required layouts as efficiently as
         * possible - first by PREPARING each row with the necessary data that
         * it requires to perform its layout, and then by performing the LAYOUT
         * of each row (using the prepared data).
         * All HTML DOM 'gets' are performed in the PREPARE loops (causing a
         * single render tree relayout to occur) and then all HTML DOM 'sets'
         * are performed in the LAYOUT loops (causing a single render tree
         * invalidation to occur). Doing it this way is much more efficient than
         * having a sequence of 'get-set' operations for each row, which would
         * cause a relayout of the render tree for each row.
         *
         * @param config {object}  The config object that indicates which rows,
         *                         and which aspects of these rows, require a
         *                         layout.
         *                         The config object can have 0 - 4 properties,
         *                         as described above.
         * @api private
         */
        var _layoutRows = function(config) {
          if (config === undefined) {
            throw ("_layoutRows - missing config parameter!");
          }

              var numberOfRows = _rows.length;
              var firstRowIndexToUpdate = numberOfRows;

              // 1. PREPARE the rows for layout (i.e. do all the HTML DOM 'gets'
              // first)
              // LM TODO: During this prepare stage we are looping through the
              // row widgets up to 4 times here - can we somehow combine these
              // loops into a single loop?
              // 1.1. do bursting preparation
              var result = _doPrepRowBursting(config);
              firstRowIndexToUpdate = Math.min(result, firstRowIndexToUpdate);

              // 1.2. do height preparation
              // NOTE: it is important that this loop comes after
              // _doPrepRowBursting(), for height calculations to be correct?
              result = _doPrepRowHeights(config);
              firstRowIndexToUpdate = Math.min(result, firstRowIndexToUpdate);

              // 1.3. do position preparation
              // NOTE: it is important that this loop comes after
              // _doPrepRowHeights(), for position calculations to be correct
              result = _doPrepRowPositions(config);
              firstRowIndexToUpdate = Math.min(result, firstRowIndexToUpdate);

              // 1.4. do header preparation
              result = _doPrepRowHeaders(config, firstRowIndexToUpdate);
              firstRowIndexToUpdate = Math.min(result, firstRowIndexToUpdate);

              // 2. LAYOUT the rows (i.e. now do all the HTML DOM 'sets')
              for(var rowIndex = firstRowIndexToUpdate;
                    rowIndex < numberOfRows; rowIndex++) {
                if(_rows[rowIndex] !== undefined) {
                  _rows[rowIndex].layout(rowIndex);
                }
              }

              // 3. now that the row layouts have been done we need to also
              // update the height of each column (this is another bunch of HTML
              // DOM 'sets')
              _correctUniformColumnHeight();

              // 4. publish an event that the pane layout has changed
              // (eg. allows floating widgets to update their positions)
              var eventData = {
                rowIndex1: firstRowIndexToUpdate,
                rowIndex2: (numberOfRows - 1),
                resizeoccured: config.resizeoccured
              };

              PubSub.publish("qowt:pane:layoutChanged", eventData);
            };

          var _doPrepRowBursting = function(config) {
              var numberOfRows = _rows.length;
              var smallestRowIndex = numberOfRows;

              var burstInfo = config.doUpdateBursting;
              if(burstInfo !== undefined) {
                if(burstInfo.startingRowIdx !== undefined) {
                  // prepare bursting data for all rows from this row downwards
                  for(var rowIndex = burstInfo.startingRowIdx;
                        rowIndex < numberOfRows; rowIndex++) {
                    if(_rows[rowIndex].prepLayoutInfo()) {
                      smallestRowIndex = Math.min(rowIndex, smallestRowIndex);
                    }
                  }
                } else if(burstInfo.rows !== undefined) {
                  var rowArray = burstInfo.rows;
                  // prepare bursting data for the specified rows
                  for(var count = 0, len = rowArray.length;
                        count < len; count++) {
                    var rowInfo = rowArray[count];
                    if(_rows[rowInfo.rowIdx].prepLayoutInfo()) {
                      smallestRowIndex =
                          Math.min(rowInfo.rowIdx, smallestRowIndex);
                    }
                  }
                }
              }
              return smallestRowIndex;
            };

          var _doPrepRowHeights = function(config) {
              var numberOfRows = _rows.length;
              var smallestRowIndex = numberOfRows;

              var heightInfo = config.doUpdateHeights;
              if(heightInfo !== undefined) {
                if(heightInfo.rows !== undefined) {
                  var rowArray = heightInfo.rows;
                  // prepare height data for the specified rows
                  for(var count = 0, len = rowArray.length;
                        count < len; count++) {
                    var rowInfo = rowArray[count];
                    var row = _rows[rowInfo.rowIdx];
                    // ignore the update info (as row isn't present in pane)
                    if(row === undefined) {
                      continue;
                    }
                    if(row.prepLayoutHeight(rowInfo.rowHeight,
                      config.resizedColIndex)) {
                      // the height of this row is different from before
                      smallestRowIndex =
                          Math.min(rowInfo.rowIdx, smallestRowIndex);
                    }
                  }
                }
              }

              if(smallestRowIndex > 0) {
                // Incase smallestRowIndex is for a row that is being hidden or
                // unhidden we need to make sure that we don't forget to process
                // the row above it (to correctly style its header)
                smallestRowIndex--;
              }

              return smallestRowIndex;
            };

          var _doPrepRowPositions = function(config) {
              var numberOfRows = _rows.length;
              var smallestRowIndex = numberOfRows;

              var posInfo = config.doUpdatePositions;
              if(posInfo !== undefined) {
                if(posInfo.startingRowIdx !== undefined) {
                  // prepare position data for all rows from this row downwards
                  // calculate the desired position of the next row based on the
                  // bottom position of the previous row
                  var rowPos = 0;
                  var row = _rows[posInfo.startingRowIdx - 1];
                  if(row && (posInfo.startingRowIdx > 0)) {
                    rowPos = row.getPreppedBottomPos() -
                        SheetConfig.kGRID_GRIDLINE_WIDTH;
                  }

                  for(var rowIndex = posInfo.startingRowIdx;
                        rowIndex < numberOfRows; rowIndex++) {
                    // take into account whether the previous row is hidden
                    // LM TODO: remove this if possible
                    if(_rows[rowIndex - 1] &&
                        _rows[rowIndex - 1].getPreppedHeight() === 0) {
                      rowPos += SheetConfig.kGRID_GRIDLINE_WIDTH;
                    }

                    if(_rows[rowIndex].prepLayoutPos(rowPos)) {
                      smallestRowIndex = Math.min(rowIndex, smallestRowIndex);
                    }
                    rowPos = _rows[rowIndex].getPreppedBottomPos() -
                        SheetConfig.kGRID_GRIDLINE_WIDTH;
                  }
                }
              }
              return smallestRowIndex;
            };

          var _doPrepRowHeaders = function(config, firstRowIndexToUpdate) {
              var numberOfRows = _rows.length;
              var smallestRowIndex = numberOfRows;

              var doUpdateValue = false;
              var doStyleAsAboveHiddenRow = false;
              var doStyleAsBelowHiddenRow = false;

              var startingRowIndex = firstRowIndexToUpdate;
              var headerValueInfo = config.doUpdateHeaderValues;
              if(headerValueInfo !== undefined) {
                if(headerValueInfo.startingRowIdx !== undefined) {
                  startingRowIndex = Math.min(headerValueInfo.startingRowIdx,
                    startingRowIndex);
                  doUpdateValue = true;
                }
              }

              // prepare header data for all rows from the starting row onwards
              for(var rowIndex = startingRowIndex;
                    rowIndex < numberOfRows; rowIndex++) {

                // LM TODO: ensure that accessing the _rows array below is not
                // bad for performance
                var nextRowIndex = rowIndex + 1;
                doStyleAsAboveHiddenRow = (nextRowIndex < numberOfRows) &&
                    (_rows[nextRowIndex] !== undefined) &&
                    (_rows[nextRowIndex].getPreppedHeight() === 0);
                var previousRowIndex = rowIndex - 1;
                doStyleAsBelowHiddenRow = (previousRowIndex >= 0) &&
                    (_rows[previousRowIndex] !== undefined) &&
                    (_rows[previousRowIndex].getPreppedHeight() === 0);

                if((_rows[rowIndex] !== undefined) &&
                    _rows[rowIndex].prepLayoutHeader(doUpdateValue,
                        doStyleAsAboveHiddenRow, doStyleAsBelowHiddenRow)) {
                  smallestRowIndex = Math.min(rowIndex, smallestRowIndex);
                }
              }
              return smallestRowIndex;
            };

          /**
           * Performs a layout of the columns in the grid, to ensure that their
           * positions, widths, headers and cells are laid out correctly.
           * A config object is passed to this method which indicates which
           * columns, and which aspects of these columns, require a layout.
           * The config object can have the following 3 properties:
           *
           * - doUpdateWidths : this property, if defined, is an object that
           *   contains:
           *      - property 'colWidths', whose value is a sparse object of
           *        column widths, containing an 'index:width' pair for each
           *        column whose width needs to be updated
           *
           * - doUpdatePositions : this property, if defined, is an object that
           *   contains:
           *      - property 'startingColIdx', whose value is the column index
           *        to start checking at for columns that require their position
           *        to be updated
           *
           * - doUpdateHeaderValues : this property, if defined, is an object
           *   that contains:
           *      - property 'startingColIdx', whose value is the column index
           *        to start checking at for columns that require their header
           *        value to be updated (e.g. from 'B' to 'C')
           *
           * Not all 3 properties need to be present.
           * For example, the config object for various operations may look as
           * follows:
           *
           * - laying out the column widths after a workbook has been opened:
           *
           * config.doUpdateWidths = { colWidths : {0:118, 2:48, 162:89} };
           * config.doUpdatePositions = { startingColIdx : 1 };
           * (no updating of header values is required)
           *
           * - inserting a column:
           *
           * config.doUpdatePositions =
           *  { startingColIdx : colIndexToInsertAt + 1 };
           * config.doUpdateHeaderValues =
           *  { startingColIdx : colIndexToInsertAt + 1 };
           * (no updating of heights is required)
           *
           * - resizing a column:
           *
           * config.doUpdateWidths = { colWidths : {2:65} };
           * config.doUpdatePositions = { startingColIdx : 3 };
           * (no updating of headers is required)
           *
           * Note that this method performs the required layouts as efficiently
           * as possible - first by PREPARING each column with the necessary
           * data that it requires to perform its layout, and then by performing
           * the LAYOUT of each column (using the prepared data).
           * All HTML DOM 'gets' are performed in the PREPARE loops (causing a
           * single render tree relayout to occur) and then all HTML DOM 'sets'
           * are performed in the LAYOUT loops (causing a single render tree
           * invalidation to occur). Doing it this way is much more efficient
           * than having a sequence of 'get-set' operations for each column,
           * which would cause a relayout of the render tree for each column.
           *
           * @param config {object}  The config object that indicates which
           *                         columns, and which aspects of these columns
           *                         ,require a layout.
           *                         The config object can have 0 - 3 properties
           *                         ,as described above.
           * @api private
           */
          var _layoutColumns = function(config) {
              if(config === undefined) {
                throw new Error("_layoutColumns - missing config parameter!");
              }

              var numberOfCols = _columns.length;
              var firstColIndexToUpdate = numberOfCols;

              // 1. PREPARE the columns for layout (i.e. do all the HTML DOM
              // 'gets' first)
              // LM TODO: During this prepare stage we are looping through the
              // column widgets up to 3 times here - can we somehow combine
              // these loops into a single loop?
              // 1.1. do width preparation
              var result = _doPrepColumnWidths(config);
              firstColIndexToUpdate = Math.min(result, firstColIndexToUpdate);

              // 1.2. do position preparation
              // NOTE: it is important that this loop comes after
              // _doPrepColumnWidths(), for position calculations to be correct
              result = _doPrepColumnPositions(config);
              firstColIndexToUpdate = Math.min(result, firstColIndexToUpdate);

              // 1.3. do header preparation
              result = _doPrepColumnHeaders(config, firstColIndexToUpdate);
              firstColIndexToUpdate = Math.min(result, firstColIndexToUpdate);

              // 2. LAYOUT the columns (i.e. now do all the HTML DOM 'sets')
              for(var colIndex = firstColIndexToUpdate;
                    colIndex < numberOfCols; colIndex++) {
                if(_columns[colIndex] !== undefined) {
                  _columns[colIndex].layout(colIndex);
                }
              }

              // 3. now that the column layouts have been done we need to also
              // update the width of each column (this is another bunch of
              // HTML DOM 'sets')
              _correctUniformRowWidth();

              // 4. publish an event that the pane layout has changed (eg.
              // allows floating widgets to update their positions)
              var eventData = {
                colIndex1: firstColIndexToUpdate,
                colIndex2: (numberOfCols - 1),
                resizeoccured: config.resizeoccured
              };
              PubSub.publish("qowt:pane:layoutChanged", eventData);
            };

          var isValidColumn_ = function(colIdx) {
            return !!(colIdx >= 0 && colIdx < _columns.length);
          };

          var _doPrepColumnWidths = function(config) {
              var smallestColIndex = _columns.length;

              if (config.doUpdateWidths) {
                // prepare width data for the specified columns
                var colWidths = config.doUpdateWidths.colWidths;
                for (var colIndex in colWidths) {
                  var colWidth = colWidths.hasOwnProperty(colIndex) &&
                      isValidColumn_(colIndex) && colWidths[colIndex];

                  if ((colWidth || colWidth === 0) &&
                      _columns[colIndex].prepLayoutWidth(colWidth)) {
                    // the width of this column is different from before
                    smallestColIndex = Math.min(colIndex, smallestColIndex);
                  }
                }
              }

              if(smallestColIndex > 0) {
                // Incase smallestColIndex is for a column that is being hidden
                // or unhidden we need to make sure that we don't forget to
                // process the column above it (to correctly style its header)
                smallestColIndex--;
              }

              return smallestColIndex;
            };

          var _doPrepColumnPositions = function(config) {
              var numberOfCols = _columns.length;
              var smallestColIndex = numberOfCols;

              var posInfo = config.doUpdatePositions;
              if(posInfo !== undefined) {
                if(posInfo.startingColIdx !== undefined) {
                  // prepare position data for all columns from this column
                  // onwards calculate the desired position of the next column
                  // based on the right position of the previous column
                  var colPos = 0;
                  if(posInfo.startingColIdx > 0) {
                    colPos =
                        _columns[
                            posInfo.startingColIdx - 1].getPreppedRightPos() -
                            SheetConfig.kGRID_GRIDLINE_WIDTH;
                  }

                  for(var colIndex = posInfo.startingColIdx;
                        colIndex < numberOfCols; colIndex++) {
                    // take into account whether the previous column is hidden
                    // LM TODO: remove this if possible
                    if(_columns[colIndex - 1] &&
                        _columns[colIndex - 1].getPreppedWidth() === 0) {
                      colPos += SheetConfig.kGRID_GRIDLINE_WIDTH;
                    }

                    if(_columns[colIndex].prepLayoutPos(colPos)) {
                      smallestColIndex = Math.min(colIndex, smallestColIndex);
                    }
                    colPos = _columns[colIndex].getPreppedRightPos() -
                        SheetConfig.kGRID_GRIDLINE_WIDTH;
                  }
                }
              }
              return smallestColIndex;
            };

          var _doPrepColumnHeaders = function(config, firstColIndexToUpdate) {
              var numberOfCols = _columns.length;
              var smallestColIndex = numberOfCols;

              var doUpdateValue = false;
              var doStyleAsLeftOfHiddenCol = false;
              var doStyleAsRightOfHiddenCol = false;

              var startingColumnIndex = firstColIndexToUpdate;
              var headerValueInfo = config.doUpdateHeaderValues;
              if(headerValueInfo !== undefined) {
                if(headerValueInfo.startingColIdx !== undefined) {
                  startingColumnIndex =
                      Math.min(headerValueInfo.startingColIdx,
                          startingColumnIndex);
                  doUpdateValue = true;
                }
              }

              // prepare header data for all columns from the starting column
              // onwards
              for(var colIndex = startingColumnIndex;
                    colIndex < numberOfCols; colIndex++) {

                // LM TODO: ensure that accessing the _columns array below is
                // not bad for performance
                var nextColIndex = colIndex + 1;
                doStyleAsLeftOfHiddenCol = (nextColIndex < numberOfCols) &&
                    (_columns[nextColIndex] !== undefined) &&
                    _columns[nextColIndex].isHidden();

                var previousColIndex = colIndex - 1;
                doStyleAsRightOfHiddenCol = (previousColIndex >= 0) &&
                    (_columns[previousColIndex] !== undefined) &&
                    _columns[previousColIndex].isHidden();

                if((_columns[colIndex] !== undefined) &&
                    _columns[colIndex].prepLayoutHeader(doUpdateValue,
                        doStyleAsLeftOfHiddenCol,
                        doStyleAsRightOfHiddenCol)) {
                  smallestColIndex = Math.min(colIndex, smallestColIndex);
                }
              }

              return smallestColIndex;
            };

          /**
           * Lays out cells with their correct positions and dimensions in the
           * x-plane only.
           * This method is called when a column is resized, which can affect
           * the horizontal positions and dimensions of all cells in the sheet.
           * NOTE: the vertical layout (ie. y-plane is unaffected by
           * this method).
           *
           * This operation does not cause a render tree relayout to occur.
           *
           * @method _layoutCellsHoriz()
           */
          var _layoutCellsHoriz = function() {
              var startingRowIndex = _api.getFirstRowIndex();
              var endRowIndex = _api.getLastRowIndex();

              // JELTE TODO - this function gets called a few times, for example
              // when resizing columns.  Question is, do we really need to reset
              // EVERY cell? or can we have a smarter algorithm that knows which
              // cells to update?
              var row, cells, cell, parentCol;
              for(var i = startingRowIndex; i <= endRowIndex; i++) {
                row = _rows[i];
                if(row) {
                  cells = row.getCells();
                  for(var j = 0; j < cells.length; j++) {
                    cell = cells[j];
                    if(cell) {
                      parentCol = _columns[cell.x];
                      if(parentCol !== undefined) {
                        var burstingAreaStart =
                            SheetModel.ColPos[cell.leftNeighbourIndex + 1];
                        var burstingAreaEnd =
                            SheetModel.ColPos[cell.rightNeighbourIndex - 1] +
                                SheetModel.ColWidths[
                                    cell.rightNeighbourIndex - 1];
                        var leftPos = parentCol.getPosition();
                        var width = parentCol.getWidth();

                        var updateRect = {
                          left: leftPos,
                          width: width
                        };

                        cell.updatePositionAndDimensions(updateRect,
                            burstingAreaStart, burstingAreaEnd);
                      }
                    }
                  }
                }
              }
            };

          /**
           * @api private
           */
          var _addRows = function(numRows, atRowIndex, doSetWidth) {
              numRows = numRows || 0;
              // add the rows at the end of the grid if no row index is
              // specified
              if(atRowIndex === undefined) {
                atRowIndex = _rows.length;
              }

              var position = (atRowIndex === 0) ?
                  0 : _rows[atRowIndex - 1].getPosition() +
                  _rows[atRowIndex - 1].getHeight() -
                  SheetConfig.kGRID_GRIDLINE_WIDTH;

              // the height of the new row(s) should be the height of the row
              // above where it is being inserted.
              // If immediate above row is of height zero, then it is a
              // hidden row. In this case, default height is used.

              var neighbourRow = _rows[atRowIndex - 1];
              var rowHeight = (neighbourRow && neighbourRow.getHeight()) ||
                  _defaultRowHeightInPx;
              var rowWidth = 0;
              if(doSetWidth) {
                rowWidth = SheetModel.ColPos[SheetModel.ColPos.length - 1] +
                  SheetModel.ColWidths[ SheetModel.ColWidths.length - 1] -
                  SheetConfig.kGRID_GRIDLINE_WIDTH;
              }

              // Create widgets for the required number of rows
              for(var rowIndex = atRowIndex;
                    rowIndex < (atRowIndex + numRows); rowIndex++) {

                var rowWidget = Row.create(rowIndex, position, rowHeight);
                if(doSetWidth) {
                  // When user manually inserts rows, we need to set this here,
                  // otherwise row has default width and scrollbar will use that
                  rowWidget.setWidth(rowWidth);
                }
                rowWidget.appendTo(_baseNode, isMainPane);
                _rows[rowIndex] = rowWidget;

                // LM TODO: When the user manually inserts a row that row needs
                // to have the same formatting (no content) as the row above it.
                // So if _rows[rowIndex].getNumOfCells() > 0 then we need to
                // clone those cells for the new row too, but with wiped
                // content?
                position += rowHeight - SheetConfig.kGRID_GRIDLINE_WIDTH;
              }
            };

          /**
           * @api private
           */
          var _addColumns = function(numCols, atColIndex, doSetHeight) {
              numCols = numCols || 0;
              // add the columns to the right of the grid if no column index is
              // specified
              if(atColIndex === undefined) {
                atColIndex = _columns.length;
              }

              var position = (atColIndex === 0) ?
                  0 : _columns[atColIndex - 1].getPosition() +
                  _columns[atColIndex - 1].getWidth() -
                  SheetConfig.kGRID_GRIDLINE_WIDTH;

              // the width of the new column(s) should be the width of the
              // column to the left of where it is being inserted.
              // If immediate left column is of width zero, then it is a
              // hidden column. In this case, default width will be used.
              var neighbourColumn = _columns[atColIndex - 1];
              var colWidth = (neighbourColumn && neighbourColumn.getWidth()) ||
                  _defaultColWidthInPx;
              var colHeight = 0;
              if(doSetHeight) {
                  colHeight = SheetModel.RowPos[SheetModel.RowPos.length-1] +
                              SheetModel.RowHeights[
                                  SheetModel.RowHeights.length-1];
              }

              // Create widgets for the required number of columns
              for(var colIndex = atColIndex;
                    colIndex < (atColIndex + numCols); colIndex++) {

                var colWidget = Column.create(colIndex, position, colWidth);
                if(doSetHeight) {
                  // When user manually inserts cols, we need to set this here,
                  // otherwise col has default height and scrollbar will
                  // use that
                  colWidget.setHeight(colHeight);
                }
                colWidget.appendTo(_baseNode, isMainPane);
                _columns[colIndex] = colWidget;

                // LM TODO: When the user manually inserts a column that column
                // needs to have the same formatting (no content) as the column
                // to the left of it.
                // So if the column to the left has any cells in it then we need
                // to clone those cells for
                // the new column too, but with wiped content?
                position += colWidth - SheetConfig.kGRID_GRIDLINE_WIDTH;
              }
            };

          /**
           * @api private
           */
          var _correctUniformColumnHeight = function() {
              // JELTE TODO: It would be more efficient to do this by updating
              // the CSS rule for .col !
              // set the column heights based on the position and height of the
              // last row
              var uniformColHeight, numOfRows, numOfCols, colIndex;

              numOfRows = _rows.length;
              if(numOfRows > 0) {
                uniformColHeight = _rows[numOfRows - 1].getPosition() +
                    _rows[numOfRows - 1].getHeight() -
                    SheetConfig.kGRID_GRIDLINE_WIDTH;
                numOfCols = _columns.length;
                for(colIndex = 0; colIndex < numOfCols; colIndex++) {
                  if(_columns[colIndex] !== undefined) {
                    _columns[colIndex].setHeight(uniformColHeight);
                  }
                }
              }
            };

          /**
           * @api private
           */
          var _correctUniformRowWidth = function() {
              // JELTE TODO: It would be more efficient to do this by updating
              // the CSS rule for .row !
              // set the row width based on the position and width of the last
              // column
              var uniformRowWidth, numOfCols, numOfRows, rowIndex;

              numOfCols = _columns.length;
              if(numOfCols > 0) {
                uniformRowWidth = _columns[numOfCols - 1].getPosition() +
                  _columns[numOfCols - 1].getWidth() -
                    SheetConfig.kGRID_GRIDLINE_WIDTH;
                numOfRows = _rows.length;
                for(rowIndex = 0; rowIndex < numOfRows; rowIndex++) {
                  if(_rows[rowIndex] !== undefined) {
                    _rows[rowIndex].setWidth(uniformRowWidth);
                  }
                }
              }
            };

          /**
           * @private
           */
          var _resetContentNode = function() {
              _removeAllCells();
              _paneNode.removeChild(_contentNode);
              _contentNode = undefined;

              _initContentNode();
              _paneNode.appendChild(_contentNode);
            };

          /**
           * @private
           */
          var _cleanBaseNode = function() {
              _paneNode.removeChild(_baseNode);
              _baseNode = undefined;

              _initBaseNode();
              _paneNode.appendChild(_baseNode);
            };

          /**
           * @private
           */
          var _resetBaseNode = function() {

              _defaultColWidthInPx = SheetConfig.kGRID_DEFAULT_COL_WIDTH;
              _defaultRowHeightInPx = SheetConfig.kGRID_DEFAULT_ROW_HEIGHT;
              _baseNode.className = "pane-base";
              // NOTE: Optimisation here is to only reset the FORMATTING, not
              // the LAYOUT on columns & rows as that will be updated
              // separately.
              _resetFormattingOnColumns();
              _resetFormattingOnRows();
            };

          /**
           * @api private
           */
          var _resetFormattingOnColumns = function() {
              var numberOfCols = _columns.length;
              for(var colIndex = 0; colIndex < numberOfCols; colIndex++) {
                if(_columns[colIndex]) {
                  _columns[colIndex].resetFormatting();
                }
              }
            };

          /**
           * @api private
           */
          var _resetFormattingOnRows = function() {
              var numberOfRows = _rows.length;
              for(var rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
                if(_rows[rowIndex]) {
                  _rows[rowIndex].resetFormatting();
                }
              }
            };
          /**
           * @api private
           */
          var _removeAllCells = function() {
              var numberOfCols = _columns.length;
              for(var colIndex = 0; colIndex < numberOfCols; colIndex++) {
                if(_columns[colIndex]) {
                  _columns[colIndex].removeCells();
                }
              }
              var numberOfRows = _rows.length;
              for(var rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
                if(_rows[rowIndex]) {
                  _rows[rowIndex].removeCells();
                }
              }
            };

          /**
           * @api private
           */
          var _replaceAllContent = function(newContent) {
              _paneNode.removeChild(_contentNode);

              _contentNode = newContent;
              _paneNode.appendChild(_contentNode);
              // LM TODO: the _cells arrays in the row and column widgets need
              // to be repopulated!
            };

        var _calculateRectForSelection = function(fromRowIdx, toRowIdx,
                                                  fromColIdx, toColIdx,
                                                  frozenScrollOffsetX,
                                                  frozenScrollOffsetY) {
          // if the given range does not exist in this pane then position the
          // pane's selection node 'off pane' so that it's borders don't show
          var rect = {
            topPos: -5,
            leftPos: -5,
            height: 0,
            width: 0
          };

          var rowWidget = _api.getRow(Math.min(fromRowIdx, toRowIdx));
          var colWidget = _api.getColumn(Math.min(fromColIdx, toColIdx));
          if(rowWidget && colWidget) {
            rect.topPos = rowWidget.getPosition() - frozenScrollOffsetY;
            rect.leftPos = colWidget.getPosition() - frozenScrollOffsetX;
          }

          for(var rIdx = Math.min(fromRowIdx, toRowIdx); rIdx <=
              Math.max(fromRowIdx, toRowIdx); rIdx++) {
            rowWidget = _api.getRow(rIdx);
            if(rowWidget && !rowWidget.isHidden()) {
              rect.height += rowWidget.getHeight() -
                  SheetConfig.kGRID_GRIDLINE_WIDTH;
            }
          }

          for(var cIdx = Math.min(fromColIdx, toColIdx); cIdx <=
              Math.max(fromColIdx, toColIdx); cIdx++) {
            colWidget = _api.getColumn(cIdx);
            if(colWidget && !colWidget.isHidden()) {
              rect.width += colWidget.getWidth() -
                  SheetConfig.kGRID_GRIDLINE_WIDTH;
            }
          }

          return rect;
        };

        var _seedFloatingEditor = function(cellWidget, seed) {
          if(seed) {
            // the floating editor is being displayed because the user typed
            // a character - so clear the floating editor text
            _floatingEditor.setDisplayText('');
          }
          else {
            // the floating editor is being displayed because the user
            // double-clicked - so seed the floating editor with the content of
            // the cell below it
            var config = {
              editableText: '',
              cellText: ''
            };

            if(cellWidget) {
              // if there is a cell widget at the target location
              // then use its text in the floating editor
              var cf = cellWidget.getConfig();
              if(cf.editableText) {
                config.editableText = cf.editableText;
              }
              if(cf.cellText) {
                config.cellText = cf.cellText;
              }
            }

            var text = config.editableText || config.cellText;
            _floatingEditor.setDisplayText(text);
          }
        };

        var _formatFloatingEditor = function(cellWidget, rowIndex, colIndex) {
          var config = {};
          var rowWidget = _rows[rowIndex];
          var colWidget = _columns[colIndex];

          // if there is a cell widget at the target location then configure
          // the floating editor's formatting from the cell's formatting
          if(cellWidget) {
            config = cellWidget.getConfig();
          }
          else if(rowWidget && rowWidget.getFormatting()) {
            // otherwise use the row formatting
            config = rowWidget.getFormatting();
          }
          else if(colWidget && colWidget.getFormatting()) {
            // otherwise use the column formatting
            config = colWidget.getFormatting();
          }
          else if(SheetModel.defaultFormatting) {
            // otherwise use the workbook formatting
            config.formatting = SheetModel.defaultFormatting;
            config.horizontalAlign = SheetModel.defaultFormatting.ha;
            config.verticalAlign = SheetModel.defaultFormatting.va;
          }

          // reset the floating editor's formatting
          // (the floating editor may previously have been displayed
          // for a different cell)
          _floatingEditor.resetTextFormatting(config.formatting);
          _floatingEditor.resetTextAlignment(
              config.horizontalAlign, config.verticalAlign);
          _floatingEditor.setBackgroundColor(
              config.backgroundColor || "white");

          return config.isWrapText;
        };

        var _positionFloatingEditor = function(anchorRowIdx, anchorColIdx,
                                               frozenScrollOffsetX,
                                               frozenScrollOffsetY, isWrapped) {
          var kGUTTER = 2;
          // calculate the 'rect' needed to place the floating editor over the
          // anchor cell, taking any floater widgets into account
          var adjustedObj =
              _floaterManager.calculateAdjustedSelectionRange(anchorRowIdx,
                  anchorRowIdx, anchorColIdx, anchorColIdx, true);
          var rect = _calculateRectForSelection(adjustedObj.minRowIdx,
              adjustedObj.maxRowIdx, adjustedObj.minColIdx,
              adjustedObj.maxColIdx, frozenScrollOffsetX, frozenScrollOffsetY);

          // calculate the maximum width of the floating editor
          if(isWrapped) {
            // if the anchor cell is wrapped then the floating editor should
            // grow no wider than its initial width
            rect.maxWidth = rect.width;
          }
          else {
            // otherwise it should be able to grow in width to the right hand
            // side of the viewport
            rect.maxWidth = _paneNode.clientWidth - rect.leftPos +
                _paneNode.scrollLeft - SheetConfig.kGRID_GRIDLINE_WIDTH -
                kGUTTER;
          }

          // calculate the maximum height of the floating editor
          // (it should be able to grow in height to the bottom of the viewport)
          rect.maxHeight = _paneNode.clientHeight - rect.topPos +
              _paneNode.scrollTop - SheetConfig.kGRID_GRIDLINE_WIDTH - kGUTTER;

          // position the floating editor node
          _floatingEditor.positionOver(rect);
        };

        var _setFloatingEditorVisibility = function(flag) {
          _floatingEditor.setVisibility(flag);
        };

        var _reattachWidgets = function(floatersToReappend) {
          if(floatersToReappend) {
            for(var i = 0; i < floatersToReappend.length; i++) {
              _floaterManager.attachWidget(floatersToReappend[i]);
            }
          }
        };

        var _reappendOldNodes = function(baseNodesToReappend,
                                          contentNodesToReappend) {
          if(baseNodesToReappend) {
            _baseNode.appendChild(baseNodesToReappend);
          }
          if(contentNodesToReappend) {
            _contentNode.appendChild(contentNodesToReappend);
          }
        };

        var _layoutAfterRowColOp = function(isRow, indexOfOperation) {
          var config = {};
          if(isRow) {
            config.doUpdatePositions = {
              startingRowIdx: indexOfOperation
            };
            config.doUpdateHeaderValues = {
              startingRowIdx: indexOfOperation
            };
            _layoutRows(config);
          } else {
            config.doUpdatePositions = {
              startingColIdx: indexOfOperation
            };
            config.doUpdateHeaderValues = {
              startingColIdx: indexOfOperation
            };
            _layoutColumns(config);
          }
        };

        // Make space in corresponding array (_rows or _columns)
        // Create new widgets (or put the old ones back in case of revert)
        // Update the index of the affected rows or cols
        // Make space for the rows or cols in the other array
        // (if we insert rows, make space for them in the columns too)
        // Update floaters
        // Put back removed nodes (in case of revert)
        // Layout
        var _insertRowsColumns = function(indexToInsertAt, num,
                                            isRow, opt_widgets) {
          var i, wid, widgetsToReappend, remove,
            floatersToReappend, baseNodesToReappend, contentNodesToReappend;

          // Main array is row array, if we insert rows
          // Main array is col array, if we insert cols
          var mainWidgetArray = isRow ? _rows : _columns;
          var otherWidgetArray = isRow ? _columns : _rows;

          if(indexToInsertAt === undefined ||
             mainWidgetArray.length < indexToInsertAt ||
             (indexToInsertAt === 0 && mainWidgetArray.length === 0)) {
            return;
          }

          // If we have opt_widgets, this is doRevert of delete cols or rows
          if(opt_widgets) {
            widgetsToReappend =
              isRow ?
                  opt_widgets.rowWidgetsToReappend :
                  opt_widgets.colWidgetsToReappend;
            floatersToReappend = opt_widgets.floatersToReappend;
            baseNodesToReappend = opt_widgets.baseNodesToReappend;
            contentNodesToReappend = opt_widgets.contentNodesToReappend;
          }

          // Make sure we are inserting at least one
          num = num ? num : 1;

          // Add space into the main (rows or cols) array
          for(i = 0; i < num; i++) {
            mainWidgetArray.splice(indexToInsertAt, 0, undefined);
          }

          // Put back the widgets (in case of revert)
          if(widgetsToReappend && widgetsToReappend.length) {
            for(var j = 0; j < widgetsToReappend.length; j++) {
              wid = widgetsToReappend[j];
              mainWidgetArray[indexToInsertAt + j] = wid;
              if(wid) {
                wid.reappendHeader();
              }
            }
          } else { // Or add rows or cols
            if(isRow) {
              _addRows(num, indexToInsertAt, true);
              // We can have max 65536 rows, remove the rest
              if(_rows.length > SheetConfig.kGRID_DEFAULT_ABS_MAX_ROWS) {
                remove = _rows.length - SheetConfig.kGRID_DEFAULT_ABS_MAX_ROWS;
                _rows.splice(_rows.length-remove, remove);
              }
            } else {
              _addColumns(num, indexToInsertAt, true);
              // We always want to have exactly 256 cols, remove the rest
              if(_columns.length > SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS) {
                remove = _columns.length -
                    SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS;
                _columns.splice(_columns.length-remove, remove);
              }
            }
          }

          // Update affected row/column indices (including cell indices)
          var total = mainWidgetArray.length;
          for(i = indexToInsertAt + num; i < total; i++) {
            if(mainWidgetArray[i]) {
              mainWidgetArray[i].updateIndex(i);
            }
          }

          // In case of row insertion, make space in colums' cell arrays for the
          // new rows and in case this is revert, attach the cells to the
          // columns.
          // In case of col insertion, it's all vice versa.
          var numOther = otherWidgetArray.length;
          for(var index1 = 0; index1 < numOther; index1++) {
            if(otherWidgetArray[index1] !== undefined) {
              otherWidgetArray[index1].insertCells(indexToInsertAt, num);
              if(widgetsToReappend) {
                i = 0; // Attach the old cells
                for(var index2 = indexToInsertAt;
                      index2 < indexToInsertAt + num; index2++) {
                  wid = widgetsToReappend[i];
                  var cell = wid.getCell(index1);
                  if(cell) {
                    otherWidgetArray[index1].attachWidget(cell);
                  }
                  i++;
                }
              }
            }
          }

          // Update floaters
          if(isRow) {
            _floaterManager.updateFloatersAfterRowSplice(indexToInsertAt,
                num);
          } else {
            _floaterManager.updateFloatersAfterColumnSplice(indexToInsertAt,
                num);
          }

          // In case of revert, we may need to re-attach floaters
          _reattachWidgets(floatersToReappend);

          // Now put all the old nodes back if they exist
          _reappendOldNodes(baseNodesToReappend, contentNodesToReappend);
          //Updating specificRowHeights cache with updated heights of respective
          // row as inserting new row will change row Ids.
          _api.updateSpecificRowHeights(total);
          // Layout
          _layoutAfterRowColOp(isRow, indexToInsertAt);
        };

        // Remove the deleted nodes (row, col, cell nodes) from DOM
        // Remove row/col widgets from their arrays
        // Update the index of affected row/col widgets
        // Remove the cells from the other array too
        // Layout
        var _deleteRowsColumns = function(indexToDeleteAt, num, isRow) {
          if(indexToDeleteAt === undefined) {
            return;
          }

          // Main array is row array, if we delete rows
          // Main array is col array, if we delete cols
          var mainWidgetArray = isRow ? _rows : _columns;
          var otherWidgetArray = isRow ? _columns : _rows;

          if(mainWidgetArray.length < indexToDeleteAt) {
            return;
          }

          var i, retVal = { };
          retVal.baseNodesToReappend = document.createDocumentFragment();
          retVal.contentNodesToReappend = document.createDocumentFragment();

          num = num ? num : 1;

          // Remove the nodes from the DOM
          for(i = indexToDeleteAt; i < indexToDeleteAt + num; i++) {
            if(mainWidgetArray[i]) {
              mainWidgetArray[i].
                  removeFromParent(retVal.baseNodesToReappend,
                  retVal.contentNodesToReappend);
            }
          }

          // Remove the widgets themselves
          if(isRow) {
            retVal.rowWidgetsToReappend = _rows.splice(indexToDeleteAt, num);
          } else {
            retVal.colWidgetsToReappend = _columns.splice(indexToDeleteAt, num);
          }

          // Update the index of the affected rows/cols (plus their
          // cells' indices)
          var total = mainWidgetArray.length;
          for(i = indexToDeleteAt; i < total; i++) {
            if(mainWidgetArray[i]) {
              mainWidgetArray[i].updateIndex(i);
            }
          }

          // Remove the cells from the other array, too (in case we delete
          // rows, detach the deleted cell widgets from columns, too)
          var numOther = otherWidgetArray.length;
          for(i = 0; i < numOther; i++) {
            if(otherWidgetArray[i] !== undefined) {
              otherWidgetArray[i].deleteCells(indexToDeleteAt, num);
            }
          }

          // Update floaters and layout
          if(isRow) {
            retVal.floatersToReappend =
              _floaterManager.updateFloatersAfterRowSplice(indexToDeleteAt,
                                    num, true, retVal.contentNodesToReappend);
          } else {
            retVal.floatersToReappend =
              _floaterManager.updateFloatersAfterColumnSplice(indexToDeleteAt,
                                    num, true, retVal.contentNodesToReappend);
          }
          //Updating specificRowHeights cache with updated heights of respective
          // row as deleting a row will change row Ids of existing rows.
          _api.updateSpecificRowHeights(total);
          // Layout
          _layoutAfterRowColOp(isRow, indexToDeleteAt);

          return retVal;
        };

        /*!Initialise the grid control*/
        _init();
        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
