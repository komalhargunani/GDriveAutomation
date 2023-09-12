define([
  'qowtRoot/commands/quickpoint/edit/deleteSlide',
  'test/qowt/commands/commandTestUtils',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/arrayUtils'
], function(
    DeleteSlideCommand,
    CommandUtils,
    EditCommandStandardAsserts,
    ThumbnailStripWidget,
    PubSub,
    ArrayUtils) {

  'use strict';

  describe('Point: "deleteSlide" Command', function() {

    var context_, cmd_;

    beforeEach(function() {
      context_ = {
        command: {
          slideNumbers: ['1']
        }
      };
      cmd_ = DeleteSlideCommand.create(context_.command);
    });

    afterEach(function() {
      cmd_ = undefined;
      context_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'deleteSld', 'Command name');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          DeleteSlideCommand.create(context_.command);
        }, Error, 'should not throw error during creation');
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'Delete slide command missing command data'
          },
          {
            // Missing slide numbers
            context: {command: {}},
            errorMsg: 'Delete slide cmd missing slideNumbers'
          }
        ];

        CommandUtils.expectInvalidConstructionContextsToThrow(
            DeleteSlideCommand, invalidContexts);
      });

      it('should lock screen', function() {
        sinon.stub(PubSub, 'publish');
        DeleteSlideCommand.create(context_.command);
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
      it('should delete slides', function() {
        sinon.stub(ThumbnailStripWidget, 'deleteSlides');
        cmd_.changeHtml();
        assert.isTrue(
            ThumbnailStripWidget.deleteSlides.calledOnce,
            'deleteSlides method called');
        ThumbnailStripWidget.deleteSlides.restore();
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
        assert.isFunction(cmd_.dcpData, 'deleteSlide.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = cmd_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });

      it('should define the name property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.name, 'deleteSld', 'name values are equal');
      });

      it('should define the slideNumbers property', function() {
        var data = cmd_.dcpData();
        assert.isTrue(ArrayUtils.equal(data.slideNumbers, ['1']),
            'slideNumbers are equal');
      });
    });


    describe('Delete Slide editCommandStandardAsserts', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(cmd_);
        EditCommandStandardAsserts.asCallsService(cmd_, true);
        EditCommandStandardAsserts.asOptimistic(cmd_, false, false);
      });
    });

    describe('Delete Slide undo initiated command', function() {
      it('should pass standard edit command assert for undo initiated' +
          ' command', function() {
            context_.command.type = 'dcpCommand';
            cmd_ = DeleteSlideCommand.create(context_.command);

            EditCommandStandardAsserts.standard(cmd_);
            EditCommandStandardAsserts.asCallsService(cmd_, false);
            EditCommandStandardAsserts.asOptimistic(cmd_, true, false);
          });
    });
  });
});
