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
  'qowtRoot/drawing/theme/themeLineStyleManager',
  'qowtRoot/models/point',
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/decorators/outlineDecorator',
  'qowtRoot/drawing/color/colorUtility'
], function(ThemeManager,
            ThemeLineStyleManager,
            PointModel,
            CSSManager,
            OutlineDecorator,
            ColorUtility) {

  'use strict';

  describe('Theme Line Style Manager Test', function() {
    var _themeManager = ThemeManager;
    var _themeLineStyleManager = ThemeLineStyleManager;

    beforeEach(function() {
      PointModel.ThemeId = 111;
    });

    afterEach(function() {
      PointModel.ThemeId = undefined;
    });

    it('should get css classes for theme line style', function() {
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'dk1')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_dk1');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'lt1')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_lt1');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'dk2')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_dk2');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'lt2')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_lt2');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'accent1')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_accent1');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'accent2')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_accent2');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'accent3')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_accent3');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'accent4')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_accent4');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'accent5')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_accent5');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'accent6')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_accent6');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'hlink')).toEqual(
          'thm_' + PointModel.ThemeId + '_ln_1_hlink');
      expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'folHlink')).
          toEqual('thm_' + PointModel.ThemeId + '_ln_1_folHlink');
    });

    it('should get css classes for theme line style, when there is color-map ' +
        'override', function() {
          spyOn(ColorUtility, 'getThemeEquivalentOfSchemeColor').andReturn(
              'lt1'); //returns overriden scheme-color
          expect(_themeLineStyleManager.getLineStyleCSSClass(1, 'dk1')).toEqual(
              'thm_' + PointModel.ThemeId + '_ln_1_lt1');
        });

    it('should call cacheThemeElement of ThemeManager', function() {
      spyOn(_themeManager, 'cacheThemeElement');
      var outlineJSON = 'some outline JSON';
      var index = 'some index';

      _themeLineStyleManager.cacheThemeLineStyle(index, outlineJSON);

      expect(_themeManager.cacheThemeElement).toHaveBeenCalledWith('lnStl',
          outlineJSON, index);
    });

    it('should call getLineStyle of ThemeManager', function() {
      spyOn(_themeManager, 'getLineStyle');
      var index = 'some index';

      _themeLineStyleManager.getLineStyle(index);
      expect(_themeManager.getLineStyle).toHaveBeenCalledWith(index);
    });

    it('should call getPlaceHolderStyle of OutlineHandler and appendStyle ' +
        'class 12 times', function() {
          var outlineDecorator = {
            getPlaceHolderStyle: function() {}
          };
          spyOn(OutlineDecorator, 'create').andReturn(outlineDecorator);
          spyOn(outlineDecorator, 'getPlaceHolderStyle');
          spyOn(CSSManager, 'addRule');

          var someLineStyleData = {
            'idx': 1,
            'ln': {
              fill: {
                clr: 'some color'
              }
            }
          };

          var someColorSchemeData = {
            'dk1': 'red',
            'lt1': 'black',
            'dk2': 'blue',
            'lt2': 'brown',
            'accent1': 'cyan',
            'accent2': 'gold',
            'accent3': 'grey',
            'accent4': 'green',
            'accent5': 'indigo',
            'accent6': 'khaki',
            'hlink': 'lime',
            'folHlink': 'maroon'
          };

          _themeManager.cacheThemeElement('clrSchm', someColorSchemeData);

          _themeLineStyleManager.createLineStyleCSSClass(someLineStyleData.idx,
              someLineStyleData.ln);

          expect(outlineDecorator.getPlaceHolderStyle.callCount).toEqual(12);

          expect(CSSManager.addRule.calls[0].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_dk1');
          expect(CSSManager.addRule.calls[1].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_lt1');
          expect(CSSManager.addRule.calls[2].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_dk2');
          expect(CSSManager.addRule.calls[3].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_lt2');
          expect(CSSManager.addRule.calls[4].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_accent1');
          expect(CSSManager.addRule.calls[5].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_accent2');
          expect(CSSManager.addRule.calls[6].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_accent3');
          expect(CSSManager.addRule.calls[7].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_accent4');
          expect(CSSManager.addRule.calls[8].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_accent5');
          expect(CSSManager.addRule.calls[9].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_accent6');
          expect(CSSManager.addRule.calls[10].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_hlink');
          expect(CSSManager.addRule.calls[11].args[0]).toEqual(
              '.thm_' + PointModel.ThemeId + '_ln_1_folHlink');
          expect(CSSManager.addRule.callCount).toEqual(12);
        });

    it('should not append style class if outlineJSON is undefined', function() {
      var index = 'some index';
      spyOn(CSSManager, 'addRule');

      _themeLineStyleManager.createLineStyleCSSClass(index, undefined);

      expect(CSSManager.addRule).not.toHaveBeenCalled();
    });
  });
});
