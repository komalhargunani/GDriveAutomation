define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Hanging indent decorator mixin:',
      'hanging-indent-decorator', function() {

    var props = {
      hin: 4
    };
    var unset = {
      hin: -0
    };

    this.shouldSupport('hin');

    this.shouldDecorate(
      'Should be possible to decorate hanging indent', props,
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
