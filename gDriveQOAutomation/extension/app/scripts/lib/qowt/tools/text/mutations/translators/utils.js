/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview some common functions for all mutation translators to use
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/models/env',
  'qowtRoot/utils/domUtils',
  'third_party/lo-dash/lo-dash.min'
], function(
    EnvModel,
    DomUtils
    /*lodash-min*/) {

  'use strict';
  var _api = {

    // work out where the a node fits inside the parent
    // and inside any potential parent-flow and return sibling eid
    getSiblingEid: function(node) {
      var sibling, siblingEid;
      var parent = node.parentNode;
      if (parent.id==='contents' && parent.parentNode.nodeName==='TD') {
        parent = Polymer.dom(node).parentNode;
      }
      var relOffset = DomUtils.peerIndex(node);

      if (!parent.isQowtElement || !parent.supports('flow')) {
        // non-qowt/non-flowing elements are easier
        sibling = node.previousElementSibling;
      }
      else {
        var absOffset = parent.absoluteOffsetWithinFlow(relOffset);

        // find the sibling if there is one (within a potential flow)
        var siblingAbsOffset = absOffset - 1;
        if (siblingAbsOffset >= 0) {
          var siblingParent = parent.flowNodeAtOffset(siblingAbsOffset);
          var siblingRelOffset = siblingParent.relativeOffset(siblingAbsOffset);

          // In shady dom all nodes get exposed which makes template nodes
          // being present as child while querying. Hence, excluding template
          // nodes like headerTemplates, footerTemplates from the children for
          // getting the right sibling id.
          var siblingParentChildren = [];
          if (siblingParent.children[0].id==='contents' &&
            siblingParent.nodeName==='TD') {
            siblingParent = siblingParent.children[0];
          }
          for (var i = 0; i < siblingParent.children.length; i++) {
            if (siblingParent.children[i].nodeName !== 'TEMPLATE') {
              siblingParentChildren.push(siblingParent.children[i]);
            }
          }
          sibling = siblingParentChildren[siblingRelOffset];
          if (EnvModel.app === 'word' &&
              sibling.nodeName === 'BR' &&
              siblingRelOffset >= 1) {
            sibling = siblingParentChildren[siblingRelOffset - 1];
          }
        }
      }

      if (sibling) {
        siblingEid = sibling.isQowtElement ?
            sibling.model.eid : sibling.getAttribute('qowt-eid');
      }
      return siblingEid;
    },

    /**
     * Prepare context object based on the action. When adding node to dom, some
     * additional properties needs to be added in context according to action.
     *
     * @param eId - 'qowt-eid' attribute of node
     * @param parentEid - parent eid of node
     * @param siblingEid - sibling eid of node
     * @param action - addParagraph, addCharacterRun or addHyperlink
     * @param node - dom node
     * @returns {{contentType: string, nodeId: *, parentId: *, siblingId: *}}
     */
    prepareContextForAction: function(eId, parentEid, siblingEid, action,
                                      node) {
      var context = {
        'contentType': 'mutation',
        'nodeId': eId,
        'parentId': parentEid,
        'siblingId': siblingEid
      };
      if (action === 'addHyperlink') {
        // adding hyperlink target(hlkTarget) attribute to context.
        var link = node.getAttribute('href');

        /*
         * TODO: we should fix DCP to add that knowledge
         * see https://issues.quickoffice.com/browse/CQO-685
         * Hyperlink dcp element needs to indicate if it's internal or external
         */
        // TODO (Upasana): this is an ugly fix for internal link. QOWT adds "#"
        // to links to indicate them as internal links. Therefore, while sending
        // dcpData for "newHyperlink" command the target is send with a prefix
        // "#" to core. However, core does not has "#" prefixed with internal
        // links, which ultimately result into docCheckerError. Therefore, to
        // avoid this, sending hyperlink target without "#" to core. This should
        // be fixed from DCP/Core.

        if(_.indexOf(link, '#') === 0){
          link = link.substr(1, link.length);
        }
        context.hlkTarget = link;
      }

      return context;
    }
  };

  return _api;
});
