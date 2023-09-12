define([], function() {

  'use strict';

  describe('different first page mixin', function() {
    var sectionElm_, td_;

    beforeEach(function() {
      this.stampOutTempl('different-first-page-decorator-test-template');
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

    it('should add support for "dfp"', function() {
      assert(sectionElm_.supports('dfp'),
          'element supports different first page');
    });

    it('should be possible to decorate different first page', function() {

      var props = {
        dfp: true
      };

      var unset = {
        dfp: false
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      assert.equal(sectionElm_.differentFirstPage, props.dfp, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(sectionElm_.differentFirstPage, unset.dfp, 'after decorate');
    });
  });

  return {};
});
