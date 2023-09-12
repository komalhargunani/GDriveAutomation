define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Space before mixin:',
      'space-before-decorator', function() {

    var props = {
      spb: 6
    };
    var unset = {
      spb: undefined
    };

    this.shouldSupport('spb');

    this.shouldDecorate(
      'Should be possible to decorate space before', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'before decorate');
        assert.notEqual(el.style.paddingTop, '', 'have a top margin');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties before undecorate');
        assert.equal(el.style.paddingTop, '', 'have no top margin');
      }
    );

  });

  return {};
});
