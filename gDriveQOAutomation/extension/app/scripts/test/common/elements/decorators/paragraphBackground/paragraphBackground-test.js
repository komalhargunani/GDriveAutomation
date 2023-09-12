define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'para background mixin:',
      'para-background-decorator', function() {

    var shading = {
      shading: {
        backgroundColor: '#654321'
      }
    };

    var unset = {
      shading: {
        backgroundColor: 'auto'
      }
    };

    this.shouldSupport('shading');

    this.shouldDecorate(
      'Should be possible to decorate shading', shading,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, shading, 'after decorate');
        assert.equal(el.style.backgroundColor, 'rgb(101, 67, 33)',
            'have font highlight');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.backgroundColor, '', 'have no font highlight');
      }
    );
  });

  return {};
});
