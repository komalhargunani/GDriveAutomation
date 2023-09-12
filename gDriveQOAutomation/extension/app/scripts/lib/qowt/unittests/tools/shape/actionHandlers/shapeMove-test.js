// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for shape move action handler
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/shape/actionHandlers/shapeMove'
], function(PubSub, ShapeMoveActionHandler) {

  'use strict';

  describe('shape move select action handler test', function() {
    var _context;
    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
      _context = {
        context: {}
      };
    });

    it('should publish doAction event for action move', function() {
      _context.action = 'move';
      ShapeMoveActionHandler.callback(_context);
      var expectedContext = {
        action: 'move',
        context: {
          contentType: 'shape'
        }
      };
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(expectedContext);
    });

  });
});

