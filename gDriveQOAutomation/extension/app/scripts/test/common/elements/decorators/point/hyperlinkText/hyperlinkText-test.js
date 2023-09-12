define([
  'qowtRoot/utils/promiseUtils'
],function(PromiseUtils) {

  'use strict';

  describe('Hyperlink mixin', function() {
    var testEl_;

    beforeEach(function() {
      this.stampOutTempl('hyperlink-test-template');
      return PromiseUtils.waitForNextMacroTurn().then(function() {
       testEl_ = document.querySelector('#hyperlink-test-element');
      });
    });

    afterEach(function() {
      testEl_ = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl_.decorate, 'should have decorate function');
    });

    it('Should add support for "hyperlink"', function() {
      assert(testEl_.supports('hyperlink'), 'element supports hyperlink');
    });

    it('Should be possible to decorate a run with hyperlink having a target',
        function() {
          var props = {
            hyperlink: {
              target: 'xyz'
            }
          };

          var unset = {
            hyperlink: undefined
          };

          // Decorate and verify.
          testEl_.decorate(props, true);
          assert.deepEqual(testEl_.getLink(), props.hyperlink.target,
              'after decorate');

          // Undecorate and verify.
          testEl_.decorate(unset, true);
          assert.deepEqual(testEl_.getLink(), undefined,
              'properties after undecorate');
        });

    it('Should be possible to decorate a run with hyperlink having an action',
        function() {
          var props = {
            hyperlink: {
              action: 'ppaction://somemacro'
            }
          };

          var unset = {
            hyperlink: undefined
          };

          // Decorate and verify.
          testEl_.decorate(props, true);
          assert.deepEqual(testEl_.getLink(), props.hyperlink.action,
              'after decorate');

          // Undecorate and verify.
          testEl_.decorate(unset, true);
          assert.deepEqual(testEl_.getLink(), undefined,
              'properties after undecorate');
        });
  });

  return {};

});
