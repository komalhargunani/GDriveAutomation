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
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/models/point'
], function(ThemeManager, PointModel) {

  'use strict';

  describe('ThemeManager Test', function() {
    var _themeManager = ThemeManager;

    beforeEach(function() {
      PointModel.ThemeId = 111;
    });

    afterEach(function() {
      PointModel.ThemeId = undefined;
    });

    it('should cache color-scheme data for theme', function() {
      var someColorSchemeData = [{
        name: 'dk1',
        value: 'red'
      }, {
        name: 'dk2',
        value: 'blue'
      }];

      _themeManager.cacheThemeElement('clrSchm', someColorSchemeData);

      var expectedCachedColorScheme = {
        'dk1': 'red',
        'dk2': 'blue'
      };

      var cachedColorTheme = _themeManager.getColorTheme();

      expect(cachedColorTheme).toEqual(expectedCachedColorScheme);
    });

    it('should cache font-scheme data for theme', function() {
      var someFontSchemeData = {
        'mjFnt': {
          latin: '',
          ea: '',
          cs: ''
        },
        'mnFnt': {
          latin: '',
          ea: '',
          cs: ''
        }
      };

      _themeManager.cacheThemeElement('fntSchm', someFontSchemeData);

      expect(_themeManager.getFontStyle()).toEqual(someFontSchemeData);
    });

    it('should cache fill style data for theme', function() {
      var someFillStyleData = {
        'idx': 1,
        'fill': 'some fill properties'
      };

      _themeManager.cacheThemeElement('fillStl', someFillStyleData.fill, 1);

      expect(_themeManager.getFillStyle(1)).toEqual('some fill properties');
    });

    it('should cache theme line style', function() {
      var someLineStyleData = {
        'idx': 1,
        'ln': 'some outline properties'
      };

      _themeManager.cacheThemeElement('lnStl', someLineStyleData.ln,
          someLineStyleData.idx);

      expect(_themeManager.getLineStyle(1)).toEqual('some outline properties');
    });
  });
});
