
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview text mutation tool helper that handles
 * nodes which have been added to the document
 *
 * @author jelte@google.com (Jelte Liebrand)
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/models/qowtState',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/tools/text/mutations/translators/utils',
  'qowtRoot/pubsub/pubsub',
  'third_party/lo-dash/lo-dash.min'
  ], function(
    Features,
    QOWTState,
    Tags,
    TranslatorUtils,
    PubSub) {

  'use strict';

  function _handleNodeAdded(summary, node) {
    var action;
    if (node.nodeType !== Node.ELEMENT_NODE) {
      console.warn('AddNodes mutation handler - ignoring non element node');
    } else {
      switch (node.nodeName) {
        case 'P':
          action = 'addParagraph';
          break;
        case 'SPAN':
          // image nodes are handled in addImageNodes.js so we ignore them here
          if (!(node instanceof QowtWordImage)) {
            action = 'addCharacterRun';
          }
          break;
        case 'A':
          action = 'addHyperlink';
          break;
        default:
          break;
      }

      if (action) {
        _addElement(summary, action, node);
          }
        }
      }

  function _addElement(summary, action, node) {
    var eid = node.getAttribute('qowt-eid');
    var parent = Polymer.dom(node).parentNode;
    var parentEid = parent.getAttribute('qowt-eid') || parent.id;
    var siblingEid = TranslatorUtils.getSiblingEid(node);

    if (Features.isEnabled('logMutations')) {
      console.log(action + ' id: ' + node.id +
          ' with parent id: ' + parentEid +
          ' and sibling id: ' + siblingEid);
    }

    if (QOWTState.get() === 'EditingFullContent') {
      summary.__requiresIntegrityCheck.push(parentEid);
    }
    summary.__requiresIntegrityCheck.push(eid);

    var context = TranslatorUtils.
        prepareContextForAction(eid, parentEid, siblingEid, action, node);

    PubSub.publish('qowt:doAction', {
          'action': action,
          'context': context
        });

    _sendFormattingAction(node);
  }

  /**
   * @private
   * Generate the correct formatting action and context info and broadcast
   * it as a doAction.
   *
   * @param {Element} node The current HTML element.
   */
  function _sendFormattingAction(node) {

    // TODO(jliebrand): all elements should have .formatting object
    // rather than these .ppr, .rpr magic names. See http://crbug/403884
    // For now keep the ppr and rpr and cpr fallbacks
    var context = _.pick(node.model,
        'formatting', 'del_formatting',
        'ppr', 'del_ppr',
        'rpr', 'del_rpr',
        'cpr', 'del_cpr');

    context.eid = node.model.eid;

    // remove any dcp cache from the element
    // (we got ALL the data from the model for this NEW node
    // but dont want future operations to have trailing dcpCache info)
    delete node.dcpCache;

    // only send if we actually have formatting information to set
    var props = context.formatting || context.ppr || context.rpr || context.cpr;
    if (!_.isEmpty(props)) {
      context.contentType = 'mutation';
      _logFormattingAction(node, context);
      _publishFormattingAction(context);
    }
  }

  function _logFormattingAction(node, formatting) {
    if (Features.isEnabled('logMutations')) {
      console.log('Format node ' + node.id + ' with formatting:');
      console.log(formatting);
    }
  }

  function _publishFormattingAction(context) {
    PubSub.publish('qowt:doAction', {
      'action': 'formatElement',
      'context': context
    });
  }

  return {
    /**
     * The config object used to register this translator to the mutation
     * registry.
     */
    translatorConfig: {
      filterConfig: {
        type: Tags.ADDED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['P', 'SPAN', 'A']
      },
      callback: _handleNodeAdded
    }
  };

});
