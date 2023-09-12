// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview mutation tool cleaner to remove any <font> tags
 * content editable might have added...
 *
 * DOM structure could be like below from which font nodes are to be removed.
 *
 *  para
 *    ├─ span
 *    │   └─ font
 *    │      └─ font
 *    │          └─ textNode
 *    │      └─ font
 *    │          └─ textNode
 *    │      └─ font
 *    │          └─ textNode
 *
 * This is a singleton
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/nodeTagger'
  ], function(Tags, NodeTagger) {

  'use strict';

  function _removeFontElement(summary, node) {
    summary = summary || {};
    var children = node.childNodes;
    var parent = node.parentNode;
    if (parent) {
      // move all the children of this <font> tag up
      // in to the parent where they really belong
      var length = children.length;
      var refNode = parent;
      for (var i = 0; i < length; i++) {
        var firstChildNode = node.firstChild;
        var siblingNodes = parent.childNodes;
        // Content editable might multiple child font tags in a font tag eg. in
        // case there are multiple statements in the text, one font tag is added
        // for every sentence. Add the text in each font tag in new span.
        if (siblingNodes.length > 1 &&
            siblingNodes[0].nodeName === 'FONT') {
          if (firstChildNode.childNodes.length > 1) {
            console.log('font tag has more than one child node');
          } else if (parent.parentNode) {
            var newRun = parent.cloneMe();
            NodeTagger.tag(newRun, Tags.ADDED);
            summary.__additionalAdded.push(newRun);
            newRun.appendChild(firstChildNode.firstChild);
            parent.parentNode.insertBefore(newRun, refNode.nextSibling);
            refNode = newRun;
            node.removeChild(firstChildNode);
            NodeTagger.clearAllTags(firstChildNode);
          }
        } else {
          parent.insertBefore(firstChildNode, node);
        }
      }

      // now remove the <font> tag from the DOM and remove
      // all its tags so that the text tool will ignore it
      parent.removeChild(node);
      NodeTagger.clearAllTags(node);
    }
  }

  return {
    // used for unit tests
    __clean: function(node) {
      _removeFontElement({__additionalAdded: []}, node);
    },

    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.ADDED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['FONT']
      },
      callback: _removeFontElement
    }
  };
});
