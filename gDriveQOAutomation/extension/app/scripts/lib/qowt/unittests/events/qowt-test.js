
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit Test for QOWT.js
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/events/errors/generic'
  ], function(
    PubSub,
    Error
  ) {

  'use strict';

  describe("Propogating errors on the bus", function() {

    it("should propogate without generating DOM exceptions (QW-2472)",
        function() {
      var error = Error.create();
      expect(function() {
        PubSub.publish('qowt:error', error);
      }).not.toThrow();
    });
  });

  return {};
});





