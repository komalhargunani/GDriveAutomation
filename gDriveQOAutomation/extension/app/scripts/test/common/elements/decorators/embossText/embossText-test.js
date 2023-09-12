define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'emboss text mixin:',
      'emboss-decorator', function() {

    var props = {
      emb: true
    };
    var unset = {
      emb: false
    };

    this.shouldSupport('emb');

    this.shouldDecorate(
      'Should be possible to decorate emboss text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.isTrue(el.classList.contains('embossText'), 'have embossText');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.isFalse(el.classList.contains('embossText'), 'no embossText');
      }
    );

  });

  return {};
});
