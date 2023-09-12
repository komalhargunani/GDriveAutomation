define([
  'qowtRoot/features/utils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/text/mutations/tags'
], function(
    Features,
    PubSub,
    Tags) {

  'use strict';

  function _formatUnchangedRunProps(summary, node) {
    if (!node instanceof QowtWordRun ||
        !node.getAttribute('qowt-format')) {
      return;
    }
    summary = summary || {};

    var context = {rpr: {}};
    context.eid = node.getAttribute('qowt-eid');
    context.rpr = JSON.parse(node.getAttribute('qowt-format'));
    if (Features.isEnabled('logMutations')) {
      console.log('format word run having id: ' + context.eid + ' with ' +
          'formatting: ');
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
        nodeNames: ['SPAN']
      },
      callback: _formatUnchangedRunProps
    }
  };
});
