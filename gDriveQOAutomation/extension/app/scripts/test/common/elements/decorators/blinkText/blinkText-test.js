define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'blink text mixin:',
      'blink-text-decorator', function() {

    var props = {
      bli: true
    };
    var unset = {
      bli: false
    };

    this.shouldSupport('bli');

    this.shouldDecorate(
      'Should be possible to decorate blink text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.isTrue(el.classList.contains('blinkText'), 'have blinkText');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.isFalse(el.classList.contains('blinkText'), 'no blinkText');
      }
    );

  });

  return {};
});
