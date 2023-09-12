define([
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/drawing/theme/themeFontManager'
], function(ThemeManager,
            ThemeFontManager) {

  'use strict';

  describe('ThemeFontManager Test', function() {
    var fontScheme_ = {
      'mjFnt': {
        latin: 'Times New Roman',
        ea: 'Arial',
        cs: 'Calibri'
      },
      'mnFnt': {
        latin: 'Courier New',
        ea: 'Verdana',
        cs: 'Parchment'
      }
    };

    beforeEach(function() {
      sinon.stub(ThemeManager, 'getFontStyle').returns(fontScheme_);
    });

    afterEach(function() {
      ThemeManager.getFontStyle.restore();
    });

    it('should return font face for a given theme font', function() {
      var fontFace = ThemeFontManager.getThemeFontFace('+mn-lt');
      assert.strictEqual(fontFace, 'Courier New', 'Invalid theme font face.');
    });

    it('should return undefined when not a theme font', function() {
      var fontFace = ThemeFontManager.getThemeFontFace('Calibri');
      assert.strictEqual(fontFace, undefined);
    });
  });
});
