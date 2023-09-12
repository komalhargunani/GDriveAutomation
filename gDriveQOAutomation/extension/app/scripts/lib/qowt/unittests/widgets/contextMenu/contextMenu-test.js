/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test for the context menu widget.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/contextMenu/contextMenu',
  'qowtRoot/utils/domListener'
], function(
    WidgetFactory,
    PubSub,
    ContextMenu,
    DomListener) {

  'use strict';

  describe('Context Menu Widget Factory', function() {

    var contextMenuWidget, contextMenuElm, parentNode, evt;

    var widgetConfig = {
      type: 'contextMenu'
    };

    beforeEach(function() {
    });

    afterEach(function() {
      contextMenuWidget = undefined;
      contextMenuElm = undefined;
      parentNode = undefined;
      evt = undefined;
    });

    it('should return a positive integer for calls to the confidence ' +
        'method for supported configs', function() {
          var supported = ContextMenu.confidence(widgetConfig);

          expect(supported > 0).toBe(true);
        });

    it('should support widget factory creation', function() {
      contextMenuWidget = WidgetFactory.create(widgetConfig);

      expect(contextMenuWidget).not.toBe(undefined);
    });

    it('should set proper role to created context menu', function() {
      contextMenuWidget = WidgetFactory.create(widgetConfig);
      contextMenuElm = contextMenuWidget.getElement();

      expect(contextMenuElm.getAttribute('role')).toBe('menu');
    });

    it('should set proper classes to created context menu', function() {
      contextMenuWidget = WidgetFactory.create(widgetConfig);
      contextMenuElm = contextMenuWidget.getElement();

      expect(contextMenuElm.classList.contains('qowt-contextmenu')).toBe(true);
      expect(contextMenuElm.classList.contains(
            'qowt-text-capitalize')).toBe(true);
    });

    it('should add event listeners and subscribe to a signal when the menu ' +
        'is appended', function() {
          parentNode = document.createElement('div');
          contextMenuWidget = WidgetFactory.create(widgetConfig);
          spyOn(DomListener, 'addListener');
          spyOn(PubSub, 'subscribe');
          contextMenuWidget.appendTo(parentNode);

          expect(DomListener.addListener).toHaveBeenCalled();
          expect(DomListener.addListener.callCount).toBe(3);
          expect(PubSub.subscribe).toHaveBeenCalled();
          expect(PubSub.subscribe.callCount).toBe(1);
        });

    it('should show the menu and set its position when a "contextmenu" event ' +
        'occurs', function() {
          parentNode = document.createElement('div');
          contextMenuWidget = WidgetFactory.create(widgetConfig);
          contextMenuElm = contextMenuWidget.getElement();
          contextMenuWidget.appendTo(parentNode);
          evt = document.createEvent('Event');
          evt.initEvent('contextmenu', true, false);
          evt.x = 0;
          evt.y = 10;

          expect(contextMenuElm.style.visibility).toBe('hidden');
          parentNode.dispatchEvent(evt);
          expect(contextMenuElm.style.visibility).toBe('visible');
          expect(contextMenuElm.style.left).toBe('0px');
          expect(contextMenuElm.style.top).toBe('10px');
        });

    it('should execute callback of preExecute when a "contextmenu" event' +
        ' occurs', function() {
          parentNode = document.createElement('div');
          contextMenuWidget = WidgetFactory.create(widgetConfig);
          contextMenuWidget.appendTo(parentNode);

          var someContextMenu = {
            callback: function() {}
          };
          spyOn(someContextMenu, 'callback');
          contextMenuWidget.setPreExecuteHook(someContextMenu.callback);
          evt = document.createEvent('Event');
          evt.initEvent('contextmenu', true, false);

          parentNode.dispatchEvent(evt);
          expect(someContextMenu.callback).toHaveBeenCalled();
        });
  });
});
