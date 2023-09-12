/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/widgets/grid/column',
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/cell'
], function(
    ColumnWidget,
    ColHeaderContainer,
    CellWidget) {

  'use strict';



  describe('A grid column', function() {
    var colRootNode, _widget,
        _kHide_Left_Border_Class = 'qowt-hide-left-border';

    beforeEach(function() {


      colRootNode = document.createElement('div');
      colRootNode.id = 'test-rootNode';
      document.body.appendChild(colRootNode);

      ColHeaderContainer.init();

    });

    afterEach(function() {
      _widget = undefined;

      document.body.removeChild(document.getElementById('test-rootNode'));
      colRootNode = undefined;
    });

    it('should be able to get the index of the column', function() {
      var colIndex = 53;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);
      expect(columnWidget.getIndex()).toBe(colIndex);
    });

    it('should throw an error if no parameters were supplied to the ' +
        'constructor', function() {
          expect(function() {
            _widget = ColumnWidget.create();
          }).toThrow('Column: Constructor missing parameter list [index,' +
              ' position, colWidth]');
        });

    it('should throw an error if the incorrect amount of parameters were ' +
        'supplied to the constructor', function() {
          expect(function() {
            _widget = ColumnWidget.create(0);
          }).toThrow('Column: Constructor missing parameter list [index,' +
              ' position, colWidth]');
          expect(function() {
            _widget = ColumnWidget.create(0, 10);
          }).toThrow('Column: Constructor missing parameter list [index,' +
              ' position, colWidth]');
        });

    it('should be in an initialised state if all parameters were supplied to ' +
        'the constructor', function() {
          _widget = ColumnWidget.create(0, 10, 40);
          expect(_widget).toBeDefined();
        });

    it('should return a cell when calling getCell', function() {
      var colIndex = 0,
          colPos = 10,
          colHeight = 40,
          colWidget = ColumnWidget.create(colIndex, colPos, colHeight);

      colWidget.appendTo(colRootNode);

      var cell = Object.create(CellWidget).init(0, 0, {
        cellText: 'Sample text'
      });
      colWidget.attachWidget(cell);

      expect(colWidget.getCell(0)).toBe(cell);
    });

    it('should have a column that does not have a hidden left border after ' +
        'construction (hidden left border is used for a hidden column)',
        function() {
          var colIndex = 0;
          var colPos = 10;
          var colWidth = 40;
          var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);
          columnWidget.appendTo(colRootNode);

          var colNode = document.getElementsByClassName('qowt-sheet-col')[0];
          expect(
              colNode.classList.contains(_kHide_Left_Border_Class)).toBe(false);
        });


    function testApplyBackgroundColor(columnWidget) {
      var backgroundColor = '#FF00FF';
      columnWidget.appendTo(colRootNode);
      columnWidget.applyBackgroundAndBorders(backgroundColor);

      var colNode = document.getElementsByClassName('qowt-sheet-col');
      expect(colNode.length).toBeGreaterThan(0);
      expect(colNode[0]).toBeDefined();
      expect(colNode[0].style.backgroundColor).toBe('rgb(255, 0, 255)');
    }

    it('should apply a background color if one is set', function() {
      var colIndex = 0;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);

      testApplyBackgroundColor(columnWidget);
    });

    function testApplyBorders(columnWidget) {
      var borderTop = {
        width: 8, color: '#000000', style: 'dashed'
      };
      var borderRight = {
        width: 16, color: '#FFFFFF', style: 'solid'
      };
      var borderBottom = {
        width: 24, color: '#0000FF', style: 'dotted'
      };
      var borderLeft = {
        width: 32, color: '#00FF00', style: 'double'
      };
      var borders = {
        top: borderTop,
        right: borderRight,
        bottom: borderBottom,
        left: borderLeft
      };

      columnWidget.appendTo(colRootNode);
      columnWidget.applyBackgroundAndBorders(undefined, borders);

      var colNode = columnWidget.getColumnNode();
      expect(colNode).toBeDefined();

      expect(colNode.style['border-top-style']).toBe('dashed');
      expect(colNode.style['border-top-width']).toBe('1pt');
      expect(colNode.style['border-top-color']).toBe('rgb(0, 0, 0)');

      expect(colNode.style['border-right-style']).toBe('solid');
      expect(colNode.style['border-right-width']).toBe('2pt');
      expect(colNode.style['border-right-color']).toBe('rgb(255, 255, 255)');

      expect(colNode.style['border-bottom-style']).toBe('dotted');
      expect(colNode.style['border-bottom-width']).toBe('3pt');
      expect(colNode.style['border-bottom-color']).toBe('rgb(0, 0, 255)');

      expect(colNode.style['border-left-style']).toBe('double');
      expect(colNode.style['border-left-width']).toBe('4pt');
      expect(colNode.style['border-left-color']).toBe('rgb(0, 255, 0)');
    }

    it('should apply borders if borders are set', function() {
      var colIndex = 0;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);

      testApplyBorders(columnWidget);
    });

    it('should set row/col precedence correctly', function() {
      var colIndex = 0;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);

      var backgroundColor = '#FF00FF';
      var borderLeft = {
        width: 32, color: '#00FF00', style: 'double'
      };
      var borders = {
        left: borderLeft
      };

      columnWidget.appendTo(colRootNode);
      columnWidget.applyBackgroundAndBorders(backgroundColor, borders);

      var colNode = columnWidget.getColumnNode();
      expect(colNode).toBeDefined();
      expect(colNode.className).toMatch(/.*qowt-sheet-formatted-col.*/);
    });

    it('should store formatting for the column', function() {
      var colIndex = 0;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);

      columnWidget.appendTo(colRootNode);
      var formatting = {
        'b': 1,
        'bg': '#FFFF00',
        'fi': 1,
        'fs': 8
      };
      columnWidget.setFormatting(formatting);

      expect(columnWidget.getFormatting()).toBe(formatting);
    });

    it('should be able to get the prepped width of the column', function() {
      var colIndex = 53;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);

      // before any prep is done, the prepped width should equal the actual
      // width
      expect(columnWidget.getPreppedWidth()).toBe(colWidth);

      var preppedWidth = 128;
      // after the column is prepped, the prepped width should be what was
      // specified
      columnWidget.prepLayoutWidth(preppedWidth);
      expect(columnWidget.getPreppedWidth()).toBe(preppedWidth);
    });

    it('should be able to set the pre-hidden width of the column', function() {
      var colIndex = 44;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);
      columnWidget.appendTo(colRootNode);

      // before any setting is done, the pre-hidden width should equal the
      // actual width
      expect(columnWidget.getPreHiddenWidth()).toBe(colWidth);

      var preHiddenWidth = 145;
      // after the column has its pre-hidden width set, it should be what was
      // specified
      columnWidget.setPreHiddenWidth(preHiddenWidth);
      expect(columnWidget.getPreHiddenWidth()).toBe(preHiddenWidth);
    });

    it('should not have a hidden left border if the column is not hidden',
       function() {
         var colIndex = 0;
         var colPos = 15;
         var colWidth = 99; // a non-hidden column
         var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);
         columnWidget.appendTo(colRootNode);

         var colNode = document.getElementsByClassName('qowt-sheet-col')[0];
         expect(
             colNode.classList.contains(_kHide_Left_Border_Class)).toBe(false);
       });


    function verifyNoBorders() {
      var colNode = document.getElementsByClassName('qowt-sheet-col');
      expect(colNode.length).toBeGreaterThan(0);
      expect(colNode[0]).toBeDefined();

      expect(colNode[0].style['border-top-style']).toBe('');
      expect(colNode[0].style['border-top-width']).toBe('');
      expect(colNode[0].style['border-top-color']).toBe('');

      expect(colNode[0].style['border-right-style']).toBe('');
      expect(colNode[0].style['border-right-width']).toBe('');
      expect(colNode[0].style['border-right-color']).toBe('');

      expect(colNode[0].style['border-bottom-style']).toBe('');
      expect(colNode[0].style['border-bottom-width']).toBe('');
      expect(colNode[0].style['border-bottom-color']).toBe('');

      expect(colNode[0].style['border-left-style']).toBe('');
      expect(colNode[0].style['border-left-width']).toBe('');
      expect(colNode[0].style['border-left-color']).toBe('');
    }

    function verifyNoBackground() {
      var colNode = document.getElementsByClassName('qowt-sheet-col');
      expect(colNode.length).toBeGreaterThan(0);
      expect(colNode[0]).toBeDefined();

      expect(colNode[0].style.border).toBe('');
    }

    it('should RESET background formatting when it is set', function() {
      var colIndex = 0;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);

      testApplyBackgroundColor(columnWidget);

      columnWidget.resetFormatting();

      verifyNoBackground(columnWidget);
    });

    it('should RESET border formatting when it is set', function() {
      var colIndex = 0;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);

      testApplyBorders(columnWidget);

      columnWidget.resetFormatting();

      verifyNoBorders(columnWidget);
    });

    it('should RESET general formatting when it is set', function() {
      var colIndex = 0;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);

      columnWidget.setFormatting('blah');
      expect(columnWidget.getFormatting()).toMatch('blah');

      columnWidget.resetFormatting();

      expect(columnWidget.getFormatting()).toBe(undefined);
    });

    it('should RESET the node class when it is set', function() {

      var colIndex = 0;
      var colPos = 10;
      var colWidth = 40;
      var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);
      columnWidget.appendTo(colRootNode);

      var colNode = document.getElementsByClassName('qowt-sheet-col');
      expect(colNode.length).toBeGreaterThan(0);
      expect(colNode[0]).toBeDefined();
      expect(colNode[0].className).toBe('qowt-sheet-col');

      testApplyBackgroundColor(columnWidget);
      testApplyBorders(columnWidget);

      colNode = columnWidget.getColumnNode();
      expect(colNode).toBeDefined();
      expect(colNode.className).toMatch(/.*qowt-sheet-formatted-col.*/);

      columnWidget.resetFormatting();

      colNode = document.getElementsByClassName('qowt-sheet-col');
      expect(colNode.length).toBeGreaterThan(0);
      expect(colNode[0]).toBeDefined();
      expect(colNode[0].className).toBe('qowt-sheet-col');
    });

    it('should have a cloneTo() method which clones the specified column ' +
        'widget', function() {
          var numChildNodes = colRootNode.childNodes.length;
          expect(numChildNodes).toBe(0);

          var colIndex = 0;
          var colPos = 10;
          var colWidth = 40;
          var columnWidget = ColumnWidget.create(colIndex, colPos, colWidth);
          columnWidget.appendTo(colRootNode);
          numChildNodes = colRootNode.childNodes.length;
          expect(numChildNodes).toBeGreaterThan(0);

          columnWidget.cloneTo(colRootNode);
          var numChildNodesAfterCloning = colRootNode.childNodes.length;
          expect(numChildNodesAfterCloning).toEqual(numChildNodes * 2);
        });

    it('should have detach the specified widget when requested', function() {
      var colIndex = 0,
          colPos = 10,
          colHeight = 40,
          colWidget = ColumnWidget.create(colIndex, colPos, colHeight);

      colWidget.appendTo(colRootNode);

      var cell = Object.create(CellWidget).init(0, 0, {
        cellText: 'Sample text'
      });
      colWidget.attachWidget(cell);

      expect(colWidget.getCell(0)).toBe(cell);

      colWidget.detachWidget(cell);
      expect(colWidget.getCell(0)).toBeUndefined();
    });

    it('should have thrown if trying to detach an undefined widget',
       function() {
         var colIndex = 0,
             colPos = 10,
             colHeight = 40,
             colWidget = ColumnWidget.create(colIndex, colPos, colHeight);

         colWidget.appendTo(colRootNode);

         var cell = Object.create(CellWidget).init(0, 0, {
           cellText: 'Sample text'
         });
         colWidget.attachWidget(cell);

         expect(colWidget.getCell(0)).toBe(cell);

         expect(function() {
           colWidget.detachWidget(undefined);
         }).toThrow('detachWidget - missing widget parameter!');
       });

    it('should add column header node to header container', function() {
      var colIndex = 0,
          colPos = 10,
          colHeight = 40,
          colWidget = ColumnWidget.create(colIndex, colPos, colHeight),
          headerContainerChildCount =
              ColHeaderContainer.container().childElementCount;

      colWidget.appendTo(colRootNode, true);

      expect(ColHeaderContainer.container().childElementCount).
          toBe(headerContainerChildCount + 1);
    });

    it('should not add column header node to header container', function() {
      var colIndex = 0,
          colPos = 10,
          colHeight = 40,
          colWidget = ColumnWidget.create(colIndex, colPos, colHeight),
          headerContainerChildCount =
              ColHeaderContainer.container().childElementCount;

      colWidget.appendTo(colRootNode);

      expect(ColHeaderContainer.container().childElementCount).
          toBe(headerContainerChildCount);
    });

  });
});
