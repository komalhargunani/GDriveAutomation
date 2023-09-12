// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for shape select action handler
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/shape/actionHandlers/shapeSelect'
], function(PubSub, ShapeSelectActionHandler) {

  'use strict';

  describe('shape select action handler test', function() {

    var _context;
    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();

      _context = {
        node: 'some node',
        contentType: 'shape'
      };
    });

    it('should publish doAction event for action select', function() {
      _context.action = 'select';
      ShapeSelectActionHandler.callback(_context);

      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_context);
    });

    it('should publish doAction event for action deselect', function() {
      _context.action = 'deselect';
      ShapeSelectActionHandler.callback(_context);

      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_context);
    });
  });
});
