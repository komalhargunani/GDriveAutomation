/**
 * @fileoverview
 * Mocha based unit test for the type utility module.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/typeUtils'], function(
  TypeUtils) {

  'use strict';

  describe('Type Utils.', function() {
    describe('isObject()', function() {
      it('Should match objects', function() {
        assert.isTrue(
          TypeUtils.isObject({}),
          'object');
        assert.isFalse(
          TypeUtils.isObject(true),
          'non-object');
      });
    });

    describe('isPromise()', function() {
      it('Should match promises', function() {
        assert.isTrue(
          TypeUtils.isPromise(new Promise(function() {})),
          'promise');
        assert.isFalse(
          TypeUtils.isPromise({then: function() {}}),
          'non-promise');
      });
    });

    describe('isPromiseLike()', function() {
      it('Should match promise-likes', function() {
        assert.isTrue(
          TypeUtils.isPromiseLike(new Promise(function() {})),
          'promise');
        assert.isTrue(
          TypeUtils.isPromiseLike({then: function() {}}),
          'promise-like');
        assert.isFalse(
          TypeUtils.isPromiseLike({}),
          'non-promise-like');
      });
    });

    describe('isList()', function() {
      it('Should match lists', function() {
        assert.isTrue(
          TypeUtils.isList([]),
          'list');
        assert.isFalse(
          TypeUtils.isList({length: 0}),
          'non-List');
      });
    });

    describe('isNumber()', function() {
      it('Should match numbers', function() {
        assert.isTrue(
          TypeUtils.isNumber(123.456),
          'number');
        assert.isFalse(
          TypeUtils.isNumber('123.456'),
          'non-number');
      });
    });

    describe('isInteger()', function() {
      it('Should match integers', function() {
        assert.isTrue(
          TypeUtils.isInteger(123),
          'integer');
        assert.isFalse(
          TypeUtils.isInteger(123.456),
          'non-integer');
      });
    });

    describe('isFunction()', function() {
      it('Should match functions', function() {
        assert.isTrue(
          TypeUtils.isFunction(function() {}),
          'function');
        assert.isFalse(
          TypeUtils.isFunction('function() {}'),
          'non-function');
      });
    });

    describe('isString()', function() {
      it('Should match strings', function() {
        assert.isTrue(
          TypeUtils.isString('fubar'),
          'string');
        assert.isFalse(
          TypeUtils.isString(true),
          'non-string');
      });
    });

    describe('isRegex()', function() {
      it('Should match regular expressions', function() {
        assert.isTrue(
          TypeUtils.isRegex(/abc/gi),
          'regex');
        assert.isFalse(
          TypeUtils.isRegex('abc'),
          'non-regex');
      });
    });

    describe('isNode()', function() {
      it('Should match nodes', function() {
        assert.isTrue(
          TypeUtils.isNode(document.createElement('p')),
          'node');
        assert.isFalse(
          TypeUtils.isNode('<p>'),
          'non-node');
      });
    });

    describe('isNull()', function() {
      it('Should match null', function() {
        assert.isTrue(
          TypeUtils.isNull(null),
          'null');
        assert.isFalse(
          TypeUtils.isNull('null'),
          'non-null');
      });
    });

    describe('isUndefined()', function() {
      it('Should match undefined', function() {
        assert.isTrue(
          TypeUtils.isUndefined(undefined),
          'undefined');
        assert.isFalse(
          TypeUtils.isUndefined('undefined'),
          'non-undefined');
      });
    });

    describe('isBoolean()', function() {
      it('Should match booleans', function() {
        assert.isTrue(
          TypeUtils.isBoolean(true),
          'true');
        assert.isTrue(
          TypeUtils.isBoolean(false),
          'false');
        assert.isFalse(
          TypeUtils.isBoolean(1),
          'non-boolean');
      });
    });

    describe('Copied from Jasmine unit test', function() {
      it('Should be possible to extend an object', function() {
        var a = {
          one: 1,
          two: 2,
          three: false
        };
        var b = {
          four: 'foobar'
        };
        TypeUtils.extend(a, b);
        assert.strictEqual(a.one, 1);
        assert.strictEqual(a.two, 2);
        assert.isFalse(a.three);
        assert.strictEqual(a.four, 'foobar');
      });
      it('should overwrite properties when extending an object', function() {
        var a = {
          one: 1,
          two: 2,
          three: false
        };
        var b = {
          two: 'random',
          four: 'foobar'
        };
        TypeUtils.extend(a, b);
        assert.strictEqual(a.one, 1);
        assert.strictEqual(a.two, 'random');
        assert.isFalse(a.three);
        assert.strictEqual(a.four, 'foobar');
      });
      describe('createNewType.isOfType', function() {
        it('should return false on everything not marked', function() {
          var values = {
            zero: 0,
            zeroPointOne: 0.1,
            emptyString: '',
            emptyObj: {},
            'null': null,
            'function': function() {},
            emptyList: [],
            'undefined': undefined,
            regex: /hello/,
            arguments: arguments,
            promise: new Promise(function() {}),
            promiseLike: {
              then: function() {}
            }
          };
          var type = TypeUtils.createNewType();
          for (var key in values) {
            var value = values[key];
            var actual = type.isOfType(value);
            if (actual) {
              throw new Error(key + ' type checker returned ' + actual);
            }
          }
        });
        it('should return true on things that are marked as type', function() {
          var foo = {};
          var bar = {};
          var fooType = TypeUtils.createNewType();
          var barType = TypeUtils.createNewType();
          assert.isFalse(fooType.isOfType(foo));
          assert.isFalse(fooType.isOfType(bar));
          assert.isFalse(barType.isOfType(foo));
          assert.isFalse(barType.isOfType(bar));
          fooType.markAsType(foo);
          barType.markAsType(bar);
          assert.isTrue(fooType.isOfType(foo));
          assert.isFalse(fooType.isOfType(bar));
          assert.isFalse(barType.isOfType(foo));
          assert.isTrue(barType.isOfType(bar));
        });
        it('Should throw if a type is marked multiple times', function() {
          var foo = {};
          var fooType = TypeUtils.createNewType();
          var barType = TypeUtils.createNewType();
          fooType.markAsType(foo);
          assert.throws(function() {
            barType.markAsType.bind(this, foo)();
          }, Error);
        });
      });
    });
  });
});
