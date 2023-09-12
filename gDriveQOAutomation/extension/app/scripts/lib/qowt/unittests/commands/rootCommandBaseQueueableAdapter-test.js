// Copyright 2013 Google Inc. All Rights Reserved.

define([
  'qowtRoot/utils/functionUtils',
  'qowtRoot/promise/testing/promiseTester',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/rootCommandBaseQueueableAdapter',
  'qowtRoot/commands/queueableCommand'
], function(
    FunctionUtils,
    PromiseTester,
    CommandBase,
    RootCommandBaseQueueableAdapter,
    QueueableCommand) {

  'use strict';

  describe('commands/rootCommandBaseQueueableAdapter.js', function() {
    describe('methods that don\'t call back into compound factory',
        function() {
      afterEach(function() {
        expect(callsToCompoundFactory).toEqual(0);
      });

      describe('phases', function() {
        describe('optimistic phase', function() {
          it('should dispatch directly to optimistic future', function() {
            expect(events).toEqual([]);
            expect(queueableCommand.runOptimisticPhase(cancelPromise))
                .toBe(expectedOptPhaseRetval);
            expect(events).toEqual([kOPT_EVT]);
          });
        });

        describe('dcp phase', function() {
          it('should dispatch directly to DCP future', function() {
            expect(events).toEqual([]);
            expect(queueableCommand.runDcpPhase(cancelPromise))
                .toBe(expectedDcpPhaseRetval);
            expect(events).toEqual([kDCP_EVT]);
          });
        });
      });

      describe('toString', function() {
        it('should dispatch toString to underlying commandBase name',
            function() {
          expect(queueableCommand.toString()).toEqual(kCMD_NAME);
        });
      });
    });

    describe('getInverse', function() {
      it('should have hasInverse=false when canInvert = false', function() {
        commandBase.canInvert = false;
        expect(queueableCommand.hasInverse()).toBe(false);
        expect(callsToCompoundFactory).toBe(0);
      });

      describe('invertibles', function() {
        var expectedCallsToCompoundFactory;
        beforeEach(function() {
          expectedCallsToCompoundFactory = -1;
          commandBase.canInvert = true;
        });
        afterEach(function() {
          expect(queueableCommand.hasInverse()).toBe(true);
          return new PromiseTester(queueableCommand.getInverse())
              .expectThen(expectedInverseQueueableCommand)
              .onlyThen(function() {
                expect(callsToCompoundFactory).toBe(
                    expectedCallsToCompoundFactory);
              });
        });

        describe('returning queueable command', function() {
          beforeEach(function() {
            expectedCallsToCompoundFactory = 0;
          });

          it('should pass-through QueueableCommand returned by ' +
              'command.getInverse', function() {
            commandBase.getInverse = FunctionUtils.makeConstantFunction(
                expectedInverseQueueableCommand);
          });

          it('should join QueuableCommand promise returned by ' +
              'command.getInverse', function() {
            commandBase.getInverse = FunctionUtils.makeConstantFunction(
                Promise.resolve(expectedInverseQueueableCommand));
          });
        });

        describe('returning command base', function() {
          beforeEach(function() {
            expectedCallsToCompoundFactory = 1;
          });

          it('should convert CommandBase returned by ' +
              'command.getInverse', function() {
            commandBase.getInverse = FunctionUtils.makeConstantFunction(
                inverseCommandBase);
          });

          it('should transfrom QueuableCommand promise returned by ' +
              'command.getInverse', function() {
            commandBase.getInverse = FunctionUtils.makeConstantFunction(
                Promise.resolve(inverseCommandBase));
          });
        });
      });
    });


    var events;
    beforeEach(function() {
      events = [];
    });

    var commandBase;
    var inverseCommandBase;
    var queueableCommand;
    var expectedInverseQueueableCommand;
    beforeEach(function() {
      commandBase = createCommandBase_();
      inverseCommandBase = createCommandBase_();

      queueableCommand = RootCommandBaseQueueableAdapter.create(
          commandBase, compoundFactory_);
      expectedInverseQueueableCommand = QueueableCommand.create();
    });

    var kOPT_EVT = 'optimistic';
    var kDCP_EVT = 'dcp';
    var kCMD_NAME = 'cmdName';

    function createCommandBase_() {
      var commandBase = CommandBase.create(kCMD_NAME);

      commandBase.runOptimisticPhase = FunctionUtils.onceCallableFunction(
          function(actualCancelPromise) {
            expect(actualCancelPromise).toBe(cancelPromise);
            events.push(kOPT_EVT);
            return expectedOptPhaseRetval;
          });

      commandBase.runDcpPhase = FunctionUtils.onceCallableFunction(
          function(actualCancelPromise) {
            expect(actualCancelPromise).toBe(cancelPromise);
            events.push(kDCP_EVT);
            return expectedDcpPhaseRetval;
          });

      function shouldNotCall() {
        throw new Error(
            'This method on commandBase should not have been called');
      }

      commandBase.getChildren = shouldNotCall;
      commandBase.addChild = shouldNotCall;
      commandBase.childCount = shouldNotCall;
      commandBase.setParent = shouldNotCall;
      commandBase.parent = shouldNotCall;
      commandBase.isRootCommand = shouldNotCall;
      commandBase.makeNullCommand = shouldNotCall;

      return commandBase;
    }

    var callsToCompoundFactory;
    beforeEach(function() {
      callsToCompoundFactory = 0;
    });

    function compoundFactory_(actualInverseCommandBase) {
      expect(actualInverseCommandBase).toBe(inverseCommandBase);
      callsToCompoundFactory++;
      return expectedInverseQueueableCommand;
    }
  });

  var cancelPromise = Promise.reject();
  var expectedOptPhaseRetval = {};
  var expectedDcpPhaseRetval = Promise.resolve();
});

