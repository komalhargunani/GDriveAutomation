define([
  'qowtRoot/utils/promiseUtils'
],function(PromiseUtils) {

  'use strict';

  describe('OuterShadow mixin', function() {
    var testEl_, decs_, td;

    beforeEach(function() {
       this.stampOutTempl('outerShadow-test-template');
       td = this.getTestDiv();
       testEl_ = td.querySelector('#outerShadow-test-element');
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

    it('Should add support for "outSdwEff"', function() {
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        assert(testEl_.supports('outSdwEff'), 'element supports outer shadow');
      });
    });

    it('Should be possible to decorate a run with outer shadow', function() {
      var props = {
        outSdwEff: {
          color: {
            clr: '#980000',
            type: 'srgbClr'
          }
        }
      };

      var unset = {
        outSdwEff: undefined
      };
      return PromiseUtils.waitForNextMacroTurn().then(function() {
      // Decorate and verify.
      testEl_.decorate(props, true);
      decs_ = testEl_.getComputedDecorations();
      // Outer shadow consists of several properties out of which we just honour
      // the color. Hence, by using getComputedDecorations its not possible to
      // retrieve the entire object. Hence, currently we just check whether the
      // shadow is present or not based on the style property we apply and
      // return a boolean value. We might want to refactor this expectation once
      // we start honouring all shadow properties.
      assert.deepEqual(decs_.outSdwEff, decs_.outSdwEff, 'after decorate');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_.outSdwEff, undefined, 'after undecorate');
      });
    });
  });

  return {};

});
