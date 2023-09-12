/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the menu item widget
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/ui/menuItem'
], function(
    PubSub,
    Factory,
    Widget) {

  'use strict';

  describe('MenuItem Widget Factory', function() {

    var config;

    beforeEach(function() {
      config = {
        stringid: 'menu_item_help_center',
        string: 'Help',
        action: 'dummyAction',
        context: {
          dummyValue: 1
        },
        shortcut: {
          'mac': 'CMD+Y',
          'win': 'CTRL+Y'
        },
        iconClass: 'testIconClass',
        setOnSelect: function() {return false;}
      };
    });

    afterEach(function() {
    });

    it('should return a positive integer for calls to the confidence() ' +
        'method for supported configs', function() {
          var config = {type: 'menuItem'};
          var supported = Widget.confidence(config);
          expect(supported > 0).toBe(true);
        });

    it('should return 0 for calls to the confidence() method for ' +
        'non-supported configs', function() {
          var config, supported;

          config = {type: ''};
          supported = Widget.confidence(config);
          expect(supported).toBe(0);

          config = {};
          supported = Widget.confidence(config);
          expect(supported).toBe(0);
        });

    it('should create a widget instance for correctly structured menuItem ' +
        'config', function() {
          var widget = Widget.create(config);

          expect(widget).not.toBe(undefined);
        });

    it('should set the id using actionId if it is defined', function() {
      config.actionId = 'dummyActionId';
      var widget = Widget.create(config);

      expect(widget.getNode().id).toBe('menuitem-dummyActionId');
    });

    it('should set the id using action if actionId is undefined', function() {
      var widget = Widget.create(config);

      expect(widget.getNode().id).toBe('menuitem-dummyAction');
    });

    describe('Widget Instance Behaviour', function() {

      var handler, control;

      beforeEach(function() {
        control = 'not called';
        handler = function(signal, signalData) {
          if (signal === 'qowt:requestAction') {
            control = signal;
            signalData.context.contentType = 'contentType';
            // establishes up the failure case.
          }
          if (signal === 'qowt:doAction') {
            control = signal;
          }
        };
      });

      afterEach(function() {
        handler = undefined;
      });

      it('should not allow config pollution (QW-1685)', function() {
        var spiedEntity = spyOn(PubSub, 'publish').andCallFake(handler);

        // create a widget with no contextual content-type
        var widget = Widget.create(config);
        // make it 'do its thing' and we'll intervene as the system does
        // by use of our spy's fake handler.
        widget.set();

        // now lets see if our config got erroneously mutated.
        expect(control).toBe('qowt:requestAction');
        expect(config.context.contentType).toBe(undefined);

        // and lets check our subsequent behaviour is still correct
        widget.set();
        expect(control).toBe('qowt:requestAction');
        expect(config.context.contentType).toBe(undefined);

        spiedEntity.andCallThrough();
      });
    });

    describe('API', function() {

      beforeEach(function() {
      });
      afterEach(function() {
      });

      it('should support widget factory creation', function() {
        // NOTE: this test uses the Factory, and thus is dependent
        // on it's inner workings. Ideally tests do not depend on
        // other modules like this, but for a quick factory test
        // this will do
        var dummyDiv = document.createElement('div');
        config.type = 'menuItem';
        var widget = Widget.create(config);
        widget.appendTo(dummyDiv);

        var widgetFromFactory = Factory.create(config);
        expect(widgetFromFactory).not.toBe(undefined);
        expect(widgetFromFactory.getNode().id).toBe(widget.getNode().id);
      });

      it('should append itself to a node when told do so', function() {
        var dummyDiv = document.createElement('div');
        var widget = Widget.create(config);

        expect(dummyDiv.childNodes.length).toBe(0);
        widget.appendTo(dummyDiv);
        expect(dummyDiv.childNodes.length).toBe(1);
      });

      it('should create proper roles to menuItem created', function() {
        var dummyDiv = document.createElement('div');
        var widget = Widget.create(config);
        expect(dummyDiv.childNodes.length).toBe(0);
        widget.appendTo(dummyDiv);
        var menuItemElement = dummyDiv.getElementsByClassName(
            'qowt-menuitem')[0];
        expect(menuItemElement.getAttribute('role')).toBe('menuitem');
      });
    });
  });

  describe('Widget Instance Click Action Restricted When Iframed', function() {
    var config, handler, result;

    beforeEach(function() {
      config = {
        stringid: 'test_menu_item',
        string: 'testMenuItem',
        context: {
          dummyValue: 1
        },
        shortcut: {
          'mac': 'CMD+X',
          'win': 'CTRL+X'
        },
        iconClass: 'testIconClass',
        setOnSelect: function() {return false;}
      };
      result = 'not called';
      handler = function(signal) {
        if (signal === 'qowt:iframed:copyCutPasteNotAllowed') {
          result = signal;
        }
      };
    });

    afterEach(function() {
      result = undefined;
      config = undefined;
      handler = undefined;
    });

    function spyPublishEventAndRunTest(action) {
      var spiedEntity;
      runs(function() {
        spiedEntity = spyOn(PubSub, 'publish').andCallFake(handler);
        config.action = action;
        var widget = Widget.create(config);
        widget.setEmbedded(true);
        widget.getNode().dispatchEvent(new CustomEvent('click'));
      });
      waitsFor(function() {
        return result === 'qowt:iframed:copyCutPasteNotAllowed';
      }, 'event to publish', 1000);
      runs(function() {
        expect(result).toBe('qowt:iframed:copyCutPasteNotAllowed');
        spiedEntity.andCallThrough();
      });
    }
    it('should not allow cut operation using mouse click ' +
       'when iframed', function() {
      spyPublishEventAndRunTest('cut');
    });
    it('should not allow copy operation using mouse click ' +
       'when iframed', function() {
      spyPublishEventAndRunTest('copy');
    });
    it('should not allow paste operation using mouse click ' +
       'when iframed', function() {
      spyPublishEventAndRunTest('paste');
    });
  });

  return {};
});

