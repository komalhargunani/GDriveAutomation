/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview cleaner to move soft line breaks back up
 * to the parent paragraph if contentEditable moved them
 * under a character run
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/features/utils',
  'qowtRoot/tools/text/mutations/tags'], function(
    Features,
    Tags) {

  'use strict';

  function checkParent_(summary, node) {
    summary = summary || {};
    // make sure we only do any work for soft line breaks, not any
    // other <br> elements
    if (node.getAttribute('qowt-divtype') === 'data-line-break') {
      var currentParent = node.parentNode;
      if (currentParent.nodeName !== 'P') {
        if (Features.isEnabled('logMutations')) {
          console.log('Found misplaced soft line break, moving it up');
        }
        var newParent = currentParent;
        var newSibling = currentParent;
        while (newParent && newParent.nodeName !== 'P') {
          newSibling = newParent;
          newParent = newParent.parentNode;
        }
        if (!newParent) {
          throw new Error('Could not find valid parent paragraph');
        }
        // move the line break up to parent
        newParent.insertBefore(node, newSibling);
      }
    }
  }

  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.MOVED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['BR']
      },
      callback: checkParent_
    }
  };
});
