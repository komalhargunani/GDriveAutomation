define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/selectionGestureHandler',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/contentMgrs/quicksheet/cellContentMgr',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/rowHeaderContainer'
], function(
    CommandManager,
    PaneManager,
    SelectionGestureHandler,
    Workbook,
    CellContentMgr,
    SheetModel,
    PubSub,
    ColHeaderContainer,
    RowHeaderContainer) {

  'use strict';

  describe('Cell Content Manager', function() {
    var sandbox_;

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
    });


    afterEach(function() {
      sandbox_.restore();
    });


    describe('Handling Signals', function() {
      var cellFormat, rootNode;

      beforeEach(function() {
        constructDefaultFormatObject_();
        stubRequiredWorkbookFunctions_();
        initializeRequiredContent_();
      });


      afterEach(function() {
        resetContent_();
      });


      it('should handle qowt:doAction signal by creating strikethrough ' +
          'command and adding it to CommandManager', function() {

        var cmdMgrSpy = sandbox_.stub(CommandManager, 'addCommand');
        cellFormat.action = 'strikethrough';
        cellFormat.context.formatting.strikethrough = {value: true};

        PubSub.publish('qowt:doAction', cellFormat);
        assert(cmdMgrSpy.called, 'ComandManager.addCommand() not called ');

        var containingCmd = cmdMgrSpy.lastCall.args[0];
        // We expect 1 immediate child participating in the compounded command.
        assert.strictEqual(containingCmd.childCount(), 1);
      });


      var resetContent_ = function() {
        CellContentMgr.disable();
        Workbook.reset();
        cellFormat = rootNode = undefined;
      };


      var initializeRequiredContent_ = function() {
        SheetModel.activeSheetIndex = 0;
        rootNode = document.createElement('div');

        Workbook.init();
        CellContentMgr.init();
      };


      var constructDefaultFormatObject_ = function() {
        cellFormat = {
          context: {
            contentType: 'sheetCell',
            fromRowIndex: 1,
            fromColIndex: 2,
            toRowIndex: 3,
            toColIndex: 4,
            anchor: {rowIdx: 1, colIdx: 2},
            formatting: {}
          }
        };
      };


      var stubRequiredWorkbookFunctions_ = function() {

        sandbox_.stub(Workbook, 'init', function() {
          ColHeaderContainer.init();
          RowHeaderContainer.init();
          PaneManager.init(rootNode);
        });

        sandbox_.stub(Workbook, 'getRow', function(y) {
          return PaneManager.getMainPane().getRow(y);
        });

        sandbox_.stub(Workbook, 'reset', function() {
          ColHeaderContainer.destroy();
          RowHeaderContainer.destroy();
          PaneManager.reset();
          // PaneManager init initializes SelectionGestureHandler unfortunately
          // PaneManager reset cannot reset SelectionGestureHandler so we have
          // to do it on our own to avoid subscriber pollution while running
          // Karma tests.
          SelectionGestureHandler.reset();
        });
      };
    });
  });
});
