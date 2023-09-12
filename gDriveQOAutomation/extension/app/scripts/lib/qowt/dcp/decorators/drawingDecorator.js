/**
 * @fileOverview Drawing DIV acts as a bounding rectangle for shape DIV. This
 * file has methods which adjusts the width and height of the drawing div
 * according to the rotation of shape div. It also adjusts the left and top of
 * the of theshape div so that it correctly fits inside the drawing div.
 * @author <a href="mailto:alok.guha@quickoffice.com">Alok Guha</a>
 */

define([
  'qowtRoot/dcp/utils/unitConversionUtils'
], function (UnitConversionUtils) {

  'use strict';

    var _api = {

        /**
         * @public
         * After rotation the shape DIV goes out of its parent (drawing DIV) and
         * hence vertical alignment of this drawing with other content goes for
         * toss. Hence we need to adjust the left and top position of this shape
         * DIV.
         *
         * this method is exposed with api to call
         * _adjustImageWithContainerArea.
         * @param dcp {Object}
         */
        adjustImageWithContainerArea: function(dcp) {
            _adjustImageWithContainerArea(dcp);
        },

        /*
         * @param {HTML Element} elm The html element to decorate.
         * @param {Object} shape properties for this drawing.
         * @param {Number} shapeProperties.xfrm.ext.cx - width of the drawing
         * @param {Number} shapeProperties.xfrm.ext.cy - height of the drawing
         * @param {Number} shapeProperties.xfrm.ext.rot - rotation angle for
         *                 this drawing.
         */
        decorate: function(elm, shapeProperties) {
            if (shapeProperties && shapeProperties.xfrm &&
              shapeProperties.xfrm.rot) {
                var width = shapeProperties.xfrm.ext.cx,
                    height = shapeProperties.xfrm.ext.cy,
                    rotationAngle = shapeProperties.xfrm.rot;
                _setPosition(height, width, rotationAngle, elm);
            }

        }
    };

    /**
     * @private
     * This function calculate and set height, width, top and left for contaning
     * div of rotated object
     * @param height element-height in EMU
     * @param width element-width in EMU
     * @param rotatedAngle angle of rotation
     * @param elm {HTML element}
     */
    function _setPosition(height, width, rotatedAngle, elm) {
        var angle = rotatedAngle * Math.PI / 180,
            sin = Math.sin(angle),
            cos = Math.cos(angle);
        // (0,0) stays as (0, 0)

        // (w,0) rotation
        var x1 = cos * width,
            y1 = sin * width;

        // (0,h) rotation
        var x2 = -sin * height,
            y2 = cos * height;

        // (w,h) rotation
        var x3 = cos * width - sin * height,
            y3 = sin * width + cos * height;

        var minX = Math.min(0, x1, x2, x3),
            maxX = Math.max(0, x1, x2, x3),
            minY = Math.min(0, y1, y2, y3),
            maxY = Math.max(0, y1, y2, y3);

        var rotatedWidth = maxX - minX,
            rotatedHeight = maxY - minY;


        var actualWidth = UnitConversionUtils.convertEmuToPixel(rotatedWidth),
            actualHeight = UnitConversionUtils.convertEmuToPixel(rotatedHeight);

        elm.style.width = actualWidth + 'px';
        elm.style.height = actualHeight + 'px';

    }

    /**
     * When drawing object (shape DIV) is rotated we make drawing div (enclosing
     * div) big enough so that rotated drawing object is fit withing the
     * boundary of drawing div. Once drawing div is big enough, we need to make
     * sure that rotated drawing (Shape DIV) is positioned centered to the
     * enclosing div.
     *
     * @param dcp {Object}
     */
    function _adjustImageWithContainerArea(dcp) {
      var drawingDiv, shapeDivElement;
      var translateLeft, translateTop, rotationStyle;
      if (dcp.el && dcp.el.associatedDOM && dcp.el.associatedDOM.childNodes) {
        drawingDiv = dcp.el.associatedDOM;
        shapeDivElement = dcp.el.associatedDOM.childNodes.length ?
          dcp.el.associatedDOM.childNodes[0] : undefined;
        if (shapeDivElement &&
          shapeDivElement.getAttribute('qowt-divtype') === 'shape') {
          translateLeft = (parseFloat(drawingDiv.style.width) -
            parseFloat(shapeDivElement.style.width)) / 2;
          translateTop = (parseFloat(drawingDiv.style.height) -
            parseFloat(shapeDivElement.style.height)) / 2;
          rotationStyle = shapeDivElement.style.webkitTransform;
          shapeDivElement.style.webkitTransform = 'translate(' + translateLeft +
            'px, ' + translateTop + 'px) ' + rotationStyle;
        }
      }
    }

    return _api;
});
