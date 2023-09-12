/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/commands/coreFailure',
  'qowtRoot/commands/coreFailureHandler',
  'qowtRoot/commands/commandQueueManager',
  'qowtRoot/commands/queueableCommand',
  'qowtRoot/utils/functionUtils',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/promise/testing/promiseTester'
], function(
  CoreFailure,
  CoreFailureHandler,
  CommandQueueManager,
  QueueableCommand,
  FunctionUtils,
  PromiseUtils,
  TypeUtils,
  PromiseTester) {

  'use strict';

  describe('commands/commandQueueManager.js', function() {
    describe('running commands', function() {
      describe('should run a series of valid commands', function() {
        it('should run commands added before start', function() {
          promises_ = commands_.map(
              commandQueueManager_.addCommand.bind(commandQueueManager_));
          expect(commandQueueManager_.isEmpty()).toBe(false);
          failOnSettle_(startCommandQueueManager_());
        });
        it('should run commands added after start', function() {
          failOnSettle_(startCommandQueueManager_());
          promises_ = commands_.map(
              commandQueueManager_.addCommand.bind(commandQueueManager_));
          expect(commandQueueManager_.isEmpty()).toBe(false);

          // We expect the first command to be run immediately.
          expectedImmediateCommands_ = 1;
        });
        it('should run commands with some before start, some after',
            function() {
          var partition = 4;
          promises_ = commands_.slice(0, partition).map(
              commandQueueManager_.addCommand.bind(commandQueueManager_));
          expect(commandQueueManager_.isEmpty()).toBe(false);
          failOnSettle_(startCommandQueueManager_());

          promises_ = promises_.concat(
              commands_.slice(partition).map(
                  commandQueueManager_.addCommand.bind(commandQueueManager_)));
        });
        it('should run commands wrapped in promises', function() {
          failOnSettle_(startCommandQueueManager_());
          promises_ = commands_.map(Promise.resolve, Promise).map(
              commandQueueManager_.addCommand.bind(commandQueueManager_));
          expect(commandQueueManager_.isEmpty()).toBe(false);
        });
      });

      var promises_;
      var expectedImmediateCommands_;
      beforeEach(function() {
        expectedImmediateCommands_ = 0;
        promises_ = [];
        makeExpectedToRunCommands_(10);
      });

      afterEach(function() {
        expect(commandQueueManager_.isStarted()).toBe(true);
        expect(commandQueueManager_.isEmpty()).toBe(false);
        expect(optEvents_.length).toBe(expectedImmediateCommands_);
        expect(dcpEvents_.length).toBe(expectedImmediateCommands_);
        return new PromiseTester(Promise.all(promises_)).onlyThen(
            function(results) {
          function getByIndex_(index, item) {
            return item[index];
          }
          expect(results.map(getByIndex_.bind(undefined, 0)))
              .toEqual(expectedOptEvents_);
          expect(results.map(getByIndex_.bind(undefined, 1)))
              .toEqual(expectedDcpEvents_);
          expect(commandQueueManager_.isEmpty()).toBe(true);
        });
      });
    });

    describe('commands that throw exception', function() {
      afterEach(function() {
        expect(commandQueueManager_.isEmpty()).toBe(false);
        // This should not throw an exception after the error-driven
        // cancellation from the test cases below. It should just be a no-op.
        commandQueueManager_.cancelAllCommands();
      });
      var nGoodCommands_ = 3;
      function itShouldWork_() {
        it('should work starting after add', function() {
          commands_.forEach(
              commandQueueManager_.addCommand.bind(commandQueueManager_));
          return new PromiseTester(startCommandQueueManager_())
              .expectCatch(exception_);
        });

        it('should work adding after start', function() {
          var startPromise = startCommandQueueManager_();
          commands_.forEach(
              commandQueueManager_.addCommand.bind(commandQueueManager_));
          return new PromiseTester(startPromise).expectCatch(exception_);
        });
      }
      describe('should handle exception from optimistic phase', function() {
        beforeEach(function() {
          commands_.push(createFakeQueueableCommand_(
              makeExpectedToRunReturningOptPhase_(0),
              blockUntilCancelledPhaseRun_));
          for (var i = 1; i < nGoodCommands_; i++) {
            commands_.push(createFakeQueueableCommand_(
                makeExpectedToRunReturningOptPhase_(i),
                notExpectedToRunPhase_));
          }
          commands_.push(createFakeQueueableCommand_(
              makeExpectedToRunThrowingOptPhase_(4),
              notExpectedToRunPhase_));
          commands_.push(createFakeQueueableCommand_(
              notExpectedToRunPhase_,
              notExpectedToRunPhase_));
        });

        itShouldWork_();
      });
      describe('should handle exception from dcp phase', function() {
        describe('not core failure', function() {
          beforeEach(function() {
            commands_.push(createFakeQueueableCommand_(
                blockUntilCancelledPhaseRun_,
                makeExpectedToRunReturningDcpPhase_(0)));
            for (var i = 0; i < nGoodCommands_; i++) {
              commands_.push(createFakeQueueableCommand_(
                  notExpectedToRunPhase_,
                  makeExpectedToRunReturningDcpPhase_(i)));
            }
            commands_.push(createFakeQueueableCommand_(
                notExpectedToRunPhase_,
                makeExpectedToRunThrowingDcpPhase_(4)));
            commands_.push(createFakeQueueableCommand_(
                notExpectedToRunPhase_,
                notExpectedToRunPhase_));
          });

          itShouldWork_();
        });

        describe('core failure', function() {
          it('should handle core failure by calling CoreFailureHandler',
              function() {
            commands_.push(createFakeQueueableCommand_(
                makeExpectedToCancelOptPhase_(0),
                makeExpectedToRunReturningDcpPhase_(0)));
            commands_.push(createFakeQueueableCommand_(
                notExpectedToRunPhase_,
                makeExpectedToRunCoreFailureDcpPhase_(1)));
            var startPromise = startCommandQueueManager_();
            commands_.forEach(
                commandQueueManager_.addCommand.bind(commandQueueManager_));
            return new PromiseTester(startPromise);
          });
        });
      });
    });

    describe('cancellation', function() {
      var startPromise_;
      var cancelCmdsPromise_;
      beforeEach(function() {
        startPromise_ = undefined;
        cancelCmdsPromise_ = undefined;
      });
      afterEach(function() {
        return new PromiseTester(
            Promise.all([startPromise_, cancelCmdsPromise_]));
      });
      afterEach(function() {
        expect(commandQueueManager_.isEmpty()).toBe(false);
      });
      describe('cancelling with commands in queue', function() {
        var cmdPromise_;
        beforeEach(function() {
          cmdPromise_ = undefined;
        });
        afterEach(function() {
          return new PromiseTester(cmdPromise_).onlyCatch(function() {});
        });
        it('should not run any commands if immediately cancelled', function() {
          cmdPromise_ = commandQueueManager_.addCommand(
              createFakeQueueableCommand_(
                  notExpectedToRunPhase_,
                  notExpectedToRunPhase_));
          startPromise_ = startCommandQueueManager_();
          cancelCmdsPromise_ = commandQueueManager_.cancelAllCommands();
        });

        it('should cancel commands that are waiting on cancelPromise',
            function() {
          startPromise_ = startCommandQueueManager_();
          cmdPromise_ = commandQueueManager_.addCommand(
              createFakeQueueableCommand_(
                  makeExpectedToCancelOptPhase_(0),
                  makeExpectedToCancelDcpPhase_(0)));
          cancelCmdsPromise_ = commandQueueManager_.cancelAllCommands();
          // We have captured the cancel phase inside the command, so we can
          // test it here.
          return new PromiseTester(cmdPromise_).onlyCatch(function(reason) {
            // Instead of using .expectCatch, we use .onlyCatch, so we can
            // ensure that the assignment to cancelReason_ is made before it
            // being referenced.
            expect(reason).toBe(cancelReason_);
          });
        });
      });
      it('should support cancelling while empty', function() {
        startPromise_ = startCommandQueueManager_();
        cancelCmdsPromise_ = commandQueueManager_.cancelAllCommands();
      });
      it('should cancel a never-ending command promise', function() {
        startPromise_ = startCommandQueueManager_();
        failOnSettle_(
            commandQueueManager_.addCommand(new Promise(function() {})));
        commandQueueManager_.addCommand(
            createFakeQueueableCommand_(
                notExpectedToRunPhase_,
                notExpectedToRunPhase_));
        cancelCmdsPromise_ = commandQueueManager_.cancelAllCommands();
        return new PromiseTester(
            Promise.all([startPromise_, cancelCmdsPromise_]));
      });
    });

    var commands_;
    var optEvents_;
    var dcpEvents_;
    var locks_;
    var expectedOptEvents_;
    var expectedDcpEvents_;
    var commandQueueManager_;
    var cancelReason_;
    beforeEach(function() {
      commands_ = [];
      optEvents_ = [];
      dcpEvents_ = [];
      locks_ = {
        opt: false,
        dcp: false
      };
      expectedOptEvents_ = [];
      expectedDcpEvents_ = [];
      cancelReason_ = undefined;
      mockOutCoreFailureHandler_();
      commandQueueManager_ = CommandQueueManager.create();
      expect(commandQueueManager_.isStarted()).toBe(false);
      expect(commandQueueManager_.isEmpty()).toBe(true);
    });
    afterEach(function() {
      expect(optEvents_).toEqual(expectedOptEvents_);
      expect(dcpEvents_).toEqual(expectedDcpEvents_);
    });

    var exception_ = new Error('command threw exception');
    var coreFailure_ = CoreFailure.create({});

    function createFakeQueueableCommand_(optFn, dcpFn) {
      var command = QueueableCommand.create();

      function runPhase_(fn, lockName, cancelPromise) {
        // For a given phase (optimistic vs dcp), only one command can be
        // running at a time.
        expect(locks_[lockName]).toBe(false);
        locks_[lockName] = true;
        expect(TypeUtils.isPromise(cancelPromise)).toBe(true);
        cancelPromise.then(function() {
          jasmine.getEnv().currentSpec(
              new Error('cancelPromise should never fulfill'));
        });
        return PromiseUtils.cast(fn(cancelPromise)).then(function(value) {
          locks_[lockName] = false;
          return value;
        });
      }

      command.runOptimisticPhase = FunctionUtils.onceCallableFunction(
          runPhase_.bind(undefined, optFn, 'opt'));
      command.runDcpPhase = FunctionUtils.onceCallableFunction(
          runPhase_.bind(undefined, dcpFn, 'dcp'));

      return command;
    }

    function returningPhaseRun_(list, value) {
      list.push(value);
      return value;
    }

    function throwingPhaseRun_(list, value) {
      list.push(value);
      throw exception_;
    }

    function coreFailurePhaseRun_(list, value) {
      list.push(value);
      throw coreFailure_;
    }

    var cancelHandledEvent_ = 'cancel handled';
    function cancelHandlingPhaseRun_(list, value, cancelPromise) {
      list.push(value);
      return cancelPromise.catch(
          function(reason) {
            if (cancelReason_ === undefined) {
              cancelReason_ = reason;
            }
            expect(reason).toBe(cancelReason_);
            list.push(cancelHandledEvent_);
            throw reason;
          });
    }

    function makeExpectedToRunPhase_(fn, value, list, expectedList) {
      expectedList.push(value);
      return fn.bind(undefined, list, value);
    }

    function makeExpectedToCancelPhase_(value, list, expectedList) {
      var fn = makeExpectedToRunPhase_(
          cancelHandlingPhaseRun_, value, list, expectedList);
      expectedList.push(cancelHandledEvent_);
      return fn;
    }

    function makeExpectedToRunReturningOptPhase_(cmdIndex) {
      return makeExpectedToRunPhase_(returningPhaseRun_, 'opt' + cmdIndex,
          optEvents_, expectedOptEvents_);
    }

    function makeExpectedToRunReturningDcpPhase_(cmdIndex) {
      return makeExpectedToRunPhase_(returningPhaseRun_, 'dcp' + cmdIndex,
          dcpEvents_, expectedDcpEvents_);
    }

    function makeExpectedToRunThrowingOptPhase_(cmdIndex) {
      return makeExpectedToRunPhase_(throwingPhaseRun_, 'opt' + cmdIndex,
          optEvents_, expectedOptEvents_);
    }

    function makeExpectedToRunThrowingDcpPhase_(cmdIndex) {
      return makeExpectedToRunPhase_(throwingPhaseRun_, 'dcp' + cmdIndex,
          dcpEvents_, expectedDcpEvents_);
    }

    function makeExpectedToRunCoreFailureDcpPhase_(cmdIndex) {
      var fn = makeExpectedToRunPhase_(coreFailurePhaseRun_, 'dcp' + cmdIndex,
          dcpEvents_, expectedDcpEvents_);
      expectedDcpEvents_.push(coreFailureHandlerEvent_);
      return fn;
    }

    function blockUntilCancelledPhaseRun_(cancelPromise) {
      return cancelPromise;
    }

    function makeExpectedToCancelDcpPhase_(cmdIndex) {
      return makeExpectedToCancelPhase_('dcp' + cmdIndex, dcpEvents_,
          expectedDcpEvents_);
    }

    function makeExpectedToCancelOptPhase_(cmdIndex) {
      return makeExpectedToCancelPhase_('opt' + cmdIndex, optEvents_,
          expectedOptEvents_);
    }

    function notExpectedToRunPhase_() {
      jasmine.getEnv().currentSpec.fail(
          new Error('Command phase function not expected to run'));
    }

    function makeExpectedToRunCommands_(count) {
      for (var i = 0; i < count; i++) {
        commands_.push(createFakeQueueableCommand_(
            makeExpectedToRunReturningOptPhase_(i),
            makeExpectedToRunReturningDcpPhase_(i)));
      }
    }

    function startCommandQueueManager_() {
      expect(commandQueueManager_.isStarted()).toBe(false);
      var startPromise = commandQueueManager_.start();
      expect(commandQueueManager_.isStarted()).toBe(true);
      return startPromise;
    }

    function failOnSettle_(promise) {
      function failTest_(msg, value) {
        msg = 'Expected promise not to settle, ' + msg;
        console.error(msg, value);
        jasmine.getEnv().currentSpec.fail(msg);
      }

      PromiseUtils.cast(promise).then(
          failTest_.bind(undefined, 'but fulfilled'),
          failTest_.bind(undefined, 'but rejected'));
    }

    var coreFailureHandlerEvent_ = 'coreFailureHandled';
    function mockOutCoreFailureHandler_() {
      spyOn(CoreFailureHandler, 'handle').andCallFake(function(obj) {
        expect(obj).toBe(coreFailure_);
        // We should wait for optimistic phase to finish cleaning up before
        // CoreFailureHandler.handle has been called.
        expect(optEvents_).toEqual(expectedOptEvents_);
        return Promise.resolve().then(function() {
          dcpEvents_.push(coreFailureHandlerEvent_);
        });
      });
    }
  });
});
