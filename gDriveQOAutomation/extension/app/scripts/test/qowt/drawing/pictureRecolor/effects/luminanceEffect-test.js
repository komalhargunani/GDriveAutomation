
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/drawing/pictureRecolor/effects/luminanceEffect',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'
], function(BaseRecolorEffect,
            LuminanceEffect,
            QowtSilentError,
            ErrorCatcher) {

  'use strict';

  describe('Luminance Recolor Effect Test', function() {
    describe('test object construction', function() {
      it('should properly create a luminance effect object', function() {

        // Effect instantiated without any threshold
        var effect = new LuminanceEffect();

        // test effect object's instantiation
        assert.isDefined(effect);
        assert.instanceOf(effect, LuminanceEffect);

        // test effect object's instantiation
        assert.isDefined(effect.name);
        assert.isTrue(effect.hasOwnProperty('name'));
        assert.strictEqual(effect.name, 'luminance');

        assert.isDefined(effect.bright);
        assert.isTrue(effect.hasOwnProperty('bright'));
        assert.strictEqual(effect.bright, 0);

        assert.isDefined(effect.contrast);
        assert.isTrue(effect.hasOwnProperty('contrast'));
        assert.strictEqual(effect.contrast, 0);

        assert.isDefined(effect.k);
        assert.isTrue(effect.hasOwnProperty('k'));
        assert.isNull(effect.k);

        assert.isDefined(effect.b);
        assert.isTrue(effect.hasOwnProperty('b'));
        assert.isNull(effect.b);

        assert.isDefined(effect.halfBrightness);
        assert.isTrue(effect.hasOwnProperty('halfBrightness'));
        assert.isNull(effect.halfBrightness);

        // test effect object's hierarchy
        var effectPrototype = LuminanceEffect.prototype;
        assert.instanceOf(effectPrototype, BaseRecolorEffect);

        // test luminance effect object's prototype methods - 'apply'
        assert.isDefined(effect.apply);
        assert.isFunction(effect.apply);
        assert.deepEqual(effect.apply, effectPrototype.apply);
        assert.notStrictEqual(effect.apply, BaseRecolorEffect.prototype.apply);
      });

      it('should properly instantiate a luminance effect object with ' +
          'valid luminance and contrast values when supplied values are in ' +
          'valid range of 0 - 100', function() {

            var effect = new LuminanceEffect(0, 0);
            assert.strictEqual(effect.bright, 0);
            assert.strictEqual(effect.contrast, 0);

            effect = new LuminanceEffect(-100, -100);
            assert.strictEqual(effect.bright, -100);
            assert.strictEqual(effect.contrast, -100);

            effect = new LuminanceEffect(100, 100);
            assert.strictEqual(effect.bright, 100);
            assert.strictEqual(effect.contrast, 100);

            effect = new LuminanceEffect(50);
            assert.strictEqual(effect.bright, 50);
            assert.strictEqual(effect.contrast, 0);

            effect = new LuminanceEffect(null, 75);
            assert.strictEqual(effect.bright, 0);
            assert.strictEqual(effect.contrast, 75);

            effect = new LuminanceEffect(25, 75);
            assert.strictEqual(effect.bright, 25);
            assert.strictEqual(effect.contrast, 75);

            effect = new LuminanceEffect(-10, -60);
            assert.strictEqual(effect.bright, -10);
            assert.strictEqual(effect.contrast, -60);
          });

      it('should properly instantiate a luminance effect object with ' +
          'default brightness and contrast values when supplied values are ' +
          'not in valid range of 0 - 100', function() {

            var effect = new LuminanceEffect(-101, -101);
            assert.strictEqual(effect.bright, -100);
            assert.strictEqual(effect.contrast, -100);

            effect = new LuminanceEffect(101, 101);
            assert.strictEqual(effect.bright, 100);
            assert.strictEqual(effect.contrast, 100);
          });

      it('should properly instantiate a luminance effect object with ' +
          'default brightness and contrast values when supplied values are ' +
          'not in specified number format', function() {

            var effect = new LuminanceEffect('93', '-17');
            assert.strictEqual(effect.bright, 93);
            assert.strictEqual(effect.contrast, -17);

            effect = new LuminanceEffect('abc', 'def');
            assert.strictEqual(effect.bright, 0);
            assert.strictEqual(effect.contrast, 0);

            effect = new LuminanceEffect();
            assert.strictEqual(effect.bright, 0);
            assert.strictEqual(effect.contrast, 0);

            effect = new LuminanceEffect(null, null);
            assert.strictEqual(effect.bright, 0);
            assert.strictEqual(effect.contrast, 0);
          });
    });

    describe('test "apply" API', function() {
      var luminanceEffect_;

      beforeEach(function() {
        sinon.stub(ErrorCatcher, 'handleError');
      });

      afterEach(function() {
        ErrorCatcher.handleError.restore();

        luminanceEffect_ = undefined;
      });

      it('should not process/apply if image data isn\'t passed', function() {
        luminanceEffect_ = new LuminanceEffect(10, 35);
        assert.isFalse(luminanceEffect_.apply());
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should not process/apply if image data is empty', function() {
        luminanceEffect_ = new LuminanceEffect(10, 35);
        assert.isFalse(luminanceEffect_.apply([]));
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should log message when image data is not an instance of ' +
          '"Uint8ClampedArray"', function() {
            var imageData = [0, 127, 255, 1],
                returnValue;

            luminanceEffect_ = new LuminanceEffect(10, 35);
            returnValue = luminanceEffect_.apply(imageData);

            assert.isTrue(returnValue);
            assert.deepEqual(imageData, [
              -35.916465984346786,
              159.0564419024684,
              355.56456953642385,
              1]);
            assert.isTrue(ErrorCatcher.handleError.calledOnce);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                new QowtSilentError('LuminanceEffect: Image ' +
                    'data isn\'t a Uint8ClampedArray. The result color ' +
                    'channel values may be fractional and may spill off 0 - ' +
                    '255 value boundaries!'));
          });

      it('should skip processing of transparent pixels', function() {
        var imageData = new Uint8ClampedArray([0, 127, 255, 0]),
            expectedImageData = new Uint8ClampedArray([0, 127, 255, 0]),
            returnValue;

        luminanceEffect_ = new LuminanceEffect(10, 35);
        returnValue = luminanceEffect_.apply(imageData);

        assert.isTrue(returnValue);
        assert.deepEqual(imageData, expectedImageData);
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should process correctly on set of pixel values when brightness is 0',
          function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(0);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(127, 127, 127, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 25, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 25, 50, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(25, 50, 75, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(50, 75, 100, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(75, 100, 125, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(100, 125, 150, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(125, 150, 175, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(150, 175, 200, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(175, 200, 225, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(200, 225, 250, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(225, 250, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(250, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.isNull(luminanceEffect_.halfBrightness);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '50', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(50);

            initialData.push(0, 0, 0, 255);
            expectedData.push(128, 128, 128, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(254, 254, 254, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(128, 128, 152, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(128, 152, 178, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(152, 178, 202, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(178, 202, 228, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(202, 228, 252, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(228, 252, 255, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(252, 255, 255, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(255, 255, 255, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(255, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, 63.75);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '65', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(65);

            initialData.push(0, 0, 0, 255);
            expectedData.push(166, 166, 166, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(255, 255, 255, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(166, 166, 191, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(166, 191, 216, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(191, 216, 241, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(216, 241, 255, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(241, 255, 255, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(255, 255, 255, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(255, 255, 255, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(255, 255, 255, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(255, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(luminanceEffect_.halfBrightness, 82.875);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '100', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(100);

            initialData.push(0, 0, 0, 255);
            expectedData.push(255, 255, 255, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(255, 255, 255, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(255, 255, 255, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(255, 255, 255, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(255, 255, 255, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(255, 255, 255, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(255, 255, 255, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(255, 255, 255, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(255, 255, 255, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(255, 255, 255, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(255, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, 127.5);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '-18', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(-18);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(81, 81, 81, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(209, 209, 209, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 4, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 4, 29, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(4, 29, 54, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(29, 54, 79, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(54, 79, 104, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(79, 104, 129, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(104, 129, 154, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(129, 154, 179, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(154, 179, 204, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(179, 204, 209, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(204, 209, 209, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, -22.95);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '-50', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(-50);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(0, 0, 0, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(128, 128, 128, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 0, 0, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(0, 0, 0, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(0, 0, 0, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(0, 0, 22, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(0, 22, 48, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(22, 48, 72, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(48, 72, 98, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(72, 98, 122, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(98, 122, 128, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(122, 128, 128, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, -63.75);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '-100', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(-100);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(0, 0, 0, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(0, 0, 0, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 0, 0, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(0, 0, 0, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(0, 0, 0, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(0, 0, 0, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(0, 0, 0, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(0, 0, 0, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(0, 0, 0, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(0, 0, 0, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(0, 0, 0, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(0, 0, 0, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, -127.5);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when contrast is 0',
          function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(null, 0);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(127, 127, 127, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 25, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 25, 50, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(25, 50, 75, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(50, 75, 100, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(75, 100, 125, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(100, 125, 150, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(125, 150, 175, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(150, 175, 200, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(175, 200, 225, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(200, 225, 250, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(225, 250, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(250, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.isNull(luminanceEffect_.k);
            assert.isNull(luminanceEffect_.b);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when contrast is ' +
          '50', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(null, 50);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(127, 127, 127, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 0, 23, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(0, 23, 73, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(23, 73, 123, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(73, 123, 172, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(123, 172, 222, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(172, 222, 255, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(222, 255, 255, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(255, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.k, 1.9921875);
            assert.strictEqual(luminanceEffect_.b, -126.50390625);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when contrast is ' +
          '65', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(null, 65);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(126, 126, 126, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 0, 0, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(0, 0, 49, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(0, 49, 120, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(49, 120, 191, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(120, 191, 255, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(191, 255, 255, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(255, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(luminanceEffect_.k, 2.836484983314794);
            assert.strictEqual(luminanceEffect_.b, -234.15183537263624);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when contrast is ' +
          '100', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(null, 100);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(0, 0, 0, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 0, 0, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(0, 0, 0, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(0, 0, 0, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(0, 0, 255, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(0, 255, 255, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(255, 255, 255, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(255, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.k, 255);
            assert.strictEqual(luminanceEffect_.b, -32385);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when contrast is ' +
          '-18', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(null, -18);

            initialData.push(0, 0, 0, 255);
            expectedData.push(23, 23, 23, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(127, 127, 127, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(232, 232, 232, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(23, 23, 43, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(23, 43, 64, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(43, 64, 84, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(64, 84, 105, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(84, 105, 125, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(105, 125, 146, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(125, 146, 166, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(146, 166, 187, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(166, 187, 208, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(187, 208, 228, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(208, 228, 232, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(228, 232, 232, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.k, 0.8207058823529412);
            assert.strictEqual(luminanceEffect_.b, 22.86);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when contrast is ' +
          '-50', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(null, -50);

            initialData.push(0, 0, 0, 255);
            expectedData.push(64, 64, 64, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(127, 127, 127, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(192, 192, 192, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(64, 64, 76, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(64, 76, 89, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(76, 89, 101, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(89, 101, 114, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(101, 114, 126, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(114, 126, 139, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(126, 139, 151, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(139, 151, 164, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(151, 164, 176, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(164, 176, 189, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(176, 189, 192, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(189, 192, 192, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.k, 0.5019607843137255);
            assert.strictEqual(luminanceEffect_.b, 63.5);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when contrast is ' +
          '-100', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(null, -100);

            initialData.push(0, 0, 0, 255);
            expectedData.push(127, 127, 127, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(127, 127, 127, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(128, 128, 128, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(127, 127, 127, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(127, 127, 127, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(127, 127, 127, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(127, 127, 127, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(127, 127, 127, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(127, 127, 128, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(127, 128, 128, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(128, 128, 128, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(128, 128, 128, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(128, 128, 128, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(128, 128, 128, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(128, 128, 128, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.k, 0.00392156862745098);
            assert.strictEqual(luminanceEffect_.b, 127);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '0 and contrast is 0', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(0, 0);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(127, 127, 127, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 25, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 25, 50, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(25, 50, 75, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(50, 75, 100, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(75, 100, 125, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(100, 125, 150, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(125, 150, 175, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(150, 175, 200, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(175, 200, 225, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(200, 225, 250, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(225, 250, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(250, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.isNull(luminanceEffect_.halfBrightness);
            assert.isNull(luminanceEffect_.k);
            assert.isNull(luminanceEffect_.b);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '25 and contrast is 25', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(25, 25);

            initialData.push(0, 0, 0, 255);
            expectedData.push(32, 32, 32, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(201, 201, 201, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(32, 32, 65, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(32, 65, 99, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(65, 99, 132, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(99, 132, 165, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(132, 165, 198, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(165, 198, 232, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(198, 232, 255, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(232, 255, 255, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(255, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, 31.875);
            assert.strictEqual(luminanceEffect_.k, 1.3315926892950392);
            assert.strictEqual(luminanceEffect_.b, -42.278067885117494);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '100 and contrast is also 100', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(100, 100);

            initialData.push(0, 0, 0, 255);
            expectedData.push(255, 255, 255, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(255, 255, 255, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(255, 255, 255, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(255, 255, 255, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(255, 255, 255, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(255, 255, 255, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(255, 255, 255, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(255, 255, 255, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(255, 255, 255, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(255, 255, 255, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(255, 255, 255, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(255, 255, 255, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, 127.5);
            assert.strictEqual(luminanceEffect_.k, 255);
            assert.strictEqual(luminanceEffect_.b, -32385);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '-75 and contrast is -75', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(-75, -75);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(8, 8, 8, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(40, 40, 40, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 0, 0, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(0, 0, 1, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(0, 1, 7, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(1, 7, 13, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(7, 13, 20, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(13, 20, 26, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(20, 26, 32, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(26, 32, 39, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(32, 39, 40, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(39, 40, 40, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, -95.625);
            assert.strictEqual(luminanceEffect_.k, 0.2529411764705882);
            assert.strictEqual(luminanceEffect_.b, 95.25);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '-100 and contrast is -100', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(-100, -100);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(0, 0, 0, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(0, 0, 0, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 0, 0, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(0, 0, 0, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(0, 0, 0, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(0, 0, 0, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(0, 0, 0, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(0, 0, 0, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(0, 0, 0, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(0, 0, 0, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(0, 0, 0, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(0, 0, 0, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, -127.5);
            assert.strictEqual(luminanceEffect_.k, 0.00392156862745098);
            assert.strictEqual(luminanceEffect_.b, 127);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '25 and contrast is -75', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(25, -75);

            initialData.push(0, 0, 0, 255);
            expectedData.push(135, 135, 135, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(167, 167, 167, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(200, 200, 200, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(135, 135, 142, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(135, 142, 148, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(142, 148, 154, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(148, 154, 160, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(154, 160, 167, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(160, 167, 173, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(167, 173, 179, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(173, 179, 186, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(179, 186, 192, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(186, 192, 198, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(192, 198, 200, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(198, 200, 200, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, 31.875);
            assert.strictEqual(luminanceEffect_.k, 0.2529411764705882);
            assert.strictEqual(luminanceEffect_.b, 95.25);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when brightness is ' +
          '-75 and contrast is 25', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            luminanceEffect_ = new LuminanceEffect(-75, 25);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(0, 0, 0, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(74, 74, 74, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(0, 0, 0, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(0, 0, 0, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(0, 0, 0, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(0, 0, 0, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(0, 0, 0, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(0, 0, 1, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(0, 1, 34, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(1, 34, 68, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(34, 68, 74, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(68, 74, 74, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = luminanceEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(luminanceEffect_.halfBrightness, -95.625);
            assert.strictEqual(luminanceEffect_.k, 1.3315926892950392);
            assert.strictEqual(luminanceEffect_.b, -42.278067885117494);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });
    });
  });
});
