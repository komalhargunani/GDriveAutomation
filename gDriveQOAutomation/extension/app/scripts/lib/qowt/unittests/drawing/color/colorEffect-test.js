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
  'qowtRoot/drawing/color/colorEffect'
], function(ColorEffect) {

  'use strict';

  describe('Color Effect', function() {
    var _colorEffect;

    beforeEach(function() {
      _colorEffect = ColorEffect;

    });

    it('should return proper hex color value for -no- effect', function() {
      var effects = [];
      var returnedVal = _colorEffect.getARGBColor('#000082', effects);

      expect(returnedVal.rgb).toEqual('#000082');
    });

    it('should return proper hex color value for -blue- effect', function() {
      var effects = [{
        name: 'blue',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00b0bb', effects);

      expect(hexEffectColor.rgb).toEqual('#00b0bb');
    });

    it('should return proper hex color value for -blueMod- effect', function() {
      var effects = [{
        name: 'blueMod',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

      expect(hexEffectColor.rgb).toEqual('#00b0b0');
    });

    it('should return proper hex color value for -blueOff- effect', function() {
      var effects = [{
        name: 'blueOff',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

      expect(hexEffectColor.rgb).toEqual('#00b0ff');
    });

    it('should return proper hex color value for -red- effect', function() {
      var effects = [{
        name: 'red',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

      expect(hexEffectColor.rgb).toEqual('#bbb0f0');
    });

    it('should return proper hex color value for -redMod- effect', function() {
      var effects = [{
        name: 'redMod',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

      expect(hexEffectColor.rgb).toEqual('#00b0f0');
    });

    it('should return proper hex color value for -redOff- effect', function() {
      var effects = [{
        name: 'redOff',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

      expect(hexEffectColor.rgb).toEqual('#bbb0f0');
    });

    it('should return proper hex color value for -green- effect', function() {
      var effects = [{
        name: 'green',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

      expect(hexEffectColor.rgb).toEqual('#00bbf0');
    });

    it('should return proper hex color value for -greenMod- effect',
        function() {
          var effects = [{
            name: 'greenMod',
            value: 50000
          }];
          var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

          expect(hexEffectColor.rgb).toEqual('#0080f0');
        });

    it('should return proper hex color value for -greenOff- effect',
        function() {
          var effects = [{
            name: 'greenOff',
            value: 50000
          }];
          var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

          expect(hexEffectColor.rgb).toEqual('#00f7f0');
        });

    it('should return proper hex color value for -hue- effect', function() {
      var effects = [{
        name: 'hue',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#4F81BD', effects);

      expect(hexEffectColor.rgb).toEqual('#bd504f');
    });

    it('should return proper hex color value for -hueMod- effect', function() {
      var effects = [{
        name: 'hueMod',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

      expect(hexEffectColor.rgb).toEqual('#58f000');
    });

    it('should return proper hex color value for -hueOff- effect', function() {
      var effects = [{
        name: 'hueOff',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00B0F0', effects);

      expect(hexEffectColor.rgb).toEqual('#00acf0');
    });

    it('should return proper hex color value for -lum- effect', function() {
      var effects = [{
        name: 'lum',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00effe', effects);

      expect(hexEffectColor.rgb).toEqual('#00effe');
    });

    it('should return proper hex color value for -lumMod- effect', function() {
      var effects = [{
        name: 'lumMod',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00b0bb', effects);

      expect(hexEffectColor.rgb).toEqual('#00585d');
    });

    it('should return proper hex color value for -lumOff- effect', function() {
      var effects = [{
        name: 'lumOff',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00b0bb', effects);

      expect(hexEffectColor.rgb).toEqual('#bbfafe');
    });

    it('should return proper hex color value for -sat- effect', function() {
      var effects = [{
        name: 'sat',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00b0bb', effects);

      expect(hexEffectColor.rgb).toEqual('#2e868c');
    });

    it('should return proper hex color value for -satMod- effect', function() {
      var effects = [{
        name: 'satMod',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#6A83A1', effects);

      expect(hexEffectColor.rgb).toEqual('#778493');
    });

    it('should return proper hex color value for -satOff- effect', function() {
      var effects = [{
        name: 'satOff',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00b0bb', effects);

      expect(hexEffectColor.rgb).toEqual('#00b0bb');
    });

    it('should return proper hex color value for -shade- effect', function() {
      var effects = [{
        name: 'shade',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00b0bb', effects);

      expect(hexEffectColor.rgb).toEqual('#008088');
    });

    it('should return proper hex color value for -tint- effect', function() {
      var effects = [{
        name: 'tint',
        value: 50000
      }];
      var hexEffectColor = _colorEffect.getARGBColor('#00b0bb', effects);

      expect(hexEffectColor.rgb).toEqual('#bbdce0');
    });

    it('should call appropriate functions when multiple effects are applied',
        function() {
          var effects = [{
            name: 'lumMod',
            value: '60000'
          }, {
            name: 'lumOff',
            value: '40000'
          }];
          var returnedVal = _colorEffect.getARGBColor('#8064A2', effects);

          expect(returnedVal.rgb).toEqual('#b2a2c7');

        });
  });
});
