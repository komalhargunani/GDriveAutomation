/**
 * Chart Sheet Manager unit test suite
 */

define([
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/chartSheetManager',
  'qowtRoot/widgets/grid/formulaBar',
  'qowtRoot/features/utils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/models/sheet'
], function(
    Workbook,
    PaneManager,
    ChartSheetManager,
    FormulaBar,
    Features,
    PubSub,
    SheetSelectionManager,
    SheetModel) {

  'use strict';

  describe('Workbook layout control', function() {

    var rootNode;

    beforeEach(function() {
      Workbook.init();
      SheetSelectionManager.init();
      rootNode = document.createElement('div');
      Workbook.appendTo(rootNode);
    });

    afterEach(function() {
      Workbook.reset();
      rootNode = undefined;
    });

    it('should have a showChartSheet() method that configures the ' +
        'workbook to show the chart sheet', function() {
          var zoomAreaContainer = rootNode.getElementsByClassName(
              'qowt-sheet-zoom-area')[0];
          var chartSheetContainer = rootNode.getElementsByClassName(
              'qowt-chart-sheet')[0];

          spyOn(ChartSheetManager, 'activate');
          spyOn(FormulaBar, 'disableEdits');

          Workbook.showChartSheet();

          // check that the Chart Sheet Manager has been activated
          expect(ChartSheetManager.activate).toHaveBeenCalled();

          // check that all sibling elements of the chart sheet container are
          // set to 'display:none'
          var zoomAreaChildren = zoomAreaContainer.childNodes;
          var count = zoomAreaChildren.length;
          for (var i = 0; i < count; i++) {
            if (!zoomAreaChildren[i].classList.contains('qowt-display-none')) {
              expect(zoomAreaChildren[i]).toEqual(chartSheetContainer);
            }
          }

          // check that the formula bar has been told to disable edits on it
          if (Features.isEnabled('edit')) {
            expect(FormulaBar.disableEdits).toHaveBeenCalled();
          }
        });

    it('should have a hideChartSheet() method that configures the ' +
        'workbook to hide the chart sheet', function() {
          var zoomAreaContainer = rootNode.getElementsByClassName(
              'qowt-sheet-zoom-area')[0];
          var chartSheetContainer = rootNode.getElementsByClassName(
              'qowt-chart-sheet')[0];

          spyOn(ChartSheetManager, 'deactivate');
          spyOn(FormulaBar, 'enableEdits');

          Workbook.hideChartSheet();

          // check that the Chart Sheet Manager has been deactivated
          expect(ChartSheetManager.deactivate).toHaveBeenCalled();

          // check that all sibling elements of the chart sheet container are
          // not set to 'display:none'
          var zoomAreaChildren = zoomAreaContainer.childNodes;
          var count = zoomAreaChildren.length;
          for (var i = 0; i < count; i++) {
            if (zoomAreaChildren[i].classList.contains('qowt-display-none')) {
              expect(zoomAreaChildren[i]).toEqual(chartSheetContainer);
            }
          }

          // check that the formula bar has been told to enable edits on it
          if (Features.isEnabled('edit')) {
            expect(FormulaBar.enableEdits).toHaveBeenCalled();
          }
        });

    it('should process the old and new cell selection when the selection ' +
        'type changes from "sheetCell" to another "sheetCell"', function() {
          var oldSelectionRowIdx = 3;
          var oldSelectionColIdx = 3;
          var newSelectionRowIdx = 8;
          var newSelectionColIdx = 8;

          var oldSelection = {
            anchor: {
              rowIdx: oldSelectionRowIdx,
              colIdx: oldSelectionColIdx
            },
            topLeft: {
              rowIdx: oldSelectionRowIdx,
              colIdx: oldSelectionColIdx
            },
            bottomRight: {
              rowIdx: oldSelectionRowIdx,
              colIdx: oldSelectionColIdx
            },
            contentType: 'sheetCell'
          };

          var newSelection = {
            anchor: {
              rowIdx: newSelectionRowIdx,
              colIdx: newSelectionRowIdx
            },
            topLeft: {
              rowIdx: newSelectionRowIdx,
              colIdx: newSelectionRowIdx
            },
            bottomRight: {
              rowIdx: newSelectionRowIdx,
              colIdx: newSelectionRowIdx
            },
            contentType: 'sheetCell'
          };

          var oldSelectionRowWidget = Workbook.getRow(oldSelectionRowIdx);
          var oldSelectionColWidget = Workbook.getColumn(oldSelectionColIdx);
          var newSelectionRowWidget = Workbook.getRow(newSelectionRowIdx);
          var newSelectionColWidget = Workbook.getColumn(newSelectionColIdx);
          spyOn(oldSelectionRowWidget, 'highlightHeader');
          spyOn(oldSelectionColWidget, 'highlightHeader');
          spyOn(newSelectionRowWidget, 'highlightHeader');
          spyOn(newSelectionColWidget, 'highlightHeader');
          spyOn(PaneManager, 'positionSelectionBox');
          spyOn(FormulaBar, 'setDisplayText');
          spyOn(PaneManager, 'scrollCellSelectionIntoView');

          var obj = {oldSelection: oldSelection, newSelection: newSelection};
          PubSub.publish('qowt:selectionChanged', obj);

          // check that the old cell selection has been processed
          expect(oldSelectionRowWidget.highlightHeader).
              toHaveBeenCalledWith(false);
          expect(oldSelectionColWidget.highlightHeader).
              toHaveBeenCalledWith(false);
          expect(FormulaBar.setDisplayText).toHaveBeenCalledWith();

          // check that the new cell selection has been processed
          expect(newSelectionRowWidget.highlightHeader).
              toHaveBeenCalledWith(true);
          expect(newSelectionColWidget.highlightHeader).
              toHaveBeenCalledWith(true);
          expect(PaneManager.positionSelectionBox).toHaveBeenCalled();
          expect(FormulaBar.setDisplayText).toHaveBeenCalled();
          expect(PaneManager.scrollCellSelectionIntoView).toHaveBeenCalled();
        });

    it('should do nothing when the selection type changes from "sheetText" ' +
        'to "sheetCell"', function() {
          var oldSelection = {
            contentType: 'sheetText'
          };

          var newSelectionRowIdx = 3;
          var newSelectionColIdx = 3;

          var newSelection = {
            anchor: {
              rowIdx: newSelectionRowIdx,
              colIdx: newSelectionColIdx
            },
            topLeft: {
              rowIdx: newSelectionRowIdx,
              colIdx: newSelectionColIdx
            },
            bottomRight: {
              rowIdx: newSelectionRowIdx,
              colIdx: newSelectionColIdx
            },
            contentType: 'sheetCell'
          };

          var newSelectionRowWidget = Workbook.getRow(newSelectionRowIdx);
          var newSelectionColWidget = Workbook.getColumn(newSelectionColIdx);
          spyOn(newSelectionRowWidget, 'highlightHeader');
          spyOn(newSelectionColWidget, 'highlightHeader');
          spyOn(PaneManager, 'positionSelectionBox');
          spyOn(FormulaBar, 'setDisplayText');
          spyOn(PaneManager, 'scrollCellSelectionIntoView');

          var obj = {oldSelection: oldSelection, newSelection: newSelection};
          PubSub.publish('qowt:selectionChanged', obj);

          // check that the new selection has NOT been processed
          expect(newSelectionRowWidget.highlightHeader).not.toHaveBeenCalled();
          expect(newSelectionColWidget.highlightHeader).not.toHaveBeenCalled();
          expect(PaneManager.positionSelectionBox).not.toHaveBeenCalled();
          expect(FormulaBar.setDisplayText).not.toHaveBeenCalled();
          expect(PaneManager.scrollCellSelectionIntoView).not.
              toHaveBeenCalled();
        });

    it('should do nothing when the selection type changes from "sheetCell" to' +
        ' "sheetText"', function() {
          var newSelection = {
            contentType: 'sheetText'
          };

          var oldSelectionRowIdx = 3;
          var oldSelectionColIdx = 3;

          var oldSelection = {
            anchor: {
              rowIdx: oldSelectionRowIdx,
              colIdx: oldSelectionColIdx
            },
            topLeft: {
              rowIdx: oldSelectionRowIdx,
              colIdx: oldSelectionColIdx
            },
            bottomRight: {
              rowIdx: oldSelectionRowIdx,
              colIdx: oldSelectionColIdx
            },
            contentType: 'sheetCell'
          };

          var oldSelectionRowWidget = Workbook.getRow(oldSelectionRowIdx);
          var oldSelectionColWidget = Workbook.getColumn(oldSelectionColIdx);
          spyOn(oldSelectionRowWidget, 'highlightHeader');
          spyOn(oldSelectionColWidget, 'highlightHeader');
          spyOn(FormulaBar, 'setDisplayText');

          var obj = {oldSelection: oldSelection, newSelection: newSelection};
          PubSub.publish('qowt:selectionChanged', obj);

          // check that the old selection has NOT been processed
          expect(oldSelectionRowWidget.highlightHeader).not.toHaveBeenCalled();
          expect(oldSelectionColWidget.highlightHeader).not.toHaveBeenCalled();
          expect(FormulaBar.setDisplayText).not.toHaveBeenCalled();
        });

    it('should have a method initiateCellEdit() which initiates a cell edit',
       function() {
         var selectionObj = {
           anchor: {rowIdx: 4, colIdx: 4},
           topLeft: {rowIdx: 4, colIdx: 4},
           bottomRight: {rowIdx: 4, colIdx: 4},
           contentType: 'sheetCell'
         };
         SheetModel.activeSheetIndex = 2;
         PubSub.publish('qowt:sheet:requestFocus', selectionObj);

         spyOn(PaneManager, 'scrollCellSelectionIntoView');
         spyOn(PaneManager, 'displayFloatingEditor');

         var isInlineEdit = true;
         var seed = 'h';
         Workbook.initiateCellEdit(isInlineEdit, seed);

         expect(PaneManager.scrollCellSelectionIntoView).toHaveBeenCalledWith(
             selectionObj);
         expect(PaneManager.displayFloatingEditor).toHaveBeenCalledWith(
             isInlineEdit, selectionObj, seed);
       });

    it('should have a method completeCellEdit() which completes a cell edit',
       function() {
         var selectionObj = {
           anchor: {rowIdx: 4, colIdx: 8},
           topLeft: {rowIdx: 6, colIdx: 4},
           bottomRight: {rowIdx: 4, colIdx: 4},
           contentType: 'sheetCell'
         };
         SheetModel.activeSheetIndex = 3;
         PubSub.publish('qowt:sheet:requestFocus', selectionObj);

         spyOn(PaneManager, 'hideFloatingEditor');
         spyOn(FormulaBar, 'setDisplayText');

         SheetModel.inlineFormatEdits = {verticalAlignment: true};
         var cancelled = false;
         Workbook.completeCellEdit(cancelled);

         expect(PaneManager.hideFloatingEditor).toHaveBeenCalled();
         expect(FormulaBar.setDisplayText).not.toHaveBeenCalled();
         expect(SheetModel.inlineFormatEdits).toEqual({});

         PaneManager.hideFloatingEditor.reset();
         FormulaBar.setDisplayText.reset();

         SheetModel.inlineFormatEdits = {textColor: true};
         cancelled = true;
         Workbook.completeCellEdit(cancelled);

         expect(PaneManager.hideFloatingEditor).toHaveBeenCalled();
         expect(FormulaBar.setDisplayText).toHaveBeenCalled();
         expect(SheetModel.inlineFormatEdits).toEqual({});
       });

    it('should have a method mirrorText() which mirrors text in both text ' +
        'editors', function() {
         var selectionObj = {
           contentType: 'sheetText',
           textWidget: FormulaBar
         };
         SheetModel.activeSheetIndex = 3;
         PubSub.publish('qowt:sheet:requestFocus', selectionObj);

         spyOn(PaneManager, 'setFloatingEditorDisplayText');

         var text = 'blah';
         FormulaBar.setDisplayText(text);
         Workbook.mirrorText();

         expect(PaneManager.setFloatingEditorDisplayText).
             toHaveBeenCalledWith(text);

         selectionObj = {
           contentType: 'sheetText',
           textWidget: PaneManager.getActivePane().getFloatingEditor()
         };
         SheetModel.activeSheetIndex = 3;
         PubSub.publish('qowt:sheet:requestFocus', selectionObj);

         spyOn(FormulaBar, 'setDisplayText');

         text = 'hello';
         PaneManager.getActivePane().getFloatingEditor().setDisplayText(text);
         Workbook.mirrorText();

         expect(FormulaBar.setDisplayText).toHaveBeenCalledWith(text);
       });

    it('should have a method injectCellRef() which injects a cell ref based' +
        ' on a mousedown event', function() {
          // inject into formula bar
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 3;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var dummyCellRef = 'B17';
          PaneManager.getCellRef = function() {
            return dummyCellRef;
          };

         SheetModel.lastAnchorCell = {rowIdx: 8, colIdx: 3};

         spyOn(FormulaBar, 'injectCellRef');
         spyOn(PaneManager, 'scrollFormulaTargetIntoView');

          var evt = document.createEvent('Event');
          evt.initEvent('mousedown', true, false);

         Workbook.injectCellRef(evt);
         expect(FormulaBar.injectCellRef).toHaveBeenCalledWith(
             {cellRef: dummyCellRef});
         expect(PaneManager.scrollFormulaTargetIntoView).toHaveBeenCalledWith(
             {cellRef: dummyCellRef});
         PaneManager.scrollFormulaTargetIntoView.reset();

          // inject into floating editor
          var floatingEditor = PaneManager.getActivePane().getFloatingEditor();
          selectionObj = {
            contentType: 'sheetText',
            textWidget: floatingEditor
          };
          SheetModel.activeSheetIndex = 3;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          dummyCellRef = 'P190';
          PaneManager.getCellRef = function() {
            return dummyCellRef;
          };

          spyOn(PaneManager, 'injectCellRefIntoFloatingEditor');

         Workbook.injectCellRef(evt);
         expect(PaneManager.injectCellRefIntoFloatingEditor).
             toHaveBeenCalledWith({cellRef: dummyCellRef});
         expect(PaneManager.scrollFormulaTargetIntoView).
             toHaveBeenCalledWith({cellRef: dummyCellRef});
        });

    it('should have a method injectCellRef() which injects a cell ref based' +
        ' on a keydown event', function() {
          // a keydown event should not inject anything into the formula bar
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 3;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var dummyCellRef = 'G53';
          PaneManager.getCellRef = function() {
            return dummyCellRef;
          };

          spyOn(FormulaBar, 'injectCellRef');

          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);

          Workbook.injectCellRef(evt);
          expect(FormulaBar.injectCellRef).not.toHaveBeenCalled();

          // a keydown event should inject into the floating editor
          var floatingEditor = PaneManager.getActivePane().getFloatingEditor();
          selectionObj = {
            contentType: 'sheetText',
            textWidget: floatingEditor
          };
          SheetModel.activeSheetIndex = 3;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          dummyCellRef = 'T18';
          PaneManager.getCellRef = function() {
            return dummyCellRef;
          };

         spyOn(PaneManager, 'injectCellRefIntoFloatingEditor');
         spyOn(PaneManager, 'scrollFormulaTargetIntoView');

         Workbook.injectCellRef(evt);
         expect(PaneManager.injectCellRefIntoFloatingEditor).
             toHaveBeenCalledWith({cellRef: dummyCellRef, byKey: true});
         expect(PaneManager.scrollFormulaTargetIntoView).
             toHaveBeenCalledWith({cellRef: dummyCellRef, byKey: true});
        });

    it('should have a method injectCellRange() which injects a cell range ' +
        'based on a mousemove event', function() {
          // inject into formula bar
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 3;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var dummyCellRange = {topLeft: 'B17', bottomRight: 'D28'};
          PaneManager.getCellRange = function() {
            return dummyCellRange;
          };

         SheetModel.lastAnchorCell = {rowIdx: 4, colIdx: 5};

         spyOn(FormulaBar, 'injectCellRange');
         spyOn(PaneManager, 'scrollFormulaTargetIntoView');

          var evt = document.createEvent('Event');
          evt.initEvent('mousemove', true, false);

         Workbook.injectCellRange(evt);
         expect(FormulaBar.injectCellRange).
             toHaveBeenCalledWith({cellRange: dummyCellRange});
         expect(PaneManager.scrollFormulaTargetIntoView).
             toHaveBeenCalledWith({cellRange: dummyCellRange});
         PaneManager.scrollFormulaTargetIntoView.reset();

          // inject into floating editor
          var floatingEditor = PaneManager.getActivePane().getFloatingEditor();
          selectionObj = {
            contentType: 'sheetText',
            textWidget: floatingEditor
          };
          SheetModel.activeSheetIndex = 3;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          dummyCellRange = {topLeft: 'A15', bottomRight: 'C18'};
          PaneManager.getCellRange = function() {
            return dummyCellRange;
          };

          spyOn(PaneManager, 'injectCellRangeIntoFloatingEditor');

         Workbook.injectCellRange(evt);
         expect(PaneManager.injectCellRangeIntoFloatingEditor).
             toHaveBeenCalledWith({cellRange: dummyCellRange});
         expect(PaneManager.scrollFormulaTargetIntoView).
             toHaveBeenCalledWith({cellRange: dummyCellRange});
        });

    it('should have a method injectCellRange() which injects a cell range' +
        ' based on a shift-keydown event', function() {
          // a shift-keydown event should not inject anything into the
          // formula bar
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 3;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var dummyCellRange = {topLeft: 'B3', bottomRight: 'E17'};
          PaneManager.getCellRange = function() {
            return dummyCellRange;
          };

          spyOn(FormulaBar, 'injectCellRange');

          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = true;

          Workbook.injectCellRange(evt);
          expect(FormulaBar.injectCellRange).not.toHaveBeenCalled();

          // a shift-keydown event should inject into the floating editor
          var floatingEditor = PaneManager.getActivePane().getFloatingEditor();
          selectionObj = {
            contentType: 'sheetText',
            textWidget: floatingEditor
          };
          SheetModel.activeSheetIndex = 3;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          dummyCellRange = {topLeft: 'F7', bottomRight: 'K89'};
          PaneManager.getCellRange = function() {
            return dummyCellRange;
          };

         spyOn(PaneManager, 'injectCellRangeIntoFloatingEditor');
         spyOn(PaneManager, 'scrollFormulaTargetIntoView');

         Workbook.injectCellRange(evt);
         expect(PaneManager.injectCellRangeIntoFloatingEditor).
             toHaveBeenCalledWith({cellRange: dummyCellRange, byKey: true});
         expect(PaneManager.scrollFormulaTargetIntoView).
             toHaveBeenCalledWith({cellRange: dummyCellRange, byKey: true});
        });
  });
});
