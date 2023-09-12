/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the Linebreak widget
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/document/linebreak'
], function(Factory, LinebreakWidget) {

  'use strict';

  describe('Linebreak Widget Factory', function() {

    it('should create a widget instance for correctly structured config',
       function() {
         var widget = LinebreakWidget.create({
           newId: 'E1'
         });
         expect(widget).not.toBe(undefined);
       });

    it('should return undefined when attempting to construct from incorrect ' +
        'config', function() {
          var widget = LinebreakWidget.create({});
          expect(widget).toBe(undefined);
        });

    it('should construct an instance from existing html', function() {
      var dummyDiv = document.createElement('div');
      var widget = LinebreakWidget.create({
        newId: 'E1'
      });
      widget.appendTo(dummyDiv);

      var widgetFromNode = LinebreakWidget.create({
        fromNode: dummyDiv.firstChild
      });
      expect(widgetFromNode).not.toBe(undefined);
      expect(widgetFromNode.getEid()).toBe(widget.getEid());
    });

    it('should return undefined when attempting to construct from wrong html',
       function() {
         var dummyDiv = document.createElement('div');
         var widgetFromNode = LinebreakWidget.create({
           fromNode: dummyDiv
         });
         expect(widgetFromNode).toBe(undefined);
       });


    describe('API', function() {

      it('should support widget factory creation', function() {
        // NOTE: this test uses the Factory, and thus is dependent
        // on it's inner workings. Ideally tests do not depend on
        // other modules like this, but for a quick factory test
        // this will do
        var dummyDiv = document.createElement('div');
        var widget = LinebreakWidget.create({
          newId: 'E1'
        });
        widget.appendTo(dummyDiv);

        var widgetFromFactory = Factory.create({
          fromNode: dummyDiv.firstChild
        });
        expect(widgetFromFactory).not.toBe(undefined);
        expect(widgetFromFactory.getEid()).toBe(widget.getEid());
      });

      it('should return the correct eid of the linebreak', function() {
        var widget = LinebreakWidget.create({
          newId: 'E1'
        });
        expect(widget.getEid()).toBe('E1');
      });

      it('should return the br node as widget element', function() {
        var widget = LinebreakWidget.create({
          newId: 'E1'
        });
        expect(widget.getWidgetElement()).not.toBe(undefined);
        expect(widget.getWidgetElement().tagName.toLowerCase()).toBe('br');
      });

      it('should append itself to a node when told do so', function() {
        var dummyDiv = document.createElement('div');
        var widget = LinebreakWidget.create({
          newId: 'E1'
        });

        expect(dummyDiv.childNodes.length).toBe(0);
        widget.appendTo(dummyDiv);
        expect(dummyDiv.childNodes.length).toBe(1);
      });
    });

  });

  return {};
});

