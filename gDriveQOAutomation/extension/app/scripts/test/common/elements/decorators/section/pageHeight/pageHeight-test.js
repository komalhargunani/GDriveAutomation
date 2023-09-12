define([
  'qowtRoot/utils/converters/converter'], function(
    Converter) {

  'use strict';

  describe('page height mixin', function() {
    var sectionElm_, td_;

    beforeEach(function() {
      this.stampOutTempl('page-height-decorator-test-template');
      td_ = this.getTestDiv();
      sectionElm_ = td_.querySelector('#section-test-element');
    });

    afterEach(function() {
      sectionElm_ = undefined;
      td_ = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(sectionElm_.decorate, 'should have decorate function');
      assert.isFunction(sectionElm_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "height"', function() {
      assert(sectionElm_.supports('height'), 'element supports page height');
    });

    it('Should be possible to decorate page height', function() {

      var props = {
        height: 1200
      };

      var unset = {
        height: 40
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      var pageElm_ = td_.querySelector('qowt-page');
      assert.equal(sectionElm_.height, props.height, 'after decorate');
      assert.deepEqual(Converter.pt2twip(parseInt(pageElm_.style.height,
          10)), props.height, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(sectionElm_.height, unset.height, 'after decorate');
      assert.deepEqual(Converter.pt2twip(parseInt(pageElm_.style.height,
          10)), unset.height, 'after decorate');
    });
  });

  return {};
});
