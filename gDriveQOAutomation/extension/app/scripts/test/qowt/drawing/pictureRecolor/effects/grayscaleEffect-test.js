
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/drawing/pictureRecolor/effects/grayscaleEffect',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'
], function(BaseRecolorEffect,
            GrayscaleEffect,
            QowtSilentError,
            ErrorCatcher) {

  'use strict';

  describe('Grayscale Recolor Effect Test', function() {

    beforeEach(function() {
      sinon.stub(ErrorCatcher, 'handleError');
    });

    afterEach(function() {
      ErrorCatcher.handleError.restore();
    });

    describe('test object construction', function() {
      it('should properly create a grayscale effect object', function() {
        var effect = new GrayscaleEffect();

        // test effect object's instantiation
        assert.isDefined(effect);
        assert.instanceOf(effect, GrayscaleEffect);

        // test effect object's instantiation
        assert.isDefined(effect.name);
        assert.isTrue(effect.hasOwnProperty('name'));
        assert.strictEqual(effect.name, 'grayscale');

        // test effect object's hierarchy
        var effectPrototype = GrayscaleEffect.prototype;
        assert.instanceOf(effectPrototype, BaseRecolorEffect);

        // test grayscale effect object's prototype methods - 'apply'
        assert.isDefined(effect.apply);
        assert.isFunction(effect.apply);
        assert.notStrictEqual(effect.apply, BaseRecolorEffect.prototype.apply);
        assert.deepEqual(effect.apply, effectPrototype.apply);

        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });
    });

    describe('test "apply" API', function() {
      var grayscaleEffect_;

      beforeEach(function() {
        grayscaleEffect_ = new GrayscaleEffect();
      });

      afterEach(function() {
        grayscaleEffect_ = undefined;
      });

      it('should not process/apply if image data isn\'t passed', function() {
        assert.isFalse(grayscaleEffect_.apply());
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should not process/apply if image data is empty', function() {
        assert.isFalse(grayscaleEffect_.apply([]));
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should log message when image data is not an instance of ' +
          '"Uint8ClampedArray"', function() {
            var imageData = [0, 127, 255, 1],
                returnValue;

            returnValue = grayscaleEffect_.apply(imageData);

            assert.isTrue(returnValue);
            assert.deepEqual(imageData, [109.2413, 109.2413, 109.2413, 1]);
            assert.isTrue(ErrorCatcher.handleError.calledOnce);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                new QowtSilentError('GrayscaleEffect: Image ' +
                'data isn\'t a Uint8ClampedArray. The result color channel ' +
                'values may be fractional and may spill off 0 - 255 value ' +
                'boundaries!'));
          });

      it('should skip processing of transparent pixels', function() {
        var imageData = new Uint8ClampedArray([0, 127, 255, 0]),
            expectedImageData = new Uint8ClampedArray([0, 127, 255, 0]),
            returnValue;

        returnValue = grayscaleEffect_.apply(imageData);

        assert.isTrue(returnValue);
        assert.deepEqual(imageData, expectedImageData);
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });

      it('should process correctly on set of pixel values', function() {
        var initialData = [],
            expectedData = [],
            initialImageData,
            expectedImageData,
            returnValue;

        initialData.push(0, 0, 0, 1);
        expectedData.push(0, 0, 0, 1);

        initialData.push(127, 127, 127, 1);
        expectedData.push(127, 127, 127, 1);

        initialData.push(255, 255, 255, 1);
        expectedData.push(255, 255, 255, 1);

        initialData.push(0, 127, 255, 1);
        expectedData.push(109, 109, 109, 1);

        initialData.push(0, 127, 255, 1);
        expectedData.push(109, 109, 109, 1);

        initialData.push(0, 127, 255, 1);
        expectedData.push(109, 109, 109, 1);

        initialData.push(0, 127, 255, 1);
        expectedData.push(109, 109, 109, 1);

        initialData.push(0, 127, 255, 1);
        expectedData.push(109, 109, 109, 1);

        initialData.push(0, 127, 255, 1);
        expectedData.push(109, 109, 109, 1);

        initialData.push(0, 127, 255, 1);
        expectedData.push(109, 109, 109, 1);

        initialImageData = new Uint8ClampedArray(initialData);
        expectedImageData = new Uint8ClampedArray(expectedData);

        returnValue = grayscaleEffect_.apply(initialImageData);

        assert.isTrue(returnValue);
        assert.deepEqual(initialImageData, expectedImageData);
        assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
      });
    });
  });
});
