// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for shape resize action handler
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/shape/actionHandlers/shapeResize'
], function(PubSub, ShapeResizeActionHandler) {

  'use strict';

  describe('shape resize action handler test', function() {

    var _context;
    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();

      _context = {
        node: 'some node',
        context: {}
      };
    });

    it('should publish doAction event for action resize', function() {
      _context.action = 'resize';
      ShapeResizeActionHandler.callback(_context);

      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_context);
    });

    it('should not publish doAction event if action is not resize', function() {
      _context.action = 'select';
      ShapeResizeActionHandler.callback(_context);

      expect(PubSub.publish).not.toHaveBeenCalled();
    });
  });
});
