define([
  'qowtRoot/widgets/grid/row',
  'qowtRoot/widgets/grid/rowHeaderContainer',
  'qowtRoot/widgets/grid/cell',
  'qowtRoot/models/sheet'
], function(
    Row,
    RowHeaderContainer,
    SheetCell,
    SheetModel) {

  'use strict';

  describe('A grid row', function() {
    var rootNode,
        _widget,
        _rowDiv,
        _kHide_Top_Border_Class = 'qowt-hide-top-border';

    beforeEach(function() {
      _rowDiv = document.createElement('div');
      document.body.appendChild(_rowDiv);

      rootNode = document.createElement('div');
      rootNode.id = 'test-rootNode';
      document.body.appendChild(rootNode);

      RowHeaderContainer.init();
    });

    afterEach(function() {
      _widget = undefined;

      document.body.removeChild(document.getElementById('test-rootNode'));
      rootNode = undefined;

      document.body.removeChild(_rowDiv);
      _rowDiv = undefined;
    });


    it('should be able to get the index of the row', function() {
      var rowIndex = 47;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      expect(rowWidget.getIndex()).toBe(rowIndex);
    });

    it('should throw an error if no parameters were supplied to the ' +
        'constructor', function() {
          expect(function() {
            _widget = Row.create();
          }).toThrow('Row widget: Constructor missing parameter list [index,' +
              ' position, rowHeight]');
        });

    it('should throw an error if the incorrect amount of parameters were ' +
        'supplied to the constructor', function() {
          expect(function() {
            _widget = Row.create(0);
          }).toThrow('Row widget: Constructor missing parameter list [index,' +
              ' position, rowHeight]');
          expect(function() {
            _widget = Row.create(0, 10);
          }).toThrow('Row widget: Constructor missing parameter list [index,' +
              ' position, rowHeight]');
        });

    it('should be in an initialised state if all parameters were supplied to ' +
        'the constructor', function() {
          _widget = Row.create(0, 10, 40);
          expect(_widget).toBeDefined();
        });

    it('should have a row that does not have a hidden top border after ' +
        'construction (hidden top border is used for a hidden row)',
        function() {
          var rowIndex = 0;
          var rowPos = 10;
          var rowHeight = 40;
          var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
          rowWidget.appendTo(rootNode);

          var rowNode = document.getElementsByClassName('qowt-sheet-row')[
              rowIndex];
          expect(
              rowNode.classList.contains(_kHide_Top_Border_Class)).toBe(false);
        });


    function testApplyBackgroundColor(rowWidget) {
      var backgroundColor = '#FF00FF';
      rowWidget.applyBackgroundAndBorders(backgroundColor);

      var rowNode = document.getElementsByClassName('qowt-sheet-row');
      expect(rowNode.length).toBeGreaterThan(0);
      expect(rowNode[0]).toBeDefined();
      expect(rowNode[0].style.backgroundColor).toBe('rgb(255, 0, 255)');
    }

    it('should apply a background color if one is set', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      testApplyBackgroundColor(rowWidget);
    });

    it('should set row/col precedence correctly', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      var backgroundColor = '#FF00FF';
      var borderLeft = {
        width: 32, color: '#00FF00', style: 'double'
      };
      var borders = {
        left: borderLeft
      };
      rowWidget.applyBackgroundAndBorders(backgroundColor, borders);

      var rowNode = rowWidget.getRowNode();
      expect(rowNode).toBeDefined();
      expect(rowNode.className).toMatch(/.*qowt-sheet-formatted-row.*/);
    });

    it('should store formatting for the row', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      var formatting = {'b': 1, 'bg': '#FFFF00', 'fi': 1, 'fs': 8};
      rowWidget.setFormatting(formatting);

      expect(rowWidget.getFormatting()).toBe(formatting);
    });

    it('should be able to get the prepped height of the row', function() {
      var rowIndex = 45;
      var rowPos = 15;
      var rowHeight = 30;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);

      // before any prep is done, the prepped height should equal the actual
      // height
      expect(rowWidget.getPreppedHeight()).toBe(rowHeight);

      var preppedHeight = 147;
      // after the row is prepped, the prepped height should be what was
      // specified
      rowWidget.prepLayoutHeight(preppedHeight);
      expect(rowWidget.getPreppedHeight()).toBe(preppedHeight);
    });

    it('should be able to set the pre-hidden height of the row', function() {
      var rowIndex = 45;
      var rowPos = 15;
      var rowHeight = 49;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      // before any setting is done, the pre-hidden height should equal the
      // actual height
      expect(rowWidget.getPreHiddenHeight()).toBe(rowHeight);

      var preHiddenHeight = 88;
      // after the row has its pre-hidden height set, it should be what was
      // specified
      rowWidget.setPreHiddenHeight(preHiddenHeight);
      expect(rowWidget.getPreHiddenHeight()).toBe(preHiddenHeight);
    });

    it('should have a hidden top border if the row is hidden', function() {
      var rowIndex = 0;
      var rowPos = 30;
      var rowHeight = 0; // zero height means a hidden row
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      var rowNode = document.getElementsByClassName('qowt-sheet-row')[rowIndex];
      expect(rowNode.classList.contains(_kHide_Top_Border_Class)).toBe(true);
    });

    it('should make row as hidden if rowsHiddenByDefault is true', function() {
      var rowIndex = 0;
      var rowPos = 30;
      var rowHeight = SheetModel._defaultRowHeightInPx;
      SheetModel.rowsHiddenByDefault = true;

      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      rowWidget.prepLayoutHeight();
      expect(rowWidget.getPreppedHeight()).toBe(0);

      rowWidget.layout(rowIndex);
      var rowNode = document.getElementsByClassName('qowt-sheet-row')[rowIndex];
      expect(rowNode.classList.contains(_kHide_Top_Border_Class)).toBe(true);
    });

    it('should not have a hidden top border if the row is not hidden',
       function() {
         var rowIndex = 0;
         var rowPos = 30;
         var rowHeight = 83; // a non-hidden row
         var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
         rowWidget.appendTo(rootNode);

         var rowNode = document.getElementsByClassName('qowt-sheet-row')[
             rowIndex];
         expect(
             rowNode.classList.contains(_kHide_Top_Border_Class)).toBe(false);
       });

    function verifyNoBackground() {
      var rowNode = document.getElementsByClassName('qowt-sheet-row');
      expect(rowNode.length).toBeGreaterThan(0);
      expect(rowNode[0]).toBeDefined();

      expect(rowNode[0].style.border).toBe('');
    }

    it('should RESET background formatting when it is set', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      testApplyBackgroundColor(rowWidget);

      rowWidget.resetFormatting();

      verifyNoBackground(rowWidget);
    });

    it('should RESET general formatting when it is set', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      rowWidget.setFormatting('blah');
      expect(rowWidget.getFormatting()).toMatch('blah');

      rowWidget.resetFormatting();

      expect(rowWidget.getFormatting()).toBe(undefined);
    });

    it('should RESET the node class when it is set', function() {

      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      var rowNode = document.getElementsByClassName('qowt-sheet-row');
      expect(rowNode.length).toBeGreaterThan(0);
      expect(rowNode[0]).toBeDefined();
      expect(rowNode[0].className).toBe('qowt-sheet-row');

      testApplyBackgroundColor(rowWidget);

      rowNode = rowWidget.getRowNode();
      expect(rowNode).toBeDefined();
      expect(rowNode.className).toMatch(/.*qowt-sheet-formatted-row.*/);

      rowWidget.resetFormatting();

      rowNode = document.getElementsByClassName('qowt-sheet-row');
      expect(rowNode.length).toBeGreaterThan(0);
      expect(rowNode[0]).toBeDefined();
      expect(rowNode[0].className).toBe('qowt-sheet-row');
    });

    it('should have a cloneTo() method which clones the specified row widget',
       function() {
         var numChildNodes = rootNode.childNodes.length;
         expect(numChildNodes).toBe(0);

         var rowIndex = 0;
         var rowPos = 10;
         var rowHeight = 40;
         var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
         rowWidget.appendTo(rootNode);
         numChildNodes = rootNode.childNodes.length;
         expect(numChildNodes).toBeGreaterThan(0);

         rowWidget.cloneTo(rootNode);
         var numChildNodesAfterCloning = rootNode.childNodes.length;
         expect(numChildNodesAfterCloning).toEqual(numChildNodes * 2);
       });

    it('should have detach the specified widget when requested', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      var cell = Object.create(SheetCell).init(0, 0, {cellText: 'Sample text'});
      rowWidget.attachWidget(cell);

      expect(rowWidget.getCell(0)).toBe(cell);

      rowWidget.detachWidget(cell);
      expect(rowWidget.getCell(0)).toBeUndefined();
    });

    it('should have thrown if trying to detach an undefined widget',
       function() {
         var rowIndex = 0;
         var rowPos = 10;
         var rowHeight = 40;
         var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
         rowWidget.appendTo(rootNode);

         var cell = Object.create(SheetCell).init(0, 0,
             {cellText: 'Sample text'});
         rowWidget.attachWidget(cell);

         expect(rowWidget.getCell(0)).toBe(cell);

         expect(function() {
           rowWidget.detachWidget(undefined);
         }).toThrow('detachWidget - missing widget parameter!');
       });

    it('should add row header node to header container', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      var headerContainerChildCount =
        RowHeaderContainer.container().childElementCount;

      rowWidget.appendTo(rootNode, true);

      expect(RowHeaderContainer.container().childElementCount).
          toBe(headerContainerChildCount + 1);
    });

    it('should not add row header node to header container', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      var headerContainerChildCount =
        RowHeaderContainer.container().childElementCount;

      rowWidget.appendTo(rootNode);

      expect(RowHeaderContainer.container().childElementCount).
          toBe(headerContainerChildCount);
    });

    it('should have hidden row widget', function() {
      var rowIndex = 0;
      var rowPos = 10;
      var rowHeight = 0;  // hidden row has zero height.
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      rowWidget.appendTo(rootNode);

      expect(rowWidget.isHidden()).toBe(true);
    });

  });
});
