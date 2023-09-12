// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for shape delete action handler
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/shape/actionHandlers/shapeDelete'
], function(PubSub, ShapeDeleteActionHandler) {

  'use strict';

  describe('shape delete action handler test', function() {

    var _context;
    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();

      _context = {
        context: {
          command: {
            eid: 'E123'
          },
          contentType: 'shape'
        }
      };
    });

    it('should publish doAction event for action delete', function() {
      _context.action = 'deleteShape';
      ShapeDeleteActionHandler.callback(_context);

      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_context);
    });
  });
});
