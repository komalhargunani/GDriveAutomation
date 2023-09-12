define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'First line indent decorator mixin:',
      'first-line-indent-decorator', function() {

    var props = {
      fli: 4
    };
    var unset = {
      fli: undefined
    };

    this.shouldSupport('fli');

    this.shouldDecorate(
      'Should be possible to decorate first line indent', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.notEqual(el.style.textIndent, '');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.textIndent, '');
      }
    );

  });

  return {};
});
