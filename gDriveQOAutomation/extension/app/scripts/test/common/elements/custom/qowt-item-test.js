require([
  'qowtRoot/utils/mockMouse',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub'
], function(
  MockMouse,
  MessageBus,
  PubSub
) {

  describe('qowt-item element', function() {
    'use strict';
    var item;

    beforeEach(function() {
      this.stampOutTempl('qowt-item-test-template');
      item = this.getTestDiv().querySelector('qowt-item');
      sinon.stub(MessageBus, 'pushMessage').returns(true);
    });

    afterEach(function() {
      MessageBus.pushMessage.restore();
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(item, QowtItem, 'is a qowt-item');
    });

    it('should return a correct common print config.', function() {
      assert.deepEqual(item.config, {action: 'print'}, 'print action');
    });

    it('should return a copy of the original config to avoid downstream '
        + ' pollution of the object reference', function() {
      var original = item.config;
      original.newValue = 42;
      var secondary = item.config;
      assert.property(original, 'newValue', 'has new property');
      assert.notProperty(secondary, 'newValue', 'no new property');
    });

    it('should return an undefined config from no valid configId', function() {
      var bogusItem = document.createElement('qowt-item');
      assert.isUndefined(bogusItem.config, 'config undefined');
    });

    it('should disable an enabled item when disableOn is fired', function() {
      assert.isFalse(item.disabled, 'initially enabled');
      item.disableListener();
      assert.isTrue(item.disabled, 'item becomes disabled');
    });

    it('should enable a disabled item when enableOn is fired', function() {
      item.disabled = true;
      assert.isTrue(item.disabled, 'initially disabled');
      item.enableListener();
      assert.isFalse(item.disabled, 'item becomes enabled');
    });

    it('should not disable enabled item when enableOn is fired', function() {
      assert.isFalse(item.disabled, 'initially enabled');
      item.enableListener();
      assert.isFalse(item.disabled, 'item remains enabled');
    });

    it('should not enable disabled item when disableOn is fired', function() {
      item.disabled = true;
      assert.isTrue(item.disabled, 'initially disabled');
      item.disableListener();
      assert.isTrue(item.disabled, 'item remains disabled');
    });

    xit('should add the "focused" class on mousemove.', function(done) {
      item.addEventListener('focus', function() {
        assert.isTrue(item.classList.contains('focused'));
        done();
      });

      assert.isFalse(item.classList.contains('focused'));
      item.parentNode.hasVirtualFocus = true;
      MockMouse.mouseMove(item);
    });

    it('should invoke custom code in the activated item prior to publishing ' +
        ' action signals.', function() {
      sinon.stub(PubSub, 'publish', function(signal, signalData) {
        assert.strictEqual(signal, 'qowt:requestAction');
        assert.deepEqual(signalData, {action: 'test', contentType: 'text'});
      });

      item.config_ = { action: 'test'};
      item.onActivate = function() { this.config_.contentType = 'text'; };

      item.triggerAction_({});
      sinon.assert.calledOnce(PubSub.publish);

      PubSub.publish.restore();
    });


    it('should publish a requestAction signal for a supported item with no ' +
        ' content type.', function() {
      assertActivateHandler({context: 'context'});
    });

    it('should publish a doAction signal for a supported item with a content ' +
        'type.', function() {
      assertActivateHandler({context: {contentType: 'text'}});
    });

    it('should send a "recordEvent" with a "shortcut" category.', function() {
      assertRecordEventFromSource('keyboard-shortcut', 'keyboard-shortcut');
    });

    it('should send a "recordEvent" with a "menu" category.', function() {
      assertRecordEventFromSource(undefined, 'menu');
    });

    it('should not publish any signal when no config is present.', function() {
      assertActivateHandler(undefined);
    });

    it('should not send a "recordEvent" message when no config is present.',
        function() {
      assertActivateHandler(undefined);
    });

    // TODO: Temporarily disabling this test. When bug mentioned below is fixed
    // this test should be enabled. Probably, will need some modifications in
    // test.
    // *******
    // BUG = Open any menu. Hover on any menu item, this will add 'focused'
    // class to that menu-item. Now, moving out from that menu-item (move mouse
    // somewhere else in document), this should remove 'focus' from menu-item.
    // However, currently the focus is not removed from menu-item.
    xit('should remove the "focused" class on mousemove, if already focused.',
        function(done) {
          item.addEventListener('blur', function() {
            assert.isFalse(item.classList.contains('focused'));
            done();
          });

          // Pretend we're already focused.
          item.classList.add('focused');
          item.parentNode.hasVirtualFocus = true;
          MockMouse.mouseMove(item); // TODO: move mouse out from menu-item
        });


    function assertActivateHandler(config) {
      sinon.stub(PubSub, 'publish');

      item.config_ = config;
      item.triggerAction_({});

      var expectedSignal = (!config) ?
          undefined:
          (config.context.contentType) ?
              'qowt:doAction':
              'qowt:requestAction';

      if (expectedSignal) {
        sinon.assert.calledOnce(PubSub.publish);
        sinon.assert.calledWith(
            PubSub.publish, expectedSignal, config);
        sinon.assert.calledOnce(MessageBus.pushMessage);
      } else {
        sinon.assert.notCalled(PubSub.publish);
        sinon.assert.notCalled(MessageBus.pushMessage);
      }

      PubSub.publish.restore();
    }

    function assertRecordEventFromSource(evtSource, expectedCategory) {
      var config = {action: 'test', context: {contentType: 'text'}};
      var evt = {type: evtSource};

      item.config_ = config;
      item.triggerAction_(evt);

      sinon.assert.calledOnce(MessageBus.pushMessage);

      var arg = {id: 'recordEvent', category: expectedCategory, action: 'test'};
      sinon.assert.calledWith(MessageBus.pushMessage, arg);
    }
  });
});