// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide move action handler
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/slideMove'
], function(
    PubSub,
    SlideMove) {

  describe('move slide action handler test', function() {

    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
    });

    it('should publish doAction event for move slide action', function() {
      var action_ = {
        action: 'moveSlide',
        'context': {
          'command': {
            position: 'up'
          }
        }
      };

      var expectedContext_ = {
        action: 'moveSlide',
        'context': {
          'contentType': 'slideManagement',
          'command': {
            position: 'up'
          }
        }
      };
      SlideMove.callback(action_);
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(expectedContext_);
    });
  });
});
