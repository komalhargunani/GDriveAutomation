define([
  'qowtRoot/utils/fontManager',
  'test/common/elements/decorators/decoratorTestUtils'], function(
  FontManager,
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'fontFace mixin:',
      'font-face-decorator', function() {

    beforeEach(function() {
      sinon.stub(FontManager, 'setFontClassName', function(el) {
        el.classList.add('fake');
      });
      sinon.stub(FontManager, 'removeFontClassName', function(el) {
        el.classList.remove('fake');
      });
      sinon.stub(FontManager, 'getFontName').returns('fake');
    });

    afterEach(function() {
      FontManager.setFontClassName.restore();
      FontManager.removeFontClassName.restore();
      FontManager.getFontName.restore();
    });

    var props = {
      font: 'fake'
    };

    this.shouldSupport('font');

    // Note: since the decorator uses the font manager that we have stubbed out;
    // and more importantly, since all text will always have a computed style
    // for font-family, we can't easily distinguish between the right computed
    // decoration values, so we just use 'fake' for both setting and getting.
    // The test will make sure we have added/removed to the classList
    this.shouldDecorate(
      'Should be possible to decorate fontFace text', props,
      function afterDecorating(el) {
        assert.isTrue(el.classList.length > 0, 'have a style');
      },
      function afterUndecorating(el) {
        assert.isTrue(el.classList.length === 0, 'have no styles');
      }
    );

  });

  return {};
});
