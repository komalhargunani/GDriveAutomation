
define([
  'qowtRoot/drawing/pictureRecolor/recolorRequest',
  'qowtRoot/drawing/pictureRecolor/effects/grayscaleEffect',
  'qowtRoot/drawing/pictureRecolor/effects/duotoneEffect',
  'qowtRoot/drawing/pictureRecolor/effects/luminanceEffect',
  'qowtRoot/drawing/pictureRecolor/effects/biLevelEffect',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/errorCatcher'
], function(RecolorRequest,
            GrayscaleEffect,
            DuotoneEffect,
            LuminanceEffect,
            BiLevelEffect,
            QowtSilentError,
            QowtException,
            ErrorCatcher) {

  'use strict';

  describe('Test RecolorRequest Object', function() {
    describe('test object construction', function() {
      it('should properly create a request object when constructor called',
          function() {
            var recolorRequest = new RecolorRequest();

            // test recolorRequest object's instantiation
            assert.isDefined(recolorRequest);
            assert.instanceOf(recolorRequest, RecolorRequest);

            // test recolorRequest object's instance methods - 'getAllEffects'
            // and 'addEffect'
            assert.isDefined(recolorRequest.getAllEffects);
            assert.property(recolorRequest, 'getAllEffects');
            assert.isFunction(recolorRequest.getAllEffects);

            assert.isDefined(recolorRequest.addEffect);
            assert.property(recolorRequest, 'addEffect');
            assert.isFunction(recolorRequest.addEffect);

            // test recolorRequest object's hierarchy
            var recolorRequestPrototype = RecolorRequest.prototype;
            assert.instanceOf(recolorRequestPrototype, Object);

            // test recolorRequest object's prototype methods -
            // 'hasRecoloringEffects' and 'apply'

            // test 'hasRecoloringEffects' api
            assert.isDefined(recolorRequest.hasRecoloringEffects);
            assert.isFunction(recolorRequest.hasRecoloringEffects);
            assert.strictEqual(recolorRequest.hasRecoloringEffects,
                recolorRequestPrototype.hasRecoloringEffects);

            // test 'apply' api
            assert.isDefined(recolorRequest.apply);
            assert.isFunction(recolorRequest.apply);
            assert.strictEqual(recolorRequest.apply, recolorRequestPrototype.
                apply);
          });
    });

    describe('test "addEffect" and "getAllEffects" API', function() {
      var recolorRequest_;

      beforeEach(function() {
        recolorRequest_ = new RecolorRequest();
      });
      afterEach(function() {
        recolorRequest_ = undefined;
      });

      it('should return empty effects array when initially invoked without ' +
          'adding any effects', function() {
            var addedEffects = recolorRequest_.getAllEffects();
            assert.isDefined(addedEffects);
            assert.isArray(addedEffects);
            assert.lengthOf(addedEffects, 0);
          });

      it('should be able to populate any effect that is of type ' +
          '\'BaseRecolorEffect\'', function() {
            var addedEffects = recolorRequest_.getAllEffects(),
                grayscaleEffect = new GrayscaleEffect();
            assert.isDefined(addedEffects);
            assert.isArray(addedEffects);
            assert.lengthOf(addedEffects, 0);

            recolorRequest_.addEffect(grayscaleEffect);

            assert.isDefined(addedEffects);
            assert.isArray(addedEffects);
            assert.lengthOf(addedEffects, 1);
            assert.strictEqual(addedEffects[0], grayscaleEffect);
          });

      it('should not be able to add any effect that is not of type ' +
          '\'BaseRecolorEffect\'', function() {
            var addedEffects = recolorRequest_.getAllEffects(),
                fakeEffect = {};

            sinon.stub(ErrorCatcher, 'handleError');

            assert.isDefined(addedEffects);
            assert.isArray(addedEffects);
            assert.lengthOf(addedEffects, 0);

            recolorRequest_.addEffect(fakeEffect);

            assert.isTrue(ErrorCatcher.handleError.calledOnce);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                new QowtException('RecolorRequest: Ignoring addition of ' +
                    'unknown effect to recolor request instance.'));

            assert.isDefined(addedEffects);
            assert.isArray(addedEffects);
            assert.lengthOf(addedEffects, 0);

            ErrorCatcher.handleError.restore();
          });

      it('should be able to add multiple effects', function() {
        var addedEffects = recolorRequest_.getAllEffects(),
            grayscaleEffect = new GrayscaleEffect(),
            biLevelEffect = new BiLevelEffect(10),
            duotoneEffect = new DuotoneEffect('rgba(10,20,30,1)',
                'rgba(110,120,230,0.3)'),
            luminanceEffect = new LuminanceEffect(50, -50);

        assert.isDefined(addedEffects);
        assert.lengthOf(addedEffects, 0);

        recolorRequest_.addEffect(grayscaleEffect);
        assert.isDefined(addedEffects);
        assert.lengthOf(addedEffects, 1);
        assert.strictEqual(addedEffects[0], grayscaleEffect);

        recolorRequest_.addEffect(biLevelEffect);
        assert.isDefined(addedEffects);
        assert.lengthOf(addedEffects, 2);
        assert.strictEqual(addedEffects[1], biLevelEffect);

        recolorRequest_.addEffect(duotoneEffect);
        assert.isDefined(addedEffects);
        assert.lengthOf(addedEffects, 3);
        assert.strictEqual(addedEffects[2], duotoneEffect);

        recolorRequest_.addEffect(luminanceEffect);
        assert.isDefined(addedEffects);
        assert.lengthOf(addedEffects, 4);
        assert.strictEqual(addedEffects[3], luminanceEffect);
      });

      it('should be able to add same effect multiple times', function() {
        var addedEffects = recolorRequest_.getAllEffects(),
            grayscaleEffect1 = new GrayscaleEffect(),
            grayscaleEffect2 = new GrayscaleEffect();

        assert.isDefined(addedEffects);
        assert.lengthOf(addedEffects, 0);

        recolorRequest_.addEffect(grayscaleEffect1);
        assert.isDefined(addedEffects);
        assert.lengthOf(addedEffects, 1);
        assert.strictEqual(addedEffects[0], grayscaleEffect1);

        recolorRequest_.addEffect(grayscaleEffect2);
        assert.isDefined(addedEffects);
        assert.lengthOf(addedEffects, 2);
        assert.strictEqual(addedEffects[1], grayscaleEffect2);
      });
    });

    describe('test "hasRecoloringEffects" API', function() {
      var recolorRequest_;

      beforeEach(function() {
        recolorRequest_ = new RecolorRequest();
      });
      afterEach(function() {
        recolorRequest_ = undefined;
      });

      it('should return false when no effects are added', function() {
        assert.isFalse(recolorRequest_.hasRecoloringEffects());
      });

      it('should return true when a valid effect is added', function() {
        recolorRequest_.addEffect(new GrayscaleEffect());

        assert.isTrue(recolorRequest_.hasRecoloringEffects());
      });

      it('should return false when an invalid effect is added', function() {
        recolorRequest_.addEffect({});

        assert.isFalse(recolorRequest_.hasRecoloringEffects());
      });
    });

    describe('test "apply" API', function() {
      var recolorRequest_;

      beforeEach(function() {
        recolorRequest_ = new RecolorRequest();
        sinon.stub(GrayscaleEffect.prototype, 'apply');
        sinon.stub(ErrorCatcher, 'handleError');
      });
      afterEach(function() {
        recolorRequest_ = undefined;
        GrayscaleEffect.prototype.apply.restore();
        ErrorCatcher.handleError.restore();
      });

      it('should not apply if imageData is not passed', function() {
        recolorRequest_.addEffect(new GrayscaleEffect());
        recolorRequest_.apply();

        assert.strictEqual(GrayscaleEffect.prototype.apply.callCount, 0);
        assert.isTrue(ErrorCatcher.handleError.calledOnce);
        assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
            new QowtSilentError('RecolorRequest: Cannot apply effects as ' +
                'either effects are unavailable or effect data is incomplete ' +
                'or image data is missing!'));
      });

      it('should not apply if imageData is empty', function() {
        recolorRequest_.addEffect(new GrayscaleEffect());
        recolorRequest_.apply([]);

        assert.strictEqual(GrayscaleEffect.prototype.apply.callCount, 0);
        assert.isTrue(ErrorCatcher.handleError.calledOnce);
        assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
            new QowtSilentError('RecolorRequest: Cannot apply effects as ' +
                'either effects are unavailable or effect data is incomplete ' +
                'or image data is missing!'));
      });

      it('should not apply if there are no effects available in request',
          function() {
            recolorRequest_.apply();

            assert.isTrue(ErrorCatcher.handleError.calledOnce);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                new QowtSilentError('RecolorRequest: Cannot apply effects as ' +
                    'either effects are unavailable or effect data is ' +
                    'incomplete or image data is missing!'));
          });

      it('should apply for an effect in request which has complete data',
          function() {
            sinon.stub(DuotoneEffect.prototype, 'apply');

            var imageData = [25, 35, 155, 1];
            recolorRequest_.addEffect(new GrayscaleEffect());
            recolorRequest_.addEffect(new DuotoneEffect('rgba(10,20,30,1)',
                'rgba(65,158,96,0)'));

            recolorRequest_.apply(imageData);

            assert.isTrue(GrayscaleEffect.prototype.apply.calledOnce);
            assert.deepEqual(GrayscaleEffect.prototype.apply.firstCall.args[0],
                imageData);
            assert.isTrue(DuotoneEffect.prototype.apply.calledOnce);
            assert.deepEqual(DuotoneEffect.prototype.apply.firstCall.args[0],
                imageData);

            DuotoneEffect.prototype.apply.restore();
          });
    });
  });
});
