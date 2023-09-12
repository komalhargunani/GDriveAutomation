define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'strikethrough text mixin:',
      'strikethrough-decorator', function() {

    var props = {
      str: true,
      dstr: true
    };
    var unset = {
      str: false,
      dstr: false
    };

    this.shouldSupport('str');
    this.shouldSupport('dstr');

    this.shouldDecorate(
      'Should be possible to decorate strikethrough text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.notEqual(el.style.textDecoration.indexOf('line-through'), -1);
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.textDecoration.indexOf('line-through'), -1);
      }
    );

  });

  return {};
});
