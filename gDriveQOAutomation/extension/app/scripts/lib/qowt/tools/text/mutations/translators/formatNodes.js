/**
 * @fileoverview Text mutation tool helper that handles
 * nodes which have changed styling formatting
 *
 * @author jelte@google.com (Jelte Liebrand)
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
    'qowtRoot/features/utils',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/tools/text/mutations/tags',

    'third_party/lo-dash/lo-dash.min'
  ], function(
    Features,
    PubSub,
    Tags) {

  'use strict';

  function _formatNode(summary, node) {
    summary = summary || {};

    if (node.supports && node.supports('flow') && node.isFlowing()) {
      if (node.flowStart() !== node) {
        // we only need to translate the formatting to the
        // start node of the flow; ignore the rest
        return;
      }
    }

    // TODO(jliebrand): all elements should have .formatting object
    // rather than these .ppr, .rpr magic names. See http://crbug/403884
    // For now keep the ppr and rpr and cpr fallbacks
    var context = _.pick(node.dcpCache,
        'formatting', 'del_formatting',
        'ppr', 'del_ppr',
        'rpr', 'del_rpr',
        'cpr', 'del_cpr');

    // remove the dcp cache from the element now that we have the data
    delete node.dcpCache;

    context.eid = node.getAttribute('qowt-eid');

    // note: there could have been other reasons for this node
    // to have a style/class change. For example in point we add/remove
    // the qowt-editable class to shapes. In these cases there is no
    // actual formatting change, so no need to publish an action
    if (isValidFormattingContext_(context)) {

      if (Features.isEnabled('logMutations')) {
        console.log("format node with id: " + context.eid);
        console.log("with formatting:");
        console.log(context);
      }

      summary.__requiresIntegrityCheck.push(context.eid);

      context.contentType = 'mutation';
      PubSub.publish('qowt:doAction', {
        'action': 'formatElement',
        'context': context
      });
    }
  }

  function isValidFormattingContext_(context) {
    return (context.eid &&
           (context.ppr || context.rpr || context.cpr ||
            context.del_ppr || context.del_rpr || context.del_cpr));
  }

  return {
    /**
     * The config object used to register this translator to the mutation
     * registry.
     */
    translatorConfig: [
      {
        filterConfig: {
          type: Tags['ATTRIB-CLASS'],
          nodeType: Node.ELEMENT_NODE
        },
        callback: _formatNode
      },
      {
        filterConfig: {
          type: Tags['ATTRIB-STYLE'],
          nodeType: Node.ELEMENT_NODE,
          nodeNames: ['SPAN']
        },
        callback: _formatNode
      },
      {
        filterConfig: {
          type: Tags['ATTRIB-STYLE'],
          nodeType: Node.ELEMENT_NODE,
          nodeNames: ['P']
        },
        callback: _formatNode
      }
    ]
  };
});
