define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Left indent decorator mixin:',
      'left-indent-decorator', function() {

    var props = {
      lin: 4
    };
    var unset = {
      lin: 0
    };

    this.shouldSupport('lin');

    this.shouldDecorate(
      'Should be possible to decorate left indent', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.notEqual(el.style.marginLeft, '');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.marginLeft, '');
      }
    );

  });

  return {};
});
