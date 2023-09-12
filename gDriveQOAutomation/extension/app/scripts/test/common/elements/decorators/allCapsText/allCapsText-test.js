define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'allcaps mixin:',
      'allcaps-decorator', function() {

    var props = {
      acp: true
    };
    var unset = {
      acp: false
    };

    this.shouldSupport('acp');

    this.shouldDecorate(
      'Should be possible to decorate allcaps', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.textTransform, 'uppercase', 'have uppercase');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.textTransform, '', 'have no uppercase');
      }
    );

  });

  return {};
});
