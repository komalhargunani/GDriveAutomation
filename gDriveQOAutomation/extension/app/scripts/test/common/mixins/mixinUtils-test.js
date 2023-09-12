/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview mocha based unit test for the MixinUtils module
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'common/mixins/mixinUtils'
  ], function(
    MixinUtils) {

  'use strict';

  describe("MixinUtils", function() {

    it("should merge two objects", function() {
      var a = {eggs:1, foo:2};
      var b = {cat: 'mouse', dog: 'awesome'};
      var merged = MixinUtils.mergeMixin(a,b);
      assert.deepEqual(merged, {
        eggs: 1,
        foo: 2,
        cat: 'mouse',
        dog: 'awesome'
      });
    });

    it("should override properties in-order", function() {
      var a = {eggs:1, foo:2};
      var b = {cat: 'mouse', dog: 'awesome', foo: 3};
      var merged = MixinUtils.mergeMixin(a,b);
      assert.deepEqual(merged, {
        eggs: 1,
        foo: 3,
        cat: 'mouse',
        dog: 'awesome'
      });
    });

    it("should concatenate arrays of two objects", function() {
      var a = {eggs:1, foo:2, x: [1,2]};
      var b = {cat: 'mouse', dog: 'awesome', x: [3,4]};
      var merged = MixinUtils.mergeMixin(a,b);
      assert.deepEqual(merged, {
        eggs: 1,
        foo: 2,
        cat: 'mouse',
        dog: 'awesome',
        x: [1,2,3,4]
      });
    });



  });
});

