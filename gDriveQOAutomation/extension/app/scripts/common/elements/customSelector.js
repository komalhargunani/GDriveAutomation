/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview JELTE TODO WRITE ME
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'utils/rangeUtils',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/models/env'
  ], function(
    RangeUtils,
    ArrayUtils,
    EnvModel
    ) {

  'use strict';

  var api_ = {

    querySelectorByAction: function(selector, actions) {
      var elements = document.querySelectorAll(selector);
      var supported = supportedNodesInNodeList_(elements, actions, true);
      return supported[0];
    },

    querySelectorAllByAction: function(selector, actions) {
      var elements = document.querySelectorAll(selector);
      var supported = supportedNodesInNodeList_(elements, actions);
      return supported;
    },

    findInPath: function(selectorOrNode, actions) {
      if (selectorOrNode) {
        var el = (selectorOrNode.nodeName) ?
          selectorOrNode : document.querySelector(selectorOrNode);

        var supported = supportedNodesInPath_(el, actions, true);
        return supported[0];
      }
    },

    /**
     * Starts at the first element found via selector (or given node) and
     * then walks up the parent tree and returns ALL elements along that
     * path which support actions
     *
     * @param {boolean} name argument for x y z
     */
    findAllInPath: function(selectorOrNode, actions) {
      var supported = [];
      if (selectorOrNode) {
        var el = (selectorOrNode.nodeName) ?
          selectorOrNode : document.querySelector(selectorOrNode);

        supported = supportedNodesInPath_(el, actions);
      }
      return supported;
    },

    findInSelection: function(actions) {
      var supported = supportedNodesInSelection_(actions, true);
      return supported[0];
    },

    findAllInSelection: function(actions) {
      var supported = supportedNodesInSelection_(actions);
      return supported;
    },

    findInSelectionChain: function(actions) {
      var el = api_.findInSelection(actions);

      // if we didn't find anything in the selection itself,
      // walk up the selection chain (eg from range.commonAncestorContainer)
      return el ? el : api_.findInPath(selectionCommonAncestor_(), actions);
    },

    findAllInSelectionChain: function(actions) {
      var supported = api_.findAllInSelection(actions);

      // now walk up the selection chain to search for more
      supported = supported.concat(
          api_.findAllInPath(selectionCommonAncestor_(), actions));
      return ArrayUtils.unique(supported);
    }

  };
  // -------------------------------------------------

  function selectionCommonAncestor_() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var ancestor = (range && range.commonAncestorContainer);
      return ancestor;
    }
  }

  function supportedNodesInNodeList_(nodeList, actions, opt_breakOnFirstFind) {
    var supported = [];
    for (var i = 0; i < nodeList.length; i++) {
      var el = nodeList[i];
      if (supportsActions_(el, actions)) {
        supported.push(el);
        if (opt_breakOnFirstFind) {
          break;
        }
      }
    }
    return supported;
  }

  function supportedNodesInPath_(startNode, actions, opt_breakOnFirstFind) {
    var supported = [];

    while (startNode) {
      if (supportsActions_(startNode, actions)) {
        supported.push(startNode);
        if (opt_breakOnFirstFind) {
          break;
        }
      }
      startNode = startNode.parentNode;
    }
    return supported;
  }

  function supportedNodesInSelection_(actions, opt_breakOnFirstFind) {
    var supported = [];
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var endNode = range.endContainer;
     if (EnvModel.app === 'word' &&
        actions.includes('jus') &&
        endNode.nodeName === 'P' &&
        endNode.isEmpty() &&
        range.startContainer.nodeName === 'QOWT-PAGE'
      ) {
        if (endNode.childNodes.length > 2 &&
          endNode.childNodes[1].nodeName === 'BR') {
          range.setEnd(endNode.childNodes[2], 0);
        }
        else if (endNode.childNodes.length > 2 &&
          endNode.childNodes[1].nodeName === 'SPAN') {
          range.setEnd(endNode.childNodes[2], 0);
        }
        else if (endNode.childNodes.length === 2 &&
          endNode.childNodes[1].nodeName === 'BR') {
          range.setEnd(endNode.childNodes[1], 0);
        }
        else if (endNode.childNodes.length === 2 &&
          endNode.childNodes[1].nodeName === 'SPAN') {
            range.setEnd(endNode.childNodes[1].childNodes[0], 0);
        }
      }
      var iter = RangeUtils.createIterator(range, NodeFilter.SHOW_ELEMENT,
          false, true);
      var current;
      while ((current = iter.nextNode())) {
        if (supportsActions_(current, actions)) {
          supported.push(current);
          if (opt_breakOnFirstFind) {
            break;
          }
        }
      }
    }
    return supported;
  }

  function supportsActions_(el, actions) {
    return (el && el.isQowtElement && el.supports(actions));
  }


  return api_;
});