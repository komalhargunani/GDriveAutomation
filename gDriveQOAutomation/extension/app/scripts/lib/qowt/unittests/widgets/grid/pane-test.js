/*
 * Test suite for Pane widget
 */
define([
  'qowtRoot/features/pack',
  'qowtRoot/widgets/grid/cell',
  'qowtRoot/widgets/grid/row',
  'qowtRoot/widgets/grid/pane',
  'qowtRoot/widgets/grid/highlightBox',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/rowHeaderContainer'
], function(
    FeaturePack,
    SheetCell,
    Row,
    Pane,
    HighlightBox,
    SheetConfig,
    ColHeaderContainer,
    RowHeaderContainer) {

  'use strict';

  describe('A pane widget', function() {
    beforeEach(function() {
      ColHeaderContainer.init();
      RowHeaderContainer.init();
    });

    afterEach(function() {
    });

    it('should create a floating editor widget only if edit is enabled',
       function() {
         var rootNode = document.createElement('div');

         FeaturePack.edit = false;
         Pane.create(rootNode);
         expect(rootNode.getElementsByClassName('qowt-floating-editor').length).
             toBe(0);

         FeaturePack.edit = true;
         Pane.create(rootNode);
         expect(rootNode.getElementsByClassName('qowt-floating-editor').length).
             toBe(1);
       });

    it('should have a injectCellRefIntoFloatingEditor() method which injects' +
        ' a cell ref into its floating editor', function() {
          var rootNode = document.createElement('div');

          FeaturePack.edit = true;

          var pane = Pane.create(rootNode);
          expect(rootNode.getElementsByClassName(
              'qowt-floating-editor').length).toBe(1);

          var floatingEditor = pane.getFloatingEditor();
          spyOn(floatingEditor, 'injectCellRef');

          var obj = {cellRef: 'G74'};
          pane.injectCellRefIntoFloatingEditor(obj);
          expect(floatingEditor.injectCellRef).toHaveBeenCalledWith(obj);
        });

    it('should have a injectCellRangeIntoFloatingEditor() method which' +
        ' injects a cell range into its floating editor', function() {
          var rootNode = document.createElement('div');

          FeaturePack.edit = true;

          var pane = Pane.create(rootNode);
          expect(rootNode.getElementsByClassName(
              'qowt-floating-editor').length).toBe(1);

          var floatingEditor = pane.getFloatingEditor();
          spyOn(floatingEditor, 'injectCellRange');

          var obj = {cellRange: {topLeft: 'A14', bottomRight: 'C62'}};
          pane.injectCellRangeIntoFloatingEditor(obj);
          expect(floatingEditor.injectCellRange).toHaveBeenCalledWith(obj);
        });

    it('should have a highlightCells() method which highlights only the' +
        ' specified cells', function() {
          var rootNode = document.createElement('div');
          var pane = Pane.create(rootNode, true);
          expect(rootNode.getElementsByClassName(
              'qowt-highlight-box').length).toBe(0);

          spyOn(pane, 'unhighlightCells').andCallThrough();
          spyOn(HighlightBox, 'create').andCallThrough();

          var frozenScrollOffsetX = 0;
          var frozenScrollOffsetY = 0;
          var cells = [
            {
              // E7
              rowIdx: 6,
              colIdx: 4
            },
            {
              // AB59
              rowIdx: 58,
              colIdx: 27
            },
            {
              // G4
              rowIdx: 3,
              colIdx: 6
            }
          ];

          pane.highlightCells(cells, frozenScrollOffsetX, frozenScrollOffsetY);

          expect(pane.unhighlightCells.callCount).toEqual(1);
          expect(HighlightBox.create.callCount).toEqual(3);
          expect(rootNode.getElementsByClassName(
              'qowt-highlight-box').length).toBe(3);

          pane.unhighlightCells.reset();
          HighlightBox.create.reset();
          cells = undefined;

          cells = [
            {
              // D8
              rowIdx: 7,
              colIdx: 3
            }
          ];

          pane.highlightCells(cells, frozenScrollOffsetX, frozenScrollOffsetY);

          expect(pane.unhighlightCells.callCount).toEqual(1);
          expect(HighlightBox.create.callCount).toEqual(1);
          expect(rootNode.getElementsByClassName(
              'qowt-highlight-box').length).toBe(1);
        });

    it('should highlight the cells with the correct colors', function() {
      var rootNode = document.createElement('div');
      var pane = Pane.create(rootNode, true);

      spyOn(HighlightBox, 'create').andCallThrough();

      var frozenScrollOffsetX = 0;
      var frozenScrollOffsetY = 0;
      var cells = [
        {
          // D14
          rowIdx: 13,
          colIdx: 3
        },
        {
          // X173
          rowIdx: 172,
          colIdx: 23
        },
        {
          // F1
          rowIdx: 0,
          colIdx: 5
        },
        {
          // Z89
          rowIdx: 88,
          colIdx: 25
        },
        {
          // P13
          rowIdx: 12,
          colIdx: 15
        },
        {
          // A1
          rowIdx: 0,
          colIdx: 0
        },
        {
          // AA50
          rowIdx: 49,
          colIdx: 26
        },
        {
          // C1
          rowIdx: 0,
          colIdx: 2
        },
        {
          // Q121
          rowIdx: 120,
          colIdx: 16
        },
        {
          // B016
          rowIdx: 15,
          colIdx: 1
        },
        {
          // f59
          rowIdx: 58,
          colIdx: 5
        }
      ];

      pane.highlightCells(cells, frozenScrollOffsetX, frozenScrollOffsetY);

      expect(HighlightBox.create.callCount).toEqual(11);

      var idx = 0;
      var color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 1;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 2;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 3;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 4;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 5;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 6;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 7;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 8;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 9;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      idx = 10;
      color = SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          idx % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length];
      expect(HighlightBox.create.calls[idx].args[1]).toEqual(color);
      // checked that for the 11th cell we have looped back to using the
      // first of the 10 specified colors
      expect(color).toEqual(SheetConfig.FORMULA_HIGHLIGHT_COLORS[
          0 % SheetConfig.FORMULA_HIGHLIGHT_COLORS.length]);
    });

    it('should have an unhighlightCells() method which unhighlights all ' +
        'highlighted cells', function() {
          var rootNode = document.createElement('div');
          var pane = Pane.create(rootNode, true);
          expect(rootNode.getElementsByClassName('qowt-highlight-box').length).
              toBe(0);

          var frozenScrollOffsetX = 0;
          var frozenScrollOffsetY = 0;
          var cells = [
            {
              // E7
              rowIdx: 6,
              colIdx: 4
            },
            {
              // AB59
              rowIdx: 58,
              colIdx: 27
            },
            {
              // G4
              rowIdx: 3,
              colIdx: 6
            }
          ];
          pane.highlightCells(cells, frozenScrollOffsetX, frozenScrollOffsetY);
          expect(rootNode.getElementsByClassName('qowt-highlight-box').length).
              toBe(3);

          pane.unhighlightCells();
          expect(rootNode.getElementsByClassName('qowt-highlight-box').length).
              toBe(0);
        });

    it('should have a floatingEditorHasFocus() method which calls the' +
        ' floating editor\'s hasFocus() method', function() {
          var rootNode = document.createElement('div');
          var pane = Pane.create(rootNode, true);

          var floatingEditor = pane.getFloatingEditor();
          spyOn(floatingEditor, 'hasFocus');

          pane.floatingEditorHasFocus();
          expect(floatingEditor.hasFocus).toHaveBeenCalledWith();
        });

    it('should have a positionSelectionBox method which positions the ' +
        'selectionBox on cell and should add qowt-hyperlink-dialog as ' +
        'its child and dialog\'s initial state should be hidden', function() {
      var rootNode = document.createElement('div');
      var pane = Pane.create(rootNode, true);
      var frozenScrollOffsetX = 0;
      var frozenScrollOffsetY = 0;
      var selectionObj = {
        'anchor': {'rowIdx': 2, 'colIdx': 3},
        'topLeft': {'rowIdx': 2, 'colIdx': 3},
        'bottomRight': {'rowIdx': 2, 'colIdx': 3}
      };
      var box = pane.getSelectionBox();
      box.appendTo(rootNode);
      spyOn(box, 'positionAnchorNode').andCallThrough();
      spyOn(pane, 'getCorrectCellForHyperlink').andCallThrough();
      spyOn(pane, 'showHyperlinkForCell').andCallThrough();
      spyOn(box, 'hideHyperlinkDialog').andCallThrough();
      pane.positionSelectionBox(selectionObj, frozenScrollOffsetX,
          frozenScrollOffsetY);
      expect(box.positionAnchorNode).toHaveBeenCalled();
      expect(pane.getCorrectCellForHyperlink).toHaveBeenCalled();
      expect(pane.showHyperlinkForCell).not.toHaveBeenCalled();
      expect(box.hideHyperlinkDialog).toHaveBeenCalled();
      var hyperlinkDialog = rootNode.querySelector('qowt-hyperlink-dialog');
      var boxNode =
          rootNode.getElementById('qowt-selection-anchor-node-normal');
      expect(boxNode.childNodes[0]).toBe(hyperlinkDialog);
      expect(hyperlinkDialog.isShowing()).toBeFalsy();
    });

    it('should have a positionSelectionBox method which positions the ' +
        'selectionBox on cell and should add qowt-hyperlink-dialog ' +
        'as its child and dialog\'s  state should be visible', function() {
      var rootNode = document.createElement('div');
      var pane = Pane.create(rootNode, true);
      var config = {
        cellText: 'text',
        hyperlink: true,
        hyperlinkType: 'External',
        hyperlinkTarget: 'http://www.google.com'
      };

      var rowIndex = 2;
      var rowPos = 10;
      var rowHeight = 40;
      var rowWidget = Row.create(rowIndex, rowPos, rowHeight);
      pane.attachRowWidget(rowWidget);
      var cellWidget = Object.create(SheetCell).init(3, 2, config);
      rowWidget.attachWidget(cellWidget);

      expect(rowWidget.getCell(3)).toBe(cellWidget);

      var frozenScrollOffsetX = 0;
      var frozenScrollOffsetY = 0;
      var selectionObj = {
        'anchor': {'rowIdx': 2, 'colIdx': 3},
        'topLeft': {'rowIdx': 2, 'colIdx': 3},
        'bottomRight': {'rowIdx': 2, 'colIdx': 3}
      };
      var box = pane.getSelectionBox();
      box.appendTo(rootNode);
      spyOn(box, 'positionAnchorNode').andCallThrough();
      spyOn(pane, 'getCorrectCellForHyperlink').andCallThrough();
      spyOn(pane, 'showHyperlinkForCell').andCallThrough();
      spyOn(box, 'hideHyperlinkDialog').andCallThrough();

      expect(cellWidget.getHyperlinkType()).toBe('External');
      pane.positionSelectionBox(selectionObj, frozenScrollOffsetX,
          frozenScrollOffsetY);
      expect(box.positionAnchorNode).toHaveBeenCalled();
      expect(pane.getCorrectCellForHyperlink).toHaveBeenCalledWith(2, 3);
      expect(pane.showHyperlinkForCell).toHaveBeenCalled();
      expect(box.hideHyperlinkDialog).not.toHaveBeenCalled();
      var hyperlinkDialog = rootNode.querySelector('qowt-hyperlink-dialog');
      var boxNode =
          rootNode.getElementById('qowt-selection-anchor-node-normal');
      expect(boxNode.childNodes[0]).toBe(hyperlinkDialog);
      expect(hyperlinkDialog.isShowing()).toBeTruthy();
    });

  });
});
