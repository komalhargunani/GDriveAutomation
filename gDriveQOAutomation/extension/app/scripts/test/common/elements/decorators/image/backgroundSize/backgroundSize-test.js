define([
  'qowtRoot/utils/converters/converter'], function(Converter) {

  'use strict';

  describe('Image background size mixin', function() {
    var testEl_, decorators;

    beforeEach(function() {
      this.stampOutTempl('image-background-size-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#testElement');
    });

    afterEach(function() {
      testEl_ = undefined;
      decorators = undefined;
    });

    it('should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl_.decorate, 'should have decorate function');
      assert.isFunction(testEl_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('should be possible to decorate image background size', function() {
      var props = {
        wdt: 500,
        hgt: 400
      };

      // Decorate and verify.
      testEl_.decorate(props, true);

      decorators = testEl_.getComputedDecorations();
      var expectedResult = Converter.twip2mm(props.wdt) + 'mm ' +
          Converter.twip2mm(props.hgt) + 'mm';
      assert.deepEqual(decorators.backgroundSize, expectedResult, 'should ' +
          'set the properties when decorated.');
    });
  });

  return {};
});
