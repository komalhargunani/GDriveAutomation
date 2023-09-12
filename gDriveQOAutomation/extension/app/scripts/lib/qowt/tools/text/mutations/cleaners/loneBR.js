define([
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/models/env'], function(
    Tags,
    NodeTagger,
    EnvModel) {

  'use strict';

  function checkParent_(summary, node) {
    summary = summary || {};
    // If the br is not added as a child of para or run then it is incorrectly
    // placed. Add it inside a paragraph and add the paragraph to the element.
    var parent = node.parentNode;
    if (parent && parent.tagName !== 'P' && parent.tagName !== 'SPAN') {
      var para;
      if (EnvModel.app === 'word') {
        para = new QowtWordPara();
      } else if (EnvModel.app === 'point') {
        para = new QowtPointPara();
      }
      NodeTagger.tag(para, Tags.ADDED);
      parent.insertBefore(para, node);
      para.appendChild(node);

      // NOTE: be careful with __additionalAdded array. It *will*
      // be cleaned as well (to ensure it gets IDs for example), but
      // we only do this once. So if we add new nodes as a result of
      // cleaning the __additionalAdded array, things will be broken!
      summary.__additionalAdded.push(para);
    }
  }

  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.ADDED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['BR']
      },
      callback: checkParent_
    }
  };
});
