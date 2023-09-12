define([
  'qowtRoot/dcp/decorators/shapeEffectsDecorator',
  'qowtRoot/drawing/color/colorUtility'
], function(
            ShapeEffectsDecorator,
            ColorUtility) {

  'use strict';

  describe('Shape Effects Decorator Test', function() {
    var _shapeEffectsDecorator = ShapeEffectsDecorator.create();
    var _effectsBean, _shadowJSON;

    describe(' with shadow ', function() {
      beforeEach(function() {
        _effectsBean = {
          delta: {
            x: 50,
            y: 50
          },
          blurRad: 50,
          clr: 'red'
        };
        _shadowJSON = 'some shadow';
        spyOn(_shapeEffectsDecorator, 'computeShadowEffects').andReturn(
            _effectsBean);
      });

      it('should compute shadow effects', function() {
        _shapeEffectsDecorator.withShadow(_shadowJSON);
        expect(_shapeEffectsDecorator.computeShadowEffects).
            toHaveBeenCalledWith(_shadowJSON);
      });

      it('should return proper style for shadow', function() {
        var expectedStyle = {
          '-webkit-box-shadow': '50pt 50pt 50px red'
        };
        var style = _shapeEffectsDecorator.withShadow(_shadowJSON);
        expect(style).toEqual(expectedStyle);
      });
    });

    describe(' compute Shadow Effects ', function() {
      var _shadowEffectJSON, _effectsBean;
      beforeEach(function() {
        _shadowEffectJSON = {
          type: 'outerShadow',
          clr: undefined,
          blurRad: 50,
          delta: {
            x: 0,
            y: 0
          }
        };
        _effectsBean = undefined;
      });

      it('should return proper values when shadow effect JSON is undefined',
          function() {
            var expectedEffectsBean = {
              type: undefined,
              clr: undefined,
              blurRad: 0,
              delta: {
                x: 0,
                y: 0
              }
            };
            _shadowJSON = undefined;
            _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
                _shadowJSON);
            expect(_effectsBean).toEqual(expectedEffectsBean);
          });

      it('should return proper shadow type', function() {
        _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
            _shadowEffectJSON);
        expect(_effectsBean.type).toEqual(_shadowEffectJSON.type);
      });

      it('should return proper shadow blur radius when it is defined',
          function() {
            _shadowEffectJSON.blurRad = 914400;
            _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
                _shadowEffectJSON);
            expect(_effectsBean.blurRad).toEqual(96);
          });

      it('should return proper shadow blur radius when it is undefined',
          function() {
            _shadowEffectJSON.blurRad = undefined;
            _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
                _shadowEffectJSON);
            expect(_effectsBean.blurRad).toEqual(0);
          });

      it('should return proper shadow color when it is defined', function() {
        _shadowEffectJSON.color = {
          type: 'srgbClr',
          clr: '#ff0000'
        };

        _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
            _shadowEffectJSON);
        expect(_effectsBean.clr).toEqual('rgba(255,0,0,1)');
      });

      it('should call getColor for shadow color when it is defined',
          function() {
            _shadowEffectJSON.color = {
              type: 'srgbClr',
              clr: '#ff0000'
            };

            spyOn(ColorUtility, 'getColor');
            _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
                _shadowEffectJSON);
            expect(ColorUtility.getColor).toHaveBeenCalledWith(
                _shadowEffectJSON.color);
          });

      it('should return proper shadow color when it is undefined', function() {
        _shadowEffectJSON.color = undefined;
        _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
            _shadowEffectJSON);
        expect(_effectsBean.clr).toEqual(undefined);
      });

      it('should return proper shadow offsets when distance is defined',
          function() {
            _shadowEffectJSON.dist = 914400;
            _effectsBean =
                _shapeEffectsDecorator.computeShadowEffects(_shadowEffectJSON);
            expect(_effectsBean.delta.x).toEqual(72);
            expect(_effectsBean.delta.y).toEqual(0);
          });

      it('should return proper shadow offsets when distance is undefined',
          function() {
            _shadowEffectJSON.dist = undefined;
            _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
                _shadowEffectJSON);
            expect(_effectsBean.delta.x).toEqual(0);
            expect(_effectsBean.delta.y).toEqual(0);
          });

      it('should return proper shadow offsets when angle is defined',
          function() {
            _shadowEffectJSON.dist = 914400;
            _shadowEffectJSON.dir = 3000000;
            _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
                _shadowEffectJSON);
            expect(_effectsBean.delta.x).toEqual(46);
            expect(_effectsBean.delta.y).toEqual(55);
          });

      it('should return proper shadow offsets when angle is undefined',
          function() {
            _shadowEffectJSON.dist = 914400;
            _shadowEffectJSON.dir = undefined;
            _effectsBean = _shapeEffectsDecorator.computeShadowEffects(
                _shadowEffectJSON);
            expect(_effectsBean.delta.x).toEqual(72);
            expect(_effectsBean.delta.y).toEqual(0);
          });
    });

    describe(' with Redundant Effects ', function() {
      var _targetDiv = {
        style: {}
      };
      var _expectedStyle = {
        '-webkit-box-shadow': 'none',
        '-webkit-box-reflect': 'none'
      };
      var _isHighLevelEffect = true;

      it('should not add any redundant style when effect list is undefined',
          function() {
            var style = _shapeEffectsDecorator.withRedundantEffects(
                _targetDiv, undefined, _isHighLevelEffect);
            expect(style).toEqual({});
          });

      it('should add proper redundant effect styles when effect list is empty',
          function() {
            _isHighLevelEffect = undefined;
            var effectList = {};
            var style = _shapeEffectsDecorator.withRedundantEffects(
                _targetDiv, effectList, _isHighLevelEffect);
            expect(style).toEqual(_expectedStyle);
          });

      it('should remove redundant high level effects', function() {
        _expectedStyle = {'-webkit-box-reflect': 'none'};
        _isHighLevelEffect = true;
        var effectList = {refnEff: undefined};
        var style = _shapeEffectsDecorator.withRedundantEffects(_targetDiv,
            effectList, _isHighLevelEffect);
        expect(style).toEqual(_expectedStyle);
      });

      it('should remove redundant low level effects', function() {
        _expectedStyle = {'-webkit-box-shadow': 'none'};
        _isHighLevelEffect = false;
        var effectList = {outSdwEff: undefined};
        var style = _shapeEffectsDecorator.withRedundantEffects(_targetDiv,
            effectList, _isHighLevelEffect);
        expect(style).toEqual(_expectedStyle);
      });
    });
  });
});
