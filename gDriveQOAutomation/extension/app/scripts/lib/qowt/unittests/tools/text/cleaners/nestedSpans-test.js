/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test to test our nestedSpans
 * cleaner. Note: we should never really be in a
 * situation where contenteditable produced nested
 * spans. However, unfortunately there are bugs
 * where this does occur. So we 'lift' the nested
 * span up to the right level.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/tools/text/mutations/cleaners/nestedSpans'
], function(Cleaner) {

  'use strict';

  describe('nestedSpans cleaner', function() {

    beforeEach(function() {
    });
    afterEach(function() {
    });

    function _createSpan() {
      var span = document.createElement('span');
      span.appendChild(document.createTextNode('hello'));
      return span;
    }

    it('should move the nested span behind it\'s parent', function() {
      var root = document.createElement('div');
      // add four spans to the root
      for (var i = 0; i < 4; i++) {
        root.appendChild(_createSpan());
      }
      // create a nested span under span 2
      var nestedSpan = _createSpan();
      root.childNodes[1].appendChild(nestedSpan);

      // for good measure, add the nodes to the DOM and select
      // some text (eg place the cursor) inside the nestedSpan
      document.body.appendChild(root);
      var range = document.createRange();
      var selObj = window.getSelection();
      range.setStart(nestedSpan.firstChild, 1);
      range.setEnd(nestedSpan.firstChild, 3);
      selObj.removeAllRanges();
      selObj.addRange(range);

      // clean the nested span
      Cleaner.__clean(nestedSpan);

      // root should now have five spans
      expect(root.childElementCount).toBe(5);

      // none of the spans should have child elements
      for (var j = 0; j < root.childNodes.length; j++) {
        expect(root.childNodes[j].childElementCount).toBe(0);
      }

      // the selection should still be in the span that we moved
      expect(selObj.rangeCount).not.toBe(0);
      var liveRange = selObj.getRangeAt(0);
      expect(liveRange.startContainer).toBe(nestedSpan.firstChild);
      expect(liveRange.startOffset).toBe(1);
      expect(liveRange.endContainer).toBe(nestedSpan.firstChild);
      expect(liveRange.endOffset).toBe(3);
    });

  });

  return {};
});


