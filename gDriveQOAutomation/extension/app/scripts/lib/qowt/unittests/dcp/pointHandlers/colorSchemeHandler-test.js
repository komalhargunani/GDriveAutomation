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
  'qowtRoot/dcp/pointHandlers/colorSchemeHandler'
], function(ThemeManager, ColorSchemeHandler) {

  'use strict';

  describe('ColorScheme handler Test', function() {

    var v;
    var _colorSchemeHandler;
    var _themeManager;

    beforeEach(function() {
      v = {
        'el': {
          'etp': 'clrSchm',
          'name': 'color scheme name',
          'schClrArr': [
            {
              name: 'dk1',
              color: '#colorCode'
            },
            {
              name: 'dk2',
              color: '#colorCode'
            },
            {
              name: 'lt1',
              color: '#colorCode'
            },
            {
              name: 'lt2',
              color: '#colorCode'
            },
            {
              name: 'accent1',
              color: '#colorCode'
            }
          ]
        }
      };

      _colorSchemeHandler = ColorSchemeHandler;
      _themeManager = ThemeManager;

      spyOn(_themeManager, 'cacheThemeElement');
    });

    it('should not call ThemeManager if element type is undefined ',
        function() {
          v = undefined;
          _colorSchemeHandler.visit(v);
          expect(_themeManager.cacheThemeElement).not.toHaveBeenCalled();
        });

    it('should not call ThemeManager if v.el is undefined ', function() {
      v.el = undefined;
      _colorSchemeHandler.visit(v);
      expect(_themeManager.cacheThemeElement).not.toHaveBeenCalled();
    });

    it('should not call ThemeManager if v.el.etp is undefined ', function() {
      v.el.etp = undefined;
      _colorSchemeHandler.visit(v);
      expect(_themeManager.cacheThemeElement).not.toHaveBeenCalled();
    });

    it('should not call ThemeManager if v.el.etp is other than clrSchm ',
        function() {
          v.el.etp = 'xxx';
          _colorSchemeHandler.visit(v);
          expect(_themeManager.cacheThemeElement).not.toHaveBeenCalled();
        });

    it("should call ThemeManager if element type is 'clrSchm' ", function() {
      _colorSchemeHandler.visit(v);
      expect(_themeManager.cacheThemeElement).
          toHaveBeenCalledWith(v.el.etp, v.el.schClrArr);
    });
  });
});
