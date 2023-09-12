// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the cell content manager.
 *
 * @author mikkor@google.com (Mikko Rintala)
 */

define([
  'qowtRoot/contentMgrs/quicksheet/cellContentMgr',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/models/sheet',
  'qowtRoot/widgets/grid/sysClipboard',
  'qowtRoot/selection/sheetSelectionManager'
], function(
  CellContentMgr,
  PubSub,
  CommandManager,
  Workbook,
  SheetModel,
  SysClipboard,
  SheetSelectionManager) {

  'use strict';

  describe('contentMgrs/quicksheet/cellContentMgr.js', function() {


    var selectionObj = {
      anchor: {
        rowIdx: 4,
        colIdx: 4
      },
      topLeft: {
        rowIdx: 4,
        colIdx: 4
      },
      bottomRight: {
        rowIdx: 6,
        colIdx: 6
      },
      contentType: 'sheetCell'
    };
    SheetModel.activeSheetIndex = 0;

    var action_cellFormat,
      action_basic,
      action_sort,
      action_keyUp,
      action_mouseDown,
      action_autoComplete;

    describe('Test initialization of Cell Content Manager', function() {

      it('should initialize properly', function() {
        var pubsubSpy = spyOn(PubSub, 'subscribe').andCallThrough();
        CellContentMgr.init();
        expect(PubSub.subscribe).wasCalled();
        expect(pubsubSpy.callCount).toEqual(2);
      });

      it('should throw CellContentManager.init() when called multiple times',
        function() {
          expect(function() {
            CellContentMgr.init();
            CellContentMgr.init();
          }).toThrow('Cell Content manager initialized multiple times.');
        });
    });

    describe('handling signals', function() {

      beforeEach(function() {
        SheetSelectionManager.init();
        PubSub.publish('qowt:sheet:requestFocus', selectionObj);
        Workbook.init();

        // first define different signal types
        // cell format
        action_cellFormat = {
          'context': {
            'contentType': 'sheetCell',
            'fromRowIndex': 1,
            'fromColIndex': 2,
            'toRowIndex': 3,
            'toColIndex': 4,
            'anchor': {
              'rowIdx': 1,
              'colIdx': 2
            },
            'formatting': {}
          }
        };

        // move, copy, paste, cancel edit
        action_basic = {
          'context': {
            'contentType': 'sheetCell'
          }
        };

        // sort range
        action_sort = {
          'context': {
            'contentType': 'sheetCell',
            'ascending': true
          }
        };

        // commitCellEdit with keyup
        action_keyUp = {
          'context': {
            'contentType': 'sheetCell',
            'rowIndex': 2,
            'colIndex': 2,
            'cellText': 'foo',
            'commitEvent': {
              'keyCode': '123',
              'type': 'keyup'
            }
          }
        };

        // commitCellEdit with mouse
        action_mouseDown = {
          'context': {
            'contentType': 'sheetCell',
            'rowIndex': 2,
            'colIndex': 2,
            'cellText': 'foo',
            'commitEvent': {
              'keyCode': '123',
              'type': 'mousedown',
              'target': {}
            }
          }
        };

        // commitCellEdit with no commit event
        action_autoComplete = {
          'context': {
            'contentType': 'sheetCell',
            'rowIndex': 2,
            'colIndex': 2,
            'cellText': 'foo'
          }
        };
        CellContentMgr.init();
      });

      // action for cell format
      it('should handle "numberFormat" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'numberFormat';
          action_cellFormat.context.value = '@';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "bold" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'bold';
          action_cellFormat.context.formatting.bld = {
            'value': true
          };
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "italic" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'italic';
          action_cellFormat.context.formatting.itl = {
            'value': true
          };
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "underline" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'underline';
          action_cellFormat.context.formatting.udl = {
            'value': true
          };
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "fontFace" using the correct compound command.',
        function() {
          SheetModel.fontNames = ['xyz'];
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'fontFace';
          action_cellFormat.context.formatting.font = 'xyz';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
          SheetModel.fontNames = undefined;
        });

      it('should handle "fontSize" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'fontSize';
          action_cellFormat.context.formatting.siz = 12;
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "textColor" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'textColor';
          action_cellFormat.context.formatting.clr = '#112233';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "backgroundColor" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'backgroundColor';
          action_cellFormat.context.formatting.bg ='#332211';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "cellVAlignTop" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'cellVAlignTop';
          action_cellFormat.context.formatting.va = 't';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "cellVAlignCenter" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'cellVAlignCenter';
          action_cellFormat.context.formatting.va = 'c';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "cellVAlignBottom" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'cellVAlignBottom';
          action_cellFormat.context.formatting.va = 'b';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "cellHAlignLeft" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'cellHAlignLeft';
          action_cellFormat.context.formatting.ha = 'l';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "cellHAlignCenter" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'cellHAlignCenter';
          action_cellFormat.context.formatting.ha = 'c';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "cellHAlignRight" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'cellHAlignRight';
          action_cellFormat.context.formatting.ha = 'r';
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "moveSelectionUp" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'moveSelectionUp';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
      it('should handle "moveSelectionDown" using the correct ' +
        'compound command.', function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'moveSelectionDown';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd =
            CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
      it('should handle "moveSelectionLeft" using the correct ' +
        'compound command.', function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'moveSelectionLeft';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd =
            CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
      it('should handle "moveSelectionRight" using the correct c' +
        'ompound command.', function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'moveSelectionRight';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd =
            CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
      it('should handle "moveRangeSelectionUp" using the correct ' +
        'compound command.', function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'moveRangeSelectionUp';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd =
            CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
      it('should handle "moveRangeSelectionDown" using the correct ' +
        'compound command.', function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'moveRangeSelectionDown';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd =
            CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
      it('should handle "moveRangeSelectionLeft" using the correct ' +
        'compound command.', function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'moveRangeSelectionLeft';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd =
            CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "moveRangeSelectionRight" using the correct ' +
        'compound command.', function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'moveRangeSelectionRight';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd =
            CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
      it('should handle "copy" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'copy';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
      it('should handle "paste" using the correct compound command.',
        function() {
          SysClipboard.containsCellContent = function() {
            return true;
          };
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'paste';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];
          expect(containingCmd.childCount()).toBe(1);
          var childCmds = containingCmd.getChildren();
          expect(childCmds[0].name).toBe('PasteCellRange');

          SysClipboard.containsCellContent = function() {
            return false;
          };
          SysClipboard.getContents = function() {
            return 'hello';
          };
          CommandManager.addCommand.reset();
          action_basic.action = 'paste';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          containingCmd = CommandManager.addCommand.mostRecentCall.args[0];
          expect(containingCmd.childCount()).toBe(1);
          childCmds = containingCmd.getChildren();
          expect(childCmds[0].name).toBe('SetCellContent');
        });

      it('should handle "sortCellRange" using the correct command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_sort.action = 'sortCellRange';
          PubSub.publish('qowt:doAction', action_sort);

          expect(CommandManager.addCommand).wasCalled();
        });

      it('should handle "commitCellEdit" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_keyUp.action = 'commitCellEdit';
          PubSub.publish('qowt:doAction', action_keyUp);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 2 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(2);
        });

      it('should not move selection if committed with delete key', function() {
        spyOn(CommandManager, 'addCommand');
        action_keyUp.action = 'commitCellEdit';
        action_keyUp.context.commitEvent.keyCode = 46;
        PubSub.publish('qowt:doAction', action_keyUp);

        expect(CommandManager.addCommand).wasCalled();
        var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

        // We expect 2 immediate children participating in this compound
        // command.
        expect(containingCmd.childCount()).toBe(2);
      });

      it('should not move selection if committed with backspace', function() {
        spyOn(CommandManager, 'addCommand');
        action_keyUp.action = 'commitCellEdit';
        action_keyUp.context.commitEvent.keyCode = 8;
        PubSub.publish('qowt:doAction', action_keyUp);

        expect(CommandManager.addCommand).wasCalled();
        var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

        // We expect 2 immediate children participating in this compound
        // command.
        expect(containingCmd.childCount()).toBe(2);
      });

      it('should not move selection if committed with mouse down', function() {
        spyOn(CommandManager, 'addCommand');
        action_mouseDown.action = 'commitCellEdit';
        PubSub.publish('qowt:doAction', action_mouseDown);

        expect(CommandManager.addCommand).wasCalled();
        var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

        // We expect 2 immediate children participating in this compound
        // command.
        expect(containingCmd.childCount()).toBe(2);
      });

      it('should handle "commitCellEdit" when a commitEvent is not passed',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_autoComplete.action = 'commitCellEdit';
          PubSub.publish('qowt:doAction', action_autoComplete);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 3 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(3);
        });

      it('should handle "cancelCellEdit" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_basic.action = 'cancelCellEdit';
          PubSub.publish('qowt:doAction', action_basic);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });

      it('should handle "wrapText" using the correct compound command.',
        function() {
          spyOn(CommandManager, 'addCommand');
          action_cellFormat.action = 'wrapText';
          action_cellFormat.context.formatting.wrapText = true;
          PubSub.publish('qowt:doAction', action_cellFormat);

          expect(CommandManager.addCommand).wasCalled();
          var containingCmd =
            CommandManager.addCommand.mostRecentCall.args[0];

          // We expect 1 immediate children participating in this compound
          // command.
          expect(containingCmd.childCount()).toBe(1);
        });
    });
  });
});
