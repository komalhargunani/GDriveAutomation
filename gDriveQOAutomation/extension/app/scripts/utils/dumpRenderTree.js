/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview This module is part of the Render tree comparison testing tool
 * (aka Volq). It produces a render tree signature string (aka blessed render
 * tree) that is sent to the Render Tree Dumper Chrome extension that takes
 * care to upload it to a GAE datastore.
 * The render tree signature is also sent to another Chrome extension
 * (Client Side Tester) when tests are run to compare the render tree with
 * the copy stored on the GAE server.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

// Constant: Size limit for the render tree signature
var kMaxTreeSize = 30000;

define([], function() {

  var _api = {

    /**
     * Dump the blessed render tree of a document.
     * @param {Node} node A HTML node. From the given node, it loops through
     *                    the children
     */
    dump: function(node) {
      if (node) {
        return _trimRenderTree(_dump(node));
      }
      return undefined;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  /**
   * Trim the render tree to a maximum size
   */
  function _trimRenderTree(renderTree) {
    return renderTree.substring(0, kMaxTreeSize);
  }

  /**
   * Add main styling properties of a node
   */
  function _addStyle(node) {
    var styleStr = '';
    var computedStyle = window.getComputedStyle(node);

    function _addComputedElement(styleType) {
      var elStr = '';
      if (computedStyle[styleType] && computedStyle[styleType] !== 'auto') {
        elStr += ' ' + styleType + '=' + computedStyle[styleType];
      }
      return elStr;
    }

    // In Sheet qowt-sheet-cell-format doesn't have color styles
    if (!node.classList.contains('qowt-sheet-cell-format')) {
      styleStr += _addComputedElement('color');
    }

    // In Sheet qowt-sheet-cell-content doesn't have background color styles
    if (!node.classList.contains('qowt-sheet-cell-content')) {
      styleStr += _addComputedElement('backgroundColor');
    }

    // Add position and size of the node
    styleStr += ' top=' + node.offsetTop;
    // TODO offsetLeft changes between test runs so I commented out.
    // It is relative to the parent element and we should damp a value that is
    // absolute. We could traverse offsetParent up to the top level of the DOM.
    /* styleStr += ' left=' + node.offsetLeft; */
    styleStr += ' width=' + node.offsetWidth;
    styleStr += ' height=' + node.offsetHeight;

    return styleStr;
  }

  /**
   * Choose which nodes to include in the render signature
   * Support Word documents and Sheet workbooks
   * Dump only the main nodes that have useful information
   */
  function _includeNode(node) {
    // TODO: Add support for Point presentations
    // TODO: Add support for charts
    return (node && node.getAttribute &&
        (node.getAttribute('qowt-eid') ||
            node.getAttribute('qowt-type') ||
            node.classList.contains('qowt-sheet-cell-content') ||
            node.classList.contains('qowt-sheet-cell-format') ||
            node.classList.contains('qowt-point-slide')));
  }

  function _dump(node) {
    var str = '';

    if (_includeNode(node)) {
      str += '<' + node.tagName;
      if (node.id) {
        str += ' id=' + node.id;
      }
      str += _addStyle(node);
      str += '>';
      str += node.textContent;
    }

    // loop through children
    for (var i = 0; i < node.childNodes.length; i++) {
      str += _dump(node.childNodes[i]);
    }

    if (_includeNode(node)) {
      str += '</' + node.tagName + '>';
    }

    return str;
  }

  return _api;
});
