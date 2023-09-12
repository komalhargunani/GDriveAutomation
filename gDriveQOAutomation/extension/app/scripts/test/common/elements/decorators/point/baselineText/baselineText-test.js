define([
  'qowtRoot/utils/promiseUtils'
],function(PromiseUtils) {

  'use strict';

  describe('Baseline mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('baseline-test-template');
      testEl_ = document.querySelector('#baseline-test-element');
    });

    afterEach(function() {
      testEl_ = undefined;
      decs_ = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        assert.isFunction(testEl_.decorate, 'should have decorate function');
        assert.isFunction(testEl_.getComputedDecorations,
          'should have getComputedDecorations function');
      });

    });

    it('Should add support for "baseline"', function() {
      return PromiseUtils.waitForNextMacroTurn().then(function() {
      assert(testEl_.supports('baseline'), 'element supports baseline');
      });
    });

    it('Should be possible to decorate a run with superscript', function() {
      var props = {
        baseline: 30
      };

      var unset = {
        baseline: undefined
      };
      return PromiseUtils.waitForNextMacroTurn().then(function() {
      // Decorate and verify.
      testEl_.decorate(props, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_.baseline, props.baseline, 'after decorate');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_.baseline, unset.baseline,
          'properties after undecorate');
      });
    });

    it('Should be possible to decorate a run with subscript', function() {
      var props = {
        baseline: -30
      };

      var unset = {
        baseline: undefined
      };
      return PromiseUtils.waitForNextMacroTurn().then(function() {
      // Decorate and verify.
      testEl_.decorate(props, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_.baseline, props.baseline, 'after decorate');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_.baseline, unset.baseline,
          'properties after undecorate');
      });
    });
  });

  return {};

});
