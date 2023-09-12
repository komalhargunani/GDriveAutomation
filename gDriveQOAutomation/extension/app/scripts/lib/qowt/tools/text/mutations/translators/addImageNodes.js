define([
  'qowtRoot/features/utils',
  'qowtRoot/models/qowtState',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/tools/text/mutations/translators/utils',
  'third_party/lo-dash/lo-dash.min'
], function(
    Features,
    QOWTState,
    PubSub,
    Tags,
    TranslatorUtils
    /*lo-dash*/) {

  'use strict';

  function handleNodeAdded_(summary, node) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      console.warn('AddImageNodes mutation handler: ignoring non element node');
    } else if (node.nodeName === 'SPAN' && node instanceof QowtWordImage) {
          addElementToCoreDOM_(summary, node);
    }
  }


  /**
   * Elements are added to the core DOM by publishing appropriate signals
   * @param {Object} summary - the mutation summary
   * @param {Object} node - the node to be inserted
   * @private
   */
  function addElementToCoreDOM_(summary, node) {
    var nodeIds = getIdsAssociatedWithNode_(node);
    if (Features.isEnabled('logMutations')) {
      console.log('insertImage id: ' + nodeIds.self +
          ' with parent id: ' + nodeIds.parent +
          ' and sibling id: ' + nodeIds.sibling);
    }

    if (QOWTState.get() === 'EditingFullContent') {
      summary.__requiresIntegrityCheck.push(nodeIds.parent);
    }
    summary.__requiresIntegrityCheck.push(nodeIds.self);
    publishDrawingInfo_(node.parentNode);
    publishImageInfo_(node);
  }


  /**
   * Publish
   *  1) BinaryData ( i.e. insertBBD)
   *  2) Image Details like src, frmt etc (i.e. insertImage)
   *  3) Image Dimensions (i.e. formatElement)
   * @param {Object} node - the image node.
   * @private
   */
  function publishImageInfo_(node) {
    var nodeIds = getIdsAssociatedWithNode_(node);

    PubSub.publish('qowt:doAction', {
      'action': 'insertBBD',
      'context': {
        'contentType': 'mutation',
        'loc': node.model.src,
        'data': node.model.data
      }
    });

    PubSub.publish('qowt:doAction', {
      'action': 'insertImage',
      'context': {
        'contentType': 'mutation',
        'nodeId': nodeIds.self,
        'parentId': nodeIds.parent,
        'siblingId': nodeIds.sibling,
        'src': node.model.src,
        'frmt': node.model.frmt
      }
    });

    publishFormatting_(node, { /* context */
      'contentType': 'mutation',
      'eid': nodeIds.self,
      'ipr': node.model.imageProperties
    });
  }


  /**
   * Publish
   *  1) The Drawing element (i.e. insertDrawing)
   *  2) The Drawing element's properties (i.e. formatElement)
   * @param {Object} node - the drawing node
   * @private
   */
  function publishDrawingInfo_(node) {
    var nodeIds = getIdsAssociatedWithNode_(node);

    PubSub.publish('qowt:doAction', {
      'action': 'insertDrawing',
      'context': {
        'contentType': 'mutation',
        'nodeId': nodeIds.self,
        'parentId': nodeIds.parent,
        'siblingId': nodeIds.sibling
      }
    });

    publishFormatting_(node, { /* context */
      'contentType': 'mutation',
      'eid': nodeIds.self,
      'dpr': node.model
    });
  }


  /**
   * @param {Object} node - node whose parent,sibling id's are to be figured out
   * @return {Object} nodeIds.self
   *                   nodeIds.parent
   *                   nodeIds.sibling
   * @private
   */
  function getIdsAssociatedWithNode_(node) {
    var nodeIds = {};
    nodeIds.self = node.getAttribute('qowt-eid') || node.id;
    var parent = node.parentNode;
    nodeIds.parent = parent.getAttribute('qowt-eid') || parent.id;
    nodeIds.sibling = TranslatorUtils.getSiblingEid(node);
    return nodeIds;
  }

  /**
   * Logs the formatting action and publishes the formatElement signal with the
   * context.
   *
   * @param {Object} node - node whose formatting is to be published.
   * @param {Object} context - properties that are to be published.
   * @private
   */
  function publishFormatting_(node, context) {
    if (Features.isEnabled('logMutations')) {
      console.log('Format node ' + node.id + ' with formatting:');
      console.log(context);
    }
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
        nodeNames: ['SPAN']
      },
      callback: handleNodeAdded_
    }
  };

});
