define([
  'qowtRoot/commands/quickpoint/getStyles',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/cssManager'
], function(
    GetStylesCmd,
    ContentRenderError,
    PubSub,
    CSSManager) {

  'use strict';

  describe('Point: "getStyles" Command', function() {
    var cmd_;

    beforeEach(function() {
      cmd_ = GetStylesCmd.create();
    });

    afterEach(function() {
      cmd_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'getStyles', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isFalse(cmd_.isOptimistic(), 'getStyles.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(cmd_.callsService(), 'getStyles.callsService()');
      });
    });

    describe('preExecuteHook:', function() {
      it('should be implemented', function() {
        assert.isFunction(cmd_.preExecuteHook, 'getStyles.preExecuteHook()');
      });
    });

    describe('dcpData:', function() {

      var data_;

      beforeEach(function() {
        data_ = cmd_.dcpData();
      });

      afterEach(function() {
        data_ = undefined;
      });

      it('should be implemented', function() {
        assert.isFunction(cmd_.dcpData, 'getStyles.dcpData()');
      });

      it('should return a JSON object', function() {
        assert.isObject(data_, 'dcp data is an object');
      });

      it('should define the name property', function() {
        assert.strictEqual(data_.name, 'gStls', 'name values are equal');
      });
    });

    describe('onSuccess:', function() {
      it('should implement the onSuccess hook', function() {
        assert.isFunction(cmd_.onSuccess, 'getStyles.onSuccess()');
      });

      it('should call flushCache', function() {
        sinon.stub(CSSManager, 'flushCache');
        cmd_.onSuccess();
        assert.isTrue(CSSManager.flushCache.calledOnce, 'flush cache');
        CSSManager.flushCache.restore();
      });
    });

    describe('onFailure:', function() {
      it('should implement the onFailure hook', function() {
        assert.isFunction(cmd_.onFailure, 'getStyles.onFailure()');
      });

      it('should generate a fatal error and let framework deal with generic ' +
          'errors and not broadcast anything itself', function() {

            var response = {
              e: 'bogusError'
            };

            var expectedResponse = {
              e: 'bogusError',
              fatal: true
            };

            sinon.stub(ContentRenderError, 'create').returns(response);
            sinon.stub(PubSub, 'publish');

            cmd_.onFailure(response, {});

            assert.isTrue(ContentRenderError.create.calledOnce, 'content ' +
                'render error created');

            assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
                'PubSub.publish called with correct event type');

            assert.deepEqual(PubSub.publish.firstCall.args[1], expectedResponse,
                'PubSub.publish called with correct event data');

            ContentRenderError.create.restore();
            PubSub.publish.restore();
          });

      it('should dispatch the event if error policy is defined', function() {
        var errorPolicy = {};
        cmd_.onFailure({}, errorPolicy);
        assert.isTrue(errorPolicy.eventDispatched, 'dispatch event');
      });
    });
  });
});
