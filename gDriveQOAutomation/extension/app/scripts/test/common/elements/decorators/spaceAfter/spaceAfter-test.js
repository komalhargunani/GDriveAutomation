define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Space after mixin:',
      'space-after-decorator', function() {

    var props = {
      spa: 6
    };
    var unset = {
      spa: undefined
    };

    this.shouldSupport('spa');

    this.shouldDecorate(
      'Should be possible to decorate space after', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.notEqual(el.style.paddingBottom, '', 'have a bottom margin');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.paddingBottom, '', 'have no bottom margin');
      }
    );

  });

  return {};
});
