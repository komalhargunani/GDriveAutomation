define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'super script mixin:',
      'superscript-decorator', function() {

    var props = {
      sup: true
    };
    var unset = {
      sup: undefined
    };

    this.shouldSupport('sup');

    this.shouldDecorate(
      'Should be possible to decorate super script text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.zoom, '75%', 'have specific zoom');
        assert.equal(el.style.verticalAlign, 'super', 'have super align');
        assert.equal(el.style.lineHeight, '0', 'have lineHeight 0');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.zoom, '', 'have no zoom');
        assert.equal(el.style.verticalAlign, '', 'have no align');
        assert.equal(el.style.lineHeight, '', 'have no lineHeight');
      }
    );

  });

  return {};
});
