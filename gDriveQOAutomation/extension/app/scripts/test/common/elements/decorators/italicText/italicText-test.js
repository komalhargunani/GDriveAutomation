define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'italic text mixin:',
      'italic-decorator', function() {

    var props = {
      itl: true
    };
    var unset = {
      itl: false
    };

    this.shouldSupport('itl');

    this.shouldDecorate(
      'Should be possible to decorate italic text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.fontStyle, 'italic', 'be italic');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.fontStyle, '', 'not be italic');
      }
    );

  });

  return {};
});
