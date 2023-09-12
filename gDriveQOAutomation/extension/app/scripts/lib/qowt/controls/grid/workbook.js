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
 * Constructor for the Workbook Layout Control.
 *
 * The workbook layout control has a number of widgets,
 * each of which encapsulates an area of the HTML DOM
 * that represents the workbook on screen:
 *
 * - Pane widget(s) - which represents the 'grid' of cells in a sheet.
 *   A pane widget itself has a number of row, column and cell widgets.
 *   The pane widget(s) are managed by the Pane Manager, which is a helper
 *   for the workbook layout control.
 *
 * - The Sheet Selector widget - which represents the sequence of tabs
 *   that display the name of each sheet in the workbook, and allows
 *   the user to click on the tabs to change the sheet being displayed
 *
 * - The Formula bar widget - which represents the formula bar 'box'
 *   that displays the content of the currently selected cell
 *
 * The workbook layout control also has a row headers container and
 * a column headers container which do not require widget objects
 * to manage them as they as simply containers.
 *
 * The workbook layout control is responsible for the LAYOUT of its widgets.
 * This includes positioning decisions such as whether the sheet selector
 * should appear at the top or bottom of the workbook.
 *
 * It also includes the more subtle responsibility of managing how and when
 * widgets are permitted to cause expensive relayouts to the HTML render tree.
 * For example, the workbook layout control listens for the 'reschedule'
 * and 'finished' events that are generated during a DCP response processing
 * loop. This is so that when a workbook is opened and its content is being
 * processed, the workbook layout control can ask the sheet to check if any of
 * its row heights need to be adjusted (and to do it) ONLY during these DCP loop
 * 'pauses'; this causes a SINGLE RELAYOUT of the render tree DURING each pause
 * (i.e. a single relayout after each batch of N populated rows has been
 * processed). This is much more efficient than having the sheet check whether
 * each row needs to have its height adjusted immediately after it has been
 * populated with its cell content, which would cause N RELAYOUTS of the render
 * tree BETWEEN each pause.
 *
 * @constructor
 * @return {Object}       A workbook layout control
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/domUtils',
  'qowtRoot/features/utils',
  'qowtRoot/widgets/grid/formulaBar',
  'qowtRoot/widgets/grid/sheetSelector',
  'qowtRoot/widgets/grid/sheetHeader',
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/rowHeaderContainer',
  'qowtRoot/controls/grid/chartSheetManager',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/models/env',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/ui/menuItem',
  'qowtRoot/configs/contextMenuConfigs/copyEditorConfig',
  'qowtRoot/configs/contextMenuConfigs/copyViewerConfig',
  'qowtRoot/configs/contextMenuConfigs/cutConfig',
  'qowtRoot/configs/contextMenuConfigs/deleteConfig',
  'qowtRoot/configs/contextMenuConfigs/freezeConfig',
  'qowtRoot/configs/contextMenuConfigs/insertConfig',
  'qowtRoot/configs/contextMenuConfigs/pasteConfig',
  'qowtRoot/configs/contextMenuConfigs/sortAZConfig',
  'qowtRoot/configs/contextMenuConfigs/sortZAConfig',
  'qowtRoot/configs/contextMenuConfigs/unfreezeConfig',
  'qowtRoot/widgets/grid/numberFormatDialog',
  'qowtRoot/widgets/grid/rowColumnDecorator',
  'qowtRoot/widgets/grid/sysClipboard'],
  function(
    PubSub,
    DomListener,
    DomUtils,
    Features,
    FormulaBar,
    SheetSelector,
    SheetHeader,
    ColHeaderContainer,
    RowHeaderContainer,
    ChartSheetManager,
    PaneManager,
    SheetSelectionManager,
    EnvModel,
    SheetModel,
    SheetConfig,
    WidgetFactory,
    MenuItem,
    CopyEditorConfig,
    CopyViewerConfig,
    CutConfig,
    DeleteConfig,
    FreezeConfig,
    InsertConfig,
    PasteConfig,
    SortAZConfig,
    SortZAConfig,
    UnfreezeConfig,
    NumberFormatDialog,
    RowColumnDecorator,
    SysClipboard) {

  'use strict';

  // Private data
  var _containerDivs = {},
    _cachedColWidthsObj,
    _mainPane,
    _contextMenu,
    _unfreezePaneMenuItem,
    _freezePaneMenuItem,

    _events = {
      contentReceived: "qowt:contentReceived",
      rowsUpdated: "qowt:rowsUpdated",
      selectionChanged: "qowt:selectionChanged",
      paneScrolled: "qowt:paneManager:scrolled",
      paneLayout: "qowt:pane:layoutChanged",
      zoomChanged: "qowt:zoomChanged",
      copyCutPasteNotAllowed: 'qowt:iframed:copyCutPasteNotAllowed'
    },

    _kDisplayNone_Class = 'qowt-display-none',

    // TODO(dskelton): Implement a common key handling approach
    _kBackspaceKeyCode = 8,
    _kPane_Bottom_Right = 3,

    _kMergedCell_Floater_Type = "sheetFloaterMergeCell";

  var _api = {

    /**
     * Append this control to the html node passed as argument
     *
     * @param node {HTMLElement} node to append this control to
     */
    appendTo: function(node) {
      node.appendChild(_containerDivs.workbook);
    },

    /**
     * function to initialise and set up this workbook layout
     * control singleton.
     * Constructs all the required DIVs and sets up all the listeners
     *
     */
    init: function() {
      _init();
    },

    /**
     * Gets the scrollTop position of the main pane
     *
     * @method getScrollTop()
     */
    getScrollTop: function() {
      return _mainPane.getPaneNode().scrollTop;
    },

    /**
     * Gets the scrollLeft position of the main pane
     *
     * @method scrollLeft()
     */
    getScrollLeft: function() {
      return _mainPane.getPaneNode().scrollLeft;
    },

    /**
     * Gets the scrollTop and scrollLeft positions of the main pane
     *
     * @method getScrollPositions()
     * @return {object}             An object with the properties:
     *                              - scrollTop
     *                              - scrollLeft
     */
    getScrollPositions: function() {
      return {
        scrollTop: _mainPane.getPaneNode().scrollTop,
        scrollLeft: _mainPane.getPaneNode().scrollLeft
      };
    },

    /**
     * Gets the column widget (from the main pane) for the specified column
     * index
     *
     * @param x {integer}  The column index
     * @return {object}    The column widget
     * @method getColumn(x)
     */
    getColumn: function(x) {
      return _mainPane.getColumn(x);
    },

    /**
     *
     * @param {string} id - Returns a context menu-item based on the 'id'
     * @returns {object} - Context menu-item instance
     */
    getContextMenuItemById: function(id) {
      return _contextMenu.getMenuItem(id);
    },

    isContextMenuActive: function() {
      return _contextMenu.isMenuActive();
    },

    /**
     * Gets the row widget (from the main pane) for the specified row index
     *
     * @param y {integer}  The row index
     * @return {object}    The row widget
     * @method getRow(y)
     */
    getRow: function(y) {
      return _mainPane.getRow(y);
    },

    /**
     * Returns the default row height
     *
     * @return The default row height in points
     * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
     * GetSheetInformation-element-schema.json
     * @method getDefaultRowHeight()
     */
    getDefaultRowHeight: function() {
      return _mainPane.getDefaultRowHeight();
    },

    /**
     * Gets the number of rows in the current sheet
     *
     * @return {integer}  The number of rows
     * @method getNumOfRows()
     */
    getNumOfRows: function() {
      return _mainPane.getNumOfRows();
    },

    /**
     * Gets the number of columns in the current sheet
     *
     * @return {integer}  The number of columns
     * @method getNumOfCols()
     */
    getNumOfCols: function() {
      return _mainPane.getNumOfCols();
    },

    /**
     * Gets the cells in the specified row (from the main pane)
     *
     * @param y {integer} The row index
     * @return {array}  The array of cells in the row
     * @method getCellsInRow()
     */
    getCellsInRow: function(y) {
      var cells = [];
      var row = _api.getRow(y);
      if(row) {
        cells = row.getCells();
      }
      return cells;
    },

    /**
     * Stores the default row height
     *
     * @param height {number} The default row height in points
     * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
     * GetSheetInformation-element-schema.json
     * @method setDefaultRowHeight(height)
     */
    setDefaultRowHeight: function(height) {
      PaneManager.setDefaultRowHeight(height);
    },

    /**
     * Stores the default column width
     *
     * @param width {number} The default column width in points
     * @see dcplegacyservice-cpp-main/schemas/elements/quicksheet/
     * GetSheetInformation-element-schema.json
     * @method setDefaultColumnWidth(width)
     */
    setDefaultColumnWidth: function(width) {
      PaneManager.setDefaultColumnWidth(width);
    },


    setFrozenRowIndex: function(frozenRowIdx) {
      PaneManager.setFrozenRowIndex(frozenRowIdx);
    },


    setFrozenColumnIndex: function(frozenColIdx) {
      PaneManager.setFrozenColumnIndex(frozenColIdx);
    },


    getFrozenRowIndex: function() {
      return PaneManager.getFrozenRowIndex();
    },


    getFrozenColumnIndex: function() {
      return PaneManager.getFrozenColumnIndex();
    },


    /**
     * Ensures that the current sheet contains enough rows to display the
     * sheet's content, given the index of the last non-empty row in the sheet.
     * However, the sheet can have a maximum of
     * SheetConfig.kGRID_DEFAULT_MAX_ROWS rows and so any content beyond this
     * will not be displayed
     *
     * @param indexOfLastNonEmptyRow {integer}  The index of the last non-empty
     *                                          row
     * @method ensureMinimalRowCount(indexOfLastNonEmptyRow)
     */
    ensureMinimalRowCount: function(indexOfLastNonEmptyRow) {
      _mainPane.ensureMinimalRowCount(indexOfLastNonEmptyRow);
    },

    /**
     * Cache column widths, so that we can lay them out later when it's more
     * suitable to do so from a visual update perspective.  ie dont just layout
     * column widths immediately, but wait with that layout until we also get
     * content so that we update the workbook in one go
     *
     * @param colWidthsObj {object} A sparse object of column widths, containing
     *                               an 'index:width' pair for each column whose
     *                               width is not the default width
     * @method cacheColumnWidths(colWidthArray)
     */
    cacheColumnWidths: function(colWidthsObj) {
      _cachedColWidthsObj = colWidthsObj;
    },

    /**
     * Returns the cached column widths
     *
     * @returns {Object} The cached column widths
     */
    getCachedColumnWidths: function() {
      if(_cachedColWidthsObj) {
        return _cachedColWidthsObj;
      }
    },

    /**
     * if there was any column width data cached, then use it now to layout the
     * column widths
     *
     * @method layoutCachedColumnWidths()
     */
    layoutCachedColumnWidths: function() {
      _api.layoutColumnWidths(_cachedColWidthsObj);
    },

    /**
     * Lays out the columns in the sheet with their correct widths.
     * The actual width of each column is contained in the response to the
     * GetSheetInformation command.
     *
     * This operation does not cause a render tree relayout to occur.
     *
     * @param colWidthsObj {object} A sparse object of column widths, containing
     *                              an 'index:width'
     *                              pair for each column whose width is not the
     *                              default width
     * @method layoutColumnWidths(colWidthArray)
     */
    layoutColumnWidths: function(colWidthsObj) {
      _mainPane.layoutColumnWidths(colWidthsObj);
    },

    /**
     * Responds to a user gesture by freezing the
     * current sheet at the specified row and column anchor
     *
     * @param rowIdx {integer} The index of the row to freeze the sheet at
     * @param colIdx {integer} The index of the column to freeze the sheet at
     * @method freezePanes()
     */
    freezePanes: function(rowIdx, colIdx) {
      PaneManager.setFrozenRowIndex(rowIdx);
      PaneManager.setFrozenColumnIndex(colIdx);

      PaneManager.freezePanes();
      PaneManager.adjustPanesToFitScrollbars();
      _toggleFreezeUnfreezeMenuItems();
    },

    /**
     * Responds to a user gesture by unfreezing the current sheet
     *
     * @method unfreezePanes()
     */
    unfreezePanes: function() {
      PaneManager.unfreezePanes();
      _toggleFreezeUnfreezeMenuItems();
    },

    /**
     * Returns whether or not the current sheet is frozen
     *
     * @method isFrozen()
     * @return {boolean} A flag indicating whether or not the current sheet is
     *                   frozen; true if so, otherwise false
     */
    isFrozen: function() {
      return PaneManager.isFrozen();
    },

    getActivePane: function() {
      return PaneManager.getActivePane();
    },

    /**
     * Hides the grid lines.
     * @method hideGridLines()
     */
    hideGridLines: function() {
      PaneManager.hideGridLines();
    },

    reset: function() {
      // JELTE TODO: this should also remove listeners etc so that
      // unit tests can call this and clean up after themselves!
      // needs to be reset before PaneManager.reset
      SheetSelectionManager.reset();
      PaneManager.reset();
      if(_unfreezePaneMenuItem.isEnabled()) {
        _unfreezePaneMenuItem.setEnabled(false);
      }
      if(!_freezePaneMenuItem.isEnabled()) {
        _freezePaneMenuItem.setEnabled(true);
      }
      ChartSheetManager.reset();
      _scrollToTop();
    },

    /**
     * Shows the chart sheet
     *
     * @method showChartSheet()
     */
    showChartSheet: function() {
      // we want to hide all child elements of the zoom area container,
      // except for the chart sheet element
      var zoomAreaChildren = _containerDivs.zoomArea.childNodes;
      var count = zoomAreaChildren.length;
      for(var i = 0; i < count; i++) {
        zoomAreaChildren[i].classList.add(_kDisplayNone_Class);
      }
      _containerDivs.chartSheet.classList.remove(_kDisplayNone_Class);

      // activate the chart sheet manager
      ChartSheetManager.activate();

      // the formula bar shouldn't be 'editable' in a chart sheet
      _api.disableFormulaBarEdits();
    },

    /**
     * Hides the chart sheet
     *
     * @method hideChartSheet()
     */
    hideChartSheet: function() {
      // we want to show all child elements of the zoom area container,
      // except for the chart sheet element
      var zoomAreaChildren = _containerDivs.zoomArea.childNodes;
      var count = zoomAreaChildren.length;
      for(var i = 0; i < count; i++) {
        zoomAreaChildren[i].classList.remove(_kDisplayNone_Class);
      }
      _containerDivs.chartSheet.classList.add(_kDisplayNone_Class);

      // deactivate the chart sheet manager
      ChartSheetManager.deactivate();

      // the formula bar should be 'editable' in a non-chart sheet
      _api.enableFormulaBarEdits();
    },

    /**
     * Configures the formula bar such that the user cannot perform edits in it
     *
     * @method disableFormulaBarEdits()
     */
    disableFormulaBarEdits: function() {
      if(Features.isEnabled('edit')) {
        FormulaBar.disableEdits();
      }
    },

    /**
     * Configures the formula bar such that the user can perform edits in it
     *
     * @method enableFormulaBarEdits()
     */
    enableFormulaBarEdits: function() {
      if(Features.isEnabled('edit')) {
        FormulaBar.enableEdits();
      }
    },

    /**
     * Zooms the workbook out
     *
     * @method zoomOut()
     */
    zoomOut: function() {
      if(SheetConfig.ZOOM.current > 0) {
        SheetConfig.ZOOM.current--;
      } else {
        SheetConfig.ZOOM.current = 0;
      }
      var scale = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
      _setZoomScale(scale);
    },

    /**
     * Zooms the workbook in
     *
     * @method zoomIn()
     */
    zoomIn: function() {
      if(SheetConfig.ZOOM.current < SheetConfig.ZOOM.levels.length-1) {
        SheetConfig.ZOOM.current++;
      } else {
        SheetConfig.ZOOM.current = SheetConfig.ZOOM.levels.length-1;
      }
      var scale = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
      _setZoomScale(scale);
    },

    /**
     * Returns the floater widget that floats over the given cell, if there is
     * one
     *
     * @param {integer} rowIndex The row index of the cell
     * @param {integer} colIndex The column index of the cell
     * @return {object or undefined} The floater widget, or undefined if there
     *                               isn't one
     *
     * @method findContainingFloater(rowIndex, colIndex)
     */
    findContainingFloater: function(rowIndex, colIndex) {
      return _mainPane.getFloaterManager().findContainingFloater(rowIndex,
                                                                 colIndex);
    },

    /**
     * Initiates a cell edit.
     * This involves scrolling the target cell into view and displaying the
     * floating editor. The floating editor may also be given focus.
     *
     * @param {boolean} isInlineEdit A flag indicating whether the cell edit is
     *                               to occur inline (i.e. in the floating
     *                               editor) or not (i.e. in the formula bar).
     *                               If the value is true then the floating
     *                               editor is given focus.
     * @param {integer} seed Optional keycode of a character to 'seed' the
     *                       floating editor with. If the value is undefined
     *                       then the floating editor should be seeded with the
     *                       text of the cell that it is to be positioned over
     *
     * @method initiateCellEdit(isInlineEdit, seed)
     */
    initiateCellEdit: function(isInlineEdit, seed) {
      _initiateCellEdit(isInlineEdit, seed);
    },

    /**
     * Completes a cell edit.
     * This involves hiding the floating editor and updating the text in the
     * formula bar
     * (incase the the edit was cancelled)
     *
     * @param cancelled {boolean or undefined} Optional flag indicating whether
     *                                         the edit was cancelled - true if
     *                                         it was, otherwise undefined
     *
     * @method completeCellEdit(cancelled)
     */
    completeCellEdit: function(cancelled, clickObj) {
      _completeCellEdit(cancelled, clickObj);
    },

    /**
     * Mirrors the text in the text widgets (i.e. the formula bar and the
     * floating editor) by getting the current text in the focused text widget
     * and setting the unfocused text widget to have the same text
     *
     * @method mirrorText()
     */
    mirrorText: function() {
      _mirrorText();
    },

    /**
     * Injects a cell ref into the focused the text widget
     * (either the formula bar or the floating editor).
     * The appropriate cell ref is deduced from the given event,
     * which can be a mousedown event or an arrow keydown event
     *
     * @param {HTML event} event The event
     * @method injectCellRef(event)
     */
    injectCellRef: function(event) {
      _injectCellRef(event);
    },

    /**
     * Injects a cell range into the focused the text widget
     * (either the formula bar or the floating editor).
     * The appropriate cell range is deduced from the given event,
     * which can be a mousemove event or a shift-arrow keydown event
     *
     * @param {HTML event} event The event
     * @method injectCellRange(event)
     */
    injectCellRange: function(event) {
      _injectCellRange(event);
    },

    /**
     * Returns the row and column indices of the target cell for an edit
     * operation. This is normally the anchor cell of the current selection but
     * floaters need to be taken into account.
     *
     * @return {obj} An object containing the following properties:
     * - rowIdx The row index of the target cell
     * - colIdx The column index of the target cell
     *
     * @method getTargetCellForEdit()
     */
    getTargetCellForEdit: function() {
      // the target cell is normally the anchor cell of the current selection...
      var currentSelection = SheetSelectionManager.getCurrentSelection();
      if (!currentSelection || !currentSelection.anchor ||
          currentSelection.anchor.rowIdx === undefined ||
          currentSelection.anchor.colIdx === undefined) {
        return {};
      }

      var obj = {
        rowIdx: currentSelection.anchor.rowIdx,
        colIdx: currentSelection.anchor.colIdx
      };

      // ...unless the anchor cell is underneath a floater, in which case the
      // target cell is actually the cell anchor (i.e. top-left cell) of the
      // floater itself
      var floaterMgr = _mainPane.getFloaterManager();
      var floater = floaterMgr.findContainingFloater(
        currentSelection.anchor.rowIdx, currentSelection.anchor.colIdx);
      if(floater && (floater.getType() === "sheetFloaterMergeCell")) {
        obj.rowIdx = floater.y();
        obj.colIdx = floater.x();
      }

      return obj;
    },

    toggleNumberFormatDialog: function() {
      NumberFormatDialog.toggleVisibility();
    },

    /**
     * Returns the zoom area.
     *
     * @return {Node} zoom area div
     */
    zoomArea: function() {
      return _containerDivs.zoomArea;
    },

    /**
     * If sheet is frozen then apply formatting properties to column from
     * each pane else apply formatting properties to column from main pane only.
     *
     *  @param index {number} - Column index
     *  @param formattingProperties {Object} - Formatting properties that has
     *                                       been received for a column widget.
     *  @param delfm {boolean} - flag which tells if previous formatting
     *                           properties applied to column should be reset.
     */
    formatColumn: function(index, formattingProperties, delfm) {
      var column;
      if(PaneManager.isFrozen()) {
        var panes = PaneManager.getAllPanes();
        for(var i = 0; i < panes.length; i++) {
          column = panes[i].getColumn(index);
          RowColumnDecorator.decorate(column, formattingProperties,
              delfm);
        }
      } else {
        column = _api.getColumn(index);
        RowColumnDecorator.decorate(column, formattingProperties, delfm);
      }
    },

    /**
     * If sheet is frozen then apply formatting properties to row from
     * each pane else apply formatting properties to row from main pane only.
     *
     *  @param index {number} - Row index
     *  @param formattingProperties {Object} - Formatting properties that has
     *                                        been received for a row widget.
     *  @param delfm {boolean} - flag which tells if previous formatting
     *                           properties applied to row should be reset.
     */
    formatRow: function(index, formattingProperties, delfm) {
      var row;
      if(PaneManager.isFrozen()) {
        var panes = PaneManager.getAllPanes();
        for(var i = 0; i < panes.length; i++) {
          row = panes[i].getRow(index);
          RowColumnDecorator.decorate(row, formattingProperties, delfm);
        }
      } else {
        row = _api.getRow(index);
        RowColumnDecorator.decorate(row, formattingProperties, delfm);
      }
    }
  };

  var _init = function() {

    // Create the workbook's container divs
    _containerDivs.workbook = document.createElement('div');
    _containerDivs.formulaBar = document.createElement('div');
    _containerDivs.chartSheet = document.createElement('div');
    _containerDivs.panes = document.createElement('div');
    _containerDivs.zoomAreaContainer = document.createElement('div');
    _containerDivs.zoomArea = document.createElement('div');
    _containerDivs.sheetSelector = document.createElement('div');

    // set styles that qowt client should not override:
    var s;
    _containerDivs.workbook.id = "qowt-sheet-workbook";
    EnvModel.rootNode = _containerDivs.workbook;
    _containerDivs.workbook.classList.add("qowt-root");
    s = _containerDivs.workbook.style;
    s.position = 'absolute';
    s.overflow = 'hidden';
    s.left = '0px';

    _containerDivs.zoomAreaContainer.className = "qowt-sheet-zoom-container";
    _containerDivs.zoomAreaContainer.id = "qowt-sheet-zoom-container";
    s = _containerDivs.zoomAreaContainer.style;
    s.position = 'absolute';
    s.overflow = 'hidden';

    _containerDivs.zoomArea.className = "qowt-sheet-zoom-area";
    s = _containerDivs.zoomArea.style;
    s.position = 'absolute';
    s.overflow = 'hidden';

    _containerDivs.formulaBar.className = "qowt-sheet-formula-bar-container";
    _containerDivs.formulaBar.id = "qowt-sheet-formula-bar-container";
    s = _containerDivs.formulaBar.style;
    s.position = 'absolute';

    _containerDivs.chartSheet.className = "qowt-chart-sheet qowt-scroller";
    s = _containerDivs.chartSheet.style;
    s.position = 'absolute';
    _containerDivs.panes.className = "qowt-sheet-container-panes";
    _containerDivs.panes.id = "qowt-sheet-container-panes";
    _containerDivs.panes.setAttribute('tabindex', '-1');
    s = _containerDivs.panes.style;
    s.position = 'absolute';
    s.overflow = 'hidden';

    _containerDivs.sheetSelector.className = "qowt-sheet-selector";
    _containerDivs.sheetSelector.id = "qowt-sheet-selector";
    s = _containerDivs.sheetSelector.style;
    s.position = 'absolute';

    _containerDivs.zoomAreaContainer.appendChild(_containerDivs.zoomArea);

    _containerDivs.zoomArea.appendChild(_containerDivs.chartSheet);
    _containerDivs.zoomArea.appendChild(_containerDivs.panes);

    _containerDivs.workbook.appendChild(_containerDivs.formulaBar);
    _containerDivs.workbook.appendChild(_containerDivs.zoomAreaContainer);
    _containerDivs.workbook.appendChild(_containerDivs.sheetSelector);

    // initialise our widgets, and append them to our workbook zoom div
    SheetHeader.init();
    RowHeaderContainer.init();
    ColHeaderContainer.init();
    FormulaBar.init();
    ChartSheetManager.init(_containerDivs.chartSheet);
    // JELTE TODO: would be nice if the panemanager followed the same
    // pattern as the rest and has an appendTo function?
    PaneManager.init(_containerDivs.panes);
    SheetSelector.init();
    NumberFormatDialog.init();
    SysClipboard.init();
    _initContextMenu();

    SheetSelector.appendTo(_containerDivs.sheetSelector);
    FormulaBar.appendTo(_containerDivs.formulaBar);
    SheetHeader.appendTo(_containerDivs.zoomArea);
    RowHeaderContainer.appendTo(_containerDivs.zoomArea);
    ColHeaderContainer.appendTo(_containerDivs.zoomArea);
    NumberFormatDialog.appendTo(_containerDivs.zoomArea);
    SysClipboard.appendTo(_containerDivs.zoomArea);

    _mainPane = PaneManager.getMainPane();

    // JELTE TODO; should also have a removeListener, but not sure where. This
    //  is a bigger issue to do with how QOWT should clean itself up.
    // Remember: not all clients will behave like webos (eg new html document
    // per ms office document)
    // Create the workbook's event listeners
    _initEvents();
    _adjustForZoomScale(SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current]);
  };

  var _initEvents = function() {
    PubSub.subscribe(_events.contentReceived, _onRowsAdded);
    PubSub.subscribe(_events.rowsUpdated, _onRowsUpdated);

    PubSub.subscribe(_events.paneLayout, _onPaneLayout);

    PubSub.subscribe(_events.selectionChanged, _onSelectionChanged);

    PubSub.subscribe(_events.paneScrolled, _onPaneScroll);
    PubSub.subscribe(_events.copyCutPasteNotAllowed, _onCopyCutPasteNotAllowed);

    DomListener.addListener(document, 'keyup', _onKeyUpEvent);
    DomListener.addListener(document, 'keypress', _onKeyPressEvent);
    DomListener.addListener(document, 'textInput', _onTextInputEvent);

    DomListener.addListener(document, 'contextmenu', _augmentWithZoomInfo,
                            true);
    DomListener.addListener(document, 'mousedown', _augmentWithZoomInfo, true);
    DomListener.addListener(document, 'mousemove', _augmentWithZoomInfo, true);
    DomListener.addListener(document, 'mouseup', _augmentWithZoomInfo, true);
    var workBookContainer = document.getElementById('qowt-sheet-workbook');
    DomListener.addListener(workBookContainer, 'click', _blurToolbar, true);

    PubSub.subscribe("qowt:sheetCellHandler:removeCellFromAllPanes",
                     _removeCellFromAllPanes);
    PubSub.subscribe("qowt:sheetCellHandler:removeMergeCellFromAllPanes",
                     _removeMergeCellFromAllPanes);
    PubSub.subscribe("qowt:cellContentComplete", _updateFormulaBarWithAnchor);
  };

  var _initContextMenu = function() {
    // create menu items which will be dynamically added
    _unfreezePaneMenuItem = MenuItem.create(UnfreezeConfig);
    _unfreezePaneMenuItem.setEnabled(false);
    _freezePaneMenuItem = MenuItem.create(FreezeConfig);

    _contextMenu = WidgetFactory.create({type:'contextMenu'});
    if (_contextMenu) {
      if (Features.isEnabled('edit')) {
        _contextMenu.addMenuItem(MenuItem.create(CutConfig));
        _contextMenu.addMenuItem(MenuItem.create(CopyEditorConfig));
        _contextMenu.addMenuItem(MenuItem.create(PasteConfig));
        _contextMenu.addMenuItem(MenuItem.create(InsertConfig));
        _contextMenu.addMenuItem(MenuItem.create(DeleteConfig));
      }
      else {
        _contextMenu.addMenuItem(MenuItem.create(CopyViewerConfig));
      }
      _contextMenu.addMenuItem(_unfreezePaneMenuItem);
      _contextMenu.addMenuItem(_freezePaneMenuItem);
      _contextMenu.addMenuItem(MenuItem.create(SortAZConfig));
      _contextMenu.addMenuItem(MenuItem.create(SortZAConfig));
      _contextMenu.removeTabindex();
      _contextMenu.appendTo(_containerDivs.zoomArea);
    }
  };

  var _removeCellFromAllPanes = function(eventType, eventData) {
    eventType = eventType || '';
    if(eventData && (eventData.rowIndex !== undefined) &&
      (eventData.colIndex !== undefined)) {
      PaneManager.removeCellFromAllPanes(eventData.rowIndex,
                                         eventData.colIndex);
    }
  };

  var _removeMergeCellFromAllPanes = function(eventType, eventData) {
    eventType = eventType || '';
    if(eventData && (eventData.anchorRowIndex !== undefined) &&
      (eventData.anchorColIndex !== undefined)) {
      PaneManager.removeMergeCellFromAllPanes(eventData.anchorRowIndex,
                                              eventData.anchorColIndex);
    }
  };

  var _preventDefaultBackspaceBehaviour = function(event) {
    if((event.keyCode === _kBackspaceKeyCode) && event.preventDefault) {
      // default behaviour on backspace seems to delete the browser tab, so
      // prevent this
      event.preventDefault();
    }
  };

  var _onKeyUpEvent = function(event) {
    _preventDefaultBackspaceBehaviour(event);
  };

  var _onKeyPressEvent = function(event) {
      _preventDefaultBackspaceBehaviour(event);
    };

  var _onTextInputEvent = function(event) {
      _preventDefaultBackspaceBehaviour(event);
    };

  var _adjustForZoomScale = function(scale) {
    _containerDivs.zoomArea.style.width = (100 * (1 / scale)) + '%';
    _containerDivs.zoomArea.style.height = (100 * (1 / scale)) + '%';

    ChartSheetManager.adjustForZoomScale();
    PaneManager.adjustPanesToFitScrollbars();
    _scrollCurrentSelectionIntoView();

    PubSub.publish(_events.zoomChanged, {current: scale,
                    min: SheetConfig.LAYOUT_DEFAULT_MINZOOM,
                    max: SheetConfig.LAYOUT_DEFAULT_MAXZOOM});
  };
  var _setZoomScale = function(scale) {
      if(scale < SheetConfig.LAYOUT_DEFAULT_MINZOOM) {
        scale = SheetConfig.LAYOUT_DEFAULT_MINZOOM;
      } else if(scale > SheetConfig.LAYOUT_DEFAULT_MAXZOOM) {
        scale = SheetConfig.LAYOUT_DEFAULT_MAXZOOM;
      }

      _containerDivs.zoomArea.style['-webkit-transform-origin'] = '0 0 0';
      _containerDivs.zoomArea.style['-webkit-transform'] = 'scale(' + scale +
                                                            ')';
      _adjustForZoomScale(scale);
    };

  var _onPaneLayout = function(eventType, eventData) {
      eventType = eventType || '';
      if(SheetModel.activeChartSheet) {
        ChartSheetManager.layoutFloaters(eventData);
      }
      else {
        PaneManager.layoutFloaters(eventData);
      }
      PaneManager.resetBottomLeftPaneColHeight();
      _repositionSelectionBox();
      _updateFormulaBarWithAnchor();
    };

  var _onRowsChangedBase = function(from, to) {

      var lastProcessedRowIndex;
      var lastMaximumRowIndex = Math.min(SheetModel.numberOfNonEmptyRows - 1,
                                SheetConfig.kGRID_DEFAULT_MAX_ROWS - 1);
      if(to < lastMaximumRowIndex) {
        // there are still some more populated rows to be fetched so
        // for now just process the ones that have just been fetched
        lastProcessedRowIndex = to;
      } else {
        // the last batch of populated rows has now been fetched so process
        // these rows plus the subsequent rows in the sheet (since the
        // subsequent rows may need to have their default row height updated,
        // and any selection needing seeding may also be in the non-populated
        // range)
        lastProcessedRowIndex = _mainPane.getLastRowIndex();
      }
      var config = {
        startRowIndex: from,
        endRowIndex: lastProcessedRowIndex
      };
      _mainPane.layoutRowHeights(config);
      PaneManager.populateFrozenPanes(from, lastProcessedRowIndex);
      _toggleFreezeUnfreezeMenuItems();

      return lastProcessedRowIndex;

    };

  var _onRowsAdded = function(eventType, eventData) {
      eventType = eventType || '';
      if((eventData !== undefined) && (eventData.from !== undefined) &&
          (eventData.to !== undefined)) {

        _onRowsChangedBase(eventData.from, eventData.to);
      }
    };

  var _onRowsUpdated = function(eventType, eventData) {
      eventType = eventType || '';
      if((eventData !== undefined) && (eventData.from !== undefined) &&
          (eventData.to !== undefined)) {

        var from = eventData.from;
        var to = eventData.to;

        _onRowsChangedBase(from, to);

        PaneManager.syncRowHeightsToFrozenPanes(from, to);
      }
    };

  /**
   * Scrolls the row header container and column header container accordingly,
   * based main pane node from the pane manager
   */
  var _onPaneScroll = function() {
      ColHeaderContainer.setScrollPos(PaneManager.getMainPane().getPaneNode().
                                      scrollLeft);
      RowHeaderContainer.setScrollPos(PaneManager.getMainPane().getPaneNode().
                                      scrollTop);
    };

  /**
   * Opens a dialog showing the disallowed cut/copy/paste message.
   */
  var _onCopyCutPasteNotAllowed = function() {
    var dialog = new QowtDisallowedCutCopyPasteDialog();
    dialog.show();
  };

  function _blurToolbar() {
    PubSub.publish('qowt:blurMaintoolbar');
  }

  /**
   * Augment the mouse down event *during capture* to add information
   * about the zoomed coordinate
   */

  function _augmentWithZoomInfo(event) {
    // x and y cordinates are absolute to the screen, but we need to take our
    // zoomed area and it's zoom value in to account while keepin in mind that
    // the function bar at the top does not get zoomed; so we need to get the
    // relative position inside the zoomArea.
    var zoomAreaLeft = DomUtils.absolutePos(_containerDivs.zoomArea).left;
    var zoomAreaTop = DomUtils.absolutePos(_containerDivs.zoomArea).top;

    var relX = event.x - zoomAreaLeft;
    var relY = event.y - zoomAreaTop;
    var zoomScale = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];

    event.zoomedY = (relY / zoomScale) + zoomAreaTop;
    event.zoomedX = (relX / zoomScale) + zoomAreaLeft;
  }

  var _positionSelectionBox = function(selectionObj) {
    PaneManager.positionSelectionBox(selectionObj);
  };

  var _setHeaderHighlightingOnSelectedCell = function(doHighlightOtherHeaders,
                                                      rowIndex, colIndex) {
    var rowWidget = _mainPane.getRow(rowIndex);
    var colWidget = _mainPane.getColumn(colIndex);
    if (rowWidget) {
      rowWidget.highlightHeader(doHighlightOtherHeaders);
    }
    if (colWidget) {
      colWidget.highlightHeader(doHighlightOtherHeaders);
    }
  };

  function _onSelectionChanged(eventType, eventData) {
    eventType = eventType || '';
    if(eventData.oldSelection && (eventData.oldSelection.contentType ===
      'sheetCell') && eventData.newSelection &&
      (eventData.newSelection.contentType !== 'sheetCell')) {
      // store the current cell selection so that it can be used during the edit
      // if required (e.g. when the user is editing a formula and uses the arrow
      // keys to add cell refs).
      // LM TODO: This is not very clean but is required because the cell
      // selection is no longer 'get-able' via the Sheet Selection Manager's
      // getCurrentSelection() method. Think of a better way to do this (e.g.
      // include the cell selection in a text widget's selection context?)
      SheetModel.currentCellSelection = eventData.oldSelection;
    }

    if((eventData.oldSelection && (eventData.oldSelection.contentType ===
      'sheetText')) || (eventData.newSelection &&
      (eventData.newSelection.contentType === 'sheetText'))) {
      // a cell edit has started, is in progress (and the user is switching
      // between text widgets) or is finishing - we don't need to do anything
      return;
    }

    if(eventData.newSelection && (eventData.newSelection.contentType ===
      'sheetTab')) {
      // a sheet tab has been selected - keep the current cell selection
      // rendered; if a sheet rename is in progress then we want the current
      // cell selection to remain visible, if a change sheet is in progress
      // then the rendered cell selection will soon change anyway to be the
      // seed selection on the new sheet
      if(eventData.oldSelection) {
        _processOldSelection(eventData.oldSelection);
      }
      return;
    }

    if(eventData.oldSelection) {
      _processOldSelection(eventData.oldSelection);
    }
    if(eventData.newSelection) {
      _processNewSelection(eventData.newSelection);
    }
  }

  function _processOldSelection(selectionObj) {
    if(selectionObj.contentType === 'sheetCell') {

      var fromRowIdx = selectionObj.topLeft.rowIdx !== undefined ?
        selectionObj.topLeft.rowIdx : 0;
      var toRowIdx = selectionObj.bottomRight.rowIdx !== undefined ?
        selectionObj.bottomRight.rowIdx : _mainPane.getNumOfRows()-1;
      var fromColIdx = selectionObj.topLeft.colIdx !== undefined ?
        selectionObj.topLeft.colIdx : 0;
      var toColIdx = selectionObj.bottomRight.colIdx !== undefined ?
        selectionObj.bottomRight.colIdx : _mainPane.getNumOfCols()-1;
      var r1 = Math.min(fromRowIdx, toRowIdx);
      var r2 = Math.max(fromRowIdx, toRowIdx);
      var c1 = Math.min(fromColIdx, toColIdx);
      var c2 = Math.max(fromColIdx, toColIdx);
      for (var rIdx = r1; rIdx <= r2; rIdx++) {
        for (var cIdx = c1; cIdx <= c2; cIdx++) {
          // ROW AND COLUMN HEADERS:
          // un-highlight the highlighted row and column widget headers
          _setHeaderHighlightingOnSelectedCell(false, rIdx, cIdx, selectionObj);
        }
      }

      // FORMULA BAR:
      // clear the formula bar
      FormulaBar.setDisplayText();
    }
  }

  function _processNewSelection(selectionObj) {
    if(selectionObj.contentType === 'sheetCell') {

      var fromRowIdx = selectionObj.topLeft.rowIdx !== undefined ?
        selectionObj.topLeft.rowIdx : 0;
      var toRowIdx = selectionObj.bottomRight.rowIdx !== undefined ?
        selectionObj.bottomRight.rowIdx : _mainPane.getNumOfRows()-1;
      var fromColIdx = selectionObj.topLeft.colIdx !== undefined ?
        selectionObj.topLeft.colIdx : 0;
      var toColIdx = selectionObj.bottomRight.colIdx !== undefined ?
        selectionObj.bottomRight.colIdx : _mainPane.getNumOfCols()-1;
      var r1 = Math.min(fromRowIdx, toRowIdx);
      var r2 = Math.max(fromRowIdx, toRowIdx);
      var c1 = Math.min(fromColIdx, toColIdx);
      var c2 = Math.max(fromColIdx, toColIdx);
      for (var rIdx = r1; rIdx <= r2; rIdx++) {
        for (var cIdx = c1; cIdx <= c2; cIdx++) {
          // ROW AND COLUMN HEADERS:
          // highlight the row and column headers
          _setHeaderHighlightingOnSelectedCell(true, rIdx, cIdx, selectionObj);
        }
      }

      // position the selection box over the row and column widgets
      _positionSelectionBox(selectionObj);

      // update the formula bar to display the correct contents
      var anchorRowIdx = selectionObj.anchor.rowIdx;
      var anchorColIdx = selectionObj.anchor.colIdx;
      _updateFormulaBar(anchorRowIdx, anchorColIdx);

      PaneManager.updateActivePaneIdx();
      // finally, scroll the selected area into view
      _scrollCurrentSelectionIntoView();
    }
    else if((selectionObj.contentType === "sheetFloaterImage") ||
            (selectionObj.contentType === "sheetFloaterChart")) {
      // position the selection box over the row and column widgets
      _positionSelectionBox(selectionObj);
    }
  }

  var _updateFormulaBar = function(rowIndex, colIndex) {
    var floater = _mainPane.getFloaterManager().findContainingFloater(rowIndex,
      colIndex);
    if(floater && (floater.getType() === _kMergedCell_Floater_Type)) {
      rowIndex = floater.y();
      colIndex = floater.x();
    }

    var rowWidget = _mainPane.getRow(rowIndex);
    var cell;
    if(rowWidget !== undefined) {
        cell = rowWidget.getCell(colIndex);
    }
    if (cell !== undefined) {
      var text = cell.cellText,
          editableText = cell.getEditableText();

        if(editableText !== undefined && editableText !== '=#UNSUPPORTED') {
          FormulaBar.setDisplayText(editableText);
        } else if(text !== undefined) {
          FormulaBar.setDisplayText(text);
        } else {
          FormulaBar.setDisplayText();
        }
      } else {
        FormulaBar.setDisplayText();
      }
    };

  var _repositionSelectionBox = function() {
    var currentSelection = SheetSelectionManager.getCurrentSelection();
    if ((currentSelection !== undefined) && (currentSelection.contentType ===
        'sheetCell')) {
      _positionSelectionBox(currentSelection);
    }
  };

  var _scrollToTop = function() {
    PaneManager.setPaneScrollPositions({
      panes: _kPane_Bottom_Right,
      x: 0,
      y: 0
    });
    RowHeaderContainer.setScrollPos(0);
    ColHeaderContainer.setScrollPos(0);

    };

  var _updateFormulaBarWithAnchor = function() {
    var selection = SheetSelectionManager.getCurrentSelection();
    if ((selection !== undefined) && (selection.contentType === 'sheetCell')) {
      _updateFormulaBar(selection.anchor.rowIdx, selection.anchor.colIdx);
    }
  };

  var _scrollCurrentSelectionIntoView = function(selectionObj) {
    PaneManager.scrollCellSelectionIntoView(selectionObj);
  };

  // Edit handling

  var _initiateCellEdit = function(isInlineEdit, seed) {
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && (selectionObj.contentType === 'sheetCell')) {
      // scroll the target cell into view
      _scrollCurrentSelectionIntoView(selectionObj);

      // display the floating editor and if
      // 'isInlineEdit' is true then also give it focus
      PaneManager.displayFloatingEditor(isInlineEdit, selectionObj, seed);
    }
  };

  var _completeCellEdit = function(cancelled, clickObj) {
    // hide the floating editor
    PaneManager.hideFloatingEditor();

    // clear the cached inline format edits
    SheetModel.inlineFormatEdits = {};

    if(cancelled) {
      // the cell edit was cancelled so update the formula bar
      // to reflect the original text in the selected cell
      _updateFormulaBarWithAnchor();
    }

    if(clickObj) {
      window.setTimeout(function() {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true ); // type, bubbles, canceable
        clickObj.dispatchEvent(evt);
      }, 0);
    }
  };

  var _mirrorText = function() {
    // get the current text in the focused text editor
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && (selectionObj.contentType === 'sheetText') &&
      selectionObj.textWidget) {
      var text = selectionObj.textWidget.getDisplayText();
      // mirror that text in the unfocused text editor
      if(selectionObj.textWidget.isInline()) {
        // the focused text widget is the floating editor, so mirror its text
        // in the formula bar
        FormulaBar.setDisplayText(text);
      }
      else {
        // vice versa
        PaneManager.setFloatingEditorDisplayText(text);
      }
    }
  };

  var _injectCellRef = function(event) {
    if(event.type === 'mousedown') {
      _injectRefForMouseDown(event);
    }
    else if(event.type === 'keydown') {
      _injectRefForKeyDown(event);
    }
  };

  var _injectRefForMouseDown = function(event) {
    var cellRef = PaneManager.getCellRef(event);
    if(cellRef) {
      var selectionObj = SheetSelectionManager.getCurrentSelection();
      if(selectionObj && (selectionObj.contentType === 'sheetText') &&
        (selectionObj.textWidget)) {
        // inject the cell ref into the focused text widget
        var obj = { cellRef: cellRef };
        if(selectionObj.textWidget.isInline()) {
          PaneManager.injectCellRefIntoFloatingEditor(obj);
        }
        else {
          FormulaBar.injectCellRef(obj);
        }

        // scroll the formula target into view
        PaneManager.scrollFormulaTargetIntoView(obj);
      }
    }
  };

  var _injectRefForKeyDown = function(event) {
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && (selectionObj.contentType === 'sheetText') &&
      (selectionObj.textWidget) && selectionObj.textWidget.isInline()) {
      // the focused text widget is the floating
      // editor so inject the cell ref into it
      var cellRef = PaneManager.getCellRef(event);
      if(cellRef) {
        var obj = { cellRef: cellRef, byKey: true };
        PaneManager.injectCellRefIntoFloatingEditor(obj);

        // scroll the formula target into view
        PaneManager.scrollFormulaTargetIntoView(obj);
      }
    }
  };

  var _injectCellRange = function(event) {
    if(event.type === 'mousemove') {
      _injectRangeForMouseMove(event);
    }
    else if(event.type === 'keydown') {
      _injectRangeForKeyDown(event);
    }
  };

  var _injectRangeForMouseMove = function(event) {
    var cellRange = PaneManager.getCellRange(event);
    if(cellRange) {
      var selectionObj = SheetSelectionManager.getCurrentSelection();
      if(selectionObj && (selectionObj.contentType === 'sheetText') &&
        (selectionObj.textWidget)) {
        var obj = { cellRange: cellRange };
        // inject the cell range into the focused text widget
        if(selectionObj.textWidget.isInline()) {
          PaneManager.injectCellRangeIntoFloatingEditor(obj);
        }
        else {
          FormulaBar.injectCellRange(obj);
        }

        // scroll the formula target into view
        PaneManager.scrollFormulaTargetIntoView(obj);
      }
    }
  };

  var _injectRangeForKeyDown = function(event) {
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && (selectionObj.contentType === 'sheetText') &&
      (selectionObj.textWidget) && selectionObj.textWidget.isInline()) {
      // the focused text widget is the floating
      // editor so inject the cell range into it
      var cellRange = PaneManager.getCellRange(event);
      if(cellRange) {
        var obj = { cellRange: cellRange, byKey: true };
        PaneManager.injectCellRangeIntoFloatingEditor(obj);

        // scroll the formula target into view
        PaneManager.scrollFormulaTargetIntoView(obj);
      }
    }
  };

  /**
   * Enable or disable the freeze and the unfreeze menu items according to the
   * boolean returned by the isFrozen() method
   */
  var _toggleFreezeUnfreezeMenuItems = function() {
    if (PaneManager.isFrozen()) {
      _freezePaneMenuItem.setEnabled(false);
      _unfreezePaneMenuItem.setEnabled(true);
    }
    else {
      _freezePaneMenuItem.setEnabled(true);
      _unfreezePaneMenuItem.setEnabled(false);
    }
  };

  return _api;
});
