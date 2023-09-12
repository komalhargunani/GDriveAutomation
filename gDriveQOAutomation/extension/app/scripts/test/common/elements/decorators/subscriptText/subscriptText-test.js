define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'subscript mixin:',
      'subscript-decorator', function() {

    var props = {
      sub: true
    };
    var unset = {
      sub: undefined
    };

    this.shouldSupport('sub');

    this.shouldDecorate(
      'Should be possible to decorate subscript text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.zoom, '75%', 'have specific zoom');
        assert.equal(el.style.verticalAlign, 'sub', 'have sub verticalAlign');
        assert.equal(el.style.lineHeight, '0', 'have lineHeight 0');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.zoom, '', 'have no zoom');
        assert.equal(el.style.verticalAlign, '', 'have no verticalAlign');
        assert.equal(el.style.lineHeight, '', 'have no lineHeight');
      }
    );

  });

  return {};
});
