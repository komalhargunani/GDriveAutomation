define([
  'qowtRoot/utils/promiseUtils'
],function(PromiseUtils) {


  'use strict';

  describe('Strikethrough mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('strike-test-template');
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        testEl_ = document.querySelector('#strike-test-element');
      });
    });

    afterEach(function() {
      testEl_ = undefined;
      decs_ = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl_.decorate, 'should have decorate function');
      assert.isFunction(testEl_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "strike"', function() {
      assert(testEl_.supports('strike'), 'element supports strike');
    });

    it('Should be possible to decorate a run with single strike', function() {
      var props = {
        strike: 'sngStrike'
      };

      var unset = {
        strike: 'noStrike'
      };

      // Decorate and verify.
      testEl_.decorate(props, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_, props, 'after decorate');

      // Undecorate and verify.
      testEl_.decorate({strike: undefined}, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_, unset, 'properties after undecorate');
    });

    it('Should be possible to decorate a run with double strike', function() {
      var props = {
        strike: 'sngStrike'
      };

      var unset = {
        strike: 'noStrike'
      };

      // Decorate and verify.
      testEl_.decorate({strike: 'dblStrike'}, true);
      decs_ = testEl_.getComputedDecorations();
      // In case of double strikethrough, for rendering, we fallback
      // to 'single',i'e., the same style property is applied for
      // 'single' as well as 'double' strikethrough. Hence, even in
      // case of 'double' strikethrough, the expectedDecoration will
      // be 'single'
      assert.deepEqual(decs_, props, 'after decorate');

      // Undecorate and verify.
      testEl_.decorate({strike: undefined}, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_, unset, 'properties after undecorate');
    });
  });

  return {};

});
