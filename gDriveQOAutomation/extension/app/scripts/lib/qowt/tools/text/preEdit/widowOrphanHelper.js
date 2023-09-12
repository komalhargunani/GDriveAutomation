/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview helper module to unbalance widow/orphans
 * when needed PRIOR to doing any edits
 *
 * TODO(jliebrand): rename this module and all the clients
 * using it; now that we no longer really have widow/orphans but
 * rather "flows".
 *
 * For now, keeping the name, since our polymerWord CL is already
 * rather large. Ultimately we should never even do this, but
 * instead use OT to ensure we can flow + edit without unflow
 * see: http://goo.gl/6GzKIC
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'utils/rangeUtils',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/models/env'], function(
    RangeUtils,
    SelectionManager,
    PubSub,
    TypeUtils,
    ArrayUtils,
    EnvModel) {

  'use strict';

  var _api = {

    /**
     * Create a tree walker over the current selection (collapsed or not)
     * using a filter to only accept content nodes.
     * Iterate through the nodes and unbalance them.
     */
    unbalanceSelection: function() {
      // TODO(jliebrand): we should not have app specific knowledge
      // in here like this. Ultimately the TextTool should look at
      // it's "scope" element to determine if unflowing is required.
      // Example: we also shouldn't require unflow when editing elements
      // inside the header/footer. But for now, "making this work" with
      // polymer-word without breaking point...
      if (EnvModel.app === "word") {
        var nodes = [];
        var sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          var range = sel.getRangeAt(0);
          var rangeIter = RangeUtils.createIterator(range,
              (NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT), true);
          var current;
          while ((current = rangeIter.nextNode())) {
            nodes.push(current);
          }
        }
        _unbalanceNodes(nodes);
      }
    },

    balance: function() {
      if (EnvModel.app === "word") {
        var sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          var msdoc = document.querySelector('qowt-msdoc');
          var range = sel.getRangeAt(0);
          var flowPara = range.startContainer.parentElement.parentElement;
          var page = flowPara.closest('qowt-page');
          var allParagraphs =
          page.querySelectorAll('p:not([qowt-paratype="hf-para"])');
          if(flowPara.nodeName === 'P' &&
            allParagraphs[allParagraphs.length -1].id === flowPara.id) {
            if(page.flowInto) {
              var snapShot = SelectionManager.snapshot();
              PubSub.publish('qowt:suppressTextTool', {});
              msdoc.ignoreMutations();
              page.flow(page);
              PubSub.publish('qowt:unsuppressTextTool', {});
              msdoc.listenForMutations();
              SelectionManager.restoreSnapshot(snapShot);
            }
          }
        }
      }
    },

    /**
     * Unbalance a node. For conveniance you can either pass
     * HTML Nodes, or strings representing node IDs.
     * Furthermore, it is smart enough to find the node
     * even if the qowt EID is not in the DOM. In other words,
     * if the string is "E23" it will find nodes with id "E23" as
     * well as nodes with id "E23-owchain-xxx"
     *
     * @param {HTML ELement|String} nodeRef either HTML node or a string
     */
    unbalanceNode: function(nodeRef) {
      // TODO(jliebrand): we should not have app specific knowledge
      // in here like this. Ultimately the TextTool should look at
      // it's "scope" element to determine if unflowing is required.
      // Example: we also shouldn't require unflow when editing elements
      // inside the header/footer. But for now, "making this work" with
      // polymer-word without breaking point...
      if (EnvModel.app === "word") {
        if (nodeRef) {
          _unbalanceNodes([nodeRef]);
        }
      }
    },

    /**
     * Unbalance all nodes from a given array. For conveniance the
     * array can contain either HTML Nodes, or strings representing
     * node IDs. Furthermore, it is smart enough to find the node
     * even if the qowt EID is not in the DOM. In other words,
     * if the string is "E23" it will find nodes with id "E23" as
     * well as nodes with id "E23-owchain-xxx"
     *
     * @param {Array} nodes array containing either HTML nodes or strings
     */
    unbalanceNodes: function(nodes) {
      // TODO(jliebrand): we should not have app specific knowledge
      // in here like this. Ultimately the TextTool should look at
      // it's "scope" element to determine if unflowing is required.
      // Example: we also shouldn't require unflow when editing elements
      // inside the header/footer. But for now, "making this work" with
      // polymer-word without breaking point...
      if (EnvModel.app === "word") {
        if (TypeUtils.isList(nodes)) {
          _unbalanceNodes(nodes);
        }
      }
    }

  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  var _nodeFromRef = function(nodeRef) {
    var node;
    if (nodeRef && nodeRef instanceof Node) {
      node = (nodeRef.nodeType === Node.TEXT_NODE) ?
          nodeRef.parentNode : nodeRef;
    } else if (TypeUtils.isString(nodeRef)) {
      node = document.getElementById(nodeRef) ||
             document.querySelector('[qowt-eid="' + nodeRef + '"]');
    }
    return node;
  };


  var _unbalanceNodes = function(nodeRefs) {
    // for every node, climb up to the first 'block' level element, as
    // it is those elements we wish to unflow. At worst contentEditable
    // changes the structure of these elements (eg hit enter in the
    // middle of a paragraph). ContentEditable doesn't "edit" table rows
    // for example, so there is no need to unflow a table row; just the
    // paragraphs inside each cell.
    var blockElements = [];
    for (var i = 0; i < nodeRefs.length; i++) {
      var nodeRef = nodeRefs[i];
      var node = _nodeFromRef(nodeRef);

      var display = '';
      do {
        var computedStyles = node && node instanceof Element &&
          node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE &&
          window.getComputedStyle(node);
        display = (computedStyles && computedStyles.display);
      } while (display !== 'block' && display !== 'table' &&
          node && node.parentNode && node.parentNode.nodeType !==
          Node.DOCUMENT_FRAGMENT_NODE && (node = node.parentNode));

      if (node && (display === 'block' || display === 'table') &&
        !(node instanceof QowtSection) && !(node instanceof QowtPage)) {
        blockElements.push(node);
      }
    }

    // make sure our array is unique
    // (dont want to unflow elements more than once)
    blockElements = ArrayUtils.unique(blockElements);

    if (blockElements.length > 0) {
      // make sure our doc (and thus pages) ignore mutations
      // caused by us unflowing; and make sure the TextTool
      // ignores them as well.
      var msdoc = document.querySelector('qowt-msdoc');
      PubSub.publish('qowt:suppressTextTool', {});
      msdoc.ignoreMutations();
      var snapshot = SelectionManager.snapshot();


      // unflow all relevant top level elements
      blockElements.forEach(function(element) {
        if (element.supports && element.supports('flow') &&
            element.isFlowing()) {
          msdoc.cacheScrollTop(element);
          element.unflow();
        }
      });

      // Let the doc and the TextTool listen for further mutations
      PubSub.publish('qowt:unsuppressTextTool', {});
      msdoc.listenForMutations();
      SelectionManager.restoreSnapshot(snapshot);
    }
  };

  return _api;

});
