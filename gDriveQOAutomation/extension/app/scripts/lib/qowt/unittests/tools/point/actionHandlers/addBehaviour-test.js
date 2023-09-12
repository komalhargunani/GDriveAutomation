// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for add shape init action handler
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/addBehaviour'
], function(PubSub, AddBehaviourActionHandler) {

  'use strict';

  describe('initAddShape select action handler test', function() {
    var _context;
    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
      _context = {
        context: {}
      };
    });

    it('should publish doAction event for action initAddShape', function() {
      _context.action = 'initAddShape';
      AddBehaviourActionHandler.callback(_context);
      var expectedContext = {
        action: 'initAddShape',
        context: {
          contentType: 'slide'
        }
      };
      expect(PubSub.publish.mostRecentCall.args[0]).
          toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).
         toEqual(expectedContext);
    });
  });
});
