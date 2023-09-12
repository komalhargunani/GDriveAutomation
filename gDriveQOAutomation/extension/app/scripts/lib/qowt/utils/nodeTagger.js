
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview simply module to tag nodes with bitwise flags
 * which can be useful when walking a node tree
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _kTag = '__node_tag';

  var _api = {

    /**
     * tag a given node with a 'tag'
     *
     * @param node {HTML Node} the node to be tagged
     * @param label {number} what to tag it with
     */
    tag: function(node, label) {
      var labels = node[_kTag] || 0;
      labels |= label;
      node[_kTag] = labels;
    },

    /**
     * untag the node
     *
     * @param node {HTML Node} node to untag
     * @param label {number} what to untag
     */
    untag: function(node, label) {
      var labels = node[_kTag] || 0;
      labels &= ~label;
      node[_kTag] = labels;
    },

    /**
     * test if a node is tagged with any label
     *
     * @param node {HTML Node} node to check
     * @return {boolean} returns true if a node is tagged with anything
     */
    isTagged: function(node) {
      return (node[_kTag] !== undefined &&
          node[_kTag] !== 0);
    },


    /**
     * test if the node has a specific label set
     *
     * @param node {HTML Node} the node to be tagged
     * @param label {number} what label to check out for
     * @return {boolean} return true if the specific label was set
     */
    hasTag: function(node, label) {
      return !!(node[_kTag] & label);
    },

    /**
     * test if the node has any of the specified tags already set
     *
     * @param node {HTML Node} the node that is tagged
     * @param labels {List} the list of labels to check for
     * @return {boolean} return true if any label was set
     */
     hasOneOfTags: function(node, labels) {
       var mask = labels.reduce(function(accumulator, label) {
        return accumulator | label;
       }, 0);
       return !!(node[_kTag] & mask);
     },

     /**
      * Given an object with tags as values, returns the keys of the applied
      * tags in an array.
      *
      * @param node {HTML Node} the node that is tagged
      * @param tagDescription {Object} an object with tags as values
      * @return {list} return the list of keys from the tagDescription that
      *     match with the node's tags
      */
     getTagKeys: function(node, tagDescription) {
       var result = [];
       for (var tagKey in tagDescription) {
         if (_api.hasTag(node, tagDescription[tagKey])) {
           result.push(tagKey);
         }
       }
       return result;
     },

    /**
     * remove any and all tags a node might have
     *
     * @param {HTML Node} node the node to clear
     */
    clearAllTags: function(node) {
      delete node[_kTag];
    },

    /**
     * Copy all tags from a srcNode to a destNode
     *
     * @param {HTMLElement} srcNode original node
     * @param {HTMLElement} destNode destination node
     */
    copyTags: function(srcNode, destNode) {
      destNode[_kTag] = srcNode[_kTag];
    }

  };

  return _api;
});

