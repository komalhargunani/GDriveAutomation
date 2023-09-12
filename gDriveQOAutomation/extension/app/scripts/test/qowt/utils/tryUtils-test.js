/**
 * @fileoverview
 * Mocha based unit test for the try utility module.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/tryUtils'], function(
  TryUtils) {

  'use strict';

  describe('Try Utils.', function() {

    var val, incVal, incValBy, badFunc;

    beforeEach(function() {
      val = 1;
      incVal = function() {
        val++;
      };
      incValBy = function(a, b, c) {
        a = a || 0;
        b = b || 0;
        c = c || 0;
        val += (a+b+c);
        return val;
      };
      badFunc = function() {
        throw new Error('do something naughty');
      };
    });

    afterEach(function() {
      val = undefined;
      incVal = undefined;
      incValBy = undefined;
      badFunc = undefined;
    });

    it('Should excecute the func normally', function() {
      TryUtils.ignore(incVal);
      assert.strictEqual(val, 2, 'execute func');
    });

    it('Should pass arguments to the func', function() {
      TryUtils.ignore(incValBy, 1, 2, 3);
      assert.strictEqual(val, 7, 'pass args');
    });

    it('Should return the output of func', function() {
      assert.strictEqual(
        TryUtils.ignore(incValBy, 5), 6, 'return func output');
    });

    it('Should return undefined if exception is ignored', function() {
      var x = TryUtils.ignore(JSON.parse.bind(JSON, 'foobar'));
      assert.isUndefined(x, 'return undefined');
    });

    it('Should ignore exceptions when told to', function() {
      assert.doesNotThrow(function() {
        TryUtils.ignore(badFunc);
      }, Error, undefined, 'ignore exception');
    });

    it('Should rethrow exceptions when told to', function() {
      assert.throws(function() {
        TryUtils.rethrow(badFunc);
      }, Error, undefined, 'rethrow exception');
    });

    it('Should log a warning message when instructed', function() {
      var warningMsg = 'some warning';
      sinon.stub(console, 'warn');
      TryUtils.withWarning(warningMsg).ignore(badFunc);
      assert.isTrue(
        console.warn.calledWith(warningMsg), 'warn message');
      console.warn.restore();
    });

    it('Should log an object to console.dir when instructed', function() {
      var randomObj = {
        foo: 'bar'
      };
      sinon.stub(console, 'dir');
      TryUtils.withWarning(randomObj).ignore(badFunc);
      assert.isTrue(
        console.dir.calledWith(randomObj), 'warn object');
      console.dir.restore();
    });

  });
});
