define([
  'qowtRoot/commands/quicksheet/setMergeCell',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet'
], function(
    SetMergeCell,
    SheetModel,
    SheetConfig) {

  'use strict';

  describe('Sheet; SetMergeCell command', function() {
    beforeEach(function() {
      SheetModel.activeSheetIndex = 1;
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
    });

    describe('Invalid creation', function() {
      it('constructor should throw error if fromColumnIndex is not given ' +
          'as an argument', function() {
        assert.throws(function() {
          var fromColIndex;
          var toColIndex = 2;
          var rowIndex = 2;
          var mergeOption = 'mergeAll';
          SetMergeCell.create(rowIndex, fromColIndex, rowIndex, toColIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell: either the rows or columns need to ' +
            'be defined.');
      });

      it('constructor should throw error if toColumnIndex is not given ' +
          'as an argument', function() {
        assert.throws(function() {
          var fromColIndex = 2;
          var toColIndex;
          var rowIndex = 2;
          var mergeOption = 'mergeAll';
          SetMergeCell.create(rowIndex, fromColIndex, rowIndex, toColIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell: either the rows or columns need to ' +
            'be defined.');
      });

      it('constructor should throw error if fromRowIndex is not given as an ' +
          'argument', function() {
        assert.throws(function() {
          var colIndex = 3;
          var fromRowIndex;
          var toRowIndex = 2;
          var mergeOption = 'mergeAll';
          SetMergeCell.create(fromRowIndex, colIndex, toRowIndex, colIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell: either the rows or columns need to be ' +
            'defined.');
      });

      it('constructor should throw error if toRowIndex is not given as an ' +
          'argument', function() {
        assert.throws(function() {
          var colIndex = 3;
          var fromRowIndex = 2;
          var toRowIndex;
          var mergeOption = 'mergeAll';
          SetMergeCell.create(fromRowIndex, colIndex, toRowIndex, colIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell: either the rows or columns need to be ' +
            'defined.');
      });

      it('constructor should throw error if merge-option is not given as an ' +
          'argument', function() {
        assert.throws(function() {
          var colIndex = 2;
          var rowIndex = 3;
          var mergeOption;
          SetMergeCell.create(rowIndex, colIndex, rowIndex, colIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell requires a mergeOption.');
      });

      it('constructor should throw error if fromRowIndex is greater than ' +
          'toRowIndex', function() {
        assert.throws(function() {
          var colIndex = 3;
          var fromRowIndex = 4;
          var toRowIndex = 1;
          var mergeOption = 'mergeAll';
          SetMergeCell.create(fromRowIndex, colIndex, toRowIndex, colIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell: fromIndex must be less than or equal to ' +
            'toIndex.');
      });

      it('constructor should throw error if fromColIndex is greater than ' +
          'toColIndex', function() {
        assert.throws(function() {
          var rowIndex = 3;
          var fromColIndex = 4;
          var toColIndex = 1;
          var mergeOption = 'mergeAll';
          SetMergeCell.create(rowIndex, fromColIndex, rowIndex, toColIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell: fromIndex must be less than or equal to ' +
            'toIndex.');
      });

      it('constructor should throw error if fromColIndex is 1 and toColIndex' +
          ' is 0', function() {
        assert.throws(function() {
          var rowIndex = 3;
          var fromColIndex = 1;
          var toColIndex = 0;
          var mergeOption = 'mergeAll';
          SetMergeCell.create(rowIndex, fromColIndex, rowIndex, toColIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell: fromIndex must be less than or equal to ' +
            'toIndex.');
      });

      it('constructor should throw error if fromRowIndex is 1 and toRowIndex ' +
          'is 0', function() {
        assert.throws(function() {
          var colIndex = 3;
          var fromRowIndex = 1;
          var toRowIndex = 0;
          var mergeOption = 'mergeAll';
          SetMergeCell.create(fromRowIndex, colIndex, toRowIndex, colIndex,
              mergeOption);
        }, 'ERROR: SetMergeCell: fromIndex must be less than or equal to ' +
            'toIndex.');
      });

      describe('valid construction of command with single row and multiple ' +
          'columns', function() {
        var _fromColIndex = 2, _toColIndex = 4;
        var _rowIndex = 3;

        var _checkCommand = function(cmd, mergeOption) {
          assert.isDefined(cmd, 'setMergeCell command has been defined');
          assert.strictEqual(cmd.name, 'setMergeCell', 'Command name');
          assert.isDefined(cmd.id(), 'setMergeCell command id has been ' +
              'defined');
          assert.isTrue(cmd.callsService(), 'setMergeCell.callsService()');
          assert.isDefined(cmd.onFailure, 'setMergeCell.onFailure()');
          assert.isDefined(cmd.onSuccess, 'setMergeCell.onSuccess()');
          assert.strictEqual(cmd.dcpData().name, 'setMergeCell');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, _rowIndex);
          assert.strictEqual(cmd.dcpData().c1, _fromColIndex);
          assert.strictEqual(cmd.dcpData().r2, _rowIndex);
          assert.strictEqual(cmd.dcpData().c2, _toColIndex);
          assert.strictEqual(cmd.dcpData().option, mergeOption);
          assert.strictEqual(cmd.dcpData().bs,
              SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for mergeAll option if ' +
            'valid parameters are specified', function() {
          var _mergeOption = 'mergeAll';
          var cmd = SetMergeCell.create(_rowIndex, _fromColIndex, _rowIndex,
              _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeHorizontally option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeHorizontally';
          var cmd = SetMergeCell.create(_rowIndex, _fromColIndex, _rowIndex,
              _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for unmerge option if valid' +
            ' parameters are specified', function() {
          var _mergeOption = 'unmerge';
          var cmd = SetMergeCell.create(_rowIndex, _fromColIndex, _rowIndex,
              _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });
      });

      describe('valid construction of command with single column and ' +
          'multiple rows', function() {
        var _colIndex = 2;
        var _fromRowIndex = 3, _toRowIndex = 7;

        var _checkCommand = function(cmd, mergeOption) {
          assert.isDefined(cmd, 'setMergeCell command has been defined');
          assert.strictEqual(cmd.name, 'setMergeCell', 'Command name');
          assert.isDefined(cmd.id(), 'setMergeCell command id has been ' +
              'defined');
          assert.isTrue(cmd.callsService(), 'setMergeCell.callsService()');
          assert.isDefined(cmd.onFailure, 'setMergeCell.onFailure()');
          assert.isDefined(cmd.onSuccess, 'setMergeCell.onSuccess()');
          assert.strictEqual(cmd.dcpData().name, 'setMergeCell');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, _fromRowIndex);
          assert.strictEqual(cmd.dcpData().c1, _colIndex);
          assert.strictEqual(cmd.dcpData().r2, _toRowIndex);
          assert.strictEqual(cmd.dcpData().c2, _colIndex);
          assert.strictEqual(cmd.dcpData().option, mergeOption);
          assert.strictEqual(cmd.dcpData().bs,
              SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for mergeAll option if ' +
            'valid parameters are specified', function() {
          var _mergeOption = 'mergeAll';
          var cmd = SetMergeCell.create(_fromRowIndex, _colIndex, _toRowIndex,
              _colIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeVertically option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeVertically';
          var cmd = SetMergeCell.create(_fromRowIndex, _colIndex, _toRowIndex,
              _colIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for unmerge option if valid' +
            ' parameters are specified', function() {
          var _mergeOption = 'unmerge';
          var cmd = SetMergeCell.create(_fromRowIndex, _colIndex, _toRowIndex,
              _colIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });
      });

      describe('valid construction of command with multiple columns and ' +
          'multiple rows', function() {
        var _fromColIndex = 2, _toColIndex = 5;
        var _fromRowIndex = 3, _toRowIndex = 7;

        var _checkCommand = function(cmd, mergeOption) {
          assert.isDefined(cmd, 'setMergeCell command has been defined');
          assert.strictEqual(cmd.name, 'setMergeCell', 'Command name');
          assert.isDefined(cmd.id(), 'setMergeCell command id has been ' +
              'defined');
          assert.isTrue(cmd.callsService(), 'setMergeCell.callsService()');
          assert.isDefined(cmd.onFailure, 'setMergeCell.onFailure()');
          assert.isDefined(cmd.onSuccess, 'setMergeCell.onSuccess()');
          assert.strictEqual(cmd.dcpData().name, 'setMergeCell');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, _fromRowIndex);
          assert.strictEqual(cmd.dcpData().c1, _fromColIndex);
          assert.strictEqual(cmd.dcpData().r2, _toRowIndex);
          assert.strictEqual(cmd.dcpData().c2, _toColIndex);
          assert.strictEqual(cmd.dcpData().option, mergeOption);
          assert.strictEqual(cmd.dcpData().bs,
              SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for mergeAll option if ' +
            'valid parameters are specified', function() {
          var _mergeOption = 'mergeAll';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeHorizontally option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeHorizontally';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeVertically option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeVertically';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for unmerge option if valid' +
            ' parameters are specified', function() {
          var _mergeOption = 'unmerge';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });
      });

      describe('valid construction of command with _fromColIndex = 0 and  ' +
          '_toColIndex > _fromColIndex ', function() {
        var _fromColIndex = 0, _toColIndex = 4;
        var _rowIndex = 3;

        var _checkCommand = function(cmd, mergeOption) {
          assert.isDefined(cmd, 'setMergeCell command has been defined');
          assert.strictEqual(cmd.name, 'setMergeCell', 'Command name');
          assert.isDefined(cmd.id(), 'setMergeCell command id has been ' +
              'defined');
          assert.isTrue(cmd.callsService(), 'setMergeCell.callsService()');
          assert.isDefined(cmd.onFailure, 'setMergeCell.onFailure()');
          assert.isDefined(cmd.onSuccess, 'setMergeCell.onSuccess()');
          assert.strictEqual(cmd.dcpData().name, 'setMergeCell');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, _rowIndex);
          assert.strictEqual(cmd.dcpData().c1, _fromColIndex);
          assert.strictEqual(cmd.dcpData().r2, _rowIndex);
          assert.strictEqual(cmd.dcpData().c2, _toColIndex);
          assert.strictEqual(cmd.dcpData().option, mergeOption);
          assert.strictEqual(cmd.dcpData().bs,
              SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for mergeAll option if ' +
            'valid parameters are specified', function() {
          var _mergeOption = 'mergeAll';
          var cmd = SetMergeCell.create(_rowIndex, _fromColIndex, _rowIndex,
              _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeHorizontally option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeHorizontally';
          var cmd = SetMergeCell.create(_rowIndex, _fromColIndex, _rowIndex,
              _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for unmerge option if valid' +
            ' parameters are specified', function() {
          var _mergeOption = 'unmerge';
          var cmd = SetMergeCell.create(_rowIndex, _fromColIndex, _rowIndex,
              _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });
      });

      describe('valid construction of command with _fromRowIndex = 0 and ' +
          '_toRowIndex > _fromRowIndex ', function() {
        var _colIndex = 2;
        var _fromRowIndex = 0, _toRowIndex = 7;

        var _checkCommand = function(cmd, mergeOption) {
          assert.isDefined(cmd, 'setMergeCell command has been defined');
          assert.strictEqual(cmd.name, 'setMergeCell', 'Command name');
          assert.isDefined(cmd.id(), 'setMergeCell command id has been ' +
              'defined');
          assert.isTrue(cmd.callsService(), 'setMergeCell.callsService()');
          assert.isDefined(cmd.onFailure, 'setMergeCell.onFailure()');
          assert.isDefined(cmd.onSuccess, 'setMergeCell.onSuccess()');
          assert.strictEqual(cmd.dcpData().name, 'setMergeCell');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, _fromRowIndex);
          assert.strictEqual(cmd.dcpData().c1, _colIndex);
          assert.strictEqual(cmd.dcpData().r2, _toRowIndex);
          assert.strictEqual(cmd.dcpData().c2, _colIndex);
          assert.strictEqual(cmd.dcpData().option, mergeOption);
          assert.strictEqual(cmd.dcpData().bs,
              SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for mergeAll option if ' +
            'valid parameters are specified', function() {
          var _mergeOption = 'mergeAll';
          var cmd = SetMergeCell.create(_fromRowIndex, _colIndex, _toRowIndex,
              _colIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeVertically option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeVertically';
          var cmd = SetMergeCell.create(_fromRowIndex, _colIndex, _toRowIndex,
              _colIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for unmerge option if valid' +
            ' parameters are specified', function() {
          var _mergeOption = 'unmerge';
          var cmd = SetMergeCell.create(_fromRowIndex, _colIndex, _toRowIndex,
              _colIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });
      });

      describe('valid construction of command when both columns are ' +
          'undefined, means entire row(s) is selected.', function() {
        var _fromColIndex, _toColIndex;
        var _fromRowIndex = 3, _toRowIndex = 7;

        var _checkCommand = function(cmd, mergeOption) {
          assert.isDefined(cmd, 'setMergeCell command has been defined');
          assert.strictEqual(cmd.name, 'setMergeCell', 'Command name');
          assert.isDefined(cmd.id(), 'setMergeCell command id has been ' +
              'defined');
          assert.isTrue(cmd.callsService(), 'setMergeCell.callsService()');
          assert.isDefined(cmd.onFailure, 'setMergeCell.onFailure()');
          assert.isDefined(cmd.onSuccess, 'setMergeCell.onSuccess()');
          assert.strictEqual(cmd.dcpData().name, 'setMergeCell');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, _fromRowIndex);
          assert.strictEqual(cmd.dcpData().c1, _fromColIndex);
          assert.strictEqual(cmd.dcpData().r2, _toRowIndex);
          assert.strictEqual(cmd.dcpData().c2, _toColIndex);
          assert.strictEqual(cmd.dcpData().option, mergeOption);
          assert.strictEqual(cmd.dcpData().bs,
              SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for mergeAll option if ' +
            'valid parameters are specified', function() {
          var _mergeOption = 'mergeAll';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeHorizontally option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeHorizontally';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeVertically option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeVertically';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for unmerge option if valid' +
            ' parameters are specified', function() {
          var _mergeOption = 'unmerge';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });
      });

      describe('valid construction of command when both rows are undefined, ' +
          'means entire column(s) is selected.', function() {
        var _fromColIndex = 2, _toColIndex = 5;
        var _fromRowIndex, _toRowIndex;

        var _checkCommand = function(cmd, mergeOption) {
          assert.isDefined(cmd, 'setMergeCell command has been defined');
          assert.strictEqual(cmd.name, 'setMergeCell', 'Command name');
          assert.isDefined(cmd.id(), 'setMergeCell command id has been ' +
              'defined');
          assert.isTrue(cmd.callsService(), 'setMergeCell.callsService()');
          assert.isDefined(cmd.onFailure, 'setMergeCell.onFailure()');
          assert.isDefined(cmd.onSuccess, 'setMergeCell.onSuccess()');
          assert.strictEqual(cmd.dcpData().name, 'setMergeCell');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, _fromRowIndex);
          assert.strictEqual(cmd.dcpData().c1, _fromColIndex);
          assert.strictEqual(cmd.dcpData().r2, _toRowIndex);
          assert.strictEqual(cmd.dcpData().c2, _toColIndex);
          assert.strictEqual(cmd.dcpData().option, mergeOption);
          assert.strictEqual(cmd.dcpData().bs,
              SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for mergeAll option if ' +
            'valid parameters are specified', function() {
          var _mergeOption = 'mergeAll';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeHorizontally option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeHorizontally';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeVertically option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeVertically';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for unmerge option if valid' +
            ' parameters are specified', function() {
          var _mergeOption = 'unmerge';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });
      });

      describe('valid construction of command when both columns and ' +
          'rows are undefined, it means entire sheet is selected.', function() {
        var _fromColIndex, _toColIndex;
        var _fromRowIndex, _toRowIndex;

        var _checkCommand = function(cmd, mergeOption) {
          assert.isDefined(cmd, 'setMergeCell command has been defined');
          assert.strictEqual(cmd.name, 'setMergeCell', 'Command name');
          assert.isDefined(cmd.id(), 'setMergeCell command id has been ' +
              'defined');
          assert.isTrue(cmd.callsService(), 'setMergeCell.callsService()');
          assert.isDefined(cmd.onFailure, 'setMergeCell.onFailure()');
          assert.isDefined(cmd.onSuccess, 'setMergeCell.onSuccess()');
          assert.strictEqual(cmd.dcpData().name, 'setMergeCell');
          assert.strictEqual(cmd.dcpData().si, 1);
          assert.strictEqual(cmd.dcpData().r1, _fromRowIndex);
          assert.strictEqual(cmd.dcpData().c1, _fromColIndex);
          assert.strictEqual(cmd.dcpData().r2, _toRowIndex);
          assert.strictEqual(cmd.dcpData().c2, _toColIndex);
          assert.strictEqual(cmd.dcpData().option, mergeOption);
          assert.strictEqual(cmd.dcpData().bs,
              SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };

        it('constructor should create a command for mergeAll option if ' +
            'valid parameters are specified', function() {
          var _mergeOption = 'mergeAll';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeHorizontally option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeHorizontally';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for mergeVertically option ' +
            'if valid parameters are specified', function() {
          var _mergeOption = 'mergeVertically';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });

        it('constructor should create a command for unmerge option if valid' +
            ' parameters are specified', function() {
          var _mergeOption = 'unmerge';
          var cmd = SetMergeCell.create(_fromRowIndex, _fromColIndex,
              _toRowIndex, _toColIndex, _mergeOption);
          _checkCommand(cmd, _mergeOption);
        });
      });

      describe('Invalid construction of command for single cell', function() {

        it('constructor should throw error if mergeAll option applied on a ' +
            'single cell', function() {
          assert.throws(function() {
            var toColIndex = 3, fromColIndex = 3;
            var fromRowIndex = 1;
            var toRowIndex = 1;
            var mergeOption = 'mergeAll';
            SetMergeCell.create(fromRowIndex, fromColIndex, toRowIndex,
                toColIndex, mergeOption);
          }, 'ERROR: SetMergeCell: Merging or un-merging a single cell ' +
              'is not possible.');
        });

        it('constructor should throw error if mergeVertically option applied ' +
            'on a single cell', function() {
          assert.throws(function() {
            var toColIndex = 3, fromColIndex = 3;
            var fromRowIndex = 1;
            var toRowIndex = 1;
            var mergeOption = 'mergeVertically';
            SetMergeCell.create(fromRowIndex, fromColIndex, toRowIndex,
                toColIndex, mergeOption);
          }, 'ERROR: SetMergeCell: Merging or un-merging a single cell ' +
              'is not possible.');
        });

        it('constructor should throw error if mergeHorizontally option ' +
            'applied on a single cell', function() {
          assert.throws(function() {
            var toColIndex = 3, fromColIndex = 3;
            var fromRowIndex = 1;
            var toRowIndex = 1;
            var mergeOption = 'mergeHorizontally';
            SetMergeCell.create(fromRowIndex, fromColIndex, toRowIndex,
                toColIndex, mergeOption);
          }, 'ERROR: SetMergeCell: Merging or un-merging a single cell ' +
              'is not possible.');
        });

        it('constructor should throw error if unmerge option applied on a ' +
            'single cell', function() {
          assert.throws(function() {
            var toColIndex = 3, fromColIndex = 3;
            var fromRowIndex = 1;
            var toRowIndex = 1;
            var mergeOption = 'unmerge';
            SetMergeCell.create(fromRowIndex, fromColIndex, toRowIndex,
                toColIndex, mergeOption);
          }, 'ERROR: SetMergeCell: Merging or un-merging a single cell ' +
              'is not possible.');
        });
      });
    });
  });
});
