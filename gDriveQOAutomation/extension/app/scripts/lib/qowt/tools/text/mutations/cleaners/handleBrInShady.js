define([
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/models/env'], function(
  Tags,
  EnvModel) {

  'use strict';

  function checkInShadyDOM_(summary, node) {
    summary = summary || {};
    // If the br is not added as a child of para or run then it is incorrectly
    // placed. Add it inside a paragraph and add the paragraph to the element.
    var parent = node.parentNode;
    if (EnvModel.app === 'word' && parent &&
      (parent.tagName === 'P' && parent.tagName !== 'SPAN')) {
      var isBrInShady = Array.from(Polymer.dom(parent).children).includes(node);
      var isBrAChild = Array.from(parent.children).includes(node);

      //If br is a child but not in shady dom
      if (isBrAChild && !isBrInShady) {
        parent.removeChild(node);
        Polymer.dom(parent).appendChild(node);
        Polymer.dom(parent).flush();
      }
    }
  }

  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.ADDED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['BR']
      },
      callback: checkInShadyDOM_
    }
  };
});
