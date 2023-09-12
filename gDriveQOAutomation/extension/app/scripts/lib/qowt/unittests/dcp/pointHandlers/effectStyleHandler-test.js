/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
/**
 * Effect style handler Test
 */

define([
  'qowtRoot/drawing/theme/themeEffectStyleManager',
  'qowtRoot/dcp/pointHandlers/effectStyleHandler'
], function(ThemeEffectStyleManager, EffectStyleHandler) {

  'use strict';


  describe('Effect style handler Test', function() {
    var effectStyleHandler, _themeEffectStyleManager, v;

    beforeEach(function() {
      v = {
        el: {
          etp: 'efstl'
        }
      };
      effectStyleHandler = EffectStyleHandler;
      _themeEffectStyleManager = ThemeEffectStyleManager;
      spyOn(_themeEffectStyleManager, 'createEffectStyleCSSClass');
    });

    describe(' verifying Effect Style handler input', function() {
      it('should not call the createEffectStyleCSSClass of ' +
          'ThemeEffectStyleManager when effect Style JSON is undefined',
          function() {
            v = undefined;
            effectStyleHandler.visit(v);

            expect(_themeEffectStyleManager.createEffectStyleCSSClass).
                not.toHaveBeenCalled();
          });

      it('should not call the createEffectStyleCSSClass of ' +
          'ThemeEffectStyleManager when element in effect Style JSON is ' +
          'undefined', function() {
            v.el = undefined;
            effectStyleHandler.visit(v);

            expect(_themeEffectStyleManager.createEffectStyleCSSClass).
                not.toHaveBeenCalled();
          });

      it('should not call the createEffectStyleCSSClass of ' +
          'ThemeEffectStyleManager when element type in effect Style JSON ' +
          'is undefined', function() {
            v.el.etp = undefined;
            effectStyleHandler.visit(v);

            expect(_themeEffectStyleManager.createEffectStyleCSSClass).
                not.toHaveBeenCalled();
          });

      it('should not call the createEffectStyleCSSClass of ' +
          'ThemeEffectStyleManager when element type effectStl JSON is not ' +
          'efstl', function() {
            v.el.etp = 'xyz';
            effectStyleHandler.visit(v);

            expect(_themeEffectStyleManager.createEffectStyleCSSClass).
                not.toHaveBeenCalled();
          });

    });

  });
});
