/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit tests for field manager;
 *
 * @author jelte@google.com (Jelte Liebrand)
 */


// we want to test ONLY the field manager; so mock out the pagenum field widget
require.config({
  map: {
    '*' : {
      'qowtRoot/widgets/fields/pageNum':
        'qowtRoot/fixtures/mocks/widgets/pageNumWidget'
    }
  }
});

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/text/textTool',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/widgets/fields/pageNum',
  'qowtRoot/controls/document/fieldManager'
], function(
    PubSub,
    TextTool,
    UnitTest,
    PageNumWidget) {

  'use strict';

  describe('utils/fieldManager.js', function() {
    var _testAppendArea,
        _pageNumSpanCount = 3,
        _numPagesSpanCount = 5,
        _pageNumSpans,
        _pageCountSpans,
        i;

    beforeEach(function() {
      _testAppendArea = UnitTest.createTestAppendArea();
      var page = new QowtPage();
      _testAppendArea.appendChild(page);
      _pageNumSpans = [];
      _pageCountSpans = [];
      for (i = 0; i < _pageNumSpanCount; i++) {
        _pageNumSpans[i] = document.createElement('span');
        _pageNumSpans[i].classList.add('qowt-field-pagenum');
        page.appendChild(_pageNumSpans[i]);
      }
      for (i = 0; i < _numPagesSpanCount; i++) {
        _pageCountSpans[i] = document.createElement('span');
        _pageCountSpans[i].classList.add('qowt-field-numpages');
        page.appendChild(_pageCountSpans[i]);
      }

      spyOn(TextTool, 'isUnsuppressed').andCallFake(function() {
        return true;
      });
    });
    afterEach(function() {
      _testAppendArea.clear();
    });


    it('should subscribe to qowt:pageCountChanged and update pageNum widgets ' +
        'upon qowt:contentComplete and qowt:textToolState unsuppressed',
        function() {
          spyOn(PubSub, 'subscribe').andCallThrough();
          PubSub.publish('qowt:contentComplete', {});
          expect(PubSub.subscribe).wasCalled();
          expect(PubSub.subscribe.mostRecentCall.args[0]).
              toBe('qowt:pageCountChanged');

          expect(PageNumWidget.creationCounter).toBe(8);
        });


    it('should update pageNum widgets upon page count change', function() {
      PubSub.publish('qowt:pageCountChanged', {});

      expect(PageNumWidget.creationCounter).toBe(8);
    });
  });
});
