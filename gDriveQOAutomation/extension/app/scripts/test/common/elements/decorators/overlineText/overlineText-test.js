define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'overline text mixin:',
      'overline-text-decorator', function() {

    var props = {
      ovl: true
    };
    var unset = {
      ovl: false
    };

    this.shouldSupport('ovl');

    this.shouldDecorate(
      'Should be possible to decorate overline text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.notEqual(el.style.textDecoration.indexOf('overline'), -1);
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.textDecoration.indexOf('overline'), -1);
      }
    );

  });

  return {};
});
