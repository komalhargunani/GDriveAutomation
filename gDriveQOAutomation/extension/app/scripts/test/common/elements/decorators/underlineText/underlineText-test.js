define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'underline text mixin:',
      'underline-decorator', function() {

    var props = {
      udl: true
    };
    var unset = {
      udl: false
    };

    this.shouldSupport('udl');

    this.shouldDecorate(
      'Should be possible to decorate underline text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.notEqual(el.style.textDecoration.indexOf('underline'), -1);
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.textDecoration.indexOf('underline'), -1);
      }
    );

  });

  return {};
});
