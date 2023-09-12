define([], function() {
  'use strict';

  describe('Hyperlink mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('link-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#testElement');
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

    it('Should add support for "lnk"', function() {
      assert(testEl_.supports('lnk'), 'element supports lnk');
    });

    it('Should be possible to decorate a run with lnk', function() {
      var props = {
        lnk: 'https://www.samplelink.com'
      };

      var unset = {
        lnk: undefined
      };

      // Decorate and verify.
      testEl_.decorate(props, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_.lnk, props.lnk, 'after decorate');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_.lnk, unset.lnk, 'properties after undecorate');
    });
  });

  return {};
});
