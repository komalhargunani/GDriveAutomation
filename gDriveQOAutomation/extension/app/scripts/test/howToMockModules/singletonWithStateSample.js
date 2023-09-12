/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview module to show how mocha unit tests
 * can mock out dependencies of dependencies. It also
 * shows the correct use of 'qowt:disable' and 'qowt:destroy' within singletons
 * to ensure state is reset before each test.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'test/howToMockModules/foobar'], function(PubSub, Foobar) {

  'use strict';

  var api_ = {
    setX: function(x) {
      x_ = x;
    },
    getX: function() {
      return x_;
    },
    getDepString: function() {
      return Foobar.getString();
    }
  };

  // -------------------- PRIVATE ----------------
  var x_;

  // subscribing to qowt:disable and qowt:destroy is the only thing
  // that is allowed to be done onLoad, to ensure
  // our singleton will reset it's inner state
  // when needed (eg before each individual unit test)

  PubSub.subscribe('qowt:disable', function() {
    // Reset all variables and unsubscribe all subscriptions done to disable
    // the module.
    x_ = undefined;
  });

  PubSub.subscribe('qowt:destroy', function() {
    // Remove the html elements from their parents and destroy all references
    // to destroy the module.
  });

  return api_;
});
