
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit tests for our own prototypal framework functions
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/lib/framework/framework'
], function() {

  'use strict';

  describe('prototypal framework', function() {

    beforeEach(function() {
    });
    afterEach(function() {
    });

    function addChildren(node) {
      var A = document.createElement('div');
      var B = document.createElement('div');
      var C = document.createElement('div');
      var A1 = document.createElement('div');
      var A2 = document.createElement('div');
      var C1 = document.createElement('div');
      var C1a = document.createElement('div');
      var X = document.createElement('div');
      A.id = 'A';
      B.id = 'B';
      C.id = 'C';
      A1.id = 'A1';
      A2.id = 'A2';
      C1.id = 'C1';
      C1a.id = 'C1a';
      X.id = 'X';
      A.appendChild(A1);
      A.appendChild(A2);
      C.appendChild(C1);
      C1.appendChild(C1a);
      node.appendChild(A);
      node.appendChild(B);
      node.appendChild(C);
    }

    it('should find elements by id within other elements', function() {
      var root = document.createElement('div');

      addChildren(root);

      expect(root.getElementById('A').id).toBe('A');
      expect(root.getElementById('B').id).toBe('B');
      expect(root.getElementById('C').id).toBe('C');
      expect(root.getElementById('A1').id).toBe('A1');
      expect(root.getElementById('A2').id).toBe('A2');
      expect(root.getElementById('C1').id).toBe('C1');
      expect(root.getElementById('C1a').id).toBe('C1a');
      expect(root.getElementById('X')).toBe(null);
    });

    it('should find elements by id within a document fragment', function() {
      var root = document.createDocumentFragment();

      addChildren(root);

      expect(root.getElementById('A').id).toBe('A');
      expect(root.getElementById('B').id).toBe('B');
      expect(root.getElementById('C').id).toBe('C');
      expect(root.getElementById('A1').id).toBe('A1');
      expect(root.getElementById('A2').id).toBe('A2');
      expect(root.getElementById('C1').id).toBe('C1');
      expect(root.getElementById('C1a').id).toBe('C1a');
      expect(root.getElementById('X')).toBe(null);
    });

  });

  return {};
});
