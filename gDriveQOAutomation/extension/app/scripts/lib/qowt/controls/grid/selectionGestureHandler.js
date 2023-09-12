
/**
 * @fileoverview The Selection Gesture Handler is a helper for the Pane Manager.
 * The Selection Gesture Handler is responsible for detecting mouse gestures
 * which affect the current selection. The Selection Gesture Handler publishes
 * the appropriate signals to broadcast these user gestures, such as
 * 'qowt:sheet:requestFocus' signals
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/utils/dblClickAugmentor',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/search',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/formulaUtils',
  'qowtRoot/utils/sheet-lo-dash'
  ], function(
    SheetSelectionManager,
    DblClickAugmentor,
    DomListener,
    DomUtils,
    SearchUtils,
    SheetModel,
    PubSub,
    FormulaUtils
    /*sheet-lo-dash*/) {

  'use strict';

  var _panes, _mainPane, _activePaneIdx, _panesContainerNode,

  // The total number of panes
  _kNumber_Of_Panes = 4,

  // Classes of the four panes
  _kPane_Top_Left_Class = "top-left",
  _kPane_Top_Right_Class = "top-right",
  _kPane_Bottom_Left_Class = "bottom-left",
  _kPane_Bottom_Right_Class = "bottom-right",

  // Indices of the four panes
  _kPane_Top_Left_Idx = 0,
  _kPane_Top_Right_Idx = 1,
  _kPane_Bottom_Left_Idx = 2,
  _kPane_Bottom_Right_Idx = 3,

  // TODO(umesh.kadam): Should selectionGestureHandler have this information ?
  // keeping it for now since this information is needed to decide an anchor
  // when row header or column header is clicked. Moreover rowHeaderContainer &
  // colHeaderContainer cannot access paneManager OR workbook directly.
  _panesFrozen = false,
  // Pane class
  _kPane_Node_Class = 'qowt-sheet-pane',

  // Cell content type identifier
  _kCell_Content_Type = 'sheetCell',

  // Right click button identifier
  _KButton_RightClick = 2,

  // Keys that affect the current selection
  _kArrowLeftKeyCode = 37,
  _kArrowUpKeyCode = 38,
  _kArrowRightKeyCode = 39,
  _kArrowDownKeyCode = 40,

  // Signals that are published
  _kSignal_WidgetDoubleClick = "qowt:widget:dblClick",
  _kSignal_RequestFocus = "qowt:sheet:requestFocus",
  _kSignal_RequestRowFocus = "qowt:sheet:requestRowFocus",
  _kSignal_RequestColFocus = "qowt:sheet:requestColumnFocus",
  _requestRowFocusToken,
  _requestColFocusToken,

  _kMergedCell_Floater_Type = "sheetFloaterMergeCell",

  // enum for dimensions
  _kDimensions = {
      row: 1,
      col: 2
  },

  _kMove_Range_Up_Funcs = {
    shouldShrink: function(currentSelectionObj) {
      return (currentSelectionObj.bottomRight.rowIdx >
              currentSelectionObj.anchor.rowIdx) ||
             (currentSelectionObj.bottomRight.rowIdx === undefined &&
              currentSelectionObj.topLeft.rowIdx === undefined);
    },
    shrink: function(proposedObj) {
      return --proposedObj.toRowIdx;
    },
    grow: function(proposedObj) {
      return --proposedObj.fromRowIdx;
    }
  },

  _kMove_Range_Down_Funcs = {
    shouldShrink: function(currentSelectionObj) {
      return currentSelectionObj.topLeft.rowIdx <
             currentSelectionObj.anchor.rowIdx;
    },
    shrink: function(proposedObj) {
      return ++proposedObj.fromRowIdx;
    },
    grow: function(proposedObj) {
      return ++proposedObj.toRowIdx;
    }
  },

  _kMove_Range_Left_Funcs = {
    shouldShrink: function(currentSelectionObj) {
      return (currentSelectionObj.bottomRight.colIdx >
              currentSelectionObj.anchor.colIdx) ||
             (currentSelectionObj.bottomRight.colIdx === undefined &&
              currentSelectionObj.topLeft.colIdx === undefined);
    },
    shrink: function(proposedObj) {
      return --proposedObj.toColIdx;
    },
    grow: function(proposedObj) {
      return --proposedObj.fromColIdx;
    }
  },

  _kMove_Range_Right_Funcs = {
    shouldShrink: function(currentSelectionObj) {
      return currentSelectionObj.topLeft.colIdx <
             currentSelectionObj.anchor.colIdx;
    },
    shrink: function(proposedObj) {
      return ++proposedObj.fromColIdx;
    },
    grow: function(proposedObj) {
      return ++proposedObj.toColIdx;
    }
  },

  _api = {

    /**
     * Initialise the singleton Selection Gesture Handler
     *
     * @param panes {array} An array of pane widgets
     * @param panesContainerNode {HTML node} The panes container node
     * @method init()
     */
    init: function(panes, panesContainerNode) {
      if(!panes || (panes.length !== _kNumber_Of_Panes)) {
        throw new Error("SelectionGestureHandler wasn't " +
                        "initialized with the expected number of panes");
      }
      if(!panesContainerNode) {
        throw new Error("SelectionGestureHandler wasn't " +
                        "initialized with the panes container node");
      }

      _panes = panes;
      _mainPane = panes[_kPane_Bottom_Right_Idx];
      _activePaneIdx = _kPane_Bottom_Right_Idx;
      _panesContainerNode = panesContainerNode;

      // start the double click augmentor
      DblClickAugmentor.start();

      // listen for mousedown events on each pane
      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        DomListener.addListener(_panes[i].getPaneNode(), 'mousedown',
                                _onMouseDown);
      }

      // listen for mousedown events on the panes container node
      DomListener.addListener(_panesContainerNode, 'mousedown',
                              _startRangeSelectionByMouse);
      _requestRowFocusToken = PubSub.subscribe(_kSignal_RequestRowFocus,
        _handleRequestFocusForRow);
      _requestColFocusToken = PubSub.subscribe(_kSignal_RequestColFocus,
        _handleRequestFocusForColumn);
    },

    /**
     * Resets the singleton Selection Gesture Handler.
     * This removes any event listeners
     *
     * @method reset()
     */
    reset: function() {
      DblClickAugmentor.stop();

      for (var i = 0; i < _kNumber_Of_Panes; i++) {
        DomListener.removeListener(_panes[i].getPaneNode(), 'mousedown',
                                   _onMouseDown);
      }

      DomListener.removeListener(_panesContainerNode, 'mousedown',
                                 _startRangeSelectionByMouse);
      PubSub.unsubscribe(_requestRowFocusToken);
      PubSub.unsubscribe(_requestColFocusToken);
    },


    /**
     * @return {Integer} Returns the top most visible row index in the main
     *    pane based on the scroll information. If the panes are frozen then
     *    zeroth row is considered as the top most visible row.
     */
    getTopMostVisibleRowIdx: function() {
      var topMostVisibleRowIdx = 0;
      if (!_panesFrozen) {
        var topMostPos = _mainPane ? _mainPane.getPaneNode().scrollTop : 0;
        topMostVisibleRowIdx =
            SearchUtils.array.binSearch(SheetModel.RowPos, topMostPos, 'low');
      }
      return topMostVisibleRowIdx;
    },


    /**
     * @return {Integer} Returns the left most visible column index in
     *    the main pane based on the scroll information. If the panes are frozen
     *    then zeroth column is considered as the left most visible column.
     */
    getLeftMostVisibleColIdx: function() {
      var leftMostVisibleColIdx = 0;
      if (!_panesFrozen) {
        var leftMostPos = _mainPane ? _mainPane.getPaneNode().scrollLeft : 0;
        leftMostVisibleColIdx =
            SearchUtils.array.binSearch(SheetModel.ColPos, leftMostPos, 'low');
      }
      return leftMostVisibleColIdx;
    },


    /**
     * Returns the currently active pane widget
     *
     * @return {object} The currently active pane
     * @method getActivePane()
     */
    getActivePane: function() {
      var activePane = _mainPane;
      if (_activePaneIdx !== undefined) {
        activePane = _panes[_activePaneIdx];
      }
      return activePane;
    },

    /**
     * Returns the currently active pane's name.
     *
     * @return {String} -- Pane name, one of the 'bottom_right', 'bottom_left',
     *    'top_left' or 'top_right'.
     */
    getActivePaneName: function() {
      var paneName = 'bottom_right'; // main pane

      if (_activePaneIdx === _kPane_Bottom_Left_Idx) {
        paneName = 'bottom_left';
      } else if (_activePaneIdx === _kPane_Top_Left_Idx) {
        paneName = 'top_left';
      } else if (_activePaneIdx === _kPane_Top_Right_Idx) {
        paneName = 'top_right';
      }
      return paneName;
    },

    /**
     * Update active pane index.
     *
     * @method updateActivePaneIdx()
     */
    updateActivePaneIdx: function(frozenRowIdx, frozenColIdx) {
      var currentSelection = SheetSelectionManager.getCurrentSelection();
      if (currentSelection && currentSelection.anchor) {
        var anchorRowIdx = currentSelection.anchor.rowIdx;
        var anchorColIdx = currentSelection.anchor.colIdx;

        _activePaneIdx = _kPane_Bottom_Right_Idx;
        if (_.isValidIdx(frozenRowIdx) || _.isValidIdx(frozenColIdx)) {
          _panesFrozen = true;

          if (frozenRowIdx && frozenColIdx) {
            // frozen cell
            if (anchorRowIdx < frozenRowIdx) {
              _activePaneIdx = anchorColIdx < frozenColIdx ?
                  _kPane_Top_Left_Idx : _kPane_Top_Right_Idx;
            } else if (anchorColIdx < frozenColIdx) {
              _activePaneIdx = _kPane_Bottom_Left_Idx;
            }
          } else if (frozenRowIdx && anchorRowIdx < frozenRowIdx) {
            _activePaneIdx = _kPane_Top_Right_Idx;
          } else if (frozenColIdx && anchorColIdx < frozenColIdx) {
            _activePaneIdx = _kPane_Bottom_Left_Idx;
          }
        } else {
          _panesFrozen = false;
        }
      }
    },

    /**
     * Moves the current selection up by 1 row or potentially by multiple rows
     * if the 'byBlock' value is true.
     *
     * @param {boolean} byBlock - if true, the selection will be moved according
     *                            to the nearest block of populated cells. if
     *                            false the selection will be moved by a single
     *                            row.
     */
    moveUp: function(byBlock) {
      var delta = -1;
      if (byBlock) {
        delta = _getEdgeIndexOffsetForDataRegion('up');
      }
      _move(_kDimensions.row, delta);
    },

    /**
     * Moves the current selection down by 1 row or potentially by multiple
     * rows if 'byBlock' value is true.
     *
     * @param {boolean} byBlock - if true, the selection will be moved according
     *                            to the nearest block of populated cells. if
     *                            false the selection will be moved by single
     *                            row.
     */
    moveDown: function(byBlock) {
      var delta = 1;
      if (byBlock) {
        delta = _getEdgeIndexOffsetForDataRegion('down');
      }
      _move(_kDimensions.row, delta);
    },

    /**
     * Moves the current selection left by 1 column or potentially by multiple
     * columns if 'byBlock' value is true.
     *
     * @param {boolean} byBlock - if true, the selection will be moved according
     *                            to the nearest block of populated cells. if
     *                            false the selection will be moved by single
     *                            column.
     */
    moveLeft: function(byBlock) {
      var delta = -1;
      if (byBlock) {
        delta = _getEdgeIndexOffsetForDataRegion('left');
      }
      _move(_kDimensions.col, delta);
    },

    /**
     * Moves the current selection right by 1 column or potentially by multiple
     * columns if 'byBlock' value is true.
     *
     * @param {boolean} byBlock - if true, the selection will be moved according
     *                            to the nearest block of populated cells. if
     *                            false the selection will be moved by single
     *                            column.
     */
    moveRight: function(byBlock) {
      var delta = 1;
      if (byBlock) {
        delta = _getEdgeIndexOffsetForDataRegion('right');
      }
      _move(_kDimensions.col, delta);
    },

    /**
     * Moves the selection to the position of the given click event
     *
     * @method moveToClickPos()
     */
    moveToClickPos: function(event) {
      _onMouseDown(event);
    },

    /**
     * Moves the selected range up
     *
     * @method moveRangeUp()
     */
    moveRangeUp: function() {
      _moveRange(_kDimensions.row, _kMove_Range_Up_Funcs);
    },

    /**
     * Moves the selected range down
     *
     * @method moveRangeDown()
     */
    moveRangeDown: function() {
      _moveRange(_kDimensions.row, _kMove_Range_Down_Funcs);
    },

    /**
     * Moves the selected range to the left
     *
     * @method moveRangeLeft()
     */
    moveRangeLeft: function() {
      _moveRange(_kDimensions.col, _kMove_Range_Left_Funcs);
    },

    /**
     * Moves the selected range to the right
     *
     * @method moveRangeRight()
     */
    moveRangeRight: function() {
      _moveRange(_kDimensions.col, _kMove_Range_Right_Funcs);
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
      var cellRef;
      if(event.type === 'mousedown') {
        cellRef = _getRefForMouseDown(event);
      }
      else if(event.type === 'keydown') {
        cellRef = _getRefForKeyDown(event);
      }
      return cellRef;
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
      var cellRange;
      if(event.type === 'mousemove') {
        cellRange = _getRangeForMouseMove(event);
      }
      else if(event.type === 'keydown') {
        cellRange = _getRangeForKeyDown(event);
      }
      return cellRange;
    },

    /**
     * Reselects the current selection
     */
    reselectCurrentSelection: function() {
      PubSub.publish(_kSignal_RequestFocus,
        SheetSelectionManager.getCurrentSelection());
    },

    /**
     * change the selection for 'cmd/ctrl + a' keyboard occurance.
     */
    selectAllCells: function() {
      var currentSelection = SheetSelectionManager.getCurrentSelection();
      // If we send cell range selection object of entire sheet as a part of
      // 'scf' request, core sends formatting response cell by cell. It takes
      // lot of time to format entire sheet. For performance optimisation,
      // instead of sending the cell range, we need to send column range in the
      // selection object as a part of 'scf' request. The core sends then
      // responds back with column wise formatting data.
      // As QOWT only supports 256 cols, but pronto sheet will support 16384
      // columns (the 2007 limit). By not sending the column indexes, we can
      // let the core interpret that as meaning "the entire sheet" and can act
      // accordingly.
      var newSelection = {
        contentType: _kCell_Content_Type,
        anchor: {
          rowIdx: currentSelection.anchor.rowIdx,
          colIdx: currentSelection.anchor.colIdx},
        topLeft: {rowIdx: undefined, colIdx: undefined},
        bottomRight: {rowIdx: undefined, colIdx: undefined}
      };
      PubSub.publish(_kSignal_RequestFocus, newSelection);
    },


    isEntireSheetSelected: function(sel) {
      var selObj = sel || SheetSelectionManager.getCurrentSelection();
      var isSheetSelected = false;
      if (selObj && selObj.topLeft && selObj.bottomRight) {
        isSheetSelected = (selObj.topLeft.rowIdx === undefined) &&
            (selObj.topLeft.colIdx === undefined) &&
            (selObj.bottomRight.rowIdx === undefined) &&
            (selObj.bottomRight.colIdx === undefined);
      }
      return isSheetSelected;
    },


    isOneOrMoreRowsSelected: function(sel) {
      var selObj = sel || SheetSelectionManager.getCurrentSelection();
      var isRowSelected = false;
      if (selObj && selObj.topLeft) {
        var topLeft = selObj.topLeft;
        isRowSelected = (topLeft.rowIdx !== undefined) &&
            (topLeft.colIdx === undefined);
      }
      return isRowSelected;
    },


    isOneOrMoreColumnsSelected: function(sel) {
      var selObj = sel || SheetSelectionManager.getCurrentSelection();
      var isColumnSelected = false;
      if (selObj && selObj.topLeft) {
        var topLeft = selObj.topLeft;
        isColumnSelected = (topLeft.colIdx !== undefined) &&
            (topLeft.rowIdx === undefined);
      }
      return isColumnSelected;
    }
  };

  var _onMouseDown = function(event) {
    // a click has occurred
    var selection = SheetSelectionManager.getCurrentSelection();
    // If we are right-clicking and there's a selection and we are in the
    // middle of that selection, do not process the mouse down. Otherwise we
    // lose selection when opening the context menu
    if (event && event.button === _KButton_RightClick && selection &&
        selection.topLeft && selection.topLeft !== selection.bottomRight) {
      if (event.x && event.y) {
        var rowIndex = _getRowIndexFromEvent(event);
        var colIndex = _getColIndexFromEvent(event);
        if ((rowIndex >= selection.topLeft.rowIdx) &&
            (rowIndex <= selection.bottomRight.rowIdx) &&
            (colIndex >= selection.topLeft.colIdx) &&
             colIndex <= (selection.bottomRight.colIdx)) {
          if (event && event.preventDefault) {
            event.preventDefault();
            return;
          }
        }
      }
    }

    // Ignoring mousedown events if the target is hyperlink dialog. So that
    // hyperlink dialog itself handle these events and take action accordingly.
    // After migration from Shadow to ShadyDOM,  when we click on link from
    // hyperlink dialog we get target node as SPAN, so if we get the element
    // from hyperlink dialog then ignoring mousedown events as well.
    if (event && (event.target.nodeName === 'QOWT-HYPERLINK-DIALOG' ||
        event.target.parentElement.nodeName === 'QOWT-HYPERLINK-DIALOG')) {
      event.stopPropagation();
      return;
    }

    _handlePaneSelection(event);
    _anchorTheSelection(event);

    if (event.dblClick) {
      // the click was actually a double click
      _handlePaneDblClick();
      if (event && event.preventDefault) {
        // prevent the default behaviour which would give focus
        // to the element that has just been double-clicked on
        event.preventDefault();
      }
    }
  };


  var _handleRequestFocusForRow = function(eventType, eventData) {
    eventType = eventType || '';
    var topLeft = eventData.topLeft,
      bottomRight = eventData.bottomRight;

    // Assigning default values to min and max column id, if they are undefined
    if(topLeft.colIdx === undefined && bottomRight.colIdx === undefined){
      topLeft.colIdx = 0;
      bottomRight.colIdx = _mainPane.getNumOfCols() - 1;
    }
    var adjustedObj = {
      minRowIdx: topLeft.rowIdx,
      maxRowIdx: bottomRight.rowIdx,
      minColIdx: topLeft.colIdx,
      maxColIdx: bottomRight.colIdx
    };

    // A click on 1st row header followed by click on last row header
    // while shift key is pressed, results into entire sheet selection. In this
    // case, selection object prepared by rowHeaderContainer is not same as
    // regular selection object which represents entire sheet selection. So, to
    // maintain the "Uniformity of Selection Object" for entire sheet selection,
    // it is modified below.
    var obj = createUniformSelectionObject_(adjustedObj, eventData);

    PubSub.publish('qowt:sheet:requestFocus', obj);
  };


  var _handleRequestFocusForColumn = function(eventType, eventData) {
    eventType = eventType || '';
    var topLeft = eventData.topLeft,
        bottomRight = eventData.bottomRight;

    // Assigning default values to min and max row id, if they are undefined
    if (topLeft.rowIdx === undefined && bottomRight.rowIdx === undefined) {
      topLeft.rowIdx = 0;
      bottomRight.rowIdx = _mainPane.getNumOfRows() - 1;
    }
    var adjustedObj = {
      minRowIdx: topLeft.rowIdx,
      maxRowIdx: bottomRight.rowIdx,
      minColIdx: topLeft.colIdx,
      maxColIdx: bottomRight.colIdx
    };

    // A click on 1st column header followed by click on last column header
    // while shift key is pressed, results into entire sheet selection. In this
    // case, selection object prepared by colHeaderContainer is not same as
    // regular selection object which represents entire sheet selection. So, to
    // maintain the "Uniformity of Selection Object" for entire sheet selection,
    // it is modified below.
    var obj = createUniformSelectionObject_(adjustedObj, eventData);

    PubSub.publish('qowt:sheet:requestFocus', obj);

  };


  var _handlePaneDblClick = function() {
    PubSub.publish(_kSignal_WidgetDoubleClick, {contentType: 'pane'});
  };

  var _handlePaneSelection = function(event) {
    if (event !== undefined) {
      var paneIdx, classList;
      if (event.currentTarget) {
        classList = event.currentTarget.classList;
      }
      else if (event.storedCurrentTarget) {
        classList = event.storedCurrentTarget.classList;
      }
      if(classList) {
        for (var i = 0, len = classList.length; i < len; i++) {
          if (classList[i] === _kPane_Top_Left_Class) {
            paneIdx = _kPane_Top_Left_Idx;
          }
          else if (classList[i] === _kPane_Top_Right_Class) {
            paneIdx = _kPane_Top_Right_Idx;
          }
          else if (classList[i] === _kPane_Bottom_Left_Class) {
            paneIdx = _kPane_Bottom_Left_Idx;
          }
          else if (classList[i] === _kPane_Bottom_Right_Class) {
            paneIdx = _kPane_Bottom_Right_Idx;
          }
        }

        if (paneIdx !== undefined) {
          _activePaneIdx = paneIdx;
        }
      }
    }
  };

  var _anchorTheSelection = function(event) {
    if ((typeof(event.srcElement.className) !== "string") ||
        (!event.srcElement.className.match(_kPane_Node_Class))) {
      // the mousedown event has occurred on the grid itself, so get
      // the target row and column indices based on the event coordinates
      var rowIndex = _getRowIndexFromEvent(event),
          colIndex = _getColIndexFromEvent(event);

      event.zoomedY = event.zoomedY || 0;
      event.zoomedX = event.zoomedX || 0;

      var obj;
      var floaterMgr = _mainPane.getFloaterManager();
      var floater = floaterMgr.findContainingFloater(rowIndex, colIndex);

      if(floater && (floater.getType() !== _kMergedCell_Floater_Type) &&
        _isClickOnFloater(event)) {
        // publish a signal with the fresh selection (the selection is an
        // image or a chart)
        obj = {
          anchor: {rowIdx: rowIndex, colIdx: colIndex},
          topLeft: {rowIdx: rowIndex, colIdx: colIndex},
          bottomRight: {rowIdx: rowIndex, colIdx: colIndex},
          contentType: floater.getType()
        };
      }
      else {
        var adjustedObj;
        if (event.shiftKey && event.button !== _KButton_RightClick) {
          // publish a signal with the fresh selection (the selection is a cell
          // range, perhaps including merged cells)
          var currentSelectionObj = SheetSelectionManager.getCurrentSelection();
          // There should be a currently selected object and it must be of type
          // sheet cell.
          if (!currentSelectionObj ||
            currentSelectionObj.contentType !== 'sheetCell') {
            return;
          }
          var anchor = currentSelectionObj.anchor;
          var fromRowIdx = Math.min(anchor.rowIdx, rowIndex);
          var toRowIdx = Math.max(anchor.rowIdx, rowIndex);
          var fromColIdx = Math.min(anchor.colIdx, colIndex);
          var toColIdx = Math.max(anchor.colIdx, colIndex);
          adjustedObj = floaterMgr.calculateAdjustedSelectionRange(
            fromRowIdx, toRowIdx, fromColIdx, toColIdx, true);

          obj = {
            anchor: {rowIdx: anchor.rowIdx, colIdx: anchor.colIdx},
            topLeft: {rowIdx: adjustedObj.minRowIdx,
                colIdx: adjustedObj.minColIdx},
            bottomRight: {rowIdx: adjustedObj.maxRowIdx,
                colIdx: adjustedObj.maxColIdx},
            contentType: _kCell_Content_Type
          };
        }
        else {
          // publish a signal with the fresh selection (the selection is a cell,
          // perhaps a merged cell)
          adjustedObj = floaterMgr.calculateAdjustedSelectionRange(
            rowIndex, rowIndex, colIndex, colIndex, true);
          obj = {
            anchor: {rowIdx: adjustedObj.minRowIdx,
              colIdx: adjustedObj.minColIdx},
            topLeft: {rowIdx: adjustedObj.minRowIdx,
              colIdx: adjustedObj.minColIdx},
            bottomRight: {rowIdx: adjustedObj.maxRowIdx,
              colIdx: adjustedObj.maxColIdx},
            contentType: _kCell_Content_Type
          };
        }

        // User can select entire sheet/row/column by different ways. Therefore,
        // a uniform representation of selection object is needed to avoid
        // inconsistency.
        var correctedObj = createUniformSelectionObject_(adjustedObj, obj);
        if (correctedObj) {
          obj = correctedObj;
        }
      }

      PubSub.publish(_kSignal_RequestFocus, obj);
    }
  };

  /**
   * This method returns true if mouse event is triggered on floater present
   * in sheet.
   *
   * @param {object} event - DOM event object
   * @returns {boolean} - returns
   *               true - if event is triggered on floater area
   *              false - if event is triggered on outside of floater area
   */
  var _isClickOnFloater = function(event) {
    var classList = event.srcElement.classList;
    return !(classList.contains("qowt-sheet-row") ||
      classList.contains("qowt-sheet-cell-format") ||
      classList.contains("qowt-sheet-cell-burst-area")||
      classList.contains("qowt-sheet-cell-content") ||
      classList.contains("qowt-selection-anchor-node-normal"));
  };

  var _startRangeSelectionByMouse = function(event) {
    // if the mousedown event didn't occur on a scrollbar then start listening
    // for mousemove and mouseup
    if(event.target.className.indexOf &&
       (event.target.className.indexOf("qowt-sheet-pane") === -1)) {
      DomListener.addListener(document, 'mousemove',
                              _moveRangeSelectionByMouse);
      DomListener.addListener(document, 'mouseup', _stopRangeSelectionByMouse);
    }
  };

  var _moveRangeSelectionByMouse = function(event) {
    var currentSelectionObj = SheetSelectionManager.getCurrentSelection();
    if(!currentSelectionObj ||
       currentSelectionObj.contentType !== 'sheetCell') {
      return;
    }
    var cellObj = _getCellFromEventCoords(event);
    var targetRowIndex = cellObj.rowIndex;
    var targetColIndex = cellObj.colIndex;
    var anchor = currentSelectionObj.anchor;

    var fromRowIdx = Math.max(anchor.rowIdx, targetRowIndex);
    var toRowIdx = Math.min(anchor.rowIdx, targetRowIndex);
    var fromColIdx = Math.min(anchor.colIdx, targetColIndex);
    var toColIdx = Math.max(anchor.colIdx, targetColIndex);

    var adjustedObj = _mainPane.getFloaterManager().
      calculateAdjustedSelectionRange(fromRowIdx, toRowIdx, fromColIdx,
                                      toColIdx, true);

    _publishNewSelection(anchor, adjustedObj);
  };

  var _stopRangeSelectionByMouse = function() {
    DomListener.removeListener(document, 'mousemove',
                               _moveRangeSelectionByMouse);
    DomListener.removeListener(document, 'mouseup', _stopRangeSelectionByMouse);
  };

  var _moveRange = function(dimension, fns) {
    var currentSelectionObj = SheetSelectionManager.getCurrentSelection();
    if(!currentSelectionObj ||
       currentSelectionObj.contentType !== 'sheetCell') {
      return;
    }

    var newSelection = _doMoveRange(dimension, fns, currentSelectionObj);
    if(newSelection) {
      _publishNewSelection(newSelection.anchor, newSelection.adjustedObj);
    }
  };

  var _doMoveRange = function(dimension, fns, currentSelectionObj) {
    var originalObj = {
      fromRowIdx: currentSelectionObj.topLeft.rowIdx,
      toRowIdx: currentSelectionObj.bottomRight.rowIdx,
      fromColIdx: currentSelectionObj.topLeft.colIdx,
      toColIdx: currentSelectionObj.bottomRight.colIdx
    };

    var proposedObj = Object.create(originalObj);

    var numOfRows = _mainPane.getNumOfRows();
    var numOfCols = _mainPane.getNumOfCols();
    var floaterMgr = _mainPane.getFloaterManager();
    var adjustedObj;

    var isRowInHiddenArea = function(newIdx) {
      return _inBounds(newIdx, numOfRows) &&
             (_mainPane.getRows()[newIdx].getHeight() === 0);
    };

    var isColInHiddenArea = function(newIdx) {
      return _inBounds(newIdx, numOfCols) &&
             (_mainPane.getColumns()[newIdx].getWidth() === 0);
    };

    var isBoundInHiddenArea = function(newIdx) {
      return (dimension === _kDimensions.row) ?
          isRowInHiddenArea(newIdx) : isColInHiddenArea(newIdx);
    };

    var doGrow = function() {
      while (isBoundInHiddenArea(fns.grow(proposedObj))) {}
      adjustedObj = floaterMgr.calculateAdjustedSelectionRange(
          proposedObj.fromRowIdx, proposedObj.toRowIdx, proposedObj.fromColIdx,
          proposedObj.toColIdx, true);
    };

    // Don't set the 'from' and 'to' properties when we have selected whole
    // rows or columns and just want to expand the selection
    // over more rows or columns (respectively).
    if(proposedObj.toRowIdx === undefined &&
       proposedObj.fromRowIdx === undefined &&
       dimension === _kDimensions.row) {
      proposedObj.fromRowIdx = 0;
      proposedObj.toRowIdx = numOfRows-1;
    }
    if(proposedObj.toColIdx === undefined &&
       proposedObj.fromColIdx === undefined &&
       dimension === _kDimensions.col) {
      proposedObj.fromColIdx = 0;
      proposedObj.toColIdx = numOfCols-1;
    }

    // check whether the range should shrink or grow
    if (fns.shouldShrink(currentSelectionObj)) {
      // shrink
      while (isBoundInHiddenArea(fns.shrink(proposedObj))) {}
      adjustedObj = floaterMgr.calculateAdjustedSelectionRange(
          proposedObj.fromRowIdx, proposedObj.toRowIdx, proposedObj.fromColIdx,
          proposedObj.toColIdx, false,
          dimension === _kDimensions.row, dimension === _kDimensions.col);

      if ((currentSelectionObj.anchor.colIdx < adjustedObj.minColIdx) ||
          (currentSelectionObj.anchor.colIdx > adjustedObj.maxColIdx) ||
          (currentSelectionObj.anchor.rowIdx < adjustedObj.minRowIdx) ||
          (currentSelectionObj.anchor.rowIdx > adjustedObj.maxRowIdx)) {
        // oops - the presence of a floater means that we can't 'shrink' -
        // so change to doing a 'grow'
        proposedObj = Object.create(originalObj); // first change this back
        doGrow();
      }
    }
    else {
      doGrow();
    }

    if(!((adjustedObj.minRowIdx < 0) || (adjustedObj.maxRowIdx >= numOfRows) ||
      (adjustedObj.minColIdx < 0) || (adjustedObj.maxColIdx >= numOfCols))) {
      return {
        anchor: currentSelectionObj.anchor,
        adjustedObj: adjustedObj
      };
    }
  };

  var _publishNewSelection = function(anchor, adjustedObj) {
    // publish a signal with the fresh selection
    var obj = {
      anchor: anchor,
      topLeft: {rowIdx: adjustedObj.minRowIdx, colIdx: adjustedObj.minColIdx},
      bottomRight: {rowIdx: adjustedObj.maxRowIdx,
        colIdx: adjustedObj.maxColIdx},
      contentType: _kCell_Content_Type
    };

    // User can select entire sheet/row/column by different ways. Therefore,
    // a uniform representation of selection object is needed to avoid
    // inconsistency.
    var correctedObj = createUniformSelectionObject_(adjustedObj, obj);
    if (correctedObj) {
      obj = correctedObj;
    }

    PubSub.publish(_kSignal_RequestFocus, obj);
  };

  var _inBounds = function(idx, max) {
    return (idx >= 0) && (idx < max);
  };

  var _move = function(dimension, delta) {
    var currentSelectionObj = SheetSelectionManager.getCurrentSelection();
    if (!currentSelectionObj ||
        currentSelectionObj.contentType !== 'sheetCell' || delta === 0) {
      return;
    }

    var newSelection = _doMove(dimension, delta, currentSelectionObj);
    if(newSelection) {
      _publishNewSelection(newSelection.anchor, newSelection.adjustedObj);
    }
  };

  var _doMove = function(dimension, delta, currentObj) {
    var anchorRowIdx = currentObj.anchor.rowIdx;
    var anchorColIdx = currentObj.anchor.colIdx;
    var minRowIdx = Math.min(currentObj.topLeft.rowIdx,
                             currentObj.bottomRight.rowIdx);
    var maxRowIdx = Math.max(currentObj.topLeft.rowIdx,
                             currentObj.bottomRight.rowIdx);
    var minColIdx = Math.min(currentObj.topLeft.colIdx,
                             currentObj.bottomRight.colIdx);
    var maxColIdx = Math.max(currentObj.topLeft.colIdx,
                             currentObj.bottomRight.colIdx);

    // calculate the cell that should be selected based on the current
    // selection, taking into account that we may be moving up 'through' a
    // floater
    var adjustedObj;
    var floaterMgr = _mainPane.getFloaterManager();
    var numOfRows = _mainPane.getNumOfRows();
    var numOfCols = _mainPane.getNumOfCols();
    var inPaneAfterMove = function() {
      if (dimension === _kDimensions.row) {
        anchorRowIdx += delta;
      } else {
        anchorColIdx += delta;
      }
      return _inBounds(anchorColIdx, numOfCols) &&
             _inBounds(anchorRowIdx, numOfRows);
    };
    while(inPaneAfterMove()) {
      if ((_mainPane.getRows()[anchorRowIdx].getHeight() === 0) ||
          (_mainPane.getColumns()[anchorColIdx].getWidth() === 0)) {
        continue;
      }
      adjustedObj = floaterMgr.calculateAdjustedSelectionRange(anchorRowIdx,
                    anchorRowIdx, anchorColIdx, anchorColIdx, true);
      if((adjustedObj.minRowIdx !== minRowIdx) ||
         (adjustedObj.maxRowIdx !== maxRowIdx) ||
         (adjustedObj.minColIdx !== minColIdx) ||
         (adjustedObj.maxColIdx !== maxColIdx)) {
        return {
          anchor: {rowIdx: anchorRowIdx, colIdx: anchorColIdx},
          adjustedObj: adjustedObj
        };
      }
    }
  };

  var _getCellFromEventCoords = function(event) {
    var containerPosition = DomUtils.absolutePos(_panesContainerNode);

    var obj = {
      rowIndex: _getRowIndexFromEvent(event, containerPosition.top),
      colIndex: _getColIndexFromEvent(event, containerPosition.left)
    };

    return obj;
  };

  var _getRowIndexFromEvent = function(event, topPos) {
    var yCoord = _getRelativeYPositionFromEvent(event, topPos);
    return SearchUtils.array.binSearch(SheetModel.RowPos, yCoord, 'low');
  };

  var _getColIndexFromEvent = function(event, leftPos) {
    var xCoord = _getRelativeXPositionFromEvent(event, leftPos);
    return SearchUtils.array.binSearch(SheetModel.ColPos, xCoord, 'low');
  };

  var _getRelativeYPositionFromEvent = function(event, topPos) {
    // The event object should have been augmented by the workbook
    // layout control to have a zoomedX and zoomedY cordinate
    // But these are absolute to the entire screen. So we need to get
    // relative values relative to the currentTarget element, and then
    // get the row/col from there
    var zoomedY = topPos !== undefined ? event.zoomedY - topPos :
                                         event.zoomedY || 0;

    var currentTarget = event.currentTarget ? event.currentTarget :
                                              event.storedCurrentTarget;

    var yCoord = zoomedY - DomUtils.absolutePos(currentTarget).top;
    // Takes into account the top of the main pane, that is set when we have
    // scrolled and freezed
    var mainPaneTop = parseInt(_mainPane.getBaseNode().style.top, 10);
    if (!isNaN(mainPaneTop)) {
      yCoord -= mainPaneTop;
    }
    // The top panes cannot scroll vertically so do not take scrollTop into
    // account
    if (_activePaneIdx === _kPane_Bottom_Right_Idx ||
        _activePaneIdx === _kPane_Bottom_Left_Idx) {
      yCoord += _mainPane.getPaneNode().scrollTop;
    }
    if (yCoord <= 0) {
      yCoord = 0;
    }

    return yCoord;
  };

  var _getRelativeXPositionFromEvent = function(event, leftPos) {
    // The event object should have been augmented by the workbook
    // layout control to have a zoomedX and zoomedY cordinate
    // But these are absolute to the entire screen. So we need to get
    // relative values relative to the currentTarget element, and then
    // get the row/col from there
    var zoomedX = leftPos !== undefined ? event.zoomedX - leftPos :
                                          event.zoomedX || 0;

    var currentTarget = event.currentTarget ? event.currentTarget :
                                              event.storedCurrentTarget;

    var xCoord = zoomedX - DomUtils.absolutePos(currentTarget).left;
    // Takes into account the left of the main pane, that is set when we have
    // scrolled and freezed
    var mainPaneLeft = parseInt(_mainPane.getBaseNode().style.left, 10);
    if (!isNaN(mainPaneLeft)) {
      xCoord -= mainPaneLeft;
    }
    // The left panes cannot scroll horizontally so do not take scrollLeft into
    // account
    if (_activePaneIdx === _kPane_Bottom_Right_Idx ||
        _activePaneIdx === _kPane_Top_Right_Idx) {
      xCoord += _mainPane.getPaneNode().scrollLeft;
    }
    if (xCoord <= 0) {
      xCoord = 0;
    }

    return xCoord;
  };

  var _getRefForMouseDown = function(event) {
    // We need to set the active pane (this is used when
    // calculating the cell indices from the event).
    // The method _handlePaneSelection() is normally called
    // inside _onMouseDown() but the mousedown event here
    // was swallowed by the SheetTextTool
    _handlePaneSelection(event);

    var targetRowIndex = _getRowIndexFromEvent(event);
    var targetColIndex = _getColIndexFromEvent(event);

    // store this anchor cell incase it is used as the anchor cell of a range
    SheetModel.lastAnchorCell = {rowIdx: targetRowIndex,
                                 colIdx: targetColIndex};

    // get the cell ref to return, taking into account whether there is a merged
    // cell over the anchor cell (in which case the merged cell's anchor cell
    // should be returned as the cell ref)
    var activePane = _api.getActivePane();
    if(activePane) {
      var floater = activePane.getFloaterManager().findContainingFloater(
        targetRowIndex, targetColIndex);
      if(floater && (floater.getType() === _kMergedCell_Floater_Type)) {
        targetRowIndex = floater.y();
        targetColIndex = floater.x();
      }
    }
    return FormulaUtils.cellRowAndColNumsToRef({
      rowNum: targetRowIndex + 1, colNum: targetColIndex + 1});
  };

  var _getRefForKeyDown = function(event) {
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && (selectionObj.textWidget)) {
      if(!SheetModel.lastAnchorCell) {
        // we want to deduce the new cell ref based on the cell that is being
        // edited
        if(SheetModel.currentCellSelection &&
           SheetModel.currentCellSelection.anchor) {
          SheetModel.lastAnchorCell = {
            rowIdx: SheetModel.currentCellSelection.anchor.rowIdx,
            colIdx: SheetModel.currentCellSelection.anchor.colIdx};
        }
      }

      // get the cell ref to return, taking into account any
      // merged cells incase we need to move through a merged cell
      var anchorRowIdx = SheetModel.lastAnchorCell.rowIdx;
      var anchorColIdx = SheetModel.lastAnchorCell.colIdx;
      var baseCellObj = {
        anchor: {rowIdx: anchorRowIdx, colIdx: anchorColIdx},
        topLeft: {rowIdx: anchorRowIdx, colIdx: anchorColIdx},
        bottomRight: {rowIdx: anchorRowIdx, colIdx: anchorColIdx}
      };
      var activePane = _api.getActivePane();
      var floater = activePane.getFloaterManager().findContainingFloater(
        anchorRowIdx, anchorColIdx);
      if(floater && (floater.getType() === _kMergedCell_Floater_Type)) {
        baseCellObj.topLeft.rowIdx = floater.y();
        baseCellObj.topLeft.colIdx = floater.x();
        baseCellObj.bottomRight.rowIdx = floater.y() + floater.rowSpan() - 1;
        baseCellObj.bottomRight.colIdx = floater.x() + floater.colSpan() - 1;
      }
      return _refAfterMove(event, baseCellObj);
    }
  };

  var _refAfterMove = function(event, baseCellObj) {
    // get the new cell area based on the base cell object and the arrow key
    var newObj;
    switch(event.keyCode) {
      case _kArrowLeftKeyCode:
        newObj = _doMove(_kDimensions.col, -1, baseCellObj);
        break;
      case _kArrowUpKeyCode:
        newObj = _doMove(_kDimensions.row, -1, baseCellObj);
        break;
      case _kArrowRightKeyCode:
        newObj = _doMove(_kDimensions.col, 1, baseCellObj);
        break;
      case _kArrowDownKeyCode:
        newObj = _doMove(_kDimensions.row, 1, baseCellObj);
        break;
      default:
        break;
    }
    if(newObj) {
      // store the new anchor cell incase it is used as the anchor cell of a
      // range
      SheetModel.lastAnchorCell = {rowIdx: newObj.anchor.rowIdx,
          colIdx: newObj.anchor.colIdx};

      // return the cell ref of the top-left cell of the area
      return FormulaUtils.cellRowAndColNumsToRef({
        rowNum: newObj.adjustedObj.minRowIdx + 1,
        colNum: newObj.adjustedObj.minColIdx + 1});
    }
  };

  var _getRangeForMouseMove = function(event) {
    var containerPosition = DomUtils.absolutePos(_panesContainerNode);
    var targetRowIndex = _getRowIndexFromEvent(event, containerPosition.top);
    var targetColIndex = _getColIndexFromEvent(event, containerPosition.left);

    var anchorCell = SheetModel.lastAnchorCell;
    if(anchorCell) {
      var obj = {
        minRowIdx: Math.min(anchorCell.rowIdx, targetRowIndex),
        maxRowIdx: Math.max(anchorCell.rowIdx, targetRowIndex),
        minColIdx: Math.min(anchorCell.colIdx, targetColIndex),
        maxColIdx: Math.max(anchorCell.colIdx, targetColIndex)
      };

      // get the cell range to return, taking into account whether there are any
      // merged cells in the given area (in which case the range should expand
      // to include the entirety of the merged cells)
      var activePane = _api.getActivePane();
      if(activePane) {
        obj = activePane.getFloaterManager().calculateAdjustedSelectionRange(
          anchorCell.rowIdx, targetRowIndex, anchorCell.colIdx, targetColIndex,
          true);
      }

      var tl = FormulaUtils.cellRowAndColNumsToRef({
        rowNum: obj.minRowIdx + 1, colNum: obj.minColIdx + 1});
      var br = FormulaUtils.cellRowAndColNumsToRef({
        rowNum: obj.maxRowIdx + 1, colNum: obj.maxColIdx + 1});

      return {
        topLeft: tl,
        bottomRight: br
      };
    }
  };

  var _getRangeForKeyDown = function(event) {
    var selectionObj = SheetSelectionManager.getCurrentSelection();
    if(selectionObj && (selectionObj.contentType === 'sheetText') &&
      (selectionObj.textWidget)) {
      var startCellObj, endCellObj;
      var finalCellArea = selectionObj.textWidget.finalCellAreaBeforeCursor();
      if(finalCellArea) {
        // we want to deduce the new cell range based on the final cell area
        startCellObj = FormulaUtils.cellRefToRowAndColNums(
                       finalCellArea.startCellRef);
        endCellObj = finalCellArea.endCellRef ?
          FormulaUtils.cellRefToRowAndColNums(finalCellArea.endCellRef) :
          startCellObj;

          // if there is not already a stored anchor cell (e.g. the user has
          // manually typed the cell refs rather than 'injected' them) then
          // store the start cellas the anchor cell so that it is used as the
          // anchor cell of this range
          if(!SheetModel.lastAnchorCell) {
            SheetModel.lastAnchorCell = {rowIdx: startCellObj.rowNum - 1,
              colIdx: startCellObj.colNum - 1};
          }
      }
      else {
        // we want to deduce the new cell range based on the cell that is being
        // edited
        if(SheetModel.currentCellSelection &&
          SheetModel.currentCellSelection.anchor) {
          var anchorCell = SheetModel.currentCellSelection.anchor;
          startCellObj = {rowNum: anchorCell.rowIdx + 1,
            colNum: anchorCell.colIdx + 1};
          endCellObj = startCellObj;

          // store this anchor cell as it will be used as the anchor cell of
          // this range
          SheetModel.lastAnchorCell = {rowIdx: anchorCell.rowIdx,
                                       colIdx: anchorCell.colIdx};
        }
      }

      // get the cell range to return, taking into account any
      // merged cells incase we need to move through a merged cell
      var baseCellRange = {
        anchor: {rowIdx: SheetModel.lastAnchorCell.rowIdx,
                 colIdx: SheetModel.lastAnchorCell.colIdx},
        topLeft: {rowIdx: startCellObj.rowNum - 1,
                  colIdx: startCellObj.colNum - 1},
        bottomRight: {rowIdx: endCellObj.rowNum - 1,
                      colIdx: endCellObj.colNum - 1}
      };

      var activePane = _api.getActivePane();
      var adjustedObj = activePane.getFloaterManager().
        calculateAdjustedSelectionRange(
        baseCellRange.topLeft.rowIdx, baseCellRange.bottomRight.rowIdx,
        baseCellRange.topLeft.colIdx, baseCellRange.bottomRight.colIdx, true);

      baseCellRange.topLeft.rowIdx = adjustedObj.minRowIdx;
      baseCellRange.topLeft.colIdx = adjustedObj.minColIdx;
      baseCellRange.bottomRight.rowIdx = adjustedObj.maxRowIdx;
      baseCellRange.bottomRight.colIdx = adjustedObj.maxColIdx;

      return _rangeAfterMove(event, baseCellRange);
    }
  };

  var _rangeAfterMove = function(event, baseCellRange) {
    // get the new area object based on the base range object and the arrow key
    var newObj;
    switch(event.keyCode) {
      case _kArrowLeftKeyCode:
        newObj = _doMoveRange(_kDimensions.col, _kMove_Range_Left_Funcs,
                              baseCellRange);
        break;
      case _kArrowUpKeyCode:
        newObj = _doMoveRange(_kDimensions.row, _kMove_Range_Up_Funcs,
                              baseCellRange);
        break;
      case _kArrowRightKeyCode:
        newObj = _doMoveRange(_kDimensions.col, _kMove_Range_Right_Funcs,
                              baseCellRange);
        break;
      case _kArrowDownKeyCode:
        newObj = _doMoveRange(_kDimensions.row, _kMove_Range_Down_Funcs,
                              baseCellRange);
        break;
    }
    if(newObj) {
      var tl = FormulaUtils.cellRowAndColNumsToRef({
        rowNum: newObj.adjustedObj.minRowIdx + 1,
        colNum: newObj.adjustedObj.minColIdx + 1});
      var br = FormulaUtils.cellRowAndColNumsToRef({
        rowNum: newObj.adjustedObj.maxRowIdx + 1,
        colNum: newObj.adjustedObj.maxColIdx + 1});

      return {
        topLeft: tl,
        bottomRight: br
      };
    }
  };

  /**
   * A data region is a range of cells that contains data and that is bounded
   * by empty cells or datasheet border. Merge cells with data defines the data
   * region even if it is not bounded by empty cells.
   *
   * This method returns the offset that needs to be added to the current
   * selected index so that the selection moves to the edge of the data region.
   * The offset is calculated based on direction.
   *
   * @param {string} direction - one of 'up', 'down', 'left' or 'right'
   * @return {number} - edge cell index offset depending on direction
   */
  var _getEdgeIndexOffsetForDataRegion = function(direction) {
    var selection = SheetSelectionManager.getCurrentSelection();
    var colIdx = selection.anchor.colIdx;
    var rowIdx = selection.anchor.rowIdx;
    var column = _mainPane.getColumn(colIdx);
    var row = _mainPane.getRow(rowIdx);
    var maxRows = _mainPane.getNumOfRows();
    var maxCols = _mainPane.getNumOfCols();

    switch (direction) {
      case 'up':
        return _getPreviousEdgeCellIndex(column.getCells(), rowIdx);
      case 'down':
        return _getNextEdgeCellIndex(column.getCells(), rowIdx, maxRows);
      case 'left':
        return _getPreviousEdgeCellIndex(row.getCells(), colIdx);
      case 'right':
        return _getNextEdgeCellIndex(row.getCells(), colIdx, maxCols);
    }
  };

  /**
   * This method finds out offset for next edge cell index and is called when
   * selection moves forward (using ctrl/cmd + down or right).
   * If the current selection is not at the end of the data region then the
   * selection moves to the end of the data region. If the selection is at the
   * end of the data region, the selection moves to the start of the next data
   * region.
   *
   * @param {Array.<Object>} cells - array of cell objects.
   * @param {number} currentIndex - current selection index, row index if the
   *                                direction is down and column index if the
   *                                direction is right.
   * @param {number} maxIndex - max number of rows(in case of down direction)
   *                            or max number of columns (in case of right
   *                            direction).
   * @return {number} - offset from the current selected index to the edge of
   *                    the data region.
   */
  var _getNextEdgeCellIndex = function(cells, currentIndex, maxIndex) {
    if (_isTextInCurrentAndNextCell(cells, currentIndex)) {
      return _findLastIndexOfDataRegion(cells, currentIndex);
    } else {
      return _findStartOfNextDataRegion(cells, currentIndex, maxIndex);
    }
  };

  /**
   * This method finds out offset for previous edge cell index and is called
   * when selection moves backward (using ctrl/cmd + up or left).
   * If the current selection is not at the start of the data region then the
   * selection moves to the start of the data region. If the selection is at the
   * start of the data region, the selection moves to the end of the previous
   * data region.
   *
   * @param {Array.<Object>} cells - array of cells.
   * @param {number} currentIndex - current selection index, row index if the
   *                                direction is up and column index if the
   *                                direction is left.
   * @return {number} - offset from the current selected index to the edge of
   *                    the data region.
   */
  var _getPreviousEdgeCellIndex = function(cells, currentIndex) {
    if (_isTextInCurrentAndPrevCell(cells, currentIndex)) {
      return _findFirstIndexOfBlock(cells, currentIndex);
    } else {
      return _findEndOfPrevDataRegion(cells, currentIndex);
    }
  };

  /**
   * Starting from the current selected index, this methods goes in forward
   * direction and finds out the offset from the current selected index to the
   * end of the current data region.
   *
   * @param {Array.<Object>} cells - array of cells.
   * @param {number} currentIndex - current selected index.
   * @return {number} - offset between current selected index and the end of
   *                    the current data region.
   */
  var _findLastIndexOfDataRegion = function(cells, currentIndex) {
    var lastIndex;
    for (var i = currentIndex; i < cells.length; i++) {
      //if the next cell is undefined(when not merged) or is empty(when merged)
      // then the current cell is edge cell.
      if (!cells[i + 1] || ! cells[i + 1].cellText) {
        lastIndex = i;
        break;
      }
    }
    return lastIndex - currentIndex;
  };

  /**
   * Starting from the current selected index, this methods goes in forward
   * direction and finds out the offset from the current selected index to the
   * start of the next data region.
   *
   * @param {Array.<Object>} cells - array of cells.
   * @param {number} currentIndex - current selected index.
   * @param {number} maxIndex - max number of cells available in the row/column
   * @return {number} - offset between current selected index and the start of
   *                    next data region.
   */
  var _findStartOfNextDataRegion = function(cells, currentIndex, maxIndex) {
    var nextIndex;
    for (var i = currentIndex + 1; i < cells.length; i++) {
      if (cells[i] && cells[i].cellText) {
        nextIndex = i;
        break;
      }
    }
    //If we don't find a defined cell, move the index to the end of the sheet.
    if (!nextIndex) {
      nextIndex = maxIndex - 1;
    }
    return nextIndex - currentIndex;
  };

  /**
   * Starting from the current selected index, this methods goes in backward
   * direction and finds out the offset from the current selected index to the
   * start of the current data region.
   *
   * @param {Array.<Object>} cells - array of cells.
   * @param {number} currentIndex - current selected index.
   * @return {number} - offset between current selected index and the start of
   *                    the current data region.
   */
  var _findFirstIndexOfBlock = function(cells, currentIndex) {
    var firstIndex;
    for (var i = currentIndex; i >= 0; i--) {
      // if the previous cell is undefined(when not merged) or is empty (when
      // merged) then the current cell is edge cell.
      if (!cells[i - 1] || !cells[i - 1].cellText) {
        firstIndex = i;
        break;
      }
    }
    return firstIndex - currentIndex;
  };

  /**
   * Starting from the current selected index, this methods goes in backward
   * direction and finds out the offset from the current selected index to the
   * end of the previous data region.
   *
   * @param {Array.<Object>} cells - array of cells.
   * @param {number} currentIndex - current selected index.
   * @return {number} - offset between current selected index and the end of
   *                    previous data region.
   */
  var _findEndOfPrevDataRegion = function(cells, currentIndex) {
    var previousIndex;
    for (var i = currentIndex; i >= 0; i--) {
      if (cells[i - 1] && cells[i - 1].cellText) {
        previousIndex = i - 1;
        break;
      }
    }
    // If we don't find the non empty defined cell, move the index to the first
    // cell.
    if (!previousIndex) {
      previousIndex = 0;
    }
    return previousIndex - currentIndex;
  };

  /**
   * Check if current cell and next cell has data or not.
   *
   * @param {Array.<Object>} cells - array of cells
   * @param {number} currentIndex - current selection index, row index if the
   *                                direction is up and column index if the
   *                                direction is left.
   * @return {boolean} - 'true' if current cell and next cell has data.
   */
  var _isTextInCurrentAndNextCell = function(cells, currentIndex) {
    return (cells[currentIndex] && cells[currentIndex + 1] &&
      cells[currentIndex].cellText && cells[currentIndex + 1].cellText);
  };

  /**
   * Check if current cell and previous cell has data or not.
   *
   * @param {Array.<Object>} cells - array of cells
   * @param {number} currentIndex - current selection index, row index if the
   *                                direction is up and column index if the
   *                                direction is left.
   * @return {boolean} - 'true' if current cell and previous cell has data.
   */
  var _isTextInCurrentAndPrevCell = function(cells, currentIndex) {
    return (cells[currentIndex] && cells[currentIndex - 1] &&
      cells[currentIndex].cellText && cells[currentIndex - 1].cellText);
  };

  /**
   * There are multiple actions through which user can select an entire
   * sheet, row/s and column/s. The object prepared for each selection, by
   * each action was different. This was creating inconsistency in selection
   * object representation. In order to maintain the uniformity in
   * representation, selection object will be updated based on selection type.
   *
   * @param {Object} adjustedObj - adjusted object
   * @param {Object} selectedObj - actual selected object
   * @returns {Object} - uniform selection object
   * @private
   */
  var createUniformSelectionObject_ = function(adjustedObj, selectedObj) {
    var maxRowIdx = adjustedObj.maxRowIdx,
        minRowIdx = adjustedObj.minRowIdx,
        maxColIdx = adjustedObj.maxColIdx,
        minColIdx = adjustedObj.minColIdx;
    var totalRows = _mainPane.getNumOfRows(),
        totalCols = _mainPane.getNumOfCols();

    // When user selects a row by clicking on 1st cell and last cell of a
    // row while shift key is pressed. Or, clicking on first cell of row and
    // scroll up to the last cell of that row to select the whole row.
    // Similarly, column can be selected.
    // Below flags are calculated to know if user has selected row/column/sheet
    // by such an action.
    var isRowSelected = (maxColIdx - minColIdx + 1) === totalCols;
    var isColumnSelected = (maxRowIdx - minRowIdx + 1) === totalRows;

    var isEntireSheetSelected = isRowSelected && isColumnSelected;

    // Creating uniform representation for selection object based on the
    // selection type(entire sheet/row/column).
    if (isEntireSheetSelected) {
      selectedObj.topLeft = {rowIdx: undefined, colIdx: undefined};
      selectedObj.bottomRight = {rowIdx: undefined, colIdx: undefined};
    } else if (isRowSelected) {
      selectedObj.topLeft.colIdx = undefined;
      selectedObj.bottomRight.colIdx = undefined;
    } else if (isColumnSelected) {
      selectedObj.topLeft.rowIdx = undefined;
      selectedObj.bottomRight.rowIdx = undefined;
    }


    return selectedObj;
  };

  return _api;
});
