define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Left margin decorator mixin:',
      'left-margin-decorator', function() {

    var props = {
      leftMargin: 4
    };
    var unset = {
      leftMargin: 0
    };

    this.shouldSupport('leftMargin');

    this.shouldDecorate(
      'Should be possible to decorate leftMargin', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.notEqual(el.style.marginLeft, '');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.marginLeft, '');
      }
    );

  });

  return {};
});
