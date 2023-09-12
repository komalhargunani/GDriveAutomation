// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test fot point geometryManager
 *
 * @see src/drawing/geometry/geometryManager.js
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/drawing/geometry/geometryManager',
  'qowtRoot/drawing/theme/themeStyleRefManager'
], function(GeometryManager, ThemeStyleRefManager) {

  'use strict';

  describe('Geometry Manager test', function() {

    var shapeProperties = {
      'fill': {
        color: {
          clr: '#ff0000',
          type: 'srgbClr'
        },
        type: 'solidFill'
      },
      'geom': {
        'prst': 109
      },
      'ln': {
        cmpd: 'sng',
        fill: {
          color: {
            clr: '#ffff00',
            type: 'srgbClr'
          },
          type: 'solidFill'
        },
        prstDash: 'dashDot',
        w: 76200
      }
    };

    var fillColorBean = {
      fill: {
        color: {
          clr: '#ff0000',
          type: 'srgbClr'
        },
        type: 'solidFill'
      },
      outlineFill: {
        type: 'solidFill',
        lineWidth: 8,
        data: {
          color: {
            clr: '#ffff00',
            type: 'srgbClr'
          }
        }
      },
      ends: {
        headendtype: 'none',
        headendlength: 'medium',
        headendwidth: 'medium',
        tailendtype: 'none',
        tailendlength: 'medium',
        tailendwidth: 'medium'
      },
      prstDash: 'dashDot'
    };

    var someGroupShapeProperties = {};

    it('should generate fill color bean properly when presetDash is defined',
        function() {
          var geoMgrApi = GeometryManager.initialize(shapeProperties,
              someGroupShapeProperties);
          var genereatedColorBean = geoMgrApi.generateFillColorBean();

          expect(genereatedColorBean).toEqual(fillColorBean);
        });

    it('should generate fill color bean properly when presetDash is undefined',
        function() {
          shapeProperties.ln.prstDash = undefined;
          fillColorBean.prstDash = 'solid';

          var geoMgrApi = GeometryManager.initialize(shapeProperties,
              someGroupShapeProperties);
          var genereatedColorBean = geoMgrApi.generateFillColorBean();

          expect(genereatedColorBean).toEqual(fillColorBean);
        });

    it('should generate effect bean for shape effect properly', function() {
      shapeProperties.efstlst = {
        outSdwEff: {
          algn: 'tl',
          blurRad: 276225,
          color: {
            clr: '#0000ff',
            type: 'srgbClr'
          },
          dir: 5400000,
          dist: 635000,
          rotwithshape: false,
          type: 'outerShdw'
        }
      };

      var effectsBean = {
        blurRad: 29,
        clr: 'rgba(0,0,255,1)',
        delta: {
          x: 0,
          y: 66.66666666666667
        },
        type: 'outerShdw'
      };

      var geoMgrApi = GeometryManager.initialize(shapeProperties,
          someGroupShapeProperties);
      var genereatedEffectBean = geoMgrApi.generateEffectsBean();

      expect(genereatedEffectBean).toEqual(effectsBean);
    });

    it('should not generate shape shadow when isEmpty is true', function() {
      shapeProperties.efstlst = {
        isEmpty: true
      };

      var effectsBean = {
        blurRad: 0,
        clr: undefined,
        delta: {
          x: 0,
          y: 0
        }
      };

      var cachedThemeEffect = {
        'isEmpty': false,
        outSdwEff: {
          algn: 'tl',
          blurRad: 276225,
          color: {
            clr: '#0000ff',
            type: 'srgbClr'
          },
          dir: 5400000,
          dist: 635000,
          rotwithshape: false,
          type: 'outerShdw'
        }
      };

      var geoMgrApi = GeometryManager.initialize(shapeProperties, undefined);
      spyOn(ThemeStyleRefManager, 'getCachedEffectRefStyle').andReturn(
          cachedThemeEffect);
      var genereatedEffectBean = geoMgrApi.generateEffectsBean();
      expect(genereatedEffectBean).toEqual(effectsBean);
    });

    it('should not fill fillColorBean if fill type is grpFill ' +
        'and groupShapeProperties are undefined', function() {
          shapeProperties.efstlst = {
            outSdwEff: {
              algn: 'tl',
              blurRad: 276225,
              color: {
                clr: '#0000ff',
                type: 'srgbClr'
              },
              dir: 5400000,
              dist: 635000,
              rotwithshape: false,
              type: 'outerShdw'
            }
          };

          someGroupShapeProperties = undefined;

          var geoMgrApi = GeometryManager.initialize(shapeProperties,
              someGroupShapeProperties);
          var genereatedEffectBean = geoMgrApi.generateEffectsBean();

          expect(genereatedEffectBean.fill).toEqual(undefined);
        });

    it('should not fill fillColorBean if fill type is grpFill and ' +
        'groupShapeProperties.fill is undefined', function() {
          shapeProperties.efstlst = {
            outSdwEff: {
              algn: 'tl',
              blurRad: 276225,
              color: {
                clr: '#0000ff',
                type: 'srgbClr'
              },
              dir: 5400000,
              dist: 635000,
              rotwithshape: false,
              type: 'outerShdw'
            }
          };

          someGroupShapeProperties = {
            fill: undefined
          };

          var geoMgrApi = GeometryManager.initialize(shapeProperties,
              someGroupShapeProperties);
          var genereatedEffectBean = geoMgrApi.generateEffectsBean();

          expect(genereatedEffectBean.fill).toEqual(undefined);
        });

    it('should get color from fillRefStyle only if fill type is solidFill ' +
        'and shapeProperties.fill.color is undefined', function() {
          var cachedFillRef = {
            type: 'solidFill',
            color: {
              scheme: 'accent1',
              type: 'schemeClr'
            }
          };
          spyOn(ThemeStyleRefManager, 'getCachedFillRefStyle').andReturn(
              cachedFillRef);

          // Should not query ThemeStyleRefManager as fill.color is available.
          var geoMgrApi = GeometryManager.initialize(shapeProperties,
              someGroupShapeProperties);
          var genereatedColorBean = geoMgrApi.generateFillColorBean();

          expect(genereatedColorBean).toEqual(fillColorBean);

          // Should get color from ThemeStyleRefManager as fill.color is not
          // available.
          shapeProperties.fill.color = undefined;
          fillColorBean.fill = cachedFillRef;
          genereatedColorBean = geoMgrApi.generateFillColorBean();
          expect(genereatedColorBean).toEqual(fillColorBean);
        });
  });
});
