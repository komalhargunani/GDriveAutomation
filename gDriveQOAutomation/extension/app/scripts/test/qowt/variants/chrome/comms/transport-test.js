/**
 * @fileoverview
 * Unit test to cover the Chrome Variant Transport.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/variants/comms/transport'], function(
  MessageBus,
  Transport) {

  'use strict';

  describe('Variants:Chrome:Comms:Transport', function() {
    it('Should provide sendMessage', function() {
      assert.isFunction(
        Transport.sendMessage,
        'Transport.sendMessage()');
    });
    it('Should provide cancelQueueId', function() {
      assert.isFunction(
        Transport.cancelQueueId,
        'Transport.cancelQueueId()');
    });
    it('Should throw if callback function not provided', function() {
      assert.throws(
        function() {
          Transport.sendMessage();
        },
        'Chrome Transport sendMesssage must be ' +
        'given a valid callback function!', undefined,
        'sendMessage throws Error'
      );
    });

    describe('API', function() {
      beforeEach(function() {
        sinon.stub(MessageBus, 'listen');
        sinon.stub(MessageBus, 'pushMessage');
      });
      afterEach(function() {
        MessageBus.listen.restore();
        MessageBus.pushMessage.restore();
      });

      it('Should initialize the MessageBus on first call, ' +
         'Should send dcpRequest signal for each call, ' +
         'Should be able to cancel message with returned ID', function() {
        var mid = Transport.sendMessage({'1st':'msg'}, function() {});
        assert.isTrue(
          MessageBus.listen.calledTwice,
          'MessageBus initialized');
        assert.isTrue(
          MessageBus.pushMessage.calledWith({
            id: 'dcpRequest',
            content: {'1st':'msg'}
          }),
          'first pushMessage');
        Transport.cancelQueueId(mid);
        // At this point the transport is still locked,
        // so the following sendMessage will not call the MessageBus
        Transport.sendMessage({'2nd':'msg'}, function() {});
        assert.isTrue(
          MessageBus.listen.calledTwice,
          'MessageBus already initialized');
      });
    });
  });
});
