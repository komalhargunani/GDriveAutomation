require([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/messageBus/messageBus',
  'common/elements/ui/underlineButton/underlineButton'],
  function(PubSub, MessageBus /* underline button itself */) {

  'use strict';

  describe('QowtUnderlineButton Polymer Element', function() {

    var underlineButton;

    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
      sinon.stub(MessageBus, 'pushMessage');
      underlineButton = new QowtUnderlineButton();
    });
    afterEach(function() {
      PubSub.publish.restore();
      MessageBus.pushMessage.restore();
      underlineButton = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(underlineButton instanceof QowtUnderlineButton,
          'underline button is QowtUnderlineButton');
    });

    it('should create the aria label on the underline button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(underlineButton.getAttribute('aria-label'),
          'underline_aria_spoken_word shortcut',
          'aria-label is underline_aria_spoken_word');
    });

    it('should have the value of \'underline\' for action', function() {
      assert.strictEqual(
          underlineButton.action, 'underline', 'action is underline');
    });

    it('should have the value of \'udl\' for formatCode', function() {
      assert.strictEqual(
          underlineButton.formatCode, 'udl', 'formatCode is underline');
    });

    it('should have the value of \'hasUnderline\' for widgetFormat',
        function() {
      assert.strictEqual(underlineButton.widgetFormat, 'hasUnderline',
          'widgetFormat is hasUnderline');
    });

    it('should have the value of \'cmd-underline\' for id', function() {
      assert.strictEqual(
          underlineButton.id, 'cmd-underline', 'id is cmd-underline');
    });

    it('should publish the correct signal when clicked', function() {
      assert.isFalse(underlineButton.isActive());
      underlineButton._tapHandler();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
          action: 'underline',
          context: {
            formatting: {
              udl: true
            }
          }
        }),
        'request action published');
      assert.isTrue(MessageBus.pushMessage.calledWith({
        id: 'recordEvent',
        category: 'button-bar',
        action: 'underline'
      }), 'recordEvent pushed to message bus');
    });

  });
});
