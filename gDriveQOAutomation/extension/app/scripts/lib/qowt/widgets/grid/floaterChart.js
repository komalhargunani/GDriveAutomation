/**
 * SheetFloaterChart
 * =================
 *
 * A SheetFloaterChart widget encapsulates the part of the HTML DOM representing
 * a workbook that displays a chart in the grid's 'content' node.
 *
 * The SheetFloaterChart widget manages the construction and logic of the chart
 * container.
 * The chart widget is designed to sit within the existing div structure of
 * underlying rows, columns and cells of the grid.  It sits visibly atop of
 * the normal cells which it covers.
 *
 * ###IMPORTANT NOTE
 * Widgets should cause no HTML render tree relayouts
 * to occur in their constructor. This is to prevent many expensive render tree
 * relayouts from occuring during the opening of a workbook or switching of
 * a sheet.
 * If a widget requires to perform operations that will result in a relayout of
 * the render tree then these operations should be captured in a 'layoutBlah()'
 * method in the widget's
 * public API, so that the workbook layout control can dictate when this method
 * is called,
 * at an appropriate moment to take the 'hit' of render tree relayout costs.
 *
 * @constructor
 * @param {object} config - Mandatory parameter that contains the layout info of
 *                          the container
 * @param {integer} chartId - Unique Chart Id
 *
 *
 * The config object has the following properties:
 *
 * - type {String}  Chart's Anchor type.
 * - frm {Object} The top left corner location of the chart -
 *                ri {integer} - The row index
 *                ci {integer} - The column index
 *                xo {integer] - The x-axis offset
 *                yo {integer} - The y-axis offset
 *
 * - to {Object} The bottom right corner location of the chart -
 *                ri {integer} - The row index
 *                ci {integer} - The column index
 *                xo {integer] - The x-axis offset
 *                yo {integer} - The y-axis offset
 *
 * - pos {Object} The position of chart anchored in a sheet -
 *                x {integer} - left position of chart.
 *                y {integer} - top position of chart.
 *
 * - ext {Object} The extent properties for chart -
 *                cx {integer} - extent length of chart.
 *                cy {integer} - extent width of chart.
 *
 *
 * @return {object}                   A Chart container.
 */
define([
  'qowtRoot/dcp/decorators/backgroundDecorator',
  'qowtRoot/widgets/grid/floaterDrawingBase',
  'qowtRoot/utils/charts/chartRenderer',
  'qowtRoot/models/charts',
  'qowtRoot/variants/configs/sheet'
], function(
    BackgroundDecorator,
    SheetFloaterDrawingBase,
    ChartRenderer,
    ChartsModel,
    SheetConfig) {

  'use strict';


  var _factory = {

    create: function(config, cellToClone) {

      // use module pattern for instance object
      var module = function() {


          /*!
           *Private constants
           */

          var kFloater_Type = "sheetFloaterChart";

          var kFloater_Node = {
            Tag: 'div',
            Class: 'qowt-chart-floater',
            Position: 'absolute'
          };

          var kCenter = 'center';

          /*!
           * Private data
           */
          var _backgroundColor,

            _chartFloaterNode,
            _chartId;


          /*!
           *
           */
          // extend base floater module
          var _api = SheetFloaterDrawingBase.create(kFloater_Type);

          /**
           * Gets the chart's node
           *
           * @return {object} The chart background node
           * @method getBackgroundNode()
           */
          _api.getNode = function() {
            return _chartFloaterNode;
          };

        /**
         * Returns the 'rect' SVG element which is contained in chart floater
         * div.
         *
         * @returns {object} - 'rect' SVG element of a chart.
         */
          _api.getSvgNode = function() {
            return _chartFloaterNode.getElementsByTagName('rect')[0];
          };

          /**
           * Returns whether another floater widget matches this one
           *
           * @param floater {object} Another floater widget
           * @return {integer} True if the floaters are the same, false
           * otherwise
           * @method isMatchingFloater()
           */
          _api.isMatchingFloater = function(floater) {
            var retVal = false;
            if (floater && (floater.getAnchorType() === _api.getAnchorType())) {
              if ((floater.x() === _api.x()) && (floater.y() === _api.y()) &&
                  (floater.rowSpan() === _api.rowSpan()) &&
                  (floater.colSpan() === _api.colSpan())) {
                retVal = true;
              }
            }
            return retVal;
          };


          /**
           * Gets the chart's unique ID
           *
           * @return {integer} chart's unique ID
           * @method getChartId()
           */
          _api.getChartId = function() {
            return _chartId;
          };

          /**
           * Gets the chart's background color
           *
           * @return {string} chart's background color
           * @method getBackgroundColor()
           */
          _api.getBackgroundColor = function() {
            return _backgroundColor;
          };

          /**
           * Returns whether or not the supplied target is within the range of
           * this floater widget.
           *
           * @param rowIndex {integer} The row index of the cell to check
           * @param colIndex {integer} The column index of the cell to check
           * @param posX {integer} Optional parameter containing a X coordinate
           * @param posY {integer} Optional parameter containing a Y coordinate
           * @return {boolean} Returns true if the supplied target is within the
           * range of this floater
           * @method isContained()
           */
          _api.isContained = function(rowIndex, colIndex /* posX, posY */) {
            var retVal = false;

            var xIndexMin = _api.x();
            var yIndexMin = _api.y();
            var xIndexMax = xIndexMin + _api.colSpan() - 1;
            var yIndexMax = yIndexMin + _api.rowSpan() - 1;

            if ((rowIndex >= yIndexMin) && (rowIndex <= yIndexMax) &&
                (colIndex >= xIndexMin) && (colIndex <= xIndexMax)) {
              retVal = true;
            }

            return retVal;
          };

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * Here the chart's div element, if it exists, is appended as a
           * child to the specified node
           *
           * @param node {object} The HTML node that this widget is to attach
           * itself to
           * @method appendTo(node)
           */
          _api.appendTo = function(node) {
            if (node === undefined) {
              throw ("appendTo - missing node parameter!");
            }

            // append the chart node
            if (_chartFloaterNode !== undefined) {
              node.appendChild(_chartFloaterNode);
            }
          };

          /**
           * Clones this chart widget and appends the cloned HTML elements to
           * the specified node.
           *
           * @param node {object}  The HTML node that the cloned chart widget
           * is to append itself to
           * @method cloneTo(node)
           * @return {object}      The cloned widget
           */
          _api.cloneTo = function(node) {
            if (node === undefined) {
              throw ("cloneTo - missing node parameter!");
            }

            var clone = _factory.create(config, this);

            if (clone.getNode() !== undefined) {
              node.appendChild(clone.getNode());
            }

            return clone;
          };

          /**
           * Sets the chart's display property
           *
           * @param display {string} The CSS display property value
           * @method setDisplay(display)
           */
          _api.setDisplay = function(display) {
            if (_chartFloaterNode !== undefined) {
              _chartFloaterNode.style.display = display;
            }
          };

          /**
           * Returns whether or not this floater widget can be selected.
           * A chart can never be selected so this method returns false.
           *
           * @return {boolean} Returns false
           * @method isSelectable()
           */
          _api.isSelectable = function() {
            return false;
          };

          /**
           * Sets the chart's top position.
           *
           * @param {integer} topPos The top position, in pixels
           * @method setTopPosition()
           */
          _api.setTopPosition = function (topPos) {
            _chartFloaterNode.style.top = topPos + 'px';
          };

          /**
           * Sets the chart's left position.
           *
           * @param {integer} leftPos The left position, in pixels
           * @method setLeftPosition()
           */
          _api.setLeftPosition = function (leftPos) {
            _chartFloaterNode.style.left = leftPos + 'px';
          };

          /**
           * Removes the widget from the DOM.
           *
           * @param {node} contentNode doc fragment where deleted nodes should
           *     be appended to
           */
          _api.removeFromParent = function (contentNode) {
            if (_chartFloaterNode !== undefined) {
              _chartFloaterNode.removeElm();
              if(contentNode) {
                contentNode.appendChild(_chartFloaterNode);
              }
            }
          };

          /**
           * @api private
           */
          var _init = function() {

              if (cellToClone === undefined) {
                _createDefaultChart();
              } else {
                _createClonedChart();
              }
            };

          var _createClonedChart = function() {
              var cloneFloaterNode = cellToClone.getNode();
              if (cloneFloaterNode !== undefined) {
                //LM TODO: Do we need to use a new id?
                _chartFloaterNode = cloneFloaterNode.cloneNode(true);
              }

              _api.cloneAnchorData(cellToClone);
              _backgroundColor = cellToClone.getBackgroundColor();
              _chartId = cellToClone.getChartId();
            };

          var _createDefaultChart = function() {

            if (config === undefined) {
              throw new Error("floaterChart - missing constructor parameters!");
            }

            _chartId = config.chartId;
            _api.populateAnchorData(config.anchor);

            if (config.backgroundColor) {
              _backgroundColor = config.backgroundColor;
            } else {
            // ensure underlying inner gridlines are blanked out
            // (but not outer ones)
              _backgroundColor = "#FFFFFF";
            }

            _createChartFloaterDiv();
          };

          /**
           * Creates a floater div to display the background color & chart
           *
           * @api private
           */
          var _createChartFloaterDiv = function() {

              // (1) BACKGROUND DIV
              _chartFloaterNode = document.createElement(kFloater_Node.Tag);
              _chartFloaterNode.id = "chfl_" + _chartId;
              _chartFloaterNode.classList.add(kFloater_Node.Class);

              var bkgDecorator = BackgroundDecorator.create(_chartFloaterNode);
              bkgDecorator.decorate(_backgroundColor);

              _chartFloaterNode.style.position = kFloater_Node.Position;

              if(_api.getAnchorType() === kCenter) {
                var scale = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
                // set the centered chart to have the configured percentage of
                // the chart sheet dimensions
                _chartFloaterNode.style.width =
                  ((SheetConfig.kCHART_SHEET_CHART_SIZE_FACTOR * 10) *
                      scale) + '%';
                _chartFloaterNode.style.height =
                    ((SheetConfig.kCHART_SHEET_CHART_SIZE_FACTOR * 10) *
                        scale) + '%';
              }
            };

         /**
          * Sets the chart container's position, height and width in pixel.
          *
          * NOTE: This function should be called only by the floater drawing
          * object. Any code outside the floater drawing object should call
          * updatePositionAndDimensions().
          *
          * @param {integer} topPos - Top left Y of the chart container in pixel
          * @param {integer} leftPos - Top left X of the chart container.
          * @param {integer} height - Height of the chart container in pixel.
          * @param {integer} width - Width of the chart container in pixel.
          * @override
          */
          _api._setRectPosAndDimensions = function(topPos, leftPos, height,
                                                   width) {
            // the chart is now appended to its container and needs to be
            // rendered
            var sizeChanged = true;
            if(_api.getAnchorType() === kCenter) {
              // 1. set the top and left position of the chart
              var heightDiff = _chartFloaterNode.parentNode.offsetHeight -
                _chartFloaterNode.offsetHeight;
              var newTopVal = Math.max(0, (heightDiff / 2));
              _chartFloaterNode.style.top = newTopVal + 'px';

              var widthDiff = _chartFloaterNode.parentNode.offsetWidth -
                _chartFloaterNode.offsetWidth;
              var newLeftVal = Math.max(0, (widthDiff / 2));
              _chartFloaterNode.style.left = newLeftVal + 'px';

              // 2. change the width and height of the centered chart to have
              // absolute pixel values
              // rather than percentage values to ensure that the width and
              // height of the chart don't
              // change when the browser window is resized
              _chartFloaterNode.style.width = _chartFloaterNode.offsetWidth;
              _chartFloaterNode.style.height = _chartFloaterNode.offsetHeight;
            }
            else {

              topPos = Math.max(0, topPos);
              leftPos = Math.max(0, leftPos);
              height = Math.max(0, height);
              width = Math.max(0, width);

              if (_api.height() === height && _api.width() === width) {
                sizeChanged = false;
              }

              _api.setTop(topPos);
              _api.setLeft(leftPos);
              _api.setHeight(height);
              _api.setWidth(width);

              if (_chartFloaterNode) {
                _chartFloaterNode.style.top = topPos + "px";
                _chartFloaterNode.style.left = leftPos + "px";
                _chartFloaterNode.style.height = height + "px";
                _chartFloaterNode.style.width = width + "px";
              }
            }

            if (sizeChanged || (ChartsModel && ChartsModel[_chartId] &&
                ChartsModel[_chartId].rendered === false)) {
              ChartRenderer.render(_chartFloaterNode, _chartId);
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
