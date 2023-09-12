
define([
  'qowtRoot/drawing/pictureRecolor/effects/duotoneEffect',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointDuotoneEffect',
  'qowtRoot/drawing/theme/themeManager'
], function(DuotoneEffect,
            PointDuotoneEffect,
            ThemeManager) {

  'use strict';

  describe('Point\'s Duotone Effect Test', function() {
    describe('Test instance creation', function() {
      it('should properly create a duotone effect object', function() {
        var effect = new PointDuotoneEffect();

        assert.isDefined(effect);

        // test effect object's hierarchy
        assert.instanceOf(effect, PointDuotoneEffect);
        assert.instanceOf(PointDuotoneEffect.prototype, DuotoneEffect);
      });

      it('should correctly populate colors when supplied at instantiation',
          function() {
            var presetColor = {
              type: 'prstClr',
              val: 'gray'
            },
                srgbColor = {
                  clr: '#eadfd1',
                  effects: [{
                    name: 'satMod',
                    value: 43000
                  }],
                  type: 'srgbClr'
                },
                schemeColor = {
                  effects: [{
                    name: 'tint',
                    value: 80000
                  }],
                  scheme: 'accent1',
                  type: 'schemeClr'
                },
                placeholderColor = {
                  effects: [{
                    name: 'tint',
                    value: 86000
                  }],
                  scheme: 'phClr',
                  type: 'schemeClr'
                },
                colorScheme = {accent1: '#72a376'},
                effect;

            sinon.stub(ThemeManager, 'getColorTheme', function() {
              return colorScheme;
            });

            // try with a preset color
            effect = new PointDuotoneEffect(presetColor);
            assert.isDefined(effect);
            assert.isDefined(effect.firstColor);
            assert.strictEqual(effect.firstColor.R, 128);
            assert.strictEqual(effect.firstColor.G, 128);
            assert.strictEqual(effect.firstColor.B, 128);
            assert.isDefined(effect.secondColor);
            assert.isTrue(effect.secondColor.isEmpty());

            // try with a color in srgb format
            effect = new PointDuotoneEffect(srgbColor);
            assert.isDefined(effect);
            assert.isDefined(effect.firstColor);
            assert.strictEqual(effect.firstColor.R, 226);
            assert.strictEqual(effect.firstColor.G, 222);
            assert.strictEqual(effect.firstColor.B, 216);
            assert.isDefined(effect.secondColor);
            assert.isTrue(effect.secondColor.isEmpty());

            // try with a scheme color
            effect = new PointDuotoneEffect(schemeColor);
            assert.isDefined(effect);
            assert.isDefined(effect.firstColor);
            assert.strictEqual(effect.firstColor.R, 156);
            assert.strictEqual(effect.firstColor.G, 186);
            assert.strictEqual(effect.firstColor.B, 158);
            assert.isDefined(effect.secondColor);
            assert.isTrue(effect.secondColor.isEmpty());

            // try with a scheme color and a placeholder color
            effect = new PointDuotoneEffect(placeholderColor, schemeColor);
            assert.isDefined(effect);
            assert.isDefined(effect.firstColor);
            assert.isTrue(effect.firstColor.isEmpty());
            assert.isDefined(effect.secondColor);
            assert.strictEqual(effect.secondColor.R, 156);
            assert.strictEqual(effect.secondColor.G, 186);
            assert.strictEqual(effect.secondColor.B, 158);

            // try with a scheme color and a color in srgb format
            effect = new PointDuotoneEffect(schemeColor, srgbColor);
            assert.isDefined(effect);
            assert.isDefined(effect.firstColor);
            assert.isFalse(effect.firstColor.isEmpty());
            assert.strictEqual(effect.firstColor.R, 156);
            assert.strictEqual(effect.firstColor.G, 186);
            assert.strictEqual(effect.firstColor.B, 158);
            assert.isDefined(effect.secondColor);
            assert.isFalse(effect.secondColor.isEmpty());
            assert.strictEqual(effect.secondColor.R, 226);
            assert.strictEqual(effect.secondColor.G, 222);
            assert.strictEqual(effect.secondColor.B, 216);

            ThemeManager.getColorTheme.restore();
          });
    });
  });
});
