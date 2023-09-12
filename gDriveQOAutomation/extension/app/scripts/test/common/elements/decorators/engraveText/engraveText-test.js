define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'engrave text mixin:',
      'engrave-decorator', function() {

    var props = {
      eng: true
    };
    var unset = {
      eng: false
    };

    this.shouldSupport('eng');

    this.shouldDecorate(
      'Should be possible to decorate engrave text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.isTrue(el.classList.contains('engraveText'), 'have engraveText');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.isFalse(el.classList.contains('engraveText'), 'no engraveText');
      }
    );

  });

  return {};
});
