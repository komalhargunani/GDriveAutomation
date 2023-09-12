require([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/messageBus/messageBus',
  'common/elements/ui/italicButton/italicButton'],
  function(PubSub, MessageBus /* italic button itself */) {

  'use strict';

  describe('QowtItalicButton Polymer Element', function() {

    var italicButton;

    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
      sinon.stub(MessageBus, 'pushMessage');
      italicButton = new QowtItalicButton();
    });
    afterEach(function() {
      PubSub.publish.restore();
      MessageBus.pushMessage.restore();
      italicButton = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(italicButton instanceof QowtItalicButton,
          'italic button is QowtItalicButton');
    });

    it('should create the aria label on the italic button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(italicButton.getAttribute('aria-label'),
        'italic_aria_spoken_word shortcut',
          'aria-label is italic_aria_spoken_word');
    });

    it('should have the value of \'italic\' for action', function() {
      assert.strictEqual(italicButton.action, 'italic', 'action is italic');
    });

    it('should have the value of \'itl\' for formatCode', function() {
      assert.strictEqual(
          italicButton.formatCode, 'itl', 'formatCode is italic');
    });

    it('should have the value of \'hasItalic\' for widgetFormat', function() {
      assert.strictEqual(italicButton.widgetFormat, 'hasItalic',
          'widgetFormat is hasItalic');
    });

    it('should have the value of \'cmd-italic\' for id', function() {
      assert.strictEqual(italicButton.id, 'cmd-italic', 'id is cmd-italic');
    });

    it('should publish the correct signal when clicked', function() {
      assert.isFalse(italicButton.isActive());
      italicButton._tapHandler();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
          action: 'italic',
          context: {
            formatting: {
              itl: true
            }
          }
        }),
        'request action published');
      assert.isTrue(MessageBus.pushMessage.calledWith({
        id: 'recordEvent',
        category: 'button-bar',
        action: 'italic'
      }), 'recordEvent pushed to message bus');
    });

  });
});
