define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/dcp/updateRowHandler',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/fixtures/sheet/sheetFormattingFixture',
  'qowtRoot/fixtures/sheet/updateRowElementFixture',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/widgets/grid/row',
  'qowtRoot/widgets/grid/column'
], function(
  PaneManager,
  Workbook,
  UpdateRowHandler,
  UnitConversionUtils,
  FormattingFixture,
  UpdateRowFixture,
  SheetModel,
  SheetConfig,
  Row,
  Column) {

  'use strict';


  describe('update row DCP Handler', function() {

    var sandbox, row, parentNode_;
    beforeEach(function() {
      parentNode_ = document.createElement('DIV');
      sandbox = sinon.sandbox.create();
      row = Row.create(3, 3, 10);
      var column = [];
      for (var i = 0; i < 10; i++) {
        var col = Column.create(i, 0, 10);
        column.push(col);
      }
      sandbox.spy(row, 'applyBackgroundAndBorders');
      sandbox.stub(Workbook, 'getRow').returns(row);
      sandbox.stub(Workbook, 'getNumOfCols').returns(10);
      sandbox.stub(Workbook, 'getColumn', function(rowIdx) {
        return column[rowIdx];
      });
      sandbox.stub(Workbook, 'getDefaultRowHeight').returns(10);
      sandbox.stub(PaneManager, 'getMainPane', function() {
        return {
          getFloaterManager: function() {
            return {
              findContainingFloater: function() {
                return undefined;
              }
            };
          }
        };
      });
      SheetModel.RowFormatting = [];
      SheetModel.specificRowHeights = [];
      SheetModel.defaultFormatting = {clr: '#000000',
        fi: 0,
        ha: 'l',
        nf: 'General',
        siz: 12,
        va: 'b'
      };
    });

    afterEach(function() {
      sandbox.restore();
      parentNode_ = undefined;

    });

    it('should apply background colors for rows', function() {
      var backgroundColor = '#00FF00';
      var formatting = {
        'bg': backgroundColor
      };
      var rowDCP = UpdateRowFixture.updateRowElement(3, undefined, formatting);

      var v = {
        el: rowDCP
      };
      UpdateRowHandler.visit(v);
      assert.isTrue(row.applyBackgroundAndBorders.calledWith(backgroundColor,
        undefined));
    });

    it('should apply borders formatting for rows', function() {
      var top = FormattingFixture.borderFormatting('double', 16,
        '#000000');
      var right = FormattingFixture.borderFormatting('dashed', 24,
        '#FFFFFF');
      var bottom = FormattingFixture.borderFormatting('dotted', 8,
        '#0000FF');
      var left = FormattingFixture.borderFormatting('solid', 8,
        '#00FF00');
      var borders = FormattingFixture.bordersFormatting(top, right, bottom,
        left);

      var formatting = {
        'borders': borders
      };
      var rowDCP = UpdateRowFixture.updateRowElement(3, undefined, formatting);
      var v = {
        el: rowDCP,
        node: parentNode_
      };
      UpdateRowHandler.visit(v);
      assert.isTrue(row.applyBackgroundAndBorders.calledWith(undefined,
        borders));
    });

    it('should store borders formatting information for rows', function() {
      var top = FormattingFixture.borderFormatting('double', 16,
        '#000000');
      var right = FormattingFixture.borderFormatting('dashed', 24,
        '#FFFFFF');
      var bottom = FormattingFixture.borderFormatting('dotted', 8,
        '#0000FF');
      var left = FormattingFixture.borderFormatting('solid', 8,
        '#00FF00');
      var borders = FormattingFixture.bordersFormatting(top, right, bottom,
        left);
      var formatting = {
        'bg': '#FF0000',
        'borders': borders
      };

      var rowDCP = UpdateRowFixture.updateRowElement(0, undefined, formatting);
      var v = {
        el: rowDCP,
        node: parentNode_
      };
      UpdateRowHandler.visit(v);
      var rowFormat = row.getFormatting();
      assert.isDefined(rowFormat);
      assert.strictEqual(rowFormat.bg, '#FF0000');
      assert.isDefined(rowFormat.borders);
      assert.strictEqual(rowFormat.borders.top, top);
      assert.strictEqual(rowFormat.borders.right, right);
      assert.strictEqual(rowFormat.borders.bottom, bottom);
      assert.strictEqual(rowFormat.borders.left, left);
    });

    it('should cache the specific row height when the row DCP has one ' +
      'specified', function() {

      // Apply the sheet row handler to process row DCP that specifies
      // a specific height for row 8
      var rowIndex = 8;
      var specificRowHeight = SheetConfig.kGRID_DEFAULT_ROW_HEIGHT + 30;
      var rowFormatting = {};
      var rowDCP = UpdateRowFixture.updateRowElement(rowIndex,
        specificRowHeight, rowFormatting);
      var v = {
        el: rowDCP
      };
      UpdateRowHandler.visit(v);

      // Check that the specific height for row 8 has been cached by the
      // handler
      assert.strictEqual(SheetModel.specificRowHeights[rowIndex],
        UnitConversionUtils.convertPointToPixel(specificRowHeight));
    });

  });
});
