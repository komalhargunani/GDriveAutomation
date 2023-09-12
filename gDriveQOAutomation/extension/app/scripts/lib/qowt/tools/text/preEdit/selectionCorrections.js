/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Since our document contains content as well as structural nodes
 * we can not let the browser simply execute 'delete edits' on seleted
 * nodes. Either backspace, forward-delete, enter action and/or paste
 * need to be validated before we allow them from happening. For delete
 * edits at the caret position we may need to first move the caret to a
 * more suitable position for example, and for range selections we need
 * to iterate the range and ensure no structural nodes get deleted.
 *
 * @author avinash.madbhave@synerzip.com (Avinash Madbhave)
 */

define([
  'qowtRoot/errors/unique/textualEditError',
  'qowtRoot/utils/domUtils',
  'qowtRoot/models/env'
  ], function(
    TextualEditError,
    DomUtils,
    EnvModel
  ) {

  'use strict';

  var summary = {};
  var _api = {

    /**
     * Handling the selected area on performing the action keys.
     * 1. Cleaning up the selected area, remove nodes, triming leaf nodes.
     * 2. Setting up the focus on right position.
     * 3. Merging the paras if need.
     *
     * @param {Selection} sel is the selection area
     */
    handle: function(sel, model) {
      var range = sel.getRangeAt(0);
      var endNode = range.endContainer;
      if (EnvModel.app === 'word' &&
        endNode.parentNode.childNodes.length > 1 &&
        endNode.childNodes.length === 0 &&
        range.startContainer.nodeName === 'QOWT-PAGE'&&
        endNode.parentNode.childNodes[1].nodeName === 'SPAN' &&
        endNode.parentNode.childNodes[1].childNodes[0].nodeName === 'BR'
      ){
          range.setEnd(endNode.parentNode, 0);
      }

      var childNodes = Array.from(range.cloneContents().childNodes);
      if (childNodes.length === 1 &&
        ['BR', '#text'].includes(childNodes[0].nodeName)) {
        deleteSelectedText_(range);
      } else if(childNodes.length === 2 &&
        (childNodes[0].nodeName === 'P' &&
        childNodes[1].nodeName !== 'TABLE' &&
        (childNodes[0].querySelector('qowt-drawing') ||
        (childNodes[0].firstElementChild &&
        ['BR'].includes(childNodes[0].firstElementChild.nodeName))))) {
          deleteSelectedText_(range);
      } else if (childNodes.length > 0) {
        var tree = treeOfSelectedNodes_(sel, childNodes);
        tree = mergeSiblingsIfNeed_(tree);
        summary = { merge: [], delete: [], update: [] };
        prepareForDeletion_(tree);
        if (model) {
          var leftSpan = leftSpanNode(tree[0]);
          if (leftSpan) {
            model.rpr = Object.assign({}, leftSpan.model.rpr);
          }
        }
        summary.update.forEach(updateText_);
        var snap = prepareForFocus_(tree);
        summary.delete.forEach(deleteNode_);
        if (summary.merge.length > 1) {
          snap = mergeNode_(summary.merge, snap);
        }
        setFocus_(snap, range, sel);
        removeSectionIfNeeded_();
      } else {
        var failureMsg = 'something is wrong with a selection';

        throw new TextualEditError(failureMsg);
      }
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  function leftSpanNode(tree) {
    if (tree.node.nodeName === 'SPAN') {
      return tree.realNode;
    }
    var children = tree.children;
    if (children.length === 0) {
      return undefined;
    }
    return leftSpanNode(children[0]);
  }
  /**
   * Preparing the focus element
   *
   * @param {Tree} tree is the list of selected nodes.
   * @returns {Object} returns the snap of caret.
   */
  function prepareForFocus_(tree) {
    return getLeftMostLeafNode_(tree[0]);
  }

  /**
   * Getting the focus element
   *
   * @param {Tree} tree is the list of selected nodes.
   * @returns {Object} returns the snap of caret.
   */
  function getLeftMostLeafNode_(leaf) {
    var result = {};
    var node = leaf.realNode;
    var children = leaf.children;
    if (node.getAttribute('removedFromShady') || node.nodeName === 'BR') {
      if (node.previousElementSibling) {
        if (node.previousElementSibling.nodeName === 'SPAN') {
          node = node.previousElementSibling;
          if (node.firstChild) {
            result.node = node.firstChild;
            result.offset = node.firstChild.length;
          } else {
            result.node = node;
            result.offset = node.childNodes.length;
          }
        } else {
          result.node = node.parentNode;
          var childNodes = node.parentNode.children;
          result.offset = Array.prototype.indexOf.call(childNodes, node);
        }
      } else {
        result.node = node.parentNode;
        result.offset = 0;
      }
    } else if (node.nodeName === 'SPAN') {
      result.node = node.firstChild;
      result.offset = node.firstChild.length;
    } else if (children.length > 0) {
      result = getLeftMostLeafNode_(children[0]);
    } else if (children.length === 0) {
      if (node.nodeName === 'P') {
        leaf = DomUtils.getLastEditableNode(node);
        if (leaf.nodeName === 'SPAN') {
          result.node = leaf.firstChild;
          result.offset = leaf.firstChild.length;
        } else {
          result.node = node;
          result.offset = node.childNodes.length;
        }
      } else {
        result.node = node;
        result.offset = node.childNodes.length;
      }
    }
    return result;
  }

  function hasDrawing(para) {
    var hasDrawing = true;
    var drawings = para.querySelectorAll('qowt-drawing');
    if(drawings.length === 0) {
      hasDrawing = false;
    } else {
      for(var i = 0; i < drawings.length && hasDrawing; i++) {
        if(summary.delete.indexOf(drawings[i]) !== -1) {
          hasDrawing = false;
        }
      }
    }
    return hasDrawing;
  }

  /**
   * Deleting the single selected text/br node
   * It is used at the time of only a single text/br node is selected.
   *
   * @param {Range} range of node selection
   */
  function deleteSelectedText_(range){
    var node = range.startContainer;

    if (node instanceof QowtLineBreak) {
      var siblingOrParentNode = node.previousElementSibling;
      if (siblingOrParentNode) {
        siblingOrParentNode = siblingOrParentNode.lastChild;
        startOffset = siblingOrParentNode.textContent.length;
      } else {
        siblingOrParentNode = node.parentNode;
        startOffset = 0;
      }
      node.parentNode.removeChild(node);
      node = siblingOrParentNode;
    } else {
      var textContent = node.textContent;
      var startOffset = range.startOffset;

      var str = textContent.substring(0, range.startOffset);
      str += textContent.substring(range.endOffset);
      if (!(node instanceof QowtWordPara)) {
        node.textContent = str;
      }
    }

    range.setStart(node, startOffset);
    range.setEnd(node, startOffset);
  }

  /**
   * Getting the actual DOM reference of the node
   *
   * @param {Selection} sel is the selection area
   * @param {Node} node is the selected node
   */
  function getDOMRef_(sel, node) {
    var id, element;
    if (node.id) {
      id = node.id;
      element = document.getElementById(id);
    } else if (node.nodeName === 'SPAN') {
      var teid = node.getAttribute('qowt-teid');
      element = document.querySelector('[qowt-teid='+teid+']');
    } else if (node.nodeName === 'BR') {
      element = getDOMRefOfBR_(node);
    } else if (node.nodeName === 'QOWT-SECTION') {
      var index = node.getAttribute('indexed-flow');
      element = document.querySelector('[indexed-flow='+index+']');
    }

    if (element) {
      if (sel.containsNode(element, true)) {
        return element;
      } else if (element.nodeName === 'BR' &&
        sel.containsNode(element.parentNode, true)) {
        return element;
      } else if (element.id.length > 0 && element.id === node.id) {
        return element;
      }
    }

    return null;
  }

  /**
   * Getting the actual DOM reference of the node
   *
   * @param {Node} node is the selected BR node
   */
  function getDOMRefOfBR_(node) {
    var element;
    if (node.parentNode.nodeName === 'SPAN') {
      if (node.parentNode.id) {
        element = document.getElementById(node.parentNode.id);
      } else {
        var teid = node.parentNode.getAttribute('qowt-teid');
        element = document.querySelector('[qowt-teid='+teid+']');
      }
      element = element && element.firstElementChild;
    } else {
      var id = node.parentNode.id;
      var parent = document.getElementById(id);
      if (parent) {
        element = parent.querySelector('br');
      }
    }

    return element;
  }

  /**
   * Ignoring the set of nodes which is not a part of shady
   *
   * @param {Node} node is the selected node
   */
  function ignoreNode_(node) {
    if (
      [
        '#comment',
        '#text',
        'COLGROUP',
        'STYLE',
        'TEMPLATE',
        'QOWT-HEADER',
        'QOWT-FOOTER'
      ].includes(node.nodeName)
    ) {
      return true;
    } else if (node.nodeName === 'DIV' && node.id === 'pageBorders') {
      return true;
    }

    return false;
  }

  /**
   * Creating the tree from given set of child nodes
   *
   * @param {Selection} sel is the selection area
   * @param {Node} childNodes is list of clone elements
   */
  function treeOfSelectedNodes_(sel, childNodes) {
    var tree = [];

    childNodes.forEach(function(node) {
      if (!ignoreNode_(node)) {
        var children = treeOfSelectedNodes_(sel, node.childNodes);
        if (['DIV', 'QOWT-PAGE'].includes(node.nodeName)) {
          tree = tree.concat(children);
        } else {
          var realNode = getDOMRef_(sel, node);
          tree.push({
            'node':node,
            'realNode': realNode,
            'children': children
          });
        }
      }
    });

    return tree;
  }

  /**
   * Merge the childs of tree if they are same nodes
   * mostly same type of childs are section
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function mergeSiblingsIfNeed_(tree) {
    var newTree = [];
    if (tree[0].node.nodeName === 'QOWT-SECTION') {
      var i = 0, j = 0;
      for (i = 1, j = 0; i < tree.length; i++) {
        var prevEid = tree[j].node.getAttribute('qowt-eid');
        var currEid = tree[i].node.getAttribute('qowt-eid');
        if (prevEid === currEid) {
          // merge ith children to jth children
          tree[j].children = tree[j].children.concat(tree[i].children);
          tree[i].ignore = 1;
        } else {
          j = i;
        }
      }
      for (i = 0; i < tree.length; i++) {
        if(!tree[i].ignore) {
          newTree.push(tree[i]);
        }
      }
      if (newTree.length === 1) {
        tree = newTree[0].children;
      } else {
        tree = newTree;
      }
    }
    return tree;
  }

  /**
   * Making the summary of deletion node travaling over the tree
   * from left, between and right side
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareForDeletion_(tree) {
    var i = 0;
    prepareLeftNode_(tree[i]);
    for(i = 1; i < tree.length-1; i++){
      prepareBetweenNodes_(tree[i]);
    }
    tree[i] && prepareRightNode_(tree[i]);
  }

  /**
   * Travaling over the tree from left side nodes
   *
   * @param {Tree} tree is the list of selected nodes.
   * @param {*} ignoreMerge
   */
  function prepareLeftNode_(tree, ignoreMerge) {
    switch (tree.node.nodeName) {
      case 'BR':
        tree.realNode.setAttribute('removedByCode', true);
        tree.realNode.setAttribute('removedFromShady', true);
        summary.delete.push(tree.realNode);
        break;
      case 'A':
      case 'QOWT-DRAWING':
        tree.realNode.setAttribute('removedFromShady', true);
        summary.delete.push(tree.realNode);
        break;
      case 'SPAN':
        prepareForSpan_(tree, 'first');
        break;
      case 'P':
        prepareForFirstPara_(tree, ignoreMerge);
        break;
      case 'TD':
        prepareForFirstTD_(tree);
        break;
      case 'TR':
        prepareForFirstTR_(tree);
        break;
      case 'TABLE':
        prepareForTable_(tree);
        break;
      case 'QOWT-SECTION':
        prepareForFirstSection_(tree);
        break;
    }
  }

  /**
   * Travaling over the tree from right side nodes
   *
   * @param {Tree} tree is the list of selected nodes.
   * @param {*} ignoreMerge
   */
  function prepareRightNode_(tree, ignoreMerge) {
    var returnVal;
    switch (tree.node.nodeName) {
      case 'BR':
        tree.realNode.setAttribute('removedByCode', true);
        tree.realNode.setAttribute('removedFromShady', true);
        summary.delete.push(tree.realNode);
        break;
      case 'A':
      case 'QOWT-DRAWING':
        tree.realNode.setAttribute('removedFromShady', true);
        summary.delete.push(tree.realNode);
        break;
      case 'SPAN':
        returnVal = prepareForSpan_(tree, 'last');
        break;
      case 'P':
        prepareForLastPara_(tree, ignoreMerge);
        break;
      case 'TD':
        prepareForLastTD_(tree);
        break;
      case 'TR':
        prepareForLastTR_(tree);
        break;
      case 'TABLE':
        prepareForTable_(tree);
        break;
      case 'QOWT-SECTION':
        prepareForLastSection_(tree);
        break;
    }
    return returnVal;
  }

  /**
   * Travaling over the tree from center
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareBetweenNodes_(tree) {
    var childNodes, length, i;
    switch (tree.realNode.nodeName) {
      case 'BR':
        tree.realNode.setAttribute('removedByCode', true);
        tree.realNode.setAttribute('removedFromShady', true);
        summary.delete.push(tree.realNode);
        break;
      case 'A':
      case 'SPAN':
      case 'P':
      case 'QOWT-DRAWING':
      case 'TABLE':
      case 'QOWT-SECTION':
        tree.realNode.setAttribute('removedFromShady', true);
        summary.delete.push(tree.realNode);
        break;
      case 'TD':
        childNodes = tree.children;
        if (childNodes.length) {
          length = childNodes.length;
          for(i = 0; i < length; i++){
            childNodes[i].realNode.setAttribute('removedFromShady', true);
            summary.delete.push(childNodes[i].realNode);
          }
        }
        break;
      case 'TR':
        childNodes = tree.children;
        if (childNodes.length) {
          length = childNodes.length;
          for(i = 0; i < length; i++){
            prepareBetweenNodes_(childNodes[i]);
          }
        }
        break;
    }
  }

  /**
   * Handling the span node and triming them if need depending upon index
   *
   * @param {Tree} tree is the list of selected nodes.
   * @param {*} index
   * @param {*} ignoreSummary
   */
  function prepareForSpan_(tree, index, ignoreSummary) {
    var node, allowToDelete = false;

    var oldText = tree.realNode.firstChild ?
      tree.realNode.firstChild.textContent : tree.realNode.textContent;

    var removeText = tree.node.firstChild ?
      tree.node.firstChild.textContent : tree.node.textContent;

    if (oldText === removeText) {
      if (!ignoreSummary) {
        tree.realNode.setAttribute('removedFromShady', true);
        summary.delete.push(tree.realNode);
      }
      allowToDelete = true;
    } else if (removeText !== '' && !ignoreSummary) {
      if (tree.realNode.firstChild.nodeName === 'BR') {
        node = tree.realNode;
      } else {
        node = tree.realNode.firstChild;
      }

      var newText = '';
      if ('first' === index) {
        newText = oldText.replace(
          new RegExp(escapeRegExp_(removeText) + '$'), '');
      } else {
        newText = oldText.replace(removeText, '');
      }

      summary.update.push({ node: node, text: newText });
    }

    return allowToDelete;
  }

  function escapeRegExp_(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Handling left most P tag leaf of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   * @param {*} ignoreMerge
   */
  function prepareForFirstPara_(tree, ignoreMerge) {
    var childNodes = tree.children;
    if (childNodes.length) {
      var length = childNodes.length;
      prepareLeftNode_(childNodes[0]);
      for(var i = 1; i < length; i++){
        if(childNodes[i].realNode) {
          childNodes[i].realNode.setAttribute('removedFromShady', true);
          summary.delete.push(childNodes[i].realNode);
        }
      }
    }

    if (!ignoreMerge) {
      summary.merge.push(tree.realNode);
    }
  }

  /**
   * Handling right most P tag leaf of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   * @param {*} ignoreMerge
   */
  function prepareForLastPara_(tree, ignoreMerge) {
    var childNodes = tree.children;
    var isLastSpanDeleted = false;
    if (childNodes.length) {
      var length = childNodes.length-1;
      for(var i = 0; i < length; i++){
        childNodes[i].realNode.setAttribute('removedFromShady', true);
        summary.delete.push(childNodes[i].realNode);
      }
      isLastSpanDeleted = prepareRightNode_(childNodes[length]);
    } else {
      var range = window.getSelection().getRangeAt(0);
      if (!(range.endOffset === 0 &&
          range.endContainer === tree.realNode &&
          range.endContainer.parentNode.parentNode.localName === 'td')) {
        tree.node.setAttribute('removedFromShady', true);
        summary.delete.push(tree.realNode);
      }
    }

    if (!ignoreMerge) {
      if (isLastSpanDeleted) {
        summary.delete.push(tree.realNode);
      } else {
        if(!hasDrawing(tree.realNode)) {
          summary.merge.push(tree.realNode);
        }
      }
    }
  }

  /**
   * Handling table node of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareForTable_(tree) {
    var needToDelete = needToDeleteTable(tree);
    if (needToDelete === true) {
      tree.realNode.setAttribute('removedFromShady', true);
      summary.delete.push(tree.realNode);
    } else {
      var childNodes = tree.children;
      if (childNodes.length) {
        prepareForDeletion_(childNodes);
      }
    }
  }

  /**
   * Checking of table node deletion
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function needToDeleteTable(tree) {
    var childNodes = Polymer.dom(tree.realNode).childNodes;
    if (tree.children.length === childNodes.length) {
      var isLeftSideSelected = checkLeftTR_(tree);
      var isRightSideSelected = checkRightTR_(tree);
      if (isLeftSideSelected === true && isRightSideSelected === true) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checking the Left Tr node of the tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function checkLeftTR_(tree) {
    // TR
    var lastTRNode = tree.children[0];
    var childNodes = Polymer.dom(lastTRNode.realNode).childNodes;

    // TD
    if (lastTRNode.children.length === childNodes.length) {
      var lastTDNode = lastTRNode.children[0];
      childNodes = Polymer.dom(lastTDNode.realNode).childNodes;

      // TD's node
      if (lastTDNode.children.length === childNodes.length) {
        var lastNode = lastTDNode.children[0];

        if (lastNode.node.nodeName === 'P') {
          childNodes = Array.from(lastNode.realNode.children);

          var leafNode = lastNode.children[0];
          if (lastNode.children.length === childNodes.length) {
            return checkingForLeaf_(leafNode);
          } else {
            if (leafNode && ['SPAN', 'BR'].includes(leafNode.node.nodeName)) {
              var pos = 0;
              var isSpanCompletelySelect = checkingForLeaf_(leafNode);
              if (isSpanCompletelySelect) {
                childNodes.forEach(function(node, index) {
                    if (node === leafNode.realNode) {
                      pos = index;
                    }
                });
                if (pos > 0) {
                  if (childNodes[pos-1].nodeName === 'QOWT-DRAWING') {
                    return true;
                  }
                }
              }
            }
          }
        }
        if (lastNode.node.nodeName === 'TABLE') {
          return needToDeleteTable(lastNode);
        }
      }
    }
    return false;
  }

  /**
   * Checking the right Tr node of the tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function checkRightTR_(tree) {
    // TR
    var lastTRNode = tree.children[tree.children.length - 1];
    var childNodes = Polymer.dom(lastTRNode.realNode).childNodes;

    if (childNodes.length === 0) {
      return true;
    }
    // TD
    if (lastTRNode.children.length === childNodes.length) {
      var lastTDNode = lastTRNode.children[lastTRNode.children.length - 1];
      childNodes = Polymer.dom(lastTDNode.realNode).childNodes;

      // TD's node
      if (lastTDNode.children.length === childNodes.length) {
        var lastNode = lastTDNode.children[lastTDNode.children.length - 1];

        if (lastNode.node.nodeName === 'P') {
          childNodes = lastNode.realNode.children;

          if (lastNode.children.length === childNodes.length) {
            var leafNode = lastNode.children[lastNode.children.length-1];
            return checkingForLeaf_(leafNode);
          }
        }
        if (lastNode.node.nodeName === 'TABLE') {
          return needToDeleteTable(lastNode);
        }
      }
    }
    return false;
  }

  /**
   * Checking the leaf node of table of the tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function checkingForLeaf_(tree) {
    var allowToDelete = false;
    switch (tree.node.nodeName) {
      case 'A':
      case 'BR':
      case 'QOWT-DRAWING':
        allowToDelete = true;
        break;
      case 'SPAN':
        allowToDelete = prepareForSpan_(tree, '', true);
        break;
    }
    return allowToDelete;
  }

  /**
   * Handling left most TR tag leaf of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareForFirstTR_(tree) {
    var childNodes = tree.children;
    if (childNodes.length) {
      var length = childNodes.length;
      prepareForFirstTD_(childNodes[0]);
      for(var i = 1; i < length; i++){
        prepareBetweenNodes_(childNodes[i]);
      }
    }
  }

  /**
   * Handling left most TR tag leaf of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareForLastTR_(tree) {
    var childNodes = tree.children;
    if (childNodes.length) {
      var length = childNodes.length-1;
      for(var i = 0; i < length; i++){
        prepareBetweenNodes_(childNodes[i]);
      }
      prepareForLastTD_(childNodes[length]);
    }
  }

  /**
   * Handling left most TD tag leaf of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareForFirstTD_(tree) {
    var childNodes = tree.children;
    if (childNodes.length) {
      var length = childNodes.length;
      prepareLeftNode_(childNodes[0], true);
      for(var i = 1; i < length; i++){
        childNodes[i].realNode.setAttribute('removedFromShady', true);
        summary.delete.push(childNodes[i].realNode);
      }
    }
  }

  /**
   * Handling right most TD tag leaf of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareForLastTD_(tree) {
    var childNodes = tree.children;
    if (childNodes.length) {
      var length = childNodes.length-1;
      for(var i = 0; i < length; i++){
        childNodes[i].realNode.setAttribute('removedFromShady', true);
        summary.delete.push(childNodes[i].realNode);
      }
      prepareRightNode_(childNodes[length], true);
    }
  }

  /**
   * Handling left most Section tag leaf of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareForFirstSection_(tree) {
    var childNodes = tree.children;
    if (childNodes.length) {
      var length = childNodes.length;
      prepareLeftNode_(childNodes[0]);
      for(var i = 1; i < length; i++){
        childNodes[i].realNode.setAttribute('removedFromShady', true);
        summary.delete.push(childNodes[i].realNode);
      }
    }
  }

  /**
   * Handling right most Section tag leaf of tree
   *
   * @param {Tree} tree is the list of selected nodes.
   */
  function prepareForLastSection_(tree) {
    var childNodes = tree.children;
    if (childNodes.length) {
      var length = childNodes.length-1;
      for(var i = 0; i < length; i++){
        childNodes[i].realNode.setAttribute('removedFromShady', true);
        summary.delete.push(childNodes[i].realNode);
      }
      prepareRightNode_(childNodes[length]);
    }
  }

  // vvvvvvvvvvvvvvvvvvvvvvvv DOM manipulation vvvvvvvvvvvvvvvvvvvvvvvvv

  /**
   * Updating the dom node text
   *
   * @param {Node} item is the dom node
   */
  function updateText_(item) {
    item.node.textContent = item.text;
  }

  /**
   * Deleting the dom node
   *
   * @param {*} node
   */
  function deleteNode_(node) {
    node.setAttribute('removedFromShady', true);
    if (node.nodeName === 'BR') {
      node.setAttribute('removedByCode', true);
    }
    var parent = Polymer.dom(node).parentNode;
    var childNodes = Polymer.dom(node).childNodes;
    setAttrRemovedFromShady(childNodes);
    if (parent) {
      Polymer.dom(parent).removeChild(node);
      Polymer.dom(parent).flush();
    }

    if (node instanceof QowtSection) {
      var section = node.flowInto;
      while (section) {
        childNodes = Polymer.dom(section).childNodes;
        setAttrRemovedFromShady(childNodes);
        parent = Polymer.dom(section).parentNode;
        section.setAttribute('removedFromShady', true);
        Polymer.dom(parent).removeChild(section);
        Polymer.dom(parent).flush();
        section = section.flowInto;
      }
    }
  }

  /**
   * Setting the remove from the shady attribute to dom element
   *
   * @param {*} childNodes
   */
  function setAttrRemovedFromShady(childNodes) {
    childNodes.forEach(function(child){
      if (child.nodeType === Node.ELEMENT_NODE) {
        child.setAttribute('removedFromShady', true);
        if (child.nodeName === 'BR') {
          child.setAttribute('removedByCode', true);
        }
        var children = Polymer.dom(child).childNodes;
        children.length > 0 && setAttrRemovedFromShady(children);
      }
    });
  }

  /**
   * Merging the two paras
   *
   * @param {*} merge
   */
  function mergeNode_(merge, snap){
    var para = merge[0];
    var nextPara = merge[1];
    var childNodes = para.children;
    var lastChild = childNodes[childNodes.length-1];
    if (!(lastChild && lastChild.nodeName === 'QOWT-DRAWING')) {
      mergeChildNodes(nextPara,para);
    } else if (lastChild &&
      lastChild.nodeName === 'QOWT-DRAWING' &&
      nextPara.firstElementChild.firstChild.nodeName === 'BR'
    ) {
        mergeChildNodes(nextPara,para);
        snap.node = snap.node.lastElementChild;
    } else {
      snap.offset = 0;
      snap.node = nextPara;
      if (nextPara.firstElementChild) {
        snap.node = nextPara.firstElementChild;
        if (snap.node.nodeName === 'SPAN' && snap.node.firstChild) {
          snap.node = snap.node.firstChild;
        }
      }
    }
    return snap;
  }

  function mergeChildNodes(nextPara,para) {
    var childNodes = nextPara.children;
    for(var i = 0; i < childNodes.length; i++) {
      var clone = childNodes[i].cloneNode(true);
      para.appendChild(clone);
    }
    deleteNode_(nextPara);
  }

  /**
   * Set the focus on element
   *
   * @param {*} element
   * @param {*} range
   * @param {Selection} sel is the selection area
   */
  function setFocus_(snap, range, sel) {
    correctingFocus_(snap);
    var node = snap.node;
    var offset = snap.offset;
    range.setStart(node, offset);
    range.setEnd(node, offset);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Correcting the focus snap if section is selected
   *
   * @param {*} snap
   */
  function correctingFocus_(snap) {
    var node = snap.node;
    var offset = snap.offset;
    if (node.nodeName === 'QOWT-SECTION') {
      var newPara, newRun;
      if (offset > 5 &&
        node.childNodes.length-1 === offset &&
        node.childNodes[offset].nodeName === '#text') {
        newPara = new QowtWordPara();
        Polymer.dom(node).appendChild(newPara);
        Polymer.dom(node).flush();
        snap.node = newPara;
        snap.offset = 1;
      }
      var sections = document.querySelectorAll('qowt-section[id]');
      if (node === sections[0] && isSectionCompletelyEmpty_(node)) {
        newPara = new QowtWordPara();
        newRun = new QowtWordRun();
        newPara.appendChild(newRun);
        Polymer.dom(node).appendChild(newPara);
        Polymer.dom(node).flush();
        snap.node = newPara;
        snap.offset = 1;
      } else if (offset === 2) {
        var para = Polymer.dom(node).firstChild;
        if (!para) {
          node = node.flowInto;
          while (node && !para) {
            para = Polymer.dom(node).firstChild;
            node = node.flowInto;
          }
        }
        snap.node = para;
        snap.offset = 1;
      }
    }
  }

  /**
   * Removing the sections if need
   *
   */
  function removeSectionIfNeeded_() {
    var sections = document.querySelectorAll('qowt-section[id]');
    for (var i = 1; i < sections.length; i++) {
      if (isSectionCompletelyEmpty_(sections[i])) {
        var node = sections[i];
        var parentNode = Polymer.dom(node).parentNode;
        node.setAttribute('removedFromShady', true);
        Polymer.dom(parentNode).removeChild(node);
        Polymer.dom(parentNode).flush();
        var section = node.flowInto;
        while (section) {
          parentNode = Polymer.dom(section).parentNode;
          section.setAttribute('removedByCode', true);
          section.setAttribute('removedFromShady', true);
          Polymer.dom(parentNode).removeChild(section);
          Polymer.dom(parentNode).flush();
          section = section.flowInto;
        }
      }
    }
  }

  function isSectionCompletelyEmpty_(node) {
    var isEmpty = false;
    if (node.isEmpty()) {
      isEmpty = true;
      var iter = node.flowInto;
      while (iter) {
        if (!iter.isEmpty()) {
          isEmpty = false;
          break;
        }
        iter = iter.flowInto;
      }
    }
    return isEmpty;
  }

  return _api;
});