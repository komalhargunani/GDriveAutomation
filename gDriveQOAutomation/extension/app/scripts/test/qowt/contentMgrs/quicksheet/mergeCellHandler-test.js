define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/contentMgrs/quicksheet/contentMgrHelper/mergeCellHandler',
  'qowtRoot/models/sheet',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/sheetSelection/selectionUtils',
  'qowtRoot/widgets/ui/modalDialog'

], function(
    CommandManager,
    PaneManager,
    MergeCellHandler,
    SheetModel,
    I18n,
    SheetSelectionUtils,
    ModalDialog) {

  'use strict';

  describe('MergeCellHandler.js', function() {

    SheetModel.activeSheetIndex = 0;

    var cellRangeObj, singleCellObj, singleRowObj, singleColumnObj,
        multipleColumnsObj, multipleRowsObj,
        entireSheetObj;

    // cell object
    cellRangeObj = {
      'context': {
        'contentType': 'sheetCell',
        'fromRowIndex': 1,
        'fromColIndex': 2,
        'toRowIndex': 3,
        'toColIndex': 4,
        'anchor': {
          'rowIdx': 1,
          'colIdx': 2
        }
      }
    };

    singleCellObj = {
      'context': {
        'contentType': 'sheetCell',
        'fromRowIndex': 1,
        'fromColIndex': 2,
        'toRowIndex': 1,
        'toColIndex': 2,
        'anchor': {
          'rowIdx': 1,
          'colIdx': 2
        }
      }
    };

    singleRowObj = {
      'context': {
        'contentType': 'sheetCell',
        'fromRowIndex': 0,
        'fromColIndex': undefined,
        'toRowIndex': 0,
        'toColIndex': undefined,
        'anchor': {
          'rowIdx': 0,
          'colIdx': 1
        }
      }
    };

    singleColumnObj = {
      'context': {
        'contentType': 'sheetCell',
        'fromRowIndex': undefined,
        'fromColIndex': 0,
        'toRowIndex': undefined,
        'toColIndex': 0,
        'anchor': {
          'rowIdx': 5,
          'colIdx': 0
        }
      }
    };

    multipleColumnsObj = {
      'context': {
        'contentType': 'sheetCell',
        'fromRowIndex': undefined,
        'fromColIndex': 2,
        'toRowIndex': undefined,
        'toColIndex': 4,
        'anchor': {
          'rowIdx': 4,
          'colIdx': 2
        }
      }
    };

    multipleRowsObj = {
      'context': {
        'contentType': 'sheetCell',
        'fromRowIndex': 3,
        'fromColIndex': undefined,
        'toRowIndex': 5,
        'toColIndex': undefined,
        'anchor': {
          'rowIdx': 4,
          'colIdx': 2
        }
      }
    };

    entireSheetObj = {
      'context': {
        'contentType': 'sheetCell',
        'fromRowIndex': undefined,
        'fromColIndex': undefined,
        'toRowIndex': undefined,
        'toColIndex': undefined,
        'anchor': {
          'rowIdx': 4,
          'colIdx': 2
        }
      }
    };

    var stubbedPane = {
      getRow: function() {
        return {
          getCell: function() {
          }
        };
      },

      getFloaterManager: function() {
        return {
          getFloatersInRange: function() {
          }
        };
      },

      getNumOfCols: function() {
        return 255;
      },

      getNumOfRows: function() {
        return 299;
      }
    };

    describe('handling command creation for mergeAll, mergeVertically, ' +
        'mergeHorizontally and unmerge actions with single cell, row or ' +
        'column and with cell range.', function() {
      var sandbox_;
      beforeEach(function() {
        sandbox_ = sinon.sandbox.create();
        sandbox_.spy(CommandManager, 'addCommand');

        sandbox_.stub(PaneManager, 'getMainPane', function() {
          return stubbedPane;
        });
      });

      afterEach(function() {
        sandbox_.restore();
      });

      describe('Should create a command for a valid range', function() {
        beforeEach(function() {
          sandbox_.stub(SheetSelectionUtils, 'isSelectionARange').returns(true);
        });

        it('should create command for mergeAll action', function() {
          cellRangeObj.action = 'mergeAll';
          MergeCellHandler.handleMergeCellAction(cellRangeObj);
          verifyMergeCellCmd();
        });

        it('should create command for mergeVertically action', function() {
          cellRangeObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(cellRangeObj);
          verifyMergeCellCmd();
        });

        it('should create command for mergeHorizontally action', function() {
          cellRangeObj.action = 'mergeHorizontally';
          MergeCellHandler.handleMergeCellAction(cellRangeObj);
          verifyMergeCellCmd();
        });
      });

      describe('should not create command if one cell is selected', function() {
        beforeEach(function() {
          sandbox_.stub(SheetSelectionUtils, 'isSelectionARange').
              returns(false);
        });

        it('should NOT create command for mergeAll action', function() {
          singleCellObj.action = 'mergeAll';
          MergeCellHandler.handleMergeCellAction(singleCellObj);
          assert.isFalse(CommandManager.addCommand.called);
        });

        it('should NOT create command for mergeVertically action', function() {
          singleCellObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(singleCellObj);
          assert.isFalse(CommandManager.addCommand.called);
        });

        it('should NOT create command for mergeHorizontally action',
            function() {
              singleCellObj.action = 'mergeHorizontally';
              MergeCellHandler.handleMergeCellAction(singleCellObj);
              assert.isFalse(CommandManager.addCommand.called);
            });

        it('should NOT create command for unmerge action', function() {
          singleCellObj.action = 'unmerge';
          MergeCellHandler.handleMergeCellAction(singleCellObj);
          assert.isFalse(CommandManager.addCommand.called);
        });
      });

      describe('should create command if single row is selected', function() {
        beforeEach(function() {
          sandbox_.stub(SheetSelectionUtils, 'isSelectionARange').returns(true);
        });

        it('should create command for mergeAll action', function() {
          singleRowObj.action = 'mergeAll';
          MergeCellHandler.handleMergeCellAction(singleRowObj);
          verifyMergeCellCmd();
        });

        it('should NOT create command for mergeVertically action', function() {
          singleRowObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(singleRowObj);
          assert.isFalse(CommandManager.addCommand.called);
        });

        it('should create command for mergeHorizontally action', function() {
          singleRowObj.action = 'mergeHorizontally';
          MergeCellHandler.handleMergeCellAction(singleRowObj);
          verifyMergeCellCmd();
        });
      });

      describe('should create command if single col is selected', function() {
        beforeEach(function() {
          sandbox_.stub(SheetSelectionUtils, 'isSelectionARange').returns(true);
        });

        it('should create command for mergeAll action', function() {
          singleColumnObj.action = 'mergeAll';
          MergeCellHandler.handleMergeCellAction(singleColumnObj);
          verifyMergeCellCmd();
        });

        it('should create command for mergeVertically action', function() {
          singleColumnObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(singleColumnObj);
          verifyMergeCellCmd();
        });

        it('should NOT create command for mergeHorizontally action',
            function() {
              singleColumnObj.action = 'mergeHorizontally';
              MergeCellHandler.handleMergeCellAction(singleColumnObj);
              assert.isFalse(CommandManager.addCommand.called);
            });
      });
    });

    describe('handling partial merge cell selection error modal dialog for ' +
        'mergeAll, mergeVertically, mergeHorizontally and unmerge actions ' +
        'with column and row.', function() {
      var sandbox_, infoModalDialog;
      beforeEach(function() {
        sandbox_ = sinon.sandbox.create();
        sandbox_.spy(CommandManager, 'addCommand');
        sandbox_.stub(SheetSelectionUtils, 'isSelectionARange').returns(true);
        infoModalDialog = sandbox_.stub(ModalDialog, 'info', function() {
          return {
            addDialogClass: function() {
            }
          };
        });
        stubbedPane.getFloaterManager = function() {
          return {
            getFloatersInRange: function() {
              return [
                {
                  isCompletelyInSelection: function() {
                    return false;
                  }
                }
              ];
            }
          };
        };

        sandbox_.stub(PaneManager, 'getMainPane', function() {
          return stubbedPane;
        });
      });

      afterEach(function() {
        sandbox_.restore();
        infoModalDialog = undefined;
      });

      describe('handling dialog when column is selected which contains ' +
          'partial merge cells.', function() {

        // action for merge cell format
        it('should show info modal dialog for "mergeAll" action, if ' +
            'selected column contains partial merged cell.', function() {
          multipleColumnsObj.action = 'mergeAll';
          MergeCellHandler.handleMergeCellAction(multipleColumnsObj);
          verifyModalDlgContentForPartialSelection(infoModalDialog);
        });

        it('should show info modal dialog for "mergeVertically" action, if ' +
            'selected column contains partial merged cell.', function() {
          multipleColumnsObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(multipleColumnsObj);
          verifyModalDlgContentForPartialSelection(infoModalDialog);
        });

        it('should show info modal dialog for "mergeHorizontally" action, ' +
            'if selected column contains partial merged cell.', function() {
          multipleColumnsObj.action = 'mergeHorizontally';
          MergeCellHandler.handleMergeCellAction(multipleColumnsObj);
          verifyModalDlgContentForPartialSelection(infoModalDialog);
        });

        it('should show info modal dialog for "unmerge" action, if ' +
            'selected column contains partial merged cell.', function() {
          multipleColumnsObj.action = 'unmerge';
          MergeCellHandler.handleMergeCellAction(multipleColumnsObj);
          verifyModalDlgContentForPartialSelection(infoModalDialog);
        });
      });

      describe('handling dialog when row is selected which contains partial ' +
          'merge cells.', function() {

        // action for merge cell format
        it('should show info modal dialog for "mergeAll" action, if ' +
            'selected row contains partial merged cell.', function() {
          multipleRowsObj.action = 'mergeAll';
          MergeCellHandler.handleMergeCellAction(multipleRowsObj);
          verifyModalDlgContentForPartialSelection(infoModalDialog);
        });

        it('should show info modal dialog for "mergeVertically" action, if ' +
            'selected row contains partial merged cell.', function() {
          multipleRowsObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(multipleRowsObj);
          verifyModalDlgContentForPartialSelection(infoModalDialog);
        });

        it('should show info modal dialog for "mergeHorizontally" action, if ' +
            'selected row contains partial merged cell.', function() {
          multipleRowsObj.action = 'mergeHorizontally';
          MergeCellHandler.handleMergeCellAction(multipleRowsObj);
          verifyModalDlgContentForPartialSelection(infoModalDialog);
        });

        it('should show info modal dialog for "unmerge" action, if ' +
            'selected row contains partial merged cell.', function() {
          multipleRowsObj.action = 'unmerge';
          MergeCellHandler.handleMergeCellAction(multipleRowsObj);
          verifyModalDlgContentForPartialSelection(infoModalDialog);
        });
      });
    });

    describe('handling error modal dialog for mergeVertically and ' +
        'mergeHorizontally action. When selection contains a mix of ' +
        'vertically & horizontally merged cells. ', function() {
      var sandbox_, infoModalDialog;
      beforeEach(function() {
        sandbox_ = sinon.sandbox.create();
        sandbox_.spy(CommandManager, 'addCommand');
        sandbox_.stub(SheetSelectionUtils, 'isSelectionARange').returns(true);
        infoModalDialog = sandbox_.stub(ModalDialog, 'info', function() {
          return {
            addDialogClass: function() {
            }
          };
        });

        stubbedPane.getFloaterManager = function() {
          return {
            getFloatersInRange: function() {
              return [
                {
                  isCompletelyInSelection: function() {
                    return true;
                  },
                  rowSpan: function() {
                    return 2;
                  },
                  colSpan: function() {
                    return 2;
                  }
                }
              ];
            },
            getAllFloaters: function() {
              return [
                {
                  isCompletelyInSelection: function() {
                    return true;
                  },
                  rowSpan: function() {
                    return 2;
                  },
                  colSpan: function() {
                    return 2;
                  }
                }
              ];
            }
          };
        };

        sandbox_.stub(PaneManager, 'getMainPane', function() {
          return stubbedPane;
        });
      });

      afterEach(function() {
        sandbox_.restore();
        infoModalDialog = undefined;
      });

      describe('handling error modal dialog for mergeVertically action. When ' +
          'non-vertical merged cells exists in the selection(cell range/row/' +
          'column/entire sheet).', function() {


        it('should show info modal dialog for "mergeVertically" action, if ' +
            'selected row contains non-vertically merged cells.', function() {
          multipleRowsObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(multipleRowsObj);
          verifyModalDlgContentForNonVerticalMergedCell(infoModalDialog);
        });

        it('should show info modal dialog for "mergeVertically" action, if ' +
            'selected column contains non-vertically merged cells.',
            function() {
              multipleColumnsObj.action = 'mergeVertically';
              MergeCellHandler.handleMergeCellAction(multipleColumnsObj);
              verifyModalDlgContentForNonVerticalMergedCell(infoModalDialog);
            });

        it('should show info modal dialog for "mergeVertically" action, if ' +
            'selected range contains non-vertically merged cells.', function() {
          cellRangeObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(cellRangeObj);
          verifyModalDlgContentForNonVerticalMergedCell(infoModalDialog);
        });

        it('should show info modal dialog for "mergeVertically" action, if ' +
            'entire sheet is selected which contains non-vertically merged ' +
            'cells.', function() {
          entireSheetObj.action = 'mergeVertically';
          MergeCellHandler.handleMergeCellAction(entireSheetObj);
          verifyModalDlgContentForNonVerticalMergedCell(infoModalDialog);
        });
      });

      describe('handling error modal dialog for mergeHorizontally action. ' +
          'When non-horizontal merged cells exists in the selection' +
          '(cell range/row/column/entire sheet).', function() {

        it('should show info modal dialog for "mergeHorizontally" action, if ' +
            'selected row contains non-horizontally merged cells.', function() {
          multipleRowsObj.action = 'mergeHorizontally';
          MergeCellHandler.handleMergeCellAction(multipleRowsObj);
          verifyModalDlgContentForNonHorizontalMergedCell(infoModalDialog);
        });

        it('should show info modal dialog for "mergeHorizontally" action, if ' +
            'selected column contains non-horizontally merged cells.',
            function() {
              multipleColumnsObj.action = 'mergeHorizontally';
              MergeCellHandler.handleMergeCellAction(multipleColumnsObj);
              verifyModalDlgContentForNonHorizontalMergedCell(infoModalDialog);
            });

        it('should show info modal dialog for "mergeHorizontally" action, if ' +
            'selected range contains non-horizontally merged cells.',
            function() {
              cellRangeObj.action = 'mergeHorizontally';
              MergeCellHandler.handleMergeCellAction(cellRangeObj);
              verifyModalDlgContentForNonHorizontalMergedCell(infoModalDialog);
            });

        it('should show info modal dialog for "mergeHorizontally" action, if ' +
            'entire sheet is selected which contains non-horizontally merged ' +
            'cells.', function() {
          entireSheetObj.action = 'mergeHorizontally';
          MergeCellHandler.handleMergeCellAction(entireSheetObj);
          verifyModalDlgContentForNonHorizontalMergedCell(infoModalDialog);
        });
      });
    });

    function verifyModalDlgContentForPartialSelection(infoDialog) {
      assert.isTrue(infoDialog.called);
      var infoArgs = infoDialog.args;
      var title = I18n.getMessage('title_error_msg_for_merge_cells');
      var content = I18n.getMessage(
          'content_msg_merging_partially_selected_merged_cells');
      assert.strictEqual(infoArgs[0][0], title);
      assert.strictEqual(infoArgs[0][1], content);
      assert.isFalse(CommandManager.addCommand.called);
    }

    function verifyModalDlgContentForNonVerticalMergedCell(infoDialog) {
      assert.isTrue(infoDialog.called);
      var infoArgs = infoDialog.args;
      var title = I18n.getMessage('title_error_msg_for_merge_cells');
      var content = I18n.getMessage(
          'content_msg_merging_vertically_across_horizontal_section');
      assert.strictEqual(infoArgs[0][0], title);
      assert.strictEqual(infoArgs[0][1], content);
      assert.isFalse(CommandManager.addCommand.called);
    }

    function verifyModalDlgContentForNonHorizontalMergedCell(infoDialog) {
      assert.isTrue(infoDialog.called);
      var infoArgs = infoDialog.args;
      var title = I18n.getMessage('title_error_msg_for_merge_cells');
      var content = I18n.getMessage(
          'content_msg_merging_horizontally_across_vertical_section');
      assert.strictEqual(infoArgs[0][0], title);
      assert.strictEqual(infoArgs[0][1], content);
      assert.isFalse(CommandManager.addCommand.called);
    }

    function verifyMergeCellCmd() {
      assert.isTrue(CommandManager.addCommand.called);
      var containingCmd = CommandManager.addCommand.firstCall.args[0];
      // We expect 1 immediate children participating in this compound
      // command.
      assert.strictEqual(containingCmd.childCount(), 1);
      var childCmds = containingCmd.getChildren();
      assert.strictEqual(childCmds[0].name, 'setMergeCell');
    }
  });
});