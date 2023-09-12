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
 * Col Header Container
 * ==============
 *
 * The col header container widget encapsulates the part of the HTML DOM
 * representing a workbook that displays header cells for each column.
 *
 * This is a singleton
 *
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/search',
  'qowtRoot/widgets/grid/verticalLine',
  'qowtRoot/widgets/grid/colResizeHandle',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/controls/grid/selectionGestureHandler',
  'qowtRoot/utils/sheet-lo-dash'
  ], function(
    PubSub,
    SheetModel,
    SheetConfig,
    DOMListener,
    DOMUtils,
    SearchUtils,
    VerticalLine,
    ColResizeHandle,
    SheetSelectionManager,
    SelectionGestureHandler
    /*sheet-lo-dash*/) {

  'use strict';

  var _container,
  _cntPosition,
  _cntScrollOffset,
  _containerFrozenHeaders,
  _frozenLine,
  _resizingLine,
  _colResizeHandle,
  _selectedHeaderIndex = null,
  _resizeThresholdMet,
  _resizeThreshold = SheetConfig.ColRowResizeHitArea/2,
  _destroyToken,
  _kMouseRightButtonId = 2,

  _api = {

    /**
     * Initialise the singleton - this is a public API so that
     * we do not initialise on loading this singleton; since
     * we currently load all JS in QOWT, which means we would
     * otherwise initialise HTML elements even when not needed
     * for example when running word or point rather than sheet
     */
    init: function() {

      if (_destroyToken) {
        throw new Error('colHeaderContainer.init() called multiple times.');
      }

      _constructHTML();
      DOMListener.addListener(_container, 'mousedown', _onMouseDown, false);
      DOMListener.addListener(_container, 'mousemove', _detectGridline, false);
      DOMListener.addListener(_container, 'mouseout', _onMouseOut, false);

      DOMListener.addListener(_containerFrozenHeaders, 'mousedown',
          _onMouseDown, false);
      DOMListener.addListener(_containerFrozenHeaders, 'mousemove',
          _detectGridline, false);
      DOMListener.addListener(_containerFrozenHeaders, 'mouseout',
          _onMouseOut, false);
      _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
    },

    /**
     * Remove the html elements from their parents and destroy all references.
     */
    destroy: function() {

      if (_container && _container.parentNode) {
        DOMListener.removeListener(_container, 'resize', _onMouseDown);
        DOMListener.removeListener(_container, 'mousemove', _detectGridline);
        DOMListener.removeListener(_container, 'mouseout', _onMouseOut);
        _container.parentNode.removeChild(_container);
      }

      if (_containerFrozenHeaders && _containerFrozenHeaders.parentNode) {
        DOMListener.removeListener(_containerFrozenHeaders, 'mousedown',
            _onMouseDown);
        DOMListener.removeListener(_containerFrozenHeaders, 'mousemove',
            _detectGridline);
        DOMListener.removeListener(_containerFrozenHeaders, 'mouseout',
            _onMouseOut);
        _containerFrozenHeaders.parentNode.removeChild(_containerFrozenHeaders);
      }
      PubSub.unsubscribe(_destroyToken);
      _tearDownHTML();
    },

    /**
     * append the main container div to the given html node
     *
     * @param node {HTMLElement} node to append ourselves to
     */
    appendTo: function(node) {
        _resizingLine.appendTo(node);
        node.appendChild(_container);
        node.appendChild(_containerFrozenHeaders);
    },

    /**
     * returns the container for other widgets to append themselves
     * to;
     */
    container: function() {
      return _container;
    },

    /**
     * returns the frozen container for other widgets to append themselves
     * to;
     */
    frozenContainer: function() {
      return _containerFrozenHeaders;
    },

    /**
     * scroll the col headers over the Y-axis; used during scrolling of the grid
     *
     * @param offsetX {number} number of pixels to move over X-axis
     */
    scroll: function(offsetX) {
      var scrollLeft = Math.max(_container.scrollLeft - offsetX, 0);
      _container.scrollLeft = scrollLeft;
    },

    setScrollPos: function(scrollPos) {
      _container.scrollLeft = scrollPos;
    },

    /**
     * Set the position and size of the header widget
     *
     * @param position {number} x coordinate of the header widget
     * @param height {number} height of the header widget
     */
    setExtent: function(/* position, height */) {

    },

    /**
     * remove the headers inside the frozen container and hide the empty
     * container
     */
    removeFrozen: function() {
      // note: cells are added to the zoom div; so remove its children
      // JELTE TODO: this black magic about knowing the class of
      // a vertical line is crap.  What really should happen is that frozen
      // header cells get "attached" to this header widget, so that we can
      // loop through that array and delete them; not randomly go through
      // html elements

      //Remove all the children except the
      // qowt-sheet-frozen-header-line-vertical.
      var childNodes = _containerFrozenHeaders.childNodes;
      var length = childNodes.length;
      for(var i = 0, childNo = 0; i < length; i++) {
          if (childNodes[childNo].classList.contains(
              'qowt-sheet-frozen-header-line-vertical')) {
              childNo++;
          } else {
              _containerFrozenHeaders.removeChild(childNodes[childNo]);
          }
      }
      _api.setFrozenContainerVisible(false);
    },

    /**
     * Makes the frozen container visible or hides it.
     * @param visible - if true, the frozen container is visible, if false then
     * it is hidden.
     * @method - setFrozenContainerVisible(visible)
     */
    setFrozenContainerVisible: function(visible) {
      if (visible) {
        _containerFrozenHeaders.style.visibility = 'visible';
      } else {
        _containerFrozenHeaders.style.visibility = 'hidden';
      }
    },

    /**
     * Sets the width of the frozen container.
     * @param width - width to set in pixels.
     * @method - setFrozenContainerWidth(width)
     */
    setFrozenContainerWidth: function(width) {
      if (width !== undefined) {
        _containerFrozenHeaders.style.width = width + "px";
      }
    },

    /**
     * returns currently selected column header Index.
     * index is used only when user has clicked mouse down on top of col header.
     *
     * @return {number} index of the mouse target
     */
    mouseTargetHeaderIndex: function() {
      return _selectedHeaderIndex;
    },

    /**
     * Sets the column header index.
     * @param index - column index.
     */
    setColHeaderIndex: function(index) {
      _selectedHeaderIndex = index;
    },

    /**
     * Returns true if the cursor style is resize , otherwise false.
     * @return {boolean}  - true if cursor style is resize, otherwise false.
     */
    isMouseCursorStyleResize: function() {
      return ((_container.style.cursor === 'col-resize') || (_container.style.
        cursor === 'e-resize'));
    }
  };

  /**
   * Resets everything which is initialized in init method.
   * @private
   */
  var _tearDownHTML = function() {
    if (_frozenLine) {
      _frozenLine.destroy();
    }
    if (_resizingLine) {
      _resizingLine.destroy();
    }
    if (_colResizeHandle) {
      _colResizeHandle.destroy();
    }

    _destroyToken = undefined;
    _container = undefined;
    _containerFrozenHeaders = undefined;
    _frozenLine = undefined;
    _colResizeHandle = undefined;
  };

  function _constructHTML() {
    //create the colHeaderContainer
    _container = document.createElement('div');
    _container.className = "qowt-sheet-col-header-container";
    _container.style.position = 'absolute';
    // NOTE: we need to set the scrollbar width/height to zero but that is done
    // in sheet.css
    _container.style.overflow = 'hidden';
     _container.style.left = "40px";

    _containerFrozenHeaders = document.createElement('div');
    _containerFrozenHeaders.className =
        "qowt-sheet-frozen-col-header-container";
    _containerFrozenHeaders.style.position = 'absolute';
    _containerFrozenHeaders.style.visibility = 'hidden';
    _containerFrozenHeaders.style.width = "0px";
     _containerFrozenHeaders.style.left = "40px";
    _frozenLine = VerticalLine.create("qowt-sheet-frozen-header-line-vertical");
    _frozenLine.appendTo(_containerFrozenHeaders);

    _resizingLine = VerticalLine.create("qowt-sheet-resizing-line-vertical");

    _colResizeHandle = ColResizeHandle.create();
    _colResizeHandle.appendTo(_container);
  }

  function _detectGridline(event) {
    var x;

    _resizeThresholdMet = false;

    _container.style.cursor = "pointer";
    _containerFrozenHeaders.style.cursor = "pointer";

    _cntPosition = DOMUtils.absolutePos(event.currentTarget);

    x = event.zoomedX - _cntPosition.left+ event.currentTarget.scrollLeft;

    // find the gridline position to the left of our mouse down x
    var colPosToTheLeftOfHit =
        SearchUtils.array.binSearch(SheetModel.ColPos, x, "low");
    var colPosToTheRightOfHit = colPosToTheLeftOfHit + 1;

    // check distance to that gridline and see if it is within our threshold
    var distanceToLeftColPos = (x - SheetModel.ColPos[colPosToTheLeftOfHit]);
    var distanceToRightColPos = (SheetModel.ColPos[colPosToTheRightOfHit] - x);

    _colResizeHandle.setVisible(false);
    _selectedHeaderIndex = colPosToTheLeftOfHit;

    // check if either left/right colPos is within our threshold for
    // resizing EXCEPT if the left colPos is zero since you can't
    // resize the left side of the first column
    if(distanceToLeftColPos < _resizeThreshold && colPosToTheLeftOfHit !== 0) {
      // hit success on left gridline
      var tempIndex = colPosToTheLeftOfHit - 1;
      if(SheetModel.ColWidths[tempIndex] < 7){
        _selectedHeaderIndex = tempIndex;
        _resizeThresholdMet = true;
        _container.style.cursor = "col-resize";
        _containerFrozenHeaders.style.cursor = "col-resize";
      }
    } else if (distanceToRightColPos < _resizeThreshold) {
      // hit success on the right gridline
      _selectedHeaderIndex = colPosToTheRightOfHit - 1;
      _resizeThresholdMet = true;
      _container.style.cursor = "e-resize";
      _containerFrozenHeaders.style.cursor = "e-resize";
      // Position and show column resize handle
      _colResizeHandle.setLeftPosition(SheetModel.ColPos[colPosToTheLeftOfHit] +
        SheetModel.ColWidths[colPosToTheLeftOfHit] -
        SheetConfig.kGRID_GRIDLINE_WIDTH * 8);
      _colResizeHandle.setVisible(true);
    }
  }

  function _onMouseOut(){
    _colResizeHandle.setVisible(false);
  }

  function _onMouseDown(event) {
    _detectGridline(event);
    DOMListener.removeListener(_container, 'mousemove', _detectGridline);
    DOMListener.removeListener(_container, 'mouseout', _onMouseOut);

    DOMListener.removeListener(_containerFrozenHeaders, 'mousemove',
        _detectGridline);
    DOMListener.removeListener(_containerFrozenHeaders, 'mouseout',
        _onMouseOut);

    _cntScrollOffset = DOMUtils.absoluteScroll(event.currentTarget);

    if (_cntPosition === undefined) {
      _cntPosition = DOMUtils.absolutePos(event.currentTarget);
    }

    var x = event.zoomedX - _cntPosition.left +
        event.currentTarget.scrollLeft;

    if (_resizeThresholdMet) {
      _resizingLine.setVisible(true);
      _resizingLine.setLeftPosition(parseInt(event.zoomedX, 10));

      _colResizeHandle.setVisible(true);
      _colResizeHandle.setLeftPosition(parseInt(x, 10) -
          SheetConfig.kGRID_GRIDLINE_WIDTH * 8);

      DOMListener.addListener(document, 'mousemove',
          _onMouseMoveResize, false);
    } else {
      var curSel = SheetSelectionManager.getCurrentSelection();
      if (_canClickBeHandledWithSelection(curSel)) {

        if (event.button === _kMouseRightButtonId) {
          _handleRightClick(curSel);
        }
        else {
          _handleLeftClick(event, curSel);
        }
      }
      DOMListener.addListener(document, 'mousemove',
          _onMouseMoveSelect, false);
    }
    DOMListener.addListener(document, 'mouseup',
        _onMouseUp, false);
  }


  /**
   * Checks if a click on column header can be handled with the current
   * selection.
   *
   * @param {Object} selection - current selection in workbook.
   * @return {boolean} - True if click can be handled false otherwise.
   * @private
   */
  function _canClickBeHandledWithSelection(selection) {
    return (!selection || !selection.topLeft || !selection.bottomRight ||
            (selection.topLeft.colIdx !== _selectedHeaderIndex ||
            selection.bottomRight.colIdx !== _selectedHeaderIndex ||
            selection.bottomRight.rowIdx !== undefined ||
            selection.topLeft.rowIdx !== undefined));
  }


  /**
   * Handles left click on the header container. It considers changing the
   * current anchor based on
   *  1) Shift key being held while clicking.
   *  2) Sheet been scrolled when clicked.
   *
   * @param {Object} event - The mouse down event.
   * @param {Object} currentSelection - The current selection.
   * @private
   */
  function _handleLeftClick(event, currentSelection) {
    var anchor = currentSelection && currentSelection.anchor;

    // handle shift + click to select column range, crbug 288610.
    if (event.shiftKey && anchor && anchor.colIdx !== undefined) {

      var from = Math.min(anchor.colIdx, _selectedHeaderIndex);
      var to = Math.max(anchor.colIdx, _selectedHeaderIndex);
      _publishSelection(from, to, anchor.rowIdx, anchor.colIdx);
    } else {

      // When column header is clicked without shift key being held, the top
      // most cell of the column in the view-port should be the anchor cell.
      // If we are unable to decipher the top most visible row then fall back
      // to '0'.
      var topMostRow = SelectionGestureHandler.getTopMostVisibleRowIdx();
      topMostRow = _.isValidIdx(topMostRow) ? topMostRow : 0;
      _publishSelection(_selectedHeaderIndex /*from col*/, _selectedHeaderIndex,
          topMostRow /* anchor row */, _selectedHeaderIndex /* anchor col */);
    }
  }


  function _handleRightClick(curSel) {
    var col = _selectedHeaderIndex;
    if (!SelectionGestureHandler.isEntireSheetSelected() &&
        !_isColPartOfSelection(col, curSel)) {
      _publishSelection(col, col, 0, col);
    }
  }

  function _isColPartOfSelection(col, curSel) {
    return SelectionGestureHandler.isOneOrMoreColumnsSelected() &&
        (col >= curSel.topLeft.colIdx && col <= curSel.bottomRight.colIdx);
  }

  function _onMouseMoveResize(event) {
    var x = event.zoomedX - _cntPosition.left + _cntScrollOffset.left;

    x = Math.max(x, SheetModel.ColPos[_selectedHeaderIndex]);

    _resizingLine.setLeftPosition(x + _cntPosition.left -
      _cntScrollOffset.left);
    _colResizeHandle.setLeftPosition(parseInt(x, 10) -
        SheetConfig.kGRID_GRIDLINE_WIDTH * 8);
  }

  function _onMouseMoveSelect(event) {
    var x = event.zoomedX - _cntPosition.left + _cntScrollOffset.left,
        a = SheetModel.ColPos[_selectedHeaderIndex],
        b = SheetModel.ColWidths[_selectedHeaderIndex],
        from = _selectedHeaderIndex,
        to = _selectedHeaderIndex;
    if(x<a) {
      from = SearchUtils.array.binSearch(SheetModel.ColPos, x, "low");
    }
    if(x>a+b) {
      to = SearchUtils.array.binSearch(SheetModel.ColPos, x, "low");
    }

    var curSel = SheetSelectionManager.getCurrentSelection(),
      ancCol = 0, ancRow = 0;
    if(curSel && curSel.anchor) {
      ancCol = curSel.anchor.colIdx;
      ancRow = curSel.anchor.rowIdx;
    }
    if (curSel && (curSel.contentType === 'sheetCell')) {
      if (!curSel.topLeft || !curSel.bottomRight ||
        (curSel.topLeft.colIdx !== from || curSel.bottomRight.colIdx !== to)) {
        _publishSelection(from, to, ancRow, ancCol);
      }
    }
  }

  /**
   * Publishes a new column selection
   *
   * @param from {number} 'from column' index
   * @param to {number} 'to column' index
   * @param ancRow {number} anchor cell row index
   * @param ancCol {number} anchor cell column index
   */
  function _publishSelection(from, to, ancRow, ancCol) {
    var obj = {
      anchor: {rowIdx: ancRow, colIdx: ancCol},
      topLeft: {colIdx: from},
      bottomRight: {colIdx: to},
      contentType: "sheetCell"
    };
    PubSub.publish("qowt:sheet:requestColumnFocus", obj);
  }

  function _onMouseUp(event) {
    if(_resizeThresholdMet) {
      var x = event.zoomedX - _cntPosition.left + _cntScrollOffset.left,
        deltaX = x - (SheetModel.ColPos[_selectedHeaderIndex] +
            SheetModel.ColWidths[_selectedHeaderIndex]);

      _resizeThresholdMet = false;

      deltaX =
          Math.max((-1 * SheetModel.ColWidths[_selectedHeaderIndex]), deltaX);

      if ((SheetModel.ColWidths[_selectedHeaderIndex] + deltaX) < 0) {
        deltaX = -(SheetModel.ColWidths[_selectedHeaderIndex]);
      }

      PubSub.publish('qowt:doAction', {
        'action': 'resizeColumn',
        'context': {
          contentType: 'sheetColumn',
          colIndex: _selectedHeaderIndex,
          deltaX: deltaX
        }
      });

      _selectedHeaderIndex = null;

      _resizingLine.setVisible(false);
      _colResizeHandle.setVisible(false);
      DOMListener.removeListener(document, 'mousemove',
          _onMouseMoveResize);
    } else {
      DOMListener.removeListener(document, 'mousemove',
          _onMouseMoveSelect);
    }
    DOMListener.removeListener(document, 'mouseup', _onMouseUp);
    DOMListener.addListener(_container, 'mousemove', _detectGridline, false);
    DOMListener.addListener(_container, 'mouseout', _onMouseOut, false);

    DOMListener.addListener(_containerFrozenHeaders, 'mousemove',
        _detectGridline, false);
    DOMListener.addListener(_containerFrozenHeaders, 'mouseout',
        _onMouseOut, false);
  }

  return _api;
});
