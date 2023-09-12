define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'background color mixin',
      'background-color-decorator', function() {

    var props = {
      shading: {
        backgroundColor: '#123456'
      }
    };

    var unset = {
      shading: {
        backgroundColor: 'auto'
      }
    };

    this.shouldSupport('shading');

    this.shouldDecorate(
      'Should be possible to decorate background color', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.backgroundColor, 'rgb(18, 52, 86)',
            'have background color');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.backgroundColor, '', 'have no background color');
      }
    );

  });

  return {};
});
