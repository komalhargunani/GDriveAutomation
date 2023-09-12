/**
 * @fileoverview
 * Unit test to cover the Word getDocContent command.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/quickword/getDocContent',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/pubsub/pubsub'], function(
  CommandManager,
  GetDocContentCmd,
  ErrorCatcher,
  CorruptFileError,
  PubSub) {

  'use strict';

  describe('Word; "getDocContent" Command.', function() {

    var cmd_;

    beforeEach(function() {
      cmd_ = GetDocContentCmd.create('testId');
    });

    afterEach(function() {
      cmd_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.equal(
          cmd_.name, 'getDocContent',
          'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isFalse(
          cmd_.isOptimistic(),
          'getDocContent.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(
          cmd_.callsService(),
          'getDocContent.callsService()');
      });
    });

    describe('dcpData:', function() {
      it('Should override dcpData', function() {
        assert.isFunction(
          cmd_.dcpData,
          'getDocContent.dcpData()');
      });
      it('Should return the payload', function() {
        var expectedPayload = {
          name: 'gDC',
          pid: 'testId',
          shal: true
        };
        var payload = cmd_.dcpData();
        assert.deepEqual(
          payload, expectedPayload,
          'correct payload');
      });
    });

    describe('onSuccess:', function() {
      beforeEach(function() {
        sinon.spy(GetDocContentCmd, 'create');
        sinon.stub(PubSub, 'publish');
        sinon.stub(CommandManager, 'addCommand');
      });
      afterEach(function() {
        GetDocContentCmd.create.restore();
        PubSub.publish.restore();
        CommandManager.addCommand.restore();
      });
      it('Should override onSuccess', function() {
        assert.isFunction(
          cmd_.onSuccess,
          'getDocContent.onSuccess()');
      });
      it('Should signal when content is received', function() {
        cmd_.onSuccess({});
        assert.isTrue(
          PubSub.publish.calledOnce,
          'PubSub.publish called once by onSuccess');
        assert.isTrue(
          PubSub.publish.calledWith('qowt:contentReceived', {}),
          'PubSub.publish called with correct parameters by onSuccess');
      });
      it('Should reschedule when the content is not complete', function() {
        cmd_.onSuccess({});
        assert.isTrue(
          GetDocContentCmd.create.calledWith(undefined),
          'onSuccess creates a new command');
        assert.isTrue(
          CommandManager.addCommand.calledOnce,
          'onSuccess adds new command to the CommandManager');
      });
      it('Should signal when content is complete', function() {
        cmd_.onSuccess({end: true});
        assert.isTrue(
          PubSub.publish.calledTwice,
          'PubSub.publish called twice by onSuccess when content complete');
        assert.isTrue(
          PubSub.publish.calledWith('qowt:contentComplete', {complete: true}),
          'contentComplete signal is correctly published');
      });
    });

    describe('onFailure:', function() {
      var cmdNoId;
      beforeEach(function() {
        cmdNoId = GetDocContentCmd.create();
        sinon.spy(cmd_, 'onFailure');
        sinon.stub(ErrorCatcher, 'handleError');
      });
      afterEach(function() {
        cmd_.onFailure.restore();
        ErrorCatcher.handleError.restore();
        cmdNoId = undefined;
      });
      it('Should override onFailure', function() {
        assert.isFunction(
          cmd_.onFailure,
          'getDocContent.onFailure()');
      });
      it('Should throw a fatal CorruptFileError', function() {
        // See http://chaijs.com/api/assert/ for assert.throw documentation
        assert.throws(
          function() {
            cmdNoId.onFailure({e: 'expected test error'}, {});
          },
          CorruptFileError, undefined,
          'onFailure throws CorruptFileError'
        );
      });
      it('Should handle a non-fatal QOWTError ' +
         'if content was already received', function() {
        var policy = {};
        cmd_.onFailure({e: 'expected test error'}, policy);
        assert.isTrue(
          ErrorCatcher.handleError.calledOnce,
          'ErrorCatcher handles onFailure errors after content received');
        assert.deepEqual(
          policy, {ignoreError: true},
          'onFailure updates the error policy');
      });
    });

  });

});
