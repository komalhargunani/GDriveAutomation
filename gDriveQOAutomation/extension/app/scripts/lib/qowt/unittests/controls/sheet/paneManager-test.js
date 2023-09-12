// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Pane Manager unit test suite.
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/rowHeaderContainer',
  'qowtRoot/models/sheet'
], function(
    PaneManager,
    ColHeaderContainer,
    RowHeaderContainer,
    SheetModel) {

  'use strict';

  describe('Pane Manager layout control', function() {

    var _rootNode = document.createElement('div');

    beforeEach(function() {
      ColHeaderContainer.init();
      RowHeaderContainer.init();

      PaneManager.init(_rootNode);
      SheetModel.RowHeights = [10, 20, 30, 40, 50, 60];
      SheetModel.RowFormatting = [{}, {}, {}, {}, {}, {}];
      SheetModel.ColWidths = [10, 20, 30, 40, 50, 60];
      SheetModel.ColFormatting = [{}, {}, {}, {}, {}, {}];
    });

    afterEach(function() {
      PaneManager.getMainPane().clean();
      PaneManager.reset();
      SheetModel.RowHeights = undefined;
      SheetModel.RowFormatting = undefined;
      SheetModel.RowPos = undefined;
      SheetModel.ColWidths = undefined;
      SheetModel.ColFormatting = undefined;
      SheetModel.ColPos = undefined;
      PaneManager.setFrozenRowIndex();
      PaneManager.setFrozenColumnIndex();
    });

    it('should always create 4 panes', function() {
      expect(PaneManager.getMainPane()).toBeDefined();
      expect(PaneManager.getTopLeftPane()).toBeDefined();
      expect(PaneManager.getTopRightPane()).toBeDefined();
      expect(PaneManager.getBottomLeftPane()).toBeDefined();
    });

    it('should call the populateFrozenPanes method when freezing', function() {
      spyOn(PaneManager, 'populateFrozenPanes');
      PaneManager.freezePanes();
      expect(PaneManager.populateFrozenPanes).toHaveBeenCalled();
    });

    it('should not remove the panes when unfreezing', function() {
      PaneManager.freezePanes();
      PaneManager.unfreezePanes();
      expect(PaneManager.getMainPane()).toBeDefined();
      expect(PaneManager.getTopLeftPane()).toBeDefined();
      expect(PaneManager.getTopRightPane()).toBeDefined();
      expect(PaneManager.getBottomLeftPane()).toBeDefined();
    });

    it('should populate only the bottom right pane when the sheet is not' +
        ' frozen', function() {
          PaneManager.freezePanes();
          expect(PaneManager.getMainPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getMainPane().getRows()).not.toEqual([]);
          expect(PaneManager.getTopLeftPane().getColumns()).toEqual([]);
          expect(PaneManager.getTopLeftPane().getRows()).toEqual([]);
          expect(PaneManager.getTopRightPane().getColumns()).toEqual([]);
          expect(PaneManager.getTopRightPane().getRows()).toEqual([]);
          expect(PaneManager.getBottomLeftPane().getColumns()).toEqual([]);
          expect(PaneManager.getBottomLeftPane().getRows()).toEqual([]);
        });

    it('should populate only the bottom right and top right panes when the' +
        ' sheet has only frozen rows', function() {
          PaneManager.setFrozenRowIndex(2);
          PaneManager.setFrozenColumnIndex(0);
          PaneManager.freezePanes();
          expect(PaneManager.getMainPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getMainPane().getRows()).not.toEqual([]);
          expect(PaneManager.getTopLeftPane().getColumns()).toEqual([]);
          expect(PaneManager.getTopLeftPane().getRows()).toEqual([]);
          expect(PaneManager.getTopRightPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getTopRightPane().getRows()).not.toEqual([]);
          expect(PaneManager.getBottomLeftPane().getColumns()).toEqual([]);
          expect(PaneManager.getBottomLeftPane().getRows()).toEqual([]);
        });

    it('should populate only the bottom right and bottom left panes when the' +
        ' sheet has only frozen columns', function() {
          PaneManager.setFrozenRowIndex(0);
          PaneManager.setFrozenColumnIndex(2);
          PaneManager.freezePanes();
          expect(PaneManager.getMainPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getMainPane().getRows()).not.toEqual([]);
          expect(PaneManager.getTopLeftPane().getColumns()).toEqual([]);
          expect(PaneManager.getTopLeftPane().getRows()).toEqual([]);
          expect(PaneManager.getTopRightPane().getColumns()).toEqual([]);
          expect(PaneManager.getTopRightPane().getRows()).toEqual([]);
          expect(PaneManager.getBottomLeftPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getBottomLeftPane().getRows()).not.toEqual([]);
        });

    it('should populate all the 4 panes when the sheet has both frozen rows' +
        ' and columns', function() {
          PaneManager.setFrozenRowIndex(1);
          PaneManager.setFrozenColumnIndex(2);
          PaneManager.freezePanes();
          expect(PaneManager.getMainPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getMainPane().getRows()).not.toEqual([]);
          expect(PaneManager.getTopLeftPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getTopLeftPane().getRows()).not.toEqual([]);
          expect(PaneManager.getTopRightPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getTopRightPane().getRows()).not.toEqual([]);
          expect(PaneManager.getBottomLeftPane().getColumns()).not.toEqual([]);
          expect(PaneManager.getBottomLeftPane().getRows()).not.toEqual([]);
        });

    it('should add all the columns to the 4 panes when freezing', function() {
      var numColumns = PaneManager.getMainPane().getColumns().length;
      PaneManager.setFrozenRowIndex(2);
      PaneManager.setFrozenColumnIndex(4);
      PaneManager.freezePanes();
      expect(PaneManager.getTopLeftPane().getColumns().length).
          toEqual(numColumns);
      expect(PaneManager.getTopRightPane().getColumns().length).
          toEqual(numColumns);
      expect(PaneManager.getBottomLeftPane().getColumns().length).
          toEqual(numColumns);
    });

    it('should add all the rows to the bottom right, bottom left and top' +
        ' right panes but only add the frozen rows to the top left panes when' +
        ' freezing', function() {
          var numRows = PaneManager.getMainPane().getRows().length;
          PaneManager.setFrozenRowIndex(3);
          PaneManager.setFrozenColumnIndex(2);
          PaneManager.freezePanes();
          expect(PaneManager.getTopRightPane().getRows().length).
              toEqual(numRows);
          expect(PaneManager.getBottomLeftPane().getRows().length).
              toEqual(numRows);
          expect(PaneManager.getTopLeftPane().getRows().length).
              toEqual(PaneManager.getFrozenRowIndex());
        });

    it('has a displayFloatingEditor() method which instructs active pane to ' +
        'display its floating editor', function() {
          spyOn(PaneManager.getTopLeftPane(), 'displayFloatingEditor');
          spyOn(PaneManager.getTopRightPane(), 'displayFloatingEditor');
          spyOn(PaneManager.getBottomLeftPane(), 'displayFloatingEditor');
          spyOn(PaneManager.getMainPane(), 'displayFloatingEditor');
          spyOn(PaneManager.getActivePane(), 'focusOnFloatingEditor');

          var selectionObj = {
            anchor: {rowIdx: 4, colIdx: 8},
            topLeft: {rowIdx: 4, colIdx: 8},
            bottomRight: {rowIdx: 12, colIdx: 32},
            contentType: 'sheetCell'
          };
          var focusOn = true;
          var seed = 'g';
          PaneManager.displayFloatingEditor(focusOn, selectionObj, seed);

          // displayFloatingEditor() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().displayFloatingEditor).
            not.toHaveBeenCalled();
          expect(PaneManager.getTopRightPane().displayFloatingEditor).
            not.toHaveBeenCalled();
          expect(PaneManager.getBottomLeftPane().displayFloatingEditor).
            not.toHaveBeenCalled();
          expect(PaneManager.getMainPane().displayFloatingEditor).
              toHaveBeenCalled();
          // focusOnFloatingEditor() should have called on the active pane
          // (since focusOn is 'true')
          expect(PaneManager.getActivePane().focusOnFloatingEditor).
              toHaveBeenCalled();
        });

    it('has a hideFloatingEditor() method which instructs each pane to hide ' +
        'its floating editor', function() {
          spyOn(PaneManager.getTopLeftPane(), 'hideFloatingEditor');
          spyOn(PaneManager.getTopRightPane(), 'hideFloatingEditor');
          spyOn(PaneManager.getBottomLeftPane(), 'hideFloatingEditor');
          spyOn(PaneManager.getMainPane(), 'hideFloatingEditor');

          PaneManager.hideFloatingEditor();

          // hideFloatingEditor() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().hideFloatingEditor).
              toHaveBeenCalled();
          expect(PaneManager.getTopRightPane().hideFloatingEditor).
              toHaveBeenCalled();
          expect(PaneManager.getBottomLeftPane().hideFloatingEditor).
              toHaveBeenCalled();
          expect(PaneManager.getMainPane().hideFloatingEditor).
              toHaveBeenCalled();
        });

    it('has a setCellBoldnessOptimistically() ' +
        'method which instructs each pane ' +
        'to set its cell boldness Optimistically', function() {
          spyOn(PaneManager.getTopLeftPane(), 'setCellBoldnessOptimistically');
          spyOn(PaneManager.getTopRightPane(), 'setCellBoldnessOptimistically');
          spyOn(PaneManager.getBottomLeftPane(),
              'setCellBoldnessOptimistically');
          spyOn(PaneManager.getMainPane(), 'setCellBoldnessOptimistically');

          var boldness = true;
          PaneManager.setCellBoldnessOptimistically(boldness);

          // setCellBoldnessOptimistically() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().setCellBoldnessOptimistically).
              toHaveBeenCalledWith(boldness);
          expect(PaneManager.getTopRightPane().setCellBoldnessOptimistically).
              toHaveBeenCalledWith(boldness);
          expect(PaneManager.getBottomLeftPane().setCellBoldnessOptimistically).
              toHaveBeenCalledWith(boldness);
          expect(PaneManager.getMainPane().setCellBoldnessOptimistically).
              toHaveBeenCalledWith(boldness);
        });

    it('has a setCellItalicsOptimistically() ' +
        'method which instructs each pane to ' +
        'set its cell italics Optimistically', function() {
          spyOn(PaneManager.getTopLeftPane(), 'setCellItalicsOptimistically');
          spyOn(PaneManager.getTopRightPane(), 'setCellItalicsOptimistically');
          spyOn(PaneManager.getBottomLeftPane(),
              'setCellItalicsOptimistically');
          spyOn(PaneManager.getMainPane(), 'setCellItalicsOptimistically');

          var italics = true;
          PaneManager.setCellItalicsOptimistically(italics);

          // setCellItalicsOptimistically() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().setCellItalicsOptimistically).
              toHaveBeenCalledWith(italics);
          expect(PaneManager.getTopRightPane().setCellItalicsOptimistically).
              toHaveBeenCalledWith(italics);
          expect(PaneManager.getBottomLeftPane().setCellItalicsOptimistically).
              toHaveBeenCalledWith(italics);
          expect(PaneManager.getMainPane().setCellItalicsOptimistically).
              toHaveBeenCalledWith(italics);
        });

    it('has a setCellUnderlineOptimistically() ' +
        'method which instructs each pane ' +
        'to set its cell underline Optimistically', function() {
          spyOn(PaneManager.getTopLeftPane(), 'setCellUnderlineOptimistically');
          spyOn(PaneManager.getTopRightPane(),
              'setCellUnderlineOptimistically');
          spyOn(PaneManager.getBottomLeftPane(),
              'setCellUnderlineOptimistically');
          spyOn(PaneManager.getMainPane(), 'setCellUnderlineOptimistically');

          var underline = true;
          PaneManager.setCellUnderlineOptimistically(underline);

          // setCellUnderlineOptimistically() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().setCellUnderlineOptimistically).
              toHaveBeenCalledWith(underline);
          expect(PaneManager.getTopRightPane().setCellUnderlineOptimistically).
              toHaveBeenCalledWith(underline);
          expect(PaneManager.getBottomLeftPane().
              setCellUnderlineOptimistically).
              toHaveBeenCalledWith(underline);
          expect(PaneManager.getMainPane().setCellUnderlineOptimistically).
              toHaveBeenCalledWith(underline);
        });

    it('has a setFloatingEditorDisplayText() method which instructs each ' +
        'pane to set its floating editor text', function() {
          spyOn(PaneManager.getTopLeftPane(), 'setFloatingEditorDisplayText');
          spyOn(PaneManager.getTopRightPane(), 'setFloatingEditorDisplayText');
          spyOn(PaneManager.getBottomLeftPane(),
              'setFloatingEditorDisplayText');
          spyOn(PaneManager.getMainPane(), 'setFloatingEditorDisplayText');

          var text = 'blah';
          PaneManager.setFloatingEditorDisplayText(text);

          // setFloatingEditorDisplayText() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().setFloatingEditorDisplayText).
              toHaveBeenCalledWith(text);
          expect(PaneManager.getTopRightPane().setFloatingEditorDisplayText).
              toHaveBeenCalledWith(text);
          expect(PaneManager.getBottomLeftPane().setFloatingEditorDisplayText).
              toHaveBeenCalledWith(text);
          expect(PaneManager.getMainPane().setFloatingEditorDisplayText).
              toHaveBeenCalledWith(text);
        });

    it('has a setCellFontFaceOptimistically() ' +
        'method which instructs each pane ' +
        'to set its cell font face Optimistically', function() {
          spyOn(PaneManager.getTopLeftPane(), 'setCellFontFaceOptimistically');
          spyOn(PaneManager.getTopRightPane(), 'setCellFontFaceOptimistically');
          spyOn(PaneManager.getBottomLeftPane(),
              'setCellFontFaceOptimistically');
          spyOn(PaneManager.getMainPane(), 'setCellFontFaceOptimistically');

          var fontFace = 'Arial';
          PaneManager.setCellFontFaceOptimistically(fontFace);

          // setFloatingEditorDisplayText() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().setCellFontFaceOptimistically).
              toHaveBeenCalledWith(fontFace);
          expect(PaneManager.getTopRightPane().setCellFontFaceOptimistically).
              toHaveBeenCalledWith(fontFace);
          expect(PaneManager.getBottomLeftPane().setCellFontFaceOptimistically).
              toHaveBeenCalledWith(fontFace);
          expect(PaneManager.getMainPane().setCellFontFaceOptimistically).
              toHaveBeenCalledWith(fontFace);
        });

    it('has a setCellFontSizeOptimistically() ' +
        'method which instructs each pane ' +
        'to set its cell font size Optimistically', function() {
          spyOn(PaneManager.getTopLeftPane(), 'setCellFontSizeOptimistically');
          spyOn(PaneManager.getTopRightPane(), 'setCellFontSizeOptimistically');
          spyOn(PaneManager.getBottomLeftPane(),
              'setCellFontSizeOptimistically');
          spyOn(PaneManager.getMainPane(), 'setCellFontSizeOptimistically');

          var fontSize = '24';
          PaneManager.setCellFontSizeOptimistically(fontSize);

          // setFloatingEditorDisplayText() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().setCellFontSizeOptimistically).
              toHaveBeenCalledWith(fontSize);
          expect(PaneManager.getTopRightPane().setCellFontSizeOptimistically).
              toHaveBeenCalledWith(fontSize);
          expect(PaneManager.getBottomLeftPane().setCellFontSizeOptimistically).
              toHaveBeenCalledWith(fontSize);
          expect(PaneManager.getMainPane().setCellFontSizeOptimistically).
              toHaveBeenCalledWith(fontSize);
        });

    it('has a setCellTextColorOptimistically() ' +
        'method which instructs each pane ' +
        'to set its cell text color Optimistically', function() {
          spyOn(PaneManager.getTopLeftPane(), 'setCellTextColorOptimistically');
          spyOn(PaneManager.getTopRightPane(),
              'setCellTextColorOptimistically');
          spyOn(PaneManager.getBottomLeftPane(),
              'setCellTextColorOptimistically');
          spyOn(PaneManager.getMainPane(), 'setCellTextColorOptimistically');

          var color = 'blue';
          PaneManager.setCellTextColorOptimistically(color);

          // setCellTextColorOptimistically() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().setCellTextColorOptimistically).
              toHaveBeenCalledWith(color);
          expect(PaneManager.getTopRightPane().setCellTextColorOptimistically).
              toHaveBeenCalledWith(color);
          expect(PaneManager.getBottomLeftPane().
              setCellTextColorOptimistically).
              toHaveBeenCalledWith(color);
          expect(PaneManager.getMainPane().setCellTextColorOptimistically).
              toHaveBeenCalledWith(color);
        });

    it('has a setCellBackgroundColorOptimistically() ' +
        'method which instructs each ' +
        'pane to set its cell background color Optimistically', function() {
          spyOn(PaneManager.getTopLeftPane(),
                'setCellBackgroundColorOptimistically');
          spyOn(PaneManager.getTopRightPane(),
                'setCellBackgroundColorOptimistically');
          spyOn(PaneManager.getBottomLeftPane(),
                'setCellBackgroundColorOptimistically');
          spyOn(PaneManager.getMainPane(),
                'setCellBackgroundColorOptimistically');

          var color = 'blue';
          PaneManager.setCellBackgroundColorOptimistically(color);

          // setCellBackgroundColorOptimistically() should have called on all
          // 4 panes
          expect(PaneManager.getTopLeftPane().
              setCellBackgroundColorOptimistically).toHaveBeenCalledWith(color);
          expect(PaneManager.getTopRightPane().
              setCellBackgroundColorOptimistically).toHaveBeenCalledWith(color);
          expect(PaneManager.getBottomLeftPane().
              setCellBackgroundColorOptimistically).toHaveBeenCalledWith(color);
          expect(PaneManager.getMainPane().
              setCellBackgroundColorOptimistically).
              toHaveBeenCalledWith(color);
        });

    it('has a setCellHorizontalAlignmentOptimistically() ' +
        'method which instructs ' +
        'each pane to set its cell horizontal alignment Optimistically',
       function() {
         spyOn(PaneManager.getTopLeftPane(),
               'setCellHorizontalAlignmentOptimistically');
         spyOn(PaneManager.getTopRightPane(), '' +
               'setCellHorizontalAlignmentOptimistically');
         spyOn(PaneManager.getBottomLeftPane(),
               'setCellHorizontalAlignmentOptimistically');
         spyOn(PaneManager.getMainPane(),
               'setCellHorizontalAlignmentOptimistically');

         var alignPos = 'r';
         PaneManager.setCellHorizontalAlignmentOptimistically(alignPos);

         // setCellHorizontalAlignmentOptimistically() should have called on
         // all 4 panes
         expect(PaneManager.getTopLeftPane().
             setCellHorizontalAlignmentOptimistically).
             toHaveBeenCalledWith(alignPos);
         expect(PaneManager.getTopRightPane().
             setCellHorizontalAlignmentOptimistically).
             toHaveBeenCalledWith(alignPos);
         expect(PaneManager.getBottomLeftPane().
             setCellHorizontalAlignmentOptimistically).
             toHaveBeenCalledWith(alignPos);
         expect(PaneManager.getMainPane().
             setCellHorizontalAlignmentOptimistically).
             toHaveBeenCalledWith(alignPos);
       });

    it('has a setCellVerticalAlignmentOptimistically() ' +
        'method which instructs ' +
        'each pane to set its cell vertical alignment Optimistically',
        function() {
          spyOn(PaneManager.getTopLeftPane(),
                'setCellVerticalAlignmentOptimistically');
          spyOn(PaneManager.getTopRightPane(),
                'setCellVerticalAlignmentOptimistically');
          spyOn(PaneManager.getBottomLeftPane(),
                'setCellVerticalAlignmentOptimistically');
          spyOn(PaneManager.getMainPane(),
                'setCellVerticalAlignmentOptimistically');

          var alignPos = 'b';
          PaneManager.setCellVerticalAlignmentOptimistically(alignPos);

          // setCellVerticalAlignmentOptimistically() should have called on all
          // 4 panes
          expect(PaneManager.getTopLeftPane().
              setCellVerticalAlignmentOptimistically).
              toHaveBeenCalledWith(alignPos);
          expect(PaneManager.getTopRightPane().
              setCellVerticalAlignmentOptimistically).
              toHaveBeenCalledWith(alignPos);
          expect(PaneManager.getBottomLeftPane().
              setCellVerticalAlignmentOptimistically).
              toHaveBeenCalledWith(alignPos);
          expect(PaneManager.getMainPane().
              setCellVerticalAlignmentOptimistically).
              toHaveBeenCalledWith(alignPos);
       });

    it('has a injectCellRefIntoFloatingEditor() method which instructs the ' +
        'pane with the focused floating editor to inject a cell ref into it',
       function() {
         spyOn(PaneManager.getTopLeftPane(),
             'injectCellRefIntoFloatingEditor');
         spyOn(PaneManager.getTopRightPane(),
             'injectCellRefIntoFloatingEditor');
         spyOn(PaneManager.getBottomLeftPane(),
             'injectCellRefIntoFloatingEditor');
         spyOn(PaneManager.getMainPane(), 'injectCellRefIntoFloatingEditor');

         PaneManager.getTopRightPane().floatingEditorHasFocus = function() {
           return true;
         };

         var obj = {cellRef: 'D18'};
         PaneManager.injectCellRefIntoFloatingEditor(obj);

         // injectCellRefIntoFloatingEditor() should
         // have been called only on the top right pane
         expect(PaneManager.getTopLeftPane().injectCellRefIntoFloatingEditor).
             not.toHaveBeenCalledWith(obj);
         expect(PaneManager.getTopRightPane().injectCellRefIntoFloatingEditor).
             toHaveBeenCalledWith(obj);
         expect(PaneManager.getBottomLeftPane().
             injectCellRefIntoFloatingEditor).not.toHaveBeenCalledWith(obj);
         expect(PaneManager.getMainPane().injectCellRefIntoFloatingEditor).
             not.toHaveBeenCalledWith(obj);

         PaneManager.getTopRightPane().floatingEditorHasFocus = function() {
           return false;
         };
       });

    it('has a injectCellRangeIntoFloatingEditor() method which instructs the ' +
        'pane with the focused floating editor to inject a cell range into it',
       function() {
         spyOn(PaneManager.getTopLeftPane(),
             'injectCellRangeIntoFloatingEditor');
         spyOn(PaneManager.getTopRightPane(),
             'injectCellRangeIntoFloatingEditor');
         spyOn(PaneManager.getBottomLeftPane(),
             'injectCellRangeIntoFloatingEditor');
         spyOn(PaneManager.getMainPane(), 'injectCellRangeIntoFloatingEditor');

         PaneManager.getBottomLeftPane().floatingEditorHasFocus = function() {
           return true;
         };

         var obj = {cellRange: {topLeft: 'AJ26', bottomRight: 'BP59'} };
         PaneManager.injectCellRangeIntoFloatingEditor(obj);

         // injectCellRangeIntoFloatingEditor() should
         // have been called only on the bottom left pane
         expect(PaneManager.getTopLeftPane().
             injectCellRangeIntoFloatingEditor).not.toHaveBeenCalledWith(obj);
         expect(PaneManager.getTopRightPane().
             injectCellRangeIntoFloatingEditor).not.toHaveBeenCalledWith(obj);
         expect(PaneManager.getBottomLeftPane().
             injectCellRangeIntoFloatingEditor).toHaveBeenCalledWith(obj);
         expect(PaneManager.getMainPane().injectCellRangeIntoFloatingEditor).
             not.toHaveBeenCalledWith(obj);
       });

    it('has a highlightCells() method which instructs each pane to highlight ' +
        'the specified cells', function() {
          spyOn(PaneManager.getTopLeftPane(), 'highlightCells');
          spyOn(PaneManager.getTopRightPane(), 'highlightCells');
          spyOn(PaneManager.getBottomLeftPane(), 'highlightCells');
          spyOn(PaneManager.getMainPane(), 'highlightCells');

          var cells = [];
          var scrollOffsetX = 0;
          var scrollOffsetY = 0;
          PaneManager.highlightCells(cells);

          // highlightCells() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().highlightCells).
              toHaveBeenCalledWith(cells, scrollOffsetX, scrollOffsetY);
          expect(PaneManager.getTopRightPane().highlightCells).
              toHaveBeenCalledWith(cells, scrollOffsetX, scrollOffsetY);
          expect(PaneManager.getBottomLeftPane().highlightCells).
              toHaveBeenCalledWith(cells, scrollOffsetX, scrollOffsetY);
          expect(PaneManager.getMainPane().highlightCells).
              toHaveBeenCalledWith(cells, scrollOffsetX, scrollOffsetY);
        });

    it('has a unhighlightCells() method which instructs each pane to ' +
        'unhighlight all highlighted cells', function() {
          spyOn(PaneManager.getTopLeftPane(), 'unhighlightCells');
          spyOn(PaneManager.getTopRightPane(), 'unhighlightCells');
          spyOn(PaneManager.getBottomLeftPane(), 'unhighlightCells');
          spyOn(PaneManager.getMainPane(), 'unhighlightCells');

          PaneManager.unhighlightCells();

          // unhighlightCells() should have called on all 4 panes
          expect(PaneManager.getTopLeftPane().unhighlightCells).
              toHaveBeenCalled();
          expect(PaneManager.getTopRightPane().unhighlightCells).
              toHaveBeenCalled();
          expect(PaneManager.getBottomLeftPane().unhighlightCells).
              toHaveBeenCalled();
          expect(PaneManager.getMainPane().unhighlightCells).
              toHaveBeenCalledWith();
        });

    it('should insert new items into the model when inserting rows',
       function() {
         expect(SheetModel.RowHeights.length).toBe(6);
         expect(SheetModel.RowFormatting.length).toBe(6);
         expect(SheetModel.RowHeights[4]).toBe(50);
         expect(SheetModel.RowHeights[6]).toBe(undefined);
         PaneManager.insertRows(2, 2);
         expect(SheetModel.RowFormatting.length).toBe(8);
         expect(SheetModel.RowHeights[6]).toBe(50);
         expect(SheetModel.RowHeights[4]).toBe(30);
         expect(SheetModel.RowPos.length).toBe(302);
       });

    it('should insert new items into the model when inserting cols',
       function() {
         expect(SheetModel.ColWidths.length).toBe(6);
         expect(SheetModel.ColFormatting.length).toBe(6);
         expect(SheetModel.ColWidths[4]).toBe(50);
         expect(SheetModel.ColWidths[6]).toBe(undefined);
         PaneManager.insertColumns(2, 2);
         expect(SheetModel.ColFormatting.length).toBe(8);
         expect(SheetModel.ColWidths[6]).toBe(50);
         expect(SheetModel.ColWidths[4]).toBe(30);
         expect(SheetModel.ColPos.length).toBe(256);
       });

    it('should move items in the model when deleting rows', function() {
      expect(SheetModel.RowHeights.length).toBe(6);
      expect(SheetModel.RowFormatting.length).toBe(6);
      expect(SheetModel.RowHeights[4]).toBe(50);
      expect(SheetModel.RowHeights[2]).toBe(30);
      PaneManager.deleteRows(2, 2);
      expect(SheetModel.RowHeights[4]).toBe(undefined);
      expect(SheetModel.RowHeights[2]).toBe(50);
      expect(SheetModel.RowFormatting.length).toBe(6);
      expect(SheetModel.RowPos.length).toBe(300);
    });
    SheetModel.ColWidths = [10, 20, 30, 40, 50, 60];

    it('should move items in the model when deleting cols', function() {
      expect(SheetModel.ColWidths.length).toBe(6);
      expect(SheetModel.ColFormatting.length).toBe(6);
      expect(SheetModel.ColWidths[4]).toBe(50);
      expect(SheetModel.ColWidths[2]).toBe(30);
      PaneManager.deleteColumns(2, 2);
      expect(SheetModel.ColWidths[4]).toBe(undefined);
      expect(SheetModel.ColWidths[2]).toBe(50);
      expect(SheetModel.ColFormatting.length).toBe(6);
      expect(SheetModel.ColPos.length).toBe(256);
    });

    it('should put document fragment into DOM when inserting rows', function() {
      var obj = {};
      obj.widgetObj = {};
      obj.widgetObj.baseNodesToReappend = document.createDocumentFragment();
      obj.widgetObj.contentNodesToReappend = document.createDocumentFragment();

      var node = document.createElement('div');
      node.id = 'basetest';
      var node2 = document.createElement('div');
      node2.id = 'contenttest';
      obj.widgetObj.baseNodesToReappend.appendChild(node);
      obj.widgetObj.contentNodesToReappend.appendChild(node2);
      obj.heights = [42];

      expect(SheetModel.RowHeights.length).toBe(6);
      expect(_rootNode.getElementById('basetest')).toBe(null);
      expect(_rootNode.getElementById('contenttest')).toBe(null);

      PaneManager.insertRows(2, 1, obj);

      expect(SheetModel.RowHeights.length).toBe(7);
      expect(_rootNode.getElementById('basetest')).toBeDefined();
      expect(_rootNode.getElementById('contenttest')).toBeDefined();
    });

    it('should put document fragment into DOM when inserting cols', function() {
      var obj = {};
      obj.widgetObj = {};
      obj.widgetObj.baseNodesToReappend = document.createDocumentFragment();
      obj.widgetObj.contentNodesToReappend = document.createDocumentFragment();

      var node = document.createElement('div');
      node.id = 'basetest';
      var node2 = document.createElement('div');
      node2.id = 'contenttest';
      obj.widgetObj.baseNodesToReappend.appendChild(node);
      obj.widgetObj.contentNodesToReappend.appendChild(node2);
      obj.heights = [42];

      expect(SheetModel.ColWidths.length).toBe(6);
      expect(_rootNode.getElementById('basetest')).toBe(null);
      expect(_rootNode.getElementById('contenttest')).toBe(null);

      PaneManager.insertColumns(2, 1, obj);

      expect(SheetModel.ColWidths.length).toBe(7);
      expect(_rootNode.getElementById('basetest')).toBeDefined();
      expect(_rootNode.getElementById('contenttest')).toBeDefined();
    });

    it('should set the anchor and range node positions of the selection box ' +
        'when freezing and unfreezing the panes', function() {
          var selectionBox = PaneManager.getActivePane().getSelectionBox();
          var checkExpectedResults = function() {
            expect(selectionBox.setAnchorNodeLeftPosition).toHaveBeenCalled();
            expect(selectionBox.setAnchorNodeTopPosition).toHaveBeenCalled();
            expect(selectionBox.setRangeNodeLeftPosition).toHaveBeenCalled();
            expect(selectionBox.setRangeNodeTopPosition).toHaveBeenCalled();
          };
          PaneManager.setFrozenRowIndex(2);
          PaneManager.setFrozenColumnIndex(0);
          spyOn(selectionBox, 'setAnchorNodeLeftPosition');
          spyOn(selectionBox, 'setAnchorNodeTopPosition');
          spyOn(selectionBox, 'setRangeNodeLeftPosition');
          spyOn(selectionBox, 'setRangeNodeTopPosition');

          PaneManager.freezePanes();
          checkExpectedResults();

          PaneManager.unfreezePanes();
          checkExpectedResults();
        });

    it('has a setCellWrapTextOptimistically() ' +
        'method which instructs each pane ' +
        'to set its floating editor wrap text property', function() {
        spyOn(PaneManager.getTopLeftPane(), 'setCellWrapTextOptimistically');
        spyOn(PaneManager.getTopRightPane(), 'setCellWrapTextOptimistically');
        spyOn(PaneManager.getBottomLeftPane(), 'setCellWrapTextOptimistically');
        spyOn(PaneManager.getMainPane(), 'setCellWrapTextOptimistically');

        var wrapText = true;
        PaneManager.setCellWrapTextOptimistically(wrapText);

        // setCellWrapTextOptimistically() should have called on all 4 panes
        expect(PaneManager.getTopLeftPane().setCellWrapTextOptimistically).
            toHaveBeenCalledWith(wrapText);
        expect(PaneManager.getTopRightPane().setCellWrapTextOptimistically).
            toHaveBeenCalledWith(wrapText);
        expect(PaneManager.getBottomLeftPane().setCellWrapTextOptimistically).
            toHaveBeenCalledWith(wrapText);
        expect(PaneManager.getMainPane().setCellWrapTextOptimistically).
            toHaveBeenCalledWith(wrapText);
    });
  });
});
