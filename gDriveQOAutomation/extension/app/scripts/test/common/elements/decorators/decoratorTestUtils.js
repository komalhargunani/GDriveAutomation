define(['qowtRoot/utils/promiseUtils'], function(PromiseUtils) {
  'use strict';

  var api_ = {

    /**
     * Mimics mocha describe block. The specFunc will be called after adding two
     * helper functions to 'this': this.shouldSupport, this.shouldDecorate
     * See JsDocs below for their use
     * @param {string} suiteName The name of the test suite
     * @param {string} testElmName The name of the test template & element
     * @param {Function} specFunc The function with tests
     */
    describe: function(suiteName, testElmName, specFunc) {

      describe(suiteName, function() {

        var testEl, decs;

        beforeEach(function() {
          this.stampOutTempl(testElmName + '-test-template');
          testEl = document.querySelector(testElmName + '-test-element');
        });

        afterEach(function() {
          testEl = undefined;
        });

        // Test that the element has been extended correctly
        it('Should extend the decoratorBase mixin: ', function() {
          assert.isFunction(testEl.decorate,
              'should have decorate function');
          assert.isFunction(testEl.getComputedDecorations,
              'should have getComputedDecorations function');
        });

        /**
         * Add a test function to 'this' which the client can call to test
         * whether the element supports a given action
         * @param {String} action The action to check for
         */
        this.shouldSupport = function(action) {
          it('Should add support for "' + action + '"', function() {
            assert(testEl.supports(action), 'element supports ' + action);
          });
        };

        /**
         * Add a test function to 'this' which the client can call to test
         * decorating an element with given properties. It will test both
         * decorating asynchronously as well as synchronously and will also
         * unset all the values in the properties object and thereby tests
         * "undecorating"
         * @param {String} msg The string to use for it('...')
         * @param {Object} props The formatting properties to decorate
         * @param {Function} verify1 Function to run after decorating
         * @param {Function} verify2 Function to run after undecorating
         */
        this.shouldDecorate = function(msg, props, verify1, verify2) {

          it(msg + ' (asynchronously)', function() {
            // Decorate async
            return decorateAsync_(testEl, props)
              .then(PromiseUtils.waitForNextMacroTurn)
              .then(function() {
                // Verify decorations
                decs = testEl.getComputedDecorations();
                verify1(testEl, decs);
              })
              // Undecorate async
              .then(decorateAsync_.bind(null, testEl, unset_(props)))
              .then(PromiseUtils.waitForNextMacroTurn)
              .then(function() {
                // Verify decorations
                decs = testEl.getComputedDecorations();
                verify2(testEl, decs);
              });
          });

          it(msg + ' (synchronously)', function() {
            // Decorate and verify
            decorateSync_(testEl, props);
            decs = testEl.getComputedDecorations();
            verify1(testEl, decs);
            // Undecorate and verify
            decorateSync_(testEl, unset_(props));
            decs = testEl.getComputedDecorations();
            verify2(testEl, decs);
          });
        };

        // Call the actual spec function
        specFunc.call(this);
      });
    }
  };

  /** @private */
  function decorateAsync_(elm, dcp) {
    elm.decorate(dcp, false);
    return Promise.resolve();
  }

  /** @private */
  function decorateSync_(elm, dcp) {
    elm.decorate(dcp, true);
  }

  /**
   * Helper function to unset values in a formatting property object
   * @param {Object} props The formatting property object
   * @return {Object} returns an object with the same keys as the formatting
   * object with all values set to undefined
   */
  function unset_(props) {
    return _.transform(props, function(result, value, key) {
      value = value || undefined;
      result[key] = undefined;
    });
  }

  return api_;
});
