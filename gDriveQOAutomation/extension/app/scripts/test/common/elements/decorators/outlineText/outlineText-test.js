define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'outline text mixin:',
      'outline-text-decorator', function() {

    var props = {
      otl: true
    };
    var unset = {
      otl: false
    };

    this.shouldSupport('otl');

    this.shouldDecorate(
      'Should be possible to decorate outline text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.isTrue(el.classList.contains('outlineText'), 'have outlineText');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.isFalse(el.classList.contains('outlineText'), 'no outlineText');
      }
    );

  });

  return {};
});
