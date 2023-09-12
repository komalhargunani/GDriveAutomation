define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Table row height decorator mixin',
      'row-height-decorator', function() {

    var props = {
      height: 77
    };
    var unset = {
      height: 0
    };

    this.shouldSupport('height');

    this.shouldDecorate(
        'Should be possible to decorate table row height', props,
        function afterDecorating(el, decs) {
          assert.deepEqual(decs, props, 'properties after decorate');
          assert.notEqual(el.style.height, '');
        },
        function afterUndecorating(el, decs) {
          assert.deepEqual(decs, unset, 'properties after undecorate');
          assert.equal(el.style.height, '');
        }
    );

  });

  return {};
});
