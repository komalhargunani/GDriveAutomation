define([], function() {
  'use strict';

  describe('Crop image mixin', function() {
    var testEl_, decorators;

    beforeEach(function() {
      this.stampOutTempl('crop-image-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#testElement');
    });

    afterEach(function() {
      testEl_ = undefined;
      decorators = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl_.decorate, 'should have decorate function');
      assert.isFunction(testEl_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "crop"', function() {
      assert.isTrue(testEl_.supports('crop'), 'element should supports crop' +
          ' image');
    });

    it('Should be possible to decorate and undecorate crop image', function() {
      var props = {
        crop: {
          b: 13,
          l: 10,
          r: 10,
          t: 13
        }
      };

      var unset = {
        crop: undefined
      };

      // Decorate and verify.
      testEl_.decorate(props, true);

      decorators = testEl_.getComputedDecorations();
      assert.deepEqual(decorators.crop, props.crop, 'should set the ' +
          'properties when decorated.');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      decorators = testEl_.getComputedDecorations();
      assert.isUndefined(decorators.crop, 'should unset the properties when' +
          ' undecorated.');
    });
  });

  return {};
});
