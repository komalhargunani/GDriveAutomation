define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/utils/converters/converter'], function(
    DecoratorBase,
    MixinUtils,
    ColorUtility,
    Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    // TODO: The property name 'outSdwEff' needs to be replaced by something
    // more readable (crbug: 459189)

    // TODO: We also need to support other properties like dir, dist, blurRad,
    // etc once we start honouring them(crbug:459202). We currently support
    // rendering correct color property, however, the property name 'color' is
    // not bound to shadow alone. Hence, need to replace the property name color
    // to something specific to identify it as text shadow color(crbug:459203)
    supports_: ['outSdwEff'],

    observers: [
      'outerShadowChanged_(model.rpr.outSdwEff)'
    ],

    get outSdwEff() {
      return (this.model &&
          this.model.rpr &&
          this.model.rpr.outSdwEff);
    },

    set outSdwEff(value) {
      this.setInModel_('rpr.outSdwEff', value);
    },

    outerShadowChanged_: function(current) {
      if (current) {
        var colorObj = current.color;
        var rgbaColor = colorObj && ColorUtility.getColor(colorObj);
        if (rgbaColor) {
          // TODO: We also need to honour other properties like dir, dist,
          // blurRad. Currently, we hard code the values.(crbug:459202)
          this.style['text-shadow'] = '3px 1px 1px ' + rgbaColor;
        }
      } else {
        this.style.removeProperty('text-shadow');
      }
    },

    computedDecorations_: {
      // TODO: once we start honouring other properties we need to compute
      // decorations for them separately. Currently we just check whether the
      // shadow is present or not based on the style property we apply and
      // return an object consisting of fill.
      outSdwEff: function(computedStyles) {
        var outerShadow;
        if (computedStyles.textShadow !== 'none') {
          var hexColor = Converter.colorString2hex(computedStyles.textShadow);

          // Computed colors are always represented as hex values. Therefore
          // we always return a solid fill object
          outerShadow = {
            color: {
              type: 'srgbClr',
              clr: hexColor
            }
          };
        }
        return outerShadow;
      }
    }
  });

  return api_;
});
