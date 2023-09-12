/**
 *
 * Point table cell handler
 *
 * JSON --
 *
 * {
 * "etp" : "pTbleC",
 * "eid" : <id>,
 * "gridSpan" :  <grid span>,  // number
 * "hMerge" :  <boolean> ,
 * "rowSpan" : <row span>, // number
 * "vMerge" :  <boolean>,
 * "tcPr" : <table cell properties JSON>,
 * "txBody" :  <shape text body JSON>
 * }
 *
 *
 * Cell properties JSON --
 * {
 * "fill" : <noFill> / <solid Fill JSON> / <gradient fill JSON>,
 * "lnB" :  <Outline JSON>,
 * "lnL" :  <Outline JSON>,
 * "lnT" :  <Outline JSON>,
 * "lnR" :  <Outline JSON>,
 * "lnBlToTr" :  <Outline JSON>,
 * "lnTlToBr" :  <Outline JSON>
 * }
 *
 *
 * outline json --
 * {
 "id": <id>,
 "fill": <solid fill JSON>,
 "w":<line-width>,
 "algn": <ctr> / <in>,
 "cap": <flat> / <rnd> / <sq>
 "cmpd": <sng> / <dbl> / <thickThin> / <thinThick> / <tri>
 "prstDash": <dash> / <dashDot> / <dot> / <lgDash> / <lgDashDot> /
             <lgDashDotDot> / <solid> / <sysDash> / <sysDashDot> /
             <sysDashDotDot> / <sysDot>
 }
 *
 */

define([
  'qowtRoot/utils/idGenerator',
  'qowtRoot/dcp/decorators/outlineDecorator',
  'qowtRoot/models/point',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager'], function(
    IdGenerator,
    OutlineDecorator,
    PointModel,
    TableStyleManager) {

  'use strict';


  var _RECT_SHAPE_PRESET_ID = 88; // Constant holding rect shape preset id
  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'pTbleC',

    /**
     * Visit method which contribute in DCP manager's visitor pattern for
     * rendering table cell
     * @param v visitable object as passed by DCP manager
     */
    visit: function(v) {
      // console.log("Inside PointTableCell handler - visit method");

      if (v && v.el && v.el.eid && v.el.etp && (v.el.etp === _api.etp)) {

        //We start processing of table cell so set the flag to true
        //This will be set to false after the processing of cell shape and text
        // body is complete in ShapeTextBodyHandler class
        PointModel.currentTable.isProcessingTable = true;

        //Set the currentRow and curretColumn
        PointModel.currentTable.currentRow = v.el.row;
        PointModel.currentTable.currentCol = v.el.col;

        var cell = _createCellElement(v.el.eid, v.el.gridSpan, v.el.rowSpan);

        // IF hMerge or vMerge are true then cell is merged with other. don't
        // render (i.e. set display to 'none' using css selector)
        if (v.el.hMerge || v.el.vMerge) {
          cell.setAttribute('merge', 'true');
        }

        //find the applied table part style to the cell.
        TableStyleManager.findTblPartStyleToApply();
        _applyCellBorderStyleClasses(cell);

        var tcPr = (v.el.tcPr) ? v.el.tcPr : {};

        tcPr.lnT = _adjustSupportedOutline(tcPr.lnT);
        tcPr.lnB = _adjustSupportedOutline(tcPr.lnB);
        tcPr.lnR = _adjustSupportedOutline(tcPr.lnR);
        tcPr.lnL = _adjustSupportedOutline(tcPr.lnL);

        /*
         * Table cell borders are rendered separately here and not by shape
         * handler.
         * Reason being, we want borders to table cell and not to the shape div.
         * If we render shape div border then border sharing is not happening
         * between adjacent cells, hence this HACK
         */
        OutlineDecorator.create().handleUsingHTML(cell, tcPr);

        // TODO [Rahul Tarafdar]here we are generating DCP on our own. we should
        // not do this.

        var shape =
          _constructShapeJSON(cell.id, v.el.height, v.el.width, tcPr.fill);
        var textBody = _constructTextBodyJSON(v.el.txBody, tcPr);
        shape.elm = [textBody];
        v.el.elm = [shape];

        v.node.appendChild(cell);

        return cell;
      } else {
        return undefined;
      }
    },

    /**
     * postTraverse gets called *after* all child elements have been handled
     * @param v visitable object as passed by DCP manager
     */
    postTraverse: function(/* v */) {
      PointModel.currentTable.isProcessingTable = false;
    }
  };

  /**
   * Adjust outline properties prstDash as per fallback mechanism.
   *
   * @param ln - {JSON} outline json
   * @return ln - {JSON} outline json
   */
  var _adjustSupportedOutline = function(ln) {
    if (ln) {
      ln.prstDash = (ln.prstDash === undefined ? 'solid' : ln.prstDash);
    } else if (TableStyleManager.getClassPrefix() === undefined) {
      //if the table does not refer to any table style and borders are not
      // specified explicitly then add default black border
      ln = {
        prstDash: "solid",
        fill: {
          color: {
            clr: "#000000",
            type: "srgbClr"
          },
          type: "solidFill"
        },
        w: 12700
      };
    }
    return ln;
  };

  /**
   * Create shape wrapper object for cell
   *
   * @param v - visitable object as passed by DCP manager
   * @param cell - table cell div
   * @return shapeDiv - the wrapper shape object for cell
   */
  var _constructShapeJSON = function(cellId, height, width, fill) {
    var shapeDiv = {
      "etp": 'sp',
      "eid": 'cellShape' + cellId,
      "nvSpPr": {},
      "spPr": {
        "geom": {
          "prst": _RECT_SHAPE_PRESET_ID
        },
        "xfrm": {
          "off": {
            "x": "0",
            "y": "0"
          },
          "ext": {
            "cx": width,
            "cy": height
          }
        },
        "isShapeWithinTable": true
      },
      "height": height
    };

      if(fill) {
        shapeDiv.spPr.fill = fill;
      }

    return shapeDiv;
  };

  /**
   * Create text body object for cell textBody
   *
   * @param v - visitable object as passed by DCP manager
   * @param cellProperties - table cell proerties
   * @return textBodyDiv - the wrapper textBody object for cell text body
   */
  var _constructTextBodyJSON = function(textBody, cellProperties) {
    var textBodyDiv = {};
    if (textBody !== undefined) {
      textBodyDiv = {
        "etp": 'txBody',
        "eid": textBody.eid || ('txBody' + IdGenerator.getUniqueId()),
        "bodyPr": textBody.bodyPr,
        "elm": textBody.elm
      };
    }
      textBodyDiv.bodyPr.lIns = cellProperties.marL;
      textBodyDiv.bodyPr.rIns = cellProperties.marR;
      textBodyDiv.bodyPr.tIns = cellProperties.marT;
      textBodyDiv.bodyPr.bIns = cellProperties.marB;

      textBodyDiv.bodyPr.anchor = cellProperties.anchor;

    return textBodyDiv;
  };

  /**
   * Apply border style classes to table cell
   *
   * @param cell - table cell object
   */

  var _applyCellBorderStyleClasses = function(cell) {
    TableStyleManager.applyTblCellStyleClasses(cell,
      TableStyleManager.styleType.cellOutlineStyle, cell.rowSpan, cell.colSpan);
  };

  /**
   * Create table cell DIV element
   *
   * @param v - visitable object as passed by DCP manager
   * @return cellElement - table cell element
   */
  var _createCellElement = function(id, gridSpan, rowSpan) {
    //#TCP avoiding getelement by ID.
    //var cell = document.getElementById(v.el.eid);
    //if (!cell) {
    var cellElement = document.createElement('TD');
    cellElement.style.padding = "0px";
    //TODO: remove IdGenerator when DCP stops giving hardcoded Id. For now, we
    // always get the id as 222 from DCP.
    cellElement.id = id || (IdGenerator.getUniqueId() + "Cell");
    // Set column span
    if (gridSpan) {
      cellElement.colSpan = gridSpan;
    }
    // Set row span
    if (rowSpan) {
      cellElement.rowSpan = rowSpan;
    }
    return cellElement;
  };

  return _api;
});
