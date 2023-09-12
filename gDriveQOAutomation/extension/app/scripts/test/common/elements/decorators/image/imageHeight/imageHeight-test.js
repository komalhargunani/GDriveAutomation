define([
  'qowtRoot/utils/converters/converter'], function(Converter) {

  'use strict';

  describe('Image height mixin', function() {
    var testEl_, decorators;

    beforeEach(function() {
      this.stampOutTempl('image-height-decorator-test-template');
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

    it('Should add support for "hgt"', function() {
      assert.isTrue(testEl_.supports('hgt'), 'element should supports image' +
          ' height');
    });

    it('Should be possible to decorate and undecorate image height',
        function() {
      var props = {
        hgt: 500
      };

      var unset = {
        hgt: undefined
      };

      // Decorate and verify.
      testEl_.decorate(props, true);

      decorators = testEl_.getComputedDecorations();
      assert.deepEqual(decorators.hgt, Converter.twip2mm(props.hgt), 'should ' +
          'set the properties when decorated.');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      decorators = testEl_.getComputedDecorations();
      assert.isUndefined(decorators.hgt, 'should unset the properties when ' +
          'undecorated.');
    });
  });

  return {};
});
