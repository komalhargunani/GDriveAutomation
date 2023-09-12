
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/errorCatcher'
], function(BaseRecolorEffect, QowtException, ErrorCatcher) {

  'use strict';

  describe('Base Recolor Effect Test', function() {

    beforeEach(function() {
      sinon.stub(ErrorCatcher, 'handleError');
    });

    afterEach(function() {
      ErrorCatcher.handleError.restore();
    });

    it('should properly create an effect object although with un-overriden' +
        ' methods', function() {
          var effectName = 'someName',
              effect = new BaseRecolorEffect(effectName),
              returnValue;

          // test effect object's instantiation
          assert.isDefined(effect);
          assert.instanceOf(effect, BaseRecolorEffect);
          assert.strictEqual(ErrorCatcher.handleError.callCount, 0);

          // test effect object's instantiation
          assert.property(effect, 'name');
          assert.isDefined(effect.name);
          assert.strictEqual(effect.name, effectName);

          // test effect object's hierarchy
          var effectPrototype = BaseRecolorEffect.prototype;
          assert.instanceOf(effectPrototype, Object);

          // test effect object's prototype method - 'apply'
          assert.isDefined(effect.apply);
          assert.isFunction(effect.apply);
          assert.strictEqual(effect.apply, effectPrototype.apply);

          // test 'apply' api execution and return value
          returnValue = effect.apply();
          assert.isFalse(returnValue);

          assert.isTrue(ErrorCatcher.handleError.calledOnce);
          assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
              new QowtException('Recolor Effect didn\'t apply!'));
        });

    it('should raise error when an effect object is created without a name',
        function() {
          var effect = new BaseRecolorEffect(),
              returnValue;

          // test effect object's instantiation
          assert.isDefined(effect);
          assert.instanceOf(effect, BaseRecolorEffect);
          assert.isTrue(ErrorCatcher.handleError.calledOnce);
          assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
              new QowtException('Effect being created with a missing or an ' +
                  'invalid name.'));

          // test effect object's instantiation
          assert.isUndefined(effect.name);

          // test effect object's hierarchy
          var effectPrototype = BaseRecolorEffect.prototype;
          assert.instanceOf(effectPrototype, Object);

          // test effect object's prototype methods - 'apply'
          assert.isDefined(effect.apply);
          assert.isFunction(effect.apply);
          assert.strictEqual(effect.apply, effectPrototype.apply);

          // test 'apply' api execution and return value
          returnValue = effect.apply();
          assert.isFalse(returnValue);
          assert.isTrue(ErrorCatcher.handleError.calledTwice);
          assert.deepEqual(ErrorCatcher.handleError.secondCall.args[0],
              new QowtException('Recolor Effect didn\'t apply!'));
        });
  });
});
