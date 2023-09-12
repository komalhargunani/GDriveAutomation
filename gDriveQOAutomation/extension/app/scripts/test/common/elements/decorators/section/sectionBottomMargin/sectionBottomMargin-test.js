define([
  'qowtRoot/utils/promiseUtils'
],function(PromiseUtils) {

  'use strict';

  describe('section bottom margin mixin', function() {
    var sectionElm_, pageElm_;

    beforeEach(function() {
      this.stampOutTempl('section-bottom-margin-decorator-test-template');
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        sectionElm_ = document.querySelector('#section-test-element');
      });
    });

    afterEach(function() {
      pageElm_ = undefined;
      sectionElm_ = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(sectionElm_.decorate, 'should have decorate function');
      assert.isFunction(sectionElm_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "mgb"', function() {
      assert(sectionElm_.supports('mgb'),
          'element supports section bottom margin');
    });

    it('Should be possible to decorate section bottom margin', function() {

      var props = {
        mgb: 72
      };

      var unset = {
        mgb: 0
      };

      // Decorate and verify.
      sectionElm_.decorate(props, true);
      pageElm_ = document.querySelector('qowt-page');
      assert.deepEqual(parseInt(pageElm_.$.footer.style.minHeight, 10),
          props.mgb, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.deepEqual(parseInt(pageElm_.$.footer.style.minHeight, 10),
          unset.mgb, 'after decorate');
    });
  });

  return {};
});
