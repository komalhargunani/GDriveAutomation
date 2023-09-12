/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the Bookmark widget
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/document/bookmark'
], function(Factory, BookmarkWidget) {

  'use strict';

  describe('Bookmark Widget Factory', function() {

    beforeEach(function() {});
    afterEach(function() {});

    it('should create a widget instance for correctly structured bookmark ' +
        'config', function() {
          var widget = BookmarkWidget.create({
            newBookmarkId: 'E1',
            format: 'http://www.google.com'
          });
          expect(widget).not.toBe(undefined);
        });

    it('should return undefined when attempting to construct from incorrect ' +
        'config', function() {
          var widget = BookmarkWidget.create({});
          expect(widget).toBe(undefined);
        });

    it('should ensure the bookmark anchor is non-editable', function() {
      var dummyDiv = document.createElement('div');
      var widget = BookmarkWidget.create({
        newBookmarkId: 'E1',
        format: 'http://www.google.com'
      });
      widget.appendTo(dummyDiv);
      expect(dummyDiv.firstChild.getAttribute('contenteditable')).toBe('false');
    });

    it('should construct an instance from existing html', function() {
      var dummyDiv = document.createElement('div');
      var widget = BookmarkWidget.create({
        newBookmarkId: 'E1',
        format: 'http://www.google.com'
      });
      widget.appendTo(dummyDiv);

      var widgetFromNode = BookmarkWidget.create({
        fromNode: dummyDiv.firstChild
      });
      expect(widgetFromNode).not.toBe(undefined);
      expect(widgetFromNode.getEid()).toBe(widget.getEid());
    });

    it('should return undefined when attempting to construct from wrong html',
       function() {
         var dummyDiv = document.createElement('div');
         var widgetFromNode = BookmarkWidget.create({
           fromNode: dummyDiv
         });
         expect(widgetFromNode).toBe(undefined);
       });


    describe('API', function() {

      beforeEach(function() {});
      afterEach(function() {});

      it('should support widget factory creation', function() {
        // NOTE: this test uses the Factory, and thus is dependent
        // on it's inner workings. Ideally tests do not depend on
        // other modules like this, but for a quick factory test
        // this will do
        var dummyDiv = document.createElement('div');
        var widget = BookmarkWidget.create({
          newBookmarkId: 'E1',
          format: 'http://www.google.com'
        });
        widget.appendTo(dummyDiv);

        var widgetFromFactory = Factory.create({
          fromNode: dummyDiv.firstChild
        });
        expect(widgetFromFactory).not.toBe(undefined);
        expect(widgetFromFactory.getEid()).toBe(widget.getEid());
      });

      it('should return the correct eid of the bookmark', function() {
        var widget = BookmarkWidget.create({
          newBookmarkId: 'E1',
          format: 'http://www.google.com'
        });
        expect(widget.getEid()).toBe('E1');
      });

      it('should return the anchor node as widget element', function() {
        var widget = BookmarkWidget.create({
          newBookmarkId: 'E1',
          format: 'http://www.google.com'
        });
        expect(widget.getWidgetElement()).not.toBe(undefined);
        expect(widget.getWidgetElement().tagName.toLowerCase()).toBe('a');
      });

      it('should append itself to a node when told do so', function() {
        var dummyDiv = document.createElement('div');
        var widget = BookmarkWidget.create({
          newBookmarkId: 'E1',
          format: 'http://www.google.com'
        });

        expect(dummyDiv.childNodes.length).toBe(0);
        widget.appendTo(dummyDiv);
        expect(dummyDiv.childNodes.length).toBe(1);
      });
    });

  });

  return {};
});

