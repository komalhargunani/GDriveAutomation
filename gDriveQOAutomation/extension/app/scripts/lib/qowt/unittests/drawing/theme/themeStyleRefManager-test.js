define([
  'qowtRoot/models/point',
  'qowtRoot/drawing/theme/themeFontManager',
  'qowtRoot/drawing/theme/themeFillStyleManager',
  'qowtRoot/drawing/theme/themeLineStyleManager',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/theme/themeEffectStyleManager'
], function(PointModel,
            ThemeFontManager,
            ThemeFillStyleManager,
            ThemeLineStyleManager,
            ThemeStyleRefManager,
            ThemeEffectStyleManager) {

  'use strict';

  describe('ThemeStyleRefManager Test', function() {
    var _themeStyleRefManager = ThemeStyleRefManager;
    var _themeFontManager = ThemeFontManager;
    var _themeLineStyleManager = ThemeLineStyleManager;
    var _themeFillStyleManager = ThemeFillStyleManager;
    var _themeEffectStyleManager = ThemeEffectStyleManager;

    var _somestyleData;
    beforeEach(function() {
      _somestyleData = {
        fillRef: {
          idx: 1,
          color: {
            type: 'schemeClr',
            scheme: 'dk1'
          }
        }
      };
    });

    describe('Caching fill style tests', function() {
      it('For solid fill', function() {

        var expectedStyle = {
          type: 'solidFill',
          color: {
            type: 'schemeClr',
            scheme: 'dk1'
          }
        };

        var colorJSON = {
          type: 'solidFill',
          color: {
            type: 'schemeClr',
            scheme: 'phClr'
          }
        };

        spyOn(_themeFillStyleManager, 'getFillStyle').andReturn(colorJSON);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getCachedFillRefStyle()).
            toEqual(expectedStyle);
        expect(_themeFillStyleManager.getFillStyle).
            toHaveBeenCalledWith(_somestyleData.fillRef.idx);

      });

      it('when fillRef is undefined', function() {
        _somestyleData = {
          fillRef: undefined
        };
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);
        expect(_themeStyleRefManager.getCachedFillRefStyle()).
            toEqual(undefined);

      });

      it('when shapeStyle is undefined', function() {
        _themeStyleRefManager.cacheShapeStyle(undefined);
        expect(_themeStyleRefManager.getCachedFillRefStyle()).
            toEqual(undefined);
      });

      it('for gradient fill', function() {
        var gradientTheme = {
          'gsLst': [{
            'color': {
              'scheme': 'phClr',
              'type': 'schemeClr'
            },
            'pos': 0
          }, {
            'color': {
              'scheme': 'phClr',
              'type': 'schemeClr'
            },
            'pos': 100000
          }],
          'lin': {
            'angle': 100,
            'scaled': true
          },
          'rotWithShape': true,
          'type': 'gradientFill',
          'idx': 2
        };

        var expectedJSON = {
          gsLst: [
            { color: { scheme: 'dk1', type: 'schemeClr' }, pos: 0 },
            { color: { scheme: 'dk1', type: 'schemeClr' }, pos: 100000 }
          ],
          lin: {
            angle: 100,
            scaled: true
          },
          rotWithShape: true,
          type: 'gradientFill',
          idx: 2
        };

        var _themeFillStyleManager = ThemeFillStyleManager;

        spyOn(_themeFillStyleManager, 'getFillStyle').andReturn(gradientTheme);
        PointModel.currentTable.isProcessingTable = false;

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getCachedFillRefStyle()).
            toEqual(expectedJSON);
        expect(_themeFillStyleManager.getFillStyle).
            toHaveBeenCalledWith(_somestyleData.fillRef.idx);
      });

      it('for noFill', function() {
        var colorJSON = {
          fill: {
            type: 'noFill',
            color: {
              type: 'schemeClr',
              scheme: 'phClr'
            }
          }
        };

        spyOn(_themeFillStyleManager, 'getFillStyle').andReturn(colorJSON);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getCachedFillRefStyle()).
            toEqual(colorJSON);
        expect(_themeFillStyleManager.getFillStyle).
            toHaveBeenCalledWith(_somestyleData.fillRef.idx);
      });
    });

    describe('Caching fill style tests for tables', function() {
      it('For solid fill', function() {
        var expectedStyle = {
          type: 'solidFill',
          color: {
            type: 'schemeClr',
            scheme: 'dk1'
          }
        };

        var colorJSON = {
          type: 'solidFill',
          color: {
            type: 'schemeClr',
            scheme: 'phClr'
          }
        };

        spyOn(_themeFillStyleManager, 'getFillStyle').andReturn(colorJSON);

        expect(_themeStyleRefManager.getFillRefStyleForTable(
            _somestyleData.fillRef)).toEqual(expectedStyle);
        expect(_themeFillStyleManager.getFillStyle).
            toHaveBeenCalledWith(_somestyleData.fillRef.idx);

      });

      it('for gradient fill', function() {
        PointModel.currentTable.isProcessingTable = true;
        var gradientTheme = {
          'gsLst': [{
            'color': {
              'scheme': 'phClr',
              'type': 'schemeClr'
            },
            'pos': 0
          }, {
            'color': {
              'scheme': 'phClr',
              'type': 'schemeClr'
            },
            'pos': 100000
          }],
          'lin': {
            'angle': 100,
            'scaled': true
          },
          'rotWithShape': true,
          'type': 'gradientFill',
          'idx': 2
        };

        var expectedJSON = {
          gsLst: [
            { color: { scheme: 'dk1', type: 'schemeClr' }, pos: 0 },
            { color: { scheme: 'dk1', type: 'schemeClr' }, pos: 100000 }
          ],
          lin: {
            angle: 100,
            scaled: true
          },
          rotWithShape: true,
          type: 'gradientFill',
          idx: 2
        };

        var _themeFillStyleManager = ThemeFillStyleManager;

        spyOn(_themeFillStyleManager, 'getFillStyle').andReturn(gradientTheme);

        expect(_themeStyleRefManager.getFillRefStyleForTable(
            _somestyleData.fillRef)).toEqual(expectedJSON);
        expect(_themeFillStyleManager.getFillStyle).
            toHaveBeenCalledWith(_somestyleData.fillRef.idx);

        PointModel.currentTable.isProcessingTable = false;
      });

      it('for noFill', function() {
        var colorJSON = {
          fill: {
            type: 'noFill',
            color: {
              type: 'schemeClr',
              scheme: 'phClr'
            }
          }
        };

        spyOn(_themeFillStyleManager, 'getFillStyle').andReturn(colorJSON);

        expect(_themeStyleRefManager.getFillRefStyleForTable(
            _somestyleData.fillRef)).toEqual(colorJSON);
        expect(_themeFillStyleManager.getFillStyle).
            toHaveBeenCalledWith(_somestyleData.fillRef.idx);
      });
    });

    describe('Caching Outline fill style tests', function() {
      beforeEach(function() {
        _somestyleData = {
          lnRef: {
            idx: 1,
            color: {
              type: 'schemeClr',
              scheme: 'dk1'
            }
          }
        };
      });
      it('for SolidFill', function() {
        var expectedStyle = {
          fill: {
            type: 'solidFill',
            color: {
              type: 'schemeClr',
              scheme: 'dk1'
            }
          }
        };

        var colorJSON = {
          fill: {
            type: 'solidFill',
            color: {
              type: 'schemeClr',
              scheme: 'phClr'
            }
          }
        };

        var _themeLineStyleManager = ThemeLineStyleManager;

        spyOn(_themeLineStyleManager, 'getLineStyle').andReturn(colorJSON);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getCachedOutlineRefStyle()).
            toEqual(expectedStyle);
        expect(_themeLineStyleManager.getLineStyle).
            toHaveBeenCalledWith(_somestyleData.lnRef.idx);
      });

      it('for noFill', function() {
        var colorJSON = {
          fill: {
            type: 'noFill',
            color: {
              type: 'schemeClr',
              scheme: 'phClr'
            }
          }
        };


        spyOn(_themeLineStyleManager, 'getLineStyle').andReturn(colorJSON);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getCachedOutlineRefStyle()).
            toEqual(colorJSON);
        expect(_themeLineStyleManager.getLineStyle).
            toHaveBeenCalledWith(_somestyleData.lnRef.idx);
      });

      it(' for gradientFill', function() {
        var gradientTheme = {
          'fill': {
            'gsLst': [{
              'color': {
                'scheme': 'phClr',
                'type': 'schemeClr'
              },
              'pos': 0
            }, {
              'color': {
                'scheme': 'phClr',
                'type': 'schemeClr'
              },
              'pos': 100000
            }],
            'lin': {
              'angle': 100,
              'scaled': true
            },
            'rotWithShape': true,
            'type': 'gradientFill'
          },
          'idx': 2
        };

        var expectedJSON = {
          fill: {
            'gsLst': [{
              color: {
                scheme: 'dk1',
                type: 'schemeClr'
              },
              pos: 0
            }, {
              color: {
                scheme: 'dk1',
                type: 'schemeClr'
              },
              pos: 100000
            }],
            'lin': {
              'angle': 100,
              'scaled': true
            },
            'rotWithShape': true,
            'type': 'gradientFill'
          },
          idx: 2
        };

        var _themeLineStyleManager = ThemeLineStyleManager;

        spyOn(_themeLineStyleManager, 'getLineStyle').andReturn(gradientTheme);
        PointModel.currentTable.isProcessingTable = false;

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getCachedOutlineRefStyle()).
            toEqual(expectedJSON);
        expect(_themeLineStyleManager.getLineStyle).
            toHaveBeenCalledWith(_somestyleData.lnRef.idx);
      });

      it('when lnRef is undefined', function() {
        _somestyleData = {
          lnRef: undefined
        };
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);
        expect(_themeStyleRefManager.getCachedOutlineRefStyle()).
            toEqual(undefined);

      });

      it('when shapeStyle is undefined', function() {
        _somestyleData = undefined;
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);
        expect(_themeStyleRefManager.getCachedOutlineRefStyle()).
            toEqual(undefined);
      });
    });

    describe('Caching font styles', function() {
      it('when fontRef is defined', function() {
        _somestyleData = {
          'fntRef': {
            'color': {'scheme': 'accent6', 'type': 'schemeClr'},
            'idx': 'minor'
          }
        };

        var expectedStyle = {
          color: {'scheme': 'accent6', 'type': 'schemeClr'},
          font: 'somefont'
        };
        spyOn(_themeFontManager, 'getFontRefFontFace').andReturn('somefont');

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getCachedFontRefStyle()).
            toEqual(expectedStyle);
      });

      it('when fontRef is defined in table style', function() {
        var fontRef = {
          'color': {'scheme': 'accent6', 'type': 'schemeClr'},
          'idx': 'minor'
        };

        var expectedStyle = {
          color: {'scheme': 'accent6', 'type': 'schemeClr'},
          font: 'somefont'
        };
        spyOn(_themeFontManager, 'getFontRefFontFace').andReturn('somefont');

        expect(_themeStyleRefManager.getFontRefStyle(fontRef)).
            toEqual(expectedStyle);
      });

      it('when fontRef is undefined', function() {
        _somestyleData = {
          'fntRef': undefined
        };

        spyOn(_themeFontManager, 'getFontRefFontFace').andReturn('somefont');

        var returnedStyle = _themeStyleRefManager.cacheShapeStyle(
            _somestyleData);

        expect(returnedStyle).not.toBeDefined();
      });
    });

    describe('fill Style Class Name', function() {
      it('when fillRef is defined in shapeStyles', function() {
        var someClassName = 'xyz';

        spyOn(_themeFillStyleManager, 'getFillStyleCSSClass').
            andReturn(someClassName);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getFillRefClassName()).
            toEqual(someClassName);
      });

      it('when fillRef is undefined in shapeStyles', function() {
        _somestyleData = {
          fillRef: undefined
        };

        var someClassName;

        spyOn(_themeFillStyleManager, 'getFillStyleCSSClass').
            andReturn(someClassName);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getFillRefClassName()).
            toEqual(someClassName);
      });

      it('when shapeStyle is undefined', function() {
        var someClassName;

        spyOn(_themeFillStyleManager, 'getFillStyleCSSClass').
            andReturn(someClassName);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getFillRefClassName()).
            toEqual(someClassName);
      });

    });

    describe('low level effect Style Class Name', function() {
      beforeEach(function() {
        _somestyleData = {
          effectRef: {
            idx: 1,
            color: {
              type: 'schemeClr',
              scheme: 'dk1'
            }
          }
        };
      });

      it('when effectRef is defined in shapeStyles', function() {
        var someClassName = 'xyz';

        spyOn(_themeEffectStyleManager, 'getLowLevelEffectStyleCSSClass').
            andReturn(someClassName);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getLowLevelEffectRefClassName()).
            toEqual(someClassName);
        expect(_themeEffectStyleManager.getLowLevelEffectStyleCSSClass).
            toHaveBeenCalledWith(1, 'dk1');
      });

      it('when effectRef is undefined in shapeStyles', function() {
        _somestyleData = {
          effectRef: undefined
        };

        var someClassName;

        spyOn(_themeEffectStyleManager, 'getLowLevelEffectStyleCSSClass').
            andReturn(someClassName);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getLowLevelEffectRefClassName()).
            toEqual(someClassName);
      });

      it('when effectRef index is zero', function() {
        _somestyleData = {
          effectRef: {
            idx: 0
          }
        };

        var someClassName;

        spyOn(_themeEffectStyleManager, 'getLowLevelEffectStyleCSSClass').
            andReturn(someClassName);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getLowLevelEffectRefClassName()).
            toEqual(someClassName);
      });

      it('when shapeStyle is undefined', function() {
        _somestyleData = undefined;

        var someClassName;

        spyOn(_themeEffectStyleManager, 'getLowLevelEffectStyleCSSClass').
            andReturn(someClassName);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getLowLevelEffectRefClassName()).
            toEqual(someClassName);
      });
    });

    describe('high level effect Style Class Name', function() {
      beforeEach(function() {
        _somestyleData = {
          effectRef: {
            idx: 1,
            color: {
              type: 'schemeClr',
              scheme: 'dk1'
            }
          }
        };
      });

      it('when effectRef is defined in shapeStyles', function() {
        var someClassName = 'xyz';

        spyOn(_themeEffectStyleManager, 'getHighLevelEffectStyleCSSClass').
            andReturn(someClassName);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getHighLevelEffectRefClassName()).
            toEqual(someClassName);
        expect(_themeEffectStyleManager.getHighLevelEffectStyleCSSClass).
            toHaveBeenCalledWith(1, 'dk1');
      });

      it('when effectRef is undefined in shapeStyles', function() {
        _somestyleData = {
          effectRef: undefined
        };

        spyOn(_themeEffectStyleManager, 'getHighLevelEffectStyleCSSClass').
            andReturn(undefined);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getHighLevelEffectRefClassName()).
            toEqual(undefined);
      });

      it('when effectRef index is zero', function() {
        _somestyleData = {
          effectRef: {
            idx: 0
          }
        };

        var someClassName;

        spyOn(_themeEffectStyleManager, 'getHighLevelEffectStyleCSSClass').
            andReturn(someClassName);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getHighLevelEffectRefClassName()).
            toEqual(someClassName);
      });

      it('when shapeStyle is undefined', function() {
        _somestyleData = undefined;

        var someClassName;

        spyOn(_themeEffectStyleManager, 'getHighLevelEffectStyleCSSClass').
            andReturn(someClassName);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getHighLevelEffectRefClassName()).
            toEqual(someClassName);
      });
    });

    describe('get Cached EffectRef Style', function() {
      beforeEach(function() {
        _somestyleData = {
          effectRef: {
            idx: 1,
            color: {
              type: 'schemeClr',
              scheme: 'dk1'
            }
          }
        };
      });

      it('when effectRef is defined in shapeStyles', function() {
        var expectedThemeStyle = {
          'outSdwEff': {
            'blurRad': 4350,
            'dist': 40,
            'algn': 'br',
            'color': {'scheme': 'dk1', 'type': 'scheme'}
          }
        };
        var someEffectStyle = {
          outSdwEff: {
            blurRad: 4350,
            dist: 40,
            algn: 'br',
            color: {scheme: 'accent1', type: 'scheme'}
          }
        };

        spyOn(_themeEffectStyleManager, 'getEffectStyle').
            andReturn(someEffectStyle);
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        var themeEffectStyle = _themeStyleRefManager.getCachedEffectRefStyle(
            _somestyleData);

        expect(themeEffectStyle).toEqual(expectedThemeStyle);
      });

      it('when effectRef is defined in shape style but outer SHadow effect ' +
          'is undefined in theme', function() {
            var someEffectStyle;

            spyOn(_themeEffectStyleManager, 'getEffectStyle').
                andReturn(someEffectStyle);
            _themeStyleRefManager.cacheShapeStyle(_somestyleData);

            var themeEffectStyle = _themeStyleRefManager.
                getCachedEffectRefStyle(_somestyleData);

            expect(themeEffectStyle).toEqual(undefined);
          });

      it('when effectRef is undefined in shapeStyles', function() {
        _somestyleData = {
          effectRef: undefined
        };

        var someClassName;
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);
        var themeEffectStyle = _themeStyleRefManager.getCachedEffectRefStyle(
            _somestyleData);

        expect(themeEffectStyle).toEqual(someClassName);
      });

      it('when effectRef index is zero', function() {
        _somestyleData = {
          effectRef: {
            idx: 0
          }
        };

        var someClassName;
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);
        var themeEffectStyle = _themeStyleRefManager.getCachedEffectRefStyle(
            _somestyleData);

        expect(themeEffectStyle).toEqual(someClassName);
      });

      it('when shapeStyle is undefined', function() {
        _somestyleData = undefined;
        _themeStyleRefManager.cacheShapeStyle(_somestyleData);
        var themeEffectStyle = _themeStyleRefManager.getCachedEffectRefStyle(
            _somestyleData);

        expect(themeEffectStyle).toEqual(_somestyleData);
      });
    });

    describe('outline fill Style Class Name', function() {
      beforeEach(function() {
        _somestyleData = {
          lnRef: {
            idx: 1,
            color: {
              type: 'schemeClr',
              scheme: 'dk1'
            }
          }
        };
      });

      it('when lnRef is defined in shapeStyles', function() {
        var someClassName = 'xyz';

        spyOn(_themeLineStyleManager, 'getLineStyleCSSClass').
            andReturn(someClassName);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getOutlineRefStyleClassName()).
            toEqual(someClassName);
      });

      it('when ln style is undefined in shapeStyles', function() {
        _somestyleData = {
          ln: undefined
        };

        var someClassName;

        spyOn(_themeLineStyleManager, 'getLineStyleCSSClass').
            andReturn(someClassName);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getOutlineRefStyleClassName()).
            toEqual(someClassName);
      });

      it('when shapeStyle is undefined', function() {
        _somestyleData = undefined;
        var someClassName;

        spyOn(_themeLineStyleManager, 'getLineStyleCSSClass').
            andReturn(someClassName);

        _themeStyleRefManager.cacheShapeStyle(_somestyleData);

        expect(_themeStyleRefManager.getOutlineRefStyleClassName()).
            toEqual(someClassName);
      });
    });
  });
});
