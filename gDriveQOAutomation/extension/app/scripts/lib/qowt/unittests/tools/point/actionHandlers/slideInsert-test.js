// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide insert action handler
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/slideInsert'
], function(
    PubSub,
    SlideInsert) {

  'use strict';

  describe('insert slide action handler test', function() {

    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
    });

    it('should publish doAction event for insert slide action', function() {
      var _action = {
        action: 'insertSlide',
        'context': {
          'command': {
            sn: 1
          }
        }
      };
      SlideInsert.callback(_action);
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_action);
    });
  });
});
