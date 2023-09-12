/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview mutation tool cleaner for invalid table cells.
 *
 * The cleaner's responsibility is to correct table cells
 * to comply with MS spec.
 * Two main rules are enforced:
 * 1. Every table cell must contain at least one paragraph even if it is empty.
 * 2. An empty table cell (as per rule 1, means one having an empty paragraph)
 *    must have a line break tag so that the users can place the
 *    cursor and happily edit.
 *
 * This is a singleton.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/idGenerator',
  'qowtRoot/utils/arrayUtils'
], function(
  Features,
  NodeTagger,
  Tags,
  IdGenerator,
  ArrayUtils) {

  'use strict';

  // TODO(sakhyaghosh):
  // Ideally the table cell cleaner should run on ALL mutations which are
  // remotely related to a table cell, and then clean the cell.
  // Right now if for some reason contenteditable would add a TD with a SPAN,
  // this cleaner would not run....and the cell would be invalid.
  // Unfortunately the permutations are too great to tailor for all cases
  // where a TD is created with "invalid" MS Office content...that is
  // every table cell must contain paragraphs.
  //
  // The REAL solution here is likely to use a custom element for table cells,
  // which internally (using a shadow dom) will ensure the content is never
  // "orphaned" outside of a paragraph...

  /**
   * @private
   * Add a paragraph if there are no paragraphs in a table cell.
   *
   * If a deleted paragraph was inside a table cell,
   * and the table cell has not been deleted (i.e not part of mutation summary),
   * and the table cell does not have any paragraphs as children,
   * add a new paragraph(clone the old paragraph) as a child of the table cell
   * (as per the MS spec a table cell must contain paragraphs)
   * and handle all the children of the table cell.
   *
   * @see _handleChildren
   *
   * @param {Object} summary Mutation Summary Object.
   * @param {HTML Element} node the paragraph node to inspect.
   */
  function _addParagraph(summary, node) {
    var oldParent = summary.getOldParentNode(node);
    if (_isTableCell(oldParent) &&
        _tableCellNotDeleted(oldParent, summary) &&
        _tableCellHasNoParagraphs(oldParent)) {
      if (Features.isEnabled('logMutations')) {
        console.log('Found no paragraph in a table cell, adding one.');
      }
      // create a new paragraph, as the table cell has no child paragraph.
      var newParagraph = _createNewParagraph(node, oldParent, summary);
      // reparent or remove children of the table cell.
      _handleChildren(oldParent, newParagraph, summary);
      // finally add the new paragraph as a child of the table cell.
      oldParent.appendChild(newParagraph);
      // Update __dom of parent node
      oldParent = summary.getOldParentNode(oldParent);
      if (oldParent.nodeName === 'TD' && oldParent.__dom) {
        oldParent.__dom.firstChild = newParagraph;
        oldParent.__dom.lastChild = newParagraph;
        oldParent.__dom.childNodes.push(newParagraph);
      }
    }
  }


  /**
   * @private
   * Return true if the node is a table cell.
   *
   * @param {HTML Element} node under inspection.
   * @return {Boolean} true or false.
   */
  function _isTableCell(node) {
    return node && _isDivOrTdTableCell(node);
  }

  /**
   * @private
   * Return true if the node is a div/td table cell.
   *
   * @param {HTML Element} node under inspection.
   * @return {Boolean} true or false.
   */
  function _isDivOrTdTableCell(node) {
    if (node.nodeName &&
      (node.nodeName.toLowerCase() === 'td' ||
      (node.nodeName.toLowerCase() === 'div' &&
       node.classList.contains('qowt-table-cell')))
    ) {
      return true;
    }
    return false;
  }

  /**
   * @private
   * Return true if the table cell under inspection is not part of the
   * mutation summary removed array.
   *
   * @param {HTML Element} tableCell tableCell node under inspection.
   * @param {Object} summary Mutation Summary Object.
   * @return {Boolean} true or false.
   */
  function _tableCellNotDeleted(tableCell, summary) {
    return !ArrayUtils.subset([tableCell], summary.removed);
  }

  /**
   * @private
   * Return true if the node under inspection is part of the
   * mutation summary added array.
   *
   * @param {HTML Element} node under inspection.
   * @param {Object} summary Mutation Summary Object.
   *
   * @return {Boolean} true or false.
   */
  function _nodeAdded(node, summary) {
    return ArrayUtils.subset([node], summary.added);
  }


  /**
   * @private
   * Return true if the table cell under inspection has no paragraphs.
   *
   * @param {HTML Element} tableCell tableCell node under inspection.
   * @return {Boolean} true or false.
   */
  function _tableCellHasNoParagraphs(tableCell) {
    return _parentHasNoChild(tableCell, 'p');
  }


  /**
   * @private
   * Return true if the parent under inspection has no child as childNode.
   *
   * @param {HTML Element} parent node under inspection.
   * @param {HTML Element} childNode child node we are looking for.
   * @return {Boolean} true or false.
   */
  function _parentHasNoChild(parent, childNode) {
    if (parent.hasChildNodes()) {
      var children = parent.childNodes;
      for (var i = 0; i < children.length; i++) {
        if (parent.childNodes[i].nodeName.toLowerCase() === childNode) {
          return false;
        }
      }
    }
    return true;
  }


  /**
   * @private
   * Handle children of the table cell.
   *
   * This function iterates over all the children of the table cell
   * and then if the child is part of the mutation added summary
   * or it is a simple line break (without id attribute) then it
   * puts the child inside the newly added paragraph,
   * or else just removes the child node.
   *
   * Two kinds of children of table cell we have seen so far,
   * that are not paragraphs:
   * 1. table cell having empty br tags,
   * which is then put inside the new paragraph
   * (use case where the user selects multiple cells and deletes)
   * 2. table cell having spans with text nodes,
   * which is put inside the new paragraph.
   * (use case where the user selects multiple cells and types a character)
   *
   * TODO(sakhyaghosh): need to investigate if hit any other other situation
   * apart from the two mentioned above.
   *
   * @see _addParagraph
   *
   * @param {HTML Element} tableCell the table cell nodes under inspection.
   * @param {HTML Element} newParagraph the newly added paragraph node.
   * @param {Object} summary Mutation Summary Object.
   */
  function _handleChildren(tableCell, newParagraph, summary) {
    var childNodes = tableCell.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      var childNode = childNodes[i];
      if (_nodeAdded(childNode, summary) || _simpleLineBreak(childNode)) {
        // if the child node of tableCell is part of the mutation summary
        // added nodes, or it is a simple line break
        // (one without the 'id' attribute)
        // then move the child from tableCell to the newParagraph.
        newParagraph.appendChild(childNode);
      }
    }
  }

  /**
   * @private
   * Returns true if it is a line break tag without any id attribute
   * @param {HTML Element} node under inspection.
   * @return {Boolean} true or false.
   */
  function _simpleLineBreak(node) {
    return node.nodeName === 'BR' && !node.getAttribute('id') ? true : false;
  }

  /**
   * @private
   * Create a new paragraph node by cloning from an existing one,
   * adding some new ids as the qowt ids start with 'E-', negative numbers.
   * Also add a line break as child, as this would be the only paragraph in the
   * table cell, letting users to place a cursor and edit.
   *
   * @param {HTML Element} oldParagraph the paragraph that was deleted.
   * @param {HTML Element} tableCell the table cell that had oldParagraph.
   * @param {Object} summary Mutation Summary Object.
   *
   * @return {HTML Element} newly created paragraph node.
   */
  function _createNewParagraph(oldParagraph, tableCell, summary) {
    tableCell = tableCell || {};
    var newParagraph = oldParagraph.cloneNode(false);
    // remove custom attribute removedfromshady
    newParagraph.removeAttribute('removedfromshady');
    if (tableCell.nodeName &&
      tableCell.nodeName.toLowerCase() === 'div' &&
      newParagraph.__dom) {
      newParagraph.__dom.parentNode = summary.getOldParentNode(tableCell);
    }
    NodeTagger.tag(newParagraph, Tags.ADDED);
    if (newParagraph.setEid) {
      newParagraph.setEid(IdGenerator.getUniqueId('E-'));
    }
    else {
      // legacy widget
      newParagraph.id = IdGenerator.getUniqueId('E-');
      newParagraph.setAttribute('qowt-eid', newParagraph.id);
    }

    summary.__additionalAdded.push(newParagraph);
    return newParagraph;
  }


  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: [
      {
        filterConfig: {
          type: Tags.DELETED,
          nodeType: Node.ELEMENT_NODE,
          nodeNames: ['P']
        },
        callback: _addParagraph
      }
    ]
  };
});
