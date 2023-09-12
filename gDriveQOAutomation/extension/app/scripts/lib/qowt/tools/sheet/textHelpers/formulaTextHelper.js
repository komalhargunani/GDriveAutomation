// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The 'formula' text helper of the Sheet Text Tool.
 * This helper is used by the Sheet Text Tool when formula text -
 * e.g. '=SUM(A12+C47)' - is being edited in a text editor (i.e.
 * in the formula bar or in the floating editor). It manages
 * the manipulation of formula text.
 *
 * This helper is a subclass of the 'base' helper.
 *
 * @see BaseHelper
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/sheet/textHelpers/baseHelper',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/formulaUtils'],
  function(
    BaseHelper,
    PubSub,
    SheetSelectionManager,
    PaneManager,
    DomListener,
    FormulaUtils) {

  'use strict';

    var contentType_ = 'sheetText',
        doProcessArrowKeys_,
        kFloating_Editor_Class_ = "qowt-floating-editor",
        kPane_Class_ = "qowt-sheet-pane",
        kSignal_DoAction_ = "qowt:doAction",
        kAction_InjectCellRef_ = "injectCellRef",
        kAction_InjectCellRange_ = "injectCellRange";

    // Extend the BaseHelper API
    var api_ = BaseHelper.create();

    api_.mode = 'formula';

    api_.init = function() {
      doProcessArrowKeys_ = true;

      // highlight the cells for the current formula text
      highlightCells_();
    };

    api_.reset = function() {
      // unhighlight any cells that are highlighted
      unhighlightCells_();
    };

    api_.onMouseDownOnPanesContainer = function(event) {
      if(event.target &&
          event.target.classList.contains(kFloating_Editor_Class_)) {
        // the user has clicked inside the floating editor and so has
        // potentially changed the cursor location so we want to prevent
        // any future arrow key presses from being specially processed
        // (note that this is the same behaviour as Excel and Trix)
        doProcessArrowKeys_ = false;
      }
      else if(event.target && !event.target.classList.contains(kPane_Class_)) {
        // the mousedown event didn't occur on a scrollbar or in the
        // floating editor so start listening for mousemove and mouseup events
        DomListener.add(api_.mode, document, 'mousemove',
          moveRangeSelectionByMouse_);
        DomListener.add(api_.mode, document, 'mouseup',
          stopRangeSelectionByMouse_);
      }
    };

    api_.onMouseDownOnPane = function(event) {
      // prevent the default behaviour which would
      // cause the active text editor to lose focus
      if(event.preventDefault) {
        event.preventDefault();
      }

      injectCellRef_(event);
    };

    api_.onMutationEvent = function() {
      // refresh the highlighted cells incase
      // the mutation event has affected them
      highlightCells_();
    };

    api_.onArrowKeyDown = function(event) {
      // if the focused text editor is the floating editor and the
      // 'doProcessArrowKeys' flag is 'true' then an arrow key press
      // signifies that the user wants to add a cell ref or update
      // an existing cell ref
      if(doProcessArrowKeys_) {
        var selectionObj = SheetSelectionManager.getCurrentSelection();
        if(selectionObj && selectionObj.textWidget &&
          selectionObj.textWidget.isInline()) {

          if(event.shiftKey) {
            injectCellRange_(event);
          }
          else {
            injectCellRef_(event);
          }

          if(event.preventDefault) {
            event.preventDefault();
          }
        }
      }
    };

    // VVVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVVV

    var moveRangeSelectionByMouse_ = function(event) {
      injectCellRange_(event);
    };

    var stopRangeSelectionByMouse_ = function() {
      DomListener.removeGroup(api_.mode);
    };

    var injectCellRef_ = function(event) {
      PubSub.publish(kSignal_DoAction_, {
        'action': kAction_InjectCellRef_,
        'context': {
          contentType: contentType_,
          triggerEvent: event
        }
      });

      highlightCells_();
    };

    var injectCellRange_ = function(event) {
      PubSub.publish(kSignal_DoAction_, {
        'action': kAction_InjectCellRange_,
        'context': {
          contentType: contentType_,
          triggerEvent: event
        }
      });

      highlightCells_();
    };

    var highlightCells_ = function(text) {
      if(!text) {
        var selectionObj = SheetSelectionManager.getCurrentSelection();
        if(selectionObj && selectionObj.textWidget) {
          text = selectionObj.textWidget.getDisplayText();
        }
      }

      var highlights = [];

      // tokenize the formula text into cell references
      var cellRefArray = FormulaUtils.tokenizeIntoPrefixedCellRefs(text);
      if(cellRefArray) {
        // translate each cell ref into row and column indices
        var cellCount = cellRefArray.length;
        for(var i = 0; i < cellCount; i++) {
          var cellRef = cellRefArray[i];
          var prefixChar = cellRef.substring(0, 1);
          cellRef = cellRef.substring(1); // strip out prefix char
          var cellObj = FormulaUtils.cellRefToRowAndColNums(cellRef);

          // if the prefix character of this cell ref is the range character
          // and there is a previous single cell ref then amend the single
          // cell ref's entry to become a range entry.
          // This is to support ranges such as "B3:D7" (1 range)
          // and "B3:D7:F4:G9" (2 seperate ranges)
          var len = highlights.length;
          if((':' === prefixChar) && (len > 0) &&
            (highlights[len-1].rangeEnd === undefined)) {
            highlights[len-1].rangeEnd = {
              rowIdx: cellObj.rowNum - 1,
              colIdx: cellObj.colNum - 1
            };
          }
          else {
            highlights.push({
              rowIdx: cellObj.rowNum - 1,
              colIdx: cellObj.colNum - 1
            });
          }
        }
      }

      // highlight the cells
      PaneManager.highlightCells(highlights);
    };

    var unhighlightCells_ = function() {
      PaneManager.unhighlightCells();
    };

    return api_;
});
