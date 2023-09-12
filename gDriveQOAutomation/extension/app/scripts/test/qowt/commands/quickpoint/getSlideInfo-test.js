define([
  'qowtRoot/commands/quickpoint/getSlideInfo',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/events/errors/fileOpenError',
  'qowtRoot/models/point',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/errorUtils'
], function(
    GetSlideInfoCmd,
    ContentRenderError,
    FileOpenError,
    PointModel,
    PubSub,
    ErrorUtils) {

  'use strict';

  describe('Point: "getSlideInfo" Command', function() {
    var getSlideInfoCmd_;

    beforeEach(function() {
      getSlideInfoCmd_ = GetSlideInfoCmd.create(5);
    });

    afterEach(function() {
      getSlideInfoCmd_ = undefined;
    });

    describe('create:', function() {
      it('should return getSlideInfo command', function() {
        assert.strictEqual(getSlideInfoCmd_.name, 'getSlideInfo',
            'name values are equal');
        assert.isFalse(getSlideInfoCmd_.isOptimistic(),
            'getSlideInfo is not Optimistic()');
        assert.isTrue(getSlideInfoCmd_.callsService(),
            'callsService should be true');
      });
    });

    describe('dcpData:', function() {
      it('should be implemented', function() {
        assert.isFunction(getSlideInfoCmd_.dcpData, 'getSlideInfo.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = getSlideInfoCmd_.dcpData();
        assert.isObject(data, 'dcpData() returned an object');
      });

      it('should define the name property', function() {
        var data = getSlideInfoCmd_.dcpData();
        assert.strictEqual(data.name, 'gSldInfo', 'name values are equal');
      });

      it('should define the sn property', function() {
        var data = getSlideInfoCmd_.dcpData();
        assert.strictEqual(data.sn, 5, 'slide number values are equal');
      });
    });

    describe('onSuccess:', function() {
      it('should implement the onSuccess hook', function() {
        assert.isFunction(getSlideInfoCmd_.onSuccess,
            'getSlideInfo.onSuccess()');
      });

      it('should set number of slides in QOWT model from supplied response',
          function() {
            // set up number of slides
            var mId = 1,
                lId = 2,
                sId = 3,
                tId = 4;

            var rsp = { eidmt: mId, eidlt: lId, eidth: tId, eid: sId};

            // call onSuccess & add in 'response'
            getSlideInfoCmd_.onSuccess(rsp);
            // check QOWT.MODEL
            assert.strictEqual(PointModel.MasterSlideId, 1,
                'MasterSlideId values are equal');
            assert.strictEqual(PointModel.SlideLayoutId, 2,
                'SlideLayoutId values are equal');
            assert.strictEqual(PointModel.SlideId, 5,
                'SlideId values are equal');
            assert.strictEqual(PointModel.currentSlideEId, 3,
                'currentSlideEId values are equal');
            assert.strictEqual(PointModel.ThemeId, 4,
                'ThemeId values are equal');
          });
    });

    describe('onFailure:', function() {
      var errorPolicy_, stubFileOpenError_, stubContentRenderError_, response_,
          expectedResponse_;
      beforeEach(function() {
        errorPolicy_ = {};

        response_ = {
          e: 'other then cpf'
        };

        expectedResponse_ = {
          e: 'other then cpf',
          fatal: true
        };

        sinon.stub(PubSub, 'publish');
        sinon.stub(ErrorUtils, 'errorInfo').returns('info');
        stubFileOpenError_ = sinon.stub(FileOpenError, 'create');
        stubContentRenderError_ = sinon.stub(ContentRenderError, 'create');
      });

      afterEach(function() {
        errorPolicy_ = undefined;
        response_ = undefined;
        expectedResponse_ = undefined;
        PubSub.publish.restore();
        ErrorUtils.errorInfo.restore();
        stubFileOpenError_.restore();
        stubContentRenderError_.restore();
        stubFileOpenError_ = undefined;
        stubContentRenderError_ = undefined;
      });

      it('should implement the onFailure hook', function() {
        assert.isFunction(getSlideInfoCmd_.onFailure,
            'getSlideInfo.onFailure()');
      });

      it('should let framework deal with generic errors and not broadcast ' +
          'anything itself', function() {

           response_.e = 'cpf';

           expectedResponse_.e = 'cpf';
           expectedResponse_.additionalInfo = 'info';
           expectedResponse_.fatal = true;

           stubFileOpenError_.returns(response_);

           getSlideInfoCmd_.onFailure(response_, errorPolicy_);

           assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
               'PubSub.publish called with correct event type');
           assert.deepEqual(PubSub.publish.firstCall.args[1], expectedResponse_,
               'PubSub.publish called with correct event data');
           assert.isTrue(ContentRenderError.create.notCalled,
               'ContentRenderError create method has not been called');
         });

      it('should dispatch the event if error policy is defined', function() {
        stubContentRenderError_.returns(response_);
        getSlideInfoCmd_.onFailure(response_, errorPolicy_);
        assert.isTrue(errorPolicy_.eventDispatched, 'dispatch event');
      });

      it('should generate a non-fatal error in onFailure-' +
          'error is other than "cpf" & Slide number available ', function() {

           expectedResponse_.fatal = false;

           stubContentRenderError_.returns(response_);
           getSlideInfoCmd_.onFailure(response_);

           assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
               'PubSub.publish called with correct event type');
           assert.deepEqual(PubSub.publish.firstCall.args[1], expectedResponse_,
               'PubSub.publish called with correct event data');
           assert.isTrue(FileOpenError.create.notCalled,
               'FileOpenError create method has not been called');
         });

      it('should generate a fatal error in onFailure - missing slide number',
          function() {

            stubContentRenderError_.returns(response_);
            var ncmd = GetSlideInfoCmd.create();
            ncmd.onFailure(response_);

            assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
                'PubSub.publish called with correct event type');
            assert.deepEqual(PubSub.publish.firstCall.args[1],
                expectedResponse_, 'PubSub.publish called with correct event' +
                    ' data');
            assert.isTrue(FileOpenError.create.notCalled,
                'FileOpenError create method has not been called');
          });
    });
  });
});
