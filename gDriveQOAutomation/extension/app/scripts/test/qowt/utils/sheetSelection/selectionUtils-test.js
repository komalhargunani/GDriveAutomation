define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/models/sheet',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/utils/sheetSelection/selectionUtils'
], function(
    PaneManager,
    SheetModel,
    SheetSelectionManager,
    SelectionUtils) {

  'use strict';

  describe('Test selectionUtils.js', function() {
    var sandbox_, selObj_;

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
      selObj_ = {
        anchor: {rowIdx: 1, colIdx: 2},
        topLeft: {rowIdx: 1, colIdx: 2},
        bottomRight: {rowIdx: 1, colIdx: 2},
        contentType: 'sheetCell'
      };

      SheetModel.activeSheetIndex = 0;
      sandbox_.stub(SheetSelectionManager, 'getCurrentSelection',
          function() {
            return selObj_;
          });
    });


    afterEach(function() {
      sandbox_.restore();
      selObj_ = undefined;
    });


    describe('Test isSelectionARange()', function() {

      it('should return true if entire sheet is selected', function() {
        sandbox_.stub(PaneManager, 'isEntireSheetSelected').returns(true);
        assert.isTrue(SelectionUtils.isSelectionARange());
      });


      it('should return true if one or more rows are selected', function() {
        sandbox_.stub(PaneManager, 'isOneOrMoreRowsSelected').returns(true);
        assert.isTrue(SelectionUtils.isSelectionARange());
      });


      it('should return true if one or more columns are selected', function() {
        sandbox_.stub(PaneManager, 'isOneOrMoreRowsSelected').returns(true);
        assert.isTrue(SelectionUtils.isSelectionARange());
      });


      it('should return true if multiple cells are selected', function() {
        selObj_.bottomRight = {rowIdx: 5, colIdx: 7};
        assert.isTrue(SelectionUtils.isSelectionARange(selObj_));
      });


      it('should return false if a single cell is selected', function() {
        assert.isFalse(SelectionUtils.isSelectionARange(selObj_));
      });
    });


    describe('Test isSelectionMerged()', function() {
      var pane = {
        floaterManager_: 'will be overridden in respective describe',
        getFloaterManager: function() {return pane.floaterManager_;},
        getNumOfCols: function() {return 255;},
        getNumOfRows: function() {return 299;}
      };

      beforeEach(function() {
        sandbox_.stub(PaneManager, 'getMainPane', function() {return pane;});
      });

      describe('Test Truthy', function() {
        beforeEach(function() {
          pane.floaterManager_ = {isRangeMerged: function() {return true;}};
        });


        it('should return true if entire sheet is selected and is merged',
            function() {
              sandbox_.stub(PaneManager, 'isEntireSheetSelected').returns(true);
              assert.isTrue(SelectionUtils.isSelectionMerged());
            });


        it('should return true if one or more rows are selected and are' +
            ' merged', function() {
              sandbox_.stub(PaneManager, 'isOneOrMoreRowsSelected').
                  returns(true);
              assert.isTrue(SelectionUtils.isSelectionMerged());
            });


        it('should return true if one or more columns are selected and are' +
            ' merged', function() {
              sandbox_.stub(PaneManager, 'isOneOrMoreColumnsSelected').
                  returns(true);
              assert.isTrue(SelectionUtils.isSelectionMerged());
            });


        it('should return true if a range of cells is selected and the range' +
            ' is merged', function() {
              assert.isTrue(SelectionUtils.isSelectionMerged());
            });
      });


      describe('Test Falsy', function() {
        beforeEach(function() {
          pane.floaterManager_ = {isRangeMerged: function() {return false;}};
        });


        it('should return false if entire sheet is selected and the sheet' +
            ' is not merged', function() {
              sandbox_.stub(PaneManager, 'isEntireSheetSelected').returns(true);
              assert.isFalse(SelectionUtils.isSelectionMerged());
            });


        it('should return false if one or more rows are selected but they' +
            ' are not merged', function() {
              sandbox_.stub(PaneManager, 'isOneOrMoreRowsSelected').
                  returns(true);
              assert.isFalse(SelectionUtils.isSelectionMerged());
            });


        it('should return false if one or more columns are selected but they' +
            ' are not merged', function() {
              sandbox_.stub(PaneManager, 'isOneOrMoreColumnsSelected').
                  returns(true);
              assert.isFalse(SelectionUtils.isSelectionMerged());
            });


        it('should return false if a range of cells are selected but the' +
            ' range is not merged', function() {
              assert.isFalse(SelectionUtils.isSelectionMerged());
            });
      });
    });
  });
});
