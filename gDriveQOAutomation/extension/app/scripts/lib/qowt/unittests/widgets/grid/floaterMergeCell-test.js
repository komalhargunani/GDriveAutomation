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
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/fixtures/sheet/sheetFormattingFixture',
  'qowtRoot/models/sheet',
  'qowtRoot/widgets/grid/floaterMergeCell',
  'qowtRoot/variants/configs/sheet'
], function(
    UnittestUtils,
    FormattingFixture,
    SheetModel,
    SheetFloaterMergeCell,
    SheetConfig) {

  'use strict';


  describe('sheet floater merge cell widget', function() {

    var rootNode, testAppendArea;

    beforeEach(function() {

      SheetConfig.kGRID_DEFAULT_ROWS = 150;
      SheetConfig.kGRID_DEFAULT_COLS = 150;
      SheetConfig.kGRID_DEFAULT_ROW_HEIGHT = 45;
      SheetConfig.kGRID_DEFAULT_COL_WIDTH = 180;
      SheetConfig.kGRID_GRIDLINE_WIDTH = 1;

      testAppendArea = UnittestUtils.createTestAppendArea();
      rootNode = document.createElement('div');
      testAppendArea.appendChild(rootNode);
    });

    afterEach(function() {
      testAppendArea.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should return undefined if cell has no, editable text or text',
       function() {
         var cellWidget = SheetFloaterMergeCell.create(0, 0, {});
         expect(cellWidget.getCellText()).toMatch('');
       });

    it('should return the text', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'Sample text',
        editableText: 'Sample editable text'
      });
      expect(cellWidget.getCellText()).toBe('Sample text');
    });

    it('should return the editable text', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'Sample text',
        editableText: 'Sample editable text'
      });
      expect(cellWidget.getEditableText()).toBe('Sample editable text');
    });

    it('should return the row span of the merged cell', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'Sample text',
        editableText: 'Sample editable text',
        rowSpan: 7
      });
      expect(cellWidget.rowSpan()).toBe(7);
    });

    it('should return the column span of the merged cell', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'Sample text',
        editableText: 'Sample editable text',
        colSpan: 15
      });
      expect(cellWidget.colSpan()).toBe(15);
    });

    it('should create a background node even if background color is NOT set',
       function() {
         var cellWidget = SheetFloaterMergeCell.create(0, 0, {
           cellText: 'text'
         });

         cellWidget.appendTo(rootNode);
         var formatNode = document.getElementsByClassName(
             'qowt-sheet-merge-cell-floater-background');

         expect(formatNode.length).toBeGreaterThan(0);
         expect(formatNode[0]).toBeDefined();
       });

    it('should create a background node if the cell has background color set',
       function() {
         var cellWidget = SheetFloaterMergeCell.create(0, 0, {
           cellText: 'text',
           backgroundColor: '#00FFFF'
         });

         cellWidget.appendTo(rootNode);
         var formatNode = document.getElementsByClassName(
             'qowt-sheet-merge-cell-floater-background');

         expect(formatNode.length).toBeGreaterThan(0);
         expect(formatNode[0]).toBeDefined();
       });

    it('should apply a background color if one is set', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        backgroundColor: '#00FF00'
      });

      cellWidget.appendTo(rootNode);
      var formatNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-background');

      expect(formatNode.length).toBeGreaterThan(0);
      expect(formatNode[0]).toBeDefined();
      expect(formatNode[0].style.backgroundColor).toBe('rgb(0, 255, 0)');
    });

    it('should create a content div if the cell contains text', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
    });

    it('should remove itself entirely from its parent node when removeParent ' +
        'is called', function() {

          var originalNumChildren = rootNode.childNodes.length;

          var cellWidget = SheetFloaterMergeCell.create(0, 0, {
            cellText: 'text',
            backgroundColor: '#00FF00'
          });

          cellWidget.appendTo(rootNode);

          var newNumChildren = rootNode.childNodes.length;
          expect(newNumChildren).toBe(originalNumChildren + 2);

          cellWidget.removeFromParent();

          newNumChildren = rootNode.childNodes.length;
          expect(newNumChildren).toBe(originalNumChildren);
        });


    /*  // AC_invalid test due to current DCP merge cell having to always be
     // created to blank out borders of cells under merge cell.
     // ... real fix is to get service NOT to send DCP borders for underlying
     // cells.
     it('should not create a content div if the cell contains no text',
        function() {
          var cellWidget = SheetFloaterMergeCell.create(0, 0, {
            formatting: {'fi': 0, 'b': 1, 'it': 1}
          });

          cellWidget.appendTo(rootNode);
          var contentNode = document.getElementsByClassName(
              'qowt-sheet-merge-cell-floater-text');

          expect(contentNode.length).toBe(0);
          expect(contentNode[0]).not.toBeDefined();
        });
     */
    it('should apply horizontal alignment left', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        horizontalAlign: 'l'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-horizontal-align-left.*');
    });

    it('should apply horizontal alignment centre', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        horizontalAlign: 'c'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-horizontal-align-center.*');
    });

    it('should apply horizontal alignment right', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        horizontalAlign: 'r'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-horizontal-align-right.*');
    });

    it('should apply horizontal alignment justified', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        horizontalAlign: 'j'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-horizontal-align-justify.*');
    });

    it('should apply vertical alignment bottom', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        verticalAlign: 'b'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-vertical-align-bottom.*');
    });

    it('should apply vertical alignment top', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        verticalAlign: 't'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch('.*qowt-vertical-align-top.*');
    });

    it('should apply vertical alignment centre', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        verticalAlign: 'c'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-vertical-align-center.*');
    });

    it('should apply font face if one is set', function() {
      SheetModel.fontNames = ['courier', 'arial'];

      var formatting = FormattingFixture.fontFormattingObject(1);
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        formatting: formatting
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].classList.contains('qowt-font1-arial')).toBe(true);
    });

    it('should apply font size if set', function() {

      var formatting = FormattingFixture.fontFormattingObject(2, 18);
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        formatting: formatting
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.fontSize).toBe('18pt');
    });

    it('should apply bold text if set', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        formatting: {'bld': 1}
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.fontWeight).toBe('bold');
    });

    it('should apply italic text if set', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        formatting: {'itl': 1}
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.fontStyle).toBe('italic');
    });

    it('should apply underline text if set', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        formatting: {'udl': 1}
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.textDecoration).toBe('underline');
    });

    it('should apply strikethrough text if set', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        formatting: {'strikethrough': true}
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.textDecoration).toBe('line-through');
    });


    it('should apply text color if set', function() {
      var formatting = FormattingFixture.fontFormattingObject(1, 10, '#FFFF00');
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text',
        formatting: formatting
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-merge-cell-floater-text');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.color).toBe('rgb(255, 255, 0)');
    });

    it('should have a cloneTo() method which clones the specified merge cell ' +
        'widget', function() {
          var numChildNodes = rootNode.childNodes.length;
          expect(numChildNodes).toBe(0);

          var cellWidget = SheetFloaterMergeCell.create(0, 0, {
            cellText: 'text'
          });
          cellWidget.appendTo(rootNode);
          numChildNodes = rootNode.childNodes.length;
          expect(numChildNodes).toBeGreaterThan(0);

          cellWidget.cloneTo(rootNode);
          var numChildNodesAfterCloning = rootNode.childNodes.length;
          expect(numChildNodesAfterCloning).toEqual(numChildNodes * 2);
        });

    it('should request to be selected', function() {
      var cellWidget = SheetFloaterMergeCell.create(0, 0, {
        cellText: 'text'
      });

      cellWidget.appendTo(rootNode);

      expect(cellWidget.isSelectable()).toBe(true);
    });

  });
});
