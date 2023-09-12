define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'shadow text mixin:',
      'shadow-text-decorator', function() {

    var props = {
      shw: true
    };
    var unset = {
      shw: false
    };

    this.shouldSupport('shw');

    this.shouldDecorate(
      'Should be possible to decorate shadow text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.isTrue(el.classList.contains('shadowText'), 'have shadowText');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.isFalse(el.classList.contains('shadowText'), 'no shadowText');
      }
    );

  });

  return {};
});
