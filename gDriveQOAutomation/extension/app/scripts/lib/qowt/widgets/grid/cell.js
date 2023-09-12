/**
 * Cell
 * ======
 *
 * A cell widget encapsulates the part of the HTML DOM representing
 * a workbook that displays a cell in the grid's 'content' node.
 * The cell widget manages the construction and logic of the cell.
 *
 * A cell can have formatting and/or contain content, and the content
 * may be wrapped or may be bursted across neighbouring cells
 * This complexity is managed by constructing a cell using a number of
 * dedicated div elements:
 *
 * - A 'cell format' div is used to display the formatting properties of the
 *   cell, for example a blue background.
 *   If the cell doesn't have any non-default formatting then this div will not
 *   be created.
 *
 * - A 'cell content' div which is used to display the content of the cell,
 *   for example the text "£14.28".
 *   If the cell doesn't have any content then this div will not be created.
 *
 * - A 'bursting area' div which is used to allow the content of the cell to
 *   burst over neighbouring cells if need be.
 *   If the cell isn't able to burst over neighbouring cells (because the
 *   neighbouring cells themselves have content) or shouldn't burst over
 *   neighbouring cells (because the cell is wrapped) then this div will not be
 *   created.
 *   If a bursting div is created then the cell content div is appended as a
 *   child of it.
 *
 * Thus between 0 and 3 div elements are used to construct a cell, depending on
 * whatthe cell contains. The HTML structure of cells then looks as follows,
 * within the context of the 'content' div of a grid.
 *
 *      <div id="grid-content" class="grid-content">
 *          <div id="qowt-sheet-cell-format-3-5" class="qowt-sheet-cell-format"
 *             style="background-color:blue">
 *          </div>
 *          <div id="qowt-sheet-cell-content-3-5"
 *            class="qowt-sheet-cell-content">
 *              "Accounts"
 *          </div>
 *
 *          <div id="qowt-sheet-cell-burst-area-4-5"
 *                 class="qowt-sheet-cell-burst-area">
 *              <div id="qowt-sheet-cell-content-4-5"
 *                 class="qowt-sheet-cell-content">
 *                  "foobar"
 *              </div>
 *          </div>
 *
 *          <div id="qowt-sheet-cell-format-8-14"
 *            class="qowt-sheet-cell-format"
 *             style="border-left-color:yellow">
 *          </div>
 *          <div id="qowt-sheet-cell-burst-area-8-14"
 *                  class="qowt-sheet-cell-burst-area">
 *              <div id="qowt-sheet-cell-content-8-14"
 *                  class="qowt-sheet-cell-content">
 *                "John Doe Smith"
 *              </div>
 *          </div>
 *
 *          <div id="qowt-sheet-cell-content-72-75"
 *            class="qowt-sheet-cell-content">
 *              "120,000"
 *          </div>
 *
 *          <div id="qowt-sheet-cell-format-4-112"
 *            class="qowt-sheet-cell-format"
 *            style="background-color:red">
 *          </div>
 *      </div>
 *
 * There are 5 cells above:
 *
 * - The first cell (with coordinates 3,5) has a blue background and
 *   non-bursting content "Accounts"
 * - The second cell (with coordinates 4,5) has no formatting and content
 *   "foobar" that will burst if necessary
 * - The third cell (with coordinates 8,14) has a yellow left border and content
 *   "John Doe Smith" that will burst if necessary
 * - The fourth cell (with coordinates 72,75) has no formatting and non-bursting
 *   content "120,000"
 * - The fifth cell (with coordinates 4,112) has a red background and no content
 *
 * ###IMPORTANT NOTE
 * Widgets should cause no HTML render tree relayouts
 * to occur in their constructor. This is to prevent many expensive render tree
 * relayouts from occuring during the opening of a workbook or switching of a
 * sheet.
 * If a widget requires to perform operations that will result in a relayout of
 * the render tree then these operations should be captured in a 'layoutBlah()'
 * method in the widget's public API, so that the workbook layout control can
 * dictate when this method is called, at an appropriate moment to take the
 * 'hit' of render tree relayout costs.
 *
 * @constructor Note: the "contructor: is now just
 * Cell = Object.create(Object.prototype); this means that you need
 * to call "init(x, y, config, cellToClone)" to properly initialize the object.
 *
 * init has the following parameters:
 * @param x {integer}     Mandatory parameter indicating the x-index of the cell
 * @param y {integer}     Mandatory parameter indicating the y-index of the cell
 * @param config {object} Mandatory parameter that contains the layout info of
 *                        the cell
 *
 * The config object has the following properties:
 *
 * - cellTopPos {integer}             The top position of the cell
 * - cellHeight {integer}             The height of the cell
 * - cellLeftPos {integer}            The left position of the cell
 * - cellWidth {integer}              The width of the cell
 * - burstingAreaStart {integer}      The start position of the bursting area
 *                                    for the cell
 * - burstingAreaEnd {integer}        The end position of the bursting area for
 *                                    the cell
 * - isWrapText {boolean}             Boolean that indicates whether this cell's
 *                                    text is wrapped or not
 * - cellText {string}                The text in the cell, if it has any.
 * - editableText {string}            The editable text in the cell, if any.
 * - backgroundColor {string}         The cell background color, as a value
 *                                    between '#000000'-'#FFFFFF'
 * - leftNeighbour {integer}          The column index of the nearest
 *                                    neighbouring cell with content to the left
 *                                    of this cell.
 * - rightNeighbour {integer}         The column index of the nearest
 *                                    neighbouring cell with content to the
 *                                    right of this cell
 * - horizontalAlign {string}         The horizontal alignment of the cell
 * - verticalAlign {string}           The vertical alignment of the cell
 * - borders {object}                 An object container of border information
 *                                    for the cell
 * - formatting {object}              The formatting information for the cell.
 *                                    Note that the service currently returns
 *                                    merged formatting data for cells with
 *                                    content. So formatting may come from the
 *                                    cell, row, column or default information.
 *                                    Hence there is no need to do anything
 *                                    additional here.
 * - isMergeAnchor {boolean}          Whether or not this cell is the anchor
 *                                    cell (top left) of a merge range
 *
 * @param cellToClone {object}        Optional parameter which is an existing
 *                                    cell widget that the new cell widget is to
 *                                    be cloned from
 *
 * @return {object}                   A Cell widget.
 * @see                               speclets/cellBurstingDefinition.markdown
 *                                    and speclets/cellBursting.markdown
 */
define([
    'qowtRoot/dcp/decorators/borderDecorator',
    'qowtRoot/dcp/decorators/backgroundDecorator',
    'qowtRoot/dcp/decorators/textDecorator',
    'qowtRoot/dcp/decorators/cellDecorator',
    'qowtRoot/dcp/decorators/textRotationDecorator',
    'qowtRoot/dcp/decorators/alignmentDecorator',
    'qowtRoot/variants/configs/sheet',
    'qowtRoot/models/sheet'
], function(
  BorderDecorator,
  BackgroundDecorator,
  TextDecorator,
  CellDecorator,
  TextRotationDecorator,
  AlignmentDecorator,
  SheetConfig,
  SheetModel) {

  'use strict';

  /***************************************
   *          Public Methods             *
   **************************************/

  /**
   * @constructor
   */
  var Cell = Object.create(Object.prototype);

  /**
  * Initialize the object after creation.
  *
  * @param {integer}  x Column number that the cell is going into.
  * @param {integer}  y Row number that the cell is going into.
  * @param {} config  Object returned from core that specifies all sorts of
                      cell properties when the object is being created.
  * @param {Cell}     Cell object that you want to clone properties out of.
  *
  * @return {Cell} this object - useful for chaining.
  */
  Cell.init = function (x, y, config, cellToClone) {

    this.initProperties_();

    if (cellToClone === undefined) {
      this.createDefaultCell_(x, y, config, cellToClone);
    } else {
      this.createClonedCell_(cellToClone);
    }

    return this;
  };

  /**
   * Updates the cell's positional deployment information.
   *
   * @param rect {object} An object which is comprised of any combination of
   * the following optional attributes:
   *
   * - top {integer} The top position of the cell
   * - left {integer} The left position of the cell
   * - height {integer} The height of the cell
   * - width {integer} The width of the cell
   *
   * @param burstAreaStart {integer} The start position of the bursting area
   * of the cell
   * @param burstAreaEnd {integer} The end position of the bursting area of
   * the cell
   *
   */
  Cell.updatePositionAndDimensions = function(rect,
                                              burstAreaStart,
                                              burstAreaEnd) {
    if (undefined !== burstAreaStart) {
      this.burstAreaStart_ = burstAreaStart;
      this.config_.burstingAreaStart = this.burstAreaStart_;
    }

    if (undefined !== burstAreaEnd) {
      this.burstAreaEnd_ = burstAreaEnd;
      this.config_.burstAreaEnd = this.burstAreaEnd_;
    }

    this.setRects_(rect);
    this.setCellFormatDivRect_();
    this.setupCellContentDivRect_();
    this.setCellBurstAreaDivPosAndDimensions_();
    this.setVisible_(this.outerRect_.width !== 0 &&
        this.outerRect_.height !== 0);
  };

  /**
   * Every widget has an appendTo() method.
   * This is used to append the HTML elements of the widget to a specified
   * node in the HTML DOM. Here the cell's format div element, if it exists,
   * is appended as a child to the specified node and the cell's burst area
   * div element or content div element, if either exists, is appended as
   * a child to the specified node
   *
   * @param node {object} The HTML node that this widget is to append itself
   */
  Cell.appendTo = function(node) {
    if (node === undefined) {
      throw ("appendTo - missing node parameter!");
    }

    // append the formatting node
    if (this.formatNode_ !== undefined) {
      node.appendChild(this.formatNode_);
    }

    // if we have a burst area node then append it (it will contain the
    // content node), otherwise just add the content node if there is one
    if (this.burstAreaNode_ !== undefined) {
      node.appendChild(this.burstAreaNode_);
    } else if (this.contentNode_ !== undefined) {
      node.appendChild(this.contentNode_);
    }
  };

  /**
   * This is used to remove the HTML elements of the widget from their
   * parent node in the HTML DOM. Here the cell's format div element, if it
   * exists, is removed as a child from the parent node and the cell's burst
   * area div element or content div element, if either exists, is removed as
   * a child from the parent node
   *
   * @param {node} contentNode doc fragment where deleted nodes should be
   *     appended to
   */
  Cell.removeFromParent = function(contentNode) {
    // remove the formatting node
    if (this.formatNode_ !== undefined) {
      this.formatNode_.removeElm();
      if(contentNode) {
        contentNode.appendChild(this.formatNode_);
      }
    }
    // if we have a burst area node then remove it (it will contain the
    // content node), otherwise just remove the content node if there is one.
    if (this.burstAreaNode_ !== undefined) {
      this.burstAreaNode_.removeElm();
      if(contentNode) {
        contentNode.appendChild(this.burstAreaNode_);
      }
    } else if (this.contentNode_ !== undefined) {
      this.contentNode_.removeElm();
      if(contentNode) {
        contentNode.appendChild(this.contentNode_);
      }
    }
  };

  /**
   * Clones this cell widget and appends the cloned HTML elements to the
   * specified node. The cloned format div element, if it exists, is
   * appended as a child to the specified node and the cloned burst area div
   * element or cloned content div element, if either exists, is appended
   * as a child to the specified node
   *
   * @param node {object}   The HTML node that the cloned widget is to append
   *                        itself to
   * @return {object}      The cloned widget
   */
  Cell.cloneTo = function(node) {
    if (node === undefined) {
      throw ("cloneTo - missing node parameter!");
    }

    var clone = Object.create(Cell).init(this.x, this.y, this.config_, this);

    if (clone.formatNode_) {
      node.appendChild(clone.formatNode_);
    }

    if (clone.burstAreaNode_ !== undefined) {
      node.appendChild(clone.burstAreaNode_);
    } else if (clone.contentNode_ !== undefined) {
      node.appendChild(clone.contentNode_);
    }

    return clone;
  };

  Cell.hasBackgroundColor = function() {
    return this.config_.backgroundColor ? true : false;
  };

  Cell.fontFaceIndex = function() {
    return this.config_.formatting ? this.config_.formatting.fi : undefined;
  };

  Cell.fontFace = function() {
    return this.config_.formatting ? this.config_.formatting.font : undefined;
  };

  Cell.fontSize = function() {
    return this.config_.formatting ? this.config_.formatting.siz : undefined;
  };

  Cell.hasBold = function() {
    return this.config_.formatting ? this.config_.formatting.bld : false;
  };

  Cell.hasUnderline = function() {
    return this.config_.formatting ? this.config_.formatting.udl : false;
  };

  Cell.hasStrikethrough = function() {
    return this.config_.formatting ?
       this.config_.formatting.strikethrough : false;
  };

  Cell.hasItalic = function() {
    return this.config_.formatting ? this.config_.formatting.itl : false;
  };

  Cell.hasVAlignTop = function() {
    return this.vAlignment ?
        this.vAlignment === 'top' :
        false;
  };

  Cell.hasVAlignCenter = function() {
    return this.vAlignment ?
        this.vAlignment === 'centre' :
        false;
  };

  Cell.hasVAlignBottom = function() {
    return this.vAlignment ?
        this.vAlignment === 'bottom' :
        false;
  };

  Cell.hasHAlignLeft = function() {
    return this.hAlignment ?
        this.hAlignment === 'left' :
        false;
  };

  Cell.hasHAlignCenter = function() {
    return this.hAlignment ?
        this.hAlignment === 'centre' :
        false;
  };

  Cell.hasHAlignRight = function() {
    return this.hAlignment ?
        this.hAlignment === 'right' :
        false;
  };

  Cell.cacheCellContentHeight = function() {
    if (this.contentNode_) {
      if (this.isRotationApplied()) {
        var scale = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
        var height = this.contentNode_.getBoundingClientRect().height / scale;
        height = Math.max(height + this.innerAdornments_.top +
            this.innerAdornments_.bottom, 0);
        this.contentHeight_ = height;
      } else {
        this.contentHeight_ = Math.max(this.contentNode_.scrollHeight +
            this.innerAdornments_.top + this.innerAdornments_.bottom, 0);
      }
    } else if (this.formatNode_) {
      this.contentHeight_ = Math.max(this.formatNode_.scrollHeight +
          this.innerAdornments_.top + this.innerAdornments_.bottom, 0);
    }
  };


  Cell.cacheCellContentWidth = function() {
    if (this.contentNode_) {
      var scrollWidth = this.contentNode_.scrollWidth;
      if (scrollWidth > this.outerRect_.width) {
        this.contentWidth_ = Math.max(scrollWidth +
          (this.innerAdornments_.left + this.innerAdornments_.right), 0);
      }
    }
  };

  Cell.hasWrapText = function() {
    return this.config_.formatting ? this.config_.formatting.wrapText : false;
  };

  Cell.getConfig = function() {
    return this.config_;
  };

  Cell.hasHyperlink = function() {
    return this.config_.hyperlink;
  };

  Cell.getHyperlinkType = function() {
      return this.config_.hyperlinkType;
    };
  Cell.getHyperlinkTarget = function() {
      return this.config_.hyperlinkTarget;
    };

  Cell.prepBorders = function() {
    if (this.formatNode_) {
      if (this.config_.borders && !this.applyBorders_) {
        this.applyBorders_ = true;
      }
    }
  };


  /**
   * Returns the HTML element representing content node of the cell
   *
   * @return {object} - The HTML element object
   */
  Cell.getContentNode = function() {
    return this.contentNode_;
  };

  Cell.getEditableText = function() {
    return this.editableText_;
  };

  Cell.getBorderSizes = function() {
    return this.borderSizes_;
  };

  /**
   * Updates cell's internal row index and updates it's inner nodes with the new
   * index. This can happen after a row insertion / deletion operation.
   *
   * @param idy {integer} New row index to be used
   */
  Cell.updateRowIndex = function(idy) {
    if(idy !== undefined) {
      this.y = idy;
    }
    this.updateNodeId_();
  };

  /**
   * Updates cell's internal col index and updates it's inner nodes with the new
   * index. This can happen after a col insertion / deletion operation.
   *
   * @param idx {integer} New col index to be used
   */
  Cell.updateColumnIndex = function(idx) {
    if(idx !== undefined) {
      this.x = idx;
    }
    this.updateNodeId_();
  };

  /****************************************
   *          Private Methods             *
   ***************************************/

  /**
  * Initialize the object properties after creation.
  *
  * @return {Cell} this object - useful for chaining.
  */

  Cell.initProperties_ = function () {

    var defaultDescriptor = {
        writable: true
    };

    /*!
     * Public properties
     */
    var publicProperties_ = {

      x: defaultDescriptor,
      y: defaultDescriptor,

      /**
       * WARNING: Gets the cell's width causes a relayout of the HTML DOM
       * render tree!
       */
      width: {
        get: function() {
          return Math.max(this.contentNode_.offsetWidth +
            (this.innerAdornments_.left + this.innerAdornments_.right), 0);
        },
        set: function(width) {
          this.updatePositionAndDimensions({
            width: width
          });
        }
      },

      height: {
        set: function(height) {
          this.updatePositionAndDimensions({
            height: height
          });
        }
      },

      contentHeight: {
        get: function() {
          return this.contentHeight_;
        }
      },

      contentWidth: {
        get: function() {
          return this.contentWidth_;
        }
      },

      topPosition: {
        set: function(pos) {
          this.updatePositionAndDimensions({
            top: pos
          });
        }
      },

      leftPosition: {
        set: function(pos) {
          this.updatePositionAndDimensions({
            left: pos
          });
        }
      },

      textColor: {
        get: function() {
          return this.config_.formatting ? this.config_.formatting.clr :
            undefined;
        }
      },

      backgroundColor: {
        get: function() {
          return this.config_.formatting ? this.config_.formatting.bg :
            undefined;
        }
      },

      numberFormat: {
        get: function() {
          return this.config_.formatting && this.config_.formatting.nf ?
            this.config_.formatting.nf : "General";
        }
      },

      cellText:             defaultDescriptor,
      leftNeighbourIndex:   defaultDescriptor,
      rightNeighbourIndex:  defaultDescriptor,
      hAlignment:           defaultDescriptor,
      vAlignment:           defaultDescriptor,
      rotationAngle:        defaultDescriptor

    }; // publicProperties_


    // Private properies
    var privateProperties_ = {

      // Private properties
      formatNode_:      defaultDescriptor,
      burstAreaNode_:   defaultDescriptor,
      contentNode_:     defaultDescriptor,
      burstAreaStart_:  defaultDescriptor,
      burstAreaEnd_:    defaultDescriptor,
      needsBurstNode_:  defaultDescriptor,
      isWrapText_:       defaultDescriptor,
      borderSizes_:     defaultDescriptor,
      innerRect_:       defaultDescriptor,
      outerRect_:       defaultDescriptor,
      innerAdornments_: defaultDescriptor,
      editableText_:    defaultDescriptor,
      config_:          defaultDescriptor,
      contentHeight_:      defaultDescriptor,
      contentWidth_:    defaultDescriptor,
      applyBorders_:    defaultDescriptor
    }; // privateProperties_

    Object.defineProperties(this, publicProperties_);
    Object.defineProperties(this, privateProperties_);

    return this;
  };

  /**
   * @api private
   */
  Cell.createDefaultCell_ = function(x, y, config) {
    if ((x === undefined) || (y === undefined) || (config === undefined)) {
      throw ("Cell.createDefaultCell_ - missing constructor parameters!");
    }

    this.config_ = config;
    this.innerRect_ = {};
    this.outerRect_ = {};

    this.x = x;
    this.y = y;
    this.leftNeighbourIndex = config.leftNeighbour;
    this.rightNeighbourIndex = config.rightNeighbour;
    this.burstAreaStart_ = config.burstingAreaStart;
    this.burstAreaEnd_ = config.burstingAreaEnd;
    this.isWrapText_ = config.isWrapText || false;

    this.hAlignment = this.mapHorizontalAlignment_(config);
    this.vAlignment = this.mapVerticalAlignment_(config);
    this.rotationAngle = config.rotationAngle;

    this.needsBurstNode_ = false;
    if (!this.isWrapText_) {
      switch (this.hAlignment) {
        case 'right':
          // For a right aligned cell, it can burst if the nearest
          // cell to its left that contains content is further
          // than the column immediately to its left
          this.needsBurstNode_ = config.leftNeighbour < (this.x - 1);
          break;

        case 'centre':
          //We don't create the burst node for centre align.We handle the
          // alignment in the content node itself.
          //TODO: remove creation of burst node for left/right align too.
          this.needsBurstNode_ = false;
          break;

        default:
          // For a left aligned cell (ie default), it can burst if the
          // nearest cell to its right that contains content is further than
          // the column immediately to its right
          this.needsBurstNode_ = config.rightNeighbour > (this.x + 1);
          break;
      }
    }

    // if the cell has a background or border formatting then create a cell
    // format div
    if ((config.backgroundColor) || (config.borders)) {
      this.createCellFormatDiv_();
    }

    // now we have info on the border widths (as well as the cell outer size),
    // we can work out the area inside the borders/gridlines
    // IMPORTANT: This is called before creating the inner cell divs (they
    // rely on innerRect_ to be calculated)
    this.initGridlineOrBorderCompensation_();

    // if the cell has content, then create a content div, and a bursting
    // area div if required
    // NOTE: No need to create text divs if this is the merge anchor, as
    // text will be shown instead on an overlay floater widget (at higher
    // z-index)
    // Note: We can't just pass in an undefined config.cellText in the
    // case of a merge anchor, since we need to be able to return the text
    // in getCellText() for selections - e.g. selecting the anchor cell that
    // is underneath a chart
    this.cellText = config.cellText;
    this.editableText_ = config.editableText;

    if (this.cellText) {
      this.createCellContentDiv_();
      if (this.isBurstAreaNodeRequired()) {
        this. createBurstAreaDiv_();
        this.burstAreaNode_.appendChild(this.contentNode_);
      }

      this.setAlignment_();

      if (!this.isWrapText_) {
        // like 'nowrap', 'pre' does not allow wrapping, but preserve white
        // space
        this.contentNode_.style['white-space'] = 'pre';
      }
    }

    var rect = {
      top: config.cellTopPos,
      left: config.cellLeftPos,
      width: config.cellWidth,
      height: config.cellHeight
    };

    this.updatePositionAndDimensions(rect);

  };

  /**
   * @api private
   */
  Cell.createClonedCell_ = function(cellToClone) {

    var cloneFormatNode = cellToClone.formatNode_;
    if (cloneFormatNode !== undefined) {
      //LM TODO: Do we need to use a new id?
      this.formatNode_ = cloneFormatNode.cloneNode(true);
    }

    var cloneBurstAreaNode = cellToClone.burstAreaNode_;
    if (cloneBurstAreaNode !== undefined) {
      //LM TODO: Do we need to use a new id?
      this.burstAreaNode_ = cloneBurstAreaNode.cloneNode(true);
    }

    var cloneContentNode = cellToClone.contentNode_;
    if (cloneContentNode !== undefined) {
      //LM TODO: Do we need to use a new id?
      this.contentNode_ = cloneContentNode.cloneNode(true);
    }

    this.x = cellToClone.x;
    this.y = cellToClone.y;
    this.config_ = cellToClone.config_;
    this.burstAreaStart_ = cellToClone.burstAreaStart_;
    this.burstAreaEnd_ = cellToClone.burstAreaEnd_;
    this.needsBurstNode_ = cellToClone.needsBurstNode_;
    this.isWrapText_ = cellToClone.isWrapText_;
    this.hAlignment = cellToClone.hAlignment;
    this.vAlignment = cellToClone.vAlignment;
    this.borderSizes_ = cellToClone.borderSizes_;
    this.innerRect_ = cellToClone.innerRect_;
    this.outerRect_ = cellToClone.outerRect_;
    this.innerAdornments_ = cellToClone.innerAdornments_;
    this.cellText = cellToClone.cellText;
    this.editableText_ = cellToClone.getEditableText();
    this.leftNeighbourIndex = cellToClone.leftNeighbourIndex;
    this.rightNeighbourIndex = cellToClone.rightNeighbourIndex;
  };

  /**
   * Sets the cells burstArea, contentNode, formatNode display property
   *
   * @param visible {boolean} true if visible, false if not
   *
   * @api private
   */
  Cell.setVisible_ = function(visible) {
    var display = visible ? '' : 'none';
    if (this.burstAreaNode_ !== undefined) {
      this.burstAreaNode_.style.display = display;
    }
    if (this.contentNode_ !== undefined) {
      this.contentNode_.style.display = display;
    }
    if (this.formatNode_ !== undefined) {
      this.formatNode_.style.display = display;
    }
  };

  /**
   * Creates a cell format div to display the background color and border
   * styling of the cell
   *
   * @api private
   */
  Cell.createCellFormatDiv_ = function() {

    var _kFormat_Node = {
      Tag: 'div',
      Class: 'qowt-sheet-cell-format',
      Position: 'absolute'
    };

    this.formatNode_ = document.createElement(_kFormat_Node.Tag);
    this.formatNode_.id = this.x + "-" + this.y;
    this.formatNode_.classList.add(_kFormat_Node.Class);

    var bkgDecorator = BackgroundDecorator.create(this.formatNode_);
    bkgDecorator.decorate(this.config_.backgroundColor);
    this.formatNode_.style.position = _kFormat_Node.Position;
  };

  /**
   * Updates the cell format div's positional deployment information.
   *
   * - top {integer} The top position of the cell
   * - left {integer} The left position of the cell
   * - height {integer} The height of the cell
   * - width {integer} The width of the cell
   *
   * @api private
   */
  Cell.setCellFormatDivRect_ = function() {
    if (this.formatNode_) {
      this.formatNode_.style.top = this.outerRect_.top + "px";
      this.formatNode_.style.left = this.outerRect_.left + "px";
      this.formatNode_.style.height = this.outerRect_.height + "px";
      this.formatNode_.style.width = this.outerRect_.width + "px";
      if (this.applyBorders_) {
        this.applyBorders_ = false;
        this.borderSizes_ = BorderDecorator.decorate(this.formatNode_,
          this.config_.borders);
      }
    }
  };

  /**
   * Creates a cell content div to display the content of the cell
   *
   * @param canBurst {boolean} A flag indicating whether this cell is able
   * to burst or not
   * @api private
   */
  Cell.createCellContentDiv_ = function() {

    var _kContent_Node = {
      Tag: "div",
      Class: "qowt-sheet-cell-content"
    };

    this.contentNode_ = document.createElement(_kContent_Node.Tag);
    this.contentNode_.id = this.x + "-" + this.y;
    this.contentNode_.classList.add(_kContent_Node.Class);

    if (this.config_.isMergeAnchor) {
      // Don't render text in anchor cell widget under merge widget, or it'll
      // burst or wrap underneath the merge cell. This is safest & easiest,
      // the single character nbsp allows single line height calculation based
      // on font height for the merge cell, without affecting anything else.
      this.contentNode_.innerHTML = "&nbsp;";
    } else if (this.cellText) {
      this.contentNode_.textContent = this.cellText ? this.cellText : "&nbsp;";
    }

    var gridFonts = SheetModel.fontNames;
    if (this.config_ && this.config_.formatting && gridFonts) {
      var fontIndex = this.config_.formatting.fi;
      if (fontIndex < gridFonts.length) {
        this.config_.formatting.font = gridFonts[fontIndex].toLowerCase();
      }
    }

    TextDecorator.decorate(this.contentNode_, this.config_.formatting);
    CellDecorator.decorate(this.contentNode_, this.config_.formatting);
  };

  Cell.setupCellContentDivRect_ = function() {
    if (this.contentNode_) {
      if (this.isBurstAreaNodeRequired()) {
        // if it can burst, make it relative as it will live inside a burst area
        this.contentNode_.style.position = 'relative';
        if (this.rotationAngle && this.contentNode_.parentNode &&
            !this.isWrapText_) {
          var scale = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
          TextRotationDecorator.decorate(this.contentNode_, this.hAlignment,
              this.vAlignment, this.rotationAngle, scale);
        }
      } else {
        this.contentNode_.style.position = 'absolute';
        this.contentNode_.style.top = this.innerRect_.top + "px";
        if (this.isRowHeightUserDefined_) {
          this.contentNode_.style.height = this.innerRect_.height + "px";
        } else {
          this.contentNode_.style.height = "auto";
        }
        this.disableBursting_(this.contentNode_);
      }

      if (this.contentWidth) {
        switch (this.hAlignment) {
          case 'centre':
            this.burstToLeftAndRight_(this.contentNode_, this.burstAreaStart_,
              this.burstAreaEnd_);
            break;
          // TODO: Add the default case, left align and right align once we
          // handle them without creating the burst node.
        }
      }
    }
  };

  /**
   * Creates a cell bursting area div to display the bursted area of the cell
   * @api private
   */
  Cell.createBurstAreaDiv_ = function() {

    var _kBurst_Area_Node = {
      Tag: 'div',
      Class: "qowt-sheet-cell-burst-area",
      Position: 'absolute'
    };

    this.burstAreaNode_ = document.createElement(_kBurst_Area_Node.Tag);
    this.burstAreaNode_.id = this.x + "-" + this.y;
    this.burstAreaNode_.classList.add(_kBurst_Area_Node.Class);
    this.burstAreaNode_.style.position = _kBurst_Area_Node.Position;
  };

  Cell.setCellBurstAreaDivPosAndDimensions_ = function() {
    if (this.burstAreaNode_) {

      this.burstAreaNode_.style.top = this.innerRect_.top + "px";
      if (this.isRowHeightUserDefined_) {
        this.burstAreaNode_.style.height = this.innerRect_.height + "px";
      } else {
        this.burstAreaNode_.style.height = "auto";
      }
      this.burstAreaNode_.style.minHeight = this.innerRect_.height + "px";
      this.burstAreaNode_.style.width = "auto";

      switch (this.hAlignment) {
        case 'justified':
          this.disableBursting_(this.burstAreaNode_);
          break;

        case 'right':
          this.burstToLeft_(this.burstAreaNode_, this.burstAreaStart_);
          break;

        default:
          this.burstToRight_(this.burstAreaNode_, this.burstAreaEnd_);
          break;
      }
    }
  };

  /**
   * Configures the specified node to not burst its content
   * @api private
   */
  Cell.disableBursting_ = function(node) {
    node.style.left = this.innerRect_.left + "px";
    node.style.width = this.innerRect_.width + "px";
  };

  /**
   * Calculate the area of the cell which does not include the gridlines or
   * borders (ie. the space inside this).
   * Note: requires info on the borders & the cell outer rectangle to be up
   * to date. Sets some internal object on the cell to hold this information
   * @api private
   */
  Cell.initGridlineOrBorderCompensation_ = function() {

    this.innerAdornments_ = {};
    this.innerAdornments_.left = SheetConfig.kGRID_GRIDLINE_WIDTH +
      SheetConfig.kDEFAULT_CELL_PADDING;
    this.innerAdornments_.right = SheetConfig.kGRID_GRIDLINE_WIDTH +
      SheetConfig.kDEFAULT_CELL_PADDING;
    this.innerAdornments_.top = SheetConfig.kGRID_GRIDLINE_WIDTH;
    this.innerAdornments_.bottom = SheetConfig.kGRID_GRIDLINE_WIDTH;

    if (this.borderSizes_ !== undefined) {
      this.innerAdornments_.left = Math.max(this.innerAdornments_.left,
        this.borderSizes_.left);
      this.innerAdornments_.right = Math.max(this.innerAdornments_.right,
        this.borderSizes_.right);
      this.innerAdornments_.top = Math.max(this.innerAdornments_.top,
        this.borderSizes_.top);
      this.innerAdornments_.bottom = Math.max(this.innerAdornments_.bottom,
        this.borderSizes_.bottom);
    }
  };

  /**
   * Updates the innerRect_ and outerRect_
   *
   * @param rect {object} An object which is comprised of any combination of
   * the following optional attributes:
   *
   * - top {integer} The top position of the cell
   * - left {integer} The left position of the cell
   * - height {integer} The height of the cell
   * - width {integer} The width of the cell
   *
   * @api private
   */
  Cell.setRects_ = function(rect) {
    if (rect.top !== undefined) {
      this.innerRect_.top = rect.top + this.innerAdornments_.top;
      this.outerRect_.top = rect.top;
    }
    if (rect.left !== undefined) {
      this.innerRect_.left = rect.left + this.innerAdornments_.left;
      this.outerRect_.left = rect.left;
    }
    // Negative values for height and width are not allowed
    if (rect.height !== undefined) {
      this.innerRect_.height =
          Math.max(rect.height - this.innerAdornments_.top -
        this.innerAdornments_.bottom, 0);
      this.outerRect_.height = rect.height;
    }
    if (rect.width !== undefined) {
      this.innerRect_.width =
          Math.max(rect.width - this.innerAdornments_.left -
        this.innerAdornments_.right, 0);
      this.outerRect_.width = rect.width;
    }
  };

  /**
   * Configures the specified node so that it can burst its content to the left
   * up to the nearest cell to the left that itself contains content
   * @api private
   */
  Cell.burstToLeft_ = function(node, burstAreaStart) {
    // AC_note : in the below calc, we limit bursting on the LEFT edge using
    // the grid line width, however if that cell had a LEFT border bigger
    // than grid line width we will be drawing over the top of it.
    node.style.left =
        (burstAreaStart + SheetConfig.kGRID_GRIDLINE_WIDTH) + "px";
    node.style.width = ((this.innerRect_.left + this.innerRect_.width) -
      (burstAreaStart + SheetConfig.kGRID_GRIDLINE_WIDTH)) + "px";
    // For bursting to the left, due to how the html box model works, we can
    // not get the bursting area to grow along with the content using the
    // maxWidth trick. Because of this we have to set it to the full
    // bursting size, and ensure the background is not set to white because
    // we do not want to eliminate ALL grid lines in the bursting area.
    // to correct this we will have to resize this bursting area at a safe
    // time (ie not inside the dcp loop)
    // JELTE TODO: we are getting in to the realm of too much magic here...
    // knowing when and why to reset
    // grid lines etc is crap... we need to modularise this more so that
    // it's better known who does what and why
    node.style.backgroundColor = "transparent";
  };

  /**
   * Configures the specified node so that it can burst its content to the right
   * up to the nearest cell to the right that itself contains content
   * @api private
   */
  Cell.burstToRight_ = function(node, burstAreaEnd) {
    node.style.left = this.innerRect_.left + "px";
    // AC_note : in the below calc, we limit bursting on the RIGHT edge
    // using the grid line width, however if that cell had a RIGHT border
    // bigger than grid line width we will be drawing over the top of it.
    node.style.maxWidth = (burstAreaEnd - this.innerRect_.left -
        SheetConfig.kGRID_GRIDLINE_WIDTH) + "px";
  };

  /**
   * Configures the specified node so that it can burst its content to the left
   * up to the nearest cell to the left that itself contains content, and to the
   * right up to the nearest cell to the right that itself contains content
   * @api private
   */
  Cell.burstToLeftAndRight_ = function(node, burstAreaStart, burstAreaEnd) {
    var offsetWidth = this.contentWidth_ / 2;

    node.style.left = this.innerRect_.left + this.innerRect_.width / 2 -
      offsetWidth + SheetConfig.kGRID_GRIDLINE_WIDTH + 'px';

    node.style.width = this.contentWidth_;
    node.style.maxWidth = this.innerRect_.left + this.innerRect_.width +
      offsetWidth - SheetConfig.kGRID_GRIDLINE_WIDTH + 'px';

    var nodeLeft = parseInt(node.style.left, 10);
    var rightClipArea = burstAreaEnd - nodeLeft -
      SheetConfig.kGRID_GRIDLINE_WIDTH + 'px';
    var leftClipArea = burstAreaStart - nodeLeft +
      SheetConfig.kGRID_GRIDLINE_WIDTH + 'px';
    node.style.clip = 'rect( auto ' + rightClipArea + ' auto ' + leftClipArea +
      ')';
  };

  /**
   * Sets the horizontal and/or vertical alignment of the cells contents
   * Note that this only has visible effect on cells which have text content
   * @api private
   */
  Cell.setAlignment_ = function() {
    if (this.contentNode_ !== undefined) {
      var nodeToApplyAlignmentOn = this.isBurstAreaNodeRequired() ?
          this.burstAreaNode_ :
          this.contentNode_;
      var alignmentDecorator =
          AlignmentDecorator.create(nodeToApplyAlignmentOn);
      alignmentDecorator.decorate(this.hAlignment, this.vAlignment);
    }
  };

  /**
   * @api private
   */
  Cell.mapHorizontalAlignment_ = function(config) {
    var retVal;

    switch (config.horizontalAlign) {
      case 'r':
      case 'right':
        retVal = 'right';
        break;
      case 'c':
      case 'centre':
        retVal = 'centre';
        break;
      case 'j':
      case 'justified':
        retVal = 'justified';
        break;
      default:
        retVal = 'left';
        break;
    }

    config.horizontalAlign = retVal;

    return retVal;
  };

  /**
   * @api private
   */
  Cell.mapVerticalAlignment_ = function(config) {
    var retVal;

    switch (config.verticalAlign) {
      case 't':
      case 'top':
        retVal = 'top';
        break;
      case 'c':
      case 'centre':
        retVal = 'centre';
        break;
      default:
        retVal = 'bottom';
        break;
    }

    config.verticalAlign = retVal;

    return retVal;
  };

  /**
   * @api private
   */
  Cell.updateNodeId_ = function() {
    if(this.burstAreaNode_) {
      this.burstAreaNode_.id = this.x + "-" + this.y;
    }
    if(this.formatNode_) {
      this.formatNode_.id = this.x + "-" + this.y;
    }
    if(this.contentNode_) {
      this.contentNode_.id = this.x + "-" + this.y;
    }
  };

  /**
   * Sets if the parent row has user defined height or not.
   * @param isRowHeightUserDefined - true if the height of the parent row is
   *                                 user defined false otherwise.
   */
  Cell.setRowHeightUserDefined = function(isRowHeightUserDefined) {
    this.isRowHeightUserDefined_ = isRowHeightUserDefined;
  };

  /**
   * Returns true if cell can burst or cell has rotated text, burstAreaNode is
   * required for rotated text to work with different alignment applied to cell.
   *
   */
  Cell.isBurstAreaNodeRequired = function() {
    return (this.needsBurstNode_ || this.rotationAngle);
  };

  /**
   * Returns true if rotation is applied to cell, otherwise false.
   * @return {boolean}
   */
  Cell.isRotationApplied = function() {
    var result = false;
    var cssWebkitTransformStringValue;
    if (this.contentNode_) {
      cssWebkitTransformStringValue = this.contentNode_.style.webkitTransform;

      // Make sure to have check for rotation only as webkitTransform can have
      // other properties like scale, translation.
      if (cssWebkitTransformStringValue &&
          cssWebkitTransformStringValue.search(/rotate/) !== -1) {
        result = true;
      }
    }
    return result;
  };

  return Cell;

}); // define
