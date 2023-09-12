define([
  'qowtRoot/features/utils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/text/mutations/tags'
], function(
    Features,
    PubSub,
    Tags) {

  'use strict';

  /**
   * For QW, the paragraphs are to be formatted for run properties like bold,
   * italic etc. This is done for paragraphs which are completely selected or
   * empty. These paragraphs are set with attribute 'qowt-format' with the run
   * format properties.
   * @param summary {Mutation Summary Object} The mutation summary object
   * @param node {HTML Element} The word para with 'qowt-format' attribute set
   * @private
   */
  function _formatParaWithRunProperties(summary, node) {
    if (!node instanceof QowtWordPara) {
      return;
    }
    summary = summary || {};

    var context = {};
    context.eid = node.getAttribute('qowt-eid');
    context.rpr = JSON.parse(node.getAttribute('qowt-format'));

    if (Features.isEnabled('logMutations')) {
      console.log("format word para having id: " + context.eid + " with " +
                  "formatting: ");
      console.log(context.rpr);
    }

    summary.__requiresIntegrityCheck.push(context.eid);

    context.contentType = 'mutation';
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
        type: Tags['ATTRIB-FORMAT'],
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['P']
      },
      callback: _formatParaWithRunProperties
    }
  };
});
