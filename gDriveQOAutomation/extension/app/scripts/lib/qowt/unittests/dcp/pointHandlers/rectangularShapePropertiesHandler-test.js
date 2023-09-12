/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/pointHandlers/rectangularShapePropertiesHandler',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/models/point',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator',
  'qowtRoot/drawing/color/colorUtility'
], function(RectangularShapePropertiesHandler,
            FillHandler,
            ThemeStyleRefManager,
            TableStyleManager,
            PointModel,
            DeprecatedUtils,
            ShapeEffectsDecorator,
            ColorUtility) {

  'use strict';

  /**
   * tests for Rectangular Shape properties handler
   */
  describe('RectangularShapePropertiesHandler Test', function() {

    var _shapeProperties;
    var _localShapeEffectsAPI = {
      withShadow: function() {
      },
      withRedundantEffects: function() {
      }
    };
    var _groupShapeProperties;
    var _rectangularShape;
    var _fillHandler = FillHandler;
    var _deprecatedUtils = DeprecatedUtils;
    var _shapeDiv = document.createElement('div');
    var _shapeFillDiv = document.createElement('div');
    _shapeDiv.appendChild(_shapeFillDiv);

    beforeEach(function() {
      _rectangularShape = RectangularShapePropertiesHandler;

      _shapeProperties = {
        fill: {
          type: 'solidFill',
          color: {
            clr: '#ff0000',
            type: 'srgbClr'
          }
        },
        ln: {
          w: 9525, // 1px
          fill: {
            type: 'solidFill',
            color: {
              type: 'srgbClr',
              clr: '#ff0000',
              effects: {}
            }
          }
        }
      };

      _groupShapeProperties = {
        fill: {
          type: 'solidFill',
          clr: '#FFFF00'
        }
      };

      spyOn(_fillHandler, 'handleUsingHTML').andCallThrough();
      spyOn(ShapeEffectsDecorator, 'create').andReturn(_localShapeEffectsAPI);
    });

    afterEach(function() {
      _rectangularShape = undefined;
    });


    it('should not call fillHandler when -fill- property not present in ' +
        'shape properties', function() {

          _shapeProperties.fill = undefined;

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(_fillHandler.handleUsingHTML).not.toHaveBeenCalled();
        });

    it('should not call fillHandler when -fill- of shape properties is noFill',
        function() {

          _shapeProperties.fill.type = 'noFill';

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(_fillHandler.handleUsingHTML).
              toHaveBeenCalledWith(_shapeProperties.fill, _shapeFillDiv);
        });

    it('should not call fillHandler when -fill- of shape properties is ' +
        'grpFill and -fill- of group shape properties is noFill', function() {
          _shapeProperties.fill = 'grpFill';

          _groupShapeProperties.fill = 'noFill';

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(_fillHandler.handleUsingHTML).
              toHaveBeenCalledWith(_shapeProperties.fill, _shapeFillDiv);
        });

    it('should not call fillHandler when -fill- of shape properties is ' +
        'grpFill and -fill- of group shape properties is undefined',
        function() {
          _shapeProperties.fill = 'grpFill';

          _groupShapeProperties.fill = undefined;

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(_fillHandler.handleUsingHTML).
              toHaveBeenCalledWith(_shapeProperties.fill, _shapeFillDiv);
        });

    it('should not call fillHandler when -fill- of shape properties is ' +
        'grpFill and group shape properties is undefined', function() {
          _shapeProperties.fill = 'grpFill';

          _groupShapeProperties = undefined;

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

         expect(_fillHandler.handleUsingHTML).
             toHaveBeenCalledWith(_shapeProperties.fill, _shapeFillDiv);
        });

    it('should call fillHandler with -shapeProperties.fill- when it is other ' +
        'than noFill and grpFill', function() {

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(_fillHandler.handleUsingHTML).
              toHaveBeenCalledWith(_shapeProperties.fill, _shapeFillDiv);
        });

    it('should call fillHandler with -groupShapeProperties.fill- when ' +
        '-shapeProperties.fill- is grpFill and -groupShapeProperties.fill- ' +
        'other than noFill', function() {

          _shapeProperties.fill.type = 'grpFill';

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(_fillHandler.handleUsingHTML).
              toHaveBeenCalledWith(_groupShapeProperties.fill, _shapeFillDiv);
        });

    it('should call ThemeStyleRefManager - getCSSFillRefStyle method when ' +
        'fill is not present in shape properties, fillRef is present in ' +
        'shape style', function() {
          PointModel.ThemeId = 111;
          _shapeProperties.fill = undefined;
          var _themestyleRefManager = ThemeStyleRefManager;

          spyOn(_themestyleRefManager, 'getFillRefClassName');

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(_themestyleRefManager.getFillRefClassName).toHaveBeenCalled();

          PointModel.ThemeId = undefined;
        });

    it('should call ThemeStyleRefManager - getCachedFillRefStyle method ' +
        'only when fill.color is not present in shape properties, fillRef is ' +
        'present in shape style', function() {
          var cachedFillRef = {
            type: 'solidFill',
            color: {
              clr: '#00ff00',
              type: 'srgbClr'
            }
          };
          _shapeProperties.fill.color = 'Some color';
          var expectedBackground = 'red';
          spyOn(ColorUtility, 'getColor').andReturn(expectedBackground);

          spyOn(ThemeStyleRefManager, 'getCachedFillRefStyle').
              andReturn(cachedFillRef);

          // Should not query ThemeStyleRefManager as fill.color is available.
          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(ThemeStyleRefManager.getCachedFillRefStyle).
              not.toHaveBeenCalled();
          expect(_shapeFillDiv.style.background).toContain(expectedBackground);
          expect(ColorUtility.getColor).toHaveBeenCalledWith('Some color');

          _shapeProperties.fill.color = undefined;

          // Should get color from ThemeStyleRefManager as fill.color is not
          // available.
          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(ThemeStyleRefManager.getCachedFillRefStyle).toHaveBeenCalled();
          expect(_shapeFillDiv.style.background).toContain(expectedBackground);
          expect(ColorUtility.getColor.mostRecentCall.args[0]).toBe(
              cachedFillRef.color);
        });

    it('should apply table cell style classes when -shapeWithinTable- is true',
        function() {
          spyOn(TableStyleManager, 'applyTblCellStyleClasses');
          _shapeProperties.isShapeWithinTable = true;

          _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
              _shapeDiv, _shapeFillDiv);

          expect(TableStyleManager.applyTblCellStyleClasses).toHaveBeenCalled();
        });

    describe('should handle low level effects properly', function() {
      var _colorJSON;
      beforeEach(function() {
        _colorJSON = {
          rgb: '#ffffff',
          alpha: 1
        };
        spyOn(ColorUtility, 'getColor').andReturn(_colorJSON);

        _shapeProperties.efstlst = undefined;
        _groupShapeProperties.efstlst = undefined;

      });
      it('should add group shape shadow effect when it is defined in group ' +
          'shape properties and undefined in shape properties', function() {
            _shapeProperties.efstlst = undefined;
            _groupShapeProperties.efstlst = {
              refnEff: {blurRad: 6350, dist: 60, algn: 'bl'},
              outSdwEff: {
                blurRad: 6350,
                dist: 60,
                algn: 'bl',
                color: {scheme: 'scheme', type: 'scheme'}
              }
            };
            spyOn(_localShapeEffectsAPI, 'withShadow');
            _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
                _shapeDiv, _shapeFillDiv);
            expect(_localShapeEffectsAPI.withShadow).
                toHaveBeenCalledWith(_groupShapeProperties.efstlst.outSdwEff);
          });

      it('should add group shape shadow effect when it is defined in group ' +
          'shape properties as well as shape properties', function() {
            _shapeProperties.efstlst = {
              outSdwEff: {
                blurRad: 4350,
                dist: 40,
                algn: 'br',
                color: {scheme: 'accent1', type: 'scheme'}
              }
            };
            _groupShapeProperties.efstlst = {
              outSdwEff: {
                blurRad: 6350,
                dist: 60,
                algn: 'bl',
                color: {scheme: 'accent2', type: 'scheme'}
              }
            };

            spyOn(_localShapeEffectsAPI, 'withShadow');
            _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
                _shapeDiv, _shapeFillDiv);
            expect(_localShapeEffectsAPI.withShadow).
                toHaveBeenCalledWith(_groupShapeProperties.efstlst.outSdwEff);
          });

      it('should add shape shadow effect when it is undefined in group shape ' +
          'properties and defined in shape properties', function() {
            _shapeProperties.efstlst = {
              outSdwEff: {
                blurRad: 4350,
                dist: 40,
                algn: 'br',
                color: {scheme: 'accent1', type: 'scheme'}
              }
            };
            _groupShapeProperties.efstlst = undefined;

            spyOn(_localShapeEffectsAPI, 'withShadow');
            _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
                _shapeDiv, _shapeFillDiv);
            expect(_localShapeEffectsAPI.withShadow).
                toHaveBeenCalledWith(_shapeProperties.efstlst.outSdwEff);
          });

      it('should not decorate with shadow when shadow JSON is undefined',
          function() {
            _shapeProperties.efstlst = {
              outSdwEff: {
                blurRad: 4350,
                dist: 40,
                algn: 'br',
                color: {scheme: 'accent1', type: 'scheme'}
              }
            };
            _groupShapeProperties.efstlst = undefined;

            spyOn(_localShapeEffectsAPI, 'withShadow');
            spyOn(_deprecatedUtils, 'appendJSONAttributes').
                andReturn(undefined);
            _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
                _shapeDiv, _shapeFillDiv);
            expect(_localShapeEffectsAPI.withShadow).not.toHaveBeenCalled();
          });

      it('should append proper CSS class when Low level EffectRef class is ' +
          'present in theme', function() {
            spyOn(ThemeStyleRefManager, 'getLowLevelEffectRefClassName').
                andReturn('shadowCSS');

            _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
                _shapeDiv, _shapeFillDiv);
            expect(_shapeDiv.className).toContain('shadowCSS');
          });

      it('should not append any CSS class when Low level EffectRef class is' +
          ' undefined', function() {
            _shapeDiv.className = '';
            spyOn(ThemeStyleRefManager, 'getLowLevelEffectRefClassName').
                andReturn(undefined);

            _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
                _shapeDiv, _shapeFillDiv);
            expect(_shapeDiv.className).toEqual('');
          });

      it('should handle redundant effects properly', function() {
        _shapeProperties.efstlst = {
          outSdwEff: {
            blurRad: 4350,
            dist: 40,
            algn: 'br',
            color: {scheme: 'accent1', type: 'scheme'}
          }
        };
        spyOn(_localShapeEffectsAPI, 'withRedundantEffects');
        _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
            _shapeDiv, _shapeFillDiv);
        expect(_localShapeEffectsAPI.withRedundantEffects).
            toHaveBeenCalledWith(_shapeDiv, _shapeProperties.efstlst, false);
      });

      it('should append proper style to shape div when redundant effects are ' +
          'present', function() {
            _shapeProperties.efstlst = {
              outSdwEff: {
                blurRad: 4350,
                dist: 40,
                algn: 'br',
                color: {scheme: 'accent1', type: 'scheme'}
              }
            };
            var redundantStyle = 'some style';
            spyOn(_localShapeEffectsAPI, 'withRedundantEffects').
                andReturn(redundantStyle);
            spyOn(_deprecatedUtils, 'appendJSONAttributes');
            _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
                _shapeDiv, _shapeFillDiv);
            expect(_deprecatedUtils.appendJSONAttributes).
                toHaveBeenCalledWith(_shapeDiv.style, redundantStyle);
          });

      it('should not append any style to shape div when redundant effects ' +
          'are undefined', function() {
            _shapeProperties.efstlst = {
              outSdwEff: {
                blurRad: 4350,
                dist: 40,
                algn: 'br',
                color: {scheme: 'accent1', type: 'scheme'}
              }
            };
            var redundantStyle;
            spyOn(_localShapeEffectsAPI, 'withRedundantEffects').
                andReturn(redundantStyle);
            spyOn(_deprecatedUtils, 'appendJSONAttributes');
            _rectangularShape.handle(_shapeProperties, _groupShapeProperties,
                _shapeDiv, _shapeFillDiv);
            expect(_deprecatedUtils.appendJSONAttributes).
                toHaveBeenCalledWith(_shapeDiv.style, redundantStyle);
          });
    });
  });
});
