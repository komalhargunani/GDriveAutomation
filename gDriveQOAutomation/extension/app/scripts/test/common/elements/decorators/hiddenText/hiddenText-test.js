define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'hidden text mixin:',
      'hidden-text-decorator', function() {

    var props = {
      hid: true
    };
    var unset = {
      hid: false
    };

    this.shouldSupport('hid');

    this.shouldDecorate(
      'Should be possible to decorate hidden text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.display, 'none', 'have no display');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.notEqual(el.style.display, 'none', 'have some sort of display');
      }
    );

  });

  return {};
});
