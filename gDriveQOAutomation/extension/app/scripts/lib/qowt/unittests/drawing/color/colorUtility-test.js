/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/drawing/color/colorEffect',
  'qowtRoot/models/point',
  'qowtRoot/drawing/color/presetColorMap',
  'qowtRoot/utils/converters/converter'
], function(ColorUtility,
            ThemeManager,
            ColorEffect,
            PointModel,
            PresetColorMap,
            Converter) {

  'use strict';

  var _colorUtility = ColorUtility;

  describe('ColorUtility Test', function() {
    var _themeManager = ThemeManager;
    var _slideId = '222';

    beforeEach(function() {
      PointModel.ThemeId = '111';
      PointModel.SlideId = _slideId;
      spyOn(_themeManager, 'getColorTheme').andReturn(themeColorData);
    });

    afterEach(function() {
      PointModel.ThemeId = undefined;
      PointModel.slideColorMap = {};
      PointModel.SlideLayoutId = undefined;
      PointModel.slideLayoutMap = {};
      PointModel.masterLayoutMap = {};
      PointModel.masterLayoutId = undefined;
    });

    var themeColorData = {
      'dk1': 'red',
      'dk2': 'blue',
      'accent1': 'accent6',
      'accent6': 'accent3',
      'accent2': 'accent4',
      'accent4': 'accent5'
    };

    var someColorSchemeData = [{
      name: 'dk1',
      value: 'red'
    }, {
      name: 'dk2',
      value: 'blue'
    },{
      name: 'accent1',
      value: 'accent6'
    }, {
      name: 'accent6',
      value: 'accent3'
    }, {
      name: 'accent2',
      value: 'accent4'
    }, {
      name: 'accent4',
      value: 'accent5'
    }];

    describe(' getColor', function() {
      it('should return correct color JSON', function() {
        var colorObject = {
          clr: '#ff0000',
          effects: [
            {name: 'alpha', value: '100000'}
          ],
          type: 'srgbClr'
        };

        var expectedRGBAColor = 'rgba(255,0,0,1)';

        var colorJSON = _colorUtility.getColor(colorObject);

        expect(colorJSON).toEqual(expectedRGBAColor);
      });

      it('should call getARGBColor', function() {
        var colorObject = {
          clr: '#ff0000',
          effects: [
            {name: 'alpha', value: '100000'}
          ],
          type: 'srgbClr'
        };
        var _colorEffect = ColorEffect;
        var expectedJson = {
          rgb: '#ff0000',
          alpha: 1
        };
        spyOn(_colorEffect, 'getARGBColor').andReturn(expectedJson);

        _colorUtility.getColor(colorObject);

        expect(_colorEffect.getARGBColor).toHaveBeenCalled();
      });

      it('should call getHexEquivalentOfSchemeColor when it is scheme Clr',
          function() {
            var clrJSON = {
              type: 'schmClr',
              scheme: 'accent1'
            };
            spyOn(_colorUtility, 'getHexEquivalentOfSchemeColor');

            _colorUtility.getColor(clrJSON);
            expect(_colorUtility.getHexEquivalentOfSchemeColor).
                toHaveBeenCalledWith(clrJSON.scheme);
          });

      it('should call getHexEquivalentOfPresetColor when it is preset Clr',
          function() {
            var clrJSON = {
              type: 'prstClr',
              val: 'black'
            };
            spyOn(_colorUtility, 'getHexEquivalentOfPresetColor');
            _colorUtility.getColor(clrJSON);
            expect(_colorUtility.getHexEquivalentOfPresetColor).
                toHaveBeenCalledWith(clrJSON.val);
          });

      it('should call functions getRgbEquivalentPresetColor and rgb2hex when ' +
          'it is preset Clr', function() {
            var clrJSON = {
              type: 'prstClr',
              val: 'black'
            };
            spyOn(PresetColorMap, 'getRgbEquivalentPresetColor').
                andReturn([0, 0, 0]);
            spyOn(Converter, 'rgb2hex');

            _colorUtility.getColor(clrJSON);
            expect(PresetColorMap.getRgbEquivalentPresetColor).
                toHaveBeenCalledWith(clrJSON.val);
            expect(Converter.rgb2hex).toHaveBeenCalledWith(0, 0, 0);
          });

    });

    describe(' handleLuminosity', function() {
      it('should return correct color with luminosity', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        expect(_colorUtility.handleLuminosity('rgba(255,255,255,1)', context,
            'lighten')).toEqual('rgba(255,255,255,1)');
      });

      it('should handle fill lighten', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,0,0,1)', context,
            'lighten')).toEqual('rgba(255,102,102,1)');
      });

      it('should handle fill lighten with white', function() {
        var context = {
          fillStyle: '',
          fill: function() {
          }
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,255,255,1)', context,
            'lighten')).toEqual('rgba(255,255,255,1)');
      });

      it('should handle fill lightenLess', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,0,0,1)', context,
            'lightenLess')).toEqual('rgba(255,51,51,1)');
      });

      it('should handle fill lightenLess with White', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,255,255,1)', context,
            'lighten')).toEqual('rgba(255,255,255,1)');
      });

      it('should handle fill darken', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,0,0,1)', context,
            'darken')).toEqual('rgba(153,0,0,1)');
      });

      it('should handle fill darken black color', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(0,0,0,1)', context,
            'darken')).toEqual('rgba(0,0,0,1)');
      });

      it('should handle fill darkenLess', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,0,0,1)', context,
            'darkenLess')).toEqual('rgba(204,0,0,1)');
      });

      it('should handle fill darkenLess black color', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(0,0,0,1)', context,
            'darkenLess')).toEqual('rgba(0,0,0,1)');
      });

      it('should handle fill when path-fill is undefined', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(0, 0, 0, 1)', context,
            undefined)).toEqual('rgba(0,0,0,1)');
      });

      it('should handle fill lightenLess with White', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,255,255,1)', context,
            'lighten')).toEqual('rgba(255,255,255,1)');
      });

      it('should handle fill darken', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,0,0,1)', context,
            'darken')).toEqual('rgba(153,0,0,1)');
      });

      it('should handle fill darken black color', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(0,0,0,1)', context,
            'darken')).toEqual('rgba(0,0,0,1)');
      });

      it('should handle fill darkenLess', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(255,0,0,1)', context,
            'darkenLess')).toEqual('rgba(204,0,0,1)');
      });

      it('should handle fill darkenLess black color', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(0,0,0,1)', context,
            'darkenLess')).toEqual('rgba(0,0,0,1)');
      });

      it('should handle fill when path-fill is undefined', function() {
        var context = {
          fillStyle: '',
          fill: function() {}
        };
        spyOn(context, 'fill');
        expect(_colorUtility.handleLuminosity('rgba(0, 0, 0, 1)', context,
            undefined)).toEqual('rgba(0,0,0,1)');
      });

    });

    describe(' at slide level', function() {

      it('should return default value -accent1-, when scheme-color is ' +
          'undefined', function() {
            PointModel.slideColorMap[_slideId] = undefined;
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = undefined;
            PointModel.masterLayoutMap[PointModel.MasterSlideId] = undefined;

            var returnedSchemeColor = _colorUtility.
                getThemeEquivalentOfSchemeColor(undefined);
            expect(returnedSchemeColor).toEqual('accent1');
          });

      it('should select proper cached color map - when color map is defined ' +
          'at slide level *slideColorMap*', function() {

            PointModel.slideColorMap[_slideId] = someColorSchemeData;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent3');
          });

      it('should select proper cached color map - when color map is defined ' +
          'at slide layout level *PointModel.slideLayoutMap*', function() {

            PointModel.slideColorMap[_slideId] = undefined;
            PointModel.masterLayoutMap[PointModel.MasterSlideId] = undefined;
            PointModel.currentPHLevel = 'sldlt';
            PointModel.SlideLayoutId = '111';
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
              clrMap: someColorSchemeData
            };
            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent3');
          });

      it('should select proper cached color map - when color map is defined ' +
          'at slide master level *PointModel.slideMasterMap*', function() {

            PointModel.currentPHLevel = undefined;
            PointModel.MasterSlideId = '111master';
            PointModel.masterLayoutMap[PointModel.MasterSlideId] = {
              clrMap: someColorSchemeData
            };
            PointModel.slideColorMap[_slideId] = undefined;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent3');
          });

      it('should select proper cached color map - when color map is defined ' +
          'at slide as well as ' +
          'slide layout level *PointModel.slideLayoutMap + slideColorMap*',
          function() {
            var someColorSchemeDataForSlide = [{
              name: 'dk1',
              value: 'red'
            }, {
              name: 'dk2',
              value: 'blue'
            }, {
              name: 'accent1',
              value: 'accent2'
            }];
            PointModel.currentPHLevel = 'sldlt';
            PointModel.SlideLayoutId = '111layout';
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
              clrMap: someColorSchemeData
            };
            PointModel.slideColorMap[_slideId] = someColorSchemeDataForSlide;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent4');
          });

      it('should select proper cached color map - when color map is ' +
          'undefined at all 3 levels', function() {
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
              clrMap: undefined
            };
            PointModel.MasterSlideId = '111master';
            PointModel.masterLayoutMap[PointModel.MasterSlideId] = {
              clrMap: undefined
            };

            PointModel.slideColorMap[_slideId] = undefined;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent6');
          });

      it('should return undefined hex color, if theme color is undefined',
          function() {
            expect(_colorUtility.getHexEquivalentOfSchemeColor('some color')).
                toBe(undefined);
          });
    });

    describe(' at slide - layout level', function() {
      it('should select proper cached color map - when color map is ' +
          'undefined at slide but is present at ' +
          'slide layout level *PointModel.slideLayoutMap + slideColorMap*',
          function() {

            PointModel.currentPHLevel = 'sldlt';
            PointModel.SlideLayoutId = '111layout';
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
              clrMap: someColorSchemeData
            };
            PointModel.slideColorMap[_slideId] = undefined;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent3');
          });

      it('should select proper cached color map - when color map is defined ' +
          'at layout and master ' +
          'level *PointModel.slideLayoutMap + PointModel.slideMasterMap*',
          function() {

            var layoutClrMap = [{
              name: 'dk1',
              value: 'red'
            }, {
              name: 'dk2',
              value: 'blue'
            }, {
              name: 'accent1',
              value: 'accent2'
            }];

            var masterClrMap = [{
              name: 'dk2',
              value: 'blue'
            }, {
              name: 'accent1',
              value: 'accent4'
            }];
            PointModel.currentPHLevel = 'sldlt';
            PointModel.SlideLayoutId = '111layout';
            PointModel.MasterSlideId = '111master';
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
              clrMap: layoutClrMap
            };
            PointModel.masterLayoutMap[PointModel.MasterSlideId] = {
              clrMap: masterClrMap
            };
            PointModel.slideColorMap[_slideId] = undefined;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent4');
          });

      it('should select proper cached color map - when color map is ' +
          'undefined at layout but is present at master ' +
          'level *PointModel.slideLayoutMap + PointModel.slideMasterMap*',
          function() {
            var masterClrMap = [{
              name: 'dk2',
              value: 'blue'
            }, {
              name: 'accent1',
              value: 'accent4'
            }];
            PointModel.currentPHLevel = 'sldlt';
            PointModel.SlideLayoutId = '111layout';
            PointModel.MasterSlideId = '111master';
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
              clrMap: undefined
            };
            PointModel.masterLayoutMap[PointModel.MasterSlideId] = {
              clrMap: masterClrMap
            };
            PointModel.slideColorMap[_slideId] = undefined;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent5');
          });

    });

    describe(' at slide - master level', function() {

      it('should select proper cached color map - when color map is ' +
          'undefined at layout but is present at master ' +
          'level *PointModel.slideLayoutMap + PointModel.slideMasterMap*',
          function() {
            var masterClrMap = [{
              name: 'dk2',
              value: 'blue'
            }, {
              name: 'accent1',
              value: 'accent4'
            }];
            PointModel.currentPHLevel = undefined;
            PointModel.SlideLayoutId = '111layout';
            PointModel.MasterSlideId = '111master';
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
              clrMap: undefined
            };
            PointModel.masterLayoutMap[PointModel.MasterSlideId] = {
              clrMap: masterClrMap
            };
            PointModel.slideColorMap[_slideId] = undefined;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent5');
          });

      it('should select proper cached color map - when color map is defined ' +
          'at layout as well as master ' +
          'level *PointModel.slideLayoutMap + PointModel.slideMasterMap*',
          function() {
            var masterClrMap = [{
              name: 'dk2',
              value: 'blue'
            }, {
              name: 'accent1',
              value: 'accent4'
            }];
            PointModel.currentPHLevel = undefined;
            PointModel.SlideLayoutId = '111layout';
            PointModel.MasterSlideId = '111master';
            PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
              clrMap: undefined
            };
            PointModel.masterLayoutMap[PointModel.MasterSlideId] = {
              clrMap: masterClrMap
            };
            PointModel.slideColorMap[_slideId] = undefined;

            var returnedSchemeColor = _colorUtility.
                getHexEquivalentOfSchemeColor('accent1');

            expect(_themeManager.getColorTheme).toHaveBeenCalled();
            expect(returnedSchemeColor).toEqual('accent5');
          });
    });

  });

});
