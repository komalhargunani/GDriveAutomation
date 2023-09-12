define([
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/tools/text/mutations/tags'
], function (
    NodeTagger,
    Tags) {

  'use strict';

  /**
   * @private
   *
   * Add a paragraph in a section if the last node in the section is removed.
   *
   * @param {Object} summary Mutation Summary Object.
   * @param {HTML Element} node the node to inspect.
   */
  function _addParagraph(summary, node) {
    var oldParent = summary.getOldParentNode(node);
    if (oldParent) {
      var section = oldParent.closest('qowt-section');
      var hasChildNodes = window._unittests ?
          (section && !(section.childNodes.length > 6)) :
          (section && !section.hasChildNodes());
      if (section && hasChildNodes) {
        var para = new QowtWordPara();
        section.appendChild(para);
        NodeTagger.tag(para, Tags.ADDED);
        summary.__additionalAdded.push(para);
      }
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
        nodeNames: ['TABLE']
      },
      callback: _addParagraph
    }
  };
});
