define([], function() {

  'use strict';

  describe('footer from bottom mixin', function() {
    var sectionElm_, td_;

    beforeEach(function() {
      this.stampOutTempl('footer-from-bottom-decorator-test-template');
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

    it('should add support for "ftb"', function() {
      assert(sectionElm_.supports('ftb'),
          'element supports footer from bottom');
    });

    it('should be possible to decorate footer from bottom', function() {

      var props = {
        ftb: 35
      };

      var unset = {
        ftb: 0
      };
      // Decorate and verify.
      sectionElm_.decorate(props, true);
      assert.equal(sectionElm_.footerDistanceFromBottom, props.ftb,
          'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(sectionElm_.footerDistanceFromBottom, unset.ftb,
          'after decorate');
    });
  });

  return {};
});
