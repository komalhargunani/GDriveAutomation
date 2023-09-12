define(function() {

  'use strict';

  describe('section left margin mixin', function() {
    var sectionElm_, pageElm_, td;

    beforeEach(function() {
      this.stampOutTempl('section-left-margin-decorator-test-template');
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

    it('Should add support for "mgl"', function() {
      assert(sectionElm_.supports('mgl'),
          'element supports section left margin');
    });

    it('Should be possible to decorate section left margin', function() {

      var props = {
        mgl: 90
      };

      var unset = {
        mgl: 0
      };

      // Decorate and verify.
      sectionElm_.decorate(props, true);
      pageElm_ = td.querySelector('qowt-page');
      assert.equal(parseInt(pageElm_.$.header.style.paddingLeft, 10),
          props.mgl, 'after decorate');
      assert.equal(parseInt(pageElm_.$.footer.style.paddingLeft, 10),
          props.mgl, 'after decorate');
      assert.equal(parseInt(pageElm_.$.contentsContainer.style.paddingLeft, 10),
          props.mgl, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(parseInt(pageElm_.$.header.style.paddingLeft, 10),
          unset.mgl, 'after decorate');
      assert.equal(parseInt(pageElm_.$.footer.style.paddingLeft, 10),
          unset.mgl, 'after decorate');
      assert.equal(parseInt(pageElm_.$.contentsContainer.style.paddingLeft, 10),
          unset.mgl, 'after decorate');
    });
  });

  return {};
});
