define([
  'qowtRoot/commands/quickpoint/edit/insertSlide',
  'qowtRoot/controls/point/presentation',
  'qowtRoot/pubsub/pubsub',
  'test/qowt/commands/commandTestUtils',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts'
], function(
    InsertSlideCommand,
    PresentationControl,
    PubSub,
    CommandUtils,
    EditCommandStandardAsserts) {

  'use strict';

  describe('Point: "insertSlide" Command', function() {

    var context_, command_;

    beforeEach(function() {
      context_ = {
        command: {
          sn: 1
        }
      };
      command_ = InsertSlideCommand.create(context_.command);
    });

    afterEach(function() {
      context_ = undefined;
      command_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(command_.name, 'insertSld', 'Command name');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          InsertSlideCommand.create(context_.command);
        }, Error, 'should not throw error during creation');
      });

      it('should lock screen during creation', function() {
        sinon.stub(PubSub, 'publish');
        InsertSlideCommand.create(context_.command);

        assert.isTrue(
            PubSub.publish.calledWith('qowt:lockScreen'),
            'PubSub.publish called with correct parameters by create');
        PubSub.publish.restore();
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'Insert slide command missing command data'
          },
          {
            // Missing slide number
            context: {command: {}},
            errorMsg: 'Insert slide command missing slide number'
          }
        ];

        CommandUtils.expectInvalidConstructionContextsToThrow(
            InsertSlideCommand, invalidContexts);
      });
    });

    describe('changeHtml:', function() {
      it('should insert slide on receiving changeHtml', function() {
        sinon.stub(PresentationControl, 'insertSlide');
        command_.changeHtml();
        assert.isTrue(
            PresentationControl.insertSlide.calledWith(0),
            'PresentationControl.insertSlide called with correct parameters');
        PresentationControl.insertSlide.restore();
      });
    });

    describe('onFailure:', function() {
      it('should unlock screen on receiving onFailure', function() {
        sinon.stub(PubSub, 'publish');
        command_.onFailure();
        assert.isTrue(
            PubSub.publish.calledWith('qowt:unlockScreen'),
            'PubSub.publish called with correct parameters by create');
        PubSub.publish.restore();
      });
    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(command_.dcpData, 'insertSld.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = command_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });

      it('should define the name property', function() {
        var data = command_.dcpData();
        assert.strictEqual(data.name, 'insertSld', 'name values are equal');
      });
    });

    describe('Insert Slide editCommandStandardAsserts', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(command_);
        EditCommandStandardAsserts.asCallsService(command_, true);
        EditCommandStandardAsserts.asOptimistic(command_, false, false);
      });
    });

    describe('Insert slide undo initiated command', function() {
      it('should pass standard edit command assert for undo initiated command',
          function() {
            context_.command.type = 'dcpCommand';
            var command = InsertSlideCommand.create(context_.command);

            EditCommandStandardAsserts.standard(command);
            EditCommandStandardAsserts.asCallsService(command, false);
            EditCommandStandardAsserts.asOptimistic(command, true, false);
          });
    });
  });
});
