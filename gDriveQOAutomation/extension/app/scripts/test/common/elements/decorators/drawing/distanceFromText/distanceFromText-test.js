define(function() {

  'use strict';

  describe('Distance from text mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('distance-from-text-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#distance-from-text-test-element');
    });

    afterEach(function() {
      testEl_ = undefined;
      decs_ = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl_.decorate, 'should have decorate function');
      assert.isFunction(testEl_.getComputedDecorations,
        'should have getComputedDecorations function');
    });

    it('Should add support for "distanceFromText"', function() {
      assert(testEl_.supports('distanceFromText'),
        'element supports distanceFromText');
    });

    it('Should be possible to decorate drawing object with distanceFromText',
      function() {
        var unset = {
          distanceFromText: undefined
        };

        // Values in twips
        var props = {
          distanceFromText: {b: 0, l: 180, r: 180, t: 0}
        };

        // Decorate and verify.
        testEl_.decorate(props, true);

        decs_ = testEl_.getComputedDecorations();
        assert.deepEqual(decs_.distanceFromText,
          props.distanceFromText, 'after decorate');
        assert.equal(testEl_.distanceFromText.l, '180',
          'left position set correctly');
        assert.equal(testEl_.distanceFromText.r, '180',
          'right position set correctly');
        assert.equal(testEl_.distanceFromText.b, '0',
          'bottom position set correctly');
        assert.equal(testEl_.distanceFromText.t, '0',
          'top position set correctly');

        // Undecorate and verify.
        testEl_.decorate(unset, true);
        assert.equal(testEl_.distanceFromText, undefined,
          'distanceFromText unset correctly');
      });

  });

  return {};

});
