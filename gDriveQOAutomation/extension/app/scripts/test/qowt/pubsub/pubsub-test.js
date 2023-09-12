define([
  'qowtRoot/pubsub/pubsub'], function(
  PubSub) {
  'use strict';

  describe('PubSub', function() {

    var tracker,
        tokens;

    beforeEach(function() {
      tracker = '';
      tokens = [];
      tokens.push(
        PubSub.subscribe(
          'test:signal',
          function subCallback(signal, data) {
            assert.strictEqual(
              signal, 'test:signal', 'callback received correct signal');
            if (data && data.origin) {
              assert.strictEqual(
                data.origin, 'unittest', 'callback received data');
            }
            tracker += 'sub';
            return 'sub';
          },
          {
            after: false,
            once: false
          }));
      tokens.push(
        PubSub.subscribe(
          'test:signal',
          function subOnceCallback(signal, data) {
            assert.strictEqual(
              signal, 'test:signal', 'callback received correct signal');
            if (data && data.origin) {
              assert.strictEqual(
                data.origin, 'unittest', 'callback received data');
            }
            tracker += 'subOnce';
            return 'subOnce';
          },
          {
            after: false,
            once: true
          }));
      tokens.push(
        PubSub.subscribe(
          'test:signal',
          function subAfterCallback(signal, data) {
            assert.strictEqual(
              signal, 'test:signal', 'callback received correct signal');
            if (data && data.origin) {
              assert.strictEqual(
                data.origin, 'unittest', 'callback received data');
            }
            tracker += 'subAfter';
            return 'subAfter';
          },
          {
            after: true,
            once: false
          }));
      tokens.push(
        PubSub.subscribe(
          'test:signal',
          function subOnceAfterCallback(signal, data) {
            assert.strictEqual(
              signal, 'test:signal', 'callback received correct signal');
            if (data && data.origin) {
              assert.strictEqual(
                data.origin, 'unittest', 'callback received data');
            }
            tracker += 'subOnceAfter';
            return 'subOnceAfter';
          },
          {
            after: true,
            once: true
          }));
      assert.isTrue(
        PubSub.registeredSignals.length >= 1,
        'registered at least one signal');
      assert.isTrue(
        PubSub.registeredSignals.indexOf('test:signal') >= 0,
        'registered the test signal');
      assert.strictEqual(
        tokens.length, 4,
        'tokens returned for subscriptions');
      assert.isTrue(
        PubSub.subscriberCount >= 4,
        'at least 4 subscribers registered');
    });

    afterEach(function() {
      tokens.forEach(function(token) {
        var subscriber = PubSub.unsubscribe(token);
        if (subscriber) {
          assert.strictEqual(
            subscriber.token, token,
            'token referenced subscriber');
        }
      });
      assert.strictEqual(
        PubSub.subscriberCountForSignal('test:signal'), 0,
        'all test subscribers removed');
      tracker = undefined;
      tokens = undefined;
    });

    describe('publish', function() {

      it('should throw for invalid signal', function() {
        assert.throws(function() {
          PubSub.publish(null);
        }, TypeError, undefined, 'throw for invalid signal');
        assert.throws(function() {
          PubSub.publish('');
        }, TypeError, undefined, 'empty string is invalid');
      });

      it('should invoke subscriber callbacks ordered correctly', function() {
        PubSub.publish('test:signal');
        assert.strictEqual(
          tracker, 'subsubOncesubAftersubOnceAfter',
          'callbacks in correct order');
      });

      it('should remove "once" subscribers after publish', function() {
        PubSub.publish('test:signal');
        assert.strictEqual(
          PubSub.subscriberCountForSignal('test:signal'), 2,
          'removed "once" subscribers');
      });

      it('should return a promise', function() {
        assert.isTrue(
          PubSub.publish('test:signal') instanceof Promise,
          'promise returned');
      });

      it('should resolve promise with callback return values', function() {
        PubSub.publish('test:signal').then(function(resolvedValues) {
          assert.strictEqual(
            resolvedValues[0], 'sub',
            'sub callback returned');
          assert.strictEqual(
            resolvedValues[1], 'subOnce',
            'sub callback returned');
          assert.strictEqual(
            resolvedValues[2], 'subAfter',
            'sub callback returned');
          assert.strictEqual(
            resolvedValues[3], 'subOnceAfter',
            'sub callback returned');
        });
      });

      it('should pass data to callbacks', function() {
        PubSub.publish('test:signal', {origin: 'unittest'});
      });

      it('unsubscribing in callback should not affect publishing', function() {
        var tracker = '';
        // closure here to retain tokens returned from PubSub.subscribe
        (function() {
          var tokens = [];
          tokens.push(PubSub.subscribe('test:callback', function() {
            tracker += '1';
            tokens.forEach(function(token) {
              /**
               * This is the first callback registered, in it we unsubscribe all
               * the following callbacks as well, this test insures that all the
               * callbacks are executed before they are unsubscribed. This is
               * effectively asserting that the PubSub does not modify arrays as
               * it iterates through them.
               */
              PubSub.unsubscribe(token);
            });
          }));
          tokens.push(PubSub.subscribe('test:callback', function() {
            tracker += '2';
          }));
          tokens.push(PubSub.subscribe('test:callback', function() {
            tracker += '3';
          }));
          tokens.push(PubSub.subscribe('test:callback', function() {
            tracker += '4';
          }));
          tokens.push(PubSub.subscribe('test:callback', function() {
            tracker += '5';
          }));
        })();
        PubSub.publish('test:callback').then(function() {
          assert.strictEqual(
            tracker, '12345', 'all callbacks were executed');
          assert.strictEqual(
            PubSub.getSubscriberCount_('test:callback'), 0,
            'all callbacks were unsubscribed');
        });
      });

    });

    describe('doAction', function() {

      it('should throw for invalid action', function() {
        assert.throws(function() {
          PubSub.doAction(null);
        }, TypeError, undefined, 'throw for invalid action');
        assert.throws(function() {
          PubSub.doAction('');
        }, TypeError, undefined, 'empty string is invalid');
      });

      it('should accept context as an object', function() {
        PubSub.subscribe('qowt:doAction', function(signal, data) {
          if (signal === 'qowt:doAction') {
            assert.deepEqual(
              data, {
                action: 'test:action',
                context: {
                  test: true
                }
              }, 'string action added to data object');
          }
        },
        {
          after: false,
          once: true
        });
        PubSub.doAction('test:action', {test: true});
      });

      it('should accept context as a string', function() {
        PubSub.subscribe('qowt:doAction', function(signal, data) {
          if (signal === 'qowt:doAction') {
            assert.deepEqual(
              data, {
                action: 'test:action',
                context: {
                  contentType: 'test'
                }
              }, 'string action added to data object');
          }
        },
        {
          after: false,
          once: true
        });
        PubSub.doAction('test:action', 'test');
      });

      it('should return a promise', function() {
        assert.isTrue(
          PubSub.doAction('test:action') instanceof Promise,
          'promise returned');
      });

      it('should resolve promise with callback return values', function() {
        PubSub.doAction('test:action').then(function(resolvedValues) {
          assert.isTrue(
            (resolvedValues.length === 1 && resolvedValues[0] === undefined),
            'the promise resolved the callback return value');
        });
      });

    });

    describe('subscribe', function() {

      it('should be safe to call unsubscribe for undefined token', function() {
        assert.isUndefined(
          PubSub.unsubscribe(undefined), 'undefined token returns undefined');
      });

      it('should throw for invalid signal or callback', function() {
        assert.throws(function() {
          PubSub.subscribe(null, function() {});
        }, TypeError, undefined, 'throw for invalid signal');
        assert.throws(function() {
          PubSub.subscribe('', function() {});
        }, TypeError, undefined, 'empty string is invalid');
        assert.throws(function() {
          PubSub.subscribe('test:signal', null);
        }, TypeError, undefined, 'throw for invalid callback');
      });

      it('should default to false for "once" & "after"', function() {
        assert.isFalse(
          PubSub.unsubscribe(
            PubSub.subscribe('test:onceDefault', function() {})).config.once,
          '"once" default is false');
        assert.isFalse(
          PubSub.unsubscribe(
            PubSub.subscribe('test:afterDefault', function() {})).config.after,
          '"after" default is false');
      });

      it('should register new signals', function() {
        var currentSignalCount = PubSub.registeredSignals.length;
        PubSub.unsubscribe(PubSub.subscribe('test:newSignal', function() {}));
        assert.isTrue(
          PubSub.registeredSignals.length > currentSignalCount,
          'registered signals increased');
        assert.isTrue(
          PubSub.registeredSignals.indexOf('test:newSignal') >= 0,
          'test:newSignal was registered');
      });

    });

    describe('unsubscribe', function() {

      it('should throw for invalid token', function() {
        assert.throws(function() {
          PubSub.unsubscribe(null);
        }, TypeError, undefined, 'throw for invalid token');
        assert.throws(function() {
          PubSub.unsubscribe('');
        }, TypeError, undefined, 'empty string is invalid');
      });

      it('should return undefined for unmatched token', function() {
        assert.isUndefined(
          PubSub.unsubscribe('xxx'),
          'unmatched token returns undefined');
      });

    });

    describe('subscriberCountForSignal', function() {

      it('should throw for invalid signal', function() {
        assert.throws(function() {
          PubSub.subscriberCountForSignal(12345);
        }, TypeError, undefined, 'throw for invalid signal');
      });

      it('should return 0 for unregistered signal', function() {
        assert.isTrue(
          PubSub.subscriberCountForSignal('test:unregistered') === 0,
          'return 0 for unregistered signal');
      });

    });

    describe('publishCount', function() {
      it('should provide a non zero publichCount ' +
         'at this point in the test suite', function() {
        assert.isTrue(
          PubSub.publishCount > 0,
          'publishCount indicates signals have been published');
      });
    });

    // following two test suites are disabled until this CL lands:
    // https://quickoffice-internal-review.googlesource.com/14100
    // TODO dtilley@ Enable these tests for 100% coverage
    describe.skip('clear', function() {

      it('should remove all subscribers & signals', function() {
        PubSub.clear();
        assert.isTrue(
          PubSub.subscriberCount === 0,
          'all subscribers removed');
        assert.isTrue(
          PubSub.registeredSignals.length === 0,
          'all signals removed');
      });

    });

    describe.skip('reset', function() {

      it('should reset all internal state', function() {
        PubSub.reset();
        assert.isTrue(
          PubSub.subscriberCount === 0,
          'all subscribers removed');
        assert.isTrue(
          PubSub.registeredSignals.length === 0,
          'all signals removed');
        assert.isTrue(
          PubSub.publishCount === 0,
          'internal state reset');
      });

      it('publish should return empty array after reset', function() {
        PubSub.publish('test:finalSignal', {}).then(function(resolvedValues) {
          assert.isTrue(
            resolvedValues.length === 0,
            'there were no callbacks for this signal');
        });
      });

    });

  });

});
