define([
  'qowtRoot/utils/converters/converter'], function(
    Converter) {

  'use strict';

  describe('page width mixin', function() {
    var sectionElm_, td_;

    beforeEach(function() {
      this.stampOutTempl('page-width-decorator-test-template');
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

    it('Should add support for "width"', function() {
      assert(sectionElm_.supports('width'), 'element supports page width');
    });

    it('Should be possible to decorate page width', function() {

      var props = {
        width: 1200
      };

      var unset = {
        width: 40
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      var pageElm_ = td_.querySelector('qowt-page');
      assert.equal(sectionElm_.width, props.width, 'after decorate');
      assert.deepEqual(Converter.pt2twip(parseInt(pageElm_.style.width,
          10)), props.width, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(sectionElm_.width, unset.width, 'after decorate');
      assert.deepEqual(Converter.pt2twip(parseInt(pageElm_.style.width,
          10)), unset.width, 'after decorate');
    });
  });

  return {};
});
