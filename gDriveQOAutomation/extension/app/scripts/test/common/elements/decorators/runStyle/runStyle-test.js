define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
    'Style decorator mixin:',
    'run-style-decorator', function() {

    beforeEach(function() {
      var officeStyles = document.getElementById('qowtOfficeStyles');
      officeStyles.getCssClassName = function() {return 'fake';};
    });

    var props = {
      runStyleId: 'Heading1'
    };
    var unset = {
      runStyleId: undefined
    };

    this.shouldSupport('runStyleId');

    this.shouldDecorate(
      'Should be possible to decorate element styles', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert(el.classList.contains('fake'), 'should have class set');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert(el.classList.length === 0, 'should have no class set');
      }
    );

  });

  return {};
});
