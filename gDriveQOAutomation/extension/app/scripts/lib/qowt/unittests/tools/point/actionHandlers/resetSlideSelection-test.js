// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for reset slide selection action handler
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/resetSlideSelection'
], function(PubSub, ResetSlideSelectionActionHandler) {

  'use strict';

  describe('Reset slide selection action handler test', function() {

    var _actionData;

    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
      _actionData = {
        action: 'resetSlideSelection',
        context: {
          contentType: 'slideManagement'
        }
      };
    });

    it('should publish doAction event for reset selection action', function() {
      ResetSlideSelectionActionHandler.callback(_actionData);
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_actionData);
    });
  });
});
