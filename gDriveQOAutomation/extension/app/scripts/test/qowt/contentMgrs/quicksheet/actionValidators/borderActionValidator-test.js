define([
  'qowtRoot/contentMgrs/quicksheet/actionValidators/borderActionValidator',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/models/sheet',
  'qowtRoot/widgets/grid/row'
], function(
    BorderActionValidator,
    PaneManager,
    Workbook,
    SheetModel,
    Row) {

  'use strict';

  describe('Sheet: borderActionValidator', function() {
    var sandbox;
    var borderStyleInfo = {
      info: {
        borderStyle: 'thin',
        borderColor: '#000000'
      }
    };

    var singleCellInfo = {
      fromColIndex: 3,
      toColIndex: 3,
      fromRowIndex: 3,
      toRowIndex: 3,
      formatting: {
        borders: {}
      }
    };

    var mergeCellInfo = {
      fromColIndex: 3,
      toColIndex: 5,
      fromRowIndex: 3,
      toRowIndex: 6,
      formatting: {
        borders: {}
      }
    };

    var singleRowInfo = {
      fromRowIndex: 3,
      toRowIndex: 3,
      formatting: {
        borders: {}
      }
    };

    var singleColumnInfo = {
      fromColIndex: 4,
      toColIndex: 4,
      formatting: {
        borders: {}
      }
    };

    var cellRangeInfo = {
      fromColIndex: 2,
      toColIndex: 6,
      fromRowIndex: 1,
      toRowIndex: 5,
      formatting: {
        borders: {}
      }
    };

    beforeEach(function() {
      SheetModel.activeSheetIndex = 1;
      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
      sandbox.restore();
    });

    it('should invalidate the action of applying \'vertical borders\' on a ' +
      'single cell', function() {
      stubGetRow(false);
      var borderInfo = singleCellInfo;
      borderInfo.formatting.borders = {
        insideVertical: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isFalse(valid, 'Vertical borders can\'t be applied on a cell');
    });


    it('should invalidate the action of applying \'horizontal borders\' on a ' +
      'single cell', function() {
      stubGetRow(false);
      var borderInfo = singleCellInfo;
      borderInfo.formatting.borders = {
        insideHorizontal: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isFalse(valid, 'Horizontal borders can\'t be applied on a cell');
    });


    it('should invalidate the action of applying \'inner borders\' on a ' +
      'single cell', function() {
      stubGetRow(false);
      var borderInfo = singleCellInfo;
      borderInfo.formatting.borders = {
        insideHorizontal: borderStyleInfo.info,
        insideVertical: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isFalse(valid, 'Inner borders can\'t be applied on a cell');
    });


    it('should invalidate the action of applying \'vertical borders\' on a ' +
      'merge cell', function() {
      stubGetRow(true);
      stubPaneManager();
      var borderInfo = mergeCellInfo;
      borderInfo.formatting.borders = {
        insideVertical: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isFalse(valid, 'vertical borders can\'t be applied on a merge ' +
        'cell');
    });


    it('should invalidate the action of applying \'horizontal borders\' on a ' +
      'merge cell', function() {
      stubGetRow(true);
      stubPaneManager();
      var borderInfo = mergeCellInfo;
      borderInfo.formatting.borders = {
        insideHorizontal: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isFalse(valid, 'horizontal borders can\'t be applied on a merge ' +
        'cell');
    });


    it('should invalidate the action of applying \'inner borders\' on a ' +
      'merge cell', function() {
      stubGetRow(true);
      stubPaneManager();
      var borderInfo = mergeCellInfo;
      borderInfo.formatting.borders = {
        insideHorizontal: borderStyleInfo.info,
        insideVertical: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isFalse(valid, 'inner borders can\'t be applied on a merge ' +
        'cell');
    });


    it('should invalidate the action of applying \'horizontal borders\' on a ' +
      'single row', function() {
      sandbox.stub(Workbook, 'getNumOfCols', function() {
        return 10;
      });
      stubGetRow(false);
      var borderInfo = singleRowInfo;
      borderInfo.formatting.borders = {
        insideHorizontal: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isFalse(valid, 'horizontal borders can\'t be applied on a row');
    });


    it('should validate the action of applying \'vertical borders\' on a ' +
      'single row', function() {
      sandbox.stub(Workbook, 'getNumOfCols', function() {
        return 10;
      });
      stubGetRow(false);
      var borderInfo = singleRowInfo;
      borderInfo.formatting.borders = {
        insideVertical: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isTrue(valid, 'vertical borders can be applied on a row');
    });


    it('should invalidate the action of applying \'vertical borders\' on a ' +
      'single column', function() {
      sandbox.stub(Workbook, 'getNumOfRows', function() {
        return 10;
      });
      stubGetRow(false);
      var borderInfo = singleColumnInfo;
      borderInfo.formatting.borders = {
        insideVertical: borderStyleInfo.info
      };

      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isFalse(valid, 'vertical borders can\'t be applied on a column');
    });


    it('should validate the action of applying \'horizontal borders\' on a ' +
      'single column', function() {
      sandbox.stub(Workbook, 'getNumOfRows', function() {
        return 10;
      });
      stubGetRow(false);
      var borderInfo = singleColumnInfo;
      borderInfo.formatting.borders = {
        insideHorizontal: borderStyleInfo.info
      };

      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isTrue(valid, 'horizontal borders can be applied on a column');
    });


    it('should validate the action of applying \'inner borders \' on a cell ' +
      'range containing merge cell as the leftmost top cell', function() {
      stubGetRow(true);
      stubPaneManager();
      var borderInfo = cellRangeInfo;
      borderInfo.formatting.borders = {
        insideHorizontal: borderStyleInfo.info,
        insideVertical: borderStyleInfo.info
      };
      var valid = BorderActionValidator.isValidAction(borderInfo);
      assert.isTrue(valid, 'inner borders can be applied to a cell range ' +
        'containing merge cell as the leftmost top cell');
    });


    function stubGetRow(mergeCellStatus) {
      sandbox.stub(Workbook, 'getRow', function(rowIdx) {
        var row = Row.create(rowIdx, 3, 10);
        sandbox.stub(row, 'getCell', function() {
          var obj = Object.create(Object.prototype);
          obj.config_ = { isMergeAnchor: mergeCellStatus};
          return obj;
        });
        return row;
      });
    }


    function stubPaneManager() {
      sandbox.stub(PaneManager, 'getMainPane', function() {
        return {
          getFloaterManager: function() {
            return {
              findContainingFloater: function() {
                return {
                  rowSpan: function() {
                    return 4;
                  },
                  colSpan: function() {
                    return 3;
                  },
                  getType: function() {
                    return 'sheetFloaterMergeCell';
                  }
                };
              }
            };
          }
        };
      });
    }
  });
});
