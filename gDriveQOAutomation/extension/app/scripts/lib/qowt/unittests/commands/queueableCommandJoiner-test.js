// Copyright 2013 Google Inc. All Rights Reserved.

define([
  'qowtRoot/utils/functionUtils',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/promise/testing/promiseTester',
  'qowtRoot/promise/deferred',
  'qowtRoot/commands/queueableCommand',
  'qowtRoot/commands/queueableCommandJoiner'
], function(
    FunctionUtils,
    PromiseUtils,
    PromiseTester,
    Deferred,
    QueueableCommand,
    QueueableCommandJoiner) {

  'use strict';

  describe('commands/queueableCommandJoiner.js', function() {
    var cancelPromise = new Deferred().promise;
    describe('joining 1 command', function() {
      it('should pass the 1 command directly through', function() {
        var command = QueueableCommand.create();
        expect(QueueableCommandJoiner.join([command])).toBe(command);
      });
    });
    describe('joining multiple commands', function() {
      beforeEach(function() {
        _events = [];
      });
      var _events = [];
      var _getInverse = function(command, count) {
        count = count || 1;

        var _invert = function(currentCommand, currentCount) {
          if (currentCount === 0) {
            return currentCommand;
          } else {
            return PromiseUtils.cast(_invert(currentCommand, currentCount - 1))
                .then(function(inverse) {
                  return inverse.getInverse();
                });
          }
        };

        var _dePromise = function(cmdPromise, fnName) {
          var fnArgs = Array.prototype.slice.call(arguments, 2);
          return cmdPromise.then(function(cmd) {
            return cmd[fnName].apply(undefined, fnArgs);
          });
        };

        var promise = _invert(command, count);

        return {
          runDcpPhase: _dePromise.bind(this, promise, 'runDcpPhase'),
          runOptimisticPhase: _dePromise.bind(
              this, promise, 'runOptimisticPhase')
        };
      };
      var _createCommand = function(name) {
        var command = QueueableCommand.create();
        command.runOptimisticPhase = FunctionUtils.onceCallableFunction(
            function(actualCancelPromise) {
              expect(actualCancelPromise).toBe(cancelPromise);
              _events.push('opt ' + name);
              return Promise.resolve();
            });
        command.runDcpPhase = FunctionUtils.onceCallableFunction(
            function(actualCancelPromise) {
              expect(actualCancelPromise).toBe(cancelPromise);
              _events.push('dcp ' + name);
              return Promise.resolve();
            });
        command.hasInverse = FunctionUtils.makeConstantFunction(false);
        command.toString = FunctionUtils.makeConstantFunction(name);
        return command;
      };
      var _createInvertibleCommand = function(name) {
        var command = _createCommand(name);
        command.hasInverse = FunctionUtils.makeConstantFunction(true);
        command.getInverse = function() {
          return Promise.resolve(_createInvertibleCommand(name + ' inverse'));
        };
        return command;
      };
      var _doTest = function(fn, expectedEvents) {
        expect(_events).toEqual([]);
        return new PromiseTester(fn(cancelPromise)).onlyThen(function() {
          expect(_events).toEqual(expectedEvents);
        });
      };
      describe('toString', function() {
        it('should join with comma and filter out falsies', function() {
          var cmds = [_createCommand('1'), _createCommand(undefined),
                      _createCommand('foo'), _createCommand(''),
                      _createCommand('bar')];
          expect(QueueableCommandJoiner.join(cmds).toString())
              .toEqual('1,foo,bar');
        });
      });
      describe('joining 3 invertible commands', function() {
        var _joinedCommand;
        beforeEach(function() {
          _joinedCommand = QueueableCommandJoiner.join(
              [_createInvertibleCommand(1), _createInvertibleCommand(2),
               _createInvertibleCommand(3)]);
        });
        it('should join opt futures together', function() {
          return _doTest(_joinedCommand.runOptimisticPhase,
              ['opt 1', 'opt 2', 'opt 3']);
        });
        it('should join dcp futures together', function() {
          return _doTest(_joinedCommand.runDcpPhase,
              ['dcp 1', 'dcp 2', 'dcp 3']);
        });
        it('inverse should have joined opt futures', function() {
          return _doTest(_getInverse(_joinedCommand).runOptimisticPhase,
              ['opt 3 inverse', 'opt 2 inverse', 'opt 1 inverse']);
        });
        it('inverse should have joined dcp futures', function() {
          return _doTest(_getInverse(_joinedCommand).runDcpPhase,
              ['dcp 3 inverse', 'dcp 2 inverse', 'dcp 1 inverse']);
        });
        it('double inverse should have joined opt futures', function() {
          return _doTest(_getInverse(_joinedCommand, 2).runOptimisticPhase,
              ['opt 1 inverse inverse',
               'opt 2 inverse inverse',
               'opt 3 inverse inverse']);
        });
        it('double inverse should have joined dcp futures', function() {
          return _doTest(_getInverse(_joinedCommand, 2).runDcpPhase,
              ['dcp 1 inverse inverse',
               'dcp 2 inverse inverse',
               'dcp 3 inverse inverse']);
        });
        it('should join the names together', function() {
          expect(_joinedCommand.toString()).toEqual('1,2,3');
        });
      });
      describe('joining invertible and non invertible commands', function() {
        var _joinedCommand;
        beforeEach(function() {
          _joinedCommand = QueueableCommandJoiner.join(
              [_createCommand(1), _createInvertibleCommand(2),
               _createInvertibleCommand(3), _createCommand(4)]);
        });
        it('should join opt futures together', function() {
          return _doTest(_joinedCommand.runOptimisticPhase,
              ['opt 1', 'opt 2', 'opt 3', 'opt 4']);
        });
        it('should join dcp futures together', function() {
          return _doTest(_joinedCommand.runDcpPhase,
              ['dcp 1', 'dcp 2', 'dcp 3', 'dcp 4']);
        });
        it('inverse should have joined opt futures', function() {
          return _doTest(_getInverse(_joinedCommand).runOptimisticPhase,
              ['opt 3 inverse', 'opt 2 inverse']);
        });
        it('inverse should have joined dcp futures', function() {
          return _doTest(_getInverse(_joinedCommand).runDcpPhase,
              ['dcp 3 inverse', 'dcp 2 inverse']);
        });
        it('double inverse should have joined opt futures', function() {
          return _doTest(_getInverse(_joinedCommand, 2).runOptimisticPhase,
              ['opt 2 inverse inverse',
               'opt 3 inverse inverse']);
        });
        it('double inverse should have joined dcp futures', function() {
          return _doTest(_getInverse(_joinedCommand, 2).runDcpPhase,
              ['dcp 2 inverse inverse',
               'dcp 3 inverse inverse']);
        });
      });
    });
  });
});
