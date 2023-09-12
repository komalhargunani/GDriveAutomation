// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author ganetsky@google.com (Jason Ganetsky)
 * @fileoverview Tests for CommandManager.
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/commandBaseQueueableAdapter',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/commandQueueManager',
  'qowtRoot/commands/undo/undoManager',
  'qowtRoot/commands/queueableCommand',
  'qowtRoot/utils/functionUtils',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/promise/deferred'
], function(
    CommandBase,
    CommandBaseQueueableAdapter,
    CommandManager,
    CommandQueueManager,
    UndoManager,
    QueueableCommand,
    FunctionUtils,
    PromiseUtils,
    Types,
    Deferred) {

  'use strict';

  describe('commands/commandManager.js', function() {
    var commandQueueManagers_;
    beforeEach(function() {
      commandQueueManagers_ = [];
      spyOn(PromiseUtils, 'throwAndEscapeChain');
      expectedThrowAndEscapeChainCallCount = 0;
      spyOn(CommandQueueManager, 'create').andCallFake(function() {
        var fake = new FakeCommandQueueManager_(commandQueueManagers_.length);
        commandQueueManagers_.push(fake);
        return fake;
      });
      runs(function() {
        // Kill the actual commandQueueManager to reset the state, and make sure
        // we are using our fake one.
        var promise = CommandManager.cancelAllCommands();
        expect(CommandManager.isEmpty()).toBe(false);
        return promise;
      });
      runs(function() {
        expect(CommandManager.isEmpty()).toBe(true);
      });
    });
    afterEach(function() {
      expect(PromiseUtils.throwAndEscapeChain.callCount).toBe(
          expectedThrowAndEscapeChainCallCount);
    });

    var expectedThrowAndEscapeChainCallCount;
    var queueables;
    var inverses;
    var nCommands = 10;
    var queueable;
    var inverse;
    beforeEach(function() {
      queueables = [];
      inverses = [];
      for (var i = 0; i < nCommands; i++) {
        queueables.push(QueueableCommand.create());
        inverses.push(QueueableCommand.create());
        queueables[i].getInverse =
            FunctionUtils.makeConstantFunction(inverse);
        queueables[i].hasInverse =
            FunctionUtils.makeConstantFunction(true);
        inverses[i].getInverse =
            FunctionUtils.makeConstantFunction(queueable);
        inverses[i].hasInverse =
            FunctionUtils.makeConstantFunction(true);
      }
      queueable = queueables[0];
      inverse = inverses[0];
    });

    describe('many things that add a command to CommandQueueManager',
        function() {
          describe('addCommand', function() {
            var expectedQueueables;
            beforeEach(function() {
              expectedQueueables = [];
              spyOn(UndoManager, 'pushUndo');
            });
            afterEach(function() {
             // Only used one command queue manager here.
             expect(commandQueueManagers_.length).toBe(1);
             expect(commandQueueManagers_[0].afterStartCommands)
                 .toEqual(expectedQueueables);
             expect(commandQueueManagers_[0].beforeStartCommands)
                 .toEqual([]);
            });

            var testAddCommand_ = function(addCommandArg, queueable) {
              expect(CommandManager.addCommand(addCommandArg))
                  .toBe(fakeCommandPromise_);
              expectedQueueables.push(queueable);
              expect(UndoManager.pushUndo).toHaveBeenCalledWith(
                  queueable.getInverse());
              expect(UndoManager.pushUndo.callCount).toBe(1);
              UndoManager.pushUndo.reset();
            };

            var testAddCommandNoInverse_ = function(addCommandArg, queueable) {
              queueable.hasInverse = FunctionUtils.makeConstantFunction(
                  false);
              queueable.getInverse = function() {
                throw new Error('getInverse should not be called');
              };
              expect(CommandManager.addCommand(addCommandArg))
                  .toBe(fakeCommandPromise_);
              expect(UndoManager.pushUndo.callCount).toBe(0);
              expectedQueueables.push(queueable);
            };

            it('should dispatch addCommand to CommandQueueManager and ' +
                'UndoManager', function() {
                  testAddCommand_(queueable, queueable);
                });

            it('should dispatch addCommand to CommandQueueManager only when ' +
                'inverse is undefined', function() {
                  testAddCommandNoInverse_(queueable, queueable);
                });

            describe('CommandBaseQueueableAdapter', function() {
              var commandBase;
              beforeEach(function() {
                commandBase = CommandBase.create();
                spyOn(CommandBaseQueueableAdapter, 'create').andReturn(
                      queueable);
              });
              afterEach(function() {
                expect(CommandBaseQueueableAdapter.create.callCount).toBe(1);
              });

              it('should wrap CommandBase in CommandBaseQueueableAdapter',
                  function() {
                testAddCommand_(commandBase, queueable);
                expect(CommandBaseQueueableAdapter.create).
                    toHaveBeenCalledWith(commandBase);
              });

              it('should dispatch addCommand multiple times ', function() {
                testAddCommand_(commandBase, queueable);
                testAddCommand_(queueables[1], queueables[1]);
                testAddCommandNoInverse_(queueables[2], queueables[2]);
              });
            });
          });

          describe('undoLastCommand', function() {
            it('should dispatch undoLastCommand properly', function() {
              spyOn(UndoManager, 'popUndo').andReturn(queueable);
              CommandManager.undoLastCommand();
              expect(UndoManager.popUndo.callCount).toBe(1);
            });
          });

          describe('redoLastCommand', function() {
            it('should dispatch redoLastCommand properly', function() {
              spyOn(UndoManager, 'popRedo').andReturn(queueable);
              CommandManager.redoLastCommand();
              expect(UndoManager.popRedo.callCount).toBe(1);
            });
          });
        });

    describe('empty stacks', function() {
      afterEach(function() {
        expect(commandQueueManagers_.length).toEqual(1);
        expect(commandQueueManagers_[0].beforeStartCommands).toEqual([]);
        expect(commandQueueManagers_[0].afterStartCommands).toEqual([]);
      });

      it('should silently fail on undoLastCommand on empty undo stack',
          function() {
            spyOn(UndoManager, 'popUndo').andReturn(undefined);
            CommandManager.undoLastCommand();
            expect(UndoManager.popUndo.callCount).toBe(1);
          });

      it('should silently fail on redoLastCommand on empty redo stack',
          function() {
            spyOn(UndoManager, 'popRedo').andReturn(undefined);
            CommandManager.redoLastCommand();
            expect(UndoManager.popRedo.callCount).toBe(1);
          });
    });

    describe('cancelAllCommands', function() {
      beforeEach(function() {
        spyOn(UndoManager, 'reset');
      });
      it('should create new command queue managers on cancel', function() {
        CommandManager.addCommand(queueables[0]);
        CommandManager.addCommand(queueables[1]);
        CommandManager.cancelAllCommands();
        CommandManager.addCommand(queueables[2]);
        CommandManager.addCommand(queueables[3]);
        CommandManager.cancelAllCommands();
        CommandManager.addCommand(queueables[4]);
        CommandManager.addCommand(queueables[5]);
        expect(commandQueueManagers_.length).toBe(3);
        expect(commandQueueManagers_[0].afterStartCommands)
            .toEqual(queueables.slice(0, 2));
        // The remaining command queue managers haven't started yet, because
        // the first one hasn't died yet.
        expect(commandQueueManagers_[1].beforeStartCommands)
            .toEqual(queueables.slice(2, 4));
        expect(commandQueueManagers_[2].beforeStartCommands)
            .toEqual(queueables.slice(4, 6));
        expect(UndoManager.reset.callCount).toBe(2);
      });

      it('should transition to a new one on death', function() {
        runs(function() {
          CommandManager.addCommand(queueables[0]);
          CommandManager.addCommand(queueables[1]);
          var promise = CommandManager.cancelAllCommands();
          CommandManager.addCommand(queueables[2]);
          CommandManager.addCommand(queueables[3]);
          return promise;
        });
        runs(function() {
          expect(CommandManager.isEmpty()).toBe(true);
          CommandManager.addCommand(queueables[4]);
          expect(commandQueueManagers_.length).toBe(2);
          expect(commandQueueManagers_[0].afterStartCommands)
              .toEqual(queueables.slice(0, 2));
          expect(commandQueueManagers_[1].beforeStartCommands)
              .toEqual(queueables.slice(2, 4));
          expect(commandQueueManagers_[1].afterStartCommands)
              .toEqual(queueables.slice(4, 5));
        });
      });
    });

    describe('input validation', function() {
      var badInputs = ['', 1, true, undefined, null, {}, function() {}];
      var testOverBadInputs_ = function(extraBadInputs, binder) {
        for (var i in badInputs.concat(extraBadInputs)) {
          var badInput = badInputs[i];
          expect(binder(badInput)).toThrow();
        }
      };

      it('should reject inputs to addCommand that are not queueable commands',
          function() {
            testOverBadInputs_([], function(badInput) {
              return CommandManager.addCommand.bind(this, badInput);
            });
          });
    });

    describe('isEmpty', function() {
      it('should start out as true', function() {
        expect(CommandManager.isEmpty()).toBe(true);
      });

      it('should transition to false when CommandQueueManager is false',
          function() {
        expect(commandQueueManagers_.length).toBe(1);
        commandQueueManagers_[0].empty = false;
        expect(CommandManager.isEmpty()).toBe(false);
      });

      it('should have isEmpty = false while CommandQueueManager is cancelling',
          function() {
        runs(function() {
          expect(CommandManager.isEmpty()).toBe(true);
          var promise = CommandManager.cancelAllCommands();
          expect(CommandManager.isEmpty()).toBe(false);
          return promise;
        });
        runs(function() {
          expect(CommandManager.isEmpty()).toBe(true);
        });
      });
    });

    describe('dying CommandQueueManagers', function() {
      afterEach(function() {
        expect(commandQueueManagers_.length).toBe(2);
        CommandManager.addCommand(queueables[0]);
        expect(commandQueueManagers_[1].afterStartCommands).toEqual(
            queueables.slice(0, 1));
        expect(commandQueueManagers_[1].beforeStartCommands).toEqual([]);
      });
      it('should create new CommandQueueManager on normal death', function() {
        expect(commandQueueManagers_.length).toBe(1);
        commandQueueManagers_[0].die('foo');
        commandQueueManagers_[0].empty = false;
        // CommandManager will be empty after the transition to the new
        // CommandQueueManager.
        waitsFor(CommandManager.isEmpty, 'commandManager.isEmpty', 10000);
      });
      it('should propagate exception on rejected death',
          function() {
        var reason = new Error('death');
        expect(commandQueueManagers_.length).toBe(1);
        commandQueueManagers_[0].die(Promise.reject(reason));
        commandQueueManagers_[0].empty = false;
        // CommandManager will be empty after the transition to the new
        // CommandQueueManager.
        waitsFor(CommandManager.isEmpty, 'commandManager.isEmpty', 10000);
        runs(function() {
          expectedThrowAndEscapeChainCallCount = 1;
          expect(PromiseUtils.throwAndEscapeChain.callCount).toBe(1);
          expect(PromiseUtils.throwAndEscapeChain.argsForCall[0].length)
              .toBe(1);
          expect(PromiseUtils.throwAndEscapeChain.argsForCall[0][0])
              .toBe(reason);
        });
      });
    });

    describe('commandsProcessed', function() {
      it('should return an integer', function() {
        var count = CommandManager.commandsProcessed();
        expect(count).toBeDefined();
        expect(Types.isInteger(count)).toBe(true);
        expect(count > 0).toBe(true);
      });
    });

    describe('__doResolveOnEmpty', function() {
      it('should return a promise', function() {
        var addCommandFunc = function() {
          CommandManager.addCommand(queueable);
        };
        var prom = CommandManager.__doResolveOnEmpty(addCommandFunc);
        expect(prom).toBeDefined();
        expect(Types.isPromise(prom)).toBe(true);
      });
    });

    var fakeCommandPromise_ = new Promise(function() {});
    var newCommandQueueManagerCanStart_ = true;

    var FakeCommandQueueManager_ = function(id) {
      // public members
      this.empty = true;
      this.beforeStartCommands = [];
      this.afterStartCommands = [];
      this.id = id;

      // private members
      this.started_ = false;
      this.cancelled_ = false;
      this.dead_ = false;
      this.endDeferred_ = new Deferred();
      Object.seal(this);
    };

    FakeCommandQueueManager_.prototype = {};
    FakeCommandQueueManager_.prototype.constructor = FakeCommandQueueManager_;

    FakeCommandQueueManager_.prototype.isStarted = function() {
      return this.started_;
    };

    FakeCommandQueueManager_.prototype.start = function() {
      expect(this.started_).toBe(false);
      expect(this.cancelled_).toBe(false);
      // Only the latest contsructed commandQueueManager can be started.
      expect(commandQueueManagers_.length).toBe(this.id + 1);

      // Only one CommandQueueManager should be running at a time.
      expect(newCommandQueueManagerCanStart_).toBe(true);
      newCommandQueueManagerCanStart_ = false;

      this.started_ = true;
      return this.endDeferred_.promise;
    };

    FakeCommandQueueManager_.prototype.cancelAllCommands = function() {
      expect(this.cancelled_).toBe(false);
      this.cancelled_ = true;
      this.die();
    };

    FakeCommandQueueManager_.prototype.addCommand = function(command) {
      expect(this.cancelled_).toBe(false);
      if (this.started_) {
        this.afterStartCommands.push(command);
      } else {
        this.beforeStartCommands.push(command);
      }
      return fakeCommandPromise_;
    };

    FakeCommandQueueManager_.prototype.isEmpty = function() {
      expect(this.cancelled_).toBe(false);
      return this.empty;
    };

    FakeCommandQueueManager_.prototype.expectToRemainAfterDeath = function() {
      this.willRemainAfterDeath_ = true;
    };

    FakeCommandQueueManager_.prototype.die = function(value) {
      if (this.dead_) {
        throw new Error('CommandQueueManager cannot die more than once');
      }
      this.dead_ = true;
      this.endDeferred_.resolve(Promise.resolve().then(
          function() {
            newCommandQueueManagerCanStart_ = true;
            return value;
          }));
    };
  });
});
