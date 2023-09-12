/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit tests for the Dom Text Selection module.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/utils/domTextSelection'], function(
  TestUtils,
  DomTextSelection) {

  'use strict';

  describe('DomTextSelection', function() {

    describe('offsetWithin', function() {

      var el = [], range, selObj;

      beforeEach(function() {
        var testArea = TestUtils.createTestAppendArea();
        for (var i = 0; i < 5; i++) {
          el[i] = document.createElement('div');
          el[i].appendChild(document.createTextNode('hello world'));
          testArea.appendChild(el[i]);
        }
        selObj = window.getSelection();
        selObj.removeAllRanges();
        range = document.createRange();
      });

      afterEach(function() {
        TestUtils.removeTestAppendArea();
        selObj.removeAllRanges();
      });

      it('should return -1 for start and end if entire selection ' +
          'is before the element', function() {
            range.selectNodeContents(el[0]);
            selObj.addRange(range);
            var start = DomTextSelection.offsetRelativeWithin(el[2], 'start');
            var end = DomTextSelection.offsetRelativeWithin(el[2], 'end');
            expect(start).toBe(-1);
            expect(end).toBe(-1);
          });

      it('should return -1 for start and end if entire selection ' +
          'is after the element', function() {
            range.selectNodeContents(el[4]);
            selObj.addRange(range);
            var start = DomTextSelection.offsetRelativeWithin(el[2], 'start');
            var end = DomTextSelection.offsetRelativeWithin(el[2], 'end');
            expect(start).toBe(-1);
            expect(end).toBe(-1);
          });

      it('should return -1 for start and end if element is wholly selected',
         function() {
           range.setStart(el[0], 0);
           range.setEnd(el[4], 0);
           selObj.addRange(range);
           var start = DomTextSelection.offsetRelativeWithin(el[2], 'start');
           var end = DomTextSelection.offsetRelativeWithin(el[2], 'end');
           expect(start).toBe(-1);
           expect(end).toBe(-1);
         });

      it('should return correct offset for start and end', function() {
        range.setStart(el[3].firstChild, 2);
        range.setEnd(el[3].firstChild, 5);
        selObj.addRange(range);
        var start = DomTextSelection.offsetRelativeWithin(el[3], 'start');
        var end = DomTextSelection.offsetRelativeWithin(el[3], 'end');
        expect(start).toBe(2);
        expect(end).toBe(5);
      });

    });

    describe('textNodeAt', function() {

      var el, t1, t2, t3, t4, t5, t6;

      beforeEach(function() {
        el = document.createElement('span');
        t1 = document.createTextNode('hello');
        t2 = document.createTextNode(' world');
        t3 = document.createTextNode(' how');
        t4 = document.createTextNode(' are');
        t5 = document.createTextNode(' you');
        t6 = document.createTextNode(' doing');
        el.appendChild(t1);
        el.appendChild(t2);
        el.appendChild(t3);
        el.appendChild(t4);
        el.appendChild(t5);
        el.appendChild(t6);
      });

      it('should return the right textNode', function() {
        var context = {};
        var x = DomTextSelection.textNodeAt(el, 14, context);
        expect(x.textContent).toBe(' how');
        expect(x).toBe(t3);
        expect(context.textNodeIndex).toBe(2);
        expect(context.relativeOffset).toBe(3);
      });

      it('should find textNode at start offset of element', function() {
        var context = {};
        var x = DomTextSelection.textNodeAt(el, 0, context);
        expect(x.textContent).toBe('hello');
        expect(x).toBe(t1);
        expect(context.textNodeIndex).toBe(0);
        expect(context.relativeOffset).toBe(0);
      });

      it('should find textNode at end offset of element', function() {
        var context = {};
        var x = DomTextSelection.textNodeAt(el, el.textContent.length, context);
        expect(x.textContent).toBe(' doing');
        expect(x).toBe(t6);
        expect(context.textNodeIndex).toBe(5);
        expect(context.relativeOffset).toBe(6);
      });

      it('should return undefined if offset out of range negative', function() {
        var context = {};
        var x = DomTextSelection.textNodeAt(el, -10, context);
        expect(x).toBe(undefined);
        expect(context.textNodeIndex).toBe(undefined);
        expect(context.relativeOffset).toBe(undefined);
      });

      it('should return undefined if offset out of range positive', function() {
        var context = {};
        var x = DomTextSelection.textNodeAt(el, 999, context);
        expect(x).toBe(undefined);
        expect(context.textNodeIndex).toBe(undefined);
        expect(context.relativeOffset).toBe(undefined);
      });
    });

    describe('iterateSelection', function() {

      var p, s, visited = [], logVisits;

      beforeEach(function() {
        // Setup test area for selection tests.
        var testArea = TestUtils.createTestAppendArea();
        // Create 5 paragraphs, each with 5 spans.
        // Each span with one textNode except the second
        // span that has two textNodes;
        var i, j;
        for (j = 0; j < 5; j++) {
          p = document.createElement('p');
          p.id = 'para' + j;
          for (i = 0; i < 5; i++) {
            s = document.createElement('span');
            s.id = j + '-span' + i;
            s.appendChild(document.createTextNode('hello'));
            if (i === 1) {
              // Make second span special and give it two text nodes.
              s.appendChild(document.createTextNode('hello'));
            }
            p.appendChild(s);
          }
          testArea.appendChild(p);
        }
        // Create a logVisits function which can be used in the tests.
        logVisits = function(node) {
          if (node.id) {
            visited.push(node.id);
          } else {
            visited.push('textNode');
          }
        };
      });

      afterEach(function() {
        TestUtils.removeTestAppendArea();
        s = [];
        visited = [];
      });

      it('should support iterations over spans inside a para', function() {
        // Select from middle of second span in the first para
        // to middle of fourth span in the first para.
        var charPos = 2;
        var startSpan = document.getElementById('0-span1');
        var endSpan = document.getElementById('0-span3');
        var selObj = window.getSelection();
        var range = document.createRange();
        range.setStart(startSpan.firstChild, charPos);
        range.setEnd(endSpan.firstChild, charPos);
        selObj.removeAllRanges();
        selObj.addRange(range);
        var includePartial = true;
        DomTextSelection.iterateSelection(logVisits, includePartial, range);
        expect(visited.length).toBe(4);
        expect(visited[0]).toBe('para0');
        expect(visited[1]).toBe('0-span1');
        expect(visited[2]).toBe('0-span2');
        expect(visited[3]).toBe('0-span3');
      });

      it('should iterate all paragraphs and containing spans', function() {
        // Select from middle of second span in the first para
        // to middle of third span in the third para.
        var charPos = 2;
        var startSpan = document.getElementById('0-span1');
        var endSpan = document.getElementById('2-span2');
        var selObj = window.getSelection();
        var range = document.createRange();
        range.setStart(startSpan.firstChild, charPos);
        range.setEnd(endSpan.firstChild, charPos);
        selObj.removeAllRanges();
        selObj.addRange(range);
        var includePartial = true;
        DomTextSelection.iterateSelection(logVisits, includePartial, range);
        expect(visited.length).toBe(16);
        expect(visited[0]).toBe('testAppendArea');
        expect(visited[1]).toBe('para0');
        expect(visited[2]).toBe('0-span1');
        expect(visited[3]).toBe('0-span2');
        expect(visited[4]).toBe('0-span3');
        expect(visited[5]).toBe('0-span4');
        expect(visited[6]).toBe('para1');
        expect(visited[7]).toBe('1-span0');
        expect(visited[8]).toBe('1-span1');
        expect(visited[9]).toBe('1-span2');
        expect(visited[10]).toBe('1-span3');
        expect(visited[11]).toBe('1-span4');
        expect(visited[12]).toBe('para2');
        expect(visited[13]).toBe('2-span0');
        expect(visited[14]).toBe('2-span1');
        expect(visited[15]).toBe('2-span2');
      });

      it('should iterate containing span when selection is inside textNode',
         function() {
           // Select from one part of the second span to another part in that
           // same span... so just partially select the text in span2 and
           // verify that we still iterate span2.
           // var selObj = window.getSelection();
           var range = document.createRange();
           var containingSpan = document.getElementById('0-span1');
           range.setStart(containingSpan.firstChild, 1);
           range.setEnd(containingSpan.firstChild, 2);
           // selObj.removeAllRanges();
           // selObj.addRange(range);
           var includePartial = true;
           DomTextSelection.iterateSelection(logVisits, includePartial, range);
           expect(visited.length).toBe(1);
           expect(visited[0]).toBe('0-span1');
         });

      it('should not iterate a partially-included text node when ' +
         ' includePartial is false.',
        function() {
          var range = document.createRange();
          var span = document.getElementById('0-span0');
          range.setStart(span.firstChild, 1);
          range.setEnd(span.firstChild, 4);
          var includePartial = false;
          DomTextSelection.iterateSelection(logVisits, includePartial, range);
          expect(visited.length).toBe(0);
        });

      it('should iterate a partially-included text node when ' +
         ' includePartial is true.',
        function() {
          var range = document.createRange();
          var span = document.getElementById('0-span0');
          range.setStart(span.firstChild, 1);
          range.setEnd(span.firstChild, 4);
          var includePartial = true;
          DomTextSelection.iterateSelection(logVisits, includePartial, range);
          expect(visited.length).toBe(1);
          expect(visited[0]).toBe('0-span0');
        });

      it('should only iterate fully-selected nodes when includePartial ' +
         'is false.',
        function() {
          var range = document.createRange();
          var startSpan = document.getElementById('0-span0');
          var endSpan = document.getElementById('0-span2');
          range.setStart(startSpan.firstChild, 1);
          range.setEnd(endSpan.firstChild, 4);
          var includePartial = false;
          DomTextSelection.iterateSelection(logVisits, includePartial, range);
          expect(visited.length).toBe(1);
          expect(visited[0]).toBe('0-span1');
        });

      it('should iterate partially-selected nodes when includePartial ' +
         'is true.',
        function() {
          var range = document.createRange();
          var startSpan = document.getElementById('0-span1');
          var endSpan = document.getElementById('0-span3');
          range.setStart(startSpan.firstChild, 1);
          range.setEnd(endSpan.firstChild, 4);
          var includePartial = true;
          DomTextSelection.iterateSelection(logVisits, includePartial, range);
          expect(visited.length).toBe(4);
          expect(visited[0]).toBe('para0');
          expect(visited[1]).toBe('0-span1');
          expect(visited[2]).toBe('0-span2');
          expect(visited[3]).toBe('0-span3');
        });
    });

    describe('getAdjustedSelectionRange', function() {
      var word = 'hello';
      beforeEach(function() {
        // Setup test area for selection tests.
        var testArea = TestUtils.createTestAppendArea();
        // Create 1 paragraph with 4 spans.
        // Each span with one textNode
        var p = document.createElement('p');
        p.id = 'para';
        for (var i = 0; i < 4; i++) {
          var s = document.createElement('span');
          s.id = 'span' + i;
          s.appendChild(document.createTextNode(word));
          p.appendChild(s);
        }
        testArea.appendChild(p);
      });

      afterEach(function() {
        TestUtils.removeTestAppendArea();
      });

      it('should expand a fully-selected text node to include the ' +
         'surrounding <span>', function() {
          var span = document.getElementById('span2');
          var selection = window.getSelection();
          var range = document.createRange();
          range.setStart(span.firstChild, 0);
          range.setEnd(span.firstChild, word.length);
          selection.removeAllRanges(0);
          selection.addRange(range);

          var adjustedRange = DomTextSelection.getAdjustedSelectionRange();
          expect(adjustedRange.startContainer).toBe(span);
          expect(adjustedRange.endContainer).toBe(span);
          expect(adjustedRange.startOffset).toBe(0);
          expect(adjustedRange.endOffset).toBe(1);
      });

      it('should not expand a partially-selected text node to include the ' +
         'surrounding <span>', function() {
          var span = document.getElementById('span2');
          var selection = window.getSelection();
          var range = document.createRange();
          range.setStart(span.firstChild, 1);
          range.setEnd(span.firstChild, word.length - 1);
          selection.removeAllRanges(0);
          selection.addRange(range);

          var adjustedRange = DomTextSelection.getAdjustedSelectionRange();
          expect(adjustedRange.startContainer).toBe(span.firstChild);
          expect(adjustedRange.endContainer).toBe(span.firstChild);
          expect(adjustedRange.startOffset).toBe(1);
          expect(adjustedRange.endOffset).toBe(word.length - 1);
      });

      it('should expand fully-selected text nodes across <span>s ',
        function() {
          var span1 = document.getElementById('span1');
          var span2 = document.getElementById('span2');
          var selection = window.getSelection();
          var range = document.createRange();
          range.setStart(span1.firstChild, 0);
          range.setEnd(span2.firstChild, word.length);
          selection.removeAllRanges(0);
          selection.addRange(range);

          var adjustedRange = DomTextSelection.getAdjustedSelectionRange();
          expect(adjustedRange.startContainer).toBe(span1);
          expect(adjustedRange.endContainer).toBe(span2);
          expect(adjustedRange.startOffset).toBe(0);
          expect(adjustedRange.endOffset).toBe(1);
      });

      it('should not expand partially-selected text nodes across <span>s ',
        function() {
          var span1 = document.getElementById('span1');
          var span2 = document.getElementById('span2');
          var selection = window.getSelection();
          var range = document.createRange();
          range.setStart(span1.firstChild, 1);
          range.setEnd(span2.firstChild, word.length - 1);
          selection.removeAllRanges(0);
          selection.addRange(range);

          var adjustedRange = DomTextSelection.getAdjustedSelectionRange();
          expect(adjustedRange.startContainer).toBe(span1.firstChild);
          expect(adjustedRange.endContainer).toBe(span2.firstChild);
          expect(adjustedRange.startOffset).toBe(1);
          expect(adjustedRange.endOffset).toBe(word.length - 1);
      });

      it('should handle two nodes with different amounts of selection (1)',
        function() {
          var span1 = document.getElementById('span1');
          var span2 = document.getElementById('span2');
          var selection = window.getSelection();
          var range = document.createRange();
          range.setStart(span1.firstChild, 0);
          range.setEnd(span2.firstChild, word.length - 1);
          selection.removeAllRanges(0);
          selection.addRange(range);

          var adjustedRange = DomTextSelection.getAdjustedSelectionRange();
          expect(adjustedRange.startContainer).toBe(span1);
          expect(adjustedRange.endContainer).toBe(span2.firstChild);
          expect(adjustedRange.startOffset).toBe(0);
          expect(adjustedRange.endOffset).toBe(word.length - 1);
      });

      it('should handle two nodes with different amounts of selection (2)',
        function() {
          var span1 = document.getElementById('span1');
          var span2 = document.getElementById('span2');
          var selection = window.getSelection();
          var range = document.createRange();
          range.setStart(span1.firstChild, 1);
          range.setEnd(span2.firstChild, word.length);
          selection.removeAllRanges(0);
          selection.addRange(range);

          var adjustedRange = DomTextSelection.getAdjustedSelectionRange();
          expect(adjustedRange.startContainer).toBe(span1.firstChild);
          expect(adjustedRange.endContainer).toBe(span2);
          expect(adjustedRange.startOffset).toBe(1);
          expect(adjustedRange.endOffset).toBe(1);
      });

    });

    describe('Tree Walker', function() {

      var treeWalkerTestArea;
      var topPara, span = [];

      beforeEach(function() {
        treeWalkerTestArea = TestUtils.createTestAppendArea();
        // Create some HTML.
        topPara = document.createElement('p');
        topPara.id = 'ancestor';
        var words = ['one', 'two', 'three'];
        for (var i = 0; i < words.length; i++) {
          span[i] = document.createElement('span');
          span[i].id = 'span' + i;
          span[i].appendChild(document.createTextNode(words[i]));
          topPara.appendChild(span[i]);
        }
        treeWalkerTestArea.appendChild(topPara);
      });

      afterEach(function() {
        TestUtils.removeTestAppendArea();
      });

      it('should allow me to walk the selection ' +
          'including partially selected nodes ', function() {
            var selObj, range, walker;
            // Select from middle of second span (span[1]) to span[2].
            selObj = window.getSelection();
            range = document.createRange();
            range.setStart(span[1].firstChild, 1);
            range.setEnd(span[2].firstChild, 2);
            selObj.removeAllRanges();
            selObj.addRange(range);
            walker = DomTextSelection.createWalker(true);
            var expectedNodes = [
              'span1',
              '#text',
              'span2',
              '#text'
            ];
            var n, i = 0;
            while ((n = walker.nextNode())) {
              if (n.nodeType === Node.TEXT_NODE) {
                expect(n.nodeName).toBe(expectedNodes[i]);
              } else {
                expect(n.id).toBe(expectedNodes[i]);
              }
              i++;
            }
          });

      it('should be empty if no nodes were wholly selected and i was ' +
          'ignoring partially selected nodes', function() {
            var selObj, range, walker;
            // Select from middle of second span (span[1]) to span[2].
            selObj = window.getSelection();
            range = document.createRange();
            range.setStart(span[1].firstChild, 1);
            range.setEnd(span[2].firstChild, 2);
            selObj.removeAllRanges();
            selObj.addRange(range);
            walker = DomTextSelection.createWalker(false);
            var commonAncestor = walker.currentNode;
            expect(commonAncestor.id).toBe('ancestor');
            expect(walker.nextNode()).toBe(null);
          });

      it('should have the commonAncestor in currentNode ' +
          'even when it is a TEXT_NODE', function() {
            var selObj, range, walker;
            // Select from one part of a TEXT_NODE to another
            // part of the same TEXT_NODE.
            selObj = window.getSelection();
            range = document.createRange();
            range.setStart(span[1].firstChild, 1);
            range.setEnd(span[1].firstChild, 2);
            selObj.removeAllRanges();
            selObj.addRange(range);
            walker = DomTextSelection.createWalker(false);
            var commonAncestor = walker.currentNode;
            expect(commonAncestor.nodeType).toBe(Node.TEXT_NODE);
            expect(walker.nextNode()).toBe(null);
          });

      it('should allow me to walk the selection ' +
          'ignoring partially selected nodes', function() {
            var selObj, range, walker;
            // Select from middle of first span (span[0]) to span[2].
            selObj = window.getSelection();
            range = document.createRange();
            range.setStart(span[0].firstChild, 1);
            range.setEnd(span[2].firstChild, 2);
            selObj.removeAllRanges();
            selObj.addRange(range);
            walker = DomTextSelection.createWalker(false);
            var expectedNodes = [
              'span1',
              '#text'
            ];
            var n, i = 0;
            while ((n = walker.nextNode())) {
              if (n.nodeType === Node.TEXT_NODE) {
                expect(n.nodeName).toBe(expectedNodes[i]);
              } else {
                expect(n.id).toBe(expectedNodes[i]);
              }
              i++;
            }
          });

      it('should allow me to add my own filter to the walker', function() {
        var selObj, range, walker;
        // Select from middle of first span (span[0]) to span[2].
        selObj = window.getSelection();
        range = document.createRange();
        range.setStart(span[0].firstChild, 1);
        range.setEnd(span[2].firstChild, 2);
        selObj.removeAllRanges();
        selObj.addRange(range);
        function _myFilter(node) {
          return (node && node.nodeType === Node.TEXT_NODE) ?
              NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
        }
        walker = DomTextSelection.createWalker(false, _myFilter);
        var expectedNodes = [
          'span1'
        ];
        var n, i = 0;
        while ((n = walker.nextNode())) {
          if (n.nodeType === Node.TEXT_NODE) {
            expect(n.nodeName).toBe(expectedNodes[i]);
          } else {
            expect(n.id).toBe(expectedNodes[i]);
          }
          i++;
        }

      });

    });

  });

  describe('DomTextSelection new startNode & endNode functions', function() {

    var testArea,
        paragraphs = {},
        charruns = {},
        setSelection;

    beforeEach(function() {
      testArea = TestUtils.createTestAppendArea();
      var pi, pt = 2, si, st = 3, sid;
      for (pi = 0; pi < pt; pi++) {
        paragraphs[pi] = document.createElement('p');
        paragraphs[pi].id = 'P' + pi;
        for (si = 0; si < st; si++) {
          sid = pi + '' + si;
          charruns[sid] = document.createElement('span');
          charruns[sid].id = 'S' + sid;
          if (si % 2) {
            charruns[sid].style.fontWeight = 'bold';
          }
          charruns[sid].appendChild(document.createTextNode('xxx'));
          paragraphs[pi].appendChild(charruns[sid]);
        }
        testArea.appendChild(paragraphs[pi]);
      }
      window.getSelection().removeAllRanges();

      /**
       * Set the browser selection to a specific node and offset.
       * If only left is passed a caret will be created.
       * @param {Object} left Container node and offset.
       * @param {Object} right Container node and offset.
       * @return {Object} The browser selection object.
       */
      setSelection = function(left, right) {
        var range, selection;
        range = document.createRange();
        range.setStart(left.node, left.offset);
        range.setEnd(
                     right ? right.node : left.node,
                     right ? right.offset : left.offset);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        return selection;
      };

    });

    afterEach(function() {
      TestUtils.removeTestAppendArea();
      testArea = undefined;
      paragraphs = {};
      charruns = {};
      setSelection = undefined;
    });

    describe('getRange()', function() {

      it('should return a caret range object that does not change when the' +
          ' browser selection changes', function() {
            var browserSelection = setSelection(
                {node: charruns['00'].childNodes[0], offset: 0});
            var moduleRange = DomTextSelection.getRange();
            expect(moduleRange).toBeDefined();
            expect(moduleRange.isCollapsed).toBe(true);
            expect(moduleRange.startContainer).toBe(
                charruns['00'].childNodes[0]);
            expect(moduleRange.endContainer).toBe(charruns['00'].childNodes[0]);
            expect(moduleRange.startOffset).toBe(0);
            expect(moduleRange.endOffset).toBe(0);

            setSelection({node: charruns['01'].childNodes[0], offset: 1});
            var browserRange = browserSelection.getRangeAt(0);
            expect(browserRange).toBeDefined();
            expect(browserSelection.isCollapsed).toBe(true);
            expect(browserRange.startContainer).toBe(
                charruns['01'].childNodes[0]);
            expect(browserRange.endContainer).toBe(
                charruns['01'].childNodes[0]);
            expect(browserRange.startOffset).toBe(1);
            expect(browserRange.endOffset).toBe(1);

            expect(moduleRange).toBeDefined();
            expect(moduleRange.isCollapsed).toBe(true);
            expect(moduleRange.startContainer).toBe(
                charruns['00'].childNodes[0]);
            expect(moduleRange.endContainer).toBe(charruns['00'].childNodes[0]);
            expect(moduleRange.startOffset).toBe(0);
            expect(moduleRange.endOffset).toBe(0);
          });

      it('should return a selection range object that does not change when ' +
          'the browser selection changes', function() {
            var browserSelection = setSelection(
                {node: charruns['00'].childNodes[0], offset: 0},
                {node: charruns['00'].childNodes[0], offset: 3});
            var moduleRange = DomTextSelection.getRange();
            expect(moduleRange).toBeDefined();
            expect(moduleRange.isCollapsed).toBe(false);
            expect(moduleRange.startContainer).toBe(
                charruns['00'].childNodes[0]);
            expect(moduleRange.endContainer).toBe(charruns['00'].childNodes[0]);
            expect(moduleRange.startOffset).toBe(0);
            expect(moduleRange.endOffset).toBe(3);

            setSelection({node: charruns['01'].childNodes[0], offset: 1},
                {node: charruns['10'].childNodes[0], offset: 2});
            var browserRange = browserSelection.getRangeAt(0);
            expect(browserRange).toBeDefined();
            expect(browserSelection.isCollapsed).toBe(false);
            expect(browserRange.startContainer).toBe(
                charruns['01'].childNodes[0]);
            expect(browserRange.endContainer).toBe(
                charruns['10'].childNodes[0]);
            expect(browserRange.startOffset).toBe(1);
            expect(browserRange.endOffset).toBe(2);

            expect(moduleRange).toBeDefined();
            expect(moduleRange.isCollapsed).toBe(false);
            expect(moduleRange.startContainer).toBe(
                charruns['00'].childNodes[0]);
            expect(moduleRange.endContainer).toBe(charruns['00'].childNodes[0]);
            expect(moduleRange.startOffset).toBe(0);
            expect(moduleRange.endOffset).toBe(3);
          });

    });

    describe('getStartNode() getEndNode()', function() {

      // The browser can sometimes modify the container nodes of a range
      // when setting the selection manually, so we use a Spy here to
      // ensure the function gets the range we expect it to work with.
      var workingRange;

      beforeEach(function() {
        workingRange = {};
        spyOn(DomTextSelection, 'getRange').andCallFake(function() {
          return workingRange;
        });
      });

      afterEach(function() {
        workingRange = undefined;
      });

      // TODO dtilley We should write some tests for RtL languages

      it('should return the correct start & end node for the caret set in a ' +
          'text node', function() {
            workingRange = {
              isCollapsed: true,
              startContainer: charruns['00'].childNodes[0],
              endContainer: charruns['00'].childNodes[0],
              startOffset: 0,
              endOffset: 0
            };
            var startNode = DomTextSelection.startNode();
            expect(startNode.id).toBe(charruns['00'].id);
            var endNode = DomTextSelection.endNode();
            expect(endNode.id).toBe(charruns['00'].id);
          });

      it('should return the correct start & end node for a selection set in ' +
          'a text nodes', function() {
            workingRange = {
              isCollapsed: true,
              startContainer: charruns['00'].childNodes[0],
              endContainer: charruns['12'].childNodes[0],
              startOffset: 0,
              endOffset: 3
            };
            var startNode = DomTextSelection.startNode();
            expect(startNode.id).toBe(charruns['00'].id);
            var endNode = DomTextSelection.endNode();
            expect(endNode.id).toBe(charruns['12'].id);
          });

      it('should return the correct start & end node for the caret set ' +
          'before a character run span', function() {
            workingRange = {
              isCollapsed: true,
              startContainer: paragraphs['0'],
              endContainer: paragraphs['0'],
              startOffset: 0,
              endOffset: 0
            };
            var startNode = DomTextSelection.startNode();
            expect(startNode.id).toBe(charruns['00'].id);
            var endNode = DomTextSelection.endNode();
            expect(endNode.id).toBe(charruns['00'].id);
          });

      it('should return the correct start & end node for a selection set ' +
          'before character run spans', function() {
            workingRange = {
              isCollapsed: true,
              startContainer: paragraphs['0'],
              endContainer: paragraphs['1'],
              startOffset: 0,
              endOffset: 0
            };
            var startNode = DomTextSelection.startNode();
            expect(startNode.id).toBe(charruns['00'].id);
            var endNode = DomTextSelection.endNode();
            expect(endNode.id).toBe(charruns['10'].id);
          });

      it('should return the correct start & end node for the caret set after ' +
          'a character run span', function() {
            workingRange = {
              isCollapsed: true,
              startContainer: paragraphs['0'],
              endContainer: paragraphs['0'],
              startOffset: 1,
              endOffset: 1
            };
            var startNode = DomTextSelection.startNode();
            expect(startNode.id).toBe(charruns['01'].id);
            var endNode = DomTextSelection.endNode();
            expect(endNode.id).toBe(charruns['00'].id);
          });

      it('should return the correct start & end node for a selection set ' +
          'after character run spans', function() {
            workingRange = {
              isCollapsed: true,
              startContainer: paragraphs['0'],
              endContainer: paragraphs['1'],
              startOffset: 1,
              endOffset: 1
            };
            var startNode = DomTextSelection.startNode();
            expect(startNode.id).toBe(charruns['01'].id);
            var endNode = DomTextSelection.endNode();
            expect(endNode.id).toBe(charruns['10'].id);
          });

      it('should return the correct start & end node for the caret set after ' +
          'the last character run span in a paragraph', function() {
            workingRange = {
              isCollapsed: true,
              startContainer: paragraphs['0'],
              endContainer: paragraphs['0'],
              startOffset: 3,
              endOffset: 3
            };
            var startNode = DomTextSelection.startNode();
            expect(startNode.id).toBe(charruns['02'].id);
            var endNode = DomTextSelection.endNode();
            expect(endNode.id).toBe(charruns['02'].id);
          });

      it('should return the correct start & end node for a selection set ' +
          'after the last character run spans in a paragraph', function() {
            workingRange = {
              isCollapsed: true,
              startContainer: paragraphs['0'],
              endContainer: paragraphs['1'],
              startOffset: 3,
              endOffset: 3
            };

            var startNode = DomTextSelection.startNode();
            expect(startNode.id).toBe(charruns['02'].id);
            var endNode = DomTextSelection.endNode();
            expect(endNode.id).toBe(charruns['12'].id);
          });

    });

  });

  return {};

});
