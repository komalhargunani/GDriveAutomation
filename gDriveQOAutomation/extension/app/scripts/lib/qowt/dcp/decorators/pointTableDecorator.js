/**
 * Table decorator
 *
 * JSON structure for table properties from DCP is
 * {
 * "fill":  <noFill> / <Solid fill JSON> / <gradient fill JSON> ,
 *          // other fills too
 * "xfrm": <2D Transform JSON>
 * }
 *
 */

define([
  'qowtRoot/dcp/pointHandlers/transform2DHandler',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/utils/qowtMarkerUtils'
], function(
  Transform2DHandler,
  FillHandler,
  ThemeStyleRefManager,
  QOWTMarkerUtils) {

  'use strict';

  var _api = {

    decorate: function() {

      var _localApi = {

        /**
         * creates html element for the table
         * @param {JSON} pointTableObj - table properties
         * @return {HTML} new table html-element
         */
        withNewTableDiv: function(pointTableObj) {
          var tableDiv = document.createElement('TABLE');

          tableDiv.id = pointTableObj.eid;
          return tableDiv;
        },

        /**
         * creates parent element which encapsulates the table-element.
         * @param {JSON} pointTableObj - table properties
         * @return {HTML} new html element which wraps the table-element.
         */
        withNewParentDiv: function(pointTableObj) {
          var parentDiv = document.createElement("DIV");

          parentDiv.display = "inline";
          parentDiv.className = "qowt-point-position-absolute";
          parentDiv.id = pointTableObj.eid + "tableParent";
          parentDiv.style['z-index'] = "0";

          // append the table to the parentDIV. This div is required for
          // selection to work seamlessly on tables.
          // This will help us reuse most of the shapeWidget functionality.
          parentDiv.setAttribute('qowt-divType', 'table');

          // This is the actual shape-Id coming from XML - added for AUTOMATION
          // purpose.
          QOWTMarkerUtils.addQOWTMarker(parentDiv, 'shape-Id',
            pointTableObj.nvSpPr.shapeId);

          return parentDiv;
        },

        /**
         * Handles transforms for table
         * @param tableDiv {DOM Object} table div
         * @param transfoms {JSON} Table transforms
         * @return {Object} local API for the decorator
         */
        withTransforms: function(tableDiv, transforms) {
          // holds table dimensions in pixel, initialized to 0
          if (tableDiv) {
            Transform2DHandler.handle(transforms, undefined, tableDiv);
          }
          return _localApi;
        },

        /**
         * Handles fill for table
         * @param tableDiv {DOM Object} table div
         * @param fill {JSON} Table fill
         * @return {Object} local API for the decorator
         */
        withFill: function(tableDiv, fill) {
          if (tableDiv) {
            if (fill) {
              FillHandler.handleUsingHTML(fill, tableDiv);
            } else {
              var fillRefClassName = ThemeStyleRefManager.getFillRefClassName();
              if (fillRefClassName) {
                tableDiv.className += ( ' ' + fillRefClassName);
              }
            }
          }
          return _localApi;
        },

        /**
         * Update table cells for height and width
         * Also cascade cell fill with table fill if cell fill is not defined
         * @param tableRows Array of row JSON
         * @param tableCols Array of grid columns
         */
        withUpdatedCellDimensionsAndFill: function(tableRows, tableCols) {
          var numberOfRows = tableRows.length;

          for (var rowCounter = 0; rowCounter < numberOfRows; rowCounter++) {
            var tableRow = tableRows[rowCounter];
            var rowCells = tableRow.elm;
            var numberOfCells = rowCells.length;

            for (var cellCounter = 0; cellCounter < numberOfCells;
                 cellCounter++) {
              var tableCell = rowCells[cellCounter];

              /*
               * If table cell contains hMerge or vMerge to be true then current
               * cell is merged with other cell. In this case we don't need to
               * assign height and width to it, as we are not gonna render it.
               */
              if (!tableCell.hMerge && !tableCell.vMerge) {

                // Handle height and width
                var rowObject = tableRows[rowCounter];
                var height = 0;
                if (rowObject && rowObject.h) {
                  height = parseInt(rowObject.h, 10);
                }

                var columnHeightObject = tableCols[cellCounter];
                var width = 0;
                if (columnHeightObject && columnHeightObject.width) {
                  width = parseInt(columnHeightObject.width, 10);
                }

                // If grid span is present then update width using spanned cells
                // width
                if (tableCell.gridSpan) {
                  for (var gsc = cellCounter + 1;
                       gsc <= ((tableCell.gridSpan - 1) + cellCounter); gsc++) {
                    var tempColumnHeightObject = tableCols[gsc];
                    if (tempColumnHeightObject &&
                      tempColumnHeightObject.width) {
                      width = width +
                        parseInt(tempColumnHeightObject.width, 10);
                    }
                  }
                }

                // If row span is present then update height using spanned cells
                // height
                if (tableCell.rowSpan) {
                  for (var rsc = rowCounter + 1;
                       rsc <= ((tableCell.rowSpan - 1) + rowCounter); rsc++) {
                    var tempRowObject = tableRows[rsc];
                    if (tempRowObject && tempRowObject.h) {
                      height = height + parseInt(tempRowObject.h, 10);
                    }
                  }
                }

                tableCell.height = height;
                tableCell.width = width;

                //set the cell position (row,col),  to apply the table style.
                tableCell.row = rowCounter;
                tableCell.col = cellCounter;
              }
            }
          }
        }

      };
      return _localApi;
    }
  };
  return _api;
});
