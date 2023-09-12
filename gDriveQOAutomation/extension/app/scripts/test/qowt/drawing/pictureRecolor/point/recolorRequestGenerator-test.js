
define([
  'qowtRoot/drawing/pictureRecolor/point/recolorRequestGenerator',
  'qowtRoot/drawing/pictureRecolor/recolorRequest',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointDuotoneEffect',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointLuminanceEffect',
  'qowtRoot/drawing/pictureRecolor/effects/grayscaleEffect',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointBiLevelEffect',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'
], function(RecolorRequestGenerator,
            RecolorRequest,
            PointDuotoneEffect,
            PointLuminanceEffect,
            GrayscaleEffect,
            PointBiLevelEffect,
            QowtSilentError,
            ErrorCatcher) {

  'use strict';

  describe('Recolor Request Generator Test', function() {
    describe('test "generate" API', function() {
      beforeEach(function() {
        sinon.stub(ErrorCatcher, 'handleError');
      });

      afterEach(function() {
        ErrorCatcher.handleError.restore();
      });

      it('should correctly generate a recolor request when passed a valid ' +
          'effects DCP json', function() {

            var blipJson = {
              effects: [{
                type: 'duotone',
                color1: {
                  type: 'prstClr',
                  val: 'black'
                },
                color2: {
                  clr: '#eadfd1',
                  effects: [{
                    name: 'alpha',
                    value: 100000
                  }],
                  type: 'srgbClr'
                }
              }, {
                bright: 50000,
                contrast: 50000,
                type: 'lum'
              }, {
                thresh: 50000,
                type: 'biLevel'
              }, {
                type: 'grayscl'
              }]
            },
                recolorRequest,
                allEffects,
                effect;

            assert.isDefined(RecolorRequestGenerator.generate);
            assert.isFunction(RecolorRequestGenerator.generate);

            recolorRequest = RecolorRequestGenerator.generate(blipJson);

            assert.isDefined(recolorRequest);
            assert.instanceOf(recolorRequest, RecolorRequest);
            assert.isTrue(recolorRequest.hasRecoloringEffects());

            allEffects = recolorRequest.getAllEffects();
            assert.isDefined(allEffects);
            assert.strictEqual(allEffects.length, 4);

            effect = allEffects[0];
            assert.isDefined(effect);
            assert.instanceOf(effect, PointDuotoneEffect);

            effect = allEffects[1];
            assert.isDefined(effect);
            assert.instanceOf(effect, PointLuminanceEffect);
            assert.strictEqual(effect.bright, 50);
            assert.strictEqual(effect.contrast, 50);

            effect = allEffects[2];
            assert.isDefined(effect);
            assert.instanceOf(effect, PointBiLevelEffect);
            assert.strictEqual(effect.thresh, 127.5);

            effect = allEffects[3];
            assert.isDefined(effect);
            assert.instanceOf(effect, GrayscaleEffect);

            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should not create a recolor request object in case no effects are ' +
          ' supplied', function() {
            var recolorRequest = RecolorRequestGenerator.generate();
            assert.isNull(recolorRequest);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);

            recolorRequest = RecolorRequestGenerator.generate({});
            assert.isNull(recolorRequest);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);

            recolorRequest = RecolorRequestGenerator.generate({
              effects: undefined
            });
            assert.isNull(recolorRequest);
            assert.strictEqual(ErrorCatcher.handleError.callCount, 0);
          });

      it('should not generate a recolor request object when blip json is ' +
          'malformed', function() {
            var expectedError = new QowtSilentError('RecolorRequestGenerator:' +
                    ' Malformed DCP blip effects Json.'),
                recolorRequest;

            recolorRequest = RecolorRequestGenerator.generate({
              effects: 'asdasd'
            });
            assert.isNull(recolorRequest);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                expectedError);

            recolorRequest = RecolorRequestGenerator.generate({
              effects: {
                someProperty: 'someValue'
              }
            });
            assert.isNull(recolorRequest);
            assert.deepEqual(ErrorCatcher.handleError.secondCall.args[0],
                expectedError);
          });

      it('should log error when a blip json has an unknown effect', function() {
        var blipJson = {
          effects: [{
            type: 'someUnknownEffect'
          }]
        },
            recolorRequest;

        recolorRequest = RecolorRequestGenerator.generate(blipJson);

        assert.isDefined(recolorRequest);
        assert.isFalse(recolorRequest.hasRecoloringEffects());
        assert.deepEqual(recolorRequest.getAllEffects(), []);
        assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
            new QowtSilentError('RecolorRequestGenerator: Unhandled recolor' +
                ' effect.'));
      });
    });
  });
});
