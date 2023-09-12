define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'qowtRoot/utils/fontManager',
  'qowtRoot/drawing/theme/themeFontManager',
  'qowtRoot/models/env',
  'qowtRoot/utils/converters/converter'
  ], function(
  MixinUtils,
  DecoratorBase,
  FontManager,
  ThemeFontManager,
  EnvModel,
  Converter) {

  "use strict";

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['font'],

    observers: [
      'fontChanged_(model.rpr.font)'
    ],

    get font() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.font);
    },

    set font(value) {
      this.setInModel_('rpr.font', value);
    },

    fontChanged_: function(current) {
      if (current) {
        // Map theme fonts to font faces
        var fontFace = this.resolveFont_(current);
        FontManager.setFontClassName(this, fontFace);
      } else {
        FontManager.removeFontClassName(this);
      }
    },

    resolveFont_: function(fontName) {
      return (EnvModel.app === 'point') ?
          ThemeFontManager.getThemeFontFace(fontName) || fontName : fontName;
    },

    computedDecorations_: {
      font: function(computedStyles) {
        // if this element has the value in it's model then we do not need to
        // look in to the computed style at all, otherwise use computedStyles.
        return this.font ? this.resolveFont_(this.font) :
               Converter.fontFamily2fontFace(computedStyles.fontFamily);
      }
    }

  });

  return api_;

});
