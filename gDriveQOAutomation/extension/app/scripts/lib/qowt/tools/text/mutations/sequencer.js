// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview the Sequencer is an integral part
 * of the Text Tool. It ensures all recorded mutations
 * are sequenced in to commands, which when replayed
 * will guarantee the same outcome of the mutations,
 * thereby keeping both HTML and Core DOMs in sync.
 *
 * For more information see
 *    http://goto/qowt-text-tool-design
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/tools/text/mutations/graph',
  'qowtRoot/tools/text/mutations/cleanersManifest',
  'qowtRoot/tools/text/mutations/translatorsManifest',
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/pubsub/pubsub'
], function(
    Tags,
    Graph,
    AllCleaners,
    AllTranslators,
    NodeTagger,
    PubSub) {

  'use strict';

  var _api = {
    /**
     * Initializes mutation sequencer.
     */
    init: function() {
      if (_disableToken) {
        throw new Error('sequencer.init() called multiple times.');
      }

      _translators = AllTranslators;
      _cleaners = AllCleaners;

      _disableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },

    /**
     * disables all references.
     */
    disable: function() {
      PubSub.unsubscribe(_disableToken);
      _disableToken = undefined;
      if (_translators && _translators.destroy) {
        _translators.destroy();
      }
      if (_cleaners && _cleaners.destroy) {
        _cleaners.destroy();
      }
      _translators = undefined;
      _cleaners = undefined;
    },

    cleanHTML: function(mutationSummary) {

      // NOTE: cleaners could add additional elements
      // we uses the __additionalAdded array for this, but
      // to avoid potential eternal loops by having cleaner A
      // add something, which when cleaned causes cleaner B to add
      // something else, we only iterate over this __additionalAdded
      // array ONCE!!!
      mutationSummary.__additionalAdded = [];

      _cleanHTML(mutationSummary);

      if (mutationSummary.__additionalAdded.length > 0) {
        // swap the __additionalAdded as "added"
        mutationSummary.origAdded = mutationSummary.added;
        mutationSummary.added = mutationSummary.__additionalAdded;
        mutationSummary.__additionalAdded = [];

        // re-clean
        _cleanHTML(mutationSummary);

        // now merge origAdded and added
        mutationSummary.added =
            mutationSummary.origAdded.concat(mutationSummary.added);
      }

      if (mutationSummary.__additionalAdded.length > 0) {
        throw new Error('Additional elements added twice during cleaning!');
      }

      delete mutationSummary.__additionalAdded;
    },

    /**
     * The heart of the sequencer... Determines how
     * the mutations are sequenced, in order to achieve
     * a sequence of commands which result in the *exact*
     * same outcome as the mutation summary as a whole.
     *
     * For more information see: http://goto/qowt-text-tool-design
     *
     * @param mutationSummary {object} object containing all the mutations
     */
    translateMutations: function(mutationSummary) {
      mutationSummary.__requiresIntegrityCheck = [];

      // translate all structural changes
      _translateRestructuring(mutationSummary);

      // translate all text changes
      _translateTextChange(mutationSummary);

      // translate any format changes
      _translateFormatChange(mutationSummary);
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  var _translators,
      _cleaners,
      _disableToken;

  function _cleanHTML(mutationSummary) {

    // process any attibutes that have changed
    for (var attrib in mutationSummary.attributeChanged) {
      if (mutationSummary.attributeChanged.hasOwnProperty(attrib)) {
        var nodeArray = mutationSummary.attributeChanged[attrib];
        if (nodeArray) {
          _cleaners.processNodes(mutationSummary, nodeArray);
        }
      }
    }

    // process any newly added nodes
    if (mutationSummary.added) {
      _cleaners.processNodes(mutationSummary, mutationSummary.added);
    }

    // process any moved nodes
    if (mutationSummary.reordered) {
      _cleaners.processNodes(mutationSummary, mutationSummary.reordered);
    }
    if (mutationSummary.reparented) {
      _cleaners.processNodes(mutationSummary, mutationSummary.reparented);
    }

    // process any removed nodes
    if (mutationSummary.removed) {
      _cleaners.processNodes(mutationSummary, mutationSummary.removed);
    }

  }

  function _translateRestructuring(summary) {
    var graph = Graph.create();

    function watchNode(node) {
      if (NodeTagger.isTagged(node)) {
        graph.watchNode(node);
      }
    }

    summary.added.forEach(watchNode);
    summary.reordered.forEach(watchNode);
    summary.reparented.forEach(watchNode);
    summary.removed.forEach(watchNode);

    function movedFromOldParent(node) {
      if (NodeTagger.isTagged(node)) {
        var oldParentNode = summary.getOldParentNode(node);
        if (oldParentNode) {
          if (oldParentNode.nodeName === 'DIV') {
            if (node.nodeName === 'QOWT-SECTION') {
              // In shady dom, qowt-section doesn't have qowt-page as an
              // immediate parent node. It has wrapped with two div elements.
              // To get qowt-page element as a parent we need to invoke
              // summary.getOldParentNode function two times.
              oldParentNode = summary.getOldParentNode(oldParentNode);
              oldParentNode = summary.getOldParentNode(oldParentNode);
            } else {
              oldParentNode = summary.getOldParentNode(oldParentNode);
            }
          }
        }
        if (oldParentNode) {
          if (NodeTagger.hasTag(oldParentNode, Tags.DELETED)) {
            graph.addEdge(node, oldParentNode);
          } else if (oldParentNode.childNodes &&
              oldParentNode.childNodes.length === 1 &&
              node !== oldParentNode.firstChild) {
            // node replaced ? delete and then insert not the other-way round!
            graph.addEdge(node/*earlier*/, oldParentNode.firstChild/*later*/);
          } else if (oldParentNode.nodeName === 'TD') {
            oldParentNode = oldParentNode.children[0];
            if (oldParentNode.children.length === 1 &&
              node !== oldParentNode.firstElementChild) {
              // node replaced ? delete and then insert not the other-way round!
              graph.addEdge(node/*earlier*/,
                oldParentNode.firstElementChild/*later*/);
            }
          }
        }
      }
    }

    function remainsInDom(node) {
      if (NodeTagger.isTagged(node)) {
        if (node.previousSibling) {
          graph.addEdge(node.previousSibling, node);
        }
        if (node.parentNode) {
          graph.addEdge(node.parentNode, node);
        }
      }
    }

    summary.added.forEach(remainsInDom);
    summary.reordered.forEach(remainsInDom);
    summary.reparented.forEach(remainsInDom);

    summary.reparented.forEach(movedFromOldParent);
    summary.removed.forEach(movedFromOldParent);

    var order = graph.traverse();

    _translate(summary, order, [Tags.ADDED, Tags.MOVED, Tags.DELETED]);
  }


  function _translate(summary, nodeArray, filterArray) {
    nodeArray.forEach(function(node) {
      if (node.nodeName === 'SPAN') {
        // filter out all temporary run nodes that are not a part of original
        // document.
        if (!node.hasAttribute('qowt-teid') || node.hasAttribute('qowt-eid')) {
          _translators.processNodes(summary, node, filterArray);
        }
      } else {
        _translators.processNodes(summary, node, filterArray);
      }
    });
  }

  // just iterate over all nodes that had char data changed; no need for
  // any specific sequencing
  function _translateTextChange(summary) {
    var nodesToTranslate = summary.characterDataChanged;
    _translate(summary, nodesToTranslate, [Tags.CHARDATA]);
  }


  // just iterate over all nodes that had style attrib changed; no need for
  // any specific sequencing
  function _translateFormatChange(summary) {
    var fontChangedNodes = summary.attributeChanged['class'];
    if(fontChangedNodes) {
      _translate(summary, fontChangedNodes, [Tags['ATTRIB-CLASS']]);
    }
    var formatChangedNodes = summary.attributeChanged.style;
    if(formatChangedNodes) {
      _translate(summary, formatChangedNodes, [Tags['ATTRIB-STYLE']]);
    }
    var formatAttribChangedNodes = summary.attributeChanged['qowt-format'];
    if (formatAttribChangedNodes) {
      _translate(summary, formatAttribChangedNodes, [Tags['ATTRIB-FORMAT']]);
    }
  }

  return _api;
});
