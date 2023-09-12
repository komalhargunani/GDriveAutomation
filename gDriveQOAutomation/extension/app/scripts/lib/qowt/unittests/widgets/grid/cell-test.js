// Copyright 2014 Google Inc. All Rights Reserved.

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/fixtures/sheet/sheetFormattingFixture',
  'qowtRoot/models/sheet',
  'qowtRoot/widgets/grid/cell',
  'qowtRoot/variants/configs/sheet'
], function(
    UnittestUtils,
    FormattingFixture,
    SheetModel,
    SheetCell,
    SheetConfig) {

  'use strict';

  describe('sheet cell widget', function() {

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
         var cellWidget = Object.create(SheetCell).init(0, 0, {});
         expect(cellWidget.cellText).toBeUndefined();
       });

    it('should return the text', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'Sample text',
        editableText: 'Sample editable text'
      });
      expect(cellWidget.cellText).toBe('Sample text');
    });

    it('should return the editable text', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'Sample text',
        editableText: 'Sample editable text'
      });
      expect(cellWidget.getEditableText()).toBe('Sample editable text');
    });

    it('should not create a background node if it is not needed', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        formatting: {}
      });

      cellWidget.appendTo(rootNode);
      var formatNode = document.getElementsByClassName(
          'qowt-sheet-cell-format');

      expect(formatNode.length).toBe(0);
      expect(formatNode[0]).not.toBeDefined();
    });

    it('should create a background node if the cell has background color set',
       function() {
         var cellWidget = Object.create(SheetCell).init(0, 0, {
           cellText: 'text',
           backgroundColor: '#00FFFF',
           formatting: {'bg': '#00FFFF'}
         });

         cellWidget.appendTo(rootNode);
         var formatNode = document.getElementsByClassName(
             'qowt-sheet-cell-format');

         expect(formatNode.length).toBeGreaterThan(0);
         expect(formatNode[0]).toBeDefined();
       });

    it('should create a background node if the cell has borders set',
       function() {
         var borderTop = FormattingFixture.borderFormatting(
             'double', 16, '#FF00FF');
         var borders = FormattingFixture.bordersFormatting(borderTop);

         var cellWidget = Object.create(SheetCell).init(0, 0, {
           cellText: 'text',
           borders: borders,
           formatting: {'borders': borders}
         });

         cellWidget.appendTo(rootNode);
         var formatNode = document.getElementsByClassName(
             'qowt-sheet-cell-format');

         expect(formatNode.length).toBeGreaterThan(0);
         expect(formatNode[0]).toBeDefined();
       });

    it('should apply a background color if one is set', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        backgroundColor: '#00FF00'
      });

      cellWidget.appendTo(rootNode);
      var formatNode = document.getElementsByClassName(
          'qowt-sheet-cell-format');

      expect(formatNode.length).toBeGreaterThan(0);
      expect(formatNode[0]).toBeDefined();
      expect(formatNode[0].style.backgroundColor).toBe('rgb(0, 255, 0)');
    });

    it('should create a content div if the cell contains text', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
    });

    it('should not create a content div if the cell contains no text',
       function() {
         var cellWidget = Object.create(SheetCell).init(0, 0, {
           formatting: undefined
         });

         cellWidget.appendTo(rootNode);
         var contentNode = document.getElementsByClassName(
             'qowt-sheet-cell-content');

         expect(contentNode.length).toBe(0);
         expect(contentNode[0]).not.toBeDefined();
       });

    it('should create a content div with a single space char in it if the ' +
        'cell contains is a merge anchor', function() {
          var cellWidget = Object.create(SheetCell).init(0, 0, {
            cellText: 'text',
            isMergeAnchor: true
          });

          cellWidget.appendTo(rootNode);
          var contentNode = document.getElementsByClassName(
              'qowt-sheet-cell-content');

          expect(contentNode.length).toBeGreaterThan(0);
          expect(contentNode[0]).toBeDefined();
          expect(contentNode[0].innerHTML).toMatch(/.*&nbsp;.*/);
        });

    it('should apply horizontal alignment left', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        horizontalAlign: 'l'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-horizontal-align-left.*');
    });

    it('should apply horizontal alignment right', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        horizontalAlign: 'r'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-horizontal-align-right.*');
    });

    it('should apply vertical alignment bottom', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        verticalAlign: 'b'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-vertical-align-bottom.*');
    });

    it('should apply vertical alignment top', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        verticalAlign: 't'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-vertical-align-top.*');
    });

    it('should apply vertical alignment centre', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        verticalAlign: 'c'
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].className).toMatch(
          '.*qowt-vertical-align-center.*');
    });

    it('should apply font face if one is set', function() {
      SheetModel.fontNames = ['courier', 'arial'];

      var formatting = FormattingFixture.fontFormattingObject(1);
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        formatting: formatting
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].classList.contains('qowt-font1-arial')).toBe(true);
    });

    it('should apply font size if set', function() {

      var formatting = FormattingFixture.fontFormattingObject(2, 18);
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        formatting: formatting
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.fontSize).toBe('18pt');
    });

    it('should apply bold text if set', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        formatting: {'bld': 1}
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.fontWeight).toBe('bold');
    });

    it('should apply italic text if set', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        formatting: {'itl': 1}
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.fontStyle).toBe('italic');
    });

    it('should apply underline text if set', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        formatting: {'udl': 1}
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.textDecoration).toBe('underline');
    });

    it('should apply strikethrough text if set', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        formatting: {'strikethrough': 1}
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.textDecoration).toBe('line-through');
    });


    it('should apply text color if set', function() {
      var formatting = FormattingFixture.fontFormattingObject(
          1, 10, '#FFFF00');
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        formatting: formatting
      });

      cellWidget.appendTo(rootNode);
      var contentNode =
          document.getElementsByClassName('qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(contentNode[0].style.color).toBe('rgb(255, 255, 0)');
    });

    it('should have a cloneTo() method which clones the specified cell widget',
       function() {
         var numChildNodes = rootNode.childNodes.length;
         expect(numChildNodes).toBe(0);

         var cellWidget = Object.create(SheetCell).init(0, 0, {
           cellText: 'text'
         });
         cellWidget.appendTo(rootNode);
         numChildNodes = rootNode.childNodes.length;
         expect(numChildNodes).toBeGreaterThan(0);

         cellWidget.cloneTo(rootNode);
         var numChildNodesAfterCloning = rootNode.childNodes.length;
         expect(numChildNodesAfterCloning).toEqual(numChildNodes * 2);
       });

    it('should keep its original config', function() {
      var config = {
        cellText: 'text',
        formatting: {'bg': '#00FFFF'}
      };

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      cellWidget.appendTo(rootNode);

      expect(cellWidget.getConfig()).toBe(config);
    });

    it('should apply right horizontal alignment if set', function() {
      var config = {
        horizontalAlign: 'r'
      };

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.hAlignment).toBe('right');
    });

    it('should apply justified horizontal alignment if set', function() {
      var config = {
        horizontalAlign: 'j'
      };

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.hAlignment).toBe('justified');
    });

    it('should apply centre horizontal alignment if set', function() {
      var config = {
        horizontalAlign: 'c'
      };

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.hAlignment).toBe('centre');
    });

    it('should default to left horizontal alignment if not set', function() {
      var config = {};

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.hAlignment).toBe('left');
    });

    it('should apply top vertical alignment if set', function() {
      var config = {
        verticalAlign: 't'
      };

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.vAlignment).toBe('top');
    });

    it('should apply centre vertical alignment if set', function() {
      var config = {
        verticalAlign: 'c'
      };

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.vAlignment).toBe('centre');
    });

    it('should default to bottom vertical alignment if not set', function() {
      var config = {};

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.vAlignment).toBe('bottom');
    });

    it('should default to general number format if not set', function() {
      var config = {};

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.numberFormat).toBe('General');
    });

    it('should apply number format if set', function() {
      var config = {
        formatting: {'nf': '@'}
      };

      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.numberFormat).toBe('@');
    });

    it('should remove the formatting node when removed from parent',
       function() {
         var cellWidget = Object.create(SheetCell).init(0, 0, {
           cellText: 'text',
           backgroundColor: '#00FFFF',
           formatting: {'bg': '#00FFFF'}
         });

         cellWidget.appendTo(rootNode);

         var contentNode = document.getElementsByClassName(
             'qowt-sheet-cell-content');
         expect(contentNode.length).toBeGreaterThan(0);
         expect(contentNode[0]).toBeDefined();

         var formatNode = document.getElementsByClassName(
             'qowt-sheet-cell-format');
         expect(formatNode.length).toBeGreaterThan(0);
         expect(formatNode[0]).toBeDefined();

         cellWidget.removeFromParent();

         contentNode = document.getElementsByClassName(
             'qowt-sheet-cell-content');
         expect(contentNode.length).toBe(0);
         formatNode = document.getElementsByClassName(
             'qowt-sheet-cell-format');
         expect(formatNode.length).toBe(0);
       });

    it('should hide divs when width or height equals 0', function() {
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text',
        backgroundColor: '#00FFFF',
        formatting: {'bg': '#00FFFF'}
      });

      cellWidget.appendTo(rootNode);

      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');
      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0].style.display).toBe('');

      var formatNode = document.getElementsByClassName(
          'qowt-sheet-cell-format');
      expect(formatNode.length).toBeGreaterThan(0);
      expect(formatNode[0].style.display).toBe('');

      cellWidget.width = 0;
      cellWidget.height = 100;
      expect(contentNode[0].style.display).toBe('none');
      expect(formatNode[0].style.display).toBe('none');

      cellWidget.width = 100;
      cellWidget.height = 0;
      expect(contentNode[0].style.display).toBe('none');
      expect(formatNode[0].style.display).toBe('none');

      cellWidget.width = 100;
      cellWidget.height = 100;
      expect(contentNode[0].style.display).toBe('');
      expect(formatNode[0].style.display).toBe('');
    });

    it('should apply wrap text property if set', function() {
      var formatting = FormattingFixture.wrappedTextFormattingObject();
      var cellWidget = Object.create(SheetCell).init(0, 0, {
        cellText: 'text to be wrapped',
        formatting: formatting
      });

      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
          'qowt-sheet-cell-content');

      expect(contentNode.length).toBeGreaterThan(0);
      expect(contentNode[0]).toBeDefined();
      expect(
          contentNode[0].classList.contains('qowt-sheet-cell-wrap')).toBe(true);
    });

    it('should have hyperlink information if set', function() {
      var config = {
        cellText: 'text',
        hyperlink: true,
        hyperlinkType: 'External',
        hyperlinkTarget: 'http://www.google.com'
      };
      var cellWidget = Object.create(SheetCell).init(0, 0, config);

      expect(cellWidget.hasHyperlink()).toBeTruthy();
      expect(cellWidget.getHyperlinkType()).toBe('External');
      expect(cellWidget.getHyperlinkTarget()).toBe('http://www.google.com');

    });

  });

});
