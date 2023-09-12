define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'PageBreakBefore decorator mixin:',
      'page-break-before-decorator', function() {

    var props = {
      pbb: true
    };
    var unset = {
      pbb: undefined
    };

    this.shouldSupport('pbb');

    this.shouldDecorate(
      'Should be possible to decorate page break before', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.notEqual(el.getAttribute('break-before'), null);
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.getAttribute('break-before'), null);
      }
    );

  });

  return {};
});
