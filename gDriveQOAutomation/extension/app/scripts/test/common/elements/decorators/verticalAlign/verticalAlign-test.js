define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'vertical alignment mixin',
      'vertical-align-decorator', function() {

    var props = {
      verticalAlign: 'middle'
    };
    var unset = {
      verticalAlign: undefined
    };

    this.shouldSupport('verticalAlign');

    this.shouldDecorate(
      'Should be possible to decorate vertical alignment', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.style.verticalAlign, 'middle',
            'have vertical alignment');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(
            el.style.verticalAlign, '', 'have no vertical alignment');
      }
    );

  });

  return {};
});
