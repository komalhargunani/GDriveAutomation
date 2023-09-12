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
 * Fill style handler Test
 */

define([
  'qowtRoot/drawing/theme/themeFillStyleManager',
  'qowtRoot/dcp/pointHandlers/fillStyleHandler'
], function(ThemeFillStyleManager, FillStyleHandler) {

  'use strict';


  describe('Fill style handler Test', function() {
    var fillStyleHandler, _themeFillStyleManager, v;

    beforeEach(function() {
      v = {
        el: {
          etp: 'fillStl'
        }
      };
      fillStyleHandler = FillStyleHandler;
      _themeFillStyleManager = ThemeFillStyleManager;
      spyOn(_themeFillStyleManager, 'createFillStyleCSSClass');
    });

    describe(' verifying Fill Style handler input', function() {
      it('should not call the createFillStyleCSSClass of ' +
          'ThemeFillStyleManager when fillStl JSON is undefined', function() {
            v = undefined;
            fillStyleHandler.visit(v);

            expect(_themeFillStyleManager.createFillStyleCSSClass).
                not.toHaveBeenCalled();
          });

      it('should not call the createFillStyleCSSClass of ' +
          'ThemeFillStyleManager when element in fillStl JSON is undefined',
         function() {
           v.el = undefined;
           fillStyleHandler.visit(v);

           expect(_themeFillStyleManager.createFillStyleCSSClass).
               not.toHaveBeenCalled();
         });

      it('should not call the createFillStyleCSSClass of ' +
          'ThemeFillStyleManager when element type in fillStl JSON is ' +
          'undefined', function() {
            v.el.etp = undefined;
            fillStyleHandler.visit(v);

            expect(_themeFillStyleManager.createFillStyleCSSClass).
                not.toHaveBeenCalled();
          });

      it('should not call the createFillStyleCSSClass of ' +
          'ThemeFillStyleManager when element type fillStl JSON is not ' +
          'fillStl', function() {
            v.el.etp = 'xxx';
            fillStyleHandler.visit(v);

            expect(_themeFillStyleManager.createFillStyleCSSClass).
                not.toHaveBeenCalled();
          });

    });

  });
});
