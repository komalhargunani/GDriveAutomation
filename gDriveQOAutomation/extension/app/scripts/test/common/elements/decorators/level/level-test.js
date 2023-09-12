define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Level decorator mixin:',
      'level-decorator', function() {

    var props = {
      level: 4
    };
    var unset = {
      level: 0
    };

    this.shouldSupport('level');

    this.shouldDecorate(
      'Should be possible to decorate level', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'properties after decorate');
        assert.equal(el.getAttribute('qowt-level'), props.level, 'level match');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.getAttribute('qowt-level'), null, 'level unset');
      }
    );

  });

  return {};
});
