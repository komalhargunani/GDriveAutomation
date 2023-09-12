define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Indent decorator mixin:',
      'indent-decorator', function() {

    var props = {
      indent: 4
    };
    var unset = {
      indent: 0
    };

    this.shouldSupport('indent');

    this.shouldDecorate(
      'Should be possible to decorate indent', props,
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
