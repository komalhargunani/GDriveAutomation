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
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/variants/comms/transport',
  'qowtRoot/commands/commandBase',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/dcp/dcpManager',
  'qowtRoot/fixtures/mocks/commands/optimisticOnly',
  'qowtRoot/fixtures/mocks/commands/nonOptimistic',
  'qowtRoot/fixtures/mocks/commands/optimistic',
  'qowtRoot/commands/coreFailure',
  'qowtRoot/commands/revertManager',
  'qowtRoot/models/env',
  'qowtRoot/promise/testing/promiseTester',
  'qowtRoot/promise/deferred'
], function(
    UnittestUtils,
    Transport,
    CommandBase,
    PubSub,
    DcpManager,
    OptimisticOnlyCmd,
    NonOptimisticCmd,
    OptimisticCmd,
    CoreFailure,
    RevertManager,
    EnvModel,
    PromiseTester,
    Deferred) {

  'use strict';

  describe('QOWT/commands/commandBase.js', function() {
    beforeEach(function() {
      RevertManager.reset();
      EnvModel.rootNode = document.createElement('div');
    });

    // a cancel promise that never fulfills or rejects.
    var pendingCancelPromise = (new Deferred()).promise;

    describe('basic tests', function() {
      var command;
      beforeEach(function() {
        command = CommandBase.create();
      });

      describe('parent-child manipulation', function() {
        describe('child manipulation', function() {
          var expectedChildCommands;

          var addSampleCommands = function(list, opt_optimistic) {
            for (var i = 0; i < 5; i++) {
              var childCommand = CommandBase.create('sample', opt_optimistic);
              list.push(childCommand);
              command.addChild(childCommand);
            }
          };

          beforeEach(function() {
            expectedChildCommands = [];
            addSampleCommands(expectedChildCommands);
          });

          it('should return children on getChildren', function() {
            expect(command.getChildren()).toEqual(expectedChildCommands);
          });

          it('childCount should return number of children', function() {
            expect(command.childCount()).toEqual(expectedChildCommands.length);
          });
        });

        describe('parent manipulation', function() {
          it('should have parent, setParent, and isRootCommand', function() {
            expect(command.parent()).toBeUndefined();
            expect(command.isRootCommand()).toBe(true);
            var parent = CommandBase.create();
            command.setParent(parent);
            expect(command.parent()).toBe(parent);
            expect(command.isRootCommand()).toBe(false);
          });
        });
      });

      describe('once-callable runners tests', function() {
        it('should throw on second call to runOptimisticPhase', function() {
          command.runOptimisticPhase(pendingCancelPromise);
          expect(
              command.runOptimisticPhase.bind(command, pendingCancelPromise))
                  .toThrow();
        });
        it('should throw on second call to runDcpPhase', function() {
          command.runDcpPhase(pendingCancelPromise);
          expect(
              command.runDcpPhase.bind(command, pendingCancelPromise))
                  .toThrow();
        });
      });
    });

    var _rootNode, _testAppendArea, _listeners;
    beforeEach(function() {
      _listeners = [];

      _rootNode = document.createElement('DIV');
      _rootNode.id = 'qowtCommand-test';

      _testAppendArea = UnittestUtils.createTestAppendArea();
      _testAppendArea.appendChild(_rootNode);
    });
    afterEach(function() {
      // Unsubscribe any and all PubSub subscriptions
      if (_listeners && _listeners.length > 0) {
        for (var x = 0; x < _listeners.length; x++) {
          PubSub.unsubscribe(_listeners[x]);
        }
      }

      UnittestUtils.removeTestAppendArea();
      _testAppendArea = undefined;
      _rootNode = undefined;
    });

    var _executeCommand = function(cmd, thenFn, config) {
      var expectingDcpCancel = !!(config && config.expectingDcpCancel);
      var optimisticPromise = cmd.runOptimisticPhase(pendingCancelPromise);
      var dcpPromise = cmd.runDcpPhase(pendingCancelPromise);

      runs(function() {
        return new PromiseTester(optimisticPromise).onlyThen(function() {
          function dcpDone(dcpResult) {
            cmd.commandTreeDone();
            if (thenFn) {
              thenFn(dcpResult);
            }
          }

          var promiseTester = new PromiseTester(dcpPromise);
          return expectingDcpCancel ?
              promiseTester.onlyCatch(dcpDone) :
              promiseTester.onlyThen(dcpDone);
        });
      });
    };

    var _executeOptimistic = function(cmd, thenFn) {
      runs(function() {
        return new PromiseTester(cmd.runOptimisticPhase(pendingCancelPromise))
            .then(thenFn);
      });
    };

    describe('creation', function() {
      it('should correctly initialise default empty command placeholders.',
         function() {
           var cmd = CommandBase.create();
           expect(cmd.name).not.toBeDefined();
           expect(cmd.id()).toBeDefined();
           expect(cmd.isOptimistic()).toBeTruthy();
           expect(cmd.callsService()).toBeFalsy();
           expect(cmd).toBeOptimisticIdle();
           expect(cmd).toBeResponseIdle();
         });
      it('should correctly initialise a real command', function() {
        var cmd = CommandBase.create('newCommand', false, true);
        expect(cmd.name).toBe('newCommand');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBeFalsy();
        expect(cmd.callsService()).toBeTruthy();
        expect(cmd).toBeOptimisticIdle();
        expect(cmd).toBeResponseIdle();
      });
    });
    describe('initiate', function() {
      it('should trigger optimistic handling', function() {
        var cmd = OptimisticCmd.create();
        spyOn(cmd, 'doOptimistic');
        _executeOptimistic(cmd, function() {
          expect(cmd.doOptimistic).wasCalled();
        });
      });
    });
    describe('add child command', function() {
      var cmdBucket, cmd;
      beforeEach(function() {
        cmdBucket = CommandBase.create();
        cmd = CommandBase.create('childName', false, false, 'addChildCmd');
        expect(cmdBucket.childCount()).toBe(0);
      });
      it('should not add invalid command objects', function() {
        // So here are a bunch of things that are not valid commands,
        // but we're gonna try and add them as if they are.
        var cmd1 = 'string';
        var cmd2 = 45;
        var cmd3 = function() {
          var x = 'bogus';
          return x;
        };
        var cmd4 = {};

        // In every case we should see no new child commands added
        expect(cmdBucket.addChild.bind(this, cmd1)).toThrow();
        expect(cmdBucket.childCount()).toBe(0);

        expect(cmdBucket.addChild.bind(this, cmd2)).toThrow();
        expect(cmdBucket.childCount()).toBe(0);

        expect(cmdBucket.addChild.bind(this, cmd3)).toThrow();
        expect(cmdBucket.childCount()).toBe(0);

        expect(cmdBucket.addChild.bind(this, cmd4)).toThrow();
        expect(cmdBucket.childCount()).toBe(0);

        cmdBucket.addChild(cmd);
        expect(cmdBucket.childCount()).toBe(1);
      });
      it('should add to the command child count when valid commands are added',
         function() {
           cmdBucket.addChild(cmd);
           expect(cmdBucket.childCount()).toBe(1);

           // Arguably should not be able to add the same command more than
           // once. Could track id history, but this is likely overkill.
           cmdBucket.addChild(cmd);
           expect(cmdBucket.childCount()).toBe(2);
         });
      it('should set parent reference into the added child command',
         function() {
           cmdBucket.addChild(cmd);
           expect(cmd.parent()).toBeDefined();
           expect(cmd.parent().id()).toBe(cmdBucket.id());
         });
      it('should disallow adding children after the command tree is done',
          function() {
            cmdBucket.commandTreeDone();
            expect(cmdBucket.addChild.bind(this, cmd)).toThrow();
          });
    });
    describe('isRootCommand', function() {
      it('should return return true for an individual command', function() {
        var cmd = OptimisticOnlyCmd.create();
        expect(cmd.isRootCommand()).toBeTruthy();

        cmd = undefined;
        cmd = NonOptimisticCmd.create();
        expect(cmd.isRootCommand()).toBeTruthy();
      });
      it('should return true for a command that is the root of a ' +
          'compound command', function() {
            var cmd = OptimisticOnlyCmd.create();
            var child = OptimisticOnlyCmd.create();
            cmd.addChild(child);
            expect(cmd.isRootCommand()).toBeTruthy();
          });
      it('should return false for a command that participates as a child in ' +
          'a compound command', function() {
            var cmd = OptimisticOnlyCmd.create();
            var child = OptimisticOnlyCmd.create();
            cmd.addChild(child);
            expect(child.isRootCommand()).toBeFalsy();
          });
    });
    describe('optimistic processing loop', function() {
      it('should not optimistically render default empty command', function() {
        var cmd = CommandBase.create();
        cmd.doOptimistic = function() {
          return true;
        };
        spyOn(cmd, 'doOptimistic');
        _executeOptimistic(cmd, function() {
          expect(cmd.doOptimistic).wasNotCalled();
        });
      });
      it('should set optimistic state to complete after optimistic ' +
          'processing completed.', function() {
            var cmd1 = OptimisticOnlyCmd.create();
            _executeOptimistic(cmd1);
          });
      it('should invoke _api.doOptimistic', function() {
        var cmd1 = OptimisticOnlyCmd.create();
        cmd1.doOptimistic = function() {
          cmd1.makeNullCommand();
        };
        spyOn(cmd1, 'doOptimistic').andCallThrough();
        _executeCommand(cmd1, function() {
          expect(cmd1.doOptimistic).wasCalled();
          expect(cmd1.isOptimistic()).toBeFalsy();
        });
      });
      it('should not publish cmd start execute', function() {
        var cmd =NonOptimisticCmd.create('myCommand');
        var evtCount = 0;
        var callback = function() {
          evtCount++;
        };
        _listeners.push(PubSub.subscribe('qowt:cmdStartExecute', callback));
        expect(evtCount).toBe(0);
        _executeOptimistic(cmd, function() {
          expect(evtCount).toBe(0);
        });
      });
      it('should pass the return value of doOptimistic through', function() {
        var cmd1 = OptimisticOnlyCmd.create();
        var retval = {};
        cmd1.doOptimistic = function() {
          return retval;
        };
        expect(cmd1.runOptimisticPhase(pendingCancelPromise)).toBe(retval);
      });
    });
    describe('asynchronous service loop', function() {
      var cmd1;
      var turnId;
      beforeEach(function() {
        cmd1 = CommandBase.create('myCommand');
        turnId = 0;
        _setupTransport();
      });
      function waitTurn() {
        var expectedTurnId = turnId + 1;
        setTimeout(function() {
          turnId++;
        }, 0);
        waitsFor(function() {
          return turnId !== expectedTurnId;
        }, 'next turn', 5000);
      }
      it('should wait for optimistic future to finish before starting DCP',
          function() {
            var evtCount = 0;
            var callback = function() {
              evtCount++;
            };
            _listeners.push(PubSub.subscribe('qowt:cmdStartExecute', callback));
            expect(evtCount).toBe(0);

            cmd1 = NonOptimisticCmd.create('myCommand');

            var dcpPromise = cmd1.runDcpPhase(pendingCancelPromise);

            expect(evtCount).toBe(0);

            // This should flush all microtask work.
            waitTurn();

            runs(function() {
              expect(evtCount).toBe(0);
              return new PromiseTester(
                  cmd1.runOptimisticPhase(pendingCancelPromise));
            });

            runs(function() {
              return dcpPromise;
            });

            runs(function() {
              expect(evtCount).toBe(1);
            });
          });
      it('should broadcast a START-EXECUTE command signal containing ' +
          'the command', function() {
            var _event, _detail;
            var callback = function(signal, detail) {
              _event = signal;
              _detail = detail;
            };
            _listeners.push(PubSub.subscribe('qowt:cmdStartExecute', callback));

            cmd1 = NonOptimisticCmd.create('myCommand');
            _executeCommand(cmd1, function() {
              expect(_event).toBe('qowt:cmdStartExecute');
              expect(_detail).toBeDefined();
              if (_detail) {
                expect(_detail.name).toBe('myCommand');
              }
            });
          });
      it('should broadcast a command-specific START event', function() {
        var _event;
        var callback = function(signal) {
          _event = signal;
        };

        cmd1 = NonOptimisticCmd.create('myCommand');
        _listeners.push(PubSub.subscribe('qowt:cmdmyCommandStart', callback));
        _executeCommand(cmd1, function() {
          expect(_event).toBe('qowt:cmdmyCommandStart');
        });
      });
      it('should invoke command-specific preExecuteHook if provided',
         function() {
           cmd1 = NonOptimisticCmd.create();
           cmd1.preExecuteHook = function() {
             return true;
           };
           spyOn(cmd1, 'preExecuteHook');

           _executeCommand(cmd1, function() {
             expect(cmd1.preExecuteHook).wasCalled();
           });
         });
      it('should pass service-based commands to the service', function() {
        // Testing a service-based command is sent to the service
        cmd1 = NonOptimisticCmd.create();
        _executeCommand(cmd1, function() {
          expect(Transport.sendMessage).wasCalled();
        });
      });
      it('should not send non-service based commands to the service',
         function() {
           // Testing a non-service-based command is not sent to the service
           CommandBase.create('bogusCommand', undefined, false, 'test');
           _executeCommand(cmd1, function() {
             expect(Transport.sendMessage).wasNotCalled();
           });
         });
    });
    describe('makeNullCommand API', function() {
      var cmd;
      beforeEach(function() {
        // Add an element to the content so we can check optimistic processing
        var span = document.createElement('span');
        span.id = 't1';
        span.textContent = 'Hellorld';
        _rootNode.appendChild(span);
      });
      describe('makeNullCommand on commands that haven\'t run yet', function() {
        afterEach(function() {
          expect(cmd).toBeResponseIdle();
          _executeCommand(cmd, function() {
            // executing without setting up fake transport, so if the command
            // sends a message to transport, it will never get a response.
          });
        });
        it('should make an empty command status response-complete and ' +
            'optimistic-unmodfied', function() {
              cmd = CommandBase.create();
              cmd.makeNullCommand();

              expect(cmd.callsService()).toBeFalsy();
              expect(cmd).toBeOptimisticIdle();
            });
        it('should nullify non-optimistic/non-service commands', function() {
          cmd = CommandBase.create('non-opt', false, false);
          cmd.makeNullCommand();

          expect(cmd.callsService()).toBeFalsy();
          expect(cmd).toBeOptimisticIdle();
        });
        it('should nullify optimistic, service commands', function() {
          cmd = OptimisticCmd.create();
          cmd.makeNullCommand();

          expect(cmd.isOptimistic()).toBeFalsy();
          expect(cmd.callsService()).toBeFalsy();
          expect(cmd).toBeOptimisticIdle();
        });
        it('should nullify optimistic, non-service commands', function() {
          cmd = OptimisticOnlyCmd.create();
          cmd.makeNullCommand();

          expect(cmd.isOptimistic()).toBeFalsy();
          expect(cmd.callsService()).toBeFalsy();
          expect(cmd).toBeOptimisticIdle();
        });
        it('should nullify non-optimistic, service commands', function() {
          cmd = NonOptimisticCmd.create();
          cmd.makeNullCommand();

          expect(cmd.isOptimistic()).toBeFalsy();
          expect(cmd.callsService()).toBeFalsy();
          expect(cmd).toBeOptimisticIdle();
        });
      });
      it('should work when called within optimistic render loop', function() {
        cmd = OptimisticCmd.create();
        cmd.doOptimistic = function() {
          cmd.makeNullCommand();
        };

        _executeOptimistic(cmd, function() {
          expect(cmd.callsService()).toBeFalsy();
        });
      });
    });
    describe('reverting', function() {
      beforeEach(function() {
        // Add an element to the content so we can check optimistic processing
        var span = document.createElement('span');
        span.id = 't1';
        span.textContent = '';
        _rootNode.appendChild(span);
      });
      it('should call doRevert if the command has completed optimistic ' +
          'processing', function() {
            var cmd = OptimisticOnlyCmd.create('cmd');

            spyOn(cmd, 'doRevert');

            _executeOptimistic(cmd, function() {
              RevertManager.revertAll();
              expect(cmd.doRevert).wasCalled();
            });
          });
      it('should no-op revert on a command that is non-optimistic', function() {
        var cmd = NonOptimisticCmd.create();
        expect(cmd.doRevert).toBeUndefined();
        cmd.doRevert = function() {
          throw new Error('revert should not have been called');
        };

        _executeOptimistic(cmd, function() {
          RevertManager.revertAll();
        });
      });
      it('should not revert commands that have completed', function() {
        _setupTransport();
        var cmd = NonOptimisticCmd.create();
        cmd.doRevert = function() {
          throw new Error('revert should not have been called');
        };
        _executeCommand(cmd, function() {
          RevertManager.revertAll();
        });
      });
    });
    describe('failure response processing', function() {
      it('should return failure on a solo command', function() {
        var expectedPayload = {foo: 'bar'};
        var expectedFailure = 'baz';
        var expectedResponse = {
          e: expectedFailure,
          baz: 'boo'
        };
        var expectedErrorPolicy = {
          boo: 'bar'
        };
        var cmd = CommandBase.create('cmd1', true, true);
        cmd.dcpData = function() {
          return expectedPayload;
        };
        cmd.onFailure = function(response, errorPolicy) {
          expect(response).toEqual(expectedResponse);
          errorPolicy.boo = expectedErrorPolicy.boo;
        };
        cmd.doOptimistic = function() {
          return true;
        };

        _setupTransport(expectedResponse, expectedPayload);

        _executeCommand(cmd, function(reason) {
          expect(CoreFailure.isInstance(reason)).toBe(true);
          expect(reason.error).toEqual(expectedFailure);
          expect(reason.errorPolicy).toEqual(expectedErrorPolicy);
        }, {expectingDcpCancel: true});
      });
      it('should invoke the "success" response path for responses that ' +
          'are ignored', function() {
            var _event, _detail;
            var expectedPayload = {foo: 'bar'};
            var expectedResponse = {
              e: 'nh',
              baz: 'boo'
            };
            var callback = function(signal, detail) {
              _event = signal;
              _detail = detail;
            };

            var cmd = NonOptimisticCmd.create('testCmdIgnoresAllErrors');
            cmd.dcpData = function() {
              return expectedPayload;
            };
            cmd.onFailure = function(response, errorPolicy) {
              expect(response).toBe(expectedResponse);
              errorPolicy.ignoreError = true;
              errorPolicy.boo = 'bar';
            };

            _setupTransport(expectedResponse, expectedPayload);

            _listeners.push(PubSub.subscribe(
                'qowt:cmdtestCmdIgnoresAllErrorsStop', callback));

            _executeCommand(cmd,function(reason) {
              expect(CoreFailure.isInstance(reason)).toBe(false);

              expect(_event).toBe('qowt:cmdtestCmdIgnoresAllErrorsStop');
              expect(_detail).toBeDefined();
              if (_detail) {
                expect(_detail.success).toBeTruthy();
              }
            });
          });
    });
    describe('success response processing', function() {

      beforeEach(function() {
        // Add an element to the content so we can check optimistic processing
        var span = document.createElement('span');
        span.id = 't1';
        span.textContent = 'Hellorld';
        _rootNode.appendChild(span);
      });
      it('should fulfill promise after processing response',
         function() {
           var cmd1 = NonOptimisticCmd.create();

           _setupTransport();
           _executeCommand(cmd1);
         });
      it('should broadcast a POST-EXECUTE command signal containing ' +
          'the command', function() {
            var _event, _detail;
            var localHandler = function(signal, detail) {
              _event = signal;
              if (detail) {
                _detail = detail;
              }
            };

            var cmd1 = NonOptimisticCmd.create('insertChar');
            _setupTransport();

            _listeners.push(PubSub.subscribe('qowt:cmdStopExecute',
                                             localHandler));
            cmd1.commandTreeDone();

            expect(_event).toBeDefined();
            if (_event) {
              expect(_event).toBe('qowt:cmdStopExecute');
              expect(_detail.name).toBe('insertChar');
            }
          });
      it('should invoke the responseHook method if provided by a command',
         function() {
           var cmd1 = NonOptimisticCmd.create();
           var expectedResponse = {
             foo: 'bar'
           };
           var modifiedResponse = {
             baz: 'boo'
           };

           cmd1.responseHook = function() {};

           spyOn(cmd1, 'responseHook').andCallFake(
               function(response) {
                 expect(response).toEqual(expectedResponse);
                 return modifiedResponse;
               });
           _setupTransport(expectedResponse);
           spyOn(DcpManager, 'processDcpResponse').andCallFake(
               function(res) {
                 expect(res).toBe(modifiedResponse);
                 return Promise.resolve();
               });

           _executeCommand(cmd1, function() {
             expect(DcpManager.processDcpResponse).wasCalled();
           });
         });
    });
  });

  describe('getInverse', function() {
    var cmd1;
    beforeEach(function() {
      cmd1 = NonOptimisticCmd.create();
    });
    it('should throw exception if canInvert is false', function() {
      cmd1.canInvert = false;
      expect(cmd1.getInverse).toThrow();
    });
  });

  var _setupTransport = function(response, expectedPayload) {
    if (!response) {
      response = {};
    }
    spyOn(Transport, 'sendMessage').andCallFake(
        function(payload, callback) {
          if (expectedPayload) {
            expect(payload).toEqual(expectedPayload);
          }
          callback(response);
        });
  };
});
