// Copyright 2013 Google Inc. All Rights Reserved.

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/functionUtils',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/promise/testing/promiseTester',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/commandBaseQueueableAdapter',
  'qowtRoot/commands/rootCommandBaseQueueableAdapter',
  'qowtRoot/commands/queueableCommand'
], function(
    PubSub,
    TypeUtils,
    FunctionUtils,
    PromiseUtils,
    PromiseTester,
    CommandBase,
    CommandBaseQueueableAdapter,
    RootCommandBaseQueueableAdapter,
    QueueableCommand) {

  'use strict';

  describe('commands/commandBaseQueueableAdapter.js', function() {
    var test;
    beforeEach(function() {
      test = {
        /**
         * The QueueableCommand to test. This is usually going to be
         * the return value of CommandBaseQueueableAdapter.create.
         * We also want to test inverses of the return value, so it
         * can also be the inverse to any degree of its return value.
         */
        queueableCommand: undefined,

        /**
         * The expected sequence of commands to execute.
         * This is essentially a pre-order traversal of the
         * command tree.
         *
         * This should be a list of the command names, as
         * strings.
         *
         * For example: [ '1', '2', '3' ]
         *
         * For commands that are late-added children (children
         * added to a command after it has started to execute),
         * you must use the late_ method. For example, if cmd
         * 3 was added late and is to be executed after cmd 2.
         *
         * [ '1', '2', late_('3') ]
         *
         * To test inverses, you can apply the function
         * getInverseName_, for example:
         *
        * [ '3', '2', '1' ].map(getInverseName_)
         */
        expectedSequence: undefined,

        /**
         * Events must publish 'stop' PubSub events. This is the sequence
         * of 'stop' events expected. This is essentially the post-order
         * traversal of the tree. This works similarly to expectedSequence
         * above, except the late_ method is not necessary.
         */
        expectedStopSequence: undefined,

        /**
         * If queuaebleCommand.getInverse is expected to return undefined,
         * set this to true
         */
        expectNoInverse: undefined
      };
    });
    describe('simple command', function() {
      var _kNAME = 'simple';

      beforeEach(function() {
        test.expectedSequence = [_kNAME];
        test.expectedStopSequence = test.expectedSequence;
        test.commandBase = CommandBase.create(_kNAME);
        test.expectNoInverse = true;
      });

      describe('checking non-invertible simple command', function() {
        beforeEach(function() {
          test.queueableCommand = CommandBaseQueueableAdapter.create(
              test.commandBase);
        });

        itShouldBeAValidCommand_();
      });

      describe('checking invertible simple command', function() {
        beforeEach(function() {
          test.commandBase.canInvert = true;
          test.expectNoInverse = false;
        });

        describe('checking command itself', function() {
          beforeEach(function() {
            test.queueableCommand = CommandBaseQueueableAdapter.create(
                test.commandBase);
          });

          itShouldBeAValidCommand_();
        });

        describe('checking inverse command', function() {
          beforeEach(function() {
            test.queueableCommand = invert_(
                CommandBaseQueueableAdapter.create(test.commandBase));
            test.expectedSequence = [getInverseName_(_kNAME)];
            test.expectedStopSequence = test.expectedSequence;
          });

          itShouldBeAValidCommand_();
        });

        describe('checking inverse inverse command', function() {
          beforeEach(function() {
            test.queueableCommand = invert_(invert_(
                CommandBaseQueueableAdapter.create(test.commandBase)));
            test.expectedSequence = [getInverseName_(getInverseName_(
                _kNAME))];
            test.expectedStopSequence = test.expectedSequence;
          });

          itShouldBeAValidCommand_();
        });
      });
    });

    describe('compound command', function() {
      var cmds;

      beforeEach(function() {
        cmds = [];
        createCommands_(1, 7);

        cmds[1].addChild(cmds[2]);
        cmds[1].addChild(cmds[3]);
        cmds[1].addChild(cmds[4]);

        cmds[2].addChild(cmds[5]);
        cmds[2].addChild(cmds[6]);

        cmds[3].addChild(cmds[7]);

        test.commandBase = cmds[1];
        // Pre-order traversal of the tree.
        test.expectedSequence = ['1', '2', '5', '6', '3', '7', '4'];
        // Post-order traversal of the tree.
        test.expectedStopSequence = ['5', '6', '2', '7', '3', '4', '1'];
        test.expectNoInverse = true;
      });

      describe('checking non-invertible root', function() {
        beforeEach(function() {
          test.queueableCommand = CommandBaseQueueableAdapter.create(
              test.commandBase);
        });

        itShouldBeAValidCommand_();
      });

      describe('checking some invertible commands in the tree', function() {
        beforeEach(function() {
          cmds[1].canInvert = true;
          cmds[2].canInvert = true;
          cmds[6].canInvert = true;
          cmds[7].canInvert = true;
          cmds[4].canInvert = true;
          test.expectNoInverse = false;
        });

        describe('check command itself', function() {
          beforeEach(function() {
            test.queueableCommand = CommandBaseQueueableAdapter.create(
                test.commandBase);
          });

          itShouldBeAValidCommand_();
        });

        describe('check command inverse', function() {
          beforeEach(function() {
            test.queueableCommand = invert_(
                CommandBaseQueueableAdapter.create(test.commandBase));
            // To invert a tree, reverse the pre-order traversal and drop the
            // non-invertibles.
            test.expectedSequence = ['4', '7', '6', '2', '1']
                .map(getInverseName_);
            // The stop sequence is in the same order as the original sequence
            // because each inverse is its own command tree. To test the
            // non-trivial case, commands must return inverses with non-trivial
            // command trees.
            test.expectedStopSequence = ['4', '7', '6', '2', '1']
                .map(getInverseName_);
          });

          itShouldBeAValidCommand_();
        });

        describe('check command inverse inverse', function() {
          beforeEach(function() {
            test.queueableCommand = invert_(invert_(
                CommandBaseQueueableAdapter.create(test.commandBase)));
            // Inverse of the inverse as above. The fake
            // RootCommandBaseQueueableAdapter makes all inverses have
            // inverses.
            test.expectedSequence = ['1', '2', '6', '7', '4']
                .map(getInverseName_).map(getInverseName_);
            // The stop sequence is in the same order as the original sequence
            // because each inverse is its own command tree. To test the
            // non-trivial case, commands must return inverses with non-trivial
            // command trees.
            test.expectedStopSequence = ['1', '2', '6', '7', '4']
                .map(getInverseName_).map(getInverseName_);
          });

          itShouldBeAValidCommand_();
        });
      });

      describe('checking late added children in the tree', function() {
        beforeEach(function() {
          test.queueableCommand = CommandBaseQueueableAdapter.create(
              test.commandBase);

          createCommands_(8, 12, false /* opt_optimistic */);

          cmds[2].addChild(cmds[8]);
          cmds[4].addChild(cmds[9]);
          cmds[6].addChild(cmds[10]);
          cmds[1].addChild(cmds[11]);
          cmds[2].addChild(cmds[12]);

          // This is the same as the pre-order traversal, with late added
          // children inserted into the list.
          test.expectedSequence =
              ['1', '2', '5', '6', late_('10'), late_('8', '12'), '3', '7',
               '4', late_('9'), late_('11')];

          test.expectedStopSequence =
              ['5', '10', '6', '8', '12', '2', '7', '3', '9', '4', '1'];
        });

        itShouldBeAValidCommand_();
      });

      function createCommands_(start, end, opt_optimistic) {
        for (var i = start; i <= end; i++) {
          cmds[i] = CommandBase.create(i + "", opt_optimistic);
        }
      }
    });

    function itShouldBeAValidCommand_() {
      it('should have optimistic phase in order, and immediate', function() {
        return new PromiseTester(test.queueableCommand)
            .onlyThen(function(command) {
              expect(TypeUtils.isPromiseLike(command.runOptimisticPhase()))
                  .toBe(false);
              expect(events).toEqual(test.expectedSequence
                // Late-added children do not get their optimistic phase
                // executed on the optimistic queue.
                .filter(isNotLate_)
                .map(getOptEventName_));
            });
      });

      it('should have coreFutures in order', function() {
        return new PromiseTester(test.queueableCommand)
            .onlyThen(function(command) {
              return command.runDcpPhase();
            }).onlyThen(function() {
          expect(events).toEqual(flatten_(test.expectedSequence.map(
            function(item) {
              return isNotLate_(item) ?
                  [getDcpEventName_(item)] :
                  // The late added children of a command get their joined
                  // optimistic phase executed right before their joined core
                  // phase gets executed.
                  item.items.map(getOptEventName_).concat(
                      item.items.map(getDcpEventName_));
            })));
        });
      });

      it('should fire command done PubSub events', function() {
        // Testing the test configuration. There should be one stop event for
        // every command.
        expect(test.expectedSequence.length)
            .toEqual(test.expectedStopSequence.length);
        var stopEvents = [];
        var expectedStopEvents = test.expectedStopSequence.map(
          function(cmdName) {
            return 'qowt:cmd' + cmdName + 'Stop';
          });
        var tokens = expectedStopEvents.map(function (event) {
          return PubSub.subscribe(event, function() {
            stopEvents.push(event);
          });
        });
        afterEach(function() {
          tokens.forEach(PubSub.unsubscribe);
        });
        var allPromise = PromiseUtils.cast(test.queueableCommand).then(
            function(command) {
              return Promise.all([
                command.runOptimisticPhase(),
                command.runDcpPhase()
              ]);
            });
        return new PromiseTester(allPromise).onlyThen(function() {
          expect(stopEvents).toEqual(expectedStopEvents);
        });
      });

      it('should have toString in order', function() {
        return new PromiseTester(test.queueableCommand).onlyThen(
            function(queueableCommand) {
          expect(queueableCommand.toString())
              .toEqual(test.expectedSequence.filter(isNotLate_).join(','));
        });
      });

      it('should have correct inverse', function() {
        if (!test.expectNoInverse) {
          return new PromiseTester(invert_(test.queueableCommand))
              .onlyThen(function(result) {
                expect(QueueableCommand.isInstance(result)).toBe(true);
              });
        } else {
          expect(test.queueableCommand.hasInverse()).toBe(false);
        }
      });

      it('should pass through cancel promise to dcp phase', function() {
        return new PromiseTester(test.queueableCommand).onlyThen(
            function(queueableCommand) {
          var reason = {};
          return new PromiseTester(queueableCommand.runDcpPhase(
              Promise.reject(reason))).expectCatch(reason);
        });
      });

      it('should pass through cancel promise to opt phase', function() {
        return new PromiseTester(test.queueableCommand).onlyThen(
            function(queueableCommand) {
          var reason = {};
          return new PromiseTester(queueableCommand.runOptimisticPhase(
              Promise.reject(reason))).expectCatch(reason);
        });
      });
    }

    var events;
    beforeEach(function() {
      events = [];
    });

    var _kOPT_EVT = 'opt';
    var _KDCP_EVT = 'dcp';
    var _kINVERSE = 'inv';

    function getOptEventName_(name) {
      return _kOPT_EVT + name;
    }

    function getDcpEventName_(name) {
      return _KDCP_EVT + name;
    }

    function getInverseName_(name) {
      return _kINVERSE + name;
    }

    beforeEach(function() {
      spyOn(RootCommandBaseQueueableAdapter, 'create').andCallFake(
          function(commandBase, factory) {
        expect(factory).toBe(CommandBaseQueueableAdapter.create);
        return createFakeQueueableCommand_(
            commandBase.name, commandBase.canInvert);
      });
    });

    function createFakeQueueableCommand_(name, invertible) {
      var command = QueueableCommand.create();

      command.runOptimisticPhase = FunctionUtils.onceCallableFunction(
          function(cancelPromise) {
            events.push(getOptEventName_(name));
            if (cancelPromise) {
              return cancelPromise;
            }
          });

      command.runDcpPhase = FunctionUtils.onceCallableFunction(
          function(cancelPromise) {
            events.push(getDcpEventName_(name));
            return Promise.race([
                cancelPromise,
                Promise.resolve()
            ]);
          });

      command.hasInverse = FunctionUtils.makeConstantFunction(invertible);

      command.getInverse = FunctionUtils.memoize(function() {
        if (!invertible) {
          throw new Error('Do not call getInverse without hasInverse');
        } else {
          var inverseCmd = CommandBase.create(getInverseName_(name));
          inverseCmd.canInvert = true;
          return CommandBaseQueueableAdapter.create(inverseCmd);
        }
      });

      command.toString = FunctionUtils.makeConstantFunction(name);

      return command;
    }

    function invert_(command) {
      return PromiseUtils.cast(command).then(function(result) {
        return result.getInverse();
      });
    }

    function flatten_(list) {
      var empty = [];
      return empty.concat.apply(empty, list);
    }

    function isNotLate_(item) {
      return !item.isLate;
    }

    function late_() {
      return {
        items: Array.prototype.slice.call(arguments, 0),
        isLate: true
      };
    }
  });
});

