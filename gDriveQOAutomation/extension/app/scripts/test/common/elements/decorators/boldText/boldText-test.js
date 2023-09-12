define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'bold text mixin:',
      'bold-decorator', function() {

    var props = {
      bld: true
    };
    var unset = {
      bld: false
    };

    this.shouldSupport('bld');

    this.shouldDecorate(
      'Should be possible to decorate bold text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.fontWeight, 'bold', 'be bold');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.fontWeight, '', 'not be bold');
      }
    );

  });

  return {};
});
