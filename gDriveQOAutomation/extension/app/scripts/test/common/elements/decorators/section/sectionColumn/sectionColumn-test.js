define(function() {

  'use strict';

  describe('section column mixin', function() {
    var sectionElm_, td;

    beforeEach(function() {
      this.stampOutTempl('section-column-decorator-test-template');
      td = this.getTestDiv();
      sectionElm_ = td.querySelector('#section-test-element');
    });

    afterEach(function() {
      sectionElm_ = undefined;
      td = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(sectionElm_.decorate, 'should have decorate function');
      assert.isFunction(sectionElm_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "col"', function() {
      assert(sectionElm_.supports('col'),
          'element supports section column');
    });

    it('Should be possible to decorate section column', function() {

      var props = {
        col: 2
      };

      var unset = {
        col: 'auto'
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      assert.deepEqual(parseInt(sectionElm_.getComputedDecorations().col, 10),
          props.col, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.deepEqual(sectionElm_.getComputedDecorations().col,
          unset.col, 'after undecorate');
    });
  });

  return {};
});
