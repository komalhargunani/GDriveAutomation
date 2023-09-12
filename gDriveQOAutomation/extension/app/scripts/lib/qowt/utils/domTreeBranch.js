/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview object representing the branch of a
 * html tree between two nodes
 *
 * TODO(jliebrand): we should move all /utils/dom* modules under
 * their own utils/dom/ folder
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define(['qowtRoot/utils/domUtils'], function(DomUtils) {

  'use strict';

  var TreeBranch = function(nodeA, nodeB) {
    this.branch_ = [];
    // start at child
    var node, ancestor, child;
    switch (true) {
      case DomUtils.contains(nodeA, nodeB):
        ancestor = nodeA;
        child = nodeB;
        break;
      case DomUtils.contains(nodeB, nodeA):
        ancestor = nodeB;
        child = nodeA;
        break;
      default:
        break;
    }
    node = child;
    if (node) {
      while (node && node !== ancestor) {
        this.branch_.push(node);
        node = node.parentNode;
      }
      this.branch_.push(ancestor);
    }
  };

  TreeBranch.prototype = {
    __proto__: Object.prototype,

    length: function() {
      return this.branch_.length;
    },

    iterator: function(order) {
      var iter;
      switch (order) {
        case 'post-order':
          iter = new Iterator(this.branch_);
          break;

        // let 'pre-order' fall under 'default'
        default:
          iter = new Iterator(this.branch_.reverse());
          break;
      }
      return iter;
    }
  };


  // -------------------- PRIVATE ----------------

  var Iterator = function(items) {
    this.items = items;
    this.idx = 0;
    this.node = this.items[this.idx];
  };

  Iterator.prototype = {
    next: function() {
      this.idx = Math.min(this.idx+1, this.items.length);
      this.node = this.items[this.idx];
      return this;
    }
  };


  return TreeBranch;
});