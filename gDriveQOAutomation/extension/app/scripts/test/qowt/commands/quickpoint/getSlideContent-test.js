define([
  'qowtRoot/api/pointAPI',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/quickpoint/getSlideContent',
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/models/env',
  'qowtRoot/models/point',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/variants/comms/transport'
], function(
    PointAPI,
    CommandManager,
    GetSlideContentCmd,
    AnimationContainer,
    ContentRenderError,
    EnvModel,
    PointModel,
    LayoutsManager,
    PubSub,
    DomListener,
    Transport) {

  'use strict';

  describe('Point "getSlideContent" command', function() {

    var rootNode_, cmd_, slideNumber_;

    beforeEach(function() {
      PointModel.slideTransitions = [{
        'effect': {
          'type': 'cut'
        }
      }];
      rootNode_ = {
        appendChild: function() {}
      };

      slideNumber_ = 1;
      cmd_ = GetSlideContentCmd.create(rootNode_, slideNumber_);

      // it is not necessary to send requests, so prevent it
      sinon.stub(CommandManager, 'addCommand');
      sinon.stub(Transport, 'sendMessage');
    });

    afterEach(function() {
      cmd_ = undefined;
      rootNode_ = undefined;
      slideNumber_ = undefined;
      PointModel.slideTransitions = [];

      CommandManager.addCommand.restore();
      Transport.sendMessage.restore();
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'getSlideContent', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isFalse(cmd_.isOptimistic(), 'getSlideContent.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(cmd_.callsService(), 'getSlideContent.callsService()');
      });
    });

    describe('dcpData:', function() {
      var dcpData_;
      beforeEach(function() {
        dcpData_ = cmd_.dcpData();
      });

      afterEach(function() {
        dcpData_ = undefined;
      });

      it('should be implemented', function() {
        assert.isFunction(cmd_.dcpData, 'getSlideContent.dcpData()');
      });

      it('should return a JSON object', function() {
        assert.isObject(dcpData_, 'dcp data is an object');
      });

      it('should define the name property', function() {
        assert.strictEqual(dcpData_.name, 'gSld', 'command names are equal');
      });

      it('should define the sn(slide number) property', function() {
        assert.strictEqual(dcpData_.sn, 1, 'slide numbers are equal');
      });
    });

    describe('preExecuteHook:', function() {
      it('should be implemented', function() {
        assert.isFunction(cmd_.preExecuteHook,
            'getSlideContent.preExecuteHook()');
      });

      it('should set dcp slide index', function() {
        sinon.stub(AnimationContainer, 'setDcpSlideIndex');
        cmd_.preExecuteHook();
        assert.isTrue(AnimationContainer.setDcpSlideIndex.calledOnce,
            'cmd_.preExecuteHook() called once');
        assert.isTrue(AnimationContainer.setDcpSlideIndex.calledWith(0),
            'cmd_.preExecuteHook() called with correct parameters');
        AnimationContainer.setDcpSlideIndex.restore();
      });
    });

    describe('onSuccess:', function() {
      beforeEach(function() {
        sinon.stub(PointAPI, 'getSlide');
        sinon.stub(DomListener, 'dispatchEvent');
      });

      afterEach(function() {
        PointAPI.getSlide.restore();
        DomListener.dispatchEvent.restore();
      });

      it('should implement the onSuccess hook', function() {
        assert.isFunction(cmd_.onSuccess, 'getSlideContent.onSuccess()');
      });

      it('should dispatch -qowt:slideLoaded- event', function() {
        EnvModel.rootNode = {id: 'some root node'};
        cmd_.onSuccess({});

        var expectedResponse = {'root': rootNode_, 'sn': slideNumber_};
        assert.isTrue(DomListener.dispatchEvent.calledOnce,
            'dispatchEvent() called once');
        assert.deepEqual(DomListener.dispatchEvent.firstCall.args[0],
            EnvModel.rootNode, 'event dispatched for correct element');
        assert.strictEqual(DomListener.dispatchEvent.firstCall.args[1],
            'qowt:slideLoaded', 'event dispatched with correct event name');
        assert.deepEqual(DomListener.dispatchEvent.firstCall.args[2],
            expectedResponse, 'event dispatched with correct event data');
      });

      it('should call LayoutsManager', function() {
        sinon.stub(LayoutsManager, 'preSlideClone');

        cmd_.onSuccess({});

        assert.isTrue(LayoutsManager.preSlideClone.calledOnce,
            'preSlideClone() called once');
        LayoutsManager.preSlideClone.restore();
      });

      it('should update slideTransitions in PointModel when transition data ' +
          'is received in response', function() {
            PointModel.slideTransitions[0] = undefined;
            var response = {
              elm: [{
                transition: {effect: 'some effect'}
              }]
            };
            cmd_.onSuccess(response);
            assert.deepEqual(PointModel.slideTransitions[0],
                response.elm[0].transition, 'transition data added properly');
          });

      it('should update slideTransitions in PointModel with default ' +
          'transition when transition data is not received in response',
          function() {
            PointModel.slideTransitions[0] = undefined;
            var defaultTransition = {
              'effect': {
                'type': 'cut'
              },
              'spd': 'fast'
            };
            var response = {
              elm: [{}]
            };
            cmd_.onSuccess(response);
            assert.deepEqual(PointModel.slideTransitions[0],
                defaultTransition, 'default transition data added properly');
          });
    });

    describe('onFailure:', function() {
      var failureResponse_ = {
        e: 'some error'
      };

      beforeEach(function() {
        sinon.stub(ContentRenderError, 'create').returns(failureResponse_);
        sinon.stub(PubSub, 'publish');
      });

      afterEach(function() {
        ContentRenderError.create.restore();
        PubSub.publish.restore();
      });

      it('should implement the onFailure hook', function() {
        assert.isFunction(cmd_.onFailure, 'getSlideContent.onFailure()');
      });

      it('should let framework deal with generic errors and not broadcast ' +
          'anything itself', function() {
            cmd_.onFailure(failureResponse_);
            assert.isTrue(ContentRenderError.create.calledOnce, 'content ' +
                'render error');
          });

      it('should generate a fatal error in onFailure if slide number is ' +
          'not present', function() {
            var expectedResponse = {
              e: 'some error',
              fatal: true
            };
            cmd_ = GetSlideContentCmd.create(rootNode_);
            cmd_.onFailure(failureResponse_);

            assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
                'PubSub.publish called with correct eventType');
            assert.deepEqual(PubSub.publish.firstCall.args[1], expectedResponse,
                'PubSub.publish called with correct error data');
          });

      it('should generate a non-fatal error in onFailure if slide number is ' +
          'present', function() {
            var expectedResponse = {
              e: 'some error',
              fatal: false
            };

            cmd_.onFailure(failureResponse_);

            assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
                'PubSub.publish called with correct eventType');
            assert.deepEqual(PubSub.publish.firstCall.args[1], expectedResponse,
                'PubSub.publish called with correct error data');
          });

      it('should dispatch the event if error policy is defined', function() {
        var errorPolicy = {};
        cmd_.onFailure({}, errorPolicy);
        assert.isTrue(errorPolicy.eventDispatched, 'dispatch event');
      });
    });
  });
});
