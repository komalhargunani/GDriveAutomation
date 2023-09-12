define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'small caps mixin:',
      'small-caps-text-decorator', function() {

    var props = {
      scp: true
    };
    var unset = {
      scp: undefined
    };

    this.shouldSupport('scp');

    this.shouldDecorate(
      'Should be possible to decorate small caps', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.fontVariant, 'small-caps', 'have smallcaps font');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.fontVariant, 'normal', 'have normal font');
      }
    );

  });

  return {};
});
