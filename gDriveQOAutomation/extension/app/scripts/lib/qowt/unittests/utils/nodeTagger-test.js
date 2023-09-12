// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit tests for bitwise flag node tagger
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/utils/nodeTagger'
], function(
    NodeTagger) {

  'use strict';

  describe('NodeTagger', function() {

    var labelA = 1,
        labelB = 2,
        labelC = 4,
        labelD = 8,
        labelE = 16,
        labelF = 32,
        labelG = 64;

    beforeEach(function() {
    });
    afterEach(function() {
    });

    it('should correctly tag and be able to test nodes', function() {
      var node1 = document.createElement('div');
      var node2 = document.createElement('div');
      var node3 = document.createElement('div');

      NodeTagger.tag(node1, labelC);
      NodeTagger.tag(node3, labelG);

      // check node1
      expect(NodeTagger.hasTag(node1, labelA)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelB)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelC)).toBe(true);
      expect(NodeTagger.hasTag(node1, labelD)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelE)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelF)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelG)).toBe(false);

      // check node2
      expect(NodeTagger.hasTag(node2, labelA)).toBe(false);
      expect(NodeTagger.hasTag(node2, labelB)).toBe(false);
      expect(NodeTagger.hasTag(node2, labelC)).toBe(false);
      expect(NodeTagger.hasTag(node2, labelD)).toBe(false);
      expect(NodeTagger.hasTag(node2, labelE)).toBe(false);
      expect(NodeTagger.hasTag(node2, labelF)).toBe(false);
      expect(NodeTagger.hasTag(node2, labelG)).toBe(false);

      // check node3
      expect(NodeTagger.hasTag(node3, labelA)).toBe(false);
      expect(NodeTagger.hasTag(node3, labelB)).toBe(false);
      expect(NodeTagger.hasTag(node3, labelC)).toBe(false);
      expect(NodeTagger.hasTag(node3, labelD)).toBe(false);
      expect(NodeTagger.hasTag(node3, labelE)).toBe(false);
      expect(NodeTagger.hasTag(node3, labelF)).toBe(false);
      expect(NodeTagger.hasTag(node3, labelG)).toBe(true);
    });


    it('should return true when checking a node with multiple labels',
       function() {
         var node1 = document.createElement('div');

         NodeTagger.tag(node1, labelC);
         NodeTagger.tag(node1, labelE);

         // check node1
         expect(NodeTagger.hasTag(node1, labelA)).toBe(false);
         expect(NodeTagger.hasTag(node1, labelB)).toBe(false);
         expect(NodeTagger.hasTag(node1, labelC)).toBe(true);
         expect(NodeTagger.hasTag(node1, labelD)).toBe(false);
         expect(NodeTagger.hasTag(node1, labelE)).toBe(true);
         expect(NodeTagger.hasTag(node1, labelF)).toBe(false);
         expect(NodeTagger.hasTag(node1, labelG)).toBe(false);
       });


    it('should be possible to unset a tag', function() {
      var node1 = document.createElement('div');

      NodeTagger.tag(node1, labelC);
      NodeTagger.tag(node1, labelE);
      NodeTagger.untag(node1, labelE);

      // check node1
      expect(NodeTagger.hasTag(node1, labelA)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelB)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelC)).toBe(true);
      expect(NodeTagger.hasTag(node1, labelD)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelE)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelF)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelG)).toBe(false);
    });

    it('should be possible to clear all tags in one go', function() {
      var node1 = document.createElement('div');

      NodeTagger.tag(node1, labelC);
      NodeTagger.tag(node1, labelE);
      NodeTagger.untag(node1, labelE);

      NodeTagger.clearAllTags(node1);

      // check node1
      expect(NodeTagger.hasTag(node1, labelA)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelB)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelC)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelD)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelE)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelF)).toBe(false);
      expect(NodeTagger.hasTag(node1, labelG)).toBe(false);
    });

  });

  return {};
});
