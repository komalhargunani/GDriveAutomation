// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide delete action handler
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/slideDelete'
], function(
    PubSub,
    SlideDelete) {

  'use strict';

  describe('delete slide action handler test', function() {

    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
    });

    it('should publish doAction event for delete slide action', function() {
      var _action = {
        action: 'deleteSlide',
        'context': {
          'command': {
            slideNumbers: ['1']
          }
        }
      };
      SlideDelete.callback(_action);
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_action);
    });
  });
});
