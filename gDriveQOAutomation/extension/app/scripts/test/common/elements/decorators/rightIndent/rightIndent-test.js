define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Right indent decorator mixin:',
      'right-indent-decorator', function() {

    var props = {
      rin: 4
    };
    var unset = {
      rin: 0
    };

    this.shouldSupport('rin');

    this.shouldDecorate(
      'Should be possible to decorate right indent', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.notEqual(el.style.marginRight, '');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.textIndent, '');
      }
    );

  });

  return {};
});
