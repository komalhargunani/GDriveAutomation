define(function() {

  'use strict';

  describe('section orientation mixin', function() {
    var sectionElm_, td;

    beforeEach(function() {
      this.stampOutTempl('section-orientation-decorator-test-template');
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

    it('Should add support for "otn"', function() {
      assert(sectionElm_.supports('otn'),
          'element supports section orientation');
    });

    it('Should be possible to decorate section orientation', function() {

      var props = {
        otn: 'P'
      };

      var unset = {
        otn: undefined
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      assert.deepEqual(sectionElm_.getComputedDecorations().otn, props.otn,
          'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.deepEqual(sectionElm_.getComputedDecorations().otn, unset.otn,
          'after undecorate');
    });
  });

  return {};
});
