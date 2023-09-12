define([
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/nodeTagger'
], function (
    Tags,
    NodeTagger) {

  'use strict';

  /**
   * This will remove the empty table element left in DOM by content editable.
   * In a specific scenario when all the contents of the table except an empty
   * paragraph are removed(ref. JIRA: CQO-459), the content editable removes
   * the children of table. However it retains the empty table element in DOM.
   * This cleaner removes any table which has no child remaining in it.
   * @param summary {object} object containing all the mutations
   * @param node {HTMLElement} The row element being removed from DOM.
   * @private
   */
  function _removeEmptyTable(summary, node) {
    var parentTable = _getParent(summary, node);
    // If the row being deleted is the last row, remove the table as well.
    if (parentTable.childNodes.length === 0 && parentTable.parentNode) {
      NodeTagger.tag(parentTable, Tags.DELETED);
      summary.removed.push(parentTable);
      parentTable.parentNode.removeChild(parentTable);
    }
  }

  function _getParent(summary, node) {
    return node.parentNode || summary.getOldParentNode(node);
  }

  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.DELETED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['TR']
      },
      callback: _removeEmptyTable
    }
  };
});
