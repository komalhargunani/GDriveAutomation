
/**
 * Sheet Floater Image
 * =================
 *
 * A SheetFloaterImage widget encapsulates the part of the HTML DOM representing
 * a workbook that displays a Image in the grid's 'content' node.
 *
 * The SheetFloaterImage widget manages the construction and logic of a
 * ImageContainer.
 * The Image floater widget is designed to sit within the existing div
 * structure of underlying rows, columns and cells of the grid.  It sits
 * visibly atop of the normal cells which it covers.
 *
 *
 * @author yuvraj.patel@synerzip.com (Yuvraj Patel)
 * @constructor Constructor for the Sheet Floater image widget
 * @param {object} config Mandatory parameter that contains the layout info of
 * the container
 * The config object has the following properties:
 * - rowSpan {integer} The number of rows which this image spans over
 * - colSpan {integer} The number of columns which this image spans over
 * - topLeftXOffset {integer}
 * - topLeftYOffset {integer}
 * - bottomRightXOffset {integer}
 * - bottomRightYOffset {integer}
 *
 * @return {object}                   Image container.
 */
define([
    'qowtRoot/widgets/grid/floaterDrawingBase',
    'qowtRoot/utils/domUtils'
], function (SheetFloaterDrawingBase, DomUtils) {

  'use strict';

    var _factory = {

        create:function (config,cellToClone) {

            // use module pattern for instance object
            var module = function () {

                /*!
                 *Private constants
                 */
                var kFloater_Type = "sheetFloaterImage";

                /*!
                 * Private data
                 */
                var _imageId,
                    _backgroundColor,
                    _childNode,
                    _parentNode,
                    _rotation;


                /*!
                 * extend base floater module
                 */
                var _api = SheetFloaterDrawingBase.create(kFloater_Type);

                /**
                 * Gets the Image's node
                 *
                 * @return {html node} The Image node
                 */
                _api.getNode = function () {
                    return _childNode;
                };

                /**
                 * Returns whether another floater widget matches this one
                 *
                 * @param floater {object} Another floater widget
                 * @return {integer} True if the floaters are the same,
                 * false otherwise
                 * @method isMatchingFloater()
                 */
                _api.isMatchingFloater = function (floater) {
                    var retVal = false;
                    if (floater &&
                        floater.getAnchorType() === _api.getAnchorType()) {
                        if (_api.getAnchorType() === 'two') {
                            if ((floater.x() === _api.x()) &&
                                (floater.y() === _api.y()) &&
                                (floater.rowSpan() === _api.rowSpan()) &&
                                (floater.colSpan() === _api.colSpan())) {
                                retVal = true;
                            }
                        } else if (_api.getAnchorType() === 'one') {
                            if ((floater.x() === _api.x()) &&
                                (floater.y() === _api.y()) &&
                                (floater.getFromColOffset() ===
                                    _api.getFromColOffset()) &&
                                (floater.getFromRowOffset() ===
                                    _api.getFromRowOffset())) {
                                retVal = true;
                            }
                        } else if (_api.getAnchorType() === 'abs') {
                            if ((floater.getOffsets().topLeftXOffset ===
                                _api.getOffsets().topLeftXOffset) &&
                                (floater.getOffsets().topLeftYOffset ===
                                    _api.getOffsets().topLeftYOffset) &&
                                (floater.getOffsets().bottomRightXOffset ===
                                    _api.getOffsets().bottomRightXOffset) &&
                                (floater.getOffsets().bottomRightYOffset ===
                                    _api.getOffsets().bottomRightYOffset)) {
                                retVal = true;
                            }
                        }
                    }
                    return retVal;
                };

                /**
                 * Gets the Image's unique ID
                 *
                 * @return {integer} Image's unique ID
                 * @method getImageId()
                 */
                _api.getImageId = function () {
                    return _imageId;
                };

                /**
                 * Gets the Image's background color
                 *
                 * @return {string} Image's background color
                 * @method getBackgroundColor()
                 */
                _api.getBackgroundColor = function () {
                    return _backgroundColor;
                };

                /**
                 * Returns whether or not the supplied target is within the
                 * range of this floater widget.
                 *
                 * @param rowIndex {integer} The row index of the cell to check
                 * @param colIndex {integer} The column index of the cell
                 * to check
                 * @param posX {integer} Optional parameter containing a
                 * X coordinate
                 * @param posY {integer} Optional parameter containing a
                 * Y coordinate
                 * @return {boolean} Returns true if the supplied target is
                 * within the range of this floater
                 * @method isContained()
                 */
                _api.isContained = function (rowIndex, colIndex, posX, posY) {
                    var retVal = false;

                    var xIndexMin = _api.x();
                    var yIndexMin = _api.y();
                    var xIndexMax = xIndexMin + _api.colSpan() - 1;
                    var yIndexMax = yIndexMin + _api.rowSpan() - 1;

                    if (_rotation && _rotation !== 0 && posX && posY) {
                      var boundingRect = _childNode.getBoundingClientRect();
                      retVal = (posX > boundingRect.left &&
                                 posX < boundingRect.right &&
                                 posY > boundingRect.top &&
                                 posY < boundingRect.bottom);
                    } else {
                      retVal = ((rowIndex >= yIndexMin) &&
                               (rowIndex <= yIndexMax) &&
                               (colIndex >= xIndexMin) &&
                               (colIndex <= xIndexMax));
                    }

                    return retVal;
                };




                /**
                 * Every widget has an appendTo() method.
                 * This is used to attach the HTML elements of the widget to a
                 * specified node in the HTML DOM.
                 *
                 * TODO(mikkor): image widgets have never followed
                 * traditional 'append widget to' design, but the widget
                 * gets its parent node inside the 'config' object.
                 *
                 * @param node {object} The HTML node that this widget is to
                 * attach itself to
                 * @method appendTo(node)
                 */
                _api.appendTo = function (node) {
                    if (node === undefined) {
                        throw new Error("appendTo - missing node parameter!");
                    }
                };

                /**
                 * Clones this Image widget and appends the cloned HTML
                 * elements to the specified node.
                 *
                 * @param node {object}  The HTML node that the cloned Image
                 * widget is to append itself to
                 * @method cloneTo(node)
                 * @return {object}      The cloned widget
                 */
                _api.cloneTo = function (node) {
                    if (node === undefined) {
                        throw new Error("cloneTo - missing node parameter!");
                    }

                    var clone = _factory.create(config,this);

                    if (clone.getNode() !== undefined) {
                        node.appendChild(clone.getNode());
                    }

                    return clone;
                };

                /**
                 * Sets the Image's display property
                 *
                 * @param display {string} The CSS display property value
                 * @method setDisplay(display)
                 */
                _api.setDisplay = function (display) {
                    if (_childNode !== undefined) {
                      _childNode.style.display = display;
                    }
                };

                /**
                 * Returns whether or not this floater widget can be selected.
                 * A Image cannot be selected for now, so this method returns
                 * false.
                 *
                 * @return {boolean} Returns false
                 * @method isSelectable()
                 */
                _api.isSelectable = function () {
                    return false;
                };


                _api.appendChild = function(childNode) {
                  // This parent / child system (and harcoded z) should be
                  // documented somewhere
                    if(_parentNode !== undefined && childNode !== undefined){
                        _parentNode.appendChild(childNode);
                        _childNode = childNode;
                        _childNode.style.zIndex = 47;

                    }
                };

                /**
                 * Removes the widget from the DOM.
                 *
                 * @param {node} contentNode doc fragment where deleted nodes
                 *     should be appended to
                 */
                _api.removeFromParent = function (contentNode) {
                  if (_childNode !== undefined) {
                    _childNode.removeElm();
                    if(contentNode) {
                      contentNode.appendChild(_childNode);
                    }
                  }
                };

                /**
                 * @api private
                 */
                var _init = function () {
                 if (cellToClone === undefined) {
                      _createDefaultImageWidget();
                   } else {
                     _createCloneImageWidget();
                   }
               };

               var _createDefaultImageWidget = function () {
                    _imageId = config.imageId;
                    _rotation=config.rot;
                    _parentNode = config.parentNode;
                    _api.populateAnchorData(config.anchor);
                };


                var _createCloneImageWidget = function () {

                     var cloneFloaterNode = cellToClone.getNode();
                     if (cloneFloaterNode !== undefined) {
                       //Venkat TODO: Do we need to use a new id?
                        _childNode = DomUtils.cloneNode(cloneFloaterNode, true);
                      }
                      _api.cloneAnchorData(cellToClone);
                      _imageId = cellToClone.getImageId();
                      _backgroundColor  = cellToClone.getBackgroundColor();
                };

               /**
                * Sets the image container's position, height and width in pixel
                *
                * NOTE: This function should be called only by the floater
                * drawing object. Any code outside the floater drawing object
                * should call updatePositionAndDimensions().
                *
                * @param {integer} topPos - Top left Y of the image in pixel.
                * @param {integer} leftPos - Top left X of the image in pixel.
                * @param {integer} height - Height of the image in pixel.
                * @param {integer} width - Width of the image in pixel.
                * @override
                */
                _api._setRectPosAndDimensions = function (topPos, leftPos,
                                                          height, width) {

                    topPos = Math.max(0, topPos);
                    leftPos = Math.max(0, leftPos);
                    height = Math.max(0, height);
                    width = Math.max(0, width);

                    _api.setTop(topPos);
                    _api.setLeft(leftPos);
                    _api.setHeight(height);
                    _api.setWidth(width);

                    if (_childNode) {
                        _childNode.style.top = topPos + "px";
                        _childNode.style.left = leftPos + "px";
                        _childNode.style.height = height + "px";
                        _childNode.style.width = width + "px";
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
