define(['qowtRoot/utils/converters/converter'], function(Converter) {
  'use strict';

  describe('Image width mixin', function() {
    var testEl_, decorators;

    beforeEach(function() {
      this.stampOutTempl('image-width-decorator-test-template');
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

    it('Should add support for "wdt"', function() {
      assert.isTrue(testEl_.supports('wdt'), 'element should supports image' +
          ' width');
    });

    it('Should be possible to decorate and undecorate image width', function() {
      var props = {
        wdt: 500
      };

      var unset = {
        wdt: undefined
      };

      // Decorate and verify.
      testEl_.decorate(props, true);

      decorators = testEl_.getComputedDecorations();
      assert.deepEqual(decorators.wdt, Converter.twip2mm(props.wdt), 'should ' +
          'set the properties when decorated.');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      decorators = testEl_.getComputedDecorations();
      assert.isUndefined(decorators.wdt, 'should unset the properties when' +
          ' undecorated.');
    });
  });

  return {};
});
