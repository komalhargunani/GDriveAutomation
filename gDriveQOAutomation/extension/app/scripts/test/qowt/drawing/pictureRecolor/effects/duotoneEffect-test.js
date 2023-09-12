
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/drawing/pictureRecolor/effects/duotoneEffect',
  'qowtRoot/drawing/pictureRecolor/color',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'
], function(BaseRecolorEffect,
            DuotoneEffect,
            Color,
            QowtSilentError,
            ErrorCatcher) {

  'use strict';

  describe('Duotone Recolor Effect Test', function() {
    describe('test object construction', function() {
      it('should properly create a duotone effect object', function() {
        // Effect instantiated without any threshold
        var effect = new DuotoneEffect();

        // test effect object's instantiation
        assert.isDefined(effect);
        assert.instanceOf(effect, DuotoneEffect);

        // test effect object's instantiation
        assert.isDefined(effect.name);
        assert.isTrue(effect.hasOwnProperty('name'));
        assert.strictEqual(effect.name, 'duotone');

        assert.isDefined(effect.firstColor);
        assert.isTrue(effect.hasOwnProperty('firstColor'));
        assert.deepEqual(effect.firstColor, new Color());

        assert.isDefined(effect.secondColor);
        assert.isTrue(effect.hasOwnProperty('secondColor'));
        assert.deepEqual(effect.secondColor, new Color());

        assert.isDefined(effect.computedColor);
        assert.isTrue(effect.hasOwnProperty('computedColor'));
        assert.isNull(effect.computedColor);

        // test effect object's hierarchy
        var effectPrototype = DuotoneEffect.prototype;
        assert.instanceOf(effectPrototype, BaseRecolorEffect);

        // test duotone effect object's prototype methods - 'apply' method -
        assert.isDefined(effect.apply);
        assert.isFunction(effect.apply);
        assert.notStrictEqual(effect.apply, BaseRecolorEffect.prototype.apply);
        assert.strictEqual(effect.apply, effectPrototype.apply);
      });

      it('should correctly instantiate instance properties of a duotone ' +
          'object when supplied with colors', function() {
            var effect = new DuotoneEffect(),
                emptyColor = new Color(),
                firstColorString = 'rgba(10,20,30,1)',
                secondColorString = 'rgba(0,127,255,1)',
                firstColor = new Color(firstColorString),
                secondColor = new Color(secondColorString);

            assert.deepEqual(effect.firstColor, emptyColor);
            assert.deepEqual(effect.secondColor, emptyColor);
            assert.isNull(effect.computedColor);

            effect = new DuotoneEffect(firstColorString);
            assert.deepEqual(effect.firstColor, firstColor);
            assert.deepEqual(effect.secondColor, emptyColor);
            assert.isNull(effect.computedColor);

            effect = new DuotoneEffect(undefined, secondColorString);
            assert.deepEqual(effect.firstColor, emptyColor);
            assert.deepEqual(effect.secondColor, secondColor);
            assert.isNull(effect.computedColor);

            effect = new DuotoneEffect(firstColorString, secondColorString);
            assert.deepEqual(effect.firstColor, firstColor);
            assert.deepEqual(effect.secondColor, secondColor);
            assert.isNull(effect.computedColor);

            // invalid color string tests
            effect = new DuotoneEffect({}, {});
            assert.deepEqual(effect.firstColor, emptyColor);
            assert.deepEqual(effect.secondColor, emptyColor);
            assert.isNull(effect.computedColor);

            effect = new DuotoneEffect('asdsad', 'qewrweew');
            assert.deepEqual(effect.firstColor, emptyColor);
            assert.deepEqual(effect.secondColor, emptyColor);
            assert.isNull(effect.computedColor);

            effect = new DuotoneEffect(123212, 5675762);
            assert.deepEqual(effect.firstColor, emptyColor);
            assert.deepEqual(effect.secondColor, emptyColor);
            assert.isNull(effect.computedColor);
          });
    });

    describe('test "apply" API', function() {
      var duotoneEffect_;

      beforeEach(function() {
        duotoneEffect_ = new DuotoneEffect('rgba(0,0,0,1)',
            'rgba(234,223,209,1)');
        sinon.stub(ErrorCatcher, 'handleError');
      });

      afterEach(function() {
        ErrorCatcher.handleError.restore();

        duotoneEffect_ = undefined;
      });

      it('should not process/apply if image data isn\'t passed', function() {
        assert.isFalse(duotoneEffect_.apply());
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should not process/apply if image data is empty', function() {
        assert.isFalse(duotoneEffect_.apply([]));
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should log message when image data is not an instance of ' +
          '"Uint8ClampedArray"', function() {
            var imageData = [0, 127, 255, 1],
                returnValue;

            returnValue = duotoneEffect_.apply(imageData);

            assert.isTrue(returnValue);
            assert.deepEqual(imageData, [
              100.24495764705881,
              95.53258784313725,
              89.5350262745098,
              1]);
            assert.isTrue(ErrorCatcher.handleError.calledOnce);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                new QowtSilentError('DuotoneEffect: Image ' +
                    'data isn\'t a Uint8ClampedArray. The result color ' +
                    'channel values may be fractional and may spill off 0 - ' +
                    '255 value boundaries!'));
          });

      it('should skip processing of transparent pixels', function() {
        var imageData = new Uint8ClampedArray([0, 127, 255, 0]),
            expectedImageData = new Uint8ClampedArray([0, 127, 255, 0]),
            returnValue;

        returnValue = duotoneEffect_.apply(imageData);

        assert.isTrue(returnValue);
        assert.deepEqual(imageData, expectedImageData);
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should process correctly on set of pixel values for given duotone ' +
          'colors combination for "sepia" effect', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            duotoneEffect_ = new DuotoneEffect('rgba(0,0,0,1)',
                'rgba(234,223,209,1)');

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 235);
            expectedData.push(117, 111, 104, 235);

            initialData.push(255, 255, 255, 210);
            expectedData.push(234, 223, 209, 210);

            initialData.push(0, 0, 25, 195);
            expectedData.push(2, 2, 1, 195);

            initialData.push(0, 25, 50, 180);
            expectedData.push(20, 19, 18, 180);

            initialData.push(25, 50, 75, 165);
            expectedData.push(43, 41, 38, 165);

            initialData.push(50, 75, 100, 150);
            expectedData.push(66, 63, 59, 150);

            initialData.push(75, 100, 125, 135);
            expectedData.push(89, 84, 79, 135);

            initialData.push(100, 125, 150, 110);
            expectedData.push(111, 106, 100, 110);

            initialData.push(125, 150, 175, 95);
            expectedData.push(134, 128, 120, 95);

            initialData.push(150, 175, 200, 70);
            expectedData.push(157, 150, 141, 70);

            initialData.push(175, 200, 225, 55);
            expectedData.push(180, 172, 161, 55);

            initialData.push(200, 225, 250, 40);
            expectedData.push(203, 194, 182, 40);

            initialData.push(225, 250, 255, 25);
            expectedData.push(225, 214, 201, 25);

            initialData.push(250, 255, 255, 10);
            expectedData.push(233, 222, 208, 10);

            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = duotoneEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(duotoneEffect_.computedColor.R,
                -0.9176470588235294);
            assert.strictEqual(duotoneEffect_.computedColor.G,
                -0.8745098039215686);
            assert.strictEqual(duotoneEffect_.computedColor.B,
                -0.8196078431372549);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values for a given duotone' +
          ' colors combination', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            duotoneEffect_ = new DuotoneEffect('rgba(0,0,0,1)',
                'rgba(174,202,255,1)');

            initialData.push(0, 0, 0, 10);
            expectedData.push(0, 0, 0, 10);

            initialData.push(127, 127, 127, 25);
            expectedData.push(87, 101, 127, 25);

            initialData.push(255, 255, 255, 40);
            expectedData.push(174, 202, 255, 40);

            initialData.push(0, 0, 25, 100);
            expectedData.push(1, 1, 2, 100);

            initialData.push(0, 25, 50, 115);
            expectedData.push(15, 17, 21, 115);

            initialData.push(25, 50, 75, 130);
            expectedData.push(32, 37, 46, 130);

            initialData.push(50, 75, 100, 145);
            expectedData.push(49, 57, 71, 145);

            initialData.push(75, 100, 125, 160);
            expectedData.push(66, 76, 96, 160);

            initialData.push(100, 125, 150, 175);
            expectedData.push(83, 96, 121, 175);

            initialData.push(125, 150, 175, 190);
            expectedData.push(100, 116, 146, 190);

            initialData.push(150, 175, 200, 205);
            expectedData.push(117, 136, 171, 205);

            initialData.push(175, 200, 225, 220);
            expectedData.push(134, 156, 196, 220);

            initialData.push(200, 225, 250, 235);
            expectedData.push(151, 175, 221, 235);

            initialData.push(225, 250, 255, 250);
            expectedData.push(167, 194, 245, 250);

            initialData.push(250, 255, 255, 255);
            expectedData.push(173, 201, 254, 255);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = duotoneEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(duotoneEffect_.computedColor.R,
                -0.6823529411764706);
            assert.strictEqual(duotoneEffect_.computedColor.G,
                -0.792156862745098);
            assert.strictEqual(duotoneEffect_.computedColor.B, -1);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values for another given ' +
          'duotone colors combination', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            duotoneEffect_ = new DuotoneEffect('rgba(36,39,148,1)',
                'rgba(255,255,255,1)');

            initialData.push(0, 0, 0, 255);
            expectedData.push(36, 39, 148, 255);

            initialData.push(127, 127, 127, 240);
            expectedData.push(145, 147, 201, 240);

            initialData.push(255, 255, 255, 215);
            expectedData.push(255, 255, 255, 215);

            initialData.push(0, 0, 25, 95);
            expectedData.push(38, 41, 149, 95);

            initialData.push(0, 25, 50, 80);
            expectedData.push(54, 57, 157, 80);

            initialData.push(25, 50, 75, 65);
            expectedData.push(76, 78, 168, 65);

            initialData.push(50, 75, 100, 50);
            expectedData.push(97, 100, 178, 50);

            initialData.push(75, 100, 125, 35);
            expectedData.push(119, 121, 188, 35);

            initialData.push(100, 125, 150, 20);
            expectedData.push(140, 142, 199, 20);

            initialData.push(125, 150, 175, 15);
            expectedData.push(162, 163, 209, 15);

            initialData.push(150, 175, 200, 1);
            expectedData.push(183, 184, 220, 1);

            initialData.push(175, 200, 225, 25);
            expectedData.push(205, 205, 230, 25);

            initialData.push(200, 225, 250, 40);
            expectedData.push(226, 227, 241, 40);

            initialData.push(225, 250, 255, 55);
            expectedData.push(246, 247, 251, 55);

            initialData.push(250, 255, 255, 70);
            expectedData.push(254, 254, 255, 70);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = duotoneEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.strictEqual(duotoneEffect_.computedColor.R,
                -0.8588235294117647);
            assert.strictEqual(duotoneEffect_.computedColor.G,
                -0.8470588235294118);
            assert.strictEqual(duotoneEffect_.computedColor.B,
                -0.4196078431372549);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });
    });
  });
});
