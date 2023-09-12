define([
  'qowtRoot/commands/quickpoint/getMasterLayout',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/models/point',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/cssManager',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/widgets/point/slidesContainer'
], function(
    GetMasterLayoutCmd,
    ContentRenderError,
    PointModel,
    LayoutsManager,
    PubSub,
    CSSManager,
    DeprecatedUtils,
    SlidesContainer) {

  'use strict';

  describe('Point: "getMasterLayout" Command', function() {

    var cmd_, rootNode_;
    beforeEach(function() {
      rootNode_ = {
        hasChildNodes: function() {
          return false;
        },
        appendChild: function() {}
      };
      cmd_ = GetMasterLayoutCmd.create(rootNode_, 1);
    });
    afterEach(function() {
      cmd_ = undefined;
      rootNode_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'getMasterLayout', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isFalse(cmd_.isOptimistic(), 'getMasterLayout.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(cmd_.callsService(), 'getMasterLayout.callsService()');
      });
    });

    describe('dcpData:', function() {
      var data_;

      beforeEach(function() {
        PointModel.MasterSlideId = 1;
        data_ = cmd_.dcpData();
      });

      afterEach(function() {
        PointModel.MasterSlideId = undefined;
        data_ = undefined;
      });

      it('should override dcpData', function() {
        assert.isFunction(cmd_.dcpData, 'getMasterLayout.dcpData()');
      });

      it('should return a JSON object', function() {
        assert.isObject(data_, 'dcp data is an object');
      });

      it('should define the name property', function() {
        assert.strictEqual(data_.name, 'gSldMt', 'name values are equal');
      });

      it('should define the eidmt property', function() {
        assert.strictEqual(data_.eidmt, 1, 'master eid values are equal');
      });
    });

    describe('preExecuteHook:', function() {
      var layoutManagerStub_, divToClone_ = {};
      beforeEach(function() {
        layoutManagerStub_ = sinon.stub(LayoutsManager,
            'isReRenderingCurrentSlide');
        PointModel.MasterSlideId = 1;
        PointModel.masterLayoutMap[PointModel.MasterSlideId] =
            { refDiv: divToClone_ };
      });

      afterEach(function() {
        PointModel.MasterSlideId = undefined;
        PointModel.masterLayoutMap = [];
        layoutManagerStub_.restore();
        layoutManagerStub_ = undefined;
      });

      it('should be implemented', function() {
        assert.isFunction(cmd_.preExecuteHook,
            'getMasterLayout.preExecuteHook()');
      });

      it('should reset thumb-to-slide maps', function() {
        sinon.stub(LayoutsManager, 'resetThumbToSlideMaps');
        cmd_.preExecuteHook();
        assert.isTrue(LayoutsManager.resetThumbToSlideMaps.calledOnce,
            'resetThumbToSlideMaps method called');
        LayoutsManager.resetThumbToSlideMaps.restore();
      });

      it('should clone and make null-command, when cached and not to be ' +
          're-rendered', function() {
            layoutManagerStub_.returns(false);
            sinon.stub(DeprecatedUtils, 'cloneAndAttach');
            sinon.stub(cmd_, 'makeNullCommand');
            cmd_.preExecuteHook();
            assert.isTrue(DeprecatedUtils.cloneAndAttach.calledOnce,
                'cloneAndAttach method called');
            assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[0],
                divToClone_, 'cloneAndAttach() called with correct clone div');
            assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[1],
                rootNode_, 'cloneAndAttach() called with correct root element');
            assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[2],
                '1cloned1',
                'cloneAndAttach() called with correct cloned div id');
            assert.isTrue(cmd_.makeNullCommand.calledOnce,
                'makeNullCommand method called');
            DeprecatedUtils.cloneAndAttach.restore();
            cmd_.makeNullCommand.restore();
          });

      it('should not clone or make null-command, when cached and to be ' +
          're-rendered', function() {
            layoutManagerStub_.returns(true);
            sinon.stub(DeprecatedUtils, 'cloneAndAttach');
            sinon.stub(cmd_, 'makeNullCommand');

            cmd_.preExecuteHook();
            assert.isTrue(DeprecatedUtils.cloneAndAttach.notCalled,
                'cloneAndAttach method not called');
            assert.isTrue(cmd_.makeNullCommand.notCalled,
                'makeNullCommand method not called');
            DeprecatedUtils.cloneAndAttach.restore();
            cmd_.makeNullCommand.restore();
          });

      it('should remove existing master layout div when to be re-rendered',
          function() {
            layoutManagerStub_.returns(true);
            sinon.stub(SlidesContainer, 'removeAddedLayout');

            cmd_.preExecuteHook();
            assert.isTrue(SlidesContainer.removeAddedLayout.calledOnce,
                'removeAddedLayout method called once');
            assert.strictEqual(SlidesContainer.removeAddedLayout.
                firstCall.args[0], rootNode_,
                'removeAddedLayout method called with correct root element');
            assert.strictEqual(SlidesContainer.removeAddedLayout.
                firstCall.args[1], 1,
                'removeAddedLayout method called with correct id');
            SlidesContainer.removeAddedLayout.restore();
          });

      it('should not clone slide if it is not cached ', function() {
        sinon.stub(DeprecatedUtils, 'cloneAndAttach');
        PointModel.masterLayoutMap[PointModel.MasterSlideId] = undefined;

        cmd_.preExecuteHook();
        assert.isTrue(DeprecatedUtils.cloneAndAttach.notCalled,
            'cloneAndAttach method not called');
        DeprecatedUtils.cloneAndAttach.restore();
      });
    });

    describe('onSuccess:', function() {
      it('should be implemented', function() {
        assert.isFunction(cmd_.onSuccess, 'getMasterLayout.onSuccess()');
      });

      it('should append the rootEl to the root element', function() {
        sinon.stub(rootNode_, 'appendChild');
        cmd_.onSuccess();
        assert.isTrue(rootNode_.appendChild.calledOnce,
            'appendChild() called once');
        assert.strictEqual(rootNode_.appendChild.firstCall.args[0], cmd_.rootEl,
            'appendChild() called with correct element');
        rootNode_.appendChild.restore();
      });

      it('should flush the CssManager cache', function() {
        sinon.stub(CSSManager, 'flushCache');
        cmd_.onSuccess();
        assert.isTrue(CSSManager.flushCache.calledOnce,
            'CssManager.flushCache called once');
        CSSManager.flushCache.restore();
      });
    });

    describe('onFailure:', function() {
      var failureResponse_ = {
        e: 'some error'
      };

      beforeEach(function() {
        sinon.stub(ContentRenderError, 'create').returns(failureResponse_);
      });

      afterEach(function() {
        ContentRenderError.create.restore();
      });

      it('should implement the onFailure hook', function() {
        assert.isFunction(cmd_.onFailure, 'getMasterLayout.onFailure()');
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
            sinon.stub(PubSub, 'publish');
            cmd_ = GetMasterLayoutCmd.create(rootNode_);
            cmd_.onFailure(failureResponse_);

            assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
                'PubSub.publish called with correct eventType');
            assert.deepEqual(PubSub.publish.firstCall.args[1], expectedResponse,
                'PubSub.publish called with correct error data');
            PubSub.publish.restore();
          });

      it('should generate a non-fatal error in onFailure if slide number is ' +
          'present', function() {
            var expectedResponse = {
              e: 'some error',
              fatal: false
            };
            sinon.stub(PubSub, 'publish');
            cmd_.onFailure(failureResponse_);

            assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
                'PubSub.publish called with correct eventType');
            assert.deepEqual(PubSub.publish.firstCall.args[1], expectedResponse,
                'PubSub.publish called with correct error data');
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
