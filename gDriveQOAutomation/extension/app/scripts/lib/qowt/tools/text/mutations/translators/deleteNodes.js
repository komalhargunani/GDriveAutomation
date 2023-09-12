// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview text mutation tool helper that handles
 * nodes which have been deleted
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/models/qowtState',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/pubsub/pubsub'
], function(
  Features,
  QOWTState,
  Tags,
  PubSub) {

  'use strict';

  function _getEid(node) {
    // getAttribute can return the string "undefined" !
    var eid = node.getAttribute('qowt-eid');
    if (!eid || eid === 'undefined') {
      eid = node.id;
    }
    return eid;
  }

  function _getParent(summary, node) {
    // @TODO need to visit this again hope this part is useful
    // Added this code to fix one issue. Earlier it was generating
    // but now it's not generating. for the safer side keeping
    // this code and want to revisit.
    if(node.nodeName === 'QOWT-SECTION') {
      var parentNode = node.closest('qowt-page') ||
       summary.getOldParentNode(node);
      if(parentNode && parentNode.nodeName === 'DIV') {
        return parentNode.closest('qowt-page') ||
         summary.getOldParentNode(parentNode);
      } else {
        return parentNode;
      }
    }
    return node.parentNode || summary.getOldParentNode(node);
  }

  function _handleNodeDeleted(summary, node) {
    var nodeEid = _getEid(node);

    // only need to handle the case where the node has a EID
    // eg ignore the node if it was a qowt-page for example or
    // a <br> element that got added by contentEditable
    // NOTE:
    var deleteNode = false;
    if (nodeEid) {
      // we unflow elements BEFORE a delete, but only at the block level, eg
      // a paragraph etc. If a section is deleted, we only need to
      // translate the delete if it was the flowStart node.
      if (node.supports && node.supports('flow') && node.isFlowing() &&
         (node !== node.flowStart())) {
        if (Features.isEnabled('logMutations')) {
          console.log("Ignoring deletion of node: %s; not flowStart", nodeEid);
        }
      }
      else {
        var parentNode = _getParent(summary, node);
        if (parentNode && parentNode.id === 'contents' ||
          node.nodeName === 'TR') {
          parentNode = _getParent(summary, parentNode);
        }
        var parentEid;
        if (parentNode) {
          var grandParent = _getParent(summary, parentNode);
          if (!parentNode.isQowtElement && (
            grandParent && (grandParent.nodeName === 'TD' ||
            node.nodeName === 'TR'))) {
            parentNode = grandParent;
          }
          if (!(parentNode.isQowtElement) && node.nodeName === "QOWT-SECTION") {
            parentNode = parentNode.parentElement.closest('QOWT-PAGE');
          }
          parentEid = _getEid(parentNode);
        }

        if (QOWTState.get() === 'EditingFullContent') {
          summary.__requiresIntegrityCheck.push(parentEid);
        }

        if (Features.isEnabled('logMutations')) {
          console.log("delete node id: %s, parent id: %s", nodeEid, parentEid);
        }

        deleteNode = true;
      }
    }

    // if the node was in a flow, we have to normalize the flow, such
    // that our flowFrom and flowInto no longer point to this dead node.
    if (node.supports && node.supports('flow') && node.isFlowing()) {
      var refToSibling = node.flowFrom || node.flowInto;
      node.removeFromFlow();
      if (refToSibling) {
        // If the node was in a flow, then there are other nodes with the same
        // eid still in the HTML DOM. So, we don't want to tell Core to delete
        // its node with that eid since it will cause a mismatch between the
        // HTML DOM and the Core DOM (there is a many-to-one mapping of HTML
        // nodes to Core nodes).
        deleteNode = false;
        refToSibling.normalizeFlow();
      }
    }

    if (deleteNode) {
      PubSub.publish('qowt:doAction', {
        'action': 'deleteNode',
        'context': {
          'contentType': 'mutation',
          'nodeEid': nodeEid,
          'parentEid': parentEid
        }
      });
    }
  }

  return {
    /**
     * The config object used to register this translator to the mutation
     * registry.
     */
    translatorConfig: {
      filterConfig: {
        type: Tags.DELETED,
        nodeType: Node.ELEMENT_NODE
      },
      callback: _handleNodeDeleted
    }
  };
});
