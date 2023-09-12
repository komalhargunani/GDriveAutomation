/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview mocha based unit test for the qowtElement mixin
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'
  ], function(
    MixinUtils,
    QowtElement) {

  'use strict';

  describe("QowtElement mixin", function() {

    it("should add supports functionality to elements", function() {
      var myProto = MixinUtils.mergeMixin(QowtElement);
      assert.isFunction(myProto.supports, 'should have supports function');
    });

    it("should allow clients checking support for " +
       "single behaviour/actions", function() {
      var myProto = MixinUtils.mergeMixin(QowtElement, {
        supports_: ['behaviourX', 'behaviourY']
      });
      assert.isTrue(myProto.supports('behaviourX'), 'support behaviourX');
      assert.isFalse(myProto.supports('foobar'), 'not support foobar');
    });

    it("should allow clients checking arrays of behaviours", function() {
      var myProto = MixinUtils.mergeMixin(QowtElement, {
        supports_: ['behaviourX', 'behaviourY', 'behaviourZ']
      });
      assert.isTrue(myProto.supports(['behaviourX']), 'support behaviourX');
      assert.isTrue(myProto.supports(['behaviourX', 'behaviourY']),
          'support behaviourX and behaviourY');
      assert.isFalse(myProto.supports(['behaviourX', 'foobar']),
          'NOT support behaviourX and foobar');
    });

  });
});

