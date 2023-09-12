// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview A command that unlocks the screen.
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/pubsub/pubsub'
  ], function(
    CommandBase,
    PubSub) {

  'use strict';

  var factory_ = {
    create: function() {
      var api_ = CommandBase.create('unlockScreen', true, false);

      api_.doOptimistic = function() {
        PubSub.publish("qowt:unlockScreen", {});
      };

      return api_;
    }
  };

  return factory_;
});

