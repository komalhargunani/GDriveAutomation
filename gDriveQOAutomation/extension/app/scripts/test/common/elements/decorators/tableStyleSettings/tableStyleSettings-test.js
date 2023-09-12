define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Table style settings decorator mixin',
      'table-style-settings-decorator', function() {

    var props = {
      styleSettings: ['firstrow']
    };
    var unset = {
      styleSettings: undefined
    };

    this.shouldSupport('styleSettings');

    this.shouldDecorate(
      'Should be possible to decorate table style settings', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.isTrue(
            el.hasAttribute('firstrow'), 'attribute should be set');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.attributes.length, 1, 'there should be no attributes');
      }
    );

  });

  return {};
});
