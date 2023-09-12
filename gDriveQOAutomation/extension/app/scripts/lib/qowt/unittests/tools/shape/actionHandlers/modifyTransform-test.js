// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for modify shape transform action handler
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/shape/actionHandlers/modifyTransform'
], function(PubSub, ModifyTransformActionHandler) {

  'use strict';

  describe('shape modifyTransform action handler test', function() {

    var _context;
    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();

      _context = {
        node: 'some node',
        context: {}
      };
    });

    it('should publish doAction event for action modifyTransform', function() {
      _context.action = 'modifyTransform';
      ModifyTransformActionHandler.callback(_context);

      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(_context);
    });

    it('should not publish doAction event if action is not modifyTransform',
        function() {
          _context.action = 'select';
          ModifyTransformActionHandler.callback(_context);

          expect(PubSub.publish).not.toHaveBeenCalled();
        });
  });
});
