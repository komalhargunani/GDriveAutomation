/**
 * TODO: Remove this old-style decorator in favor of a decorator mixin once the
 * slide is implemented as a polymer-element
 */
define([
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/drawing/theme/themeFillStyleManager',
  'qowtRoot/utils/cssManager',
  'third_party/lo-dash/lo-dash.min'
], function(FillHandler,
            ThemeFillStyleManager,
            CSSManager) {

  'use strict';

  /**
   * This is the decorator for a slide's background. It assists in preparing the
   * fill styles of background as per the slide's fill proeprties.
   *
   * @constructor
   */
  function SlideFillDecorator() {}

  /**
   * A static method that sets the css style rules applicable to the slide
   * background div as per the fill DCP JSON and using color map override
   * (if available) in the passed cssSelector
   *
   * TODO (murtaza.haveliwala): (Crbug - 431196) Refactor this to apply css
   * rules on corresponding element directly via style attribute rather than via
   * css selectors and adding the classes to DOM
   *
   * @param {String} cssSelector
   * @param {JSON} slide  slide/slideLayout/slideMaster's DCP JSON
   */
  SlideFillDecorator.setFill = function(cssSelector, slide) {
    var cssRuleString = computeBgFillStyle_(cssSelector, slide);

    // Add CSS selector and rules to DOM, if rule string isn't blank
    if (cssRuleString.trim() !== '') {
      CSSManager.addRule(cssSelector, cssRuleString, 100);
    }
  };

  // -------------------- PRIVATE ----------------------
  /**
   * Overrides color schemes present in fill json as per the override map
   *
   * @param {JSON} fill
   * @param {Object} colorOverrideMap
   * @private
   */
  var mapColors_ = function(fill, colorOverrideMap) {
    if (fill && colorOverrideMap) {
      var color;

      switch (fill.type) {
        case 'solidFill':
          color = fill.color;
          if (color && color.scheme && colorOverrideMap[color.scheme]) {
            color.scheme = colorOverrideMap[color.scheme];
          }
          break;

        case 'gradientFill':
          if (fill.gsLst) {
            fill.gsLst.forEach(function(gradientStop) {
              color = gradientStop.color;
              if (color && color.scheme && colorOverrideMap[color.scheme]) {
                color.scheme = colorOverrideMap[color.scheme];
              }
            });
          }
          break;
        case 'blipFill':
          if (fill.blip.effects) {
            fill.blip.effects.forEach(function(effect) {
              // Duotone effect might have placeholder or any colors that can be
              // overriden. Find and replace with actual.
              if (effect && effect.type === 'duotone') {
                [effect.color1, effect.color2].forEach(function(color) {
                  if (color && color.scheme && colorOverrideMap[color.scheme]) {
                    color.scheme = colorOverrideMap[color.scheme];
                  }
                });
              }
            });
          }
          break;

        default:
          break;
      }
    }
  };

  /**
   * Computes the applicable background fill style
   *
   * @param {String} cssSelector
   * @param {JSON} slide  slide/slideLayout/slideMaster's DCP JSON
   *
   * @return {String} Css style rules string as per the supplied
   * fill. Returns blank string if fill information is missing in slide dcp.
   * @private
   */
  var computeBgFillStyle_ = function(cssSelector, slide) {
    var slideBgRef = slide.bgFillRef,
        cssStyleRules = '';

    if (slide.fill || slideBgRef) {
      // get the fill data - available either as explicit fill or to
      // be fetched from theme (if bgRef is specified)
      var fill;

      // if fill is explicitly defined at this level
      if (slide.fill) {
        fill = _.cloneDeep(slide.fill);
      } else {
        // if fill is not explicitly defined, then use the implicit fill
        // from theme
        fill = _.cloneDeep(ThemeFillStyleManager.getFillStyle(slideBgRef.idx));

        // resolve placeholder colors in cached fill json with the
        // specified color scheme
        if (slideBgRef.color && slideBgRef.color.scheme) {
          mapColors_(fill, {'phClr': slideBgRef.color.scheme});
        }
      }

      // do color scheme overriding if ('clrMapOvr') color map
      // override is available
      var colorMapOvr = slide.clrMapOvr;
      if (colorMapOvr) {
        // first prepare a simple key value map from 'colorMapOvr'
        var simpleColorOverrideMap = {};
        colorMapOvr.forEach(function(clrScheme) {
          simpleColorOverrideMap[clrScheme.name] = clrScheme.value;
        });

        mapColors_(fill, simpleColorOverrideMap);
      }

      // Now compute the fill css rules and get the style rules string
      cssStyleRules = FillHandler.getFillStyle(fill, cssSelector);
    }

    return cssStyleRules;
  };

  return SlideFillDecorator;
});
