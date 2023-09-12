require([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/justifyButtons/justifyCenterButton/justifyCenterButton'
],
function(MessageBus, PubSub /* justify center button itself */) {

  'use strict';

  describe('QowtJustifyCenterButton Polymer Element', function() {

    var justifyCenterButton, sandbox;

    beforeEach(function() {
      justifyCenterButton = new QowtJustifyCenterButton();
      sandbox = sinon.sandbox.create();
      sandbox.stub(PubSub, 'publish');
      sandbox.stub(MessageBus, 'pushMessage');
    });
    afterEach(function() {
      justifyCenterButton = undefined;
      sandbox.restore();
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(justifyCenterButton instanceof QowtJustifyCenterButton,
          'justify center button is QowtJustifyCenterButton');
    });

    it('should create the aria label on the justify center button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(justifyCenterButton.getAttribute('aria-label'),
          'textaligncenter_aria_spoken_word shortcut',
          'aria-label is textaligncenter_aria_spoken_word');
    });

    it('should have value of \'textAlignCenter\' for action', function() {
      assert.strictEqual(justifyCenterButton.action, 'textAlignCenter',
          'action is textAlignCenter');
    });

    it('should have the value of \'cmd-textAlignCenter\' for id', function() {
      assert.strictEqual(justifyCenterButton.id, 'cmd-textAlignCenter',
          'id is cmd-textAlignCenter');
    });

    it('should have the value of \'C\' for alignment', function() {
      assert.strictEqual(
          justifyCenterButton.alignment, 'C', 'alignment is C');
    });

    it('should publish the correct signal when clicked', function() {
      assert.isFalse(justifyCenterButton.active,
          'button was initially active');

      justifyCenterButton._tapHandler();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
        action: 'textAlignCenter',
        context: {
          formatting: {
            jus: 'C'
          }
        }
      }), 'request action not published');
      assert.isTrue(MessageBus.pushMessage.calledWith({
        id: 'recordEvent',
        category: 'button-bar',
        action: 'textAlignCenter'
      }), 'recordEvent not pushed to message bus');
    });

    it('should do nothing if clicked on already active button', function() {
      justifyCenterButton.setActive('C');
      assert.isTrue(justifyCenterButton.active, 'button is not activated');

      justifyCenterButton._tapHandler();

      assert.isTrue(justifyCenterButton.active, 'button is not active');
      sinon.assert.notCalled(PubSub.publish);
      sinon.assert.notCalled(MessageBus.pushMessage);
    });
  });
});