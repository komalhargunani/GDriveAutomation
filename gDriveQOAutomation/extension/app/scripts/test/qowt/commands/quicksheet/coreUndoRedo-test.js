define([
  'qowtRoot/commands/quicksheet/coreUndoRedo',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/variants/configs/sheet'
], function(
    CoreUndoRedo,
    ErrorCatcher,
    QOWTSilentError,
    SheetModel,
    PubSub,
    SheetSelectionManager,
    SheetConfig) {

  'use strict';

  describe('CoreUndoRedo command', function() {
    var checkCommand_ = function(cmd, commandNames) {
      assert.isDefined(cmd, 'CoreUndoRedo command should be defined');
      assert.isTrue(cmd.isOptimistic(), 'CoreUndoRedo should be Optimistic');
      assert.isTrue(cmd.callsService(), 'CoreUndoRedo should call Services');
      assert.isDefined(cmd.onFailure, 'CoreUndoRedo should define onFailure()');
      assert.isDefined(cmd.onSuccess, 'CoreUndoRedo should define onSuccess()');
      assert.strictEqual(cmd.dcpData().bs,
          SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
      assert.strictEqual(cmd.dcpData().si, 1);
      assert.isDefined(cmd.getInverse, 'CoreUndoRedo should have inverse()');
      assert.isTrue(cmd.canInvert, 'CoreUndoRedo should be invertible');
      assert.strictEqual(cmd.name, commandNames.commandName);
      assert.strictEqual(cmd.dcpData().name, commandNames.dcpCommandName);
    };

    var sandbox_;
    var selObj = {
      anchor: {rowIdx: 1, colIdx: 2},
      topLeft: {rowIdx: 1, colIdx: 2},
      bottomRight: {rowIdx: 2, colIdx: 2},
      contentType: 'sheetCell'
    };

    beforeEach(function() {
      SheetModel.activeSheetIndex = 1;
      sandbox_ = sinon.sandbox.create();
      sandbox_.stub(SheetSelectionManager, 'getCurrentSelection', function() {
        return selObj;
      });
    });


    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
      sandbox_.restore();
    });

    it('it should create a Undo command', function() {
      var commandNames = {
        commandName: 'UndoCommand',
        dcpCommandName: 'ulo'
      };
      var cmd = CoreUndoRedo.createUndo();
      checkCommand_(cmd, commandNames);
    });


    it('inverse of undo command should create a RedoCommand', function() {
      var cmd = CoreUndoRedo.createUndo();
      var commandNames = {
        commandName: 'UndoCommand',
        dcpCommandName: 'ulo'
      };
      checkCommand_(cmd, commandNames);
      var inverse = cmd.getInverse();
      commandNames.commandName = 'RedoCommand';
      commandNames.dcpCommandName = 'rlo';
      checkCommand_(inverse, commandNames);
    });


    it('should call onSuccess method of an Undo command and publish a signal',
        function() {
      sandbox_.spy(PubSub, 'publish');
      var cmd = CoreUndoRedo.createUndo();
      cmd.onSuccess({});
      assert.strictEqual(PubSub.publish.callCount, 2);
      assert.isTrue(PubSub.publish.calledWith('qowt:unlockScreen'));
      assert.isTrue(PubSub.publish.calledWith('qowt:sheet:requestFocus'));
    });


    it('constructor should throw a silent error if selection is undefined in' +
      'redo command', function() {
      sandbox_.spy(ErrorCatcher, 'handleError');
      CoreUndoRedo.createRedo();

      assert.strictEqual(ErrorCatcher.handleError.callCount, 1);
      assert.isTrue(ErrorCatcher.handleError.calledWith(new
          QOWTSilentError('ERROR: RedoCommand requires a selection')));
    });


    it('constructor should create a Redo command if a valid parameters ' +
        'are specified', function() {
      var commandNames = {
        commandName: 'RedoCommand',
        dcpCommandName: 'rlo'
      };
      var cmd = CoreUndoRedo.createRedo(selObj);
      checkCommand_(cmd, commandNames);
    });


    it('inverse of redo command should create a UndoCommand', function() {
      var commandNames = {
        commandName: 'RedoCommand',
        dcpCommandName: 'rlo'
      };
      var cmd = CoreUndoRedo.createRedo(selObj);
      checkCommand_(cmd, commandNames);
      var inverse = cmd.getInverse();
      commandNames.commandName = 'UndoCommand';
      commandNames.dcpCommandName = 'ulo';
      checkCommand_(inverse, commandNames);
    });


    it('should call onSuccess method of a Redo command and publish a signal',
        function() {
      sandbox_.spy(PubSub, 'publish');
      var cmd = CoreUndoRedo.createRedo(selObj);
      cmd.onSuccess({});
      assert.strictEqual(PubSub.publish.callCount, 2);
      assert.isTrue(PubSub.publish.calledWith('qowt:unlockScreen'));
      assert.isTrue(PubSub.publish.calledWith('qowt:sheet:requestFocus'));
    });
  });
});
