define([
  'qowtRoot/commands/quickpoint/getThemes',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/cssManager'
], function(
    GetThemeCmd,
    ContentRenderError,
    PubSub,
    CSSManager) {

  'use strict';

  describe('Point: "getThemes" Command', function() {
    var cmd_;

    beforeEach(function() {
      cmd_ = GetThemeCmd.create();
    });

    afterEach(function() {
      cmd_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'getThemes', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isFalse(cmd_.isOptimistic(), 'getThemes.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(cmd_.callsService(), 'getThemes.callsService()');
      });
    });

    describe('create:', function() {
      it('should implement the onSuccess and onFailure hooks', function() {
        assert.isFunction(cmd_.onSuccess, 'getThemes.onSuccess()');
        assert.isFunction(cmd_.onFailure, 'getThemes.onFailure()');
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
        assert.isFunction(cmd_.dcpData, 'getThemes.dcpData()');
      });

      it('should return a JSON object', function() {
        assert.isObject(data_, 'dcp data is an object');
      });

      it('should define the name property', function() {
        assert.strictEqual(data_.name, 'gThms', 'name values are equal');
      });
    });

    describe('onSuccess:', function() {
      it('should call flushCache', function() {
        sinon.stub(CSSManager, 'flushCache');
        cmd_.onSuccess();
        assert.isTrue(CSSManager.flushCache.calledOnce, 'flush cache');
        CSSManager.flushCache.restore();
      });
    });

    describe('onFailure:', function() {
      it('should implement the onFailure hook', function() {
        assert.isFunction(cmd_.onFailure, 'getThemes.onFailure()');
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
