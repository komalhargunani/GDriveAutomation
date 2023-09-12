// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Tests for UndoManager.
 */
define([
    'qowtRoot/commands/queueableCommand',
    'qowtRoot/commands/undo/undoManager',
    'qowtRoot/utils/functionUtils',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/promise/testing/promiseTester'
  ], function(
    QueueableCommand,
    UndoManager,
    FunctionUtils,
    PubSub,
    PromiseTester) {

  'use strict';

  describe('commands/undo/undoManager.js', function() {
    var _kUNDO_EMPTY = 'qowt:undoEmpty';
    var _kREDO_EMPTY = 'qowt:redoEmpty';
    var _kUNDO_NON_EMPTY = 'qowt:undoNonEmpty';
    var _kREDO_NON_EMPTY = 'qowt:redoNonEmpty';
    var _kSIGNALS = [_kUNDO_EMPTY, _kREDO_EMPTY, _kUNDO_NON_EMPTY,
                     _kREDO_NON_EMPTY];

    var _pushInverseOf = function(command) {
      if (command.hasInverse()) {
        UndoManager.pushUndo(command.getInverse());
      }
    };

    it('should return undefined on empty undo and redo stack', function() {
      expect(UndoManager.popUndo()).toBeUndefined();
      expect(UndoManager.popRedo()).toBeUndefined();
    });
    it('should undo a single command', function() {
      var pair = _createCommandPair();
      var command = pair.command;
      var inverseCommand = pair.inverse;

      // REDO[] []UNDO
      _assertEmpties(true, true);

      _pushInverseOf(command);
      // REDO[] [1']UNDO
      _assertEmpties(true, false);
      _assertSignals([_kUNDO_NON_EMPTY]);

      var popped = UndoManager.popUndo();
      // REDO[1] []UNDO
      _assertEmpties(false, true);
      _assertSignals([_kUNDO_EMPTY, _kREDO_NON_EMPTY]);
      expect(popped).toBe(inverseCommand);

      popped = UndoManager.popRedo();
      // REDO[] [1']UNDO
      _assertEmpties(true, false);
      _assertSignals([_kREDO_EMPTY, _kUNDO_NON_EMPTY]);
      expect(popped).toBe(command);

      popped = UndoManager.popUndo();
      // REDO[1] []UNDO
      _assertEmpties(false, true);
      _assertSignals([_kREDO_NON_EMPTY, _kUNDO_EMPTY]);
      expect(popped).toBe(inverseCommand);
    });

    it('undo and redo of several commands', function() {
      var pair1 = _createCommandPair();
      var pair2 = _createCommandPair();

      // REDO[] []UNDO
      _assertEmpties(true, true);

      _pushInverseOf(pair1.command);
      // REDO[] [1']UNDO
      _assertEmpties(true, false);
      _assertSignals([_kUNDO_NON_EMPTY]);

      _pushInverseOf(pair2.command);
      // REDO[] [2' 1']UNDO
      _assertEmpties(true, false);
      _assertSignals([]);

      var popped = UndoManager.popUndo();
      // REDO[2] [1']UNDO
      _assertEmpties(false, false);
      _assertSignals([_kREDO_NON_EMPTY]);
      expect(popped).toBe(pair2.inverse);

      popped = UndoManager.popUndo();
      // REDO[2 1] []UNDO
      _assertEmpties(false, true);
      _assertSignals([_kUNDO_EMPTY]);
      expect(popped).toBe(pair1.inverse);

      popped = UndoManager.popRedo();
      // REDO[2] [1']UNDO
      _assertEmpties(false, false);
      _assertSignals([_kUNDO_NON_EMPTY]);
      expect(popped).toBe(pair1.command);

      popped = UndoManager.popRedo();
      // REDO[] [2' 1']UNDO
      _assertEmpties(true, false);
      _assertSignals([_kREDO_EMPTY]);
      expect(popped).toBe(pair2.command);
    });

    it('should clear redo stack when a new command goes on undo stack',
        function() {
      var pair1 = _createCommandPair();
      var pair2 = _createCommandPair();
      var pair3 = _createCommandPair();

      // REDO[] []UNDO
      _assertEmpties(true, true);

      _pushInverseOf(pair1.command);
      // REDO[] [1']UNDO
      _assertEmpties(true, false);
      _assertSignals([_kUNDO_NON_EMPTY]);

      _pushInverseOf(pair2.command);
      // REDO[] [2' 1']UNDO
      _assertEmpties(true, false);
      _assertSignals([]);

      var popped = UndoManager.popUndo();
      // REDO[2] [1']UNDO
      _assertEmpties(false, false);
      _assertSignals([_kREDO_NON_EMPTY]);
      expect(popped).toBe(pair2.inverse);

      popped = UndoManager.popUndo();
      // REDO[2 1] []UNDO
      _assertEmpties(false, true);
      _assertSignals([_kUNDO_EMPTY]);

      _pushInverseOf(pair3.command);
      // REDO[] [3']UNDO
      _assertEmpties(true, false);
      _assertSignals([_kREDO_EMPTY, _kUNDO_NON_EMPTY]);

      expect(UndoManager.popRedo()).toBeUndefined();

      popped = UndoManager.popUndo();
      // REDO[3] []UNDO
      _assertEmpties(false, true);
      _assertSignals([_kREDO_NON_EMPTY, _kUNDO_EMPTY]);
      expect(popped).toBe(pair3.inverse);

      popped = UndoManager.popRedo();
      // REDO[] [3']UNDO
      _assertEmpties(true, false);
      _assertSignals([_kREDO_EMPTY, _kUNDO_NON_EMPTY]);
      expect(popped).toBe(pair3.command);
    });

    it('should ignore non-undoable commands', function() {
      var pair1 = _createCommandPair();
      var pair2 = _createCommandPair();
      var unpairedCommand = _createUnpairedCommand();

      // REDO[] []UNDO
      _assertEmpties(true, true);

      _pushInverseOf(pair1.command);
      // REDO[] [1']UNDO
      _assertEmpties(true, false);
      _assertSignals([_kUNDO_NON_EMPTY]);

      _pushInverseOf(pair2.command);
      // REDO[] [2' 1']UNDO
      _assertEmpties(true, false);
      _assertSignals([]);

      var popped = UndoManager.popUndo();
      // REDO[2] [1']UNDO
      _assertEmpties(false, false);
      _assertSignals([_kREDO_NON_EMPTY]);
      return new PromiseTester(popped).expectThen(pair2.inverse).then(
        function() {
          _pushInverseOf(unpairedCommand);
          // REDO[2] [1']UNDO
          _assertEmpties(false, false);
          _assertSignals([]);

          popped = UndoManager.popUndo();
          // REDO[2 1] []UNDO
          _assertEmpties(false, true);
          _assertSignals([_kUNDO_EMPTY]);
          expect(popped).toBe(pair1.inverse);
        });
    });

    it('should work with inverse promises', function() {
      var command = _createUnpairedCommand();

      var eventualInverse = _createUnpairedCommand();
      var eventualInverse2 = _createUnpairedCommand();

      var eventualInversePromise = Promise.resolve(eventualInverse);
      var eventualInverse2Promise = Promise.resolve(eventualInverse2);

      command.getInverse =
          FunctionUtils.makeConstantFunction(eventualInversePromise);
      command.hasInverse =
          FunctionUtils.makeConstantFunction(true);

      eventualInverse.getInverse =
          FunctionUtils.makeConstantFunction(eventualInverse2Promise);
      eventualInverse.hasInverse =
          FunctionUtils.makeConstantFunction(true);

      eventualInverse2.getInverse =
          FunctionUtils.makeConstantFunction(_createUnpairedCommand());
      eventualInverse2.hasInverse =
          FunctionUtils.makeConstantFunction(true);

      _pushInverseOf(command);

      var popped = UndoManager.popUndo();
      var popped2 = UndoManager.popRedo();

      return new PromiseTester(Promise.all([popped, popped2])).onlyThen(
          function(resolved) {
            expect(resolved[0]).toBe(eventualInverse);
            expect(resolved[1]).toBe(eventualInverse2);
          });
    });

    var signalsReceived;
    var _resetToken = [], count = 0;
    beforeEach(function() {
      signalsReceived = [];
      _kSIGNALS.forEach(function(signal) {
        _resetToken[count++] = PubSub.subscribe(signal, function() {
          signalsReceived.push(signal);
          if (signal === _kUNDO_EMPTY) {
            expect(UndoManager.popUndo()).toBeUndefined();
          }
          if (signal === _kREDO_EMPTY) {
            expect(UndoManager.popRedo()).toBeUndefined();
          }
        });
      });
    });

    afterEach(function() {
      var subscribeCount = 0;
      _resetToken.forEach(function() {
        PubSub.unsubscribe(_resetToken[subscribeCount++]);
      });
      UndoManager.reset();
    });

    var _assertSignals = function(expectedSignalsReceived) {
      expectedSignalsReceived.sort();
      signalsReceived.sort();
      expect(signalsReceived).toEqual(expectedSignalsReceived);
      signalsReceived = [];
    };

    var _createCommandPair = function() {
      var command = _createUnpairedCommand();
      var inverseCommand = _createUnpairedCommand();

      command.getInverse = FunctionUtils.makeConstantFunction(inverseCommand);
      command.hasInverse = FunctionUtils.makeConstantFunction(true);
      inverseCommand.getInverse = FunctionUtils.makeConstantFunction(command);
      inverseCommand.hasInverse = FunctionUtils.makeConstantFunction(true);

      return {
        command: command,
        inverse: inverseCommand
      };
    };

    var _createUnpairedCommand = function() {
      var command = QueueableCommand.create();
      command.hasInverse = FunctionUtils.makeConstantFunction(false);

      return command;
    };

    var _assertEmpties = function(redoShouldBeEmpty, undoShouldBeEmpty) {
      expect(UndoManager.isUndoEmpty()).toEqual(undoShouldBeEmpty);
      expect(UndoManager.isRedoEmpty()).toEqual(redoShouldBeEmpty);
    };
  });
});
