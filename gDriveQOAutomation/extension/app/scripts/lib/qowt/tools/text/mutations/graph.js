// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview
 *
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([
  'qowtRoot/utils/idGenerator',
  'qowtRoot/utils/typeUtils'],
  function(
    IdGenerator,
    TypeUtils) {

  'use strict';

  var factory_ = {
    create: function() {
      var api_ = {
        watchNode: function(node) {
          watchedNodes_[getId_(node)] = node;
        },

        addEdge: function(earlierNode, laterNode) {
          if (earlierNode === laterNode) {
            throw new Error('Cannot add an edge from a node to itself');
          }
          var earlier = getOrMakeVertex_(earlierNode);
          var later = getOrMakeVertex_(laterNode);
          if (earlier && later) {
            later.doAfter[getId_(earlier.node)] = earlier;
          }
        },

        traverse: function() {
          var sequencedNodes = [];

          for (var nodeId in watchedNodes_) {
            var vertex = vertices_[nodeId];
            if (!vertex) {
              sequencedNodes.push(watchedNodes_[nodeId]);
            } else {
              traverse_(vertex, sequencedNodes);
            }
          }

          return sequencedNodes;
        }
      };

      function traverse_(vertex, sequencedNodes) {
        if (vertex.added) {
          return;
        }

        if (vertex.entered) {
          throw new Error('Cycle detected in dependency graph');
        }
        vertex.entered = true;

        for (var nodeId in vertex.doAfter) {
          traverse_(vertex.doAfter[nodeId], sequencedNodes);
        }

        vertex.added = true;
        sequencedNodes.push(vertex.node);
      }

      function getId_(node) {
        TypeUtils.checkArgTypes('graph.getId_', {
          node: [node, 'node']
        });
        if (!node.depGraphId) {
          node.depGraphId = IdGenerator.getUniqueId('DepGraph-');
        }
        return node.depGraphId;
      }

      function getOrMakeVertex_(node) {
        var nodeId = getId_(node);
        if (!watchedNodes_[nodeId]) {
          return;
        }
        var vertex = vertices_[nodeId];
        if (!vertex) {
          vertex = {
            id: nodeId,
            node: node,
            doAfter: {},
            entered: false,
            added: false
          };
          Object.seal(vertex);
          vertices_[nodeId] = vertex;
        }
        return vertex;
      }

      var watchedNodes_ = {};
      var vertices_ = {};

      return api_;
    }
  };

  return factory_;
});
