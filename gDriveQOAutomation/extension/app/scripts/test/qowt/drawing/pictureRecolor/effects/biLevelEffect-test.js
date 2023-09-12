
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/drawing/pictureRecolor/effects/biLevelEffect',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'
], function(BaseRecolorEffect,
            BiLevelEffect,
            QowtSilentError,
            ErrorCatcher) {

  'use strict';

  describe('Bi-Level Recolor Effect Test', function() {

    beforeEach(function() {
      sinon.stub(ErrorCatcher, 'handleError');
    });

    afterEach(function() {
      ErrorCatcher.handleError.restore();
    });

    describe('test object construction', function() {
      it('should properly create a biLevel effect object with default ' +
          'threshold when threshold not provided at instantiation', function() {
            // Effect instantiated without any threshold
            var effect = new BiLevelEffect();

            // test effect object's instantiation
            assert.isDefined(effect);
            assert.instanceOf(effect, BiLevelEffect);

            // test effect object's instantiation
            assert.isDefined(effect.name);
            assert.isTrue(effect.hasOwnProperty('name'));
            assert.strictEqual(effect.name, 'biLevel');

            assert.isDefined(effect.thresh);
            assert.isTrue(effect.hasOwnProperty('thresh'));
            assert.strictEqual(effect.thresh, 127.5);

            // test effect object's hierarchy
            var effectPrototype = BiLevelEffect.prototype;
            assert.instanceOf(effectPrototype, BaseRecolorEffect);

            // test bi-level effect object's prototype method - 'apply'
            assert.isDefined(effect.apply);
            assert.isFunction(effect.apply);
            assert.notStrictEqual(effect.apply, BaseRecolorEffect.prototype.
                apply);
            assert.strictEqual(effect.apply, effectPrototype.apply);

            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should properly instantiate a biLevel effect object with ' +
          'valid thresholds when supplied threshold is in valid range of ' +
          '0 - 100', function() {
            var effect = new BiLevelEffect(0);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 0);

            effect = new BiLevelEffect(10);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 25.5);

            effect = new BiLevelEffect(25);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 63.75);

            effect = new BiLevelEffect(50);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 127.5);

            effect = new BiLevelEffect(55);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 140.25);

            effect = new BiLevelEffect(90);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 229.5);

            effect = new BiLevelEffect(99);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 252.45);

            effect = new BiLevelEffect(100);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 255);

            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should properly instantiate a biLevel effect object with ' +
          'valid threshold when supplied threshold is not in valid range of ' +
          '0 - 100', function() {
            var effect = new BiLevelEffect(-1);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 0);

            effect = new BiLevelEffect(101);
            assert.isDefined(effect.thresh);
            assert.strictEqual(effect.thresh, 255);

            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });
    });

    describe('test "apply" API', function() {
      var biLevelEffect_;

      beforeEach(function() {
        biLevelEffect_ = new BiLevelEffect();
      });

      afterEach(function() {
        biLevelEffect_ = undefined;
      });

      it('should not process/apply if image data isn\'t passed', function() {
        assert.isFalse(biLevelEffect_.apply());
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should not process/apply if image data is empty', function() {
        assert.isFalse(biLevelEffect_.apply([]));
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should log message when image data is not an instance of ' +
          '"Uint8ClampedArray"', function() {
            var imageData = [0, 127, 255, 1],
                returnValue;

            returnValue = biLevelEffect_.apply(imageData);

            assert.isTrue(returnValue);
            assert.deepEqual(imageData, [0, 0, 0, 1]);
            assert.isTrue(ErrorCatcher.handleError.calledOnce);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                new QowtSilentError('BiLevelEffect: Image ' +
                    'data isn\'t a Uint8ClampedArray. The result color ' +
                    'channel values may be fractional and may spill off 0 - ' +
                    '255 value boundaries!'));
          });

      it('should skip processing of transparent pixels', function() {
        var imageData = new Uint8ClampedArray([0, 127, 255, 0]),
            expectedImageData = new Uint8ClampedArray([0, 127, 255, 0]),
            returnValue;

        returnValue = biLevelEffect_.apply(imageData);

        assert.isTrue(returnValue);
        assert.deepEqual(imageData, expectedImageData);
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should process correctly on set of pixel values when threshold is 0',
          function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            biLevelEffect_ = new BiLevelEffect(0);

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

            returnValue = biLevelEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when threshold is ' +
          '2', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            biLevelEffect_ = new BiLevelEffect(2);

            initialData.push(0, 0, 0, 10);
            expectedData.push(0, 0, 0, 10);

            initialData.push(127, 127, 127, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(255, 255, 255, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(1, 2, 5, 55);
            expectedData.push(0, 0, 0, 55);

            initialData.push(2, 5, 7, 70);
            expectedData.push(0, 0, 0, 70);

            initialData.push(0, 7, 1, 85);
            expectedData.push(0, 0, 0, 85);

            initialData.push(0, 7, 2, 86);
            expectedData.push(255, 255, 255, 86);

            initialData.push(0, 0, 25, 100);
            expectedData.push(0, 0, 0, 100);

            initialData.push(0, 25, 50, 115);
            expectedData.push(255, 255, 255, 115);

            initialData.push(25, 50, 75, 130);
            expectedData.push(255, 255, 255, 130);

            initialData.push(50, 75, 100, 145);
            expectedData.push(255, 255, 255, 145);

            initialData.push(75, 100, 125, 160);
            expectedData.push(255, 255, 255, 160);

            initialData.push(100, 125, 150, 175);
            expectedData.push(255, 255, 255, 175);

            initialData.push(125, 150, 175, 190);
            expectedData.push(255, 255, 255, 190);

            initialData.push(150, 175, 200, 205);
            expectedData.push(255, 255, 255, 205);

            initialData.push(175, 200, 225, 220);
            expectedData.push(255, 255, 255, 220);

            initialData.push(200, 225, 250, 235);
            expectedData.push(255, 255, 255, 235);

            initialData.push(225, 250, 255, 250);
            expectedData.push(255, 255, 255, 250);

            initialData.push(250, 255, 255, 255);
            expectedData.push(255, 255, 255, 255);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = biLevelEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when threshold is ' +
          '10', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            biLevelEffect_ = new BiLevelEffect(10);

            initialData.push(0, 0, 0, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(127, 127, 127, 240);
            expectedData.push(255, 255, 255, 240);

            initialData.push(255, 255, 255, 215);
            expectedData.push(255, 255, 255, 215);

            initialData.push(1, 2, 5, 200);
            expectedData.push(0, 0, 0, 200);

            initialData.push(2, 5, 7, 185);
            expectedData.push(0, 0, 0, 185);

            initialData.push(0, 7, 3, 170);
            expectedData.push(0, 0, 0, 170);

            initialData.push(8, 5, 7, 155);
            expectedData.push(0, 0, 0, 155);

            initialData.push(10, 12, 15, 140);
            expectedData.push(0, 0, 0, 140);

            initialData.push(10, 5, 18, 125);
            expectedData.push(0, 0, 0, 125);

            initialData.push(14, 10, 20, 110);
            expectedData.push(0, 0, 0, 110);

            initialData.push(0, 0, 25, 95);
            expectedData.push(0, 0, 0, 95);

            initialData.push(0, 25, 50, 80);
            expectedData.push(0, 0, 0, 80);

            initialData.push(25, 50, 75, 65);
            expectedData.push(255, 255, 255, 65);

            initialData.push(50, 75, 100, 50);
            expectedData.push(255, 255, 255, 50);

            initialData.push(75, 100, 125, 35);
            expectedData.push(255, 255, 255, 35);

            initialData.push(100, 125, 150, 20);
            expectedData.push(255, 255, 255, 20);

            initialData.push(125, 150, 175, 15);
            expectedData.push(255, 255, 255, 15);

            initialData.push(150, 175, 200, 1);
            expectedData.push(255, 255, 255, 1);

            initialData.push(175, 200, 225, 25);
            expectedData.push(255, 255, 255, 25);

            initialData.push(200, 225, 250, 40);
            expectedData.push(255, 255, 255, 40);

            initialData.push(225, 250, 255, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(250, 255, 255, 70);
            expectedData.push(255, 255, 255, 70);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = biLevelEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when threshold is ' +
          '25', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            biLevelEffect_ = new BiLevelEffect(25);

            initialData.push(0, 0, 0, 1);
            expectedData.push(0, 0, 0, 1);

            initialData.push(127, 127, 127, 255);
            expectedData.push(255, 255, 255, 255);

            initialData.push(255, 255, 255, 127);
            expectedData.push(255, 255, 255, 127);

            initialData.push(0, 0, 25, 10);
            expectedData.push(0, 0, 0, 10);

            initialData.push(0, 25, 50, 25);
            expectedData.push(0, 0, 0, 25);

            initialData.push(25, 50, 75, 40);
            expectedData.push(0, 0, 0, 40);

            initialData.push(50, 75, 100, 55);
            expectedData.push(255, 255, 255, 55);

            initialData.push(75, 100, 125, 70);
            expectedData.push(255, 255, 255, 70);

            initialData.push(100, 125, 150, 85);
            expectedData.push(255, 255, 255, 85);

            initialData.push(125, 150, 175, 100);
            expectedData.push(255, 255, 255, 100);

            initialData.push(150, 175, 200, 115);
            expectedData.push(255, 255, 255, 115);

            initialData.push(175, 200, 225, 130);
            expectedData.push(255, 255, 255, 130);

            initialData.push(200, 225, 250, 145);
            expectedData.push(255, 255, 255, 145);

            initialData.push(225, 250, 255, 160);
            expectedData.push(255, 255, 255, 160);

            initialData.push(250, 255, 255, 175);
            expectedData.push(255, 255, 255, 175);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = biLevelEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when threshold is ' +
          '50', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            biLevelEffect_ = new BiLevelEffect(50);

            initialData.push(0, 0, 0, 1);
            expectedData.push(0, 0, 0, 1);

            initialData.push(127, 127, 127, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(255, 255, 255, 127);
            expectedData.push(255, 255, 255, 127);

            initialData.push(0, 0, 25, 10);
            expectedData.push(0, 0, 0, 10);

            initialData.push(0, 25, 50, 25);
            expectedData.push(0, 0, 0, 25);

            initialData.push(25, 50, 75, 40);
            expectedData.push(0, 0, 0, 40);

            initialData.push(50, 75, 100, 55);
            expectedData.push(0, 0, 0, 55);

            initialData.push(75, 100, 125, 70);
            expectedData.push(0, 0, 0, 70);

            initialData.push(100, 125, 150, 85);
            expectedData.push(0, 0, 0, 85);

            initialData.push(125, 150, 175, 100);
            expectedData.push(255, 255, 255, 100);

            initialData.push(150, 175, 200, 115);
            expectedData.push(255, 255, 255, 115);

            initialData.push(175, 200, 225, 130);
            expectedData.push(255, 255, 255, 130);

            initialData.push(200, 225, 250, 145);
            expectedData.push(255, 255, 255, 145);

            initialData.push(225, 250, 255, 160);
            expectedData.push(255, 255, 255, 160);

            initialData.push(250, 255, 255, 175);
            expectedData.push(255, 255, 255, 175);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = biLevelEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when threshold is ' +
          '75', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            biLevelEffect_ = new BiLevelEffect(75);

            initialData.push(0, 0, 0, 1);
            expectedData.push(0, 0, 0, 1);

            initialData.push(127, 127, 127, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(255, 255, 255, 127);
            expectedData.push(255, 255, 255, 127);

            initialData.push(0, 0, 25, 10);
            expectedData.push(0, 0, 0, 10);

            initialData.push(0, 25, 50, 25);
            expectedData.push(0, 0, 0, 25);

            initialData.push(25, 50, 75, 40);
            expectedData.push(0, 0, 0, 40);

            initialData.push(50, 75, 100, 55);
            expectedData.push(0, 0, 0, 55);

            initialData.push(75, 100, 125, 70);
            expectedData.push(0, 0, 0, 70);

            initialData.push(100, 125, 150, 85);
            expectedData.push(0, 0, 0, 85);

            initialData.push(125, 150, 175, 100);
            expectedData.push(0, 0, 0, 100);

            initialData.push(150, 175, 200, 115);
            expectedData.push(0, 0, 0, 115);

            initialData.push(175, 200, 225, 130);
            expectedData.push(255, 255, 255, 130);

            initialData.push(200, 225, 250, 145);
            expectedData.push(255, 255, 255, 145);

            initialData.push(225, 250, 255, 160);
            expectedData.push(255, 255, 255, 160);

            initialData.push(250, 255, 255, 175);
            expectedData.push(255, 255, 255, 175);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = biLevelEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when threshold is ' +
          '95', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            biLevelEffect_ = new BiLevelEffect(95);

            initialData.push(0, 0, 0, 1);
            expectedData.push(0, 0, 0, 1);

            initialData.push(127, 127, 127, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(255, 255, 255, 127);
            expectedData.push(255, 255, 255, 127);

            initialData.push(0, 0, 25, 10);
            expectedData.push(0, 0, 0, 10);

            initialData.push(0, 25, 50, 25);
            expectedData.push(0, 0, 0, 25);

            initialData.push(25, 50, 75, 40);
            expectedData.push(0, 0, 0, 40);

            initialData.push(50, 75, 100, 55);
            expectedData.push(0, 0, 0, 55);

            initialData.push(75, 100, 125, 70);
            expectedData.push(0, 0, 0, 70);

            initialData.push(100, 125, 150, 85);
            expectedData.push(0, 0, 0, 85);

            initialData.push(125, 150, 175, 100);
            expectedData.push(0, 0, 0, 100);

            initialData.push(150, 175, 200, 115);
            expectedData.push(0, 0, 0, 115);

            initialData.push(175, 200, 225, 130);
            expectedData.push(0, 0, 0, 130);

            initialData.push(200, 225, 250, 145);
            expectedData.push(0, 0, 0, 145);

            initialData.push(225, 250, 255, 160);
            expectedData.push(255, 255, 255, 160);

            initialData.push(250, 255, 255, 175);
            expectedData.push(255, 255, 255, 175);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = biLevelEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should process correctly on set of pixel values when threshold is ' +
          '100', function() {
            var initialData = [],
                expectedData = [],
                initialImageData,
                expectedImageData,
                returnValue;

            biLevelEffect_ = new BiLevelEffect(100);

            initialData.push(0, 0, 0, 1);
            expectedData.push(0, 0, 0, 1);

            initialData.push(127, 127, 127, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(255, 255, 255, 127);
            expectedData.push(255, 255, 255, 127);

            initialData.push(0, 0, 25, 255);
            expectedData.push(0, 0, 0, 255);

            initialData.push(0, 25, 50, 240);
            expectedData.push(0, 0, 0, 240);

            initialData.push(25, 50, 75, 225);
            expectedData.push(0, 0, 0, 225);

            initialData.push(50, 75, 100, 210);
            expectedData.push(0, 0, 0, 210);

            initialData.push(75, 100, 125, 195);
            expectedData.push(0, 0, 0, 195);

            initialData.push(100, 125, 150, 180);
            expectedData.push(0, 0, 0, 180);

            initialData.push(125, 150, 175, 165);
            expectedData.push(0, 0, 0, 165);

            initialData.push(150, 175, 200, 140);
            expectedData.push(0, 0, 0, 140);

            initialData.push(175, 200, 225, 125);
            expectedData.push(0, 0, 0, 125);

            initialData.push(200, 225, 250, 110);
            expectedData.push(0, 0, 0, 110);

            initialData.push(225, 250, 255, 95);
            expectedData.push(0, 0, 0, 95);

            initialData.push(250, 255, 255, 80);
            expectedData.push(0, 0, 0, 80);


            initialImageData = new Uint8ClampedArray(initialData);
            expectedImageData = new Uint8ClampedArray(expectedData);

            returnValue = biLevelEffect_.apply(initialImageData);

            assert.isTrue(returnValue);
            assert.deepEqual(initialImageData, expectedImageData);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });
    });
  });
});
