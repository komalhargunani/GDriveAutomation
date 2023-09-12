/*!
 * Copyright Google, Inc, 2013
 *
 */

define([
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/dcp/updateColumnHandler',
  'qowtRoot/fixtures/sheet/sheetFormattingFixture',
  'qowtRoot/fixtures/sheet/updateColumnElementFixture',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/models/sheet'
], function(Workbook,
    UpdateColumnHandler,
    FormattingFixture,
    UpdateColumnFixture,
    PaneManager,
    SheetModel) {

  'use strict';

  describe('update column DCP Handler', function() {

    var handler, col, rootNode;

    beforeEach(function() {
      // Create a dummy grid

      rootNode = document.createElement('div');

      Workbook.init(rootNode);
      rootNode.style.visibility = 'hidden';

      handler = UpdateColumnHandler;

      col = PaneManager.getMainPane().getColumn(0);
      spyOn(col, 'applyBackgroundAndBorders').andCallThrough();
    });

    afterEach(function() {
      Workbook.reset();
      handler = undefined;
      col = undefined;
    });

    it('should apply background colors for cols', function() {
      var backgroundColor = '#00FF00';
      var formatting = {'bg': backgroundColor};
      var colDCP = UpdateColumnFixture.updateColumnElement(0, formatting);

      var v = {el: colDCP};
      handler.visit(v);

      expect(col.applyBackgroundAndBorders).toHaveBeenCalledWith(
          backgroundColor, undefined);
    });

    it('should apply bold, italics and underline for cols', function() {
      var formatting = {
        'bld': true,
        'itl': true,
        'udl': true};
      var colDCP = UpdateColumnFixture.updateColumnElement(0, formatting);

      var v = {el: colDCP};
      handler.visit(v);

      expect(SheetModel.ColFormatting[0].bld).toBeTruthy();
      expect(SheetModel.ColFormatting[0].itl).toBeTruthy();
      expect(SheetModel.ColFormatting[0].udl).toBeTruthy();
    });

    it('should apply number format for cols', function() {
      var formatting = {'nf': '@'};
      var colDCP = UpdateColumnFixture.updateColumnElement(0, formatting);

      var v = {el: colDCP};
      handler.visit(v);

      expect(SheetModel.ColFormatting[0].nf).toBe('@');
    });

    it('should apply number font face and size for cols', function() {
      var formatting = {
        'fi': 5,
        'siz': 10
      };
      var colDCP = UpdateColumnFixture.updateColumnElement(0, formatting);

      var v = {el: colDCP};
      handler.visit(v);

      expect(SheetModel.ColFormatting[0].fi).toBe(5);
      expect(SheetModel.ColFormatting[0].siz).toBe(10);
    });

    it('should apply alignments for cols', function() {
      var formatting = {
        'ha': 'c',
        'va': 't'
      };
      var colDCP = UpdateColumnFixture.updateColumnElement(0, formatting);

      var v = {el: colDCP};
      handler.visit(v);

      expect(SheetModel.ColFormatting[0].ha).toBe('c');
      expect(SheetModel.ColFormatting[0].va).toBe('t');
    });

    it('should apply borders formatting for cols', function() {
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

      var formatting = {'borders': borders};
      var colDCP = UpdateColumnFixture.updateColumnElement(0, formatting);
      var v = {el: colDCP};
      handler.visit(v);

      expect(col.applyBackgroundAndBorders).toHaveBeenCalledWith(undefined,
          borders);
    });

    it('should store borders formatting information for cols', function() {
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
      var formatting = {'bg': '#FF0000', 'borders': borders};

      var colDCP = UpdateColumnFixture.updateColumnElement(0, formatting);
      var v = {el: colDCP};
      handler.visit(v);

      expect(col.getFormatting()).toBeDefined();
      expect(col.getFormatting().bg).toBe('#FF0000');
      expect(col.getFormatting().borders).toBeDefined();
      expect(col.getFormatting().borders.top).toBe(top);
      expect(col.getFormatting().borders.right).toBe(right);
      expect(col.getFormatting().borders.bottom).toBe(bottom);
      expect(col.getFormatting().borders.left).toBe(left);
    });

  });

  return {};
});
