// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide hide / unhide action handler
 * @author amol.kulkarni@synerzip.com (Amol Kulkarni)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/slideHideUnhide'
], function(
    PubSub,
    SlideHideUnhide) {

  'use strict';

  describe('hide unhide slide action handler test', function() {

    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
    });

    it('should publish doAction event for hide action', function() {
      var _action = {
        action: 'hideSld',
        'context': {
          'contentType': 'slideManagement',
          'command': {
            showSlide: false
          }
        }
      };
      SlideHideUnhide.callback(_action);
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_action);
    });

    it('should publish doAction event for unhide action', function() {
      var _action = {
        action: 'showSld',
        'context': {
          'contentType': 'slideManagement',
          'command': {
            showSlide: true
          }
        }
      };
      SlideHideUnhide.callback(_action);
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_action);
    });
  });
});
