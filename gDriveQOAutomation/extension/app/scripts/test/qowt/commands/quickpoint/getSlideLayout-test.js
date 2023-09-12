define([
  'qowtRoot/commands/quickpoint/getSlideLayout',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/models/point',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/cssManager',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/widgets/point/slidesContainer'
], function(
    GetSlideLayoutCmd,
    ContentRenderError,
    PointModel,
    LayoutsManager,
    PubSub,
    CssManager,
    DeprecatedUtils,
    SlidesContainer) {

  'use strict';

  describe('Point: "getSlideLayout" Command', function() {
    var getSlideLayoutCommand_, rootEl_, rootElDocFragment_;

    beforeEach(function() {
      rootEl_ = {
        appendChild: function() {},
        getAttribute: function() {}
      };
      PointModel.SlideLayoutId = 1;
      PointModel.slideLayoutMap[PointModel.SlideLayoutId] =
          { refDiv: rootEl_ };
      rootElDocFragment_ = 'some node';
      sinon.stub(document, 'createDocumentFragment').
          returns(rootElDocFragment_);

      getSlideLayoutCommand_ = GetSlideLayoutCmd.create(rootEl_, 1);
    });

    afterEach(function() {
      getSlideLayoutCommand_ = undefined;
      PointModel.SlideLayoutId = undefined;
      PointModel.slideLayoutMap = {};
      rootEl_ = undefined;
      rootElDocFragment_ = undefined;
      document.createDocumentFragment.restore();
    });

    describe('name:', function() {
      it('should return getSlideLayout command', function() {
        assert.strictEqual(getSlideLayoutCommand_.name, 'getSlideLayout',
            'name values are equal');
      });
    });

    describe('isOptimistic:', function() {
      it('Should not provide Optimistic', function() {
        assert.isFalse(getSlideLayoutCommand_.isOptimistic(),
            'getSlideLayout is not Optimistic');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(getSlideLayoutCommand_.callsService(),
            'callsService should be true');
      });
    });

    describe('dcpData:', function() {
      it('should be implemented', function() {
        assert.isFunction(getSlideLayoutCommand_.dcpData,
            'getSlideLayout.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = getSlideLayoutCommand_.dcpData();
        assert.isObject(data, 'dcpData() returned an object');
      });

      it('should define the name property', function() {
        var data = getSlideLayoutCommand_.dcpData();
        assert.strictEqual(data.name, 'gSldLt', 'name values are equal');
      });

      it('should define the eidlt property', function() {
        var data = getSlideLayoutCommand_.dcpData();
        assert.strictEqual(data.eidlt, 1, 'eidlt values are equal');
      });
    });

    describe('preExecuteHook:', function() {
      var returnedClonedDiv_, stubIsReRenderingCurrentSlide_, stubGetAttribute_,
          stubThumbClonedCompletely_, slideWidget_;
      beforeEach(function() {
        returnedClonedDiv_ = {
          setAttribute: function() {}
        };
        slideWidget_ = {
          empty: function() {}
        };

        stubIsReRenderingCurrentSlide_ = sinon.stub(LayoutsManager,
            'isReRenderingCurrentSlide');
        stubIsReRenderingCurrentSlide_.returns(false);
        sinon.stub(getSlideLayoutCommand_, 'makeNullCommand');
        sinon.stub(DeprecatedUtils, 'cloneAndAttach').
            returns(returnedClonedDiv_);
        stubGetAttribute_ = sinon.stub(rootEl_, 'getAttribute');
        stubGetAttribute_.returns('true');
        sinon.stub(returnedClonedDiv_, 'setAttribute');
        sinon.stub(SlidesContainer, 'removeAddedLayout');
        stubThumbClonedCompletely_ = sinon.stub(SlidesContainer,
            'isThumbClonedCompletely');
        stubThumbClonedCompletely_.returns(true);
        sinon.stub(SlidesContainer, 'getCurrentSlideWidget').
            returns(slideWidget_);
        sinon.stub(slideWidget_, 'empty');
      });

      afterEach(function() {
        stubIsReRenderingCurrentSlide_.restore();
        stubIsReRenderingCurrentSlide_ = undefined;
        getSlideLayoutCommand_.makeNullCommand.restore();
        DeprecatedUtils.cloneAndAttach.restore();
        stubGetAttribute_.restore();
        stubGetAttribute_ = undefined;
        returnedClonedDiv_.setAttribute.restore();
        SlidesContainer.removeAddedLayout.restore();
        stubThumbClonedCompletely_.restore();
        stubThumbClonedCompletely_ = undefined;
        SlidesContainer.getCurrentSlideWidget.restore();
        slideWidget_.empty.restore();
        returnedClonedDiv_ = undefined;
        slideWidget_ = undefined;
      });

      it('should be implemented', function() {
        assert.isFunction(getSlideLayoutCommand_.preExecuteHook,
            'getSlideLayout.preExecuteHook()');
      });

      it('should set attribute "qowt-hideParentSp" to cloned node and make' +
          'null-command, when cached and not to be re-rendered', function() {
           var refDiv = PointModel.slideLayoutMap[PointModel.SlideLayoutId].
               refDiv;
           getSlideLayoutCommand_.preExecuteHook();

           assert.isTrue(LayoutsManager.isReRenderingCurrentSlide.calledOnce,
               'isReRenderingCurrentSlide method has been called');
           assert.isTrue(getSlideLayoutCommand_.makeNullCommand.calledOnce,
               'makeNullCommand method has been called');
           assert.isTrue(DeprecatedUtils.cloneAndAttach.calledOnce,
               'cloneAndAttach method has been called');
           assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[0],
               refDiv);
           assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[1],
               rootEl_);
           assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[2],
               '1cloned1');
           assert.isTrue(rootEl_.getAttribute.calledOnce,
               'getAttribute method has been called');
           assert.strictEqual(rootEl_.getAttribute.firstCall.args[0],
               'qowt-hideParentSp');
           assert.isTrue(returnedClonedDiv_.setAttribute.calledOnce,
               'setAttribute method has been called');
           assert.strictEqual(returnedClonedDiv_.setAttribute.firstCall.args[0],
               'qowt-hideParentSp');
           assert.strictEqual(returnedClonedDiv_.setAttribute.firstCall.args[1],
               'true');
         });

      it('should not set attribute "qowt-hideParentSp" to cloned node and ' +
          'make null-command, when cached and not to be re-rendered',
          function() {
           var refDiv = PointModel.slideLayoutMap[PointModel.SlideLayoutId].
                refDiv;
           stubGetAttribute_.returns('false');
           getSlideLayoutCommand_.preExecuteHook();

           assert.isTrue(LayoutsManager.isReRenderingCurrentSlide.calledOnce,
               'isReRenderingCurrentSlide method has been called');
           assert.isTrue(getSlideLayoutCommand_.makeNullCommand.calledOnce,
               'makeNullCommand method has been called');
           assert.isTrue(DeprecatedUtils.cloneAndAttach.calledOnce,
               'cloneAndAttach method has been called');
           assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[0],
               refDiv);
           assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[1],
               rootEl_);
           assert.strictEqual(DeprecatedUtils.cloneAndAttach.firstCall.args[2],
               '1cloned1');
           assert.isTrue(rootEl_.getAttribute.calledOnce,
               'getAttribute method has been called');
           assert.strictEqual(rootEl_.getAttribute.firstCall.args[0],
               'qowt-hideParentSp');
           assert.isFalse(returnedClonedDiv_.setAttribute.called,
               'setAttribute method has not been called');
         });

      it('should not empty current slide for slide number 1 when to be' +
          ' re-rendered', function() {
           stubIsReRenderingCurrentSlide_.returns(true);
           getSlideLayoutCommand_.preExecuteHook();

           assert.isTrue(LayoutsManager.isReRenderingCurrentSlide.calledOnce,
               'isReRenderingCurrentSlide method has been called');
           assert.isTrue(SlidesContainer.removeAddedLayout.calledOnce,
               'removeAddedLayout method has been called');
           assert.strictEqual(SlidesContainer.removeAddedLayout.
               firstCall.args[0], rootEl_);
           assert.strictEqual(SlidesContainer.removeAddedLayout.
               firstCall.args[1], 1);
           assert.isTrue(SlidesContainer.isThumbClonedCompletely.calledOnce,
               'isThumbClonedCompletely method has been called');
           assert.strictEqual(SlidesContainer.isThumbClonedCompletely.
               firstCall.args[0], 1);
           assert.isFalse(SlidesContainer.getCurrentSlideWidget.called,
               'getCurrentSlideWidget method has not been called');
         });

      it('should empty current slide for slide number 1 when to be re-rendered',
         function() {
           stubIsReRenderingCurrentSlide_.returns(true);
           stubThumbClonedCompletely_.returns(false);
           getSlideLayoutCommand_.preExecuteHook();

           assert.isTrue(LayoutsManager.isReRenderingCurrentSlide.calledOnce,
               'isReRenderingCurrentSlide method has been called');
           assert.isTrue(SlidesContainer.removeAddedLayout.calledOnce,
               'removeAddedLayout method has been called');
           assert.strictEqual(SlidesContainer.removeAddedLayout.
               firstCall.args[0], rootEl_);
           assert.strictEqual(SlidesContainer.removeAddedLayout.
               firstCall.args[1], 1);
           assert.isTrue(SlidesContainer.isThumbClonedCompletely.calledOnce,
               'isThumbClonedCompletely method has been called');
           assert.strictEqual(SlidesContainer.isThumbClonedCompletely.
               firstCall.args[0], 1);
           assert.isTrue(SlidesContainer.getCurrentSlideWidget.called,
               'getCurrentSlideWidget method has been called');
           assert.isTrue(slideWidget_.empty.called,
               'empty method has been called');
         });
    });

    describe('onSuccess:', function() {
      beforeEach(function() {
        sinon.stub(CssManager, 'flushCache');
        sinon.stub(rootEl_, 'appendChild');
      });

      afterEach(function() {
        CssManager.flushCache.restore();
        rootEl_.appendChild.restore();
      });

      it('should implement the onSuccess hook', function() {
        assert.isFunction(getSlideLayoutCommand_.onSuccess,
            'getSlideLayout.onSuccess()');
      });

      it('should call flushCache', function() {
        getSlideLayoutCommand_.onSuccess();
        assert.isTrue(CssManager.flushCache.calledOnce, 'flush cache');
      });

      it('should call appendChild', function() {
        getSlideLayoutCommand_.onSuccess();
        assert.isTrue(rootEl_.appendChild.calledOnce, 'append Child');
        assert.strictEqual(rootEl_.appendChild.firstCall.args[0],
            rootElDocFragment_);
      });
    });

    describe('onFailure:', function() {
      var errorPolicy_, response_, expectedResponse_;
      beforeEach(function() {
        errorPolicy_ = {};

        response_ = {
          e: 'some error'
        };

        expectedResponse_ = {
          e: 'some error',
          fatal: true
        };

        sinon.stub(PubSub, 'publish');
        sinon.stub(ContentRenderError, 'create').returns(response_);
      });

      afterEach(function() {
        errorPolicy_ = undefined;
        response_ = undefined;
        expectedResponse_ = undefined;
        PubSub.publish.restore();
        ContentRenderError.create.restore();
      });

      it('should implement the onFailure hook', function() {
        assert.isFunction(getSlideLayoutCommand_.onFailure,
            'getSlideLayout.onFailure()');
      });

      it('should let framework deal with generic errors and not broadcast ' +
          'anything itself', function() {

           expectedResponse_.fatal = false;
           getSlideLayoutCommand_.onFailure(response_, errorPolicy_);

           assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
               'PubSub.publish called with correct event type');
           assert.deepEqual(PubSub.publish.firstCall.args[1], expectedResponse_,
               'PubSub.publish called with correct event data');
           assert.isTrue(ContentRenderError.create.calledOnce,
               'ContentRenderError create method has not been called');
         });

      it('should dispatch the event if error policy is defined', function() {
        getSlideLayoutCommand_.onFailure(response_, errorPolicy_);
        assert.isTrue(errorPolicy_.eventDispatched, 'dispatch event');
      });


      it('should generate a fatal error in onFailure - missing slide number',
          function() {

           getSlideLayoutCommand_ = GetSlideLayoutCmd.create(rootEl_);
           getSlideLayoutCommand_.onFailure(response_);

           assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
               'PubSub.publish called with correct event type');
           assert.deepEqual(PubSub.publish.firstCall.args[1],
               expectedResponse_, 'PubSub.publish called with correct event' +
                   ' data');
          });
    });
  });
});
