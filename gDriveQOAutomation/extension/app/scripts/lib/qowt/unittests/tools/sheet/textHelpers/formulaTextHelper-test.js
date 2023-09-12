// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the 'formula' text helper of the sheet text
 * tool.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/sheet/textHelpers/formulaTextHelper',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/utils/domListener',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/sheet',
  'qowtRoot/selection/sheetSelectionManager'
], function(
    FormulaTextHelper,
    PaneManager,
    DomListener,
    PubSub,
    SheetModel,
    SheetSelectionManager) {

  'use strict';
  describe('The "formula" text helper of the sheet text tool', function() {

    it('should inherit from the BaseHelper API',
        function() {
          expect(FormulaTextHelper.mode).toBeDefined();
          expect(FormulaTextHelper.init).toBeDefined();
          expect(FormulaTextHelper.reset).toBeDefined();
          expect(FormulaTextHelper.onMouseDownOnPanesContainer).toBeDefined();
          expect(FormulaTextHelper.onMouseDownOnPane).toBeDefined();
          expect(FormulaTextHelper.onArrowKeyDown).toBeDefined();
          expect(FormulaTextHelper.onMutationEvent).toBeDefined();
          expect(FormulaTextHelper.onInjectAutocompleteText).toBeDefined();
          expect(FormulaTextHelper.doCommitCellEdit).toBeDefined();
        });

    it('should override the mode property to define its own',
        function() {
          expect(FormulaTextHelper.mode).toBe('formula');
        });

    it('should override the init() method to set highlight the referenced ' +
        'cells', function() {
          spyOn(PaneManager, 'highlightCells');
          FormulaTextHelper.init();
          expect(PaneManager.highlightCells).toHaveBeenCalled();
        });

    it('should override the reset() method to set unhighlight the ' +
        'referenced cells', function() {
          spyOn(PaneManager, 'unhighlightCells');
          FormulaTextHelper.reset();
          expect(PaneManager.unhighlightCells).toHaveBeenCalled();
        });

    it('should override the onMouseDownOnPanesContainer() method to start ' +
        'listening for range selection if the mousedown event didn\'t occur ' +
        'in the floating editor or in the scroll bar', function() {
          var evt = {
            target: {
              classList: {
                contains: function() {
                  return false;
                }
              }
            }
          };

          spyOn(DomListener, 'add');
          FormulaTextHelper.onMouseDownOnPanesContainer(evt);
          expect(DomListener.add).toHaveBeenCalled();
        });

    it('should override the onMouseDownOnPane() method to prevent the ' +
        'default behaviour, inject a cell ref and refresh the cell ' +
        'highlighting', function() {
          var evt = {
            preventDefault: function() {
            }
          };

          spyOn(evt, 'preventDefault');
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(PaneManager, 'highlightCells');
          FormulaTextHelper.onMouseDownOnPane(evt);
          expect(evt.preventDefault).toHaveBeenCalled();
          expectPublishDoActionAndHighlightCells_('injectCellRef', evt);
        });

    it('should override the onMutationEvent() method to refresh the ' +
        'highlighting of cells', function() {
          spyOn(PaneManager, 'highlightCells');
          FormulaTextHelper.onMutationEvent();
          expect(PaneManager.highlightCells).toHaveBeenCalled();
        });

    it('should override the onArrowKeyDown() method to inject a cell ref ' +
        'if the active text editor is the floating editor', function() {
          SheetSelectionManager.init();
          var textWidget = {
            isInline: function() {
              return true;
            },
            getDisplayText: function() {
              return 'blah';
            }
          };
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: textWidget
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var evt = {
            preventDefault: function() {
            }
          };
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(PaneManager, 'highlightCells');
          spyOn(evt, 'preventDefault');
          FormulaTextHelper.onArrowKeyDown(evt);
          expectPublishDoActionAndHighlightCells_('injectCellRef', evt);
          expect(evt.preventDefault).toHaveBeenCalled();
        });

    it('should override the onArrowKeyDown() method to inject a cell range ' +
        'if the active text editor is the floating editor and the shift key ' +
        'was used', function() {
          SheetSelectionManager.init();
          var textWidget = {
            isInline: function() {
              return true;
            },
            getDisplayText: function() {
              return 'blah';
            }
          };
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: textWidget
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var evt = {
            shiftKey: true,
            preventDefault: function() {
            }
          };
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(PaneManager, 'highlightCells');
          spyOn(evt, 'preventDefault');
          FormulaTextHelper.onArrowKeyDown(evt);
          expectPublishDoActionAndHighlightCells_('injectCellRange', evt);
          expect(evt.preventDefault).toHaveBeenCalled();
        });

    it('should override the onArrowKeyDown() method to do nothing if the ' +
        'user has previously clicked in the floating editor', function() {
          var textWidget = {
            isInline: function() {
              return true;
            },
            getDisplayText: function() {
              return 'blah';
            }
          };
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: textWidget
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          // mimic clicking in the floating editor
          var evt = {
            target: {
              classList: {
                contains: function() {
                  return true;
                }
              }
            }
          };
          FormulaTextHelper.onMouseDownOnPanesContainer(evt);

          evt = {
            preventDefault: function() {
            }
          };
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(PaneManager, 'highlightCells');
          spyOn(evt, 'preventDefault');
          FormulaTextHelper.onArrowKeyDown(evt);
          expect(PubSub.publish).not.toHaveBeenCalledWith();
          expect(PaneManager.highlightCells).not.toHaveBeenCalled();
          expect(evt.preventDefault).not.toHaveBeenCalled();
        });

    it('should inject a cell range if a mousemove event occurs after ' +
        'a mousedown event on a pane', function() {
          // first generate a mousedown event, so that a listener
          // is added for mousemove events
          var evt = {
            target: {
              classList: {
                contains: function() {
                  return false;
                }
              }
            }
          };
          spyOn(DomListener, 'add').andCallThrough();
          FormulaTextHelper.onMouseDownOnPanesContainer(evt);
          expect(DomListener.add).toHaveBeenCalled();

          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(PaneManager, 'highlightCells');

          // generate a mousemove event
          evt = document.createEvent('Event');
          evt.initEvent('mousemove', true, false);
          document.dispatchEvent(evt);

          expectPublishDoActionAndHighlightCells_('injectCellRange', evt);
        });

    it('should stop listening for mousemove and mouseup events if a ' +
        'mouseup event occurs after a mousedown event on a pane', function() {
          // first generate a mousedown event, so that a listener
          // is added for mouseup events
          var evt = {
            target: {
              classList: {
                contains: function() {
                  return false;
                }
              }
            }
          };
          spyOn(DomListener, 'add').andCallThrough();
          FormulaTextHelper.onMouseDownOnPanesContainer(evt);
          expect(DomListener.add).toHaveBeenCalled();

          spyOn(DomListener, 'removeGroup');

          // generate a mouseup event
          evt = document.createEvent('Event');
          evt.initEvent('mouseup', true, false);
          document.dispatchEvent(evt);

          expect(DomListener.removeGroup).toHaveBeenCalled();
        });

    it('should correctly tokenize a given formula to extract the ' +
        'cell references to be highlighted', function() {
          SheetSelectionManager.init();
          spyOn(PaneManager, 'highlightCells');

          var formulaText = '=D14+X173-$N$73/CK208 F1^Z89hello-UV123' +
              '\u00A0P13*GHT1999world &A1!AA50,JJ817.C1:ABC5555/$H52' +
              '(Q121<HHH77>ZZ3^T$66+B016+f59 B8:D12:G5:K19';

          var textWidget = {
            getDisplayText: function() {
              return formulaText;
            }
          };
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: textWidget
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          FormulaTextHelper.onMutationEvent();

          var highlights = [
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
              // $N$73
              rowIdx: 72,
              colIdx: 13
            },
            {
              // CK208
              rowIdx: 207,
              colIdx: 88
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
              // UV123
              rowIdx: 122,
              colIdx: 567
            },
            {
              // P13
              rowIdx: 12,
              colIdx: 15
            },
            {
              // GHT1999
              rowIdx: 1998,
              colIdx: 4959
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
              // JJ817
              rowIdx: 816,
              colIdx: 269
            },
            {
              // C1
              rowIdx: 0,
              colIdx: 2,
              rangeEnd: {
                // ABC5555
                rowIdx: 5554,
                colIdx: 730
              }
            },
            {
              // $H52
              rowIdx: 51,
              colIdx: 7
            },
            {
              // Q121
              rowIdx: 120,
              colIdx: 16
            },
            {
              // HHH77
              rowIdx: 76,
              colIdx: 5623
            },
            {
              // ZZ3
              rowIdx: 2,
              colIdx: 701
            },
            {
              // T$66
              rowIdx: 65,
              colIdx: 19
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
            },
            {
              // B8
              rowIdx: 7,
              colIdx: 1,
              rangeEnd: {
                // D12
                rowIdx: 11,
                colIdx: 3
              }
            },
            {
              // G5
              rowIdx: 4,
              colIdx: 6,
              rangeEnd: {
                // K19
                rowIdx: 18,
                colIdx: 10
              }
            }
          ];
          expect(PaneManager.highlightCells).toHaveBeenCalledWith(highlights);
        });

  });

  var expectPublishDoActionAndHighlightCells_ = function(action, evt) {
    expect(PubSub.publish).toHaveBeenCalledWith('qowt:doAction',
        {
          'action': action,
          'context': {
            contentType: 'sheetText',
            triggerEvent: evt
          }
        });
    expect(PaneManager.highlightCells).toHaveBeenCalled();
  };

});
