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
  'qowtRoot/dcp/pointHandlers/lineStyleHandler',
  'qowtRoot/drawing/theme/themeLineStyleManager'
], function(LineStyle, ThemeLineStyleManager) {

  'use strict';

  describe('Line Style handler Test', function() {
    var v;

    var _lineStyleHandler;
    var _themeLineStyleManager;


    beforeEach(function() {
      v = {
        'el': {
          'etp': 'lnStl',
          'idx': 1,
          'ln': {}
        }
      };

      _lineStyleHandler = LineStyle;
      _themeLineStyleManager = ThemeLineStyleManager;

      spyOn(_themeLineStyleManager, 'createLineStyleCSSClass');
      spyOn(_themeLineStyleManager, 'cacheThemeLineStyle');
    });

    it('should not call ThemeLineStyleManager if element type is undefined ',
       function() {
         v = undefined;
         _lineStyleHandler.visit(v);
         expect(_themeLineStyleManager.createLineStyleCSSClass).
             not.toHaveBeenCalled();
         expect(_themeLineStyleManager.cacheThemeLineStyle).
             not.toHaveBeenCalled();
       });

    it('should not call ThemeLineStyleManager if v.el is undefined ',
       function() {
         v.el = undefined;
         _lineStyleHandler.visit(v);
         expect(_themeLineStyleManager.createLineStyleCSSClass).
             not.toHaveBeenCalled();
         expect(_themeLineStyleManager.cacheThemeLineStyle).
             not.toHaveBeenCalled();
       });

    it('should not call ThemeLineStyleManager if v.el.etp is undefined ',
       function() {
         v.el.etp = undefined;
         _lineStyleHandler.visit(v);
         expect(_themeLineStyleManager.createLineStyleCSSClass).
             not.toHaveBeenCalled();
         expect(_themeLineStyleManager.cacheThemeLineStyle).
             not.toHaveBeenCalled();
       });

    it('should not call ThemeLineStyleManager if element type other than ' +
        'lnStl ', function() {
          v.el.etp = 'xxx';
          _lineStyleHandler.visit(v);
          expect(_themeLineStyleManager.createLineStyleCSSClass).
              not.toHaveBeenCalled();
          expect(_themeLineStyleManager.cacheThemeLineStyle).
              not.toHaveBeenCalled();
        });

    it("should call ThemeLineStyleManager if element type is 'lnStl' ",
       function() {
         _lineStyleHandler.visit(v);
         expect(_themeLineStyleManager.createLineStyleCSSClass).
             toHaveBeenCalledWith(v.el.idx, v.el.ln);
         expect(_themeLineStyleManager.cacheThemeLineStyle).
             toHaveBeenCalledWith(v.el.idx, v.el.ln);
       });
  });
});
