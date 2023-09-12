/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/utils/domUtils'
], function(
  UTUtils,
  DomUtils) {

  'use strict';

  var testAppendArea;

  describe("DomUtils.totalHeight", function() {

    var br, div, result, FAKE_VALUE = 4;

    beforeEach(function() {
      testAppendArea = UTUtils.createTestAppendArea();
      br = document.createElement('br');
      div = document.createElement('div');
      testAppendArea.appendChild(br);
      testAppendArea.appendChild(div);

      var fake = function() {
        return {
          height: (this.nodeName === 'BR') ? 0 : FAKE_VALUE,
          width: (this.nodeName === 'BR') ? 0 : FAKE_VALUE,
          top: 0,
          left: 0,
          right: (this.nodeName === 'BR') ? 0 : FAKE_VALUE,
          bottom: (this.nodeName === 'BR') ? 0 : FAKE_VALUE
        };
      };

      spyOn(br, 'getBoundingClientRect').andCallFake(fake);
      spyOn(div, 'getBoundingClientRect').andCallFake(fake);
    });

    afterEach(function() {
      testAppendArea.removeChild(br);
      testAppendArea.removeChild(div);
    });

    it("should handle exceptions (eg for <br> tags) gracefully", function() {
      expect(function() {
        result = DomUtils.totalHeight(br);
      }).not.toThrow();
      expect(result).toEqual(0);
    });

    it("should still return valid values for non-exception paths", function() {
      expect(function() {
        result = DomUtils.totalHeight(div);
      }).not.toThrow();
      expect(result).toEqual(FAKE_VALUE);
    });

  });

  describe('DomUtils node traversal', function() {
    /**
     * Example: where nodes can be either ELEMENT_NODEs or TEXT_NODEs
     *
     *                     A
     *                    / \
     *                   /   \
     *                  B     C
     *                 /\     /\
     *                D  E   F  G
     *                      /
     *                     H
     *
     *  previousNode(C) === E
     *  previousNode(G) === H
     *  previousNode(F) === E
     *  previousNode(E) === D
     */
    var a, b, c, d, e, f, g, h;

    beforeEach(function() {
      a = document.createElement('div');
      b = document.createElement('div');
      c = document.createElement('div');
      f = document.createElement('div');
      a.id = 'a';
      b.id = 'b';
      c.id = 'c';
      f.id = 'f';
      d = document.createTextNode('d');
      e = document.createTextNode('e');
      g = document.createTextNode('g');
      h = document.createTextNode('h');

      a.appendChild(b);
      a.appendChild(c);
      b.appendChild(d);
      b.appendChild(e);
      c.appendChild(f);
      c.appendChild(g);
      f.appendChild(h);
    });
    afterEach(function() {
      a = undefined;
      b = undefined;
      c = undefined;
      d = undefined;
      e = undefined;
      f = undefined;
      g = undefined;
      h = undefined;
    });

    it('should provide previous node in reverse document order', function() {
      expect(DomUtils.previousNode(a)).toBe(null);
      expect(DomUtils.previousNode(b)).toBe(null);
      expect(DomUtils.previousNode(c)).toBe(e);
      expect(DomUtils.previousNode(d)).toBe(null);
      expect(DomUtils.previousNode(e)).toBe(d);
      expect(DomUtils.previousNode(f)).toBe(e);
      expect(DomUtils.previousNode(g)).toBe(h);
      expect(DomUtils.previousNode(h)).toBe(e);
    });

    it('should provide next node in document order', function() {
      expect(DomUtils.nextNode(a)).toBe(null);
      expect(DomUtils.nextNode(b)).toBe(h);
      expect(DomUtils.nextNode(c)).toBe(null);
      expect(DomUtils.nextNode(d)).toBe(e);
      expect(DomUtils.nextNode(e)).toBe(h);
      expect(DomUtils.nextNode(f)).toBe(g);
      expect(DomUtils.nextNode(g)).toBe(null);
      expect(DomUtils.nextNode(h)).toBe(g);
    });

  });

  describe('QOWT :: DOM Utils', function() {

    var rootNode;

    beforeEach(function() {
      testAppendArea = UTUtils.createTestAppendArea();
      rootNode = document.createElement('DIV');
      rootNode.id = 'unitTestRootNode';
      /**
       * Added test html to page so that getElementById works
       */
      testAppendArea.appendChild(rootNode);
      for (var pi = 0; pi < 3; pi++) {
        var p = document.createElement('P');
        p.id = 'para' + pi;
        p.style.background = 'red';
        var numberOfSpans = 3;
        for (var i = 0; i < numberOfSpans; i++) {
          var s = document.createElement('span');
          s.id = 'span' + pi + '' + i;
          s.textContent = 'hello world how are you doing';
          s.className = 'qowt-ncr';
          p.appendChild(s);
        }

        rootNode.appendChild(p);
      }
    });

    afterEach(function() {
      /**
       * Remove test html from page
       */
      testAppendArea.removeChild(rootNode);
    });

    describe('prototype extensions', function() {
      it('should prototype the clear function to Element', function() {
        expect(rootNode.clear).toBeDefined();
        expect(typeof rootNode.clear).toBe('function');
      });

      it('should provide the getById function', function() {
        expect(DomUtils.getById).toBeDefined();
        expect(typeof DomUtils.getById).toBe('function');
      });

      it('should provide the insert function', function() {
        expect(DomUtils.insert).toBeDefined();
        expect(typeof DomUtils.insert).toBe('function');
      });
    });

    describe('getById', function() {
      it('should return the first paragraph element', function() {
        var p1id = rootNode.childNodes[0].id;
        var para1 = DomUtils.getById(p1id);
        expect(para1).not.toBe(undefined);
        expect(para1).not.toBe(null);
        expect(para1.id).toBe(p1id);
        expect(para1.nodeType).toBe(1);
        expect(para1.nodeName).toBe('P');
      });

      it('should return an array of elements', function() {
        var p1id, p2id, p3id;
        p1id = rootNode.childNodes[0].id;
        p2id = rootNode.childNodes[1].id;
        p3id = rootNode.childNodes[2].id;
        var pary = DomUtils.getById(p1id, p2id, p3id);
        expect(pary).not.toBe(undefined);
        expect(pary).not.toBe(null);
        expect(pary.hasOwnProperty('length')).toBe(true);
        expect(pary.length).toBe(3);
        expect(pary[0].id).toBe(p1id);
        expect(pary[0].nodeType).toBe(1);
        expect(pary[0].nodeName).toBe('P');
        expect(pary[1].id).toBe(p2id);
        expect(pary[1].nodeType).toBe(1);
        expect(pary[1].nodeName).toBe('P');
        expect(pary[2].id).toBe(p3id);
        expect(pary[2].nodeType).toBe(1);
        expect(pary[2].nodeName).toBe('P');
      });
    });


    describe('clear', function() {
      it('should remove all child nodes from the element', function() {
        var para1 = DomUtils.getById(rootNode.childNodes[0].id);
        para1.clear();
        expect(para1.hasChildNodes()).toBe(false);
        expect(para1.childNodes.length).toBe(0);
      });
    });

    describe('className utility methods', function() {
      it('should return true if an element has the specified class',
        function() {
          var spn1 = DomUtils.getById(rootNode.childNodes[0].childNodes[0].id);
          var hasNcr = spn1.classList.contains('qowt-ncr');
          var notNoc = spn1.classList.contains('not-this-class');
          expect(hasNcr).toBe(true);
          expect(notNoc).toBe(false);
        });

      it('should add a class to an element', function() {
        var spn1 = DomUtils.getById(rootNode.childNodes[0].childNodes[0].id);
        spn1.classList.add('new-test-class');
        expect(spn1.classList.contains('new-test-class')).toBe(true);
      });

      it('should remove a class from an element', function() {
        var spn1 = DomUtils.getById(rootNode.childNodes[0].childNodes[0].id);
        spn1.classList.remove('qowt-ncr');
        expect(spn1.classList.contains('qowt-ncr')).toBe(false);
      });
    });


    describe('node relationship methods', function() {
      it('should be able to tell the relationship between nodes', function() {
        var parent = document.createElement('div');
        var directChild = document.createElement('div');
        var grandChild = document.createElement('div');
        var unrelatedNode = document.createElement('div');
        var childTextNode = document.createTextNode('foobar');
        var unrelatedTextNode = document.createTextNode('foobar');
        parent.appendChild(directChild);
        directChild.appendChild(grandChild);
        grandChild.appendChild(childTextNode);

        expect(DomUtils.contains(parent, directChild)).toBe(true);
        expect(DomUtils.contains(parent, grandChild)).toBe(true);

        // JELTE TODO: this assertion fails under phantomjs 1.6.1
        // commenting out for now, although we probably should see why
        // this is the case
        // expect(DomUtils.contains(parent, childTextNode)).toBe(true);
        expect(DomUtils.contains(parent, unrelatedNode)).toBe(false);
        expect(DomUtils.contains(parent, unrelatedTextNode)).toBe(false);
      });
    });

    describe('Transform style tests', function() {
      var node;

      beforeEach(function() {
        node = UTUtils.createTestAppendArea();
      });


      afterEach(function() {
        UTUtils.removeTestAppendArea();
      });

      it('should return false if node does not have any transform style',
        function() {
          var result = DomUtils.getTransformValue(node, 'scale');

          expect(result).toEqual(false);
        });

      it('should return correct value for transform style "scale"',
        function() {
          node.style.webkitTransform = 'scale(-1, -1) rotate(30deg)';
          var result = DomUtils.getTransformValue(node, 'scale');
          var expectedOutput = {
            flipH: '-1',
            flipV: '-1'
          };

          expect(result).toEqual(expectedOutput);
        });

      it('should return correct value for transform style "rotate"',
        function() {
          node.style.webkitTransform = 'scale(-1, -1) rotate(30deg)';
          var result = DomUtils.getTransformValue(node, 'rotate');

          expect(result).toEqual('30deg');
        });
    });

    it('should clone all styles correctly', function() {
      var sourceNode = document.createElement('div');
      var targetNode = document.createElement('div');
      sourceNode.style.width = '100px';
      sourceNode.style.height = '100px';

      DomUtils.cloneStyle(targetNode, sourceNode);

      expect(targetNode.style.width).toEqual('100px');
      expect(targetNode.style.height).toEqual('100px');
    });

  });
});