/**
 * Background Fill style handler Test
 */

define([
  'qowtRoot/drawing/theme/themeFillStyleManager',
  'qowtRoot/dcp/pointHandlers/bgFillStyleHandler'
], function(ThemeFillStyleManager, BgFillStyleHandler) {

  'use strict';


  describe('Background Fill style handler Test', function() {
    var bgFillStyleHandler, _themeFillStyleManager, v, _fillData;

    beforeEach(function() {

      _fillData = {
        type: 'solidFill'
      };

      v = {
        'el': {
          'etp': 'bgfillStl',
          'idx': 1,
          'fill': _fillData
        }
      };

      bgFillStyleHandler = BgFillStyleHandler;
      _themeFillStyleManager = ThemeFillStyleManager;

      spyOn(_themeFillStyleManager, 'createFillStyleCSSClass');
      spyOn(_themeFillStyleManager, 'cacheThemeFillStyle');
    });

    describe('verifying Backfround Fill Style handler input', function() {

      it('should not call the createFillStyleCSSClass of ' +
          'ThemeFillStyleManager if bgFillStl is undefined', function() {
            v = undefined;
            bgFillStyleHandler.visit(v);

            expect(_themeFillStyleManager.createFillStyleCSSClass).
                not.toHaveBeenCalled();
          });

      it('should not call the createFillStyleCSSClass of ' +
          'ThemeFillStyleManager if element in bgFillStl is undefined',
          function() {
            v.el = undefined;
            bgFillStyleHandler.visit(v);

            expect(_themeFillStyleManager.createFillStyleCSSClass).
                not.toHaveBeenCalled();
          });

      it('should not call the createFillStyleCSSClass of ' +
          'ThemeFillStyleManager if element type in bgFillStl is undefined',
          function() {
            v.el.etp = undefined;
            bgFillStyleHandler.visit(v);

            expect(_themeFillStyleManager.createFillStyleCSSClass).
                not.toHaveBeenCalled();
          });

      it('should not call the createFillStyleCSSClass of ' +
          'ThemeFillStyleManager when element type bgFillStl JSON is not ' +
          'bgFillStl', function() {
            v.el.etp = 'xxx';
            bgFillStyleHandler.visit(v);

            expect(_themeFillStyleManager.createFillStyleCSSClass).
                not.toHaveBeenCalled();
          });

    });

    describe(' behaviour check', function() {
      it('should cache bg fill style, when blip-fill', function() {
        _fillData.type = 'blipFill';

        bgFillStyleHandler.visit(v);

        expect(_themeFillStyleManager.cacheThemeFillStyle).
            toHaveBeenCalledWith(1, _fillData);
      });

      it('should cache bg fill style, when solid-fill', function() {
        _fillData.type = 'solidFill';

        bgFillStyleHandler.visit(v);

        expect(_themeFillStyleManager.cacheThemeFillStyle).
            toHaveBeenCalledWith(1, _fillData);
      });

      it('should cache bg fill style, when gradient-fill', function() {
        _fillData.type = 'gradientFill';

        bgFillStyleHandler.visit(v);

        expect(_themeFillStyleManager.cacheThemeFillStyle).
            toHaveBeenCalledWith(1, _fillData);
      });

      it('should cache bg fill style, when no-fill', function() {
        _fillData.type = 'noFill';

        bgFillStyleHandler.visit(v);

        expect(_themeFillStyleManager.cacheThemeFillStyle).
            toHaveBeenCalledWith(1, _fillData);
      });
    });
  });
});
