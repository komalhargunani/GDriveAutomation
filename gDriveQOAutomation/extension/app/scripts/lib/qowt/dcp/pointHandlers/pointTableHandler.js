/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 *
 * Handler for Point table
 *
 *
 * JSON--
 * {
 * "etp" : "ptbl",
 * "eid" : <id>,
 * "tblGrid" : [array of grid columns], // sequence matters
 * "tblPr" :  <table properties JSON>, // table properties JSON
 * "elm" :  [array of table row JSON] // sequence matters
 * }
 *
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/dcp/decorators/pointTableDecorator',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/dcp/decorators/tableStyleDecorator',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator'
], function(PointModel, TableDecorator, TableStyleManager,
            TableStyleDecorator, DeprecatedUtils, ShapeEffectsDecorator) {

  'use strict';

  var _shapeEffectsDecorator;

  /**
   * handle reflection for table
   * @param table {Div}
   * @param effectList {JSON}
   */
  var _handleReflection = function(table, effectList) {

    if (effectList && effectList.refnEff) {

      if (!_shapeEffectsDecorator) {
        _shapeEffectsDecorator = ShapeEffectsDecorator.create();
      }

      var reflectionStyle =
        _shapeEffectsDecorator.withReflection(effectList.refnEff);
      DeprecatedUtils.appendJSONAttributes(table.style, reflectionStyle);
    }
  };

  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'ptbl',

    /**
     * Visit method which contribute in DCP manager's visitor pattern for
     * rendering table
     * @param v visitable object as passed by DCP manager
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        PointModel.currentTable.isProcessingTable = true;

        var pointTableObj = v.el;

        var tableRows = pointTableObj.elm;

        //first reset the table properties.
        TableStyleManager.resetTableProperties();

        var decorateTable = TableDecorator.decorate();

        var table = decorateTable.withNewTableDiv(pointTableObj);

        var parentDiv = decorateTable.withNewParentDiv(pointTableObj);

        if (pointTableObj.tblPr) {
          if (pointTableObj.tblPr.xfrm) {
            decorateTable.withTransforms(parentDiv, pointTableObj.tblPr.xfrm);
          }
          if (pointTableObj.tblPr.fill) {
            decorateTable.withFill(table, pointTableObj.tblPr.fill);
          }

          _handleReflection(table, pointTableObj.tblPr.efstlst);

        }

        if (tableRows && pointTableObj.tblGrid) {
          decorateTable.
            withUpdatedCellDimensionsAndFill(tableRows, pointTableObj.tblGrid);

          if (pointTableObj.tblPr && pointTableObj.tblPr.tableStyleId) {

            //First set the tableStyle class prefix.
            TableStyleManager.
              computeClassPrefix(pointTableObj.tblPr.tableStyleId);

            var tableProperties = pointTableObj.tblPr;
            // These attributes are essential to set the proper CSS class. The
            // selectors are formed in tableStyleDecorator using these
            // attributes.
            table.setAttribute('styleid', tableProperties.tableStyleId);
            table.setAttribute('firstrow', !!(tableProperties.firstRow));
            table.setAttribute('lastrow', !!(tableProperties.lastRow));
            table.setAttribute('firstcol', !!(tableProperties.firstCol));
            table.setAttribute('lastcol', !!(tableProperties.lastCol));

            // Then check whether there is need to create css for Table style or
            // it's already created using tableStyleClass prefix.
            var shouldCreateCss =
              TableStyleManager.
                shouldCreateCssForTableStyle(pointTableObj.tblPr.tableStyleId);

            if (shouldCreateCss) {
              //create table style css classes for current table styleId
              TableStyleDecorator.create().
                decorateTableStyles(pointTableObj.tblPr.tableStyleId);
            }

            TableStyleManager.
              updateTableProperties(pointTableObj.tblPr, tableRows.length,
              pointTableObj.tblGrid.length);
          }
        }

        //apply table background classes
        TableStyleManager.applyTblBgStyleClasses(table,
          TableStyleManager.styleType.tblBgFillStyle);

        parentDiv.appendChild(table);
        v.node.appendChild(parentDiv);

        PointModel.currentTable.isProcessingTable = false;

        return table;
      } else {
        return undefined;
      }
    }
  };

  return _api;
});
