// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview text mutation tool helper that handles
 * nodes which have been moved around the document
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/tools/text/mutations/translators/utils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domUtils'
], function(
  Features,
  Tags,
  TranslatorUtils,
  PubSub,
  DomUtils) {

  'use strict';

  function _getEid(node) {
    // if the node is of type date return node id
    // and return undefined rather than null if there is no eid
    var eid = node && node.getAttribute && node.getAttribute('qowt-eid');
    if (!eid && DomUtils.isField(node)) {
      eid = node.id;
    }
    return eid;
  }

  function _handleNodeMoved(summary, node) {
    var nodeEid = _getEid(node);

    // ignore nodes that have no eid (like <br> tags)
    if (nodeEid) {
      var newParent = node.parentNode;
      var newParentEid = _getEid(newParent);

      // note: the new sibling might be under a different
      // parent if its within a flow. Use utility to find the
      // actual eid
      var newSiblingEid = TranslatorUtils.getSiblingEid(node);

      var oldParent = summary.getOldParentNode(node);
      var oldParentEid = _getEid(oldParent);

      var oldSibling = summary.getOldPreviousSibling(node);
      var oldSiblingEid = _getEid(oldSibling);

      // only need to translate the move node if the node
      // really did indeed move..
      if ((newParentEid !== oldParentEid) ||
        (newSiblingEid !== oldSiblingEid)) {

        if (Features.isEnabled('logMutations')) {
          console.log('move node with id: ' + nodeEid +
            ' old sibling id: ' + oldSiblingEid +
            ' new sibling id: ' + newSiblingEid +
            ' old parent id: ' + oldParentEid +
            ' new parent id: ' + newParentEid);
        }

        summary.__requiresIntegrityCheck.push(nodeEid);
        summary.__requiresIntegrityCheck.push(newParentEid);
        summary.__requiresIntegrityCheck.push(oldParentEid);

        PubSub.publish('qowt:doAction', {
          'action': 'moveNode',
          'context': {
            'contentType': 'mutation',
            'nodeId': nodeEid,
            'parentId': newParentEid,
            'siblingId': newSiblingEid,
            'oldParentId': oldParentEid,
            'oldSiblingId': oldSiblingEid
          }
        });
      }
    }
  }


  return {
    /**
     * The config object used to register this translator to the mutation
     * registry.
     */
    translatorConfig: {
      filterConfig: {
        type: Tags.MOVED,
        nodeType: Node.ELEMENT_NODE
      },
      callback: _handleNodeMoved
    }
  };
});