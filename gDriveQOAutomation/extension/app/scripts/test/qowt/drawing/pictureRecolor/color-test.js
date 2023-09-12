
define([
  'qowtRoot/drawing/pictureRecolor/color'
], function(Color) {

  'use strict';

  describe('Test Color Object', function() {
    describe('test object construction', function() {
      it('should properly create a color object when constructor called ' +
          'without any param', function() {
            var color = new Color();

            // test color object's instantiation
            assert.isDefined(color);
            assert.instanceOf(color, Color);

            // test color object's instantiation
            assert.property(color, 'R');
            assert.isNull(color.R);
            assert.property(color, 'G');
            assert.isNull(color.G);
            assert.property(color, 'B');
            assert.isNull(color.B);

            // test color object's hierarchy
            var colorPrototype = Color.prototype;
            assert.instanceOf(colorPrototype, Object);

            // test color object's prototype method - 'isEmpty'
            assert.isDefined(color.isEmpty);
            assert.isFunction(color.isEmpty);
            assert.strictEqual(color.isEmpty, colorPrototype.isEmpty);
          });

      it('should properly create a color object when constructor called with' +
          ' color string in a valid format', function() {
            var redChannel = 0,
                blueChannel = 127,
                greenChannel = 255,
                opacity = 0.5,
                color = new Color('rgba(' + redChannel + ',' + greenChannel +
                    ',' + blueChannel + ',' + opacity + ')');

            // test color object's instantiation
            assert.isDefined(color);
            assert.instanceOf(color, Color);

            // test color object's instantiation
            assert.property(color, 'R');
            assert.strictEqual(color.R, redChannel);
            assert.property(color, 'G');
            assert.strictEqual(color.G, greenChannel);
            assert.property(color, 'B');
            assert.strictEqual(color.B, blueChannel);

            // test color object's hierarchy
            var colorPrototype = Color.prototype;
            assert.instanceOf(colorPrototype, Object);

            // test color object's prototype method - 'isEmpty'
            assert.isDefined(color.isEmpty);
            assert.isFunction(color.isEmpty);
            assert.strictEqual(color.isEmpty, colorPrototype.isEmpty);
          });

      it('should create a color object with null color channel values when ' +
          'constructor called with color string in an invalid format ',
          function() {
            var redChannel = 0,
                blueChannel = 127,
                greenChannel = 255,
                opacity = 0.5,
                // 'rgba' prefix missing which makes the color string invalid
                color = new Color('(' + redChannel + ',' + greenChannel +
                    ',' + blueChannel + ',' + opacity + ')');

            // test color object's instantiation
            assert.isDefined(color);
            assert.instanceOf(color, Color);

            // test color object's instantiation
            assert.property(color, 'R');
            assert.isNull(color.R);
            assert.property(color, 'G');
            assert.isNull(color.G);
            assert.property(color, 'B');
            assert.isNull(color.B);

            // test color object's hierarchy
            var colorPrototype = Color.prototype;
            assert.instanceOf(colorPrototype, Object);

            // test color object's prototype method - 'isEmpty'
            assert.isDefined(color.isEmpty);
            assert.isFunction(color.isEmpty);
            assert.strictEqual(color.isEmpty, colorPrototype.isEmpty);
          });
    });

    describe('test "isEmpty" API', function() {
      var color_;

      beforeEach(function() {
        color_ = new Color('rgba(0,163,255,1)');
      });

      afterEach(function() {
        color_ = undefined;
      });

      it('should return false when each of the color channels have finite ' +
          'values', function() {
            assert.strictEqual(color_.isEmpty(), false);
          });

      it('should return true when the color object is uninitialized',
          function() {
            var color = new Color();

            assert.strictEqual(color.isEmpty(), true);
          });

      it('should return true when either of the color channels have a null' +
          ' value', function() {
            color_.R = null;

            assert.strictEqual(color_.isEmpty(), true);
          });
    });

  });
});
