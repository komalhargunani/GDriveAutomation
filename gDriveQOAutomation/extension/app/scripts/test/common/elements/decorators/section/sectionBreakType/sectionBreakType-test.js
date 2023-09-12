define(function() {

  'use strict';

  describe('section break-type mixin', function() {
    var sectionElm_, td;

    beforeEach(function() {
      this.stampOutTempl('section-break-type-decorator-test-template');
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

    it('Should add support for "sbt"', function() {
      assert(sectionElm_.supports('sbt'),
          'element supports section break type');
    });

    it('Should be possible to decorate section break type', function() {

      var props = {
        sbt: 'np'
      };

      var unset = {
        sbt: 'none'
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      assert.deepEqual(sectionElm_.getComputedDecorations().sbt, props.sbt,
          'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.deepEqual(sectionElm_.getComputedDecorations().sbt, unset.sbt,
          'after undecorate');
    });
  });

  return {};
});
