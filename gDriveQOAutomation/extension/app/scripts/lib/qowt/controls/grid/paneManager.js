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
 * Constructor for the Pane Manager, which is a helper for the Workbook Layout
 * Control.
 *
 * The pane manager is responsible for creating and managing the individual
 * panes that are required to represent the current sheet.
 * A sheet has always 4 panes, regardless the sheet is frozen or not.
 * If the sheet is not frozen some panes would be empty.
 * Each pane is used to represent an area of the sheet.
 * If the sheet is frozen then the pane manager also manages the frozen row and
 * column headers that are displayed above the normal row and column headers.
 *
 * - A non-frozen sheet: only the 'bottom-right' pane, which is also referred to
 * as the 'main pane', has content, the other panes are empty.
 * - A sheet that is frozen at a row anchor: only the 'bottom-right' and
 * 'top-right' have content.
 * - A sheet that is frozen at a column anchor: only the 'bottom-right' and
 * 'bottom-left' panes have content.
 * - A sheet that is frozen at a cell: All the 4 panes ie. 'bottom-right',
 * 'bottom-left', 'top-right' and 'top-left' panes have content, as follows:
 *
 * ----------------------------------------------------------
 * |                |                                       |
 * |  'top-left'    |            'top-right'                |
 * |                |                                       |
 * |                |                                       |
 * ----------------------------------------------------------
 * |                |                                       |
 * |                |                                       |
 * |                |                                       |
 * |                |                                       |
 * |                |                                       |
 * | 'bottom-left'  |           'bottom-right               |
 * |                |                                       |
 * |                |                                       |
 * |                |                                       |
 * |                |                                       |
 * ----------------------------------------------------------
 *
 * - The 'bottom-right' pane.
 *   This pane contains all rows and all columns of the sheet, and covers the
 *   entire area of the workbook's sheet area.
 *   Every sheet has content in the 'bottom-right' pane.
 *
 * - The 'top-right' pane.
 *   This pane contains all columns of the sheet, and the subset of rows that
 *   are above the frozen row.
 *   This pane has the same width as the 'bottom-right' pane, but is shorter in
 *   height.
 *
 * - The 'bottom-left' pane.
 *   This pane contains all rows of the sheet, and the subset of columns that
 *   are to the left of the frozen column.
 *   This pane has the same height as the 'bottom-right' pane, but is slimmer in
 *   width.
 *
 * - The 'top-left' pane.
 *   This pane contains the subset of columns that are to the left of the frozen
 *   cell and the subset of rows that are above the frozen cell.
 *   This pane is shorter in height than the 'bottom-right' pane, and is slimmer
 *   in width.
 *
 * The Pane Manager ensures that the position and dimensions of each pane are
 * correct in relation to each other, and z-indices are used to ensure that the
 * panes are layered appropriately - e.g. the 'top-left' pane always appears
 * above all other panes. The Pane Manager also listens for scroll events on the
 * 'bottom-right' pane and adjusts the other panes accordingly.
 */
define([
  'qowtRoot/widgets/grid/pane',
  'qowtRoot/controls/grid/selectionGestureHandler',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/cssManager',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/rowHeaderContainer',
  'qowtRoot/utils/formulaUtils',
  'qowtRoot/utils/search'
], function(
    Pane,
    SelectionGestureHandler,
    PubSub,
    DomListener,
    CssManager,
    SheetModel,
    SheetConfig,
    SheetSelectionManager,
    ColHeaderContainer,
    RowHeaderContainer,
    FormulaUtils,
    SearchUtils) {

  'use strict';

  // Private data
  var _container,
      _events = {
        paneScrolled: "qowt:paneManager:scrolled",
        lastRowProcessed: "qowt:workbook:lastRowProcessed"
      },

      _panesFrozen = false,
      _frozenRowIdx,
      _frozenColIdx,

      _freezeWidth = 0,
      _freezeHeight = 0,

      _scrollOffsetX = 0,
      _scrollOffsetY = 0,

      _mainPane,

      _kPane_Node = 'div',

      _kPane_Node_Class = 'qowt-sheet-pane',

      // CSS classes of the four panes
      _kPane_Top_Left_Class = "top-left",
      _kPane_Top_Right_Class = "top-right",
      _kPane_Bottom_Left_Class = "bottom-left",
      _kPane_Bottom_Right_Class = "bottom-right",

      _kPane_Top_Left_Border_Class = "top-left-border",
      _kPane_Scroller_Class = 'qowt-scroller',

      // Indexes of the four panes
      _kPane_Top_Left = 0,
      _kPane_Top_Right = 1,
      _kPane_Bottom_Left = 2,
      _kPane_Bottom_Right = 3,

      _kNumber_Of_Panes = 4,

      _hiddenGridLines = false,

      // JELTE TODO: these values should be set inside the pane
      // widget! not in yet-another-object-wrapper here
      _panes = [];

  var _api = {

    /**
     * required to be called by the client, in order to correctly
     * set the containing div to be used in this singleton.
     *
     * @param container {HTMLElement} containing div for the panemanager
     */
    init: function(container) {
      _container = container;

      _createPanes();

      _addListeners();
    },

    /**
     * Scroll the pane.
     * JELTE TODO: fix this for frozen panes
     *
     * @param offsetX {number} number of pixels to move over X-axis
     * @param offsetY {number} number of pixels to move over Y-axis
     */
    scroll: function(offsetX, offsetY) {
      _container.scrollLeft = Math.max(_container.scrollLeft - offsetX, 0);
      _container.scrollTop = Math.max(_container.scrollTop - offsetY, 0);
    },

    /**
     * Populates any existing extra panes (other than the main pane) with
     * the appropriate rows, columns and cells (cloned from the main pane).
     * This can be done in batches, by specifying a range of rows.
     *
     * @param fromRow {number}      The index of the row at the start of the
     *                              range
     * @param toRow {number}        The index of the row at the end of the range
     * @param justFrozen {boolean}  Tell if the sheet has just been frozen or
     *                              if we are loading a sheet already frozen
     * @method populateFrozenPanes()
     */
    populateFrozenPanes: function(fromRow, toRow, justFrozen) {
      if (fromRow === undefined) {
        fromRow = 0;
      }
      if (toRow === undefined) {
        toRow = _mainPane.getLastRowIndex();
      }

      if (_frozenColIdx > (_mainPane.getNumOfCols() - 1)) {
        // if the frozen column index is beyond what is displayed then don't
        // freeze vertically
        _frozenColIdx = 0;
      }
      if (_frozenRowIdx > (_mainPane.getNumOfRows() - 1)) {
        // if the frozen row index is beyond what is displayed then don't freeze
        // horizontally
        _frozenRowIdx = 0;
      }

      if (!_panesFrozen && (_frozenRowIdx > 0 ||
          _frozenColIdx > 0)) {
        // set the positions of the base and content nodes of the panes, based
        // on the main pane's scroll position
        if (justFrozen) {
          _setPaneInnerPositions();
        }
        _api.adjustPanesToFitScrollbars();

        _panesFrozen = true;
        _adjustSelectionBoxTopLeftPos(-_scrollOffsetX, -_scrollOffsetY);
      }

      _doPopulate(fromRow, toRow);

      if (!justFrozen) {
        _scrollTopRightAndBottomLeftPanes( _mainPane.getPaneNode().scrollLeft,
            _mainPane.getPaneNode().scrollTop);
      }
    },

    /**
     * Gets all of the panes
     *
     * @method getAllPanes()
     * @return {array} The array of pane objects
     */
    getAllPanes: function() {
      return _panes;
    },

    /**
     * Gets the main pane object (aka bottom right pane).
     *
     * @method getMainPane()
     * @return {object} The main pane object
     */
    getMainPane: function() {
      return _mainPane;
    },

    /**
     * Gets the top left pane object.
     *
     * @method getTopLeftPane()
     * @return {object} The top left pane object
     */
    getTopLeftPane: function() {
      return _panes[_kPane_Top_Left];
    },

    /**
     * Gets the top right pane object.
     *
     * @method getTopRightPane()
     * @return {object} The top right pane object
     */
    getTopRightPane: function() {
      return _panes[_kPane_Top_Right];
    },

    /**
     * Gets the bottom left pane object.
     *
     * @method getBottomLeftPane()
     * @return {object} The bottom left pane object
     */
    getBottomLeftPane: function() {
      return _panes[_kPane_Bottom_Left];
    },

    getActivePane: function() {
      return SelectionGestureHandler.getActivePane();
    },

    /**
     * Update active pane index according to new anchor selection.
     *
     */
    updateActivePaneIdx: function() {
      if (_api.isFrozen()) {
        SelectionGestureHandler.updateActivePaneIdx(
          _api.getFrozenRowIndex(), _api.getFrozenColumnIndex());
      }
    },

    /**
     * Returns active pane name.
     *
     * @return {String} - one of the 'top_left', 'top_right', 'bottom_right' or
     *     'bottom_left'
     */
    getActivePaneName: function() {
      return SelectionGestureHandler.getActivePaneName();
    },


    setFrozenRowIndex: function(frozenRowIdx) {
      _frozenRowIdx = frozenRowIdx;
    },


    setFrozenColumnIndex: function(frozenColIdx) {
      _frozenColIdx = frozenColIdx;
    },


    getFrozenRowIndex: function() {
      return _frozenRowIdx;
    },


    getFrozenColumnIndex: function() {
      return _frozenColIdx;
    },


    /**
     * Resets the panes in the current sheet.
     * This unfreezes the sheet if it is frozen.
     * The main pane is also reset so that its content is removed.
     *
     * JELTE TODO: this should also remove all listeners so that
     * unit tests can use it??
     *
     * @method reset()
     */
    reset: function() {
      // unfreeze the sheet if it is frozen
      _api.unfreezePanes();
      // hide the cell highlighting for a cut operation when changing sheet
      _api.hideCellHighlighting();
      _hiddenGridLines = false;
      // reset the contents of the main pane
      _mainPane.reset();
    },

    /**
     * Sets the scroll positions of the panes in the specified object according
     * to the specified x and y values.
     *
     * @method setPaneScrollPositions()
     * @param obj {object} An object containing information on
     *                     the desired scroll position of the panes
     */
    setPaneScrollPositions: function(obj) {
      _setPaneScrollPositions(obj);
    },

    /**
     * Returns whether or not the current sheet is frozen.
     *
     * @method isFrozen()
     * @return {boolean} A flag indicating whether or not the current sheet is
     *                   frozen; true if so, otherwise false
     *
     */
    isFrozen: function() {
      return _panesFrozen;
    },

    /**
     * Freeze the panes.
     */
    freezePanes: function() {
      if (!_panesFrozen) {
        _api.populateFrozenPanes(0, _mainPane.getLastRowIndex(), true);
        _api.updateActivePaneIdx();
      }
    },

    /**
     * Unfreezes the panes in the current sheet (if the sheet is frozen).
     * Any additional panes (top-left, top-right, bottom-left) are removed
     * from the HTML DOM and the main pane (bottom-right) has its scroll
     * position re-adjusted to where it was when the sheet was frozen.
     *
     * @method unfreezePanes()
     */
    unfreezePanes: function() {
      if (_panesFrozen) {

        _mainPane.getBaseNode().style.top = 0;
        _mainPane.getContentNode().style.top = 0;
        _mainPane.getPaneNode().scrollTop = _scrollOffsetY;

        _mainPane.getBaseNode().style.left = 0;
        _mainPane.getContentNode().style.left = 0;
        _mainPane.getPaneNode().scrollLeft = _scrollOffsetX;

        var eventScrollOffsetX = _scrollOffsetX,
            eventScrollOffsetY = _scrollOffsetY;

        _adjustRowHeadersTop(_scrollOffsetY);
        _adjustColHeadersLeft(_scrollOffsetX);

        _scrollOffsetX = 0;
        _scrollOffsetY = 0;

        _freezeWidth = 0;
        _freezeHeight = 0;

        _frozenRowIdx = undefined;
        _frozenColIdx = undefined;

        _cleanPanes();

        _layoutPanes();

        ColHeaderContainer.removeFrozen();
        RowHeaderContainer.removeFrozen();
        ColHeaderContainer.setFrozenContainerWidth(0);
        RowHeaderContainer.setFrozenContainerHeight(0);

        // JELTE TODO fix this
        // _removeFrozenWidgets(eventScrollOffsetX, eventScrollOffsetY);

        _adjustSelectionBoxTopLeftPos(eventScrollOffsetX, eventScrollOffsetY);
        _api.updateActivePaneIdx();
        _panesFrozen = false;
      }
    },

    /**
     * Resizes a column in the sheet by updating the affected panes.
     *
     * @param colIndex {Number} The index of the column to be resized
     * @param deltaX {Number}   The difference in pixels of the new width from
     *                          the old width. For example, a value of -10
     *                          indicates that the new width is 10 pixels less
     *
     * @method resizeColumn(colIndex,deltaX)
     */
    resizeColumn: function(colIndex, deltaX) {
      // Resizing a column in a sheet requires two things to happen:
      // 1. Every pane that contains the target column must have resizeColumn()
      //    called on it
      // 2. Every pane must then have layoutRowHeights() called on it.
      //    This is to cover the case where the resized column contains wrapped
      //    cells, which will cause the rows to which they belong to change in
      //    height
      //
      // LM TODO: to optimise step 2 above we could only call layoutRowHeights()
      // on a pane if that pane contains a row that we know has changed in
      // height the bottom right pane always exists and it contains all columns
      var config = {};
      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        if (_panes[i]) {
          if (_panes[i].getColumn(colIndex) !== undefined) {
            _panes[i].resizeColumn(colIndex, deltaX);
          }
          config.startRowIndex = _panes[i].getFirstRowIndex();
          config.endRowIndex = _panes[i].getLastRowIndex();
          config.resizedColIndex = colIndex;
          _panes[i].layoutRowHeights(config, true);
        }
      }

      _layoutPanes();

      // JELTE TODO: fix this
      // _updateFrozenColumnWidgets(colIndex, deltaX);
    },

    /**
     * Resizes a row in the sheet by updating the affected panes.
     *
     * @param rowIndex {Number} The index of the row to be resized
     * @param deltaY {Number}   The difference in pixels of the new height from
     *                          the old height. For example, a value of -10
     *                          indicates that the new height is 10 pixels less
     *
     * @method resizeRow(rowIndex,deltaY)
     */
    resizeRow: function(rowIndex, deltaY) {
      // Resizing a row in a sheet requires one thing to happen:
      // 1. Every pane that contains the target row must have resizeRow() called
      // on it the bottom right pane always exists and it contains all rows
      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        if (_panes[i]) {
          if (_panes[i].getRow(rowIndex) !== undefined) {
            _panes[i].resizeRow(rowIndex, deltaY);
          }
        }
      }

      _layoutPanes();

      // JELTE TODO FIX THIS
      // _updateFrozenRowWidgets(rowIndex, deltaY);
    },

    /**
     * Stores the default row height.
     *
     * @param height {number} The default row height in points
     * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
     *      GetSheetInformation-element-schema.json
     * @method setDefaultRowHeight(height)
     */
    setDefaultRowHeight: function(height) {
      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        if (_panes[i]) {
          _panes[i].setDefaultRowHeight(height);
        }
      }
    },

    /**
     * Stores the default column width.
     *
     * @param width {number} The default column width in points
     * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
     *      GetSheetInformation-element-schema.json
     * @method setDefaultColumnWidth(width)
     */
    setDefaultColumnWidth: function(width) {
      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        if (_panes[i]) {
          _panes[i].setDefaultColumnWidth(width);
        }
      }
    },

    /**
     * All four panes are effectively positioned on top of one another
     * with the bottom right pane being at the lowest z-index. It is full
     * screen and the "main" pane, which contains the scrollbars for the
     * entire grid. This means we have to make sure the top-right and
     * bottom-left panes are adjusted to not cover the scrollbars of the
     * bottom-right pane...
     */
    adjustPanesToFitScrollbars: function() {
      var zoom = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
      var sbSize = SheetConfig.kSCROLLBAR_SIZE / zoom + 'px';
      if (_panes[_kPane_Top_Right]) {
        _panes[_kPane_Top_Right].getPaneNode().style.right = sbSize;
      }
      if (_panes[_kPane_Bottom_Left]) {
        _panes[_kPane_Bottom_Left].getPaneNode().style.bottom = sbSize;
      }

      var buttonSelector = ".qowt-sheet-container-panes ." +
        _kPane_Bottom_Right_Class + "::-webkit-scrollbar-button";
      CssManager.addRule(buttonSelector, {
        'width': sbSize,
        'height': sbSize
      });
      var selector = ".qowt-sheet-container-panes ." +
        _kPane_Bottom_Right_Class + "::-webkit-scrollbar";
      CssManager.addRule(selector, {
        'width': sbSize,
        'height': sbSize
      });

      var colHeaderSelector = "#qowt-sheet-workbook " +
                              ".qowt-sheet-col-header-container";
      CssManager.addRule(colHeaderSelector, {
        'right': (parseInt(sbSize, 10) -
                  SheetConfig.kGRID_GRIDLINE_WIDTH) + 'px',
        'border-right-width': (Math.ceil(1 / zoom) + 'px')
      });

      var rowHeaderSelector = "#qowt-sheet-workbook " +
        ".qowt-sheet-row-header-container";
      CssManager.addRule(rowHeaderSelector, {
        'bottom': (parseInt(sbSize, 10) -
                   SheetConfig.kGRID_GRIDLINE_WIDTH) + 'px',
        'border-bottom-width': (Math.ceil(1 / zoom) + 'px')
      });

      CssManager.flushCache();

      var verticalResizeSelector = "#qowt-sheet-workbook " +
                                   ".qowt-sheet-resizing-line-vertical";
      CssManager.addRule(verticalResizeSelector, {
        'bottom': sbSize
      });
      var horizontalResizeSelector = "#qowt-sheet-workbook " +
                                     ".qowt-sheet-resizing-line-horizontal";
      CssManager.addRule(horizontalResizeSelector, {
        'right': sbSize
      });
    },

    /**
     * Scrolls the given selection into view, or the current selection if none
     * is provided. If the selection is a range then the edge of the range that
     * is furthest from the anchor cell is scrolled into view.
     * If the selection has 'jumped' across to a different pane then the
     * necessary panes are automatically scrolled to ensure that the selected
     * cell (or contiguous cells in the selected range) is visible
     *
     * @param {object or undefined} opt_selectionObj The selection
     *                              to be scrolled into view
     */
    scrollCellSelectionIntoView: function(opt_selectionObj) {
      // We should restrain from scrolling the pane when row/column header is
      // clicked otherwise the pane will be reset to top-left cell's position
      // (A1, [0,0]) thereby changing the view-port. However there should be an
      // exception for frozen panes because when panes are frozen and header is
      // clicked the cell on zeroth row/column will be an anchor and that should
      // be brought in view.
      if (!_api.isFrozen() && _isCurrentSelectionAHeader()) {
        return;
      }

      var selectionBox = _mainPane.getSelectionBox();
      var area = {
        topPos: selectionBox.getTopPosition(),
        bottomPos: selectionBox.getTopPosition() + selectionBox.getHeight(),
        leftPos: selectionBox.getLeftPosition(),
        rightPos: selectionBox.getLeftPosition() + selectionBox.getWidth(),
        width: selectionBox.getWidth(),
        height: selectionBox.getHeight()
      };

      _scrollAreaIntoView(area, opt_selectionObj);
    },

    /**
     * Scrolls the given formula target into view.
     * If the target is a range then the edge of the range that
     * is furthest from the anchor cell is scrolled into view.
     * If the selection has 'jumped' across to a different pane then the
     * necessary panes are automatically scrolled to ensure that the selected
     * cell (or contiguous cells in the selected range) is visible
     *
     * @param {object} targetObj The target object - e.g.
     *                           { cellRef: "F27" }
     *                           or
     *                           { cellRange: {
     *                               topLeft: "F27",
     *                               bottomRight: "H38"
     *                             }
     *                           }
     */
    scrollFormulaTargetIntoView: function(targetObj) {
      if(targetObj) {
        var fromCellRef, toCellRef;
        if(targetObj.cellRef) {
          fromCellRef = toCellRef = targetObj.cellRef;
        }
        else if(targetObj.cellRange) {
          fromCellRef = targetObj.cellRange.topLeft;
          toCellRef = targetObj.cellRange.bottomRight;
        }

        if(fromCellRef && toCellRef) {
          var fromCellObj = FormulaUtils.cellRefToRowAndColNums(fromCellRef);
          var toCellObj = FormulaUtils.cellRefToRowAndColNums(toCellRef);
          if(fromCellObj && toCellObj) {
            // ensure that we have the correct order
            // as this determines the scroll direction
            if((SheetModel.lastAnchorCell.rowIdx === toCellObj.rowNum - 1) &&
              (SheetModel.lastAnchorCell.colIdx === toCellObj.colNum - 1)){
              var temp = fromCellObj;
              fromCellObj = toCellObj;
              toCellObj = temp;
            }

            var fromRow = _mainPane.getRow(fromCellObj.rowNum - 1);
            var fromCol = _mainPane.getColumn(fromCellObj.colNum - 1);
            var toRow = _mainPane.getRow(toCellObj.rowNum - 1);
            var toCol = _mainPane.getColumn(toCellObj.colNum - 1);
            if(fromRow && fromCol && toRow && toCol) {
              var area = {
                topPos: Math.min(fromRow.getPosition(), toRow.getPosition()),
                bottomPos: Math.max(fromRow.getPosition() + fromRow.getHeight(),
                  toRow.getPosition() + toRow.getHeight()),
                leftPos: Math.min(fromCol.getPosition(), toCol.getPosition()),
                rightPos: Math.max(fromCol.getPosition() + fromCol.getWidth(),
                  toCol.getPosition() + toCol.getWidth())
              };
              area.width = area.rightPos - area.leftPos;
              area.height = area.bottomPos - area.topPos;

              var selectionObj = {
                anchor: {rowIdx: SheetModel.lastAnchorCell.rowIdx,
                  colIdx: SheetModel.lastAnchorCell.colIdx},
                topLeft: {rowIdx: Math.min(
                  fromRow.getIndex(), toRow.getIndex()),
                  colIdx: Math.min(fromCol.getIndex(), toCol.getIndex())},
                bottomRight: {rowIdx: Math.max(
                  fromRow.getIndex(), toRow.getIndex()),
                  colIdx: Math.max(fromCol.getIndex(), toCol.getIndex())}
              };

              _scrollAreaIntoView(area, selectionObj);
            }
          }
        }
      }
    },

    getFrozenScrollOffsetX: function() {
      return _scrollOffsetX;
    },

    getFrozenScrollOffsetY: function() {
      return _scrollOffsetY;
    },

    /**
     * Remove the cell widget from all panes which exist.
     *
     * @param rowIndex {number} The row index of the cell to remove
     * @param colIndex {number} The column index of the cell to remove
     * @method removeCellFromAllPanes(rowIndex, colIndex)
     */
    removeCellFromAllPanes: function(rowIndex, colIndex) {

      var parentRow, parentColumn, cell;

      for (var i = _kPane_Bottom_Right; i >= 0; i--) {
        if (_panes[i] !== undefined) {
          parentRow = _panes[i].getRow(rowIndex);
          parentColumn = _panes[i].getColumn(colIndex);
          if (parentRow && parentColumn) {
            cell = parentRow.getCell(colIndex);
            if (cell) {
              parentRow.detachWidget(cell);
              parentColumn.detachWidget(cell);
              cell.removeFromParent();
            }
            else if (i === _kPane_Bottom_Right) {
              // EFFICIENCY => if the cell wasn't in the MAIN PANE then it
              // won't be in any, so don't bother looking at them
              return;
            }
          }
        }
      }
    },

    /**
     * Remove the merge cell widget from all panes which exist.
     *
     * @param anchorRowIndex {number} The row index of the cell to remove
     * @param anchorColIndex {number} The column index of the cell to remove
     * @method removeCellFromAllPanes(anchorRowIndex, anchorColIndex)
     */
    removeMergeCellFromAllPanes: function(anchorRowIndex, anchorColIndex) {
      var floaterMergeCellType = "sheetFloaterMergeCell",
          floaterMgr, floaterMergeCellWidget;

      for (var i = _kPane_Bottom_Right; i >= 0; i--) {
        if (_panes[i] !== undefined) {
          floaterMgr = _panes[i].getFloaterManager();
          floaterMergeCellWidget = floaterMgr.findFloaterAtAnchor(
                          anchorRowIndex, anchorColIndex, floaterMergeCellType);
          if (floaterMergeCellWidget) {
            // DETACH it from the floater manager
            floaterMgr.detachWidget(floaterMergeCellWidget);
            // REMOVE it from parent node
            floaterMergeCellWidget.removeFromParent();
          } else if (i === _kPane_Bottom_Right) {
            // EFFICIENCY => if the floater wasn't in the MAIN PANE then it
            // won't be in any, so don't bother looking at them
            return;
          }
        }
      }
    },

    /**
     * Syncs the row heights from the MAIN (bottom right) pane to any other
     * panes which exist (& which have the rows).
     *
     * @param rowIndex1 {number} The first row index to sync
     * @param rowIndex2 {number} The last row index to sync
     * @method syncRowHeightsToFrozenPanes(rowIndex1, rowIndex2)
     */
    syncRowHeightsToFrozenPanes: function(rowIndex1, rowIndex2) {
      var heightsOfSourceRows = _panes[_kPane_Bottom_Right].getHeightOfRows(
                                rowIndex1, rowIndex2);

      for (var i = _kPane_Bottom_Left; i >= 0; i--) {
        if (_panes[i]) {
          _panes[i].applyHeightToRows(heightsOfSourceRows);
        }
      }
    },

    /**
     * Hides the grid lines for all the panes.
     * @method hideGridLines()
     */
    hideGridLines: function() {
      _hiddenGridLines = true;

      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        if (_panes[i]) {
          _panes[i].hideGridLines();
        }
      }
    },

    /**
     * Highlights a header from a given index.
     *
     * @param index {Number} The index of the header
     * @param header {String} Passed as a "row" or "column" header
     */
    highlightHeader: function(index, header) {
      var row, column;
      var isMainPane = (SelectionGestureHandler.getActivePane() ===
                        _kPane_Bottom_Right);

      // This 'if' makes sure the headers highlighting looks consistent with
      // the selection and doesn't span more than one pane.
      // TODO: We when add support for range selection spanning different panes,
      // remove this 'if'.
      if((isMainPane === true && header === 'row' &&
          (index >= _frozenRowIdx ||
           _frozenRowIdx === undefined)) || (isMainPane === true &&
           header === 'column' && (index >= _frozenColIdx ||
           _frozenColIdx === undefined)) || (isMainPane === false &&
           header === 'row' && _api.getActivePane().getRow(index)) ||
           (isMainPane === false && header === 'column' &&
            _api.getActivePane().getColumn(index))) {

        for (var i = 0; i < _kNumber_Of_Panes; i++) {
          if (header === 'row') {
            row = _panes[i].getRow(index);
            if (row !== undefined) {
              row.highlightHeader(true);
            }
          } else if (header === 'column') {
            column = _panes[i].getColumn(index);
            if (column !== undefined) {
              column.highlightHeader(true);
            }
          }
        }
      }
    },

    /**
     * Unhighlights a header from a given index.
     *
     * @param index {Number} The index of the header
     * @param header {String} Passed as a "row" or "column" header
     */
    unhighlightHeader: function(index, header) {
      var row, column;

      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        if (header === 'row') {
          row = _panes[i].getRow(index);
          if (row !== undefined) {
            row.highlightHeader(false);
          }
        } else if (header === 'column') {
          column = _panes[i].getColumn(index);
          if (column !== undefined) {
            column.highlightHeader(false);
          }
        }
      }
    },

    /**
     * Returns the pane's container node
     *
     * @return {HTML node} The container node
     */
    getPanesContainerNode: function() {
      return _container;
    },

    /**
     * Lays out the floaters that are in the panes
     *
     * @param eventData {object} The event data of a "qowt:pane:layoutChanged"
     *                           signal
     * @method layoutFloaters(eventData)
     */
    layoutFloaters: function(eventData) {
      // to update the main pane first, we loop through our panes backwards
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        var floaterMgr = _panes[i].getFloaterManager();
        floaterMgr.layoutFloaters(eventData);
      }
    },

    /**
     * Resets the column height of the bottom left pane
     * to be the same as the column height of the main pane.
     * @method resetBottomLeftPaneColHeight()
     */
    resetBottomLeftPaneColHeight: function() {
      if (_panes[_kPane_Bottom_Left]) {
        var mainPaneColumnHeight = _mainPane.getColumn(0).getHeight();
        _panes[_kPane_Bottom_Left].setColumnHeight(mainPaneColumnHeight);
      }
    },

    /**
     * Positions the selection box (in each of the appropriate panes)
     * to reflect the given selection context object
     *
     * @param {object} selectionObj The selection context object
     */
    positionSelectionBox: function(selectionObj) {
      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        _panes[i].positionSelectionBox(selectionObj,
          _api.getFrozenScrollOffsetX(), _api.getFrozenScrollOffsetY());
      }
    },

    /**
     * Displays the floating editor (in each of the appropriate panes).
     * This involves:
     * - Positioning the floating editor over the given (anchor) cell
     * - Configuring the floating editor to have the appropriate cell and text
     *   formatting
     * - Seeding the floating editor with the appropriate text
     * - Giving focus to the floating editor if the 'focusOn' flag is true
     *
     * @param {boolean} focusOn A flag which, if true, indicates that focus
     *                          should be given to the floating editor
     * @param {object} selectionObj The selection that the floating editor is to
     *                              appear over
     * @param {integer or undefined} seed Optional keycode of a character to
     *                               'seed' the floating editor with. If this
     *                               value is undefined then the floating editor
     *                               will be seeded with the text of the cell
     *                               that it is positioned over
     *
     *
     * @method displayFloatingEditor(focusOn, selectionObj, seed)
     */
    displayFloatingEditor: function(focusOn, selectionObj, seed) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        var display = SelectionGestureHandler.getActivePane() === _panes[i];
        if (display) {
          _panes[i].displayFloatingEditor(focusOn, selectionObj,
            _api.getFrozenScrollOffsetX(), _api.getFrozenScrollOffsetY(), seed);
        }
      }
      // ensure that the active pane is the one whose floating editor is given
      // focus last (if focusOn is true)
      if (focusOn) {
        // Removing highlights from cells if any, after activating inline editor
        _api.unhighlightCells();
        SelectionGestureHandler.getActivePane().focusOnFloatingEditor();
      }
    },

    /**
     * Hides the floating editor (in each of the appropriate panes)
     *
     * @method hideFloatingEditor()
     */
    hideFloatingEditor: function() {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].hideFloatingEditor();
      }
    },

    /**
     * Sets the boldness of the cell Optimistically (in each of the appropriate
     * panes)
     *
     * @param {boolean} boldness The boldness setting - e.g. true
     */
    setCellBoldnessOptimistically: function(boldness) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellBoldnessOptimistically(boldness);
      }
    },

    /**
     * Sets the italics state of the cell Optimistically
     * (in each of the appropriate panes)
     *
     * @param {boolean} italics The italics setting - e.g. true
     */
    setCellItalicsOptimistically: function(italics) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellItalicsOptimistically(italics);
      }
    },

    /**
     * Sets the underline state of the cell Optimistically (in each of the
     * appropriate panes)
     *
     * @param {boolean} underline The underline setting - e.g. true
     */
    setCellUnderlineOptimistically: function(underline) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellUnderlineOptimistically(underline);
      }
    },

    /**
     * Sets the strikethrough state of the cell Optimistically (in each of the
     * appropriate panes)
     *
     * @param {Boolean} isStrikethrough - The strikethrough setting
     */
    setCellStrikethroughOptimistically: function(isStrikethrough) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellStrikethroughOptimistically(isStrikethrough);
      }
    },

    /**
     * Sets the display text of the cell floating editor
     * (in each of the appropriate panes)
     *
     * @param {string} text The text to display
     */
    setFloatingEditorDisplayText: function(text) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setFloatingEditorDisplayText(text);
      }
    },

    /**
     * Sets the font face of the cell Optimistically (in each of the appropriate
     * panes)
     *
     * @param {string} fontFace The font face setting - e.g. "Arial"
     */
    setCellFontFaceOptimistically: function(fontFace) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellFontFaceOptimistically(fontFace);
      }
    },

    /**
     * Sets the font size of the cell Optimistically (in each of the appropriate
     * panes)
     *
     * @param {string} fontSize The font size - e.g. "24"
     */
    setCellFontSizeOptimistically: function(fontSize) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellFontSizeOptimistically(fontSize);
      }
    },

    /**
     * Sets the text color of the cell Optimistically
     * (in each of the appropriate panes)
     *
     * @param {string} textColor The text color - e.g. "blue"
     */
    setCellTextColorOptimistically: function(textColor) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellTextColorOptimistically(textColor);
      }
    },

    /**
     * Sets the background color of the cell Optimistically (in each of the
     * appropriate panes)
     *
     * @param {string} backgroundColor The background color - e.g. "green"
     */
    setCellBackgroundColorOptimistically: function(backgroundColor) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellBackgroundColorOptimistically(backgroundColor);
      }
    },

    /**
     * Sets the horizontal alignment position of the cell Optimistically
     * (in each of the appropriate panes)
     *
     * @param {string} alignmentPos The horizontal alignment position - e.g. "r"
     */
    setCellHorizontalAlignmentOptimistically: function(alignmentPos) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellHorizontalAlignmentOptimistically(alignmentPos);
      }
    },

    /**
     * Sets the vertical alignment position of the cell Optimistically
     * (in each of the appropriate panes)
     *
     * @param {string} alignmentPos The vertical alignment position - e.g. "t"
     */
    setCellVerticalAlignmentOptimistically: function(alignmentPos) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellVerticalAlignmentOptimistically(alignmentPos);
      }
    },

    /**
     * Sets the wrap text of the cell Optimistically (in each of the appropriate
     * panes)
     *
     * @param {boolean} wrapText The wrap text setting - e.g. true
     */
    setCellWrapTextOptimistically: function(wrapText) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].setCellWrapTextOptimistically(wrapText);
      }
    },

    /**
     * Injects a cell ref into the floating editor that has focus.
     * The specified object contains the cell ref to inject
     * and a flag indicating whether the user has injected
     * this cell ref using an arrow key or a mousedown event
     *
     * @param obj {object} The config object - e.g.
     *                     { cellRef: "F27",
     *                       byKey: true }
     */
    injectCellRefIntoFloatingEditor: function(obj) {
      for(var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        if(_panes[i].floatingEditorHasFocus()) {
          _panes[i].injectCellRefIntoFloatingEditor(obj);
        }
      }
    },

    /**
     * Injects a cell range into the floating editor that has focus.
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
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        if(_panes[i].floatingEditorHasFocus()) {
          _panes[i].injectCellRangeIntoFloatingEditor(obj);
        }
      }
    },

    /**
     * Moves the current selection up by 1 row or potentially by multiple rows
     * if the 'byBlock' value is true.
     *
     * @param {boolean} byBlock - if true, the selection will be moved
     *                            according to the nearest block of populated
     *                            cells. if false the selection will be moved
     *                            by a single row.
     */
    moveUp: function(byBlock) {
      SelectionGestureHandler.moveUp(byBlock);
    },

    /**
     * Moves the current selection down by 1 row or potentially by multiple
     * rows if the 'byBlock' value is true.
     *
     *@param {boolean} byBlock - if true, the selection will be moved
     *                            according to the nearest block of populated
     *                            cells. if false the selection will be moved
     *                            by a single row.
     */
    moveDown: function(byBlock) {
      SelectionGestureHandler.moveDown(byBlock);
    },

    /**
     * Moves the current selection left by 1 column or potentially by multiple
     * columns if the 'byBlock' value is true.
     *
     * @param {boolean} byBlock - if true, the selection will be moved
     *                            according to the nearest block of populated
     *                            cells. if false the selection will be moved
     *                            by a single column.
     */
    moveLeft: function(byBlock) {
      SelectionGestureHandler.moveLeft(byBlock);
    },

    /**
     * Moves the current selection right by 1 column or potentially by multiple
     * columns if the 'byBlock' value is true.
     *
     * @param {boolean} byBlock - if true, the selection will be moved
     *                            according to the nearest block of populated
     *                            cells. if false the selection will be moved
     *                            by a single column.
     */
    moveRight: function(byBlock) {
      SelectionGestureHandler.moveRight(byBlock);
    },

    /**
     * Moves the current selection to the position where a click occurred
     *
     * @param {HTML event} event The click event
     */
    moveToClickPos: function(event) {
      SelectionGestureHandler.moveToClickPos(event);
    },

    /**
     * Moves the current range selection up
     */
    moveRangeUp: function() {
      SelectionGestureHandler.moveRangeUp();
    },

    /**
     * Moves the current range selection down
     */
    moveRangeDown: function() {
      SelectionGestureHandler.moveRangeDown();
    },

    /**
     * Moves the current range selection left
     */
    moveRangeLeft: function() {
      SelectionGestureHandler.moveRangeLeft();
    },

    /**
     * Moves the current range selection right
     */
    moveRangeRight: function() {
      SelectionGestureHandler.moveRangeRight();
    },

    /**
     * Returns the cell reference that is deduced from the given event.
     * The event may be a mousedown event or an arrow keydown event
     *
     * @param {HTML event} event The event
     * @return {string} The cell ref - e.g. "C28"
     * @method getCellRef(event)
     */
    getCellRef: function(event) {
      return SelectionGestureHandler.getCellRef(event);
    },

    /**
     * Returns the cell range that is deduced from the given event.
     * The event may be a mousemove event or a shift-arrow keydown event
     *
     * @param {HTML event} event The event
     * @return {object} The cell range - e.g.
     *                  {topLeft: B17, bottomRight: G23}
     * @method getCellRange(event)
     */
    getCellRange: function(event) {
      return SelectionGestureHandler.getCellRange(event);
    },

    /**
     * Highlights the cells that are specified so that they stand out
     * whilst the user is editing a formula (in each of the appropriate panes)
     *
     * @param {array} highlights The array of cells to highlight
     *
     * @method highlightCells(highlights)
     */
    highlightCells: function(highlights) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].highlightCells(highlights, _scrollOffsetX, _scrollOffsetY);
      }
    },

    /**
     * Unhighlights all cells that were highlighted whilst the
     * user was editing a formula (in each of the appropriate panes).
     *
     * @method unhighlightCells()
     */
    unhighlightCells: function() {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].unhighlightCells();
      }
    },

    /**
     * Shows the cell highlighting (in each of the appropriate panes).
     * Called when loading the content of a sheet.
     */
    showCellHighlighting: function() {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].showCellHighlighting();
      }
    },

    /**
     * Hides the cell highlighting of a cut operation (in each of the
     * appropriate panes). Called when changing sheet.
     */
    hideCellHighlighting: function() {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        _panes[i].hideCellHighlighting();
      }
    },

    /**
     * Query if the cell highlighting is visible.
     *
     * @returns {Boolean} True if visible, else false.
     */
    hasCellHighlighting: function() {
      return _mainPane.hasCellHighlighting();
    },

    /**
     * Insert new rows into the grid.
     * The rows will be empty and of default height and format
     * Lays out the rows in the end.
     *
     * @param {integer} rowIndex where the rows will be inserted
     * @param {integer} numRows number of rows to be inserted
     * @param {obj=} opt_delObj if we are reverting previous delete cmd, this
     *    obj contains:
     *                  'heights' - array of row heights
     *                  'formats' - array of row formats
     *                  'widgetObj' - objects of arrays of row and floater
     *                                widgets
     */
    insertRows: function(rowIndex, numRows, opt_delObj) {
      var i, j, defH = SheetModel._defaultRowHeightInPx;

      // First make space in row height/format model
      var height, format;
      for(i = 0; i < numRows; i++) {
        if(opt_delObj) {
          height = opt_delObj.heights ? opt_delObj.heights[i] : defH;
          format = opt_delObj.formats ? opt_delObj.formats[i] : undefined;
        } else {
          height = defH;
          format = undefined;
        }
        SheetModel.RowHeights.splice(rowIndex, 0, height);
        SheetModel.RowFormatting.splice(rowIndex, 0, format);
      }

      // Unhighlighting of existing rows is required after insertion operation,
      // because these rows moves out of the selection spanning across rows.
      _unhighlightHeaders('row');
      var widgetObj = opt_delObj ? opt_delObj.widgetObj : undefined;
      for (i = 0; i < _kNumber_Of_Panes; i++) {
       if(_panes[i]) {
         _panes[i].insertRows(rowIndex, numRows, widgetObj);
       }
      }
      _highlightHeaders('row');

      // TODO: the frozen pane code is getting quite complicated
      // and needs to be revisited at some point
      var frRow = _frozenRowIdx;
      if (frRow > 0 && rowIndex < frRow) {
        for (i = 0; i < _kPane_Bottom_Right; i++) {
          for (j = rowIndex; j < rowIndex + numRows; j++) {
            if(_panes[i].getRow(j)) {
              _mainPane.getRow(j).addFrozenRowHeader(_panes[i].getRow(j));
            }
          }
        }
        _frozenRowIdx = frRow + numRows;
        _layoutPanesAndFrozenContainer(true);
      }
    },

    /**
     * Deletes rows from the grid.
     * Creates more rows in the end of the grid to make up deleted rows
     * Lays out the rows in the end.
     *
     * @param {integer} rowIndex where the rows will be deleted
     * @param {integer} numRows number of rows to be deleted
     */
    deleteRows: function(rowIndex, numRows) {
      var retVal = {};
      // Remove rows from height/format models
      retVal.heights = SheetModel.RowHeights.splice(rowIndex, numRows);
      retVal.formats = SheetModel.RowFormatting.splice(rowIndex, numRows);

      for (var j = 0; j < _kNumber_Of_Panes; j++) {
        if(_panes[j]) {
          var res = _panes[j].deleteRows(rowIndex, numRows);
          if(j === _kPane_Bottom_Right) {
            retVal.widgetObj = res;
          }
        }
      }

      if (_frozenRowIdx > 0) {
        var frRow = _frozenRowIdx;
        if(rowIndex < frRow) {
          _frozenRowIdx = Math.max(frRow - numRows, rowIndex);
          _layoutPanesAndFrozenContainer(true);
        }
      }

      // To make up the deleted rows, insert empty rows in the end
      _api.insertRows(_mainPane.getNumOfRows() - 1 - numRows, numRows);
      return retVal;
    },

    /**
     * Insert new columns into the grid.
     * The columns will be empty and of default width and format
     * Lays out the columns in the end.
     *
     * @param {integer} colIndex where the cols will be inserted
     * @param {integer} numCols number of cols to be inserted
     * @param {obj=} opt_delObj if we are reverting previous delete cmd, this
     *    obj contains:
     *                'widths' - array of col widths
     *                'formats' - array of col formats
     *                'widgetObj' - objects of arrays of col and floater widgets
     */
    insertColumns: function(colIndex, numCols, opt_delObj) {
      var i, j, defW = SheetModel._defaultColWidthInPx;

      // First make space in col width/format model
      var width, format;
      for(i = 0; i < numCols; i++) {
        if(opt_delObj) {
          width = opt_delObj.widths ? opt_delObj.widths[i] : defW;
          format = opt_delObj.formats ? opt_delObj.formats[i] : undefined;
        } else {
          width = defW;
          format = undefined;
        }
        SheetModel.ColWidths.splice(colIndex, 0, width);
        SheetModel.ColFormatting.splice(colIndex, 0, format);
      }

      // Unhighlighting of existing columns is required after insertion,
      // operation because these columns moves out of the selection spanning
      // across columns.
      _unhighlightHeaders('column');
      var widgetObj = opt_delObj ? opt_delObj.widgetObj : undefined;
      for (i = 0; i < _kNumber_Of_Panes; i++) {
       if(_panes[i]) {
         _panes[i].insertColumns(colIndex, numCols, widgetObj);
       }
      }
      _highlightHeaders('column');

      // TODO: the frozen pane code is getting quite complicated
      // and needs to be revisited at some point
      var frCol = _frozenColIdx;
      if (frCol > 0 && colIndex < frCol) {
        for (i = 0; i < _kPane_Bottom_Right; i++) {
          for (j = colIndex; j < colIndex + numCols; j++) {
            if(_panes[i].getColumn(j)) {
              _mainPane.getColumn(j).addFrozenColumnHeader(_panes[i].
                  getColumn(j));
            }
          }
        }
        _frozenColIdx = frCol + numCols;
        _layoutPanesAndFrozenContainer();
      }
    },

    /**
     * Deletes cols from the grid.
     * Creates more cols in the end of the grid to make up deleted cols
     * Lays out the cols in the end.
     *
     * @param {integer} colIndex where the cols will be deleted
     * @param {integer} numCols number of cols to be deleted
     */
    deleteColumns: function(colIndex, numCols) {
      var retVal = {};
      // Remove cols from width/format models
      retVal.widths = SheetModel.ColWidths.splice(colIndex, numCols);
      retVal.formats = SheetModel.ColFormatting.splice(colIndex, numCols);

      for (var j = 0; j < _kNumber_Of_Panes; j++) {
        if(_panes[j]) {
          var res = _panes[j].deleteColumns(colIndex, numCols);
          if(j === _kPane_Bottom_Right) {
            retVal.widgetObj = res;
          }
        }
      }

      if (_frozenColIdx > 0) {
        var frCol = _frozenColIdx;
        if(colIndex < frCol) {
          _frozenColIdx = Math.max(frCol - numCols, colIndex);
          _layoutPanesAndFrozenContainer();
        }
      }

       //  To make up the deleted columns, insert empty columns in the end.
      _api.insertColumns(_mainPane.getNumOfCols(), numCols);
      return retVal;
    },

    /**
     * Reselects the current selection
     */
    reselectCurrentSelection: function() {
      SelectionGestureHandler.reselectCurrentSelection();
    },

    /**
     * change the selection for 'cmd/ctrl + a' keyboard occurrence.
     */
    selectAllCells: function() {
      SelectionGestureHandler.selectAllCells();
    },

    /**
     * Returns the index of middle row of the visible area.
     * @returns {number} - index of middle row of the visible area.
     */
    getVisibleWindowMiddleRowIdx: function() {
      var visibleDimension = _mainPane.getVisibleDimension();
      var rowIndex = Math.ceil(SearchUtils.array.binSearch(
        SheetModel.RowPos, visibleDimension.height, 'low') / 2);
      return rowIndex;
    },

    /**
     * Returns the index of middle column of the visible area.
     * @returns {number} - index of middle column of the visible area.
     */
    getVisibleWindowMiddleColIdx: function() {
      var visibleDimension = _mainPane.getVisibleDimension();
      var colIndex = Math.ceil(SearchUtils.array.binSearch(
        SheetModel.ColPos, visibleDimension.width, 'low') / 2);
      return colIndex;
    },

    isEntireSheetSelected: function(sel) {
      return SelectionGestureHandler.isEntireSheetSelected(sel);
    },


    isOneOrMoreRowsSelected: function(sel) {
      return SelectionGestureHandler.isOneOrMoreRowsSelected(sel);
    },


    isOneOrMoreColumnsSelected: function(sel) {
      return SelectionGestureHandler.isOneOrMoreColumnsSelected(sel);
    }
  };


  /**
   * @return {boolean} Returns true if row or column header(s) is/are selected,
   *      false otherwise.
   * @private
   */
  var _isCurrentSelectionAHeader = function() {
    return _api.isOneOrMoreColumnsSelected() || _api.isOneOrMoreRowsSelected();
  };


  /**
   * This function highlights the header of rows / columns based on current
   * selection object.
   *
   * @param {!string} widgetType - Passed as 'row' or 'column' based on whose
   *    header to highlight
   * @private
   */
  var _highlightHeaders = function(widgetType) {
    var sel = SheetSelectionManager.getCurrentSelection();
    var fromIdx, toIdx;

    if (sel && sel.contentType === 'sheetCell') {
      if (widgetType === 'row') {
        fromIdx = sel.topLeft.rowIdx;
        toIdx = sel.bottomRight.rowIdx;
      } else if (widgetType === 'column') {
        fromIdx = sel.topLeft.colIdx;
        toIdx = sel.bottomRight.colIdx;
      }
      for (var i = fromIdx; i <= toIdx; i++) {
        _api.highlightHeader(i, widgetType);
      }
    }
  };


  /**
   * This function un-highlights the header of rows / columns based on current
   * selection object.
   *
   * @param {!string} widgetType - Passed as 'row' or 'column' based on whose
   *    header to unhighlight
   * @private
   */
  var _unhighlightHeaders = function(widgetType) {
    var sel = SheetSelectionManager.getCurrentSelection();
    var fromIdx, toIdx;

    if (sel && sel.contentType === 'sheetCell') {
      if (widgetType === 'row') {
        fromIdx = sel.topLeft.rowIdx;
        toIdx = sel.bottomRight.rowIdx;
      } else if (widgetType === 'column') {
        fromIdx = sel.topLeft.colIdx;
        toIdx = sel.bottomRight.colIdx;
      }
      for (var i = fromIdx; i <= toIdx; i++) {
        _api.unhighlightHeader(i, widgetType);
      }
    }
  };


  var _layoutPanesAndFrozenContainer = function(isRowOp) {
    var row, rowTopPos, col, colLeftPos;
    _layoutPanes();
    if(isRowOp) {
      row = _mainPane.getRow(_frozenRowIdx);
      rowTopPos = row.getPosition();
      RowHeaderContainer.setFrozenContainerHeight(rowTopPos - _scrollOffsetY);
    } else {
      col = _mainPane.getColumn(_frozenColIdx);
      colLeftPos = col.getPosition();
      ColHeaderContainer.setFrozenContainerWidth(colLeftPos - _scrollOffsetX);
    }
  };

  var _createPanes = function() {
    for (var i = 0; i < _kNumber_Of_Panes; i++) {
       _createPane(i);
    }
    _mainPane = _panes[_kPane_Bottom_Right];
  };

  var _createPane = function(paneIndex) {
    if (paneIndex !== undefined) {

      var paneNode = document.createElement(_kPane_Node);
      paneNode.classList.add(_kPane_Node_Class);

      var paneClass;
      switch (paneIndex) {
        case _kPane_Top_Left:
          paneClass = _kPane_Top_Left_Class;
          break;
        case _kPane_Top_Right:
          paneClass = _kPane_Top_Right_Class;
          break;
        case _kPane_Bottom_Left:
          paneClass = _kPane_Bottom_Left_Class;
          break;
        case _kPane_Bottom_Right:
          paneClass = _kPane_Bottom_Right_Class;
          break;
        default:
          break;
      }
      paneNode.classList.add(paneClass);

      var isMainPane = (paneIndex === _kPane_Bottom_Right);

      if (isMainPane) {
        paneNode.classList.add(_kPane_Scroller_Class);
      }

      _container.appendChild(paneNode);

      _panes[paneIndex] = Pane.create(paneNode, isMainPane);

      if (_hiddenGridLines) {
        _panes[paneIndex].hideGridLines();
      }

    } else {
      throw ('QOWT.LAYOUT.PaneManager -> _createPane: Missing parameter ' +
        '[paneIndex]');
    }
  };

  var _addListeners = function() {
    // listen for mousewheel events on each pane
    for (var i = 0; i < _kNumber_Of_Panes; i++) {
       DomListener.addListener(_panes[i].getPaneNode(), 'mousewheel',
         _handlePaneMouseWheel);
    }

    // listen for scroll events on the bottom right pane
    DomListener.addListener(_panes[_kPane_Bottom_Right].getPaneNode(), 'scroll',
      _handlePaneScroll);

    // initialise the selection gesture handler to listen for selection gestures
    SelectionGestureHandler.init(_panes, _container);
  };

  // TODO(gbiagiotti): The assumptions made in this method and in other places
  // in the code regarding scrolling & freezing are wrong! scrollLeft and
  // scrollTop of the main pane do not always tell where to freeze the panes.
  // For example a user may have frozen in a particular cell, then scrolled
  // further and selected another cell. If we freeze at scrollTop and
  // scrollLeft, it can become impossible to scroll and some rows and columns
  // will be unreachable. When loading a frozen sheet, we should freeze at the x
  // and y where the sheet was initially frozen, and not use scrollLeft and
  // scrollTop.
  var _setPaneInnerPositions = function() {
    var mainPaneNode = _mainPane.getPaneNode();

    _scrollOffsetY = mainPaneNode.scrollTop;
    _scrollOffsetX = mainPaneNode.scrollLeft;

    // if the grid is already scrolled, we need to freeze the panes where we are
    // currently and not allow further scrolling up or left. The easiest way to
    // do this is to shift the entire grid and then freeze panes as if we are
    // not scrolled move the base and content nodes of the main pane so that
    // the pane itself actually doesn't move and thus the scrollbars limit where
    // the user can scroll to (as it should)
    if (_scrollOffsetY > 0) {
      mainPaneNode.scrollTop = 0;
    }

    if (_scrollOffsetX > 0) {
      mainPaneNode.scrollLeft = 0;
    }

    _setNodePositions({
      x: _scrollOffsetX > 0 ? '-' + _scrollOffsetX + 'px' : undefined,
      y: _scrollOffsetY > 0 ? '-' + _scrollOffsetY + 'px' : undefined
    });
  };

  var _doPopulate = function(fromRow, toRow) {
    if ((_frozenRowIdx >= fromRow) &&
        (_frozenRowIdx <= toRow)) {
      // the rows up to and including the frozen row have been populated and
      // laid out so it is now safe to work out the heights and widths of the
      // panes and set them
      _layoutPanes();
      _displayFrozenWidgets();
      // clone all of the columns - we only need to do this once
      _cloneBaseColumnNodes();
    }

    // clone the rows in the given range, and their content, to the relevant
    // panes
    _cloneBaseRowNodes(fromRow, toRow);
    _cloneContentNodes(fromRow, toRow);
  };

  /**
   * Clone rows in to relevant panes.
   *
   * LM TODO: the (cloned) row and column divs should have unique ids in each
   * pane?
   */
  var _cloneBaseRowNodes = function(fromRow, toRow) {
    var i, j, len, _rows = _mainPane.getRowRange(fromRow, toRow);

    for (i = 0, len = _rows.length; i < len; i++) {
      if (_frozenRowIdx > 0 && _frozenColIdx > 0) {
        for (j = 0; j < _kPane_Bottom_Right; j++) {
          _cloneBaseRowToPane(_rows[i], j);
        }
        } else if(_frozenRowIdx > 0) {
        _cloneBaseRowToPane(_rows[i], _kPane_Top_Right);
        } else if(_frozenColIdx > 0) {
        _cloneBaseRowToPane(_rows[i], _kPane_Bottom_Left);
      }
    }
  };

  var _cloneBaseRowToPane = function(row, paneIndex) {
    var rowIndex, clonedRow, existingRow;
    rowIndex = row.getIndex();

    if((paneIndex === _kPane_Top_Left &&
        rowIndex < _frozenRowIdx) ||
        paneIndex === _kPane_Top_Right || paneIndex === _kPane_Bottom_Left) {
      if (_panes[paneIndex]) {
        existingRow = _panes[paneIndex].getRow(rowIndex);
        if (!existingRow) {
          clonedRow = row.cloneTo(_panes[paneIndex].getBaseNode());
          _panes[paneIndex].attachRowWidget(clonedRow);

          // Add frozen row header
          // TODO: Row headers should be added by the RowHeaderContainer
          if (rowIndex < _frozenRowIdx) {
            row.addFrozenRowHeader(clonedRow);
          }
        }
      }
    }
  };

  /**
   * Clone columns in to relevant panes.
   *
   * LM TODO: the (cloned) row and column divs should have unique ids in each
   * pane?
   */
  var _cloneBaseColumnNodes = function() {
    var i, j, len, _columns = _mainPane.getColumns();

    for (i = 0, len = _columns.length; i < len; i++) {
      if (_frozenRowIdx > 0 && _frozenColIdx > 0) {
        for (j = 0; j < _kPane_Bottom_Right; j++) {
          _cloneBaseColumnToPane(_columns[i], j);
        }
        } else if(_frozenRowIdx > 0) {
        _cloneBaseColumnToPane(_columns[i], _kPane_Top_Right);
        } else if(_frozenColIdx > 0) {
        _cloneBaseColumnToPane(_columns[i], _kPane_Bottom_Left);
      }
    }
  };

  var _cloneBaseColumnToPane = function(column, paneIndex) {
    var columnIndex, clonedColumn, existingColumn;
    columnIndex = column.getIndex();

    if (_panes[paneIndex]) {
      existingColumn = _panes[paneIndex].getColumn(columnIndex);
      if (!existingColumn) {
        clonedColumn = column.cloneTo(_panes[paneIndex].getBaseNode());
        _panes[paneIndex].attachColumnWidget(clonedColumn);

        // Add frozen column header
        if (columnIndex < _frozenColIdx) {
          column.addFrozenColumnHeader(clonedColumn);
        }
      }
    }
  };

  // LM TODO: the (cloned) cell divs should have unique ids in each pane?
  var _cloneContentNodes = function(fromRow, toRow) {
    var i, j, len, cells, c, _rows = _mainPane.getRowRange(fromRow, toRow),
        clonedCell, existingCell;
    // clone content in to relevant panes
    for (i = 0, len = _rows.length; i < len; i++) {
      cells = _rows[i].getCells();
      for (j = 0; j < cells.length; j++) {
        c = cells[j];
        if (c !== undefined) {
          if (c.x <= _frozenColIdx) {
            // append to top left pane AND right pane, to ensure data that is in
            // top left "appears" to burst in to the right pane -
            // LM TODO: related to above 2 LM TODOs?
            if (_rows[i].getIndex() < _frozenRowIdx) {
              if (_panes[_kPane_Top_Left] &&
                  _panes[_kPane_Top_Left].getRow(c.y)) {

                existingCell = _panes[_kPane_Top_Left].getRow(c.y).getCell(c.x);
                if (!existingCell) {

                  clonedCell = c.cloneTo(
                               _panes[_kPane_Top_Left].getContentNode());
                  _panes[_kPane_Top_Left].getRow(c.y).attachWidget(clonedCell);

                  if (_panes[_kPane_Top_Left].getColumn(c.x)) {
                    existingCell = _panes[_kPane_Top_Left].getColumn(c.x).
                      getCell(c.y);
                    if (!existingCell) {
                      _panes[_kPane_Top_Left].getColumn(c.x).attachWidget(
                      clonedCell);
                    }
                  }
                }
              }
              if (_panes[_kPane_Top_Right] &&
                  _panes[_kPane_Top_Right].getRow(c.y)) {

                existingCell = _panes[_kPane_Top_Right].getRow(c.y).
                  getCell(c.x);
                if (!existingCell) {

                  clonedCell = c.cloneTo(
                               _panes[_kPane_Top_Right].getContentNode());
                  _panes[_kPane_Top_Right].getRow(c.y).attachWidget(clonedCell);

                  if (_panes[_kPane_Top_Right].getColumn(c.x)) {

                    existingCell = _panes[_kPane_Top_Right].getColumn(c.x).
                      getCell(c.y);
                    if (!existingCell) {

                      _panes[_kPane_Top_Right].getColumn(c.x).attachWidget(
                        clonedCell);
                    }
                  }
                }
              }
            }
            // append to bottom left pane (LM TODO: cell is already in the
            // bottom right pane so this is here so that data that is in the
            // bottom left "appears" to burst in to te right pane?)
            if (_panes[_kPane_Bottom_Left] &&
              _panes[_kPane_Bottom_Left].getRow(c.y)) {

              existingCell = _panes[_kPane_Bottom_Left].getRow(c.y).
                getCell(c.x);
              if (!existingCell) {

                clonedCell = c.cloneTo(_panes[_kPane_Bottom_Left].
                  getContentNode());
                _panes[_kPane_Bottom_Left].getRow(c.y).attachWidget(clonedCell);

                if (_panes[_kPane_Bottom_Left].getColumn(c.x)) {

                  existingCell = _panes[_kPane_Bottom_Left].getColumn(c.x).
                    getCell(c.y);
                  if (!existingCell) {

                    _panes[_kPane_Bottom_Left].getColumn(c.x).attachWidget(
                      clonedCell);
                  }
                }
              }
            }
          } else {
            // append to top right pane
            if (_rows[i].getIndex() < _frozenRowIdx) {
              if (_panes[_kPane_Top_Right] &&
                _panes[_kPane_Top_Right].getRow(c.y)) {

                existingCell = _panes[_kPane_Top_Right].getRow(c.y).
                  getCell(c.x);
                if (!existingCell) {

                  clonedCell = c.cloneTo(_panes[_kPane_Top_Right].
                    getContentNode());
                  _panes[_kPane_Top_Right].getRow(c.y).attachWidget(clonedCell);

                  if (_panes[_kPane_Top_Right].getColumn(c.x)) {

                    existingCell = _panes[_kPane_Top_Right].getColumn(c.x).
                      getCell(c.y);
                    if (!existingCell) {

                      _panes[_kPane_Top_Right].getColumn(c.x).attachWidget(
                        clonedCell);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Now clone floaters from the main (bottom right) pane into the panes that
    // require them (slightly different, as are bigger than just one cell)
    var mainPaneFloaterManager = _mainPane.getFloaterManager();
    var floaterCount = mainPaneFloaterManager.count();
    var floater;
    for (var ff = 0; ff < floaterCount; ff++) {
      floater = mainPaneFloaterManager.at(ff);
      if ((floater !== undefined) && (floater.cloneTo !== undefined)) {
        var xMin = floater.x();
        var yMin = floater.y();
        var xMax = floater.x() + floater.colSpan() - 1;
        var yMax = floater.y() + floater.rowSpan() - 1;

        if ((_frozenColIdx > xMin) &&
            (_frozenRowIdx > yMin)) {
          if (_panes[_kPane_Top_Left]) {
            _cloneFloater(floater, _kPane_Top_Left, yMin, xMin);
          }
        }

        if ((_frozenColIdx > xMin) &&
            (_frozenRowIdx <= yMax)) {
          if (_panes[_kPane_Bottom_Left]) {
            _cloneFloater(floater, _kPane_Bottom_Left, yMin, xMin);
          }
        }

        if ((_frozenColIdx <= xMax) &&
            (_frozenRowIdx > yMin)) {
          if (_panes[_kPane_Top_Right]) {
            _cloneFloater(floater, _kPane_Top_Right, yMin, xMin);
          }
        }
      }
    }
  };

  var _layoutPanes = function() {
    var width, height, trWidth, blHeight, tlWidth, tlHeight, topLeftPaneNode;

    width = (_frozenColIdx !== undefined) ?
        _mainPane.getColumn(_frozenColIdx).getPosition() -
        _scrollOffsetX : 0;
    height = (_frozenRowIdx !== undefined) ?
        _mainPane.getRow(_frozenRowIdx).getPosition() -
        _scrollOffsetY : 0;

    topLeftPaneNode = _panes[_kPane_Top_Left].getPaneNode();

    tlWidth = '0';
    tlHeight = '0';

    // Makes sure the borders of the panes are visible only when the sheet is
    // frozen
    if (_frozenRowIdx > 0 && _frozenColIdx > 0) {
      trWidth = 'auto';
      blHeight = 'auto';
      tlWidth = width;
      tlHeight = height;
      topLeftPaneNode.classList.add(_kPane_Top_Left_Border_Class);
    }
    else if (_frozenRowIdx > 0) {
      trWidth = 'auto';
      blHeight = '0';
      topLeftPaneNode.classList.remove(_kPane_Top_Left_Border_Class);
    }
    else if (_frozenColIdx > 0) {
      trWidth = '0';
      blHeight = 'auto';
      topLeftPaneNode.classList.remove(_kPane_Top_Left_Border_Class);
    }
    else {
      trWidth = '0';
      blHeight = '0';
      topLeftPaneNode.classList.remove(_kPane_Top_Left_Border_Class);
    }

    _setPaneSize({
      targetPaneNode: topLeftPaneNode,
      width: tlWidth + "px",
      height: tlHeight + "px"
    });

    _setPaneSize({
      targetPaneNode: _panes[_kPane_Top_Right].getPaneNode(),
      width: trWidth,
      height: height + "px"
    });
    _setPanePositions({
      targetPaneNode: _panes[_kPane_Top_Right].getPaneNode(),
      left: "0"
    });

    _setPaneSize({
      targetPaneNode: _panes[_kPane_Bottom_Left].getPaneNode(),
      width: width + "px",
      height: blHeight
    });
    _setPanePositions({
      targetPaneNode: _panes[_kPane_Bottom_Left].getPaneNode(),
      top: "0"
    });

    if (_frozenColIdx !== undefined) {
      _freezeWidth = _mainPane.getColumn(_frozenColIdx).getPosition();
    }

    if (_frozenRowIdx !== undefined) {
      _freezeHeight = _mainPane.getRow(_frozenRowIdx).getPosition();
    }
  };

  var _setNodePositions = function(obj) {
    if (obj !== undefined) {
      for (var i = _kNumber_Of_Panes - 1; i >= 0; i--) {
        if (_panes[i] !== undefined) {
          if (obj.x !== undefined) {
            _panes[i].getBaseNode().style.left = obj.x;
            _panes[i].getContentNode().style.left = obj.x;
          }
          if (obj.y !== undefined) {
            _panes[i].getBaseNode().style.top = obj.y;
            _panes[i].getContentNode().style.top = obj.y;
          }
        }
      }
    } else {
      throw ('PaneManager -> _setNodePositions: Missing or invalid parameter ' +
          '[obj]');
    }
  };

  var _setPanePositions = function(obj) {
    if (obj.targetPaneNode !== undefined) {
      if (obj.top !== undefined) {
        obj.targetPaneNode.style.top = obj.top;
      }

      if (obj.left !== undefined) {
        obj.targetPaneNode.style.left = obj.left;
      }
    }
  };
  // TODO AG refactor to accept HTML Nodes, use one loop, one condition check
  // for vars
  var _setPaneScrollPositions = function(obj) {
    if (obj !== undefined) {
      if (obj.panes !== undefined) {
        var i, len, panes = obj.panes,
            pane, x = (obj.x !== undefined &&
                       !isNaN(obj.x)) ? obj.x : undefined,
            y = (obj.y !== undefined && !isNaN(obj.y)) ? obj.y : undefined;

        if (typeof obj.panes === 'number') {
          pane = _panes[panes];
          if (pane.getPaneNode()) {
            if (x !== undefined) {
              pane.getPaneNode().scrollLeft = x;
            }
            if (y !== undefined) {
              pane.getPaneNode().scrollTop = y;
            }
          }
        }//ES5 Array type check
        else if (Array.isArray(obj.panes) && obj.panes.length > 0) {
          for (i = 0, len = panes.length; i < len; i++) {
            pane = _panes[panes[i]];
            if (pane.getPaneNode()) {
              if (x !== undefined) {
                pane.getPaneNode().scrollLeft = x;
              }

              if (y !== undefined) {
                pane.getPaneNode().scrollTop = y;
              }
            }
          }
        }
      }
    } else {
      throw ('PaneManager -> _setPaneScrollPositions: Missing or invalid ' +
        'parameter [obj]');
    }
  };

  var _setPaneSize = function(obj) {
    if (obj.targetPaneNode !== undefined) {
      if (obj.width !== undefined) {
        obj.targetPaneNode.style.width = obj.width;
      }

      if (obj.height !== undefined) {
        obj.targetPaneNode.style.height = obj.height;
      }
    }
  };

  /**
   * Cleans the Base Node and the Content Node of the top_left, top_right and
   * bottom_left panes.
   * Also resets the data about frozen headers in every pane.
   * Called when unfreezing.
   */
  var _cleanPanes = function() {
    var i;
    for (i = 0; i < _kNumber_Of_Panes; i++) {
      if (_panes[i].instance) {
        _panes[i].resetFrozenHeaders();
      }
    }
    for (i = 0; i < _kPane_Bottom_Right; i++) {
      if (_panes[i]) {
        _panes[i].clean();
      }
    }
  };

  var _displayFrozenWidgets = function() {
    _displayFrozenRowWidgets();
    _displayFrozenColumnWidgets();
  };

  var _displayFrozenRowWidgets = function() {
    if (_frozenRowIdx > 0) {
      var row = _mainPane.getRow(_frozenRowIdx);
      var rowTopPos = row.getPosition();
      var height = rowTopPos - _scrollOffsetY;
      RowHeaderContainer.setFrozenContainerVisible(true);
      _adjustRowHeadersTop(-_scrollOffsetY);
      RowHeaderContainer.setFrozenContainerHeight(height);
    }
  };

  var _adjustRowHeadersTop = function(deltaTop) {
    RowHeaderContainer.container();
    var currentTopValue = parseInt(RowHeaderContainer.container().style.top,
                          10);
    if (isNaN(currentTopValue)) {
      currentTopValue = 0;
    }
    RowHeaderContainer.container().style.top = currentTopValue +
      parseInt(deltaTop, 10) + 'px';
    currentTopValue = parseInt(RowHeaderContainer.frozenContainer().style.top,
                               10);
    if (isNaN(currentTopValue)) {
      currentTopValue = 0;
    }
    RowHeaderContainer.frozenContainer().style.top = currentTopValue +
      parseInt(deltaTop, 10) + 'px';
  };

  var _displayFrozenColumnWidgets = function() {
    if (_frozenColIdx > 0) {
      var column = _mainPane.getColumn(_frozenColIdx);
      var colLeftPos = column.getPosition();
      var width = colLeftPos - _scrollOffsetX;
      ColHeaderContainer.setFrozenContainerVisible(true);
      _adjustColHeadersLeft(-_scrollOffsetX);
      ColHeaderContainer.setFrozenContainerWidth(width);
    }
  };

  var _adjustColHeadersLeft = function(deltaLeft) {
    ColHeaderContainer.container();
    var currentLeftValue = parseInt(ColHeaderContainer.container().style.left,
                                    10);
    if (isNaN(currentLeftValue)) {
      currentLeftValue = 0;
    }
    ColHeaderContainer.container().style.left = currentLeftValue +
      parseInt(deltaLeft, 10) + 'px';

    currentLeftValue = parseInt(ColHeaderContainer.frozenContainer().style.left,
                                10);
    if (isNaN(currentLeftValue)) {
      currentLeftValue = 0;
    }
    ColHeaderContainer.frozenContainer().style.left = currentLeftValue +
      parseInt(deltaLeft, 10) + 'px';
  };

  var _handlePaneScroll = function(event) {
    if (event !== undefined && event.srcElement) {

      _scrollTopRightAndBottomLeftPanes(
          event.srcElement.scrollLeft, event.srcElement.scrollTop);
    }
  };

  var _scrollTopRightAndBottomLeftPanes = function(scrollLeft, scrollTop) {
    if (_panes[_kPane_Top_Right]) {
      _setPaneScrollPositions({
        panes: _kPane_Top_Right,
        x: scrollLeft
      });
    }
    if (_panes[_kPane_Bottom_Left]) {
      _setPaneScrollPositions({
        panes: _kPane_Bottom_Left,
        y: scrollTop
      });
    }
    PubSub.publish(_events.paneScrolled, {
      scrollTop: _panes[_kPane_Bottom_Right].getPaneNode().scrollTop,
      scrollLeft: _panes[_kPane_Bottom_Right].getPaneNode().scrollLeft
    });
  };

  /**
   * Handles the mouse wheel event for scrolling the pane vertically or
   * horizontally.
   * @param event - the event object
   * @method _handlePaneMouseWheel(event)
   */
  var _handlePaneMouseWheel = function(event) {
    if (event) {
      event.preventDefault();
      if (event.wheelDeltaY !== 0) {
        _handleVerticalMouseWheel(event);
      }
      if (event.wheelDeltaX !== 0) {
        _handleHorizontalMouseWheel(event);
      }

      PubSub.publish(_events.paneScrolled, {
        scrollTop: _panes[_kPane_Bottom_Right].getPaneNode().scrollTop,
        scrollLeft: _panes[_kPane_Bottom_Right].getPaneNode().scrollLeft
      });
    }
  };

  /**
   * Handles the horizontal scrolling of the panes. For horizontal mouse wheel
   * event, the top right and the bottom right panes are only scrolled.
   * paneScrolled event is fired to adjust the row header and the column header.
   *
   * @param event - the event object
   * @method _handleHorizontalMouseWheel(event)
   */
  var _handleHorizontalMouseWheel = function(event) {
    if (event && event.wheelDeltaX !== 0) {
      if (_panes[_kPane_Top_Right]) {
        _setPaneScrollPositions({
          panes: _kPane_Top_Right,
          x: _panes[_kPane_Top_Right].getPaneNode().scrollLeft -
             event.wheelDeltaX
        });
      }
      if (_panes[_kPane_Bottom_Right]) {
        _setPaneScrollPositions({
          panes: _kPane_Bottom_Right,
          x: _panes[_kPane_Bottom_Right].getPaneNode().scrollLeft -
             event.wheelDeltaX
        });
      }
    }
  };

  /**
   * Handles the vertical scrolling of the panes. For vertical mouse wheel
   * event, the bottom left and the bottom right panes are only scrolled.
   * paneScrolled event is fired to adjust the row header and the column header.
   * @param event - the event object
   * @method _handleVerticalMouseWheel(event)
   */
  var _handleVerticalMouseWheel = function(event) {
    if (event && event.wheelDeltaY !== 0) {
      if (_panes[_kPane_Bottom_Left]) {
        _setPaneScrollPositions({
          panes: _kPane_Bottom_Left,
          y: _panes[_kPane_Bottom_Left].getPaneNode().scrollTop -
             event.wheelDeltaY
        });
      }
      if (_panes[_kPane_Bottom_Right]) {
        _setPaneScrollPositions({
          panes: _kPane_Bottom_Right,
          y: _panes[_kPane_Bottom_Right].getPaneNode().scrollTop -
             event.wheelDeltaY
        });
      }
    }
  };

  /**
   * Adjusts the top and left positions of the selection box, including both the
   * anchor and the range nodes. Called when freezing & unfreezing the panes.
   *
   * @param {number} deltaX The delta of the left position
   * @param {number} deltaY The delta of the top position
   */
  var _adjustSelectionBoxTopLeftPos = function(deltaX, deltaY) {
    var selectionBox = _api.getActivePane().getSelectionBox();
    var newLeftPosition = selectionBox.getLeftPosition() + deltaX;
    var newTopPosition = selectionBox.getTopPosition() + deltaY;
    selectionBox.setAnchorNodeLeftPosition(newLeftPosition);
    selectionBox.setAnchorNodeTopPosition(newTopPosition);
    selectionBox.setRangeNodeLeftPosition(newLeftPosition);
    selectionBox.setRangeNodeTopPosition(newTopPosition);
  };

  /**
   * Scrolls the given area of the grid into view
   *
   * @param {object} area The area to scroll into view - e.g.
   *                      {
   *                       topPos: 10,
   *                       bottomPos: 27,
   *                       leftPos: 48,
   *                       rightPos: 79,
   *                       width: 31,
   *                       height: 17
   *                      }
   * @param {object or undefined} opt_selectionObj The selection
   *                              object (if undefined the current
   *                              selection will be used).
   *                              Its anchor information is used
   *                              to determine the scroll direction
   */
  var _scrollAreaIntoView = function(area, opt_selectionObj) {
    if((area === undefined) || (area.topPos === undefined) ||
      (area.bottomPos === undefined) || (area.leftPos === undefined) ||
      (area.rightPos === undefined) || (area.width === undefined) ||
      (area.height === undefined)) {
      return;
    }

    var gridLineCalc = SheetConfig.kGRID_GRIDLINE_WIDTH * 5 -
                       SheetConfig.kSCROLLBAR_SIZE /
                       SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
    var mainPaneNode = _mainPane.getPaneNode();
    var activePane = SelectionGestureHandler.getActivePane();
    var targetSelectionObj = opt_selectionObj ||
                             SheetSelectionManager.getCurrentSelection();

    // if a range is selected then we want to ensure that the edge of the
    // range that is furthest from the anchor cell is the edge that is
    // scrolled into view
    if(targetSelectionObj && targetSelectionObj.anchor) {
      if(targetSelectionObj.anchor.rowIdx ===
          targetSelectionObj.topLeft.rowIdx) {
        // scroll area.bottomPos into view
        var currentMainPaneBottomPos = mainPaneNode.clientHeight +
            mainPaneNode.scrollTop;
        var areaBottomPos = area.bottomPos;
        if (areaBottomPos > currentMainPaneBottomPos) {
          mainPaneNode.scrollTop += (areaBottomPos -
                                  currentMainPaneBottomPos) - gridLineCalc;
        } else if(areaBottomPos < mainPaneNode.scrollTop) {
          mainPaneNode.scrollTop = areaBottomPos - mainPaneNode.clientHeight -
                                   gridLineCalc;
        }
      }
      else {
        // scroll area.topPos into view
        var currentMainPaneTopPos = (mainPaneNode.scrollTop -
          area.height) + (_freezeHeight + area.height) -
          _scrollOffsetY;
        var areaTopPos = area.topPos + gridLineCalc;
        if (areaTopPos < currentMainPaneTopPos &&
          activePane !== _kPane_Top_Right && activePane !== _kPane_Top_Left) {
          mainPaneNode.scrollTop -= (currentMainPaneTopPos - areaTopPos) +
                                     gridLineCalc;
        } else if(areaTopPos > mainPaneNode.clientHeight +
          mainPaneNode.scrollTop && activePane !== _kPane_Top_Right &&
          activePane !== _kPane_Top_Left) {
          mainPaneNode.scrollTop = areaTopPos + gridLineCalc;
        }
      }

      if(targetSelectionObj.anchor.colIdx ===
         targetSelectionObj.topLeft.colIdx) {
        // scroll area.rightPos into view
        var currentMainPaneRightPos = mainPaneNode.clientWidth +
                                      mainPaneNode.scrollLeft;
        var areaRightPos = area.rightPos;
        if (areaRightPos > currentMainPaneRightPos) {
          mainPaneNode.scrollLeft += (areaRightPos -
                                      currentMainPaneRightPos) - gridLineCalc;
        } else if(areaRightPos < mainPaneNode.scrollLeft) {
          mainPaneNode.scrollLeft = areaRightPos -
                                    mainPaneNode.clientWidth - gridLineCalc;
        }
      }
      else {
        // scroll area.leftPos into view
        var currentMainPaneLeftPos = (mainPaneNode.scrollLeft -
          area.width) + (_freezeWidth + area.width) -
          _scrollOffsetX;
        var areaLeftPos = area.leftPos + gridLineCalc;
        if (areaLeftPos < currentMainPaneLeftPos &&
          activePane !== _kPane_Bottom_Left &&
          activePane !== _kPane_Top_Left) {
          mainPaneNode.scrollLeft -= (currentMainPaneLeftPos - areaLeftPos) +
                                      gridLineCalc;
        } else if(areaLeftPos > mainPaneNode.clientWidth +
                  mainPaneNode.scrollLeft &&
                  activePane !== _kPane_Bottom_Left &&
                  activePane !== _kPane_Top_Left) {
          mainPaneNode.scrollLeft = areaLeftPos + gridLineCalc;
        }
      }

      // now handle case where the sheet is frozen and the selected range has
      // been extended to include a cell in the frozen row or the frozen
      // column - in which case the main pane must be scrolled to the top or
      // left
      if(_panesFrozen) {
        if((targetSelectionObj.topLeft.rowIdx <= _frozenRowIdx) &&
          (_frozenRowIdx <=
            targetSelectionObj.bottomRight.rowIdx)) {
          mainPaneNode.scrollTop = 0;
        }
        if((targetSelectionObj.topLeft.colIdx <= _frozenColIdx) &&
          (_frozenColIdx <=
            targetSelectionObj.bottomRight.colIdx)) {
          mainPaneNode.scrollLeft = 0;
        }
      }
    }
  };

  var _cloneFloater = function(floater, paneIndex, yMin, xMin) {
    var clonedFloater, existingFloater, floaterManager;
    floaterManager = _panes[paneIndex].getFloaterManager();
    existingFloater = floaterManager.findFloaterAtAnchor(yMin, xMin);
    if (!existingFloater) {
      clonedFloater = floater.cloneTo(_panes[paneIndex].getContentNode());
      floaterManager.attachWidget(clonedFloater);
    } else if (existingFloater.getType() === 'sheetFloaterChart') {
      floaterManager.detachWidget(existingFloater);
      existingFloater.removeFromParent();

      clonedFloater = floater.cloneTo(_panes[paneIndex].getContentNode());
      floaterManager.attachWidget(clonedFloater);
    }
  };

  return _api;
});
