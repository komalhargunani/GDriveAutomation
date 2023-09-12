/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mocha unit test for <qowt-table-styles>
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

(function() {
  describe('qowt-table-styles element', function() {

    /**
     * Table Styles Polymer Element under test.
     */
    var tableStyles;

    beforeEach(function() {
      tableStyles = new QowtTableStyles();
      document.head.appendChild(tableStyles);
      tableStyles.reset();
    });

    afterEach(function() {
      tableStyles.parentNode.removeChild(tableStyles);
    });

    it('should be a QowtTableStyles instance.', function() {
      assert.instanceOf(tableStyles, QowtTableStyles,
                        'should be a QowtTableStyles.');
    });

    it('should have merged the QowtElement mixin.', function() {
      assert.isTrue(tableStyles.isQowtElement, 'should be a QowtElement.');
    });

    it('should have required methods defined when upgraded.', function() {
      var functions = [
        'add', 'hasStyle', 'getStyle', 'getId', 'getName', 'getType',
        'getFormatting', 'getResolvedFormatting', 'getDefaultStyleId',
        'getDefaultStyleName', 'styleUsesContextualSpacing', 'getStyleNames',
        'forEach',  'getCssRules', 'writeStyles', 'reset'
      ];
      assertHasFunctions(tableStyles, functions);
    });

    describe('Table Style Properties', function() {

      it('should write CSS rules for table properties', function() {
        tableStyle.tableProperties = tableProperties;
        var selector = tableStyleSelector + ' > div > tr:last-child > td';
        assertTableProperties(tableStyle, selector);
        delete tableStyle.tableProperties;
      });

      it('should write CSS rules for cell properties', function() {
        tableStyle.cpr = cpr;
        var selector = tableStyleSelector + ' > div > tr > td';
        assertCellProperties(tableStyle, selector);
        delete tableStyle.cpr;
      });

      it('should write CSS rules for paragraph properties', function() {
        tableStyle.ppr = ppr;
        var selector = tableStyleSelector + ' > div > tr > td > div';
        assertParagraphProperties(tableStyle, selector);
        delete tableStyle.ppr;
      });

      it('should write CSS rules for text properties', function() {
        tableStyle.rpr = rpr;
        var selector = tableStyleSelector + ' > div > tr > td > div';
        assertTextProperties(tableStyle, selector);
        delete tableStyle.rpr;
      });

    });

    describe('Table Style Conditional Formatting', function() {

      describe('First Row Conditional Formatting', function() {
        it('should write CSS rules for cell properties', function() {
          tableStyle.conditionalFormatting = {firstRow: {cpr: cpr}};
          var selector = tableStyleSelector +
              '[firstrow] .content-wrapper > tr:first-child > td';
          assertCellProperties(tableStyle, selector);
          delete tableStyle.conditionalFormatting;
        });

        it('should write CSS rules for cell borders', function() {
          tableStyle.conditionalFormatting =
              {firstRow: {cpr: {borders: borders}}};
          var selector = tableStyleSelector +
              '[firstrow] .content-wrapper > tr:first-child > td';
          assertCellBorders(tableStyle, selector);
          delete tableStyle.conditionalFormatting;
        });

        it('should write CSS rules for paragraph properties', function() {
          tableStyle.conditionalFormatting = {firstRow: {ppr: ppr}};
          var selector = tableStyleSelector +
              '[firstrow] .content-wrapper > tr:first-child > td #contents';
          assertParagraphProperties(tableStyle, selector);
          delete tableStyle.conditionalFormatting;
        });

        it('should write CSS rules for text properties', function() {
          tableStyle.conditionalFormatting = {firstRow: {rpr: rpr}};
          var selector = tableStyleSelector +
              '[firstrow] .content-wrapper > tr:first-child > td #contents';
          assertTextProperties(tableStyle, selector);
          delete tableStyle.conditionalFormatting;
        });
      });

      describe('Last Row Conditional Formatting', function() {
        it('should write CSS rules for cell properties', function() {
          tableStyle.conditionalFormatting = {lastRow: {cpr: cpr}};
          var selector = tableStyleSelector +
              '[lastrow] .content-wrapper > tr:last-child > td';
          assertCellProperties(tableStyle, selector);
          delete tableStyle.conditionalFormatting;
        });

        it('should write CSS rules for cell borders', function() {
          tableStyle.conditionalFormatting =
              {lastRow: {cpr: {borders: borders}}};
          var selector = tableStyleSelector +
              '[lastrow] .content-wrapper > tr:last-child > td';
          assertCellBorders(tableStyle, selector);
          delete tableStyle.conditionalFormatting;
        });

        it('should write CSS rules for paragraph properties', function() {
          tableStyle.conditionalFormatting = {lastRow: {ppr: ppr}};
          var selector = tableStyleSelector +
              '[lastrow] .content-wrapper > tr:last-child > td #contents';
          assertParagraphProperties(tableStyle, selector);
          delete tableStyle.conditionalFormatting;
        });

        it('should write CSS rules for text properties', function() {
          tableStyle.conditionalFormatting = {lastRow: {rpr: rpr}};
          var selector = tableStyleSelector +
              '[lastrow] .content-wrapper > tr:last-child > td #contents';
          assertTextProperties(tableStyle, selector);
          delete tableStyle.conditionalFormatting;
        });
      });

    });

    //-----------TEST DATA + FUNCTIONS----------------------------
    /**
     * Table Style Test Data.
     */
    var tableStyle = {
      id: 'DummyTableStyle',
      type: 'table',
      name: 'Dummy Table Style'
    };
    /**
     * CSS selector for table styles.
     */
    var tableStyleSelector = '.qowt-stl-DummyTableStyle';
    /**
     * Helper utility to get the table style rules.
     */
    function getTableStyleRules(tableStyle) {
      tableStyles.add(tableStyle);
      tableStyles.writeStyles();
      return tableStyles.getCssRules();
    }

    /**
     * Table Properties Test Data.
     */
    var borders = {
      bottom: {
        style: 'solid',
        'width': 18
      }
    };
    var tableProperties = {
      borders: borders
    };
    /**
     * Table Properties Test Function.
     */
    function assertTableProperties(tableStyle, selector) {
      var actualCssRules = getTableStyleRules(tableStyle);
      var expectedCssRules = selector +
          ' {border-bottom-width:2.25pt;border-bottom-style:solid;} ';
      assert.equal(actualCssRules, expectedCssRules,
                   'table properties css rules should be same for selector: ' +
                       selector);
    }
    /**
     * Table Cell Borders Test Function.
     */
    function assertCellBorders(tableStyle, selector) {
      var actualCssRules = getTableStyleRules(tableStyle);
      var expectedCssRules = selector +
          ' {border-bottom-width:2.25pt;border-bottom-style:solid;} ';
      assert.equal(actualCssRules, expectedCssRules,
                   'cell borders css rules should be same for selector: ' +
                       selector);
    }

    /**
     * Cell Properties Test Data.
     */
    var cpr = {
      shading: {
        backgroundColor: "#4F81BD"
      }
    };
    /**
     * Cell Properties Test Function.
     */
    function assertCellProperties(tableStyle, selector) {
      var actualCssRules = getTableStyleRules(tableStyle);
      var expectedCssRules = selector +
          ' {background-color:rgb(79, 129, 189);} ';
      assert.equal(actualCssRules, expectedCssRules,
                   'cell properties css rules should be same for selector: ' +
                       selector);
    }

    /**
     * Paragraph Properties Test Data.
     */
    var ppr = {
      lsp: {
        m: 'multiplier',
        v: 240
      }
    };
    /**
     * Paragraph Properties Test Data.
     */
    function assertParagraphProperties(tableStyle, selector) {
      var actualCssRules = getTableStyleRules(tableStyle);
      var expectedCssRules = selector + ' > p {line-height:1.2;} ';
      assert.equal(actualCssRules, expectedCssRules,
                   'paragraph css rules should be same for selector: ' +
                       selector);
    }

    /**
     * Text Run Properties Test Data.
     */
    var rpr = {
      bld: true
    };
    /**
     * Text Run Properties Test Function.
     */
    function assertTextProperties(tableStyle, selector) {
      var actualCssRules = getTableStyleRules(tableStyle);
      var expectedCssRules = selector + ' > p {font-weight:bold;} ';
      assert.equal(actualCssRules, expectedCssRules,
                   'text properties css rules should be same for selector: ' +
                       selector);
    }

    function assertHasFunctions(element, funcList) {
      funcList.forEach(function(funcName) {
        assert.isFunction(element[funcName], funcName);
      });
    }
  });
})();
