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
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/drawing/theme/themeFillStyleManager',
  'qowtRoot/models/point',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/utils/cssManager',
  'qowtRoot/drawing/color/colorUtility'
], function(ThemeManager,
            ThemeFillStyleManager,
            PointModel,
            FillHandler,
            CSSManager,
            ColorUtility) {

  'use strict';


  describe('Theme Fill Style Manager Test', function() {
    var _themeManager = ThemeManager;
    var _themeFillStyleManager = ThemeFillStyleManager;
    var _fillHandler = FillHandler;

    beforeEach(function() {
      PointModel.ThemeId = 111;
    });

    afterEach(function() {
      PointModel.ThemeId = undefined;
    });

    it('should get all css classes for theme fill style, when not blip-fill',
        function() {
          var someFillStyleData = {
            'idx': 1,
            'fill': 'some fill properties'
          };

          _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
              someFillStyleData.fill);

          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'dk1')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_dk1');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'lt1')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_lt1');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'dk2')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_dk2');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'lt2')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_lt2');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'accent1')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_accent1');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'accent2')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_accent2');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'accent3')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_accent3');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'accent4')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_accent4');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'accent5')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_accent5');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'accent6')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_accent6');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'hlink')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_hlink');
          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'folHlink')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_folHlink');

          _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
              undefined);
        });

    it('should get proper css class for theme fill style, when there is ' +
        'color map override', function() {
          var someFillStyleData = {
            'idx': 1,
            'fill': 'some fill properties'
          };

          _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
              someFillStyleData.fill);

          spyOn(ColorUtility, 'getThemeEquivalentOfSchemeColor').
              andReturn('lt1'); //returns overriden scheme-color

          expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'dk1')).
              toEqual('thm_' + PointModel.ThemeId + '_fill_1_lt1');

          _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
              undefined);
        });

    it('should get all css classes for theme fill style, when fillJSON is ' +
        'not cached', function() {
          var someFillStyleData = {
            'idx': 10, //cached fill index
            'fill': 'some fill properties'
          };

          _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
              someFillStyleData.fill);

          var nonCachedFillIndex = 1;
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'dk1')).toEqual('thm_' + PointModel.ThemeId + '_fill_1_dk1');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'lt1')).toEqual('thm_' + PointModel.ThemeId + '_fill_1_lt1');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'dk2')).toEqual('thm_' + PointModel.ThemeId + '_fill_1_dk2');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'lt2')).toEqual('thm_' + PointModel.ThemeId + '_fill_1_lt2');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'accent1')).toEqual('thm_' + PointModel.ThemeId +
                  '_fill_1_accent1');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'accent2')).toEqual('thm_' + PointModel.ThemeId +
                  '_fill_1_accent2');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'accent3')).toEqual('thm_' + PointModel.ThemeId +
                  '_fill_1_accent3');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'accent4')).toEqual('thm_' + PointModel.ThemeId +
                  '_fill_1_accent4');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'accent5')).toEqual('thm_' + PointModel.ThemeId +
                  '_fill_1_accent5');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'accent6')).toEqual('thm_' + PointModel.ThemeId +
                  '_fill_1_accent6');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'hlink')).toEqual('thm_' + PointModel.ThemeId + '_fill_1_hlink');
          expect(_themeFillStyleManager.getFillStyleCSSClass(nonCachedFillIndex,
              'folHlink')).toEqual('thm_' + PointModel.ThemeId +
                  '_fill_1_folHlink');

          _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
              undefined);
        });

    it('should get css class for theme fill style, when blip-fill', function() {
      var someFillStyleData = {
        'idx': 1,
        'fill': {
          type: 'blipFill'
        }
      };

      _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
          someFillStyleData.fill);

      expect(_themeFillStyleManager.getFillStyleCSSClass(1, 'dk1')).toEqual(
          'thm_' + PointModel.ThemeId + '_fill_1_blip');

      _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
          undefined);
    });

    it('should get cached theme fill style', function() {
      var someFillStyleData = {
        'idx': 1,
        'fill': 'some fill properties'
      };

      _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
          someFillStyleData.fill);

      expect(_themeFillStyleManager.getFillStyle(1)).toEqual(
          'some fill properties');

      _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
          undefined);
    });

    it('should return qowt-point-blankBackground css class when no-fill ' +
        'is applied', function() {
          expect(_themeFillStyleManager.getFillStyleCSSClass(1000)).
              toEqual('qowt-point-blankBackground');
        });

    it('should return noFill as fill style when idx is zero', function() {
      expect(_themeFillStyleManager.getFillStyle(0)).toEqual({type: 'noFill'});
    });

    it('should call getPlaceHolderStyle of FillHandler and appendStyleClass ' +
        '12 times, when not blip-fill', function() {
          spyOn(_fillHandler, 'getFillStyle');
          spyOn(CSSManager, 'addRule');

          var someFillStyleData = {
            'idx': 1,
            'fill': {
              type: 'solidFill',
              color: {
                type: 'srgbClr',
                clr: 'some color',
                effects: {}
              }
            }
          };

          var someColorSchemeData = [{
            'alpha': 1.0,
            'name': 'dk1',
            'value': '#000000'
          }, {
            'alpha': 1.0,
            'name': 'lt1',
            'value': '#ffffff'
          }, {
            'alpha': 1.0,
            'name': 'dk2',
            'value': '#1f497d'
          }, {
            'alpha': 1.0,
            'name': 'lt2',
            'value': '#eeece1'
          }, {
            'alpha': 1.0,
            'name': 'accent1',
            'value': '#4f81bd'
          }, {
            'alpha': 1.0,
            'name': 'accent2',
            'value': '#c0504d'
          }, {
            'alpha': 1.0,
            'name': 'accent3',
            'value': '#9bbb59'
          }, {
            'alpha': 1.0,
            'name': 'accent4',
            'value': '#4bacc6'
          }, {
            'alpha': 1.0,
            'name': 'accent5',
            'value': '#4bacc6'
          }, {
            'alpha': 1.0,
            'name': 'accent6',
            'value': '#f79646'
          }, {
            'alpha': 1.0,
            'name': 'hlink',
            'value': '#0000ff'
          }, {
            'alpha': 1.0,
            'name': 'folHlink',
            'value': '#800080'
          }];


          _themeManager.cacheThemeElement('clrSchm', someColorSchemeData);

          _themeFillStyleManager.createFillStyleCSSClass(someFillStyleData.idx,
              someFillStyleData.fill);

          expect(_fillHandler.getFillStyle.callCount).toEqual(12);

          expect(CSSManager.addRule.calls[0].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_dk1');
          expect(CSSManager.addRule.calls[1].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_lt1');
          expect(CSSManager.addRule.calls[2].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_dk2');
          expect(CSSManager.addRule.calls[3].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_lt2');
          expect(CSSManager.addRule.calls[4].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent1');
          expect(CSSManager.addRule.calls[5].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent2');
          expect(CSSManager.addRule.calls[6].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent3');
          expect(CSSManager.addRule.calls[7].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent4');
          expect(CSSManager.addRule.calls[8].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent5');
          expect(CSSManager.addRule.calls[9].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent6');
          expect(CSSManager.addRule.calls[10].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_hlink');
          expect(CSSManager.addRule.calls[11].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_folHlink');
          expect(CSSManager.addRule.callCount).toEqual(12);

          _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
              undefined);
        });

    it('should call getPlaceHolderStyle of FillHandler and appendStyleClass ' +
        'once, when blip-fill', function() {
          spyOn(_fillHandler, 'getFillStyle');
          spyOn(CSSManager, 'addRule');

          var someFillStyleData = {
            'idx': 1,
            'fill': {
              type: 'blipFill'
            }
          };

          _themeFillStyleManager.createFillStyleCSSClass(someFillStyleData.idx,
              someFillStyleData.fill);

          expect(_fillHandler.getFillStyle.callCount).toEqual(1);

          expect(CSSManager.addRule.calls[0].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_blip');
          expect(CSSManager.addRule.callCount).toEqual(1);

          _themeFillStyleManager.cacheThemeFillStyle(someFillStyleData.idx,
              undefined);
        });

    it('should set color scheme only if fill.color is available, with ' +
        'solid-fill', function() {
          spyOn(FillHandler, 'getFillStyle');

          var someFillStyleData = {
            'idx': 1,
            'fill': {
              type: 'solidFill',
              color: {
                clr: 'Some color',
                type: 'srgbClr'
              }
            }
          };

          // Color scheme should be set
          _themeFillStyleManager.createFillStyleCSSClass(someFillStyleData.idx,
              someFillStyleData.fill);

          expect(FillHandler.getFillStyle.mostRecentCall.args[0].color.scheme).
              toBe('folHlink');

          someFillStyleData.fill.color = undefined;

          // Fill handler should get called with color value as undefined
          _themeFillStyleManager.createFillStyleCSSClass(someFillStyleData.idx,
              someFillStyleData.fill);

          expect(FillHandler.getFillStyle.mostRecentCall.args[0].color).
              toBeUndefined();
        });

    it('should call CssManager with css property background image as none if ' +
        'fillJSON is undefined', function() {
          spyOn(CSSManager, 'addRule');
          var someFillStyleData = {
            'idx': 1,
            'fill': {
              type: 'gradientFill'
            }
          };

          _themeFillStyleManager.createFillStyleCSSClass(someFillStyleData.idx,
              someFillStyleData.fill);

          expect(CSSManager.addRule.calls[0].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_dk1');
          expect(CSSManager.addRule.calls[0].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[1].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_lt1');
          expect(CSSManager.addRule.calls[1].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[2].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_dk2');
          expect(CSSManager.addRule.calls[2].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[3].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_lt2');
          expect(CSSManager.addRule.calls[3].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[4].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent1');
          expect(CSSManager.addRule.calls[4].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[5].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent2');
          expect(CSSManager.addRule.calls[5].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[6].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent3');
          expect(CSSManager.addRule.calls[6].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[7].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent4');
          expect(CSSManager.addRule.calls[7].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[8].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent5');
          expect(CSSManager.addRule.calls[8].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[9].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_accent6');
          expect(CSSManager.addRule.calls[9].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[10].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_hlink');
          expect(CSSManager.addRule.calls[10].args[1]).toEqual(
              'background-image:none;');
          expect(CSSManager.addRule.calls[11].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_fill_1_folHlink');
          expect(CSSManager.addRule.calls[11].args[1]).toEqual(
              'background-image:none;');
        });
  });
});
