define([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/models/qowtState',
  'qowtRoot/pubsub/pubsub'], function(
  MsgBus,
  QowtState,
  PubSub) {
  'use strict';

  describe('QOWT State', function() {

    var msgBusStub;
    beforeEach(function() {
      sinon.stub(MsgBus, 'isConnectedTo').returns(true);
      msgBusStub = sinon.stub(MsgBus, 'pushMessage');
      PubSub.publish('qowt:init');
    });
    afterEach(function() {
      MsgBus.pushMessage.restore();
      MsgBus.isConnectedTo.restore();
      msgBusStub = undefined;
    });

    describe('set', function() {
      it('should send state change message', function() {
        QowtState.set('testing', {env: 'mocha'});
        sinon.assert.calledWith(msgBusStub, {
          id: 'stateChange',
          data: {
            state: 'testing',
            context: {
              env: 'mocha'
            }
          }
        });
      });
    });

    describe('init and destroy', function() {
      it('should have subscribed to the correct signals', function() {
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:contentReceived'), 2,
            'subscribed to qowt:contentReceived');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:contentComplete'), 1,
            'subscribed to qowt:contentComplete');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:ss:dirty'), 1,
            'subscribed to qowt:ss:dirty');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:ss:saving'), 1,
            'subscribed to qowt:ss:saving');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:ss:saved'), 1,
            'subscribed to qowt:ss:saved');
        PubSub.publish('qowt:disable');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:contentReceived'), 0,
            'unsubscribed from qowt:contentReceived');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:contentComplete'), 0,
            'unsubscribed from qowt:contentComplete');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:ss:dirty'), 0,
            'unsubscribed from qowt:ss:dirty');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:ss:saving'), 0,
            'unsubscribed from qowt:ss:saving');
        assert.strictEqual(
            PubSub.subscriberCountForSignal('qowt:ss:saved'), 0,
            'unsubscribed from qowt:ss:saved');
      });
    });

    describe('qowt:contentReceived', function() {
      beforeEach(function() {
        PubSub.publish('qowt:contentReceived');
      });


      it('should send ViewingPartialContent state change message', function() {
        sinon.assert.calledWith(msgBusStub, {
          id: 'stateChange',
          data: {
            state: 'ViewingPartialContent',
            context: {}
          }
        });
      });


      it('should get ViewingPartialContent when queried', function() {
        assert.strictEqual(QowtState.get(), 'ViewingPartialContent');
      });
    });

    describe('qowt:contentComplete', function() {
      beforeEach(function() {
        PubSub.publish('qowt:contentComplete');
      });


      it('should send ViewingFullContent state change message', function() {
        sinon.assert.calledWith(msgBusStub, {
          id: 'stateChange',
          data: {
            state: 'ViewingFullContent',
            context: {}
          }
        });
      });


      it('should get ViewingFullContent when queried', function() {
        assert.strictEqual(QowtState.get(), 'ViewingFullContent');
      });
    });

    describe('qowt:ss:dirty', function() {
      describe('qowt:contentReceived', function() {
        beforeEach(function() {
          PubSub.publish('qowt:contentReceived');
          PubSub.publish('qowt:ss:dirty');
        });


        it('should send EditingPartialContent state change message',
            function() {
              sinon.assert.calledWith(msgBusStub, {
                id: 'stateChange',
                data: {
                  state: 'EditingPartialContent',
                  context: {}
                }
              });
        });


        it('should get EditingPartialContent when queried', function() {
          assert.strictEqual(QowtState.get(), 'EditingPartialContent');
        });
      });


      describe('qowt:contentComplete', function() {
        beforeEach(function() {
          PubSub.publish('qowt:contentComplete');
          PubSub.publish('qowt:ss:dirty');
        });


        it('should send EditingFullContent state change message', function() {
          sinon.assert.calledWith(msgBusStub, {
            id: 'stateChange',
            data: {
              state: 'EditingFullContent',
              context: {}
            }
          });
        });


        it('should get EditingFullContent when queried', function() {
          assert.strictEqual(QowtState.get(), 'EditingFullContent');
        });
      });
    });

    describe('qowt:ss:saving', function() {
      it('should send Saving state change message', function() {
        PubSub.publish('qowt:ss:saving', {twoPhaseSave: true});
        sinon.assert.calledWith(msgBusStub, {
          id: 'stateChange',
          data: {
            state: 'Saving',
            context: undefined
          }
        });
      });
    });

    describe('qowt:ss:saved', function() {
      describe('qowt:contentComplete', function() {
        beforeEach(function() {
          PubSub.publish('qowt:contentComplete');
          PubSub.publish('qowt:ss:saved');
        });


        it('should send ViewingFullContent state change message', function() {
          sinon.assert.calledWith(msgBusStub, {
            id: 'stateChange',
            data: {
              state: 'ViewingFullContent',
              context: {}
            }
          });
        });


        it('should get ViewingFullContent when queried', function() {
          assert.strictEqual(QowtState.get(), 'ViewingFullContent');
        });
      });

      describe('qowt:contentReceived', function() {
        beforeEach(function() {
          PubSub.publish('qowt:contentReceived');
          PubSub.publish('qowt:ss:saved');
        });


        it('should send ViewingPartialContent state change message',
            function() {
              sinon.assert.calledWith(msgBusStub, {
                id: 'stateChange',
                data: {
                  state: 'ViewingPartialContent',
                  context: {}
                }
              });
        });


        it('should get ViewingPartialContent when queried', function() {
          assert.strictEqual(QowtState.get(), 'ViewingPartialContent');
        });
      });

    });
  });

  return {};
});
