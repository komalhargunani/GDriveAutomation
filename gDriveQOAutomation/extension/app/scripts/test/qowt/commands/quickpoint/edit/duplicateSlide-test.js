define([
  'qowtRoot/commands/quickpoint/edit/duplicateSlide',
  'qowtRoot/controls/point/presentation',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/arrayUtils',
  'test/qowt/commands/commandTestUtils',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts',
], function(
    DuplicateSlideCommand,
    PresentationControl,
    PubSub,
    ArrayUtils,
    CommandUtils,
    EditCommandStandardAsserts) {

  'use strict';

  describe('Point: "duplicateSlide" Command', function() {

    var context_, cmd_;

    beforeEach(function() {
      context_ = {
        command: {
          slideNumbers: ['1']
        }
      };
      cmd_ = DuplicateSlideCommand.create(context_.command);
    });

    afterEach(function() {
      cmd_ = undefined;
      context_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'duplicateSlide', 'Command name');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          DuplicateSlideCommand.create(context_.command);
        }, Error, 'should not throw error during creation');
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'Duplicate slide command missing command data'
          },
          {
            // Missing slide numbers
            context: {command: {}},
            errorMsg: 'Duplicate slide cmd missing slideNumbers'
          }
        ];

        CommandUtils.expectInvalidConstructionContextsToThrow(
            DuplicateSlideCommand, invalidContexts);
      });

      it('should lock screen', function() {
        sinon.stub(PubSub, 'publish');
        DuplicateSlideCommand.create(context_.command);
        assert.isTrue(
            PubSub.publish.calledOnce,
            'PubSub.publish called once by create');
        assert.isTrue(
            PubSub.publish.calledWith('qowt:lockScreen'),
            'PubSub.publish called with correct parameters by create');
        PubSub.publish.restore();
      });
    });

    describe('changeHtml:', function() {
      it('should duplicate slides', function() {
        sinon.stub(PresentationControl, 'duplicateSlides');
        cmd_.changeHtml();
        assert.isTrue(
            PresentationControl.duplicateSlides.calledOnce,
            'duplicateSlides method called');
        assert.isTrue(
            PresentationControl.duplicateSlides.calledWith(['1']),
            'duplicateSlides method called with correct parameters');
        PresentationControl.duplicateSlides.restore();
      });
    });

    describe('onFailure:', function() {
      it('should unlock screen', function() {
        sinon.stub(PubSub, 'publish');
        cmd_.onFailure();
        assert.isTrue(
            PubSub.publish.calledOnce,
            'PubSub.publish called once by onFailure');
        assert.isTrue(
            PubSub.publish.calledWith('qowt:unlockScreen'),
            'PubSub.publish called with correct parameters by onFailure');
        PubSub.publish.restore();
      });
    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(cmd_.dcpData, 'duplicateSlide.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = cmd_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });

      it('should define the name property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.name, 'duplicateSlide',
            'name values are equal');
      });

      it('should define the slideNumbers property', function() {
        var data = cmd_.dcpData();
        assert.isTrue(ArrayUtils.equal(data.slideNumbers, ['1']),
            'slideNumbers are equal');
      });
    });

    describe('Duplicate Slide editCommandStandardAsserts', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(cmd_);
        EditCommandStandardAsserts.asCallsService(cmd_, true);
        EditCommandStandardAsserts.asOptimistic(cmd_, false, false);
      });
    });
  });
});
