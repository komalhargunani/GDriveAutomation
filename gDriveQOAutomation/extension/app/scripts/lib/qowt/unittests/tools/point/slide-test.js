// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide.js slideTool
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */
define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/slide'
], function(UnittestUtils, PubSub, SlideTool) {

  'use strict';

  describe('slide tool test', function() {

    var _node, _context;

    beforeEach(function() {
      _node = UnittestUtils.createTestAppendArea();
      _context = {
        node: _node
      };

      spyOn(PubSub, 'subscribe').andCallThrough();
      spyOn(PubSub, 'unsubscribe').andCallThrough();
      spyOn(PubSub, 'publish').andCallThrough();
      SlideTool.activate(_context);
    });

    afterEach(function() {
      SlideTool.deactivate(_context);
      UnittestUtils.removeTestAppendArea();
    });

    it('should throw error when slideTool.init() called multiple times',
        function() {
          SlideTool.init();
          expect(SlideTool.init).toThrow(
              'slideTool.init() called multiple times.');
        });

    it('should subscribe qowt events on activate', function() {

      expect(PubSub.subscribe).toHaveBeenCalled();
      expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:requestAction');
      expect(PubSub.subscribe.calls[1].args[0]).toEqual(
          'qowt:selectionChanged');
    });

    it('should unsubscibe qowt:requestAction on deactivate', function() {
      SlideTool.deactivate(_context);
      expect(PubSub.unsubscribe).toHaveBeenCalled();
    });

    it('should call registered actionHandler when it receives a ' +
        '"qowt:requestAction" signal for action "addShape" ', function() {

         PubSub.publish('qowt:requestAction', {action: 'addShape',
           context: _context});

          expect(PubSub.publish.mostRecentCall.args[0]).
              toEqual('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).
              toEqual('addShape');
        });

    it('should call registered actionHandler when it receives a ' +
        '"qowt:requestAction" signal for action "initAddShape" ', function() {
      PubSub.publish('qowt:requestAction', {action: 'initAddShape',
        context: _context});

      expect(PubSub.publish.mostRecentCall.args[0]).
          toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1].action).
          toEqual('initAddShape');
    });
  });
});
