// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Utilities for figuring out types of objects.
 */
define([], function() {

  'use strict';

  var _api = {

    /**
     * Checks the types of the arguments passed to a function.
     * @param fnName {String} the name of the function, as a string.
     * @param argDescription {Object} an object describing the valid types of
     *     the arguments. It looks something like this.
     *     {
     *       argName1: [argValue1, 'object', 'list', 'number']
     *       argName2: [argValue2, 'object', 'undefined', 'null']
     *     }
     *     You can find the typenames in the _argTypes table below.
     */
    checkArgTypes: function(fnName, argDescription) {
      for (var argName in argDescription) {
        var checkSpec = {
          value: argDescription[argName][0],
          types: argDescription[argName].slice(1)
        };
        _checkArg(fnName, argName, checkSpec);
      }
    },

    /**
     * Tests if an item is an object.
     * The 'null' value is not considered an object since accessing properties
     * of null will give an exception.
     *
     * A regexp is considered to be an object - accessing undefined properties
     * gives undefined and this doesn't give an exception.
     *
     * @param obj the item to test.
     * @returns {Boolean} whether obj is an object.
     */
    isObject: function(obj) {
      return (typeof obj === 'object' && obj !== null);
    },

    /**
     * Tests if an object is a Promise.
     * @returns {Boolean} whether obj is a promise.
     */
    isPromise: function(obj) {
      return (obj instanceof Promise);
    },

    /**
     * Tests if an object is Promise-like, and can be casted to Promise.
     * This is defined in standards as any object with a then method.
     * The behavior of the then method is also specified, but that can't be
     * tested for, and Promise frameworks also don't test for that.
     * They simply assume that any thenable (anything with a then method)
     * is Promise-like with a properly behaving then method.
     * @returns {boolean} whether obj is promise-like.
     */
    isPromiseLike: function(obj) {
      return !!(obj && _api.isFunction(obj.then));
    },

    /**
     * Tests if an item is a list. This method came from: http://goo.gl/rdjlW
     * @param obj the item to test.
     * @returns {Boolean} whether obj is a list.
     */
    isList: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    },

    /**
     * Tests if an item is a number. Also takes care of NaN.
     * @param obj the item to test.
     * @returns {Boolean} whether obj is a number.
     */
    isNumber: function(obj) {
      return (typeof obj) === 'number' && !isNaN(obj);
    },

    /**
     * Tests if an item is an integer.
     * @param {Number} num the number to test.
     * @returns {Boolean} whether it is a number.
     */
    isInteger: function(num) {
      return ((typeof num) === 'number') && (parseInt(num, 10) === num);
    },

    /**
     * Tests if an item is a function.
     * @param obj the item to test.
     * @returns {Boolean} whether obj is a function.
     */
    isFunction: function(obj) {
      return typeof obj === 'function';
    },

    /**
     * Tests if an item is a string.
     * @param obj the item to test.
     * @returns {Boolean} whether obj is a string.
     */
    isString: function(obj) {
      return Object.prototype.toString.call(obj) === '[object String]';
    },

    /**
     * Tests if an item is a regex.
     * @param obj the item to test.
     * @returns {Boolean} whether obj is a regex.
     */
    isRegex: function(obj) {
      return Object.prototype.toString.call(obj) === '[object RegExp]';
    },

    /**
     * Tests if an item is a DOM node.
     * @param obj the item to test.
     * @returns {Boolean} whether obj is a DOM node.
     */
    isNode: function(obj) {
      return obj instanceof Node;
    },

    /**
     * Tests if an item is null.
     * @param obj
     * @returns {Boolean}
     */
    isNull: function(obj) {
      return obj === null;
    },

    /**
     * Tests if an item is undefined.
     * @param obj
     * @returns {Boolean}
     */
    isUndefined: function(obj) {
      return obj === undefined;
    },

    /**
     * Tests if an item is boolean.
     * @param obj
     * @returns {Boolean}
     */
    isBoolean: function(obj) {
      return typeof obj === 'boolean';
    },

    /**
     * Return the type name for a parameter.
     * @return {String}
     */
    getType: function(targ) {
      var theType;
      Object.keys(_argTypes).forEach(function(typ) {
        if (_argTypes[typ](targ)) {
          theType = typ;
        }
      });
      return theType;
    },

    /**
     * Tests if an item is an Arguments object or a list. It's possible that
     * there are false positives here, and values that are neither the
     * arguments object or a list will return true.
     * @param obj the item to test.
     * @returns {Boolean} whether obj is an argument object.
     */
    isArgumentsObjectOrList: function(obj) {
      return (obj instanceof Object) && (obj.hasOwnProperty("length"));
    },

    /**
     * extend objectA with the (non-prototypal) properties of objectB
     * will override properties if needed
     *
     * @param objectA {object} object to extend
     * @param objectB {object} object with new properties
     */
    extend: function(objectA, objectB) {
      for (var prop in objectB) {
        if (objectB.hasOwnProperty(prop)) {
          objectA[prop] = objectB[prop];
        }
      }
    },

    /**
     * Creates a new user-defined type. We can mark any object as belonging to a
     * type. An object can only belong to one type at most. We can then test
     * objects for membership in that type.
     * @returns a user-defined type API, with a .isOfType(obj) and a
     *     .markAsType(obj) method.
     */
    createNewType: function(typeName) {
      // We overwrite the constructor property to track types. In JS which uses
      // new and constructors, the constructor property can be used to determine
      // what constructor was used to construct the object. Since QOWT does not
      // use new and constructors, we can fill that vacuum and provide our own
      // information.
      var fakeConstructor = function() {};
      var typeDesc = {
        /**
         * Tests if an object is of this user-defined type.
         * @param obj the item to test.
         * @returns {Boolean} whether obj is of this type.
         */
        isOfType: function(obj) {
          return (obj !== undefined) && (obj !== null) &&
              (obj.constructor === fakeConstructor);
        },

        /**
         * Makes an object belong to this user-defined type. From now on,
         * calling isOfType above on obj will return true.
         * @param obj the object to mark.
         * @returns obj.
         */
        markAsType: function(obj) {
          Object.defineProperty(obj, 'constructor', {
            value: fakeConstructor,
            configurable: false,
            writable: false,
            enumerable: false
          });
          return obj;
        }
      };

      if (typeName) {
        if (_argTypes[typeName]) {
          throw new Error('Already registered type ' + typeName);
        }
        _argTypes[typeName] = typeDesc.isOfType;
      }

      return typeDesc;
    }
  };

  function _checkArg(fnName, argName, checkSpec) {
    var noMatch = checkSpec.types.every(function(type) {
      var predicate = _argTypes[type];
      if (!predicate) {
        throw new Error('Bad config to checkArgTypes: unknown type: '+ type);
      }
      return !predicate(checkSpec.value);
    });

    if (noMatch) {
      var typeDescription = (checkSpec.types.length === 1) ?
           checkSpec.types[0] :
          '[' + checkSpec.types.join(',') + ']';

      throw new Error('Argument ' + argName + ' passed to function ' +
          fnName + ' was supposed to be of type ' + typeDescription +
          ' but had value ' + checkSpec.value);
    }
  }

  var _argTypes = {
    string: _api.isString,
    object: _api.isObject,
    promise: _api.isPromise,
    promiseLike: _api.isPromiseLike,
    node: _api.isNode,
    regex: _api.isRegex,
    'function': _api.isFunction,
    number: _api.isNumber,
    list: _api.isList,
    boolean: _api.isBoolean,
    'null': _api.isNull,
    'undefined': _api.isUndefined
  };

  return _api;
});
