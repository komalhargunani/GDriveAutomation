// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit test case for CellDecorator
 *
 * @author mikkor@quickoffice.com (Mikko Rintala)
 */

define([
  'qowtRoot/dcp/decorators/cellDecorator',
  'qowtRoot/fixtures/sheet/sheetFormattingFixture'
], function(CellDecorator,
            SheetFormattingFixture) {

  'use strict';

  describe('dcp/decorators/cellDecorator ', function() {
    var _domNode;

    beforeEach(function() {
      _domNode = document.createElement('DIV');
    });

    afterEach(function() {
      _domNode = undefined;
    });

    it('should set the word wrap if present in dcp', function() {
      var formatting = SheetFormattingFixture.wrappedTextFormattingObject();

      CellDecorator.decorate(_domNode, formatting);

      expect(_domNode.classList.contains('qowt-sheet-cell-wrap')).toBeTruthy();
    });

    it('should not set the word wrap if not present in dcp', function() {
      var formatting = {};

      CellDecorator.decorate(_domNode, formatting);

      expect(_domNode.classList.contains('qowt-sheet-cell-wrap')).toBeFalsy();
    });
  });
});
