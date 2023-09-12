require([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/messageBus/messageBus',
  'common/elements/ui/boldButton/boldButton'],
  function(PubSub, MessageBus /* bold button */) {

  'use strict';

  describe('QowtBoldButton Polymer Element', function() {

    var boldButton;

    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
      sinon.stub(MessageBus, 'pushMessage');
      boldButton = new QowtBoldButton();
    });
    afterEach(function() {
      PubSub.publish.restore();
      MessageBus.pushMessage.restore();
      boldButton = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(boldButton instanceof QowtBoldButton,
          'bold button is QowtBoldButton');
    });

    it('should create the aria label on the bold button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(boldButton.getAttribute('aria-label'),
          'bold_aria_spoken_word shortcut',
          'aria-label is bold_aria_spoken_word');
    });

    it('should have the value of \'bold\' for action', function() {
      assert.strictEqual(boldButton.action, 'bold', 'action is bold');
    });

    it('should have the value of \'bld\' for formatCode', function() {
      assert.strictEqual(boldButton.formatCode, 'bld', 'formatCode is bold');
    });

    it('should have the value of \'hasBold\' for widgetFormat', function() {
      assert.strictEqual(boldButton.widgetFormat, 'hasBold',
          'widgetFormat is hasBold');
    });

    it('should have the value of \'cmd-bold\' for id', function() {
      assert.strictEqual(boldButton.id, 'cmd-bold', 'id is cmd-bold');
    });

    it('should publish the correct signal when clicked', function() {
      assert.isFalse(boldButton.isActive());
      boldButton._tapHandler();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
          action: 'bold',
          context: {
            formatting: {
              bld: true
            }
          }
        }),
        'request action published');
      assert.isTrue(MessageBus.pushMessage.calledWith({
        id: 'recordEvent',
        category: 'button-bar',
        action: 'bold'
      }), 'recordEvent pushed to message bus');
    });
  });
});
