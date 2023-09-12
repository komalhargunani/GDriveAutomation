require([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/justifyButtons/justifyLeftButton/justifyLeftButton'],
function(MessageBus, PubSub /* justify left button itself */) {

  'use strict';

  describe('QowtJustifyLeftButton Polymer Element', function() {

    var justifyLeftButton, sandbox;

    beforeEach(function() {
      justifyLeftButton = new QowtJustifyLeftButton();
      sandbox = sinon.sandbox.create();
      sandbox.stub(PubSub, 'publish');
      sandbox.stub(MessageBus, 'pushMessage');
    });
    afterEach(function() {
      justifyLeftButton = undefined;
      sandbox.restore();
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(justifyLeftButton instanceof QowtJustifyLeftButton,
          'justify left button is QowtJustifyLeftButton');
    });

    it('should create the aria label on the justify left button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(justifyLeftButton.getAttribute('aria-label'),
          'textalignleft_aria_spoken_word shortcut',
          'aria-label is textalignleft_aria_spoken_word');
    });

    it('should have value of \'textAlignLeft\' for action', function() {
      assert.strictEqual(justifyLeftButton.action, 'textAlignLeft',
          'action is textAlignLeft');
    });

    it('should have the value of \'cmd-textAlignLeft\' for id', function() {
      assert.strictEqual(justifyLeftButton.id, 'cmd-textAlignLeft',
          'id is cmd-textAlignLeft');
    });

    it('should have the value of \'L\' for alignment', function() {
      assert.strictEqual(
          justifyLeftButton.alignment, 'L', 'alignment is L');
    });

    it('should publish the correct signal when clicked', function() {
      assert.isFalse(justifyLeftButton.active,
          'button was initially active');

      justifyLeftButton._tapHandler();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
        action: 'textAlignLeft',
        context: {
          formatting: {
            jus: 'L'
          }
        }
      }), 'request action not published');
      assert.isTrue(MessageBus.pushMessage.calledWith({
        id: 'recordEvent',
        category: 'button-bar',
        action: 'textAlignLeft'
      }), 'recordEvent not pushed to message bus');
    });

    it('should do nothing if clicked on already active button', function() {
      justifyLeftButton.setActive('L');
      assert.isTrue(justifyLeftButton.active, 'button is not activated');

      justifyLeftButton._tapHandler();

      assert.isTrue(justifyLeftButton.active, 'button is not active');
      sinon.assert.notCalled(PubSub.publish);
      sinon.assert.notCalled(MessageBus.pushMessage);
    });
  });
});