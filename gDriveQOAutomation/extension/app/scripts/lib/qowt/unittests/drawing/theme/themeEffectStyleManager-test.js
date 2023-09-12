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
  'qowtRoot/drawing/theme/themeEffectStyleManager',
  'qowtRoot/models/point',
  'qowtRoot/utils/cssManager',
  'qowtRoot/drawing/color/colorUtility'
], function(ThemeManager,
            ThemeEffectStyleManager,
            PointModel,
            CSSManager,
            ColorUtility) {

  'use strict';


  describe('Theme Effect Style Manager Test', function() {
    var _themeManager = ThemeManager;
    var _themeEffectStyleManager = ThemeEffectStyleManager;
    var _someEffectStyleData;

    beforeEach(function() {

      _someEffectStyleData = {
        'idx': 1,
        'efstlst': {
          refnEff: {blurRad: 6350, dist: 60, algn: 'bl'},
          outSdwEff: {
            blurRad: 6350,
            dist: 60,
            algn: 'bl',
            color: {scheme: 'scheme', type: 'scheme'}
          }
        }
      };
      PointModel.ThemeId = 111;
    });

    afterEach(function() {
      PointModel.ThemeId = undefined;
    });


    it('should appendStyleClass 12 times each for High Level and Low Level',
       function() {
         spyOn(CSSManager, 'addRule');
         spyOn(ColorUtility, 'getColor').andReturn('rgba(255,255,255,1)');

         _themeManager.cacheThemeElement('effectStl',
             _someEffectStyleData.efstlst);

         _themeEffectStyleManager.createEffectStyleCSSClass(
             _someEffectStyleData.idx, _someEffectStyleData.efstlst);


         expect(CSSManager.addRule.calls[0].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_dk1_high_level');
         expect(CSSManager.addRule.calls[1].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_dk1_low_level');
         expect(CSSManager.addRule.calls[2].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_lt1_high_level');
         expect(CSSManager.addRule.calls[3].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_lt1_low_level');
         expect(CSSManager.addRule.calls[4].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_dk2_high_level');
         expect(CSSManager.addRule.calls[5].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_dk2_low_level');
         expect(CSSManager.addRule.calls[6].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_lt2_high_level');
         expect(CSSManager.addRule.calls[7].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_lt2_low_level');
         expect(CSSManager.addRule.calls[8].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent1_high_level');
         expect(CSSManager.addRule.calls[9].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent1_low_level');
         expect(CSSManager.addRule.calls[10].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent2_high_level');
         expect(CSSManager.addRule.calls[11].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent2_low_level');
         expect(CSSManager.addRule.calls[12].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent3_high_level');
         expect(CSSManager.addRule.calls[13].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent3_low_level');
         expect(CSSManager.addRule.calls[14].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent4_high_level');
         expect(CSSManager.addRule.calls[15].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent4_low_level');
         expect(CSSManager.addRule.calls[16].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent5_high_level');
         expect(CSSManager.addRule.calls[17].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent5_low_level');
         expect(CSSManager.addRule.calls[18].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent6_high_level');
         expect(CSSManager.addRule.calls[19].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_accent6_low_level');
         expect(CSSManager.addRule.calls[20].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_hlink_high_level');
         expect(CSSManager.addRule.calls[21].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_hlink_low_level');
         expect(CSSManager.addRule.calls[22].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_folHlink_high_level');
         expect(CSSManager.addRule.calls[23].args[0]).toEqual(
             '.thm_' + PointModel.ThemeId + '_effect_1_folHlink_low_level');
         expect(CSSManager.addRule.callCount).toEqual(24);

         _themeEffectStyleManager.cacheThemeEffectStyleLst(
             _someEffectStyleData.idx, undefined);
       });


    it('should get cached theme effect style', function() {
      _themeEffectStyleManager.cacheThemeEffectStyleLst(
          _someEffectStyleData.idx, _someEffectStyleData.effectstyle);

      expect(_themeEffectStyleManager.getEffectStyle(1)).toEqual(
          _someEffectStyleData.effectstyle);

      _themeEffectStyleManager.cacheThemeEffectStyleLst(
          _someEffectStyleData.idx, undefined);
    });

    it('should get High Level Effect Style CSS Class', function() {
      spyOn(ColorUtility, 'getThemeEquivalentOfSchemeColor').andReturn('lt1');
      var effectClassName = _themeEffectStyleManager.
          getHighLevelEffectStyleCSSClass(_someEffectStyleData.idx, 'lt1');

      expect(effectClassName).toEqual('thm_111_effect_1_lt1_high_level');

      _themeEffectStyleManager.cacheThemeEffectStyleLst(
          _someEffectStyleData.idx, undefined);
    });

    it('should get High Level Effect Style CSS Class , when there is ' +
        'color-map override', function() {
          spyOn(ColorUtility, 'getThemeEquivalentOfSchemeColor').
              andReturn('lt1');
          var effectClassName = _themeEffectStyleManager.
              getHighLevelEffectStyleCSSClass(_someEffectStyleData.idx, 'dk1');

          expect(effectClassName).toEqual('thm_111_effect_1_lt1_high_level');

          _themeEffectStyleManager.cacheThemeEffectStyleLst(
              _someEffectStyleData.idx, undefined);
        });

    it('should get low Level Effect Style CSS Class', function() {
      spyOn(ColorUtility, 'getThemeEquivalentOfSchemeColor').andReturn('lt1');
      var effectClassName = _themeEffectStyleManager.
          getLowLevelEffectStyleCSSClass(_someEffectStyleData.idx, 'lt1');

      expect(effectClassName).toEqual('thm_111_effect_1_lt1_low_level');

      _themeEffectStyleManager.cacheThemeEffectStyleLst(
          _someEffectStyleData.idx, undefined);
    });

    it('should get low Level Effect Style CSS Class, when there is ' +
        'color-map override', function() {
          spyOn(ColorUtility, 'getThemeEquivalentOfSchemeColor').
              andReturn('lt1');
          var effectClassName = _themeEffectStyleManager.
              getLowLevelEffectStyleCSSClass(_someEffectStyleData.idx, 'dk1');

          expect(effectClassName).toEqual('thm_111_effect_1_lt1_low_level');

          _themeEffectStyleManager.cacheThemeEffectStyleLst(
              _someEffectStyleData.idx, undefined);
        });

  });
});
