define([], function() {

  'use strict';

  describe('header from top mixin', function() {
    var sectionElm_, td_;

    beforeEach(function() {
      this.stampOutTempl('header-from-top-decorator-test-template');
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

    it('should add support for "htp"', function() {
      assert(sectionElm_.supports('htp'),
          'element supports header from top');
    });

    it('should be possible to decorate header from top', function() {

      var props = {
        htp: 35
      };

      var unset = {
        htp: 0
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      assert.equal(sectionElm_.headerDistanceFromTop, props.htp,
          'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(sectionElm_.headerDistanceFromTop, unset.htp,
          'after decorate');
    });
  });

  return {};
});
