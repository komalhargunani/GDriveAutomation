/**
 * @fileoverview Tests to ensure that global checks placed in
 * globalBeforeAfter.js (that runs before and after every Karma test) verifies
 * correctly.
 */
define(['qowtRoot/pubsub/pubsub'], function(PubSub) {

  'use strict';

  describe('Leak detection', function() {
    it('should ensure PubSub leak detection doesn\'t fail when ' +
        'subscriptions are registered and de-registered correctly', function() {
          // A mock module(singleton)
          var mockSingleton = (function() {
            var disableToken_,
                destroyToken_,
                sampleEventToken_,
                api_ = {
                  init: function() {
                    disableToken_ = PubSub.subscribe('qowt:disable',
                        api_.disable);
                    destroyToken_ = PubSub.subscribe('qowt:destroy',
                        api_.destroy);
                    // A sample subscription just for this test.
                    // Event name prefixed with @# to avoid collision from main
                    // codebase.
                    sampleEventToken_ = PubSub.subscribe('@#sampleEvent',
                        function() {});
                  },

                  disable: function() {
                    PubSub.unsubscribe(sampleEventToken_);
                    PubSub.unsubscribe(disableToken_);
                    sampleEventToken_ = undefined;
                    disableToken_ = undefined;
                  },

                  destroy: function() {
                    PubSub.unsubscribe(destroyToken_);
                    destroyToken_ = undefined;
                  }
                };

            return api_;
          })();

          mockSingleton.init();

          // fire an event just like in a common scenario utilizing that module
          PubSub.publish('@#sampleEvent');

          // No assertion here. The actual assertion is the global afterEach
          // checks which should not break/complain after running this test.
        });

    it('should detect PubSub subscription leakage', function() {
      // A mock module(singleton)
      var mockSingleton = (function() {
        var api_ = {
          init: function() {
            PubSub.subscribe('qowt:disable', api_.disable);
            PubSub.subscribe('qowt:destroy', api_.destroy);
            // A sample subscription just for this test.
            // Event name prefixed with @# to avoid collision from main
            // codebase.
            PubSub.subscribe('@#sampleEvent', function() {});
          },

          disable: function() {
            // intentionally left blank
          },

          destroy: function() {
            // intentionally left blank
          }
        };

        return api_;
      })();

      mockSingleton.init();

      // fire an event just like in a common scenario utilizing that module
      PubSub.publish('@#sampleEvent');

      // signal afterEach about the expected failure
      this.test.expectedToFail.subscriberLeak = true;
    });

    it('should ensure dom nodes leak detection doesn\'t fail when nodes are ' +
        'added and removed correctly', function() {
          var sampleDiv = document.createElement('DIV');

          // add the div to document
          document.body.appendChild(sampleDiv);

          // now remove it
          document.body.removeChild(sampleDiv);

          // No assertion here. The actual assertion is the global afterEach
          // checks which should not break/complain after running this test.
        });

    it('should detect dom nodes leakage', function() {
      var sampleDiv = document.createElement('DIV');

      // add the div to document
      document.body.appendChild(sampleDiv);

      // signal afterEach about the expected failure
      this.test.expectedToFail.nodeLeak = true;
    });
  });
});
