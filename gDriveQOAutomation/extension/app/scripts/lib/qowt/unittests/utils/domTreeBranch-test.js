/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/utils/domTreeBranch'
], function(
    TreeBranch) {

  'use strict';

  describe('Dom Tree Branch', function() {

    var nodeA, nodeB, nodeC, textNode;

    beforeEach(function() {
      nodeA = document.createElement('div');
      nodeB = document.createElement('div');
      nodeC = document.createElement('div');
      textNode = document.createTextNode('hello world');

      nodeA.id = 'nodeA';
      nodeB.id = 'nodeB';
      nodeC.id = 'nodeC';
      textNode.id = 'textNode';

      nodeC.appendChild(textNode);
      nodeB.appendChild(nodeC);
      nodeA.appendChild(nodeB);
    });
    afterEach(function() {
      nodeA = undefined;
      nodeB = undefined;
      nodeC = undefined;
      textNode = undefined;
    });

    it('should give right lenght for a tree branch', function() {
      var branch = new TreeBranch(nodeA, textNode);
      expect(branch.length()).toBe(4);
    });

    it('should ignore nodes outside of the ancestor and child', function() {
      var branch = new TreeBranch(nodeB, nodeC);
      expect(branch.length()).toBe(2);
    });

    it('should work out ancestor vs child order', function() {
      var branch = new TreeBranch(nodeC, nodeA);
      expect(branch.length()).toBe(3);
    });

    it('should have length zero for non-ancestor path', function() {
      var branch = new TreeBranch(document.body, textNode);
      expect(branch.length()).toBe(0);
    });

    describe('iterator', function() {

      beforeEach(function() {
      });
      afterEach(function() {
      });

      function expectPreOrder(iter) {
        expect(iter.node.id).toBe(nodeA.id);
        expect(iter.next().node.id).toBe(nodeB.id);
        expect(iter.next().node.id).toBe(nodeC.id);
        expect(iter.next().node.id).toBe(textNode.id);
        expect(iter.next().node).toBe(undefined);
      }
      function expectPostOrder(iter) {
        expect(iter.node.id).toBe(textNode.id);
        expect(iter.next().node.id).toBe(nodeC.id);
        expect(iter.next().node.id).toBe(nodeB.id);
        expect(iter.next().node.id).toBe(nodeA.id);
        expect(iter.next().node).toBe(undefined);
      }

      it('should default to pre-order', function() {
        var branch = new TreeBranch(nodeA, textNode);
        var iter = branch.iterator();
        expectPreOrder(iter);
      });

      it('should support pre-order', function() {
        var branch = new TreeBranch(nodeA, textNode);
        var iter = branch.iterator('pre-order');
        expectPreOrder(iter);
      });

      it('should support post-order', function() {
        var branch = new TreeBranch(nodeA, textNode);
        var iter = branch.iterator('post-order');
        expectPostOrder(iter);
      });

      it('should return undefined on empty tree', function() {
        var branch = new TreeBranch(document.body, textNode);
        var iter = branch.iterator();
        expect(iter.node).toBe(undefined);
      });
    });
  });
});
