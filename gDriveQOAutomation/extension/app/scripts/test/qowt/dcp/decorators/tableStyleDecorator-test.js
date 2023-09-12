define([
  'qowtRoot/dcp/decorators/tableCellTextStyleDecorator',
  'qowtRoot/dcp/decorators/tableStyleDecorator',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/utils/cssManager'
], function(
    CellTextStyleDecorator,
    TableStyleDecorator,
    TableStyleManager,
    CssManager) {

  'use strict';

  describe('TableStyle decorator Test', function() {

    var tableStyleDecorator_ = TableStyleDecorator.create();

    describe('table cell text run selector formation', function() {

      var tblStyle_, getCachedTableStylesStub_;

      beforeEach(function() {
        tblStyle_ = {
          name: 'Medium Style 2 - Accent 1',
          styleId: 'Some ID'
        };
        sinon.stub(CellTextStyleDecorator, 'decorate');
        sinon.stub(CssManager, 'addRule');
        getCachedTableStylesStub_ = sinon.stub(TableStyleManager,
            'getCachedTableStyles').returns(tblStyle_);
      });

      afterEach(function() {
        CellTextStyleDecorator.decorate.restore();
        CssManager.addRule.restore();
        TableStyleManager.getCachedTableStyles.restore();
        getCachedTableStylesStub_ = undefined;
        tblStyle_ = undefined;
      });

      it('should create proper CSS selector for whole table', function() {
        tblStyle_.wholeTbl = {tcTxStyle: {}};
        getCachedTableStylesStub_.returns(tblStyle_);
        tableStyleDecorator_.decorateTableStyles(tblStyle_.styleId);

        assert.strictEqual(CssManager.addRule.firstCall.args[0],
            '[styleid="Some ID"] span[is="qowt-point-run"]',
            'whole table style');
      });

      it('should create proper CSS selector for first row', function() {
        tblStyle_.firstRow = {tcTxStyle: {}};
        getCachedTableStylesStub_.returns(tblStyle_);
        tableStyleDecorator_.decorateTableStyles(tblStyle_.styleId);

        assert.strictEqual(CssManager.addRule.firstCall.args[0],
            '[styleid="Some ID"][firstrow="true"] tr:first-child ' +
                'span[is="qowt-point-run"]', 'first row style');
      });

      it('should create proper CSS selector for last row', function() {
        tblStyle_.lastRow = {tcTxStyle: {}};
        getCachedTableStylesStub_.returns(tblStyle_);
        tableStyleDecorator_.decorateTableStyles(tblStyle_.styleId);

        assert.strictEqual(CssManager.addRule.firstCall.args[0],
            '[styleid="Some ID"][lastrow="true"] tr:last-child ' +
                'span[is="qowt-point-run"]', 'last row style');
      });

      it('should create proper CSS selector for first column', function() {
        tblStyle_.firstCol = {tcTxStyle: {}};
        getCachedTableStylesStub_.returns(tblStyle_);
        tableStyleDecorator_.decorateTableStyles(tblStyle_.styleId);

        assert.strictEqual(CssManager.addRule.firstCall.args[0],
            '[styleid="Some ID"][firstcol="true"] tr td:first-child ' +
                'span[is="qowt-point-run"]', 'first column style');
      });

      it('should create proper CSS selector for last column', function() {
        tblStyle_.lastCol = {tcTxStyle: {}};
        getCachedTableStylesStub_.returns(tblStyle_);
        tableStyleDecorator_.decorateTableStyles(tblStyle_.styleId);

        assert.strictEqual(CssManager.addRule.firstCall.args[0],
            '[styleid="Some ID"][lastcol="true"] tr td:last-child ' +
                'span[is="qowt-point-run"]', 'last column style');
      });

      it('should create proper CSS selector for sw cell', function() {
        tblStyle_.swCell = {tcTxStyle: {}};
        getCachedTableStylesStub_.returns(tblStyle_);
        tableStyleDecorator_.decorateTableStyles(tblStyle_.styleId);

        assert.strictEqual(CssManager.addRule.firstCall.args[0],
            '[styleid="Some ID"][lastrow="true"][firstcol="true"] ' +
                'tr:last-child td:first-child span[is="qowt-point-run"]',
            'sw cell style');
      });

      it('should create proper CSS selector for se cell', function() {
        tblStyle_.seCell = {tcTxStyle: {}};
        getCachedTableStylesStub_.returns(tblStyle_);
        tableStyleDecorator_.decorateTableStyles(tblStyle_.styleId);

        assert.strictEqual(CssManager.addRule.firstCall.args[0],
            '[styleid="Some ID"][lastrow="true"][lastcol="true"] ' +
                'tr:last-child td:last-child span[is="qowt-point-run"]',
            'se cell style');
      });
    });
  });
});
