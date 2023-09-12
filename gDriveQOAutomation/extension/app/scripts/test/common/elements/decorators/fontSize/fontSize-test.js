define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'font size mixin:',
      'font-size-decorator', function() {

    var props = {
      siz: 72
    };

    this.shouldSupport('siz');

    this.shouldDecorate(
      'Should be possible to decorate font size text', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.notEqual(el.style.fontSize, '', 'have specific fontSize');
      },
      function afterUndecorating(el, decs) {
        // when undecorating the fontSize will be whatever is the user-agent
        // default which we can not guarantee will always be the same. But
        // we're pretty sure the default is not 72, so we just verify it
        // is no longer what we initially decorated it to.
        assert.notDeepEqual(decs, props, 'properties after undecorate');
        assert.equal(el.style.fontSize, '', 'NOT have specific fontSize');
      }
    );

  });

  return {};
});
