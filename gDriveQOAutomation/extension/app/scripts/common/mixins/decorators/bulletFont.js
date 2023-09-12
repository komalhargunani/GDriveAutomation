define([
  'common/mixins/decorators/bulletDecoratorBase',
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/drawing/theme/themeFontManager',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/fontManager'
], function(
    BulletDecoratorBase,
    DecoratorBase,
    MixinUtils,
    ThemeFontManager,
    Converter,
    Fonts) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, BulletDecoratorBase, {

    supports_: ['bulletFont', 'bulletFontFollowText'],

    observers: [
      'fontChanged_(model.ppr.bulletFont)',
      'fontChanged_(model.ppr.bulletFontFollowText)'
    ],

    get bulletFont() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.bulletFont);
    },

    set bulletFont(value) {
      this.setInModel_('ppr.bulletFont', value);
    },

    get bulletFontFollowText() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.bulletFontFollowText);
    },

    set bulletFontFollowText(value) {
      this.setInModel_('ppr.bulletFontFollowText', value);
    },

    fontChanged_: function() {
      var fontFamily;
      var beforeRule = this.getBulletStyle();
      delete beforeRule['font-family'];
      if (this.bulletFont) {
        var fontFace = ThemeFontManager.getThemeFontFace(this.bulletFont) ||
            this.bulletFont;
        fontFamily = Fonts.family(fontFace);
        if (fontFamily) {
          beforeRule['font-family'] = fontFamily + ' !important';
        }
      }
      this.setBulletStyle(beforeRule);
    },

    computedDecorations_: {
      bulletFont: function(/* computedStyles */) {
        var computedStylesBefore = window.getComputedStyle(this, 'before');
        return Converter.fontFamily2fontFace(computedStylesBefore.fontFamily);
      },
      bulletFontFollowText: function(/* computedStyles */) {
        return !!this.bulletFontFollowText;
      }
    },

    onFirstRunChanged_: {
      bulletFont: function() {
        var fontFamily;
        // If explicit bullet font is not specified then we will fallback to
        // first run's font.
        if (this.firstChild && this.firstChild instanceof QowtPointRun) {
          fontFamily = this.firstChild.getComputedDecorations().font;

          var beforeFollowTextRule = this.getFollowStyle();
          beforeFollowTextRule['font-family'] = fontFamily;
          if (this.bulletFontFollowText) {
            // bulletFontFollowText property is set for the bullet so
            // take that as highest priority
            beforeFollowTextRule['font-family'] += ' !important';
          }
          this.setFollowStyle(beforeFollowTextRule);

          // For auto number bullets we fallback to the first run's font even
          // if the bullet font is explicitly specified.
          var beforeAutoRule = this.getAutoBulletStyle();
          beforeAutoRule['font-family'] = fontFamily + ' !important';
          this.setAutoBulletStyle(beforeAutoRule);
        }
      }
    }
  });


  return api_;

});
