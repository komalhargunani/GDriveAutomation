define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
    DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Left and hanging indent decorator mixin:',
      'left-and-hanging-indent-decorator', function() {

        var propsWithHangingInd = {
          lin: 19,
          hin: 20
        };

        var propsWithoutHangingInd = {
          lin: 19
        };

        this.shouldSupport('lin');
        this.shouldSupport('hin');
        this.shouldDecorate(
          'Should set marginLeft when decorated with left indent and ' +
            'textIndent with hanging indent', propsWithHangingInd,
          function afterDecorating(el) {
            // verify left indent is applied
            assert.equal(el.style.marginLeft, '19pt');
            // Verify hanging indent.
            assert.equal(el.style.textIndent, '-20pt');
          },
          function afterUndecorating(el) {
            assert.equal(el.style.marginLeft, '');
            assert.equal(el.style.textIndent, '');
          }
        );

        this.shouldDecorate(
            'Should set marginLeft when decorated with only left indent and ' +
              'no textIndent is applied', propsWithoutHangingInd,
            function afterDecorating(el) {
              // verify left indent is applied
              assert.equal(el.style.marginLeft, '19pt');
              // Verify that if we don't have a hanging indent then no text
              // indent is applied.
              assert.equal(el.style.textIndent, '');
            },
            function afterUndecorating(el) {
              assert.equal(el.style.marginLeft, '');
              assert.equal(el.style.textIndent, '');
            }
        );
      });

  return {};
});
