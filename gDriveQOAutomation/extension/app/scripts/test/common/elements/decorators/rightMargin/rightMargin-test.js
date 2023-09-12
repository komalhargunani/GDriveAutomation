define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Right margin decorator mixin:',
      'right-margin-decorator', function() {

    var props = {
      rightMargin: 4
    };
    var unset = {
      rightMargin: 0
    };

    this.shouldSupport('rightMargin');

    this.shouldDecorate(
      'Should be possible to decorate rightMargin', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.notEqual(el.style.marginRight, '');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.marginRight, '');
      }
    );

  });

  return {};
});
