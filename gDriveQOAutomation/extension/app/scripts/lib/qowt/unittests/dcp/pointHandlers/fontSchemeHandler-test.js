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
  'qowtRoot/dcp/pointHandlers/fontSchemeHandler',
  'qowtRoot/drawing/theme/themeManager'
], function(FontScheme, ThemeManager) {

  'use strict';

  describe('FontScheme handler Test', function() {
    var v;

    var _fontSchemeHandler;
    var _themeManager;


    beforeEach(function() {


      v = {
        'el': {
          'etp': 'fntSchm',
          'mjFnt': {
            //major font
            latin: '',
            ea: '', //east-asian
            cs: '' //complex-script
          },
          'mnFnt': {
            //minor font
            latin: '',
            ea: '', //east-asian
            cs: '' //complex-script
          }
        }
      };

      _fontSchemeHandler = FontScheme;
      _themeManager = ThemeManager;

      spyOn(_themeManager, 'cacheThemeElement');
    });

    it('should not call ThemeManager if element type is undefined ',
        function() {
          v = undefined;
          _fontSchemeHandler.visit(v);
          expect(_themeManager.cacheThemeElement).
              not.toHaveBeenCalled();
        });

    it('should not call ThemeManager if v.el is undefined ', function() {
      v.el = undefined;
      _fontSchemeHandler.visit(v);
      expect(_themeManager.cacheThemeElement).not.toHaveBeenCalled();
    });

    it('should not call ThemeManager if v.el.etp is undefined ',
        function() {
          v.el.etp = undefined;
          _fontSchemeHandler.visit(v);
          expect(_themeManager.cacheThemeElement).
              not.toHaveBeenCalled();
        });

    it('should not call ThemeManager if element type is other than fntSchm',
        function() {
          v.el.etp = 'xxx';
          _fontSchemeHandler.visit(v);
          expect(_themeManager.cacheThemeElement).
              not.toHaveBeenCalled();
        });

    it("should call ThemeManager if element type is 'fntSchm' ",
        function() {
          _fontSchemeHandler.visit(v);
          expect(_themeManager.cacheThemeElement).
              toHaveBeenCalledWith('fntSchm', v.el);
        });
  });
});
