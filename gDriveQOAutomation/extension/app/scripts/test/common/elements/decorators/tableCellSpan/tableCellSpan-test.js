define([
  'test/common/elements/decorators/decoratorTestUtils'
], function(
    DecoratorsTestUtils) {

  'use strict';

  DecoratorsTestUtils.describe(
      'Table cell span decorator mixin',
      'table-cell-span-decorator', function () {

    var props = {
      csp: 2,
      rsp: 2
    };
    var unset = {
      csp: undefined,
      rsp: undefined
    };

    this.shouldSupport(['csp','rsp']);

    this.shouldDecorate(
      'Should be possible to decorate cell span', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.equal(el.colSpan, 2);
        assert.equal(el.rowSpan, 2);
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.colSpan, 1);
        assert.equal(el.rowSpan, 1);
      }
    );
  });

  return {};
});
