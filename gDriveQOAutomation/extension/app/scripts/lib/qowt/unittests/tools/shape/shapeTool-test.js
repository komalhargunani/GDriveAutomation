// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for shapeTool.js
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */
define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/shape/shapeTool',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/widgets/point/slidesContainer'
], function(UnittestUtils, PubSub, ShapeTool, SelectionManager,
            SlidesContainer) {

  'use strict';

  describe('shape tool test', function() {

    var _node, _context;

    beforeEach(function() {
      _node = UnittestUtils.createTestAppendArea();
      _context = {
        node: _node
      };

      spyOn(PubSub, 'subscribe').andCallThrough();
      spyOn(PubSub, 'unsubscribe').andCallThrough();
      spyOn(PubSub, 'publish').andCallThrough();
      ShapeTool.activate(_context);
    });

    afterEach(function() {
      ShapeTool.deactivate(_context);
      UnittestUtils.removeTestAppendArea();
    });

    it('should throw error when shapeTool.init() called multiple times',
        function() {
          ShapeTool.init();
          expect(ShapeTool.init).toThrow(
              'shapeTool.init() called multiple times.');
        });

    it('should subscribe qowt events on activate', function() {

      expect(PubSub.subscribe).toHaveBeenCalled();
      expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:requestAction');
      expect(PubSub.subscribe.calls[1].args[0]).toEqual(
          'qowt:selectionChanged');
    });

    it('should unsubscibe qowt:requestAction on deactivate', function() {
      ShapeTool.deactivate(_context);
      expect(PubSub.unsubscribe).toHaveBeenCalled();
    });

    it('should return true when shape tool is active', function() {
      expect(ShapeTool.isActive()).toEqual(true);
    });

    it('should return false when shape tool is not active', function() {
      ShapeTool.deactivate(_context);

      expect(ShapeTool.isActive()).toEqual(false);
    });

    it('should call registered actionHandler when it receives a ' +
        '"qowt:requestAction" signal for action "select" ', function() {

          PubSub.publish('qowt:requestAction', {action: 'select',
            context: _context});

          expect(PubSub.publish.mostRecentCall.args[0]).
              toEqual('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).
              toEqual('select');
        });

    it('should call registered actionHandler when it receives a ' +
        '"qowt:requestAction" signal for action "deselect" ', function() {

          PubSub.publish('qowt:requestAction', {action: 'deselect', context:
           _context});

          expect(PubSub.publish.mostRecentCall.args[0]).
              toEqual('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).
              toEqual('deselect');
        });

    it('should call registered actionHandler when it receives a ' +
            '"qowt:requestAction" signal for action "deleteShape" ', function()
            {
              PubSub.publish('qowt:requestAction', {action: 'deleteShape',
                context: _context});
              expect(PubSub.publish.mostRecentCall.args[0]).
                  toEqual('qowt:doAction');
              expect(PubSub.publish.mostRecentCall.args[1].action).
                  toEqual('deleteShape');
            });

    it('should call registered actionHandler when it receives a ' +
            '"qowt:requestAction" signal "modifyShapeFillColor" ', function()
            {
              var dummySlideWidget = {
                getSlideIndex: function() {
                  return 1;
                }
              };
              spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(
                  dummySlideWidget);

              _context.formatting = {};
              spyOn(SelectionManager, 'getSelection').
                  andReturn({scope: {id: 'testId'}});
              PubSub.publish('qowt:requestAction',
                  {action: 'modifyShapeFillColor', context: _context});
              expect(PubSub.publish.mostRecentCall.args[0]).
                  toEqual('qowt:doAction');
              expect(PubSub.publish.mostRecentCall.args[1].action).
                  toEqual('modifyShapeFillColor');
            });

    it('should call registered actionHandler when it receives a ' +
        '"qowt:requestAction" signal for action "modifyTransform" ',
        function() {

          PubSub.publish('qowt:requestAction', {action: 'modifyTransform',
            context: _context});

          expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
              'qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
              'modifyTransform');
        });

    it('should call registered actionHandler when it receives a ' +
        '"qowt:requestAction" signal for action "modifyShapeOutlineWidth" ',
        function() {
          _context.formatting = {};
          var dummySlideWidget = {
            getSlideIndex: function() {
              return 1;
            }
          };
          _context.node = new QowtPointShape();
          spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(
              dummySlideWidget);
          spyOn(SelectionManager, 'getSelection').andReturn(
              {scope: _context.node});
          PubSub.publish('qowt:requestAction',
              {action: 'modifyShapeOutlineWidth', context: _context});
          expect(PubSub.publish.mostRecentCall.args[0]).
              toEqual('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).
              toEqual('formatObject');
        });

    it('should call registered actionHandler when it receives a ' +
        '"qowt:requestAction" signal for action "modifyShapeOutlineStyle" ',
        function() {
          _context.formatting = {};
          var dummySlideWidget = {
            getSlideIndex: function() {
              return 1;
            }
          };
          _context.node = new QowtPointShape();
          spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(
              dummySlideWidget);
          spyOn(SelectionManager, 'getSelection').andReturn(
              {scope: _context.node});
          PubSub.publish('qowt:requestAction',
              {action: 'modifyShapeOutlineStyle', context: _context});
          expect(PubSub.publish.mostRecentCall.args[0]).
              toEqual('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).
              toEqual('formatObject');
        });

    it('should call registered actionHandler when it receives a ' +
        '"qowt:requestAction" signal for action "modifyShapeOutlineColor" ',
        function() {
          _context.formatting = {};
          var dummySlideWidget = {
            getSlideIndex: function() {
              return 1;
            }
          };
          _context.node = new QowtPointShape();
          spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(
              dummySlideWidget);
          spyOn(SelectionManager, 'getSelection').andReturn(
              {scope: _context.node});
          PubSub.publish('qowt:requestAction',
              {action: 'modifyShapeOutlineColor', context: _context});
          expect(PubSub.publish.mostRecentCall.args[0]).
              toEqual('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).
              toEqual('formatObject');
        });
  });
});
