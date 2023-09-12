/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileOverview Table Styles Polymer element.
 * Container for all table styles in the Office document and exposes
 * API to add and query the Office table styles.
 * Responsible to write out the dynamic CSS rules from the Office table styles.
 * QowtTableStyles element extends the QowtOfficeStyles element,
 * and overrides the functionality specific to table styles.
 * @see QowtOfficeStyles
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',

  'common/mixins/decorators/tableBorderUtils',
  'qowtRoot/utils/cssCache',
  'common/elements/content/styles/officeStylesBehavior',
  'common/elements/text/para/word/wordPara',
  'common/elements/text/run/word/wordRun',
  /* we create dummy QowtTable and QowtTableCell, so we must ensure those
   modules are loaded as dependencies, which in turn ensures the elements
   will be registered. This is especially important to be able to run this
   element's unit tests! */
  'common/elements/document/table/table',
  'common/elements/document/tableCell/tableCell',
  'common/elements/content/styles/officeStylesBehavior'
], function(
  MixinUtils,
  QowtElement,

  TableBorderUtils,
  CssCache
  /* OfficeStylesBehavior */
  /* QowtWordPara */
  /* QowtWordRun */
  /* QowtTable */
  /* QowtTableCell */
  /* OfficeStylesBehavior */ ) {

  'use strict';

  var tableStylesProto = {
    is: 'qowt-table-styles',
    extends: 'style',
    behaviors: [OfficeStylesBehavior],

    ready: function() {
      this.id = 'qowtTableStyles';
    },

    /**
     * Returns all the dynamic CSS rules.
     * @public
     * @return {String} CSS rules string.
     */
    getCssRules: function() {
      return this.textContent;
    },

    /**
     * Writes all the table style definitions to dynamic CSS rules.
     * @public
     */
    writeStyles: function() {
      var that = this,
          cssCache_ = new CssCache();
      this.forEach(function(style) {
        that.applyProperties_(style, cssCache_);
        that.applyConditionalFormatting_(style, cssCache_);
      });
      var allCssRules = cssCache_.getAllRules();
      this.innerText = allCssRules;
    },

    // ---------------------PRIVATE----------------------

    /**
     * Apply CSS rules corresponding to formatting properties
     * to be applied to the entire table for a given table style.
     * The formatting properties include:
     * 1. Table Properties.
     * 2. Table Cell Properties.
     * 3. Paragraph Properties.
     * 4. Run Properties.
     * @param {object} style table style under inspection.
     * @param {object} cssCache CssCache to be populated.
     */
    applyProperties_: function(style, cssCache) {
      // Table Properties.
      var cssText = this.cssTextTable_(style);
      var cssSelector = this.styleSelector_(style);
      this.applyCssRule_(cssCache, cssSelector, cssText);
      // Table Borders.
      if (style.tableProperties && style.tableProperties.borders) {
        var borders = style.tableProperties.borders;
        for (var side in borders) {
          if (TableBorderUtils.isValidSide(side)) {
            cssSelector = this.styleSelector_(style) + ' > div' +
             ' > ' + TableBorderUtils.cssSelector(side);
            cssText = TableBorderUtils.cssText(side, borders[side]);
            this.applyCssRule_(cssCache, cssSelector, cssText);
          }
        }
      }

      // Table Cell Properties.
      cssText = this.cssTextTableCell_(style);
      cssSelector = this.styleSelector_(style) + ' > div > tr > td';
      this.applyCssRule_(cssCache, cssSelector, cssText);

      // Paragraph and Run Properties.
      cssText = this.cssTextParagraphRun_(style);
      cssSelector += ' > div > p';
      this.applyCssRule_(cssCache, cssSelector, cssText);
    },

    /**
     * Apply CSS rules corresponding to formatting properties
     * to be applied to parts of the table for a given table style.
     * ConditionalFormatting: {
     *   TablePart: TableStyleProperties
     * };
     * @param {object} style table style under inspection.
     * @param {object} cssCache CssCache to be populated.
     */
    applyConditionalFormatting_: function(style, cssCache) {
      if (style.conditionalFormatting) {
        // Table Parts to which the conditional formatting of the table styles
        // would be applied to. The conditional formatting of the table style
        // is applied in this order to various parts of the table.
        var tableParts_ = ['wholeTable', 'oddColumns', 'evenColumns', 'oddRows',
                           'evenRows', 'firstRow', 'lastRow', 'firstColumn',
                           'lastColumn', 'topLeft', 'topRight', 'bottomLeft',
                           'bottomRight'];
        tableParts_.forEach(
            this.applyTableStyleProperties_.bind(this, style, cssCache));
      }
    },

    /**
     * Apply CSS rules corresponding to table style properties
     * to be applied to parts of the table for a given table style.
     * ConditionalFormatting: {
     *   TablePart: TableStyleProperties
     * };
     * TableStyleProperties include:
     * 1. Table Cell Properties.
     * 2. Paragraph Properties.
     * 3. Run Properties.
     * @param {object} style table style under inspection.
     * @param {object} cssCache CssCache to be populated.
     * @param {string} tablePart part of the table.
     */
    applyTableStyleProperties_: function(style, cssCache, tablePart) {
      var tableStyleProperties = style.conditionalFormatting[tablePart];
      if (tableStyleProperties) {
        // Table Cell Properties.
        var cssText = this.cssTextTableCell_(tableStyleProperties);
        var cssSelector = this.cssSelectorTableParts(style, tablePart);
        this.applyCssRule_(cssCache, cssSelector, cssText);

        // Paragraph and Run Properties.
        cssText = this.cssTextParagraphRun_(tableStyleProperties);
        cssSelector += ' #contents > p';
        this.applyCssRule_(cssCache, cssSelector, cssText);
      }
    },

    /**
     * Get the cssText related to paragraph and text run properties
     * for a corresponding style object.
     * Uses a dummy div element to be decorated with the paragraph and run
     * formatting properties and the cssText is returned.
     * @param {object} style table style under inspection.
     * @returns {string} The cssText for the specified style object.
     */
    cssTextParagraphRun_: function(style) {
      var dummyPara = new QowtWordPara();
      if (style.ppr) {
        dummyPara.decorate(style.ppr, true);
      }
      var dummyRun = new QowtWordRun();
      if (style.rpr) {
        dummyRun.decorate(style.rpr, true);
      }
      return dummyPara.style.cssText + dummyRun.style.cssText;
    },

    /**
     * Get the cssText related to table properties
     * for a corresponding style object.
     * Uses a dummy div element to be decorated with the table
     * formatting properties and the cssText is returned.
     * @param {object} style table style under inspection.
     * @returns {string} The cssText for the specified style object.
     */
    cssTextTable_: function(style) {
      // Decorate dummy table with this style and then collect their combined
      // cssText. NOTE: we make sure to *synchronously* decorate the element
      // via the true argument. This is to ensure we can retrieve the cssText
      // within this JS task. Otherwise, the decorate would only update the
      // model, and the CSS would update in a next micro task!
      var dummyTable = new QowtTable();
      dummyTable.decorate(style.tableProperties, true);
      return dummyTable.style.cssText;
    },

    /**
     * Get the cssText related to table cell properties
     * for a corresponding style object.
     * Uses a dummy div element to be decorated with the table cell
     * formatting properties and the cssText is returned.
     * @param {object} style table style under inspection.
     * @returns {string} The cssText for the specified style object.
     */
    cssTextTableCell_: function(style) {
      // Decorate dummy table cell with this style and then collect their
      // combined cssText. NOTE: we make sure to *synchronously* decorate the
      // element via the true argument. This is to ensure we can retrieve the
      // cssText within this JS task. Otherwise, the decorate would only update
      // the model, and the CSS would update in a next micro task!
      var dummyTableCell = new QowtTableCell();
      dummyTableCell.decorate(style.cpr, true);
      return dummyTableCell.style.cssText;
    },

    /**
     * Apply the CSS rule to the CssCache.
     * @param {object} cssCache CssCache to be populated.
     * @param {string} cssSelector CSS selector.
     * @param {string} cssText CSS text.
     */
    applyCssRule_: function(cssCache, cssSelector, cssText) {
      if (cssText) {
        cssCache.updateRule(cssSelector, cssText);
      }
    },

    /**
     * Returns the CSS selector to select the appropriate set
     * of table cells on which the table style properties would be applied to,
     * for a given table style and table part.
     * @param {object} style table style under inspection.
     * @param {string} tablePart part of the table.
     * @return CSS selector string selector for a set of table cells.
     */
    cssSelectorTableParts: function(style, tablePart) {
      var cssSelector = this.styleSelector_(style);
      var tablePart2CssSelector = {
        // All rows -> all cells.
        wholeTable: ' .content-wrapper > tr > td',
        // Note that since CSS selectors are NOT zero based, but the first
        // child of an element is 1, we need to set the CSS selectors
        // differently from MS Word selectors which are zero based.
        // All rows -> odd cells.
        oddColumns: '[verticalbanding] .content-wrapper > tr >' +
        ' td:nth-child(even)',
        // All rows -> even cells.
        evenColumns: '[verticalbanding] .content-wrapper > tr >' +
        ' td:nth-child(odd)',
        // All odd rows -> all cells.
        oddRows: '[horizontalbanding] .content-wrapper > tr:nth-child(even)' +
        ' > td',
        // All even rows -> all cells.
        evenRows: '[horizontalbanding] .content-wrapper > tr:nth-child(odd)' +
        ' > td',
        // First row -> all cells.
        firstRow: '[firstrow] .content-wrapper > tr:first-child > td',
        // Last row -> all cells.
        lastRow: '[lastrow] .content-wrapper > tr:last-child > td',
        // All rows -> first cell.
        firstColumn: '[firstcolumn] .content-wrapper > tr > td:first-child',
        // All rows -> last cell.
        lastColumn: '[lastcolumn] .content-wrapper > tr > td:last-child',
        // First row -> first cell.
        topLeft: ' .content-wrapper > tr:first-child > td:first-child',
        // First row -> last cell.
        topRight: ' .content-wrapper > tr:first-child  > td:last-child',
        // Last row -> first cell.
        bottomLeft: ' .content-wrapper > tr:last-child  > td:first-child',
        // First row -> last cell.
        bottomRight: ' .content-wrapper > tr:last-child  > td:last-child'
      };
      return cssSelector + tablePart2CssSelector[tablePart];
    },

    /**
     * Returns the css selector for the table style.
     * @param {object} style table style under inspection.
     * @return CSS selector for the table style.
     */
    styleSelector_: function(style) {
      return '.' + this.formatClassName_(style.id);
    }
  };

  /* jshint newcap: false */
  window.QowtTableStyles =
      Polymer(MixinUtils.mergeMixin(QowtElement, tableStylesProto));
  /* jshint newcap: true */

  return {};
});
