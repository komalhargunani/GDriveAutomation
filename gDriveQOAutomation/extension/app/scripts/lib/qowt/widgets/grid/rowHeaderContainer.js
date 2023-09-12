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
 * Row Header Container
 * ==============
 *
 * The row header container widget encapsulates the part of the HTML DOM
 * representing a workbook that displays header cells for each row.
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
  'qowtRoot/widgets/grid/horizontalLine',
  'qowtRoot/widgets/grid/rowResizeHandle',
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
    HorizontalLine,
    RowResizeHandle,
    SheetSelectionManager,
    SelectionGestureHandler
    /*sheet-lo-dash*/) {

  'use strict';


  var _container,
      _containerFrozenHeaders,
      _frozenLine,
      _cntPosition,
      _cntScrollOffset,
      _resizingLine,
      _rowResizeHandle,
      _selectedHeaderIndex = null,
      _resizeThresholdMet,
      _resizeThreshold = SheetConfig.ColRowResizeHitArea / 2,
      _destroyToken,
      _domListenerId = 'rowHeaderContainer',
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
            throw new Error('rowHeaderContainer.init() called multiple times.');
          }

          _constructHTML();
          DOMListener.add(_domListenerId, _container, 'mousedown', _onMouseDown,
              false);
          DOMListener.add(_domListenerId, _container, 'mousemove',
              _detectGridline, false);
          DOMListener.add(_domListenerId, _container, 'mouseout', _onMouseOut,
              false);

          DOMListener.add(_domListenerId, _containerFrozenHeaders, 'mousedown',
              _onMouseDown, false);

          DOMListener.add(_domListenerId, _containerFrozenHeaders, 'mousemove',
              _detectGridline, false);

          DOMListener.add(_domListenerId, _containerFrozenHeaders, 'mouseout',
              _onMouseOut, false);

          _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
        },

        /**
         * Remove the html elements from their parents and destroy all
         * references.
         */
        destroy: function() {

          if (_destroyToken) {
            DOMListener.removeGroup(_domListenerId);
          }

          if (_container && _container.parentNode) {
            _container.parentNode.removeChild(_container);
          }

          if (_containerFrozenHeaders && _containerFrozenHeaders.parentNode) {
            _containerFrozenHeaders.parentNode.removeChild(
                _containerFrozenHeaders);
          }
          PubSub.unsubscribe(_destroyToken);
          _tearDownHTML();
        },

        /**
         * append the main container div to the given html node
         *
         * @param {HTMLElement} node Node to append ourselves to
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
         * scroll the row headers over the Y-axis; used during scrolling of
         * the grid
         *
         * @param {number} offsetY number of pixels to move over Y-axis
         */
        scroll: function(offsetY) {
          var scrollTop = Math.max(_container.scrollTop - offsetY, 0);
          _container.scrollTop = scrollTop;
        },

        setScrollPos: function(scrollPos) {
          _container.scrollTop = scrollPos;
        },

        /**
         * Set the position and size of the header widget
         *
         * @param {number} poisiton y coordinate of the header widget
         * @param {number} width Width of the header widget
         */
        setExtent: function(/* position, width */) {

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
          //qowt-sheet-frozen-header-line-horizontal.
          var childNodes = _containerFrozenHeaders.childNodes;
          var length = childNodes.length;
          for (var i = 0, childNo = 0; i < length; i++) {
            if (childNodes[childNo].classList.contains(
                'qowt-sheet-frozen-header-line-horizontal')) {
              childNo++;
            } else {
              _containerFrozenHeaders.removeChild(childNodes[childNo]);
            }
          }
          _api.setFrozenContainerVisible(false);
        },
        /**
         * Makes the frozen container visible or hides it.
         * @param {boolean} visible - if true, the frozen container is visible,
         *                  if false then it is hidden.
         */
        setFrozenContainerVisible: function(visible) {
          if (visible) {
            _containerFrozenHeaders.style.visibility = 'visible';
          } else {
            _containerFrozenHeaders.style.visibility = 'hidden';
          }
        },

        /**
         * Sets the height of the frozen container.
         * @param {number} height - height to set in pixels.
         */
        setFrozenContainerHeight: function(height) {
          if (height !== undefined) {
            _containerFrozenHeaders.style.height = height + 'px';
          }
        },

        /**
         * returns currently selected row header Index.
         * index is used only when user has clicked mouse down on top of row
         * header.
         *
         * @return {number} index of the mouse target
         */
        mouseTargetHeaderIndex: function() {
          return _selectedHeaderIndex;
        },

        /**
         * Sets the row header index.
         * @param index - row index.
         */
        setRowHeaderIndex: function(index) {
          _selectedHeaderIndex = index;
        },


        /**
         * Returns true if the cursor style is resize , otherwise false.
         * @return {boolean}  - true if cursor style is resize, otherwise false.
         */
        isMouseCursorStyleResize: function() {
          return ((_container.style.cursor === 'row-resize') ||
            (_container.style.cursor === 'n-resize'));
        }
      };

  function _constructHTML() {
    _container = document.createElement('div');
    _container.className = 'qowt-sheet-row-header-container';
    _container.style.position = 'absolute';
    // NOTE: we need to set the scrollbar width/height to zero but
    // that is done in sheet.css
    _container.style.overflow = 'hidden';
    _container.style.top = '18px';  // over rides the styling in sheet.css file

    _containerFrozenHeaders = document.createElement('div');
    _containerFrozenHeaders.className =
        'qowt-sheet-frozen-row-header-container';
    _containerFrozenHeaders.style.position = 'absolute';
    _containerFrozenHeaders.style.visibility = 'hidden';
    _containerFrozenHeaders.style.height = '0px';
    // over rides the styling in sheet.css file
    _containerFrozenHeaders.style.top = '18px';
    _frozenLine =
        HorizontalLine.create('qowt-sheet-frozen-header-line-horizontal');
    _frozenLine.appendTo(_containerFrozenHeaders);

    _resizingLine =
        HorizontalLine.create('qowt-sheet-resizing-line-horizontal');

    _rowResizeHandle = RowResizeHandle.create();
    _rowResizeHandle.appendTo(_container);

  }

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
    if (_rowResizeHandle) {
      _rowResizeHandle.destroy();
    }

    _destroyToken = undefined;
    _container = undefined;
    _containerFrozenHeaders = undefined;
    _frozenLine = undefined;
    _rowResizeHandle = undefined;
  };

  function _detectGridline(event) {
    var y;

    _resizeThresholdMet = false;

    _container.style.cursor = 'pointer';
    _containerFrozenHeaders.style.cursor = 'pointer';

    _cntPosition = DOMUtils.absolutePos(event.currentTarget);

    y = event.zoomedY - _cntPosition.top + event.currentTarget.scrollTop;

    // find the gridline position before our mouse down x
    var rowPosToTheTopOfHit =
        SearchUtils.array.binSearch(SheetModel.RowPos, y, 'low');
    var rowPosToTheBottomOfHit = rowPosToTheTopOfHit + 1;

    // check distance to that gridline and see if it is within our threshold
    var distanceToTopRowPos = (y - SheetModel.RowPos[rowPosToTheTopOfHit]);
    var distanceToBottomColPos =
        (SheetModel.RowPos[rowPosToTheBottomOfHit] - y);

    _rowResizeHandle.setVisible(false);
    _selectedHeaderIndex = rowPosToTheTopOfHit;

    // check if either top/bottom rowPos is within our threshold for
    // resizing EXCEPT if the top rowPos is zero since you can't
    // resize the top side of the first row
    if (distanceToTopRowPos < _resizeThreshold && rowPosToTheTopOfHit !== 0) {
      // hit success on grid line before
      var tempIndex = rowPosToTheTopOfHit - 1;
      if (SheetModel.RowHeights[tempIndex] < 7) {
        _selectedHeaderIndex = tempIndex;
        _resizeThresholdMet = true;
        _container.style.cursor = 'row-resize';
        _containerFrozenHeaders.style.cursor = 'row-resize';
      }
    } else if (distanceToBottomColPos < _resizeThreshold) {
      // hit success on grid line after
      _selectedHeaderIndex = rowPosToTheBottomOfHit - 1;
      _resizeThresholdMet = true;
      _container.style.cursor = 'n-resize';
      _containerFrozenHeaders.style.cursor = 'n-resize';
      // Position and show up row resize handle
      _rowResizeHandle.setBottomPosition(
          SheetModel.RowPos[rowPosToTheBottomOfHit]);
      _rowResizeHandle.setVisible(true);
    }
  }

  function _onMouseOut() {
    _rowResizeHandle.setVisible(false);
  }

  function _onMouseDown(event) {
    _detectGridline(event);
    DOMListener.removeListener(_container, 'mousemove', _detectGridline);
    DOMListener.removeListener(_container, 'mouseout', _onMouseOut);

    DOMListener.removeListener(_containerFrozenHeaders,
        'mousemove', _detectGridline);
    DOMListener.removeListener(_containerFrozenHeaders,
        'mouseout', _onMouseOut);

    _cntScrollOffset = DOMUtils.absoluteScroll(event.currentTarget);

    if (_cntPosition === undefined) {
      _cntPosition = DOMUtils.absolutePos(event.currentTarget);
    }

    var y = event.zoomedY - _cntPosition.top + event.currentTarget.scrollTop;

    if (_resizeThresholdMet) {
      _resizingLine.setVisible(true);
      _resizingLine.setTopPosition(parseInt(event.zoomedY - _cntPosition.top +
          _container.offsetTop, 10));

      _rowResizeHandle.setVisible(true);
      _rowResizeHandle.setBottomPosition(parseInt(y, 10));

      DOMListener.addListener(document,
          'mousemove', _onMouseMoveResize, false);
    } else { // We are selecting the row
      var curSel = SheetSelectionManager.getCurrentSelection();
      if (_canClickBeHandledWithSelection(curSel)) {

        if (event.button === _kMouseRightButtonId) {
          _handleRightClick(curSel);
        }
        else {
          _handleLeftClick(event, curSel);
        }
      }
      DOMListener.addListener(document,
          'mousemove', _onMouseMoveSelect, false);
    }
    DOMListener.addListener(document, 'mouseup', _onMouseUp, false);
  }


  /**
   * Checks if a click on row header can be handled with the current selection.
   *
   * @param {Object} selection - current selection in workbook.
   * @return {boolean} - True if click can be handled false otherwise.
   * @private
   */
  function _canClickBeHandledWithSelection(selection) {
    return (!selection || !selection.topLeft || !selection.bottomRight ||
            (selection.topLeft.rowIdx !== _selectedHeaderIndex ||
            selection.bottomRight.rowIdx !== _selectedHeaderIndex ||
            selection.bottomRight.colIdx !== undefined ||
            selection.topLeft.colIdx !== undefined));
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

    // handle shift + click to select row range, crbug 288610.
    if (event.shiftKey && anchor && anchor.rowIdx !== undefined) {

      var from = Math.min(anchor.rowIdx, _selectedHeaderIndex);
      var to = Math.max(anchor.rowIdx, _selectedHeaderIndex);
      _publishSelection(from, to, anchor.rowIdx, anchor.colIdx);
    } else {

      // When row header is clicked without shift key being held, the left
      // most cell of the column in the view-port should be the anchor cell.
      // If we are unable to decipher the left most visible column then fall
      // back to '0'.
      var leftMostCol = SelectionGestureHandler.getLeftMostVisibleColIdx();
      leftMostCol = _.isValidIdx(leftMostCol) ? leftMostCol : 0;
      _publishSelection(_selectedHeaderIndex /*from col*/, _selectedHeaderIndex,
          _selectedHeaderIndex /* anchor row */, leftMostCol /* anchor col */);
    }
  }


  function _handleRightClick(curSel) {
    var row = _selectedHeaderIndex;
    if (!SelectionGestureHandler.isEntireSheetSelected() &&
        !_isRowPartOfSelection(row, curSel)) {
      _publishSelection(row, row, row, 0);
    }
  }

  function _isRowPartOfSelection(row, curSel) {
    return SelectionGestureHandler.isOneOrMoreRowsSelected() &&
        (row >= curSel.topLeft.rowIdx && row <= curSel.bottomRight.rowIdx);
  }

  function _onMouseMoveResize(event) {
    var y = event.zoomedY - _cntPosition.top + _cntScrollOffset.top;

    y = Math.max(y, SheetModel.RowPos[_selectedHeaderIndex]);

    _resizingLine.setTopPosition(parseInt(y + _container.offsetTop -
        _cntScrollOffset.top, 10));
    _rowResizeHandle.setBottomPosition(parseInt(y, 10));
  }

  function _onMouseMoveSelect(event) {
    var y = event.zoomedY - _cntPosition.top + _cntScrollOffset.top,
        a = SheetModel.RowPos[_selectedHeaderIndex],
        b = SheetModel.RowHeights[_selectedHeaderIndex],
        from = _selectedHeaderIndex,
        to = _selectedHeaderIndex;
    if (y < a) {
      from = SearchUtils.array.binSearch(SheetModel.RowPos, y, 'low');
    }
    if (y > a + b) {
      to = SearchUtils.array.binSearch(SheetModel.RowPos, y, 'low');
    }

    var curSel = SheetSelectionManager.getCurrentSelection(),
        ancCol = 0, ancRow = 0;
    if (curSel && curSel.anchor) {
      ancCol = curSel.anchor.colIdx;
      ancRow = curSel.anchor.rowIdx;
    }
    if (curSel && (curSel.contentType === 'sheetCell')) {
      if (!curSel.topLeft || !curSel.bottomRight ||
        (curSel.topLeft.rowIdx !== from || curSel.bottomRight.rowIdx !== to)) {
        _publishSelection(from, to, ancRow, ancCol);
      }
    }
  }

  /**
   * Publishes a new row selection
   *
   * @param {number} from 'from row' index
   * @param {number} to 'to row' index
   * @param {number} ancRow anchor cell row index
   * @param {number} ancCol anchor cell column index
   */
  function _publishSelection(from, to, ancRow, ancCol) {
    var obj = {
      anchor: {rowIdx: ancRow, colIdx: ancCol},
      topLeft: {rowIdx: from},
      bottomRight: {rowIdx: to},
      contentType: 'sheetCell'
    };
    PubSub.publish('qowt:sheet:requestRowFocus', obj);
  }

  function _onMouseUp(event) {
    if (_resizeThresholdMet) {
      var y = event.zoomedY - _cntPosition.top + _cntScrollOffset.top,
          deltaY = y - (SheetModel.RowPos[_selectedHeaderIndex] +
          SheetModel.RowHeights[_selectedHeaderIndex]);

      _resizeThresholdMet = false;

      deltaY = Math.max((-1 *
          SheetModel.RowHeights[_selectedHeaderIndex]), deltaY);

      if ((SheetModel.RowHeights[_selectedHeaderIndex] + deltaY) < 0) {
        deltaY = -(SheetModel.RowHeights[_selectedHeaderIndex]);
      }

      PubSub.publish('qowt:doAction', {
        'action': 'resizeRow',
        'context': {
          contentType: 'sheetRow',
          rowIndex: _selectedHeaderIndex,
          deltaY: deltaY
        }
      });

      _selectedHeaderIndex = null;
      _resizingLine.setVisible(false);
      _rowResizeHandle.setVisible(false);
      DOMListener.removeListener(document, 'mousemove', _onMouseMoveResize);
    } else {
      DOMListener.removeListener(document, 'mousemove', _onMouseMoveSelect);
    }
    DOMListener.removeListener(document, 'mouseup', _onMouseUp);
    DOMListener.addListener(_container, 'mousemove', _detectGridline, false);
    DOMListener.addListener(_container, 'mouseout', _onMouseOut, false);
    DOMListener.addListener(_containerFrozenHeaders,
        'mousemove', _detectGridline, false);
    DOMListener.addListener(_containerFrozenHeaders,
        'mouseout', _onMouseOut, false);
  }

  return _api;
});
