define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/selectionGestureHandler',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/rowHeaderContainer'
], function(
    PaneManager,
    SelectionGestureHandler,
    SheetModel,
    PubSub,
    SheetSelectionManager,
    ColHeaderContainer,
    RowHeaderContainer) {

  'use strict';


  describe('Pane Manager layout control', function() {
    var sandbox_;

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
      SheetModel.activeSheetIndex = 0;
      SheetSelectionManager.init();
    });


    afterEach(function() {
      SheetSelectionManager.disable();
      SheetModel.activeSheetIndex = undefined;
      PaneManager.setFrozenRowIndex();
      PaneManager.setFrozenColumnIndex();
      sandbox_.restore();

    });


    describe('updateActivePaneIdx() ', function() {

      var frozenRowIdx = 5;
      var frozenColIdx = 6;

      beforeEach(function() {
        PaneManager.setFrozenRowIndex(frozenRowIdx);
        PaneManager.setFrozenColumnIndex(frozenColIdx);
        sandbox_.stub(PaneManager, 'isFrozen', function() {
          return true;
        });
      });


      afterEach(function() {
        frozenRowIdx = 5;
        frozenColIdx = 6;
      });


      describe('Test when row is frozen', function() {

        beforeEach(function() {
          PaneManager.setFrozenColumnIndex(0);
          frozenColIdx = 0;
        });


        it('should set bottom right pane as active pane for selections having' +
            'row index greater than the rowIdx of frozen row', function() {

          publishSelection_(frozenRowIdx + 1, frozenColIdx);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_right');

          publishSelection_(frozenRowIdx + 1, frozenColIdx + 10);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_right');
       });


        it('should set top right pane as active pane for selections having' +
            'row index lesser than the rowIdx of frozen row', function() {

          publishSelection_(frozenRowIdx - 1, frozenColIdx);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'top_right');

          publishSelection_(frozenRowIdx - 1, frozenColIdx + 10);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'top_right');
        });
      });


      describe('Test when column is frozen', function() {

        beforeEach(function() {
          PaneManager.setFrozenRowIndex(0);
          frozenRowIdx = 0;
        });


        it('should set bottom right pane as active pane for selections having' +
            'colIdx greater than the colIdx of frozen column', function() {

          publishSelection_(frozenRowIdx, frozenColIdx + 1);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_right');

          publishSelection_(frozenRowIdx + 10, frozenColIdx + 1);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_right');
        });


        it('should set bottom left pane as active pane for selections having' +
            'colIdx lesser than the colIdx of frozen column', function() {

          publishSelection_(frozenRowIdx, frozenColIdx - 1);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_left');

          publishSelection_(frozenRowIdx + 10, frozenColIdx - 1);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_left');
        });
      });


      describe('Test when cell is frozen', function() {

        it('should set bottom right pane as active pane for selections having' +
            ' rowIdx & colIdx greater than or equal to the rowIdx & colIdx of' +
            ' frozen cell', function() {

          publishSelection_(frozenRowIdx, frozenColIdx);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_right');

          publishSelection_(frozenRowIdx + 10, frozenColIdx + 10);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_right');
        });


        it('should set top left pane as active pane for selections having ' +
           'rowIdx & colIdx lesser than the frozen cell', function() {

          publishSelection_(frozenRowIdx - 1, frozenColIdx - 1);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'top_left');

          publishSelection_(0, 0);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'top_left');
        });


        it('should set top right pane as active pane for selections having ' +
           'rowIdx lesser than the rowIdx of frozen cell', function() {

         publishSelection_(frozenRowIdx - 1, frozenColIdx);
         PaneManager.updateActivePaneIdx();
         assert.strictEqual(PaneManager.getActivePaneName(), 'top_right');

         publishSelection_(0, frozenColIdx);
         PaneManager.updateActivePaneIdx();
         assert.strictEqual(PaneManager.getActivePaneName(), 'top_right');
        });


        it('should set bottom left pane as active pane for selections having ' +
           'colIdx lesser than the colIdx of frozen cell', function() {

          publishSelection_(frozenRowIdx, frozenColIdx - 1);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_left');

          publishSelection_(frozenRowIdx, 0);
          PaneManager.updateActivePaneIdx();
          assert.strictEqual(PaneManager.getActivePaneName(), 'bottom_left');
        });
      });


      var publishSelection_ = function(rowIdx, colIdx) {
        var selection = {
          anchor: {rowIdx: rowIdx, colIdx: colIdx},
          topLeft: {rowIdx: rowIdx, colIdx: colIdx},
          bottomRight: {rowIdx: rowIdx, colIdx: colIdx},
          contentType: 'sheetCell'
        };
        PubSub.publish('qowt:sheet:requestFocus', selection);
      };
    });


    describe('Optimistic formatting of inline editor', function() {
      var leftPaneSpy, rightPaneSpy, bottomPaneSpy, mainPaneSpy;
      var rootNode;


      beforeEach(function() {

        rootNode = document.createElement('div');
        ColHeaderContainer.init();
        RowHeaderContainer.init();
        PaneManager.init(rootNode);

        leftPaneSpy = sandbox_.stub(PaneManager.getTopLeftPane(),
            'setCellStrikethroughOptimistically');
        rightPaneSpy = sandbox_.stub(PaneManager.getTopRightPane(),
            'setCellStrikethroughOptimistically');
        bottomPaneSpy = sandbox_.stub(PaneManager.getBottomLeftPane(),
            'setCellStrikethroughOptimistically');
        mainPaneSpy = sandbox_.stub(PaneManager.getMainPane(),
            'setCellStrikethroughOptimistically');
      });


      afterEach(function() {
        PaneManager.reset();
        // PaneManager init initializes SelectionGestureHandler unfortunately
        // PaneManager reset cannot reset SelectionGestureHandler so we have to
        // do it on our own to avoid subscriber pollution while running Karma
        // tests.
        SelectionGestureHandler.reset();
        rootNode = undefined;
        sandbox_.restore();
      });


      it('should instruct all 4 panes to set strikethrough optimistically' +
          ' when strikethrough option is true', function() {

        var isStrikethrough = true;
        PaneManager.setCellStrikethroughOptimistically(isStrikethrough);

        assert(leftPaneSpy.calledWith(isStrikethrough));
        assert(rightPaneSpy.calledWith(isStrikethrough));
        assert(bottomPaneSpy.calledWith(isStrikethrough));
        assert(mainPaneSpy.calledWith(isStrikethrough));
      });


      it('should instruct all 4 panes to unset strikethrough optimistically' +
          ' when strikethrough option is false', function() {

        var isStrikethrough = false;
        PaneManager.setCellStrikethroughOptimistically(isStrikethrough);

        assert(leftPaneSpy.calledWith(isStrikethrough));
        assert(rightPaneSpy.calledWith(isStrikethrough));
        assert(bottomPaneSpy.calledWith(isStrikethrough));
        assert(mainPaneSpy.calledWith(isStrikethrough));
      });
    });


    /** There is a TODO from Jelte for PaneManager.reset on which action is
        pending. Until we adddress that we should avoid removing listeners or
        unsubscribing @ PaneManager.reset as it leads to uncanny behaviours
        and regressions.
        This unit test is just an attempt to restrict such scenario's.
    */
    describe('Things that PaneManager.reset should not do presently',
        function() {

          beforeEach(function() {
            var rootNode = document.createElement('div');
            ColHeaderContainer.init();
            RowHeaderContainer.init();
            PaneManager.init(rootNode);
          });

          afterEach(function() {
            PaneManager.reset();
            SelectionGestureHandler.reset();
            sandbox_.restore();
          });


          it('should not reset SelectionGestureHandler', function() {
            var spy = sandbox_.spy(SelectionGestureHandler, 'reset');
            PaneManager.reset();
            assert(spy.notCalled);
          });
    });
  });
});
