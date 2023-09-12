require([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/models/env',
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/strikethroughButton/strikethroughButton'
], function(
    MessageBus,
    EnvModel,
    PubSub
    /*StrikethroughButton*/) {

  'use strict';

  describe('QowtStrikethroughButton Polymer Element', function() {

    var strikethroughButton_, sandbox_;

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
      stubRequiredFunctions_();
      initialiseData_();
    });


    afterEach(function() {
      resetData_();
    });


    it('should support Polymer constructor creation', function() {
      assert.isTrue(strikethroughButton_ instanceof QowtStrikethroughButton,
          'strikethrough button should be QowtStrikethroughButton');
    });


    it('should create the aria label on the strikethrough button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(strikethroughButton_.getAttribute('aria-label'),
          'strikethrough_aria_spoken_word shortcut');
    });


    it('should have the value of \'strikethrough\' for action', function() {
      assert.strictEqual(strikethroughButton_.action, 'strikethrough');
    });


    it('should have the value of \'strikethrough\' for formatCode', function() {
      assert.strictEqual(strikethroughButton_.formatCode, 'strikethrough');
    });


    it('should have the value of \'hasStrikethrough\' for widgetFormat',
        function() {
          assert.strictEqual(
              strikethroughButton_.widgetFormat, 'hasStrikethrough');
    });


    it('should have the value of \'cmd-strikethrough\' for id', function() {
      assert.strictEqual(strikethroughButton_.id, 'cmd-strikethrough');
    });


    it('should create the proper role on the strikethrough button', function() {
      assert.strictEqual(strikethroughButton_.getAttribute('role'), 'button',
          'role should be button');
    });


    it('should publish the correct signal when clicked', function() {
      var initialStateOfButton = strikethroughButton_.isActive();
      var signalDataToBePublished = {
        action: 'strikethrough',
        context: {
          formatting: {
            strikethrough: !initialStateOfButton
          },
          set: !initialStateOfButton
        }
      };
      var messageToBePushed = {
        id: 'recordEvent',
        category: 'button-bar',
        action: 'strikethrough'
      };

      assert.isFalse(initialStateOfButton, 'button should be inactive ' +
          'initially');

      strikethroughButton_._tapHandler();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction',
          signalDataToBePublished), 'request action should be published');
      assert.isTrue(MessageBus.pushMessage.calledWith(messageToBePushed));
    });


    function stubRequiredFunctions_() {
      sandbox_.stub(PubSub, 'publish');
      sandbox_.stub(MessageBus, 'pushMessage');
    }


    function initialiseData_() {
      // TODO: This should be generic when Word and Point have strikethrough
      //       toolbar button.
      EnvModel.app = 'sheet';
      strikethroughButton_ = new QowtStrikethroughButton();
    }

    function resetData_() {
      sandbox_.restore();
      strikethroughButton_ = undefined;
      //reset to default app instead of undefining it.
      EnvModel.app = 'word';
    }
  });
});