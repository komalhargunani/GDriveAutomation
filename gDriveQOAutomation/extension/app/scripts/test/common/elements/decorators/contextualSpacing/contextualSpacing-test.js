define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Contextual spacing decorator mixin:',
      'contextual-spacing-decorator', function() {

    var props = {
      contextualSpacing: true
    };
    var unset = {
      contextualSpacing: false
    };

    this.shouldSupport('contextualSpacing');

    this.shouldDecorate(
      'Should be possible to decorate contextualSpacing', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.equal(el.getAttribute('data-contextual-spacing'), 'true');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.getAttribute('data-contextual-spacing'), null);
      }
    );

  });

  return {};
});
