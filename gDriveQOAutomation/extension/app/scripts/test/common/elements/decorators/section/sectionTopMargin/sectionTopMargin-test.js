define(function() {

  'use strict';

  describe('section top margin mixin', function() {
    var sectionElm_, pageElm_, td;

    beforeEach(function() {
      this.stampOutTempl('section-top-margin-decorator-test-template');
      td = this.getTestDiv();
      sectionElm_ = td.querySelector('#section-test-element');
    });

    afterEach(function() {
      pageElm_ = undefined;
      sectionElm_ = undefined;
      td = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(sectionElm_.decorate, 'should have decorate function');
      assert.isFunction(sectionElm_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "mgt"', function() {
      assert(sectionElm_.supports('mgt'),
          'element supports section top margin');
    });

    it('Should be possible to decorate section top margin', function() {

      var props = {
        mgt: 72
      };

      var unset = {
        mgt: 0
      };

      // Decorate and verify.
      sectionElm_.decorate(props, true);
      pageElm_ = td.querySelector('qowt-page');
      assert.deepEqual(parseInt(pageElm_.$.header.style.minHeight, 10),
          props.mgt, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.deepEqual(parseInt(pageElm_.$.header.style.minHeight, 10),
          unset.mgt, 'after decorate');
    });
  });

  return {};
});
