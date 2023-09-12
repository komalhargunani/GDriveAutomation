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
 * FloaterManager
 * ==============
 *
 * A FloaterManager object serves to manage access to various 'floating'
 * widgets. Floating widgets are objects which sit visually on top of the basic
 * grid content, for example merged cells, charts & notes. Their position is
 * defined in some regard to the underlying grid, by way of (x, y) anchor cell
 * with (rowSpan, colSpan). (Finer grained pixel positions may also be used
 * within these bounds).
 *
 * It provides a set of APIs for attaining and setting information in the
 * floating widgets which the rest of the grid can make use of.
 */
define([
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet'
  ], function(SheetModel, SheetConfig) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

  /*!
   * Private data
   */
  var _floaters = [],

  _kMergedCell_Floater_Type = "sheetFloaterMergeCell",
  _widgetId = 0;

  /*!
   *
   */
  var _api = {

    /**
     * Attach the specified widget to the manager.
     * Here the specified widget is appended to the internal store of floating
     * widgets
     *
     * @param widget {object} A widget
     * @method attachWidget(widget)
     */
    attachWidget: function(widget) {
      if (widget === undefined) {
        throw ("attachWidget - missing widget parameter!");
      }
      if(widget.fmIdx === undefined) {
        widget.fmIdx = _widgetId++;
      }
      _floaters.push(widget);
    },

    /**
     * Detach the specified widget from the manager.
     * Here the specified widget is removed to the internal store of floating
     * widgets
     *
     * @param widget {object} A widget
     * @method detachWidget(widget)
     */
    detachWidget: function(widget) {
      if (widget === undefined) {
        throw ("detachWidget - missing widget parameter!");
      }
      var len = _floaters.length;
      for(var i = 0; i < len; i++) {
        if(_floaters[i].fmIdx === widget.fmIdx) {
          _floaters.splice(i, 1);
          break;
        }
      }
    },

    /**
     * Removes the floaters from the DOM.
     * Resets the internal store of floating widgets.
     *
     * @method reset()
     */
    reset: function() {
      var len = _floaters.length;
      for(var i = 0; i < len; i++) {
        _floaters[i].removeFromParent();
      }
      _floaters = [];
      _widgetId = 0;
    },

    /**
     * Returns the number of managed floating widgets.
     *
     * @return {integer}  The number of floating widgets
     * @method count()
     */
    count: function() {
      return _floaters.length;
    },

    /**
     * Returns the floating widget (floater) at the specified index.
     *
     * @return {object or undefined}  The floater at the specified index, or
     *                                undefined if no such floater exists
     * @method at()
     */
    at: function(index) {
      var retVal;
      if ((index >= 0) && (index < _floaters.length)) {
        retVal = _floaters[index];
      }
      return retVal;
    },

    /**
     * Calculates the min and max row and column indices for the given 'from-to'
     * range. If merged cell floaters are present in the given 'from-to' range
     * then the calculated min and max row and column indices may be adjusted to
     * take the merged cell floaters into account.
     *
     * @param fromRowIdx {integer} The 'from' row index
     * @param toRowIdx {integer} The 'to' row index
     * @param fromColIdx {integer} The 'from' column index
     * @param toColIdx {integer} The 'to' column index
     * @param doExpand {boolean} True if the range should be expanded to take
     *                           into account any floaters
     * @param doShrinkByRow {boolean} True if the range should be shrunk
     *                                row-wise to take into account any floaters
     * @param doShrinkByCol {boolean} True if the range should be shrunk
     *                                column-wise to take into account any
     *                                floaters
     * @return {object} The (possibly adjusted) selection range object
     * @method calculateAdjustedSelectionRange(fromRowIdx, toRowIdx, fromColIdx,
     *                                         toColIdx, doExpand,
     *                                         doShrinkByRow, doShrinkByCol)
     */
    calculateAdjustedSelectionRange: function(fromRowIdx, toRowIdx, fromColIdx,
                                              toColIdx, doExpand, doShrinkByRow,
                                              doShrinkByCol) {
      // TODO(mikkor) The number of rows or cols is capsulated inside
      // PaneManager and it would cause a circular dependecy to access it
      // from here, so let's just use local '_getMaxIndex' method.
      // It would be a good idea to move the row/col information into
      // a utility object.
      var wholeRow = false, wholeCol = false;
      if(fromRowIdx === undefined && toRowIdx === undefined) {
        wholeCol = true;
        fromRowIdx = 0;
        toRowIdx = _getMaxIndex(false);
      }
      if(fromColIdx === undefined && toColIdx === undefined) {
        wholeRow = true;
        fromColIdx = 0;
        toColIdx = _getMaxIndex(true);
      }

      var minRowIdx = Math.min(fromRowIdx, toRowIdx);
      var maxRowIdx = Math.max(fromRowIdx, toRowIdx);
      var minColIdx = Math.min(fromColIdx, toColIdx);
      var maxColIdx = Math.max(fromColIdx, toColIdx);

      var adjustedObj = {
        minRowIdx: minRowIdx,
        maxRowIdx: maxRowIdx,
        minColIdx: minColIdx,
        maxColIdx: maxColIdx
      };

      if(_api.count() > 0) {
        for(var rIdx = minRowIdx; rIdx <= maxRowIdx; rIdx++) {
          for(var cIdx = minColIdx; cIdx <= maxColIdx; cIdx++) {
            var containingFloater = _api.findContainingFloater(rIdx, cIdx);
            if (containingFloater && (containingFloater.getType() ===
                                      _kMergedCell_Floater_Type)) {

              var floaterStartRow = containingFloater.y();
              var floaterEndRow = containingFloater.y() +
                                  containingFloater.rowSpan() - 1;
              var floaterStartCol = containingFloater.x();
              var floaterEndCol = containingFloater.x() +
                                  containingFloater.colSpan() - 1;

              if(doExpand) {
                // adjust the selection range so that it includes this floater
                adjustedObj.minRowIdx = Math.min(adjustedObj.minRowIdx,
                                                 floaterStartRow);
                adjustedObj.maxRowIdx = Math.max(adjustedObj.maxRowIdx,
                                                 floaterEndRow);
                adjustedObj.minColIdx = Math.min(adjustedObj.minColIdx,
                                                 floaterStartCol);
                adjustedObj.maxColIdx = Math.max(adjustedObj.maxColIdx,
                                                 floaterEndCol);
              }
              else if(doShrinkByRow) {
                // adjust the selection range row-wise so that it does not
                // include this floater
                if(floaterStartRow < fromRowIdx) {
                  adjustedObj.minRowIdx = Math.max(adjustedObj.minRowIdx,
                                                   floaterEndRow + 1);
                }
                if(floaterEndRow > toRowIdx) {
                  adjustedObj.maxRowIdx = Math.min(adjustedObj.maxRowIdx,
                                                   floaterStartRow - 1);
                }
              }
              else if(doShrinkByCol) {
                // adjust the selection range column-wise so that it does not
                // include this floater
                if(floaterStartCol < fromColIdx) {
                  adjustedObj.minColIdx = Math.max(adjustedObj.minColIdx,
                                                   floaterEndCol + 1);
                }
                if(floaterEndCol > toColIdx) {
                  adjustedObj.maxColIdx = Math.min(adjustedObj.maxColIdx,
                                                   floaterStartCol - 1);
                }
              }
            }
          }
        }
      }

      if(wholeRow) {
        adjustedObj.minColIdx = undefined;
        adjustedObj.maxColIdx = undefined;
      }
      if(wholeCol) {
        adjustedObj.minRowIdx = undefined;
        adjustedObj.maxRowIdx = undefined;
      }
      return adjustedObj;
    },

    hasAreaMergedCells: function(r1, c1, r2, c2) {
      var floaterCount = _floaters.length;
      for (var ii = 0; ii < floaterCount; ii++) {
        var floater = _floaters[ii],
          xMin = floater.x(),
          yMin = floater.y(),
          xMax = floater.x() + floater.colSpan() - 1,
          yMax = floater.y() + floater.rowSpan() - 1;

        if (!(xMin > c2 || xMax < c1 || yMin > r2 || yMax < r1)) {
          return true;
        }
      }
      return false;
    },


    /**
     * TODO(umesh.kadam): Refactor floaterManager.js, there are some redundant
     *  functions, some names are obscure etc.
     * @param {Integer} r1 - from row index
     * @param {Integer} c1 - from col index
     * @param {Integer} r2 - to row index
     * @param {Integer} c2 - to col index
     * @return {boolean} True if the range is merged, false otherwise
     */
    isRangeMerged: function(r1, c1, r2, c2) {
      var rangeIsMerged = false;
      for(var i = 0, len = _floaters.length; i < len; i++) {
        var floater = _floaters[i],
            xMin = floater.x(),
            yMin = floater.y(),
            xMax = floater.x() + floater.colSpan() - 1,
            yMax = floater.y() + floater.rowSpan() - 1;

        if (yMin === r1 && xMin === c1 && yMax === r2 && xMax === c2) {
          rangeIsMerged = true;
          break;
        }
      }
      return rangeIsMerged;
    },


    /**
     * Returns whether or a floater of is anchored at the specified indices.
     * If you supply a type, then it will only return true if there is a floater
     * of this type at the anchor.  If you don't supply a type, then it will
     * return true if ANY floater matches.
     *
     * @param rowIndex {integer} Row index of the anchor of the floater
     * @param colIndex {integer} Column index of the anchor of the floater
     * @param type {string} Type of the floater widget (OPTIONAL)
     * @return {boolean} True if a matched floater is anchored at the specified
     * indices, false otherwise.
     * @method findFloaterAtAnchor(rowIndex, colIndex, type)
     */
    findFloaterAtAnchor: function(rowIndex, colIndex, type) {
      var retVal;

      var floaterCount = _floaters.length;
      for (var ii = 0; ii < floaterCount; ii++) {
        var floater = _floaters[ii];
        if (((type === undefined) || (type === floater.getType())) &&
             (floater.y() === rowIndex) && (floater.x() === colIndex)) {
          retVal = floater;
          break; // found the match, so quit looking
        }
      }

      return retVal;
    },

    /**
     * Returns the floater whose range contains the given indices, if there is
     * one.
     *
     * @param rowIndex {integer} The row index
     * @param colIndex {integer} The column index
     * @return {object or undefined} The matching floater if there is one,
     *                               otherwise undefined
     * @method findContainingFloater(rowIndex, colIndex)
     */
    findContainingFloater: function(rowIndex, colIndex) {
      var retVal;

      var floaterCount = _floaters.length;
      for (var ii = 0; ii < floaterCount; ii++) {
        var floater = _floaters[ii];
        if (floater && floater.isContained(rowIndex, colIndex)) {
          // found the match so set to the anchor of the floater widget
          retVal = floater;
          break; // found the match, so quit looking
        }
      }

      return retVal;
    },

    /**
     * Returns all floaters of specific type, present in the range of specified
     * from and to row/column indexes. If type is not specified it will return
     * all floaters present in the range.
     *
     * @param {number} fromRowIndex - Row index from where the selection starts.
     * @param {number} fromColIndex - Column index from where the selection
     *    starts.
     * @param {number} toRowIndex - Row index to where the selection ends.
     * @param {number} toColIndex - Column index to where the selection ends.
     * @param {string} type - Optional, type of floater such as merge cell,
     *    image etc.
     * @returns {Array} - array of floater objects
     */
    getFloatersInRange: function(fromRowIndex, fromColIndex, toRowIndex,
                                  toColIndex, type) {
      var retVal = [];
      var floaterCount = _floaters.length;
      for (var i = 0; i < floaterCount; i++) {
        var floater = _floaters[i];
        if (floater && ((type === undefined) || (type === floater.getType())) &&
            floater.isInRange(fromRowIndex, fromColIndex,toRowIndex,
                toColIndex)) {
          retVal.push(floater);
        }
      }
      return retVal;
    },

    /**
     * Returns all floaters present in the entire sheet of specific type. If
     * type is not specified it will return all floaters.
     *
     * @param {string} type - Optional, floater type such as merge, image or
     *    chart.
     * @returns {Array} - array of floater objects.
     */
    getAllFloaters: function(type) {
      var retVal = [];
      var floaterCount = _floaters.length;
      for (var i = 0; i < floaterCount; i++) {
        var floater = _floaters[i];
        if (floater && ((type === undefined) || (type === floater.getType()))){
          retVal.push(floater);
        }
      }
      return retVal;
    },

    /**
     * Lays out the floaters that are managed by this floater manager
     *
     * @param eventData {object} The event data of a "qowt:pane:layoutChanged"
     *                           signal
     * @method layoutFloaters(eventData)
     */
    layoutFloaters: function(eventData) {
      if (eventData !== undefined) {
        _layoutFloaters(eventData);
      }
    },

    /**
     * Moves floaters up or down in grid according to the row splice event
     *
     * @param {integer} index Where the rows were spliced
     * @param {integer} numRows Number of rows affected
     * @param {boolean} isDelete If true, handled as "delete" operation,
     *                           otherwise "insert"
     * @param {node} node doc fragment where deleted nodes should be appended to
     */
    updateFloatersAfterRowSplice: function(index, numRows, isDelete, node) {
      return _updateFloatersAfterOp(index, numRows, isDelete, node, false);
    },

    /**
     * Moves floaters left or right in grid according to the col splice event
     *
     * @param {integer} index Where the cols were spliced
     * @param {integer} numCols Number of cols affected
     * @param {boolean} isDelete If true, handled as "delete" operation,
     *                           otherwise "insert"
     * @param {node} node doc fragment where deleted nodes should be appended to
     */
    updateFloatersAfterColumnSplice: function(index, numCols, isDelete, node) {
      return _updateFloatersAfterOp(index, numCols, isDelete, node, true);
    }
  };

  /**
   * @api private
   */

  var _init = function() {
    };

  // TODO(mikkor) Comment these out as they are not needed until core
  // supports proper modifying and saving of images and charts (Issue 307935)
/*
  var _getAnchorType = function(floater) {
    var anchorType;
    if(floater.editAs) {
      anchorType = floater.editAs();
      // editAs is returned as "twoCell" when getAnchorType returns just "two"
      if(anchorType && anchorType.indexOf("Cell") !== -1) {
        anchorType = anchorType.replace("Cell", "");
      }
    }
    if(!anchorType && floater.getAnchorType) {
      anchorType = floater.getAnchorType();
    }
    return anchorType;
  };

  // Handles the one cell anchor objects when deleting/inserting rows/cols
  // Returns an object which has property 'coord'
  var _handleOneCellAnchor = function(index, num, isDelete, c1) {
    // Selection is before the object
    var retVal = {};
    if (index + num < c1) {
      if(isDelete) {
        c1 -= num;
      } else {
        c1 += num;
      }
    } else if (index < c1) {
      // Selection starts before object, finishes elsewhere
      if(isDelete) {
        c1 = index;
      } else {
        c1 += num;
      }
    }
    retVal.coord1 = c1;
    return retVal;
  };

  // Handles the two cell anchor objects when deleting/inserting rows/cols
  var _handleTwoCellAnchor = function(index, num, isDelete, c1, c2) {
    var retVal = {};
    if (index <= c1 && index + num >= c2) {
      // Selection is over the whole object
      if (isDelete) { // Delete the object
        retVal.del = true;
        return retVal;
      } else { // Move
        c1 += num;
        c2 += num;
      }
    } else if (index + num < c1) { // Selection is before the object
      if(isDelete) { // Move
        c1 -= num;
        c2 -= num;
      } else { // Move
        c1 += num;
        c2 += num;
      }
    } else if (index < c1) {
      // Selection starts before the object, finishes elsewhere
      if(isDelete) { // Move
        var dif = c1 - index;
        var overlap = index + num - c1;
        c1 -= dif;
        c2 -= (dif + overlap);
      } else { // Move
        c1 += num;
        c2 += num;
      }
    } else if (index <= c2 && index + num - 1 <= c2) {
      // Selection is inside the object
      if(isDelete) { // Resize
        c2 -= num;
      } else { // Resize
        c2 += num;
      }
    } else if (index <= c2) { // Selection starts inside, finishes outside
      if(isDelete) { // Resize
        c2 = index;
      } else { // Resize
        c2 += num;
      }
    }
    retVal.coord1 = c1;
    retVal.coord2 = c2;
    return retVal;
  };*/

  // Moves the floaters up, down, left or right after the user has
  // inserted or deleted rows or columns
  var _updateFloatersAfterOp = function() {
    // TODO(mikkor) Just return an empty array until the core supports proper
    // saving of images and charts (Issue 307935). When the saving works, just
    // uncomment the code below.
    return [];
/*  var floater, flCoord, flSpan, anchorType, obj, deletedFloats = [];
    num = num ? num : 1;
    var flCount = _floaters.length;
    for (var ii = 0; ii < flCount; ii++) {
      floater = _floaters[ii];
      flCoord = isCol ? floater.x() : floater.y();
      flSpan = isCol ? floater.colSpan() : floater.rowSpan();

      // Merge cells do not have anchor type (treat it as twocell)
      // Charts have anchor type
      // Images have anchor type but also might have different 'editAs'
      anchorType = _getAnchorType(floater);

      if(anchorType === "one") {
        obj = _handleOneCellAnchor(index, num, isDelete, flCoord);
        if(isCol) { // so just move
          floater.setX(obj.coord1);
        } else {
          floater.setY(obj.coord1);
        }
      } else if(!anchorType || anchorType === "two") {
        var flCoord2 = flCoord + flSpan - 1;
        obj = _handleTwoCellAnchor(index, num, isDelete, flCoord, flCoord2);
        if(obj.del) {
          // Delete merged cells and 'two anchor' floaters if area is deleted
          _api.detachWidget(floater);
          floater.removeFromParent(node);
          flCount--;
          ii--;
          deletedFloats.push(floater);
          continue;
        } else{
          flSpan = obj.coord2 - obj.coord1 + 1;
          if(isCol) {
            floater.setX(obj.coord1);
            floater.setColSpan(flSpan);
          } else {
            floater.setY(obj.coord1);
            floater.setRowSpan(flSpan);
          }
        }
      }
    }
    return deletedFloats;*/
  };


  var _getRectForFloater = function (floater, eventData) {

    if (floater.getType() === 'sheetFloaterImage' ||
        floater.getType() === 'sheetFloaterChart') {
      if (floater.getAnchorType() === 'one') {
        return _getRectForOneCellAnchor(floater);
      }
      else if (floater.getAnchorType() === 'two') {
        return _getRectForTwoCellAnchor(floater, eventData);
      }
      else if (floater.getAnchorType() === 'abs') {
        return _getRectForAbsAnchor(floater);
      }
      else {
        return _getRectForDefaultAnchor(floater);
      }
    }
    else {
      return _getRectForDefaultAnchor(floater);
    }
  };

  var _getRectForDefaultAnchor = function(floater) {

    var xIndexMin = floater.x();
    var yIndexMin = floater.y();
    var xIndexMax = floater.x() + floater.colSpan() - 1;
    var yIndexMax = floater.y() + floater.rowSpan() - 1;

    var topPos = SheetModel.RowPos[yIndexMin];
    var leftPos = SheetModel.ColPos[xIndexMin];

    var height = 0;
    for (var yy = yIndexMin; yy <= yIndexMax; yy++) {
      height += (SheetModel.RowHeights[yy] -
                 SheetConfig.kGRID_GRIDLINE_WIDTH);
    }
    height += SheetConfig.kGRID_GRIDLINE_WIDTH;

    var width = 0;
    for (var xx = xIndexMin; xx <= xIndexMax; xx++) {
      width += (SheetModel.ColWidths[xx] -
                SheetConfig.kGRID_GRIDLINE_WIDTH);
    }
    width += SheetConfig.kGRID_GRIDLINE_WIDTH;

    var rect = {
      topPos: Math.max(0, topPos),
      leftPos: Math.max(0, leftPos),
      height: Math.max(0, height),
      width: Math.max(0, width)
    };

    return rect;
  };

  var _getRectForOneCellAnchor = function(floater){

    var topPos,leftPos, width, height;

    var xIndexMin = floater.x();
    var yIndexMin = floater.y();

    topPos = SheetModel.RowPos[yIndexMin] + floater.getFromRowOffset();
    leftPos = SheetModel.ColPos[xIndexMin] + floater.getFromColOffset();

    width = floater.getOffsets().bottomRightXOffset;
    height = floater.getOffsets().bottomRightYOffset;

    var rect = {
        topPos: Math.max(0,topPos),
        leftPos: Math.max(0,leftPos),
        height: Math.max(0,height),
        width: Math.max(0,width)
    };

    return rect;
  };


  var _getRectForAbsAnchor = function(floater){

    var topPos,leftPos, width, height;

    topPos = floater.getOffsets().topLeftYOffset;
    leftPos = floater.getOffsets().topLeftXOffset;
    width = floater.getOffsets().bottomRightXOffset;
    height = floater.getOffsets().bottomRightYOffset;

    var rect = {
        topPos: Math.max(0,topPos),
        leftPos: Math.max(0,leftPos),
        height: Math.max(0,height),
        width: Math.max(0,width)
    };

    return rect;
  };


  var _getRectForTwoCellAnchor = function(floater) {
    var rect;
    if (floater) {
      var topPos, leftPos, width, height;
      var colFrom = floater.x();
      var rowFrom = floater.y();
      var colTo = floater.x() + floater.colSpan() - 1;
      var rowTo = floater.y() + floater.rowSpan() - 1;

      topPos = SheetModel.RowPos[rowFrom] + floater.getFromRowOffset();
      leftPos = SheetModel.ColPos[colFrom] + floater.getFromColOffset();
      height = SheetModel.RowPos[rowTo] + floater.getToRowOffset() - topPos;
      width = SheetModel.ColPos[colTo] + floater.getToColOffset() - leftPos;

      rect = {
        topPos: Math.max(0, topPos),
        leftPos: Math.max(0, leftPos),
        height: Math.max(0, height),
        width: Math.max(0, width)
      };
    }
    return rect;
  };

  // Returns the maximum horizontal or vertical index
  // of all floaters
  var _getMaxIndex = function(isHorizontal) {
    var maxVal = 0, floater, val;
    var floaterCount = _floaters.length;
    for (var ii = 0; ii < floaterCount; ii++) {
      floater = _floaters[ii];
      if(isHorizontal) {
        val = floater.x() + floater.colSpan() - 1;
      } else {
        val = floater.y() + floater.rowSpan() - 1;
      }
      maxVal = Math.max(maxVal, val);
    }
    return maxVal;
  };

  var _layoutFloaters = function(eventData) {

      var floaterCount = _floaters.length;
      for (var ii = 0; ii < floaterCount; ii++) {
        var floater = _floaters[ii];

        var floaterRect = _getRectForFloater(floater, eventData);
        floater.updatePositionAndDimensions(floaterRect.topPos,
                floaterRect.leftPos, floaterRect.height, floaterRect.width);

        if (floaterRect.height === 0 || floaterRect.width === 0) {
          floater.setDisplay('none');
        } else {
          floater.setDisplay('');
        }
      }
    };

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
