/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Shape Effect Decorator
 * @constructor
 */
define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/drawing/color/colorUtility'
], function(UnitConversionUtils, ColorUtility) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        var _reflectionAlignmentMap = {
          "b": "below",
          "bl": "below",
          "br": "below",
          "ctr": "below",
          "l": "left",
          "r": "right",
          "t": "above",
          "tl": "above",
          "tr": "above"
        };

        var _api = {

          /**
           * prepares reflection effect style for the shape
           * @param reflection effect  {JSON}
           * @return {JSON} refection style json
           */
          withReflection: function(reflectionEffect) {

            if (reflectionEffect) {
              // sometimes alignment property is absent in xml, and ECMA - 376
              // doesn't say anything about the fallback. But MS Point falls
              // back to "below". Hence, we also fallback to "below".
              var align = reflectionEffect.algn ?
                _reflectionAlignmentMap[reflectionEffect.algn] : "below";
              var blurRad = UnitConversionUtils.
                convertEmuToPixel(reflectionEffect.blurRad);
              var dist = reflectionEffect.dist ? UnitConversionUtils.
                convertEmuToPixel(reflectionEffect.dist) : 0;
              var endPosition = 100 - reflectionEffect.endpos;

              var style = {'-webkit-box-reflect': align + " " + dist +
                "px -webkit-gradient(linear, left top, left bottom," +
                " from(transparent), color-stop(" +
                endPosition + "%, transparent), to(rgba(255,255,255," +
                blurRad + ")))"};

              return style;
            }
          },

          /**
           * prepares shadow effect style for the shape
           * @param shadow effect  {JSON}
           * @return {JSON} shadow style json
           */
          withShadow: function(shadowEffectJSON) {
            var effectsBean = _api.computeShadowEffects(shadowEffectJSON);
            var style = {'-webkit-box-shadow': effectsBean.delta.x + "pt " +
              effectsBean.delta.y + "pt " + effectsBean.blurRad + "px " +
              effectsBean.clr};
            return style;
          },

          /**
           * Removes redundant effects from target div
           * @param targetDiv {div} shape / canvas
           * @param effectList {JSON} shape properties
           * @param isHighLevelEffect {boolean} It describes whether effect is
           *                                    high level (reflection) or low
           *                                    level (shadow).
           */
          withRedundantEffects: function(targetDiv, effectList,
                                         isHighLevelEffect) {
            var style = {};
            if (effectList) {
              if (isHighLevelEffect === undefined ||
                effectList.isEmpty === true) {
                // remove all effects
                if(!targetDiv.style['-webkit-box-shadow']) {
                  style['-webkit-box-shadow'] = 'none';
                }
                if(!targetDiv.style['-webkit-box-reflect']) {
                  style['-webkit-box-reflect'] = 'none';
                }
              } else if (isHighLevelEffect === true) {
                // remove high level effects
                if (!effectList.refnEff) {
                  style = {'-webkit-box-reflect': 'none'};
                }
              } else {
                // remove low level effects
                if (!effectList.outSdwEff) {
                  style = {'-webkit-box-shadow': 'none'};
                }
              }
            }
            return style;
          },

          /**
           * computes the shadow effect properties
           * @param shadowEffectJSON
           */
          computeShadowEffects: function(shadowEffectJSON) {
            var effectsBean = {
              type: undefined,
              clr: undefined,
              blurRad: 0,
              delta: {
                x: 0,
                y: 0
              }
            };
            if (shadowEffectJSON) {
              effectsBean.type = shadowEffectJSON.type;
              effectsBean.blurRad = UnitConversionUtils.
                convertEmuToPixel(shadowEffectJSON.blurRad) || 0;
              effectsBean.clr = shadowEffectJSON.color &&
                ColorUtility.getColor(shadowEffectJSON.color);
              var dist = shadowEffectJSON.dist ? UnitConversionUtils.
                convertEmuToPoint(shadowEffectJSON.dist) : 0;
              var angle = shadowEffectJSON.dir ?
                shadowEffectJSON.dir / 60000 : 0;
              angle = angle * Math.PI / 180;

              effectsBean.delta = {
                x: Math.round(dist * Math.cos(angle)),
                y: Math.round(dist * Math.sin(angle))
              };
            }
            return effectsBean;
          }
        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
