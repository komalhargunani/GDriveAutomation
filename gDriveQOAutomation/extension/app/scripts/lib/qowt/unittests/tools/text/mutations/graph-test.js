// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Tests for graph.js
 *
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([
    'qowtRoot/tools/text/mutations/graph'
  ], function(
    Graph) {

  'use strict';

  describe('tools/text/mutations/graph.js', function() {
    describe('valid traversals', function() {
      it('should traverse with no watched nodes', function() {
        createNodes_(3);
        addEdges_([
          [0, 1],
          [1, 2]
        ]);
      });

      it('should work with simple case', function() {
        createNodes_(3);
        watchNodes_([0, 1, 2]);
        addEdges_([
          [0, 2],
          [2, 1]
        ]);
      });

      it('should work with duplicate edges', function() {
        createNodes_(3);
        watchNodes_([0, 1, 2]);
        addEdges_([
          [0, 2],
          [0, 2]
        ]);
      });

      it('should work without edges', function() {
        createNodes_(3);
        watchNodes_([0, 1, 2]);
      });

      it('should work with some nodes unwatched', function() {
        createNodes_(4);
        watchNodes_([0, 1, 2]);
        addEdges_([
          [0, 2],
          [1, 3],
          [3, 2],
          [0, 1]
        ]);
      });

      describe('ordering derived from 7-3-9-4-2-5-1-6-0-8', function() {
        beforeEach(function() {
          createNodes_(10);
          watchNodes_([0, 2, 4, 6, 8]);
        });

        it('should work with many edges', function() {
          addEdges_([
            [7, 3],
            [9, 4],
            [5, 1],
            [0, 8],
            [2, 6],
            [4, 2],
            [7, 9],
            [3, 4],
            [9, 2],
            [4, 5],
            [1, 0],
            [7, 8],
            [3, 0]
          ]);
        });

        it('should work with fewer edges', function() {
          addEdges_([
            [7, 3],
            [0, 8],
            [2, 6],
            [4, 2],
            [7, 8],
            [3, 0]
          ]);
        });
      });


      it('should work on one parent, many children use case', function() {
        createNodes_(5);
        watchNodes_([0, 1, 2, 3, 4]);
        addEdges_([
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4]
        ]);
      });

      it('should ignore the id attribute when identifying nodes', function() {
        // This is a regression test. Previously, the graph was paying attention
        // to the id node, and detecting cyclic graphs (which aren't supported)
        // when here weren't any.
        createNodes_(3);
        nodes_[0].id = 'foo';
        nodes_[2].id = 'foo';
        watchNodes_([0, 1, 2]);
        addEdges_([
          [0, 1],
          [1, 2]
        ]);
      });

      afterEach(function() {
        var traversal = graph_.traverse();
        expect(sortById_(traversal))
            .toEqual(sortById_(nodes_.filter(isWatchedNode_)));

        beforeRules_.forEach(checkBefore_.bind(undefined, traversal));
      });

      function checkBefore_(traversal, beforeRule) {
        if (isWatchedNode_(beforeRule.before) &&
          isWatchedNode_(beforeRule.after)) {
          var beforeIndex = traversal.indexOf(beforeRule.before);
          expect(beforeIndex).not.toBe(-1);
          var afterIndex = traversal.indexOf(beforeRule.after);
          expect(afterIndex).not.toBe(-1);
          if (beforeIndex >= afterIndex) {
            jasmine.getEnv().currentSpec.fail('Expected ' +
                beforeRule.before + ' to come before ' + beforeRule.after +
                ', but traversal was ' + traversal);
          }
        }
      }

      function sortById_(nodeList) {
        return nodeList.slice().sort(function(node1, node2) {
          return node1.testingId - node2.testingId;
        });
      }
    });

    describe('total ordering of 0-1-2-3-4', function() {
      beforeEach(function() {
        createNodes_(5);
        watchNodes_([0, 1, 2, 3, 4]);
      });
      afterEach(function() {
        expect(graph_.traverse().map(getId_)).toEqual([0, 1, 2, 3, 4]);
      });

      it('edges in order', function() {
        addEdges_([
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4]
        ]);
      });

      it('edges out of order', function() {
        addEdges_([
          [1, 2],
          [3, 4],
          [0, 1],
          [2, 3]
        ]);
      });
    });

    describe('exception on cyclic graph', function() {
      afterEach(function() {
        expect(graph_.traverse.bind(graph_)).toThrow();
      });

      it('2 node cyclic graph', function() {
        createNodes_(2);
        watchNodes_([0, 1]);
        addEdges_([
          [0, 1],
          [1, 0]
        ]);
      });

      it('3 node cyclic graph', function() {
        createNodes_(3);
        watchNodes_([0, 1, 2]);
        addEdges_([
          [0, 1],
          [1, 2],
          [2, 0]
        ]);
      });
    });

    it('should except on edge pointing to itself', function() {
      createNodes_(1);
      watchNodes_([0]);
      expect(graph_.addEdge.bind(graph_, nodes_[0], nodes_[1])).toThrow();
    });

    var graph_;
    var nodes_;
    var beforeRules_;
    beforeEach(function() {
      graph_ = Graph.create();
      nodes_ = [];
      beforeRules_ = [];
    });

    function createNode_() {
      var node = document.createElement('div');
      node.testingId = nodes_.length;
      node.toString = function() {
        return 'node ' + node.testingId;
      };
      nodes_.push(node);
    }

    function createNodes_(count) {
      for (var i = 0; i < count; i++) {
        createNode_();
      }
    }

    function watchNodes_(indexList) {
      indexList.forEach(function(index) {
        var node = nodes_[index];
        graph_.watchNode(node);
        node.testingIsWatched = true;
      });
    }

    function isWatchedNode_(node) {
      return node.testingIsWatched;
    }

    function getId_(node) {
      return node.testingId;
    }

    function addEdges_(edgeList) {
      edgeList.forEach(function(edge) {
        var node1 = nodes_[edge[0]];
        var node2 = nodes_[edge[1]];
        graph_.addEdge(node1, node2);
        beforeRules_.push({
          before: node1,
          after: node2
        });
      });
    }
  });
});