
define([
  'qowtRoot/drawing/pictureRecolor/effects/luminanceEffect',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointLuminanceEffect'
], function(LuminanceEffect,
            PointLuminanceEffect) {

  'use strict';

  describe('Point\'s Luminance Effect Test', function() {
    it('should properly create a luminance effect object', function() {
      var effect = new PointLuminanceEffect(50000, 50000);

      // test effect object's instantiation
      assert.isDefined(effect);

      // test effect object's instantiation
      assert.strictEqual(effect.bright, 50);
      assert.strictEqual(effect.contrast, 50);

      // test effect object's hierarchy
      assert.instanceOf(effect, PointLuminanceEffect);
      assert.instanceOf(PointLuminanceEffect.prototype, LuminanceEffect);
    });

    it('should correctly scale down values from range of [-100000, 100000] to' +
        ' [-100, 100]', function() {

          var effect = new PointLuminanceEffect(0, 0);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 0);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 0);

          effect = new PointLuminanceEffect(-100000, -100000);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, -100);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, -100);

          effect = new PointLuminanceEffect(100000, 100000);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 100);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 100);

          effect = new PointLuminanceEffect(50000, -50000);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 50);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, -50);

          effect = new PointLuminanceEffect(25000, 77000);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 25);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 77);

          effect = new PointLuminanceEffect(-16000, -93000);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, -16);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, -93);

          effect = new PointLuminanceEffect(-23400, 64600);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, -23.4);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 64.6);

          effect = new PointLuminanceEffect(12000);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 12);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 0);

          effect = new PointLuminanceEffect(undefined, 12000);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 0);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 12);
        });

    it('should correctly cap values when provided values are out of range of ' +
        '[-100000, 100000]', function() {

          var effect = new PointLuminanceEffect(-100001);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, -100);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 0);

          effect = new PointLuminanceEffect(null, -100001);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 0);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, -100);

          effect = new PointLuminanceEffect(-100001, -100001);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, -100);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, -100);

          effect = new PointLuminanceEffect(-100000.1, -100000.1);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, -100);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, -100);

          effect = new PointLuminanceEffect(100000.1, 100000.1);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 100);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 100);

          effect = new PointLuminanceEffect(100001, 100001);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 100);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 100);

          effect = new PointLuminanceEffect();
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 0);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 0);

          effect = new PointLuminanceEffect(null, null);
          assert.isDefined(effect.bright);
          assert.strictEqual(effect.bright, 0);
          assert.isDefined(effect.contrast);
          assert.strictEqual(effect.contrast, 0);
        });
  });
});
