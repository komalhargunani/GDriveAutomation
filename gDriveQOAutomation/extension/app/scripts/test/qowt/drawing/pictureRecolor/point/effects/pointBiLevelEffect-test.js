
define([
  'qowtRoot/drawing/pictureRecolor/effects/biLevelEffect',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointBiLevelEffect'
], function(BiLevelEffect,
            PointBiLevelEffect) {

  'use strict';

  describe('Point\'s BiLevel Effect Test', function() {
    it('should properly create a bilevel effect object', function() {
      var effect = new PointBiLevelEffect(50000);

      // test effect object's instantiation
      assert.isDefined(effect);

      // test effect object's instantiation
      assert.isDefined(effect.thresh);
      assert.property(effect, 'thresh');
      assert.strictEqual(effect.thresh, 127.5);

      // test effect object's hierarchy
      assert.instanceOf(effect, PointBiLevelEffect);
      assert.instanceOf(PointBiLevelEffect.prototype, BiLevelEffect);
    });

    it('should correctly scale down values from range of [0, 100000] to ' +
        '[0, 100]', function() {

          var effect = new PointBiLevelEffect();
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 127.5);

          effect = new PointBiLevelEffect(0);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 0);

          effect = new PointBiLevelEffect(10000);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 25.5);

          effect = new PointBiLevelEffect(25000);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 63.75);

          effect = new PointBiLevelEffect(47000);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 119.85);

          effect = new PointBiLevelEffect(65500);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 167.025);

          effect = new PointBiLevelEffect(90000);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 229.5);

          effect = new PointBiLevelEffect(100000);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 255);
        });

    it('should correctly cap value when provided value is out of range of ' +
        '[0, 100000]', function() {

          var effect = new PointBiLevelEffect(-1);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 0);

          effect = new PointBiLevelEffect(100000.9);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 255);

          effect = new PointBiLevelEffect(100001);
          assert.isDefined(effect.thresh);
          assert.strictEqual(effect.thresh, 255);
        });
  });
});
