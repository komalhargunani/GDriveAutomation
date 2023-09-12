define([], function() {

  'use strict';

  describe('different odd even mixin', function() {
    var sectionElm_, td_;

    beforeEach(function() {
      this.stampOutTempl('different-odd-even-decorator-test-template');
      td_ = this.getTestDiv();
      sectionElm_ = td_.querySelector('#section-test-element');
    });

    afterEach(function() {
      sectionElm_ = undefined;
      td_ = undefined;
    });

    it('should extend the decoratorBase mixin', function() {
      assert.isFunction(sectionElm_.decorate, 'should have decorate function');
      assert.isFunction(sectionElm_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('should add support for "doe"', function() {
      assert(sectionElm_.supports('doe'),
          'element supports different odd even');
    });

    it('should be possible to decorate different odd even', function() {

      var props = {
        doe: true
      };

      var unset = {
        doe: false
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      assert.equal(sectionElm_.differentOddEven, props.doe, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(sectionElm_.differentOddEven, unset.doe, 'after decorate');
    });
  });

  return {};
});
