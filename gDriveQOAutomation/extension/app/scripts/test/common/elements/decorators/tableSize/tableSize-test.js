define([
  'test/common/elements/decorators/decoratorTestUtils'
], function(
    DecoratorsTestUtils) {

  'use strict';

  DecoratorsTestUtils.describe(
      'Table size decorator mixin',
      'table-size-decorator', function() {

    var props = {
      cgr: [567]
    };
    var unset = {
      cgr: []
    };

    this.shouldSupport('cgr');

    this.shouldDecorate(
      'Should be possible to decorate table size', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.equal(el.style.width, '28.35pt');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.width, '0px');
      }
    );

  });

  return {};
});
