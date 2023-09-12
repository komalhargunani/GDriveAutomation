/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview cleaner to remove any elements that contentEditable
 * might accidentally add to the document which we dont support.
 *
 * ContentEditable should never do this, but it's buggy. For example if
 * you have a document with this structure:
 *
 *  section
 *    ├─ P
 *    ├─ table
 *    │   └─ TR
 *    │      └─ TD
 *    │          └─ P
 *    │             └─ span
 *    └─ P
 *
 * And you select the span inside the single table cell and hit enter
 * then contentEditable will produce this:
 *
 *  section
 *    ├─ P
 *    ├─ section
 *    │     └─ BR
 *    └─ P
 *
 * This is clearly wrong and this cleaner will remove the section this
 * example, since we don't support adding sections (and they should
 * not be nested either!)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/tools/text/mutations/tags'
], function(NodeTagger, Tags) {

  'use strict';

  /**
   * Remove any unsupported element
   * @param {Mutation Summary Object}
   * @param {HTML Element}
   */
  function _removeUnsupportedElement(summary, node) {
    summary = summary || {};

    // remove all the tags from the node in
    // order for the text tool and translators to ignore it
    NodeTagger.clearAllTags(node);
    var children = node.childNodes;
    _.forEach(children, function(childNode) {
      NodeTagger.clearAllTags(childNode);
    });

    // delete the node from the DOM
    var parent = node.parentNode;
    if (parent) {
      parent.removeChild(node);
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
        nodeNames: ['QOWT-SECTION', 'DIV', 'TABLE', 'TR', 'TD']
      },
      callback: _removeUnsupportedElement
    }
  };

});
