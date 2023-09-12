/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mutation tool cleaner to remove alignment styles that
 * content editable might have moved onto character run spans.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/tools/text/mutations/tags'
], function(Tags) {

  'use strict';

  /**
   * Remove any text-alignment value on SPAN tags.
   * @param {Mutation Summary Object}
   * @param {HTML Element}
   */
  function _removeTextAlignment(summary, node) {
    summary = summary || {};
    node.setAttribute(
      'style',
      node.style.cssText.replace(
        /text-align:\s*(left|center|right|justify|inherit)\s*;/,
        ''));
  }

  return {
    // Used for unit tests
    __clean: function(node) {
      _removeTextAlignment(undefined, node);
    },

    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.ADDED | Tags['ATTRIB-STYLE'],
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['SPAN']
      },
      callback: _removeTextAlignment
    }
  };

});
