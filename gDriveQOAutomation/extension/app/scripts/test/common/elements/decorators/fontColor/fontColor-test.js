define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'text color mixin:',
      'font-color-decorator', function() {

    var props = {
      clr: '#123456'
    };
    var unset = {
      clr: '#000000'
    };

    this.shouldSupport('clr');

    this.shouldDecorate(
      'Should be possible to decorate text color', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.color, 'rgb(18, 52, 86)', 'have font color');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.color, '', 'have no font color');
      }
    );

  });

  return {};
});
