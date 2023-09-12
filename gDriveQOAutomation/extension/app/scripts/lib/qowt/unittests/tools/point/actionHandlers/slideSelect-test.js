// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide select / deselect action handler
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/slideSelect'
], function(PubSub, SlideSelectActionHandler) {

  'use strict';

  describe('slide select action handler test', function() {

    var _actionData;

    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
      _actionData = {
        action: 'slideSelect',
        contentType: 'slideManagement',
        context: {
          index: 0,
          meta: false,
          shift: false,
          type: 'click'
        }
      };
    });

    it('should publish doAction event for action select', function() {
      SlideSelectActionHandler.callback(_actionData);
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_actionData);
    });

  });
});
