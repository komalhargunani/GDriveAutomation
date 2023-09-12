define([
  'qowtRoot/models/env',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/domUtils'
], function (
  EnvModel,
  Tags,
  DomUtils) {

  'use strict';


  function _withinTextBox(summary, node) {
    var currentNode = node;
    var textboxFound = false;
    var done = false;
    while (currentNode && !done) {
      textboxFound = currentNode.nodeName === 'QOWT-TEXT-BOX';
      done = textboxFound || currentNode.nodeName === 'QOWT-MSDOC';
      currentNode = summary.getOldParentNode(currentNode);
    }
    return textboxFound;
  }
  /**
   * @private
   *
   * Remove the node from its parent's shady dom
   *
   * @param {Object} summary Mutation Summary Object.
   * @param {HTML Element} node the node to be deleted.
   */
  function _removeFromPolymerDom(summary, node) {
    if (node.nodeName === 'TABLE') {
      markHierarchyDeleted(node);
    }
    if (EnvModel.app === 'word' && !node.getAttribute('removedFromShady')) {
      var oldParent = summary.getOldParentNode(node);
      if (!oldParent.isQowtElement &&
        oldParent.parentNode &&
        oldParent.parentNode.nodeName === 'TD' ) {
        oldParent = oldParent.parentNode;
      }
      if (oldParent) {
        if(!oldParent.getAttribute('removedFromShady') &&
          !(oldParent instanceof QowtHyperlink) &&
          !(DomUtils.isField(oldParent)) &&
          !(_withinTextBox(summary, node)) &&
          !(oldParent instanceof QowtDrawing) &&
          !(oldParent instanceof QowtWordPara) &&
          !((oldParent instanceof QowtWordRun ||
            oldParent instanceof QowtLineBreak) && node.nodeName === 'BR')) {
          Polymer.dom(oldParent).removeChild(node);
          Polymer.dom(oldParent).flush();
        }
        node.setAttribute('removedFromShady', true);
      }
    }
  }

  function markHierarchyDeleted(node) {
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      markHierarchyDeleted(child);
      child.setAttribute('removedFromShady', true);
    }
  }

  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.DELETED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['SPAN','P', 'A', 'BR', 'QOWT-DRAWING', 'TABLE']
      },
      callback: _removeFromPolymerDom
    }
  };
});
