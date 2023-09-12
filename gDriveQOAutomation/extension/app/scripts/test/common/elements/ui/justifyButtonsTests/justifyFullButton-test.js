require([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/justifyButtons/justifyFullButton/justifyFullButton'
],
function(MessageBus, PubSub/* justify full button itself */) {

  'use strict';

  describe('QowtJustifyFullButton Polymer Element', function() {

    var justifyFullButton, sandbox;

    beforeEach(function() {
      justifyFullButton = new QowtJustifyFullButton();
      sandbox = sinon.sandbox.create();
      sandbox.stub(PubSub, 'publish');
      sandbox.stub(MessageBus, 'pushMessage');
    });
    afterEach(function() {
      justifyFullButton = undefined;
      sandbox.restore();
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(justifyFullButton instanceof QowtJustifyFullButton,
          'justify full button is QowtJustifyFullButton');
    });

    it('should create the aria label on the justify full button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(justifyFullButton.getAttribute('aria-label'),
          'textalignjustify_aria_spoken_word shortcut',
          'aria-label is textalignjustify_aria_spoken_word');
    });

    it('should have value of \'textAlignJustify\' for action', function() {
      assert.strictEqual(justifyFullButton.action, 'textAlignJustify',
          'action is textAlignJustify');
    });

    it('should have a value of \'cmd-textAlignJustify\' for id', function() {
      assert.strictEqual(justifyFullButton.id, 'cmd-textAlignJustify',
          'id is cmd-textAlignJustify');
    });

    it('should have the value of \'J\' for alignment', function() {
      assert.strictEqual(
          justifyFullButton.alignment, 'J', 'alignment is J');
    });

    it('should publish the correct signal when clicked', function() {
      assert.isFalse(justifyFullButton.active,
          'button was initially active');

      justifyFullButton._tapHandler();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
        action: 'textAlignJustify',
        context: {
          formatting: {
            jus: 'J'
          }
        }
      }), 'request action not published');
      assert.isTrue(MessageBus.pushMessage.calledWith({
        id: 'recordEvent',
        category: 'button-bar',
        action: 'textAlignJustify'
      }), 'recordEvent not pushed to message bus');
    });

    it('should do nothing if clicked on already active button', function() {
      justifyFullButton.setActive('J');
      assert.isTrue(justifyFullButton.active, 'button is not activated');

      justifyFullButton._tapHandler();

      assert.isTrue(justifyFullButton.active, 'button is not active');
      sinon.assert.notCalled(PubSub.publish);
      sinon.assert.notCalled(MessageBus.pushMessage);
    });
  });
});