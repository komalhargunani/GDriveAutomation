define([
  'qowtRoot/models/env',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/nodeTagger',
  'utils/analytics/googleAnalytics',
  'third_party/lo-dash/lo-dash.min'], function(
    EnvModel,
    Tags,
    NodeTagger,
    GA
    /*lo-dash*/) {

  'use strict';

  function addParentIfMissing_(summary, node) {
    summary = summary || {};
    // If the qowt-drawing is not added as a child of para then it is
    // incorrectly placed. Add it inside a paragraph and add the paragraph
    // to the element.
    var parent = node.parentNode;
    if (parent.tagName !== 'P') {
      var para;
      if (EnvModel.app === 'word') {
        var previousSiblingTagName =
            _.get(node, 'previousSibling.tagName') || parent.tagName;
        if (previousSiblingTagName === 'P') {
          para = node.previousSibling;
        } else if (previousSiblingTagName === 'QOWT-SECTION' ||
            previousSiblingTagName === 'TD') {
          para = new QowtWordPara();
          NodeTagger.tag(para, Tags.ADDED);
          parent.insertBefore(para, node);
          summary.__additionalAdded.push(para);
        } else {
          var msg = 'lone qowt-drawing with parent tag : ' +
              previousSiblingTagName;
          GA.sendException({msg: msg, fatal: false});
        }
      }
      para.appendChild(node);
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
        nodeNames: ['QOWT-DRAWING']
      },
      callback: addParentIfMissing_
    }
  };
});
