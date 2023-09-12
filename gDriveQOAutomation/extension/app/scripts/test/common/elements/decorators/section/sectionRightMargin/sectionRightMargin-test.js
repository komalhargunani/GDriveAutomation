define(function() {

  'use strict';

  describe('section right margin mixin', function() {
    var sectionElm_, pageElm_, td;

    beforeEach(function() {
      this.stampOutTempl('section-right-margin-decorator-test-template');
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

    it('Should add support for "mgr"', function() {
      assert(sectionElm_.supports('mgr'),
          'element supports section right margin');
    });

    it('Should be possible to decorate section right margin', function() {

      var props = {
        mgr: 90
      };

      var unset = {
        mgr: 0
      };

      // Decorate and verify.
      sectionElm_.decorate(props, true);
      pageElm_ = td.querySelector('qowt-page');
      assert.equal(parseInt(pageElm_.$.header.style.paddingRight, 10),
          props.mgr, 'after decorate');
      assert.equal(parseInt(pageElm_.$.footer.style.paddingRight, 10),
          props.mgr, 'after decorate');
      assert.equal(parseInt(pageElm_.$.contentsContainer.style.
          paddingRight, 10), props.mgr, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(parseInt(pageElm_.$.header.style.paddingRight, 10),
          unset.mgr, 'after decorate');
      assert.equal(parseInt(pageElm_.$.footer.style.paddingRight, 10),
          unset.mgr, 'after decorate');
      assert.equal(parseInt(pageElm_.$.contentsContainer.style.
          paddingRight, 10), unset.mgr, 'after decorate');
    });
  });

  return {};
});
