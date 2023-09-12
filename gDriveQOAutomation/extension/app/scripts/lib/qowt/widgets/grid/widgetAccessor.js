/**
 * @fileoverview The widget accessor widget encapsulates the HTML presentation
 * of a format of different widgets (cell, row and column widgets). The widget
 * currently only has getter functions and it does not add anything to the DOM.
 * The getter functions are used to query about the formatting of a widget.
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/models/sheet',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/utils/sheetSelection/selectionUtils'], function(
  WidgetFactory,
  ArrayUtils,
  SheetModel,
  Workbook,
  SheetSelectionManager,
  SheetSelectionUtils) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'WidgetAccessor Widget Factory',

    supportedActions: [],

    /**
     * Method used by the Abstract Widget Factory to determine if this widget
     * factory can be used to fulfil a given configuration object.
     *
     * IMPORTANT: This method is called in a loop for all widgets, so its
     * performance is critical. You should limit as much as possible intensive
     * DOM look up and other similar processes.
     *
     * See Also: Abstract Widget Factory, for how the confidence score is used
     *           qowtRoot/widgets/factory
     *
     * @param config {object} Configuration object, consists of:
     *        config.fromNode {HTML Element} Determine if this widget can be
     *                                       constructed given this as a base
     *        config.supportedActions {Array} a list of features the widget must
     *                                        support
     *
     * @return {integer} Confidence Score;
     *                   This integer between 0 and 100 indicates the determined
     *                   ability of this factory to create a widget for the
     *                   given configuration object.
     *                   0 is negative: this factory cannot construct a widget
     *                   for the given configuration.
     *                   100 is positive: this factory definitely can construct
     *                   a widget for the given configuration.
     *                   1 to 99: This factory could create a widget from the
     *                   given configuration data, but it is not a perfect match
     *                   if another factory returns a higher score then it would
     *                   be a more suitable factory to use.
     */
    confidence: function(config) {
      config = config || {};
      // first check that we match the required feature set
      if (config.supportedActions &&
            !ArrayUtils.subset(
              config.supportedActions,
              _factory.supportedActions)) {
        return 0;
      }
      var score = 0;
      // Now check that the config node matches
      if (config && config.anchor &&
          config.anchor.colIdx !== undefined &&
          config.anchor.rowIdx !== undefined) {
        score = 100;
      }
      return score;
    },

    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        /**
         * @private
         */
        var _cell, _row, _column, _sheet, _api = {};

        _api.name = 'WidgetAccessor Widget Instance';

        /**
         * Query methods for different attributes of a cell
         * @return true if the cell has the attribute, otherwise false.
         */
        _api.hasBold = function() {
          var hasBold = false;
          if (_cell) {
           if(_cell.hasBold()){
              hasBold = true;
           }
          } else if (_row && _row.bld === true) {
            hasBold = true;
          } else if (_column && _column.bld === true) {
            hasBold = true;
          } else if (_sheet && _sheet.bld === true) {
            hasBold = true;
          }
          return hasBold;
        };

        _api.hasItalic = function() {
          var hasItalic = false;
          if (_cell) {
            if(_cell.hasItalic()){
              hasItalic = true;
            }
          } else if (_row && _row.itl === true) {
            hasItalic = true;
          } else if (_column && _column.itl === true) {
            hasItalic = true;
          } else if (_sheet && _sheet.itl === true) {
            hasItalic = true;
          }
          return hasItalic;
        };

        _api.hasUnderline = function() {
          var hasUnderline = false;
          if (_cell) {
              if(_cell.hasUnderline()){
                  hasUnderline = true;
              }

          } else if (_row && _row.udl === true) {
            hasUnderline = true;
          } else if (_column && _column.udl === true) {
            hasUnderline = true;
          } else if (_sheet && _sheet.udl === true) {
            hasUnderline = true;
          }
          return hasUnderline;
        };

        _api.hasStrikethrough = function() {
          var hasStrikethrough = false;
          if (_cell) {
            if (_cell.hasStrikethrough()) {
              hasStrikethrough = true;
            }
          } else if (_row && _row.strikethrough === true) {
            hasStrikethrough = true;
          } else if (_column && _column.strikethrough === true) {
            hasStrikethrough = true;
          } else if (_sheet && _sheet.strikethrough === true) {
            hasStrikethrough = true;
          }
          return hasStrikethrough;
        };

        _api.getFontFaceIndex = function() {
          var fi;
          if (_cell && _cell.fontFaceIndex() !== undefined) {
            fi = _cell.fontFaceIndex();
          } else if (_row && _row.fi !== undefined) {
            fi = _row.fi;
          } else if (_column && _column.fi !== undefined) {
            fi = _column.fi;
          } else if (_sheet && _sheet.fi !== undefined) {
            fi = _sheet.fi;
          }
          return fi;
        };

        /**
         * Method to query about the font face of the cell
         * If the cell has no font set, then checks the row, col
         * and default cell settings
         *
         * @return {string} the font face of the cell
         */
        _api.getFontFace = function() {
          var ff;
          var fi = _api.getFontFaceIndex();
          if (fi !== undefined) {
            var gridFonts = SheetModel.fontNames;
            if (gridFonts) {
              if (fi < gridFonts.length) {
                ff = gridFonts[fi];
              }
            }
          }
          return ff;
        };

        /**
         * Method to query about the font size of the cell in points
         * If the cell has no font size set, then checks the row, col
         * and default cell settings
         *
         * @return {integer} the font size of the cell
         */
        _api.getFontSizePoints = function() {
          var sizeinPoints;
          if (_cell && _cell.fontSize() !== undefined) {
            sizeinPoints = _cell.fontSize();
          } else if (_row && _row.siz !== undefined) {
            sizeinPoints = _row.siz;
          } else if (_column && _column.siz !== undefined) {
            sizeinPoints = _column.siz;
          } else if (_sheet && _sheet.siz !== undefined) {
            sizeinPoints = _sheet.siz;
          }
          return sizeinPoints;
        };

        /**
         * Method to query about the text color of the cell.
         * If the cell has no text color set, then checks the row, col
         * and default cell settings
         *
         * @return {string} the text color in hex of the cell
         */
        _api.getTextColor = function() {
          var textColor;
          if (_cell && _cell.textColor !== undefined) {
            textColor = _cell.textColor;
          } else if (_row && _row.clr !== undefined) {
            textColor = _row.clr;
          } else if (_column && _column.clr !== undefined) {
            textColor = _column.clr;
          } else if (_sheet && _sheet.clr !== undefined) {
            textColor = _sheet.clr;
          }
          return textColor;
        };

        /**
         * Method to query about the background color of the cell.
         * If the cell has no background color set, then checks the row, col
         * and default cell settings
         *
         * @return {string} the background color in hex of the cell
         */
        _api.getBackgroundColor = function() {
          var backgroundColor;
          if (_cell && _cell.backgroundColor !== undefined) {
            backgroundColor = _cell.backgroundColor;
          } else if (_row && _row.bg !== undefined) {
            backgroundColor = _row.bg;
          } else if (_column && _column.bg !== undefined) {
            backgroundColor = _column.bg;
          } else if (_sheet && _sheet.bg !== undefined) {
            backgroundColor = _sheet.bg;
          }
          return backgroundColor;
        };

        /**
         * Method to query about the horizontal alignment position of the cell.
         * If the cell has no horizontal alignment position  set, then checks
         * the row, col and default cell settings
         *
         * @return {string} the horizontal alignment position of the cell
         */
        _api.getHorizontalAlignment = function() {
          var alignPos;
          if (_cell && _cell.hAlignment !== undefined) {
            alignPos = _cell.hAlignment;
          } else if (_row && _row.ha !== undefined) {
            alignPos = _row.ha;
          } else if (_column && _column.ha !== undefined) {
            alignPos = _column.ha;
          } else if (_sheet && _sheet.ha !== undefined) {
            alignPos = _sheet.ha;
          }
          return alignPos;
        };

        /**
         * Method to query about the vertical alignment position of the cell.
         * If the cell has no vertical alignment position  set, then checks
         * the row, col and default cell settings
         *
         * @return {string} the vertical alignment position of the cell
         */
        _api.getVerticalAlignment = function() {
          var alignPos;
          if (_cell && _cell.vAlignment !== undefined) {
            alignPos = _cell.vAlignment;
          } else if (_row && _row.va !== undefined) {
            alignPos = _row.va;
          } else if (_column && _column.va !== undefined) {
            alignPos = _column.va;
          } else if (_sheet && _sheet.va !== undefined) {
            alignPos = _sheet.va;
          }
          return alignPos;
        };

        _api.numberFormat = function() {
          var nf;
          if (_cell && _cell.numberFormat !== undefined) {
            nf = _cell.numberFormat;
          } else if (_row && _row.nf !== undefined) {
            nf = _row.nf;
          } else if (_column && _column.nf !== undefined) {
            nf = _column.nf;
          } else if (_sheet && _sheet.nf !== undefined) {
            nf = _sheet.nf;
          } else {
            nf = "General";
          }
          return nf;
        };

        _api.hasVAlignTop = function() {
          var ret = false;
          if(_cell) {
            ret = _cell.hasVAlignTop();
          } else if(_row) {
            ret = _row.verticalAlign === 't';
          } else if(_column) {
            ret = _column.verticalAlign === 't';
          } else if(_sheet) {
            ret = _sheet.verticalAlign === 't';
          }
          return ret;
        };

        _api.hasVAlignCenter = function() {
          var ret = false;
          if(_cell) {
            ret = _cell.hasVAlignCenter();
          } else if(_row) {
            ret = _row.verticalAlign === 'c';
          } else if(_column) {
            ret = _column.verticalAlign === 'c';
          } else if(_sheet) {
            ret = _sheet.verticalAlign === 'c';
          }
          return ret;
        };

        _api.hasVAlignBottom = function() {
          var ret = false;
          if(_cell) {
            ret = _cell.hasVAlignBottom();
          } else if(_row) {
            ret = _row.verticalAlign === undefined;
          } else if(_column) {
            ret = _column.verticalAlign === undefined;
          } else if(_sheet) {
            ret = _sheet.verticalAlign === undefined;
          }
          return ret;
        };

        _api.hasHAlignLeft = function() {
          var ret = false;
          if(_cell) {
            ret = _cell.hasHAlignLeft();
          } else if(_row) {
            ret = _row.horizontalAlign === undefined;
          } else if(_column) {
            ret = _column.horizontalAlign === undefined;
          } else if(_sheet) {
            ret = _sheet.horizontalAlign === undefined;
          }
          return ret;
        };

        _api.hasHAlignCenter = function() {
          var ret = false;
          if(_cell) {
            ret = _cell.hasHAlignCenter();
          } else if(_row) {
            ret = _row.horizontalAlign === 'c';
          } else if(_column) {
            ret = _column.horizontalAlign === 'c';
          } else if(_sheet) {
            ret = _sheet.horizontalAlign === 'c';
          }
          return ret;
        };

        _api.hasHAlignRight = function() {
          var ret = false;
          if(_cell) {
            ret = _cell.hasHAlignRight();
          } else if(_row) {
            ret = _row.horizontalAlign === 'r';
          } else if(_column) {
            ret = _column.horizontalAlign === 'r';
          } else if(_sheet) {
            ret = _sheet.horizontalAlign === 'r';
          }
          return ret;
        };

        _api.hasWrapText = function() {
          var hasWrapText = false;
          if (_cell) {
            if (_cell.hasWrapText()) {
              hasWrapText = true;
            }
          } else if (_row && _row.wrapText) {
            hasWrapText = true;
          } else if (_column && _column.wrapText) {
            hasWrapText = true;
          } else if (_sheet && _sheet.wrapText) {
            hasWrapText = true;
          }
          return hasWrapText;
        };

        _api.hasMerge = function() {
          var currentSel = SheetSelectionManager.getCurrentSelection();
          return SheetSelectionUtils.isSelectionMerged(currentSel);
        };

        /**
         * Gets the editable text of a cell. If there is no editable text, it
         * returns the cell text. TODO(ganetsky): should that logic be moved
         * into the cell widget?
         * @returns {String} the editable text of the cell.
         */
        _api.getEditableText = function() {
          var editableText = "";
          if (_cell) {
            if (_cell.getEditableText() !== undefined) {
              editableText = _cell.getEditableText();
            } else if (_cell.cellText !== undefined) {
              editableText = _cell.cellText;
            }
          }
          return editableText;
        };

        /**
         * Gets the cell text.
         * @returns {String} the cell text of cell.if there is no text in cell
         *                    function will return empty string.
         */
        _api.getCellText = function() {
          var cellText = "";
          if (_cell && _cell.cellText) {
            cellText = _cell.cellText;
          }
          return cellText;
        };

        // Providing additional APIs to ensure our Polymer menu items content
        // widgets can work alongside our qowt content widgets in sheet. This
        // simple facade API means we don't need specialised Polymer menu items.
        // TODO(dskelton) Remove this facacde API if/when we convert sheet
        // widgets to Polymer content elements OR when we change the DCP names
        // for these to something more readable. eg bld -> bold (hasBold).
        Object.defineProperty(_api, 'bld', {
          get: function() {
            return _api.hasBold();
          }
        });

        Object.defineProperty(_api, 'itl', {
          get: function() {
            return _api.hasItalic();
          }
        });

        Object.defineProperty(_api, 'udl', {
          get: function() {
            return _api.hasUnderline();
          }
        });

        Object.defineProperty(_api, 'strikethrough', {
          get: function() {
            return _api.hasStrikethrough();
          }
        });

        Object.defineProperty(_api, 'wrapText', {
          get: function() {
            return _api.hasWrapText();
          }
        });

        Object.defineProperty(_api, 'merge', {
          get: function() {
            return _api.hasMerge();
          }
        });

        function _fetchFormats() {
          var colFetched = false, rowFetched = false;
          if(config.newSelection &&
             config.newSelection.contentType === "sheetCell" &&
             config.newSelection.topLeft.colIdx === undefined &&
             config.newSelection.bottomRight.colIdx === undefined) {
            _row = SheetModel.RowFormatting[config.anchor.rowIdx];
            rowFetched = true;
          }
          if(config.newSelection &&
             config.newSelection.contentType === "sheetCell" &&
             config.newSelection.topLeft.rowIdx === undefined &&
             config.newSelection.bottomRight.rowIdx === undefined) {
            _column = SheetModel.ColFormatting[config.anchor.colIdx];
            colFetched = true;
          }
          _sheet = SheetModel.defaultFormatting;

          if(!colFetched && !rowFetched) {
            var row = Workbook.getRow(config.anchor.rowIdx);
            _cell = row.getCells()[config.anchor.colIdx];
            _row = SheetModel.RowFormatting[config.anchor.rowIdx];
            _column = SheetModel.ColFormatting[config.anchor.colIdx];
          }
        }

        function _init() {
          _fetchFormats();
        }

        _init();

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  // register with the widget factory;
  WidgetFactory.register(_factory);

  return _factory;
});
