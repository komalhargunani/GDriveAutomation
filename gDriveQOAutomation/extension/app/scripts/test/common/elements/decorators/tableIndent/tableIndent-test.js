define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Table indent decorator mixin',
      'table-indent-decorator', function() {

    var props = {
      indent: 77
    };
    var unset = {
      indent: 0
    };

    this.shouldSupport('indent');

    this.shouldDecorate(
      'Should be possible to decorate table indent', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.notEqual(el.style.marginLeft, '');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.marginLeft, '0px');
      }
    );

  });

  return {};
});
