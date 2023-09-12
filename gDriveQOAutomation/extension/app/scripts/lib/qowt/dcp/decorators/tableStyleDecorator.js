/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


define([
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/dcp/decorators/tableCellTextStyleDecorator',
  'qowtRoot/drawing/styles/tableStyles/tableStyleClassFactory',
  'qowtRoot/utils/cssManager',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/dcp/decorators/outlineDecorator',
  'qowtRoot/drawing/styles/tableStyles/tableCellBorderDefinitions',
  'qowtRoot/drawing/styles/tableStyles/tableStyleFactory'
], function(
  FillHandler,
  CellTextStyleDecorator,
  TableStyleClassFactory,
  CssManager,
  TableStyleManager,
  ThemeStyleRefManager,
  OutlineDecorator,
  TableCellBorderDefinitions,
  TableStyleFactory) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        /**
         * Return map of outline objects from table style where outline obj is
         * mapped to borderType (top, bottom, left, right, insideH, insideV).
         * @param cellBdrsJson
         */
        var _resolveCellOutlinesPerPartType = function(tcBdrJson) {
          var outlineObjsFromStyle = {};
          for (var borderType in tcBdrJson) {
            var tcBdrObj;
            if (tcBdrJson[borderType].lnRef) {
              tcBdrObj = ThemeStyleRefManager.
                getOutlineRefStyleForTable(tcBdrJson[borderType].lnRef);
            } else if (tcBdrJson[borderType].ln) {
              tcBdrObj = tcBdrJson[borderType].ln;
            }
            if (tcBdrObj) {
              outlineObjsFromStyle[borderType] = tcBdrObj;
            }
          }
          return outlineObjsFromStyle;
        };

        var _api = {

          /**
           * decorate the table with table styles. (It includes table  cell
           * fill, border and text style)
           */
          decorateTableStyles: function(tableStyleId) {
            var tableStyle = TableStyleManager.
              getCachedTableStyles(tableStyleId);

            // didn't get the style. check it in tableStyle Defn
            if (!tableStyle) {
              tableStyle = TableStyleFactory.getTableStyle(tableStyleId);
            }

            if (tableStyle) {
              var classPrefix = TableStyleManager.getClassPrefix();

              for (var tablePartStyleString in TableStyleClassFactory) {

                var tablePartStyle = tableStyle[tablePartStyleString];
                if (tablePartStyle) {
                  if (tablePartStyle.tcTxStyle) {
                    _handleTableCellTextStyle(tablePartStyle.tcTxStyle,
                        tableStyleId, tablePartStyleString);
                  }

                  if (tablePartStyle.tcStyle) {
                    _handleTableCellStyle(tablePartStyle.tcStyle,
                      classPrefix, tablePartStyleString);
                  }

                  if (TableStyleClassFactory.tblBg.type ===
                    tablePartStyleString) {
                    _handleTableBgStyle(tablePartStyle, classPrefix,
                      tablePartStyleString);
                  }
                }
              }
            }
          }
        };

        /**
         * Handles creation of css classes for table background style
         * @param tblBgStyle - table Background style
         * @param classPrefix - {String}
         * @param tablePartStyleString - table part style name
         */
        var _handleTableBgStyle = function(tblBgStyle, classPrefix,
                                           tablePartStyleString) {

          var styleClassName = TableStyleClassFactory[tablePartStyleString].
            getBgFillStyleClassName(classPrefix);
          var fillObj;

          if (tblBgStyle !== undefined) {
            if (tblBgStyle.fill) {
              fillObj = tblBgStyle.fill;
            } else if (tblBgStyle.fillRef) {
              fillObj = ThemeStyleRefManager.
                getFillRefStyleForTable(tblBgStyle.fillRef);
            }
          }

          if ((fillObj !== undefined) && (fillObj !== null) ){
            var tblBgFillStyle = FillHandler.
              getFillStyle(fillObj, styleClassName);
            var selector = "." + styleClassName;
            CssManager.addRule(selector, tblBgFillStyle);
          }
        };

        /**
         * Handles creation of css classes for table cell text Style
         * @param {object} tcTxtStyle - table cell text style JSON
         * @param {String} tableStyleId -  Table style ID
         * @param {String} tablePartStyleString  - table part style type
         *     (band1H,band2H,WholeTbl..)
         */
        var _handleTableCellTextStyle = function(tcTxtStyle, tableStyleId,
                                                 tablePartStyleString) {
          if (tcTxtStyle) {
            var dummyElm = document.createElement('span');
            CellTextStyleDecorator.decorate(dummyElm, tcTxtStyle);
            var cssText = dummyElm.style.cssText;

            var selector;
            switch (tablePartStyleString) {
              case 'wholeTbl':
                selector = '[styleid="' + tableStyleId + '"]' +
                    ' span[is="qowt-point-run"]';
                break;
              case 'firstRow':
                selector = '[styleid="' + tableStyleId + '"][firstrow="true"]' +
                    ' tr:first-child span[is="qowt-point-run"]';
                break;
              case 'lastRow':
                selector = '[styleid="' + tableStyleId + '"][lastrow="true"]' +
                    ' tr:last-child span[is="qowt-point-run"]';
                break;
              case 'firstCol':
                selector = '[styleid="' + tableStyleId + '"][firstcol="true"]' +
                    ' tr td:first-child span[is="qowt-point-run"]';
                break;
              case 'lastCol':
                selector = '[styleid="' + tableStyleId + '"][lastcol="true"]' +
                    ' tr td:last-child span[is="qowt-point-run"]';
                break;
              case 'swCell':
                selector = '[styleid="' + tableStyleId + '"][lastrow="true"]' +
                    '[firstcol="true"] tr:last-child td:first-child ' +
                    'span[is="qowt-point-run"]';
                break;
              case 'seCell':
                selector = '[styleid="' + tableStyleId + '"][lastrow="true"]' +
                    '[lastcol="true"] tr:last-child td:last-child ' +
                    'span[is="qowt-point-run"]';
                break;
              default:
                break;
            }
            CssManager.addRule(selector, cssText);
          }
        };

        /**
         * Handles creation of css classes for table cell style (includes
         * creation of css for cell fill style and cell borders).
         * @param tcStyle - table cell style JSON {object}
         * @param classPrefix - table style css clase prefix
         * @param tablePartStyleType - table part style type
         *                             (band1H,band2H,WholeTbl..)
         */
        var _handleTableCellStyle = function(tcStyle, classPrefix,
                                             tablePartStyleType) {
          if (tcStyle.fill || tcStyle.fillRef) {
            _handleTableCellFill(tcStyle, classPrefix, tablePartStyleType);
          }
          if (tcStyle.tcBdr) {
            _handleTableCellOutline(tcStyle.tcBdr, classPrefix,
              tablePartStyleType);
          }
        };

        /**
         * Handles creation of css classes for table cell fill.
         * @param tcStylefill- {object} fill JSON
         * @param classPrefix- table style css clase prefix
         * @param tablePartStyleType - table part style type
         *                             (band1H,band2H,WholeTbl..)
         */
        var _handleTableCellFill = function(tcStyle, classPrefix,
                                            tablePartStyleType) {

          var styleClassName = TableStyleClassFactory[tablePartStyleType].
            getCellFillStyleClassName(classPrefix);
          var fillObj;
          if (tcStyle.fill) {
            fillObj = tcStyle.fill;
          } else if (tcStyle.fillRef) {
            fillObj = ThemeStyleRefManager.
              getFillRefStyleForTable(tcStyle.fillRef);
          }

          if (fillObj) {
            var tblCellFillStyle = FillHandler.
              getFillStyle(fillObj, styleClassName);
            var selector = "." + styleClassName;
            CssManager.addRule(selector, tblCellFillStyle);
          }
        };

        /**
         * Handles creation of css classes for table cell borders
         * @param tcBdr - Table cell border JSON
         * @param classPrefix - Table style css class prefix
         * @param tablePartStyleType - table part style type
         *                             (band1H,band2H,WholeTbl..)
         */
        var _handleTableCellOutline = function(tableCellBdrs, classPrefix,
                                               tablePartStyleType) {

          var outlineDecorator = OutlineDecorator.create();

          /* First get all cell border style json and crete outline obj of each
             and map these oultine obj to the borderType (top, bottom, left,
             right, insideH, insideV). */
          var outlineObjs = _resolveCellOutlinesPerPartType(tableCellBdrs);

          // Now get the table Cell border Definition for given part type.
          var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
            cellBdrDefinitionPerPosition[tablePartStyleType];

          /*
           Now iterate over the cell border denfinition for given part type to
           create css classess. Here CellPosition means cells at top_left,
           top_right, top_center, center, left, right, bottom_left,
           bottom_right, bottom_center poition.
           */
          for (var cellPosition in  cellBdrDefinitionsAsPerPosition) {

            var tblCellOutlineStyle = "";
            // get style class name
            var styleClassName = TableStyleClassFactory[tablePartStyleType].
              getCellOutlineStyleClassName(classPrefix, cellPosition);

            // get cell border defintion for given postion
            var bdrDefinition = cellBdrDefinitionsAsPerPosition[cellPosition];
            for (var cellBdr in bdrDefinition) {
              var outline = bdrDefinition[cellBdr];
              if (outlineObjs[outline]) {
                tblCellOutlineStyle += outlineDecorator.
                  getPlaceHolderStyle(outlineObjs[outline], cellBdr);
              }
            }
            var selector = "." + styleClassName;
            CssManager.addRule(selector, tblCellOutlineStyle);
          }
        };

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
