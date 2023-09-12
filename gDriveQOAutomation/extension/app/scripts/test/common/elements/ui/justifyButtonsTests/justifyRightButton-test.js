require([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/justifyButtons/justifyRightButton/justifyRightButton'],
function(MessageBus, PubSub /* justify right button itself */) {

  'use strict';

  describe('QowtJustifyRightButton Polymer Element', function() {

    var justifyRightButton, sandbox;

    beforeEach(function() {
      justifyRightButton = new QowtJustifyRightButton();
      sandbox = sinon.sandbox.create();
      sandbox.stub(PubSub, 'publish');
      sandbox.stub(MessageBus, 'pushMessage');
    });
    afterEach(function() {
      justifyRightButton = undefined;
      sandbox.restore();
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(justifyRightButton instanceof QowtJustifyRightButton,
          'justify right button is QowtJustifyRightButton');
    });

    it('should create the aria label on the justify right button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(justifyRightButton.getAttribute('aria-label'),
          'textalignright_aria_spoken_word shortcut',
          'aria-label is textalignright_aria_spoken_word');
    });

    it('should have value of \'textAlignRight\' for action', function() {
      assert.strictEqual(justifyRightButton.action, 'textAlignRight',
          'action is textAlignRight');
    });

    it('should have the value of \'cmd-textAlignRight\' for id', function() {
      assert.strictEqual(justifyRightButton.id, 'cmd-textAlignRight',
          'id is cmd-textAlignRight');
    });

    it('should have the value of \'R\' for alignment', function() {
      assert.strictEqual(
          justifyRightButton.alignment, 'R', 'alignment is R');
    });

    it('should publish the correct signal when clicked', function() {
      assert.isFalse(justifyRightButton.active,
          'button was initially active');

      justifyRightButton._tapHandler();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
        action: 'textAlignRight',
        context: {
          formatting: {
            jus: 'R'
          }
        }
      }), 'request action not published');
      assert.isTrue(MessageBus.pushMessage.calledWith({
        id: 'recordEvent',
        category: 'button-bar',
        action: 'textAlignRight'
      }), 'recordEvent not pushed to message bus');
    });

    it('should do nothing if clicked on already active button', function() {
      justifyRightButton.setActive('R');
      assert.isTrue(justifyRightButton.active, 'button is not activated');

      justifyRightButton._tapHandler();

      assert.isTrue(justifyRightButton.active, 'button is not active');
      sinon.assert.notCalled(PubSub.publish);
      sinon.assert.notCalled(MessageBus.pushMessage);
    });
  });
});