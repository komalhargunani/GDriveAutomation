define([
  'qowtRoot/widgets/grid/cell',
  'qowtRoot/widgets/grid/row'
], function(
    SheetCell,
    Row) {

  'use strict';

  describe('sheet cell widget', function() {

    var rootNode, sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      rootNode = document.createElement('div');
      document.body.appendChild(rootNode);
      sandbox.spy(SheetCell, 'cacheCellContentWidth');
      sandbox.spy(SheetCell, 'burstToLeftAndRight_');
    });


    afterEach(function() {
      sandbox.restore();
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should apply horizontal centre alignment', function() {
      var cellWidget = Object.create(SheetCell).init(3, 3, {
        cellText: 'This text is centre aligned',
        horizontalAlign: 'c'
      });
      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
        'qowt-sheet-cell-content');
      assert(contentNode.length > 0);
      assert.isDefined(contentNode[0]);
      assert.include(contentNode[0].className,
        'qowt-horizontal-align-center');
      assert.notInclude(contentNode[0].offsetParent.className,
        'qowt-horizontal-align-center');
      assert.isTrue(cellWidget.hasHAlignCenter());
    });


    it('should check cell with no centre alignment applied', function() {
      var cellWidget = Object.create(SheetCell).init(4, 4, {
        cellText: 'This text is normal aligned'
      });
      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
        'qowt-sheet-cell-content');
      assert.isTrue(SheetCell.cacheCellContentWidth.notCalled);
      assert(contentNode.length > 0);
      assert.isDefined(contentNode[0]);
      assert.notInclude(contentNode[0].className,
        'qowt-horizontal-align-center');
      assert.notInclude(contentNode[0].offsetParent.className,
        'qowt-horizontal-align-center');
      assert.isFalse(cellWidget.hasHAlignCenter());
    });


    it('should not call cacheCellContentWidth() for horizontal left alignment',
      function() {
      var cellWidget = Object.create(SheetCell).init(5, 5, {
        cellText: 'This text is left aligned'
      });
      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
        'qowt-sheet-cell-content');
      assert.isTrue(SheetCell.cacheCellContentWidth.notCalled);
      assert(contentNode.length > 0);
      assert.isDefined(contentNode[0]);
      assert.include(contentNode[0].className, 'qowt-horizontal-align-left');
      assert.isTrue(cellWidget.hasHAlignLeft());
    });


    it('should not call burstToLeftAndRight_ for non bursting centre ' +
      'aligned cell', function() {
      var cellWidget = Object.create(SheetCell).init(3, 3, {
        cellText: 'Text',
        horizontalAlign: 'c'
      });
      cellWidget.appendTo(rootNode);
      var contentNode = document.getElementsByClassName(
        'qowt-sheet-cell-content');
      assert(contentNode.length > 0);
      assert.isDefined(contentNode[0]);
      assert.include(contentNode[0].className,
        'qowt-horizontal-align-center');
      assert.notInclude(contentNode[0].offsetParent.className,
        'qowt-horizontal-align-center');
      assert.isTrue(cellWidget.hasHAlignCenter());
      assert.isTrue(SheetCell.burstToLeftAndRight_.notCalled);
    });

    it('should apply borders if borders are set', function() {
      var row = Row.create(3, 3, 10);
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
      var cellWidget = Object.create(SheetCell).init(0, 3, {
        cellText: 'text',
        borders: borders
      });
      row.attachWidget(cellWidget);
      row.prepLayoutInfo();
      row.layout();

      cellWidget.appendTo(rootNode);
      var formatNode = document.getElementsByClassName(
        'qowt-sheet-cell-format');

      assert(formatNode.length > 0);
      assert.isDefined(formatNode[0]);

      assert.equal(formatNode[0].style['border-top-style'], 'dashed');
      assert.equal(formatNode[0].style['border-top-width'], '1pt');
      assert.equal(formatNode[0].style['border-top-color'], 'rgb(0, 0, 0)');

      assert.equal(formatNode[0].style['border-right-style'], 'solid');
      assert.equal(formatNode[0].style['border-right-width'], '2pt');
      assert.equal(formatNode[0].style['border-right-color'],
        'rgb(255, 255, 255)');

      assert.equal(formatNode[0].style['border-bottom-style'], 'dotted');
      assert.equal(formatNode[0].style['border-bottom-width'], '3pt');
      assert.equal(formatNode[0].style['border-bottom-color'],
        'rgb(0, 0, 255)');

      assert.equal(formatNode[0].style['border-left-style'], 'double');
      assert.equal(formatNode[0].style['border-left-width'], '4pt');
      assert.equal(formatNode[0].style['border-left-color'], 'rgb(0, 255, 0)');
    });
  });
});
