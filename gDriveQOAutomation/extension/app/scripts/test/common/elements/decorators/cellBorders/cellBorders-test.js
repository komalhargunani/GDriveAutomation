define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Cell Borders decorator mixin',
      'cell-borders-decorator', function() {

    var props = {
      borders: {
        top: {
          style: 'double',
          width: 56,
          color: '#445566'
        }
      }
    };
    var unset = {
      borders: {}
    };

    this.shouldSupport('borders');

    this.shouldDecorate(
      'Should be possible to decorate cell borders', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.equal(el.style.borderTopWidth, '7pt', 'have top border width');
        assert.equal(el.style.borderTopStyle, 'double',
                     'have top border style');
        assert.equal(el.style.borderTopColor, 'rgb(68, 85, 102)',
                     'have top border color');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.borderTop, '', 'have no top border');
      }
    );

  });

  return {};
});
