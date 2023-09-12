define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/quicksheet/setCellStrikethrough',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet'
], function(
    CommandBase,
    CommandManager,
    SetCellStrikethrough,
    SheetModel,
    SheetConfig) {

  'use strict';

  describe('SetCellStrikethrough command', function() {

    var fromColIndex_ = 2;
    var fromRowIndex_ = 3;
    var toColIndex_ = 4;
    var toRowIndex_ = 5;
    var sheetIndex_ = 1;
    var strikethrough_ = true;

    beforeEach(function() {
      SheetModel.activeSheetIndex = sheetIndex_;
    });


    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
    });

    //negative tests
    describe('Command creation with insufficient data', function() {

      var errorMsg = 'ERROR: SetCellStrikethrough: either the rows or cols ' +
          'need to be defined';


      it('constructor should throw error if strikethrough setting is undefined',
          function() {
            assert.throws(function() {
              SetCellStrikethrough.create(fromColIndex_, fromRowIndex_,
                  toColIndex_, toRowIndex_, undefined);
            }, 'ERROR: SetCellStrikethrough requires a strikethrough setting');
      });


      it('constructor should throw error if fromColumnIndex is undefined',
          function() {
            assert.throws(function() {
              SetCellStrikethrough.create(undefined, fromRowIndex_, toColIndex_,
                  toRowIndex_, strikethrough_);
            }, errorMsg);
      });


      it('constructor should throw error if fromRowIndex is undefined',
          function() {
            assert.throws(function() {
              SetCellStrikethrough.create(fromColIndex_, undefined, toColIndex_,
                  toRowIndex_, strikethrough_);
            }, errorMsg);
      });


      it('constructor should throw error if toColIndex is undefined',
          function() {
            assert.throws(function() {
              SetCellStrikethrough.create(fromColIndex_, fromRowIndex_,
                  undefined, toRowIndex_, strikethrough_);
            }, errorMsg);
      });


      it('constructor should throw error if toRowIndex is undefined',
          function() {
            assert.throws(function() {
              SetCellStrikethrough.create(fromColIndex_, fromRowIndex_,
                  toColIndex_, undefined, strikethrough_);
            }, errorMsg);
      });
    });


    //positive tests
    describe('Valid ways of command creation', function() {
      it('constructor should not throw error if row information is missing',
          function() {
            assert.doesNotThrow(function() {
              SetCellStrikethrough.create(fromColIndex_, undefined, toColIndex_,
                  undefined, strikethrough_);
            });
      });


      it('constructor should not throw error if column information is missing',
          function() {
            assert.doesNotThrow(function() {
              SetCellStrikethrough.create(undefined, fromRowIndex_, undefined,
                  toRowIndex_, strikethrough_);
            });
      });


      it('should create a valid command for a selected range of cells',
          function() {
            var cmd = SetCellStrikethrough.create(fromColIndex_, fromRowIndex_,
                toColIndex_, toRowIndex_, strikethrough_);

            var range = {
              fromRowIndex: fromRowIndex_,
              fromColIndex: fromColIndex_,
              toRowIndex: toRowIndex_,
              toColIndex: toColIndex_
            };
            verifyCommandCreation_(cmd, range);
      });


      it('should create a valid command for row selection', function() {
        var cmd = SetCellStrikethrough.create(undefined, fromRowIndex_,
            undefined, toRowIndex_, strikethrough_);

        var range = {
          fromRowIndex: fromRowIndex_,
          fromColIndex: undefined,
          toRowIndex: toRowIndex_,
          toColIndex: undefined
        };
        verifyCommandCreation_(cmd, range);
      });


      it('should create a valid command for column selection', function() {
        var cmd = SetCellStrikethrough.create(fromColIndex_, undefined,
            toColIndex_, undefined, strikethrough_);

        var range = {
          fromRowIndex: undefined,
          fromColIndex: fromColIndex_,
          toRowIndex: undefined,
          toColIndex: toColIndex_
        };
        verifyCommandCreation_(cmd, range);
      });


      it('Inverse operation should create an UndoCommand', function() {
        var cmd = SetCellStrikethrough.create(fromColIndex_, fromRowIndex_,
            toColIndex_, toRowIndex_, strikethrough_);
        CommandManager.addCommand(cmd);

        var inverse = cmd.getInverse();
        assert.strictEqual(inverse.name, 'UndoCommand');
      });


      var verifyCommandCreation_ = function(cmd, range) {

        assert.strictEqual(cmd.name, 'SetCellStrikethrough');
        assert.isTrue(CommandBase.isCommand(cmd), 'SetCellStrikethrough ' +
            'should be a command');
        assert.isDefined(cmd, 'SetCellStrikethrough command should be defined');
        assert.isDefined(cmd.id(), 'ID for SetCellStrikethrough should be ' +
            'defined');
        assert.isTrue(cmd.isOptimistic(), 'SetCellStrikethrough should be an ' +
            'optimistic command');
        assert.isTrue(cmd.callsService(), 'SetCellStrikethrough command ' +
            'should be able to call the services');
        assert.isDefined(cmd.onFailure, 'onFailure function should be defined' +
            ' for SetCellStrikethrough command');
        assert.isDefined(cmd.onSuccess, 'onSuccess function should be defined' +
            ' for SetCellStrikethrough command');

        //ensure that the dcp data is set correctly.
        assert.strictEqual(cmd.dcpData().name, 'scf');
        assert.strictEqual(cmd.dcpData().si, sheetIndex_);
        assert.strictEqual(cmd.dcpData().r1, range.fromRowIndex);
        assert.strictEqual(cmd.dcpData().c1, range.fromColIndex);
        assert.strictEqual(cmd.dcpData().r2, range.toRowIndex);
        assert.strictEqual(cmd.dcpData().c2, range.toColIndex);
        assert.strictEqual(cmd.dcpData().bs,
            SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        assert.isTrue(cmd.canInvert, 'SetCellStrikethrough command should be ' +
            'invertible');
      };
    });
  });
});

