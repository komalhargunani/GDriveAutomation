/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview cleaner to spot any non qowt elements (like plain P or SPAN)
 * and convert them to Qowt Elements instead. It will clear all tags
 * of the original plain elements (ensuring that they thus do not get
 * translated; in other words, ensuring they get ignored), and then adds
 * the equivalent qowt element to summary.__additionalAdded array.
 *
 * NOTE: normally any new elements created/added in the DOM should have been
 * upgraded already by the time the mutation observers get triggered. That is
 * because generally DOM changes are initiated from script, which allows chrome
 * to guarantee custom element upgrade can happen on time. However, for
 * contentEditable that is not the case. The change is initiated from within
 * the browser itself. Thus when we get the mutation, the elements are not yet
 * upgraded. To by pass this timing issue, we could/should handle the mutation
 * in a Promise.resolve (which will guarantee a new micro task - and thus
 * guarantee that the elements have been upgraded).
 * Unfortunately, we can not do that easily, because handling the mutation in
 * a new micro task, means the mutation observer would record any cleaning we do
 * which we do not want (summary library ensures we can change the HTML in the
 * callback, without triggering further mutations).
 *
 * So instead of handling the mutation in a new micro task, we use this rather
 * heavy weight cleaner that will simply "convert" any element that appears to
 * not be a QowtElement in to a QowtElement (and move all children).
 * TODO(jliebrand): We should fix this. We should make sure the mutation is only
 * handles when the elements have upgraded. HOWEVER, even if we fix that we do
 * need to be robust enough to be able to handle non QowtElements for future
 * features. For example, paste/drag/drop could put a plain <p> element in the
 * DOM. So even if we fix it, we still need this cleaner. Hence we have not yet
 * fixed it, since this cleaner already addresses the issue.
 *
 * Note: cleaners should not modify any of the summary.added/removed/reparented
 * arrays themselves. The only thing a cleaner is allowed to do is
 * modify the node (including removing its tags) and/or add new nodes
 * to __additionalAdded. That array will then be cleaned and concatenated
 * with the summary.added array.
 * NOTE: it is imperative that cleaners try and avoid creating new elements
 * like this. To avoid getting in an eternal loop where one cleaner adds an
 * element, causing another cleaner to add yet another on the second clean, we
 * only run the cleaning of the __additionalAdded array ONCE...
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'utils/rangeUtils',
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/utils/idGenerator',
  'qowtRoot/utils/domUtils',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/features/utils',
  'qowtRoot/models/env',

  'third_party/lo-dash/lo-dash.min'
  ], function(
    RangeUtils,
    NodeTagger,
    IdGenerator,
    DomUtils,
    Tags,
    Features,
    EnvModel) {

  'use strict';


  function handleNewElement_(summary, node) {
    // if this node was created from another node (eg
    // hitting enter in a paragraph creating a new paragraph)
    // then we need to make sure we decorate the new node
    // so that it's model is accurately reflecting it's style
    var originalNode = findOriginalNode_(summary, node);

    // but before we do, make sure the new node is a true QowtElement
    // Normally, when a mutation observer triggers due to any change
    // to the DOM, all custom elements will have been upgraded already.
    // However, for contentEditable this is not true. It is the only (legacy)
    // case where DOM changes are initiated not from script, which means
    // you are not guaranteed at the time of the Mutation Observer callback
    // that the elements have upgraded correctly. There are a number of
    // problems with this, not least of which is that our pagination would
    // not work correctly.
    // Once contentEditable has been rewritten as part of blink-in-JS, this
    // should no longer be an issue. Until then, we can do two things:
    //   a- make sure *ALL* mutation observers and event handlers
    //      reschedule themselves in a Promise.resolve to ensure they
    //      run in a new micro task. This is not feasible, since this
    //      would apply to *any* event listener
    //   b- The other option is to manually "fix" the HTML by swapping
    //      non-QowtElements out for their equivalent QowtElement. This
    //      is a kludge, but the safest solution for us for now.
    var parentNode = node.parentNode;
    var nonShady;
    if (parentNode) {
      var shadyChildren = Array.from(Polymer.dom(parentNode).children);
      nonShady = !(shadyChildren.includes(node));
    }
    if (!node.isQowtElement) {
      var newEl = createNewQowtElement_(node);
      if (newEl) {
        swapNodes_(summary, node, newEl, nonShady);
        node = newEl;
      }
    }

    // if we found a reference to an original node, then
    // make sure the new node has the right model by decorating it
    // with the model of the original node. We ONLY do this if the
    // new node was not cloned by us (eg if it originated from contentEditable)
    if (originalNode && !node.__clonedByQowt && originalNode.model) {
      // TODO(jliebrand): change this ppr/rpr/cpr madness to formatting
      // once the core supports it (http://crbug/404135)
      var formatting =
          originalNode.model.formatting ||
          originalNode.model.ppr ||
          originalNode.model.rpr ||
          originalNode.model.cpr ||
          originalNode.model.ipr ||
          originalNode.model;

      // make sure we decorate synchronously since the TextTool
      // is surpressed while the cleaners run and we don't want it
      // to spot these changes. (eg the second 'true' argument)
      node.decorate(formatting, true);
    }

    // now make sure the new node as a unique EID
    var newEid = IdGenerator.getUniqueId('E-');
    if (node.setEid) {
      node.setEid(newEid);
    } else {
      node.id = newEid;
      node.setAttribute('qowt-eid', newEid);
    }

    //correct bullet indentation
    if(node.correctBulletIndentation) {
      node.correctBulletIndentation();
    }

    // return value used in unit tests only
    return node;
  }


  /**
   * Move the children from one node to another. Throws an exception
   * if for whatever reason it was not able to move all children.
   *
   * @param {HTMLElement} from the node from which to move the children
   * @param {HTMLElement} to the node to move the children to
   */
  function moveChildren_(from, to) {
    var childCount = from.childNodes.length;
    for (var i = 0; i < childCount; i++) {
      to.appendChild(from.firstChild);
    }
    if (from.childNodes.length > 0) {
      throw new Error('Error moving plainnode children to new QowtElement');
    }
  }

  /**
   * Swaps the originalNode out with the newNode. Also untags
   * the original node, making sure it will get ignored by the
   * rest of the TextTool, and physically removes it from the DOM.
   *
   * Also makes sure that if the plain node contained the caret,
   * that we put the caret back in to the new element.
   *
   * @param {HTMLElement} originalNode the node to swap out
   * @param {HTMLElement} newNode the new node to place in the DOM
   */
  function swapNodes_(summary, originalNode, newNode, nonShadyNode) {
    if (Features.isEnabled('logMutations')) {
      console.log('Swapping non-qowt-element for a true QowtElement');
    }

    var before;
    if (EnvModel.app === 'word' && nonShadyNode) {
      before = originalNode.nextElementSibling;
    } else {
      // put newNode it in the dom where the original node was
      DomUtils.insertBefore(newNode, originalNode);
    }

    // now remove all the tags from the original node in
    // order for the text tool and translators to ignore it
    NodeTagger.copyTags(originalNode, newNode);
    NodeTagger.clearAllTags(originalNode);

    // add the new node to the summary object
    summary.__additionalAdded.push(newNode);

    // if the original node contains the caret, then we need to make sure we
    // replace it in the right position. We unfortunately can not use the
    // SelectionManager's snapshot functionality here, because during "cleaning"
    // of the HTML the nodes are not guaranteed to be valid (eg some might have
    // duplicate EIDs)
    cacheSelection_(originalNode, newNode);

    // move the children from the original node to the new node
    moveChildren_(originalNode, newNode);

    // and then finally remove it physically from the DOM
    var parentNode = originalNode.parentNode;
    if (parentNode) {
      if (originalNode.movedToShady) {
        Polymer.dom(parentNode).removeChild(originalNode);
        originalNode.setAttribute('removedFromShady', true);
        Polymer.dom(parentNode).flush();
      } else {
        originalNode.setAttribute('removedFromShady', true);
        originalNode.parentNode.removeChild(originalNode);
      }
    }
    if (EnvModel.app === 'word' && nonShadyNode) {
      parentNode.insertBefore(newNode, before);
    }
    // put the caret back in the right position
    restoreSelection_();
  }


  /**
   * There are a few different scenarios which result in new elements:
   * (1) Splitting an existing element: eg inserting a paragraph.
   *     Here contentEditable create a new element with same id as the original.
   *     This is clearly invalid and violates our core model, so all id's must
   *     be regenerated for new elements. In this case, before giving the
   *     element an id, we need to grab the original element and clone any
   *     model data it has; since our new element should have the same
   *     formatting model.
   * (2) When new elements are created by the user: eg, setting transient
   *     formatting at the cursor. The new element here has no id and needs to
   *     have one.
   * (3) When a paragraph is deleted. Here contentEditable copies the content of
   *     the adjacent paragraph into the current paragraph provided paragraph
   *     properties are same. Thus, making these elements as new elements. In
   *     this scenario the original node will not be part of DOM therefore we
   *     fetch it from summary.removed.
   *
   * This function will attempt to find the original node for the (1) & (3) case
   *
   * @param {Object} summary - the mutation summary.
   * @param {HTMLElement} node - the new plain P or SPAN
   */
  function findOriginalNode_(summary, node) {
    var eid = node.id || node.getAttribute('qowt-eid');

    if (_.isNull(eid)) {
      return;
    }
    // Find nodes with same eid in document
    var nodes = document.querySelectorAll('#' + eid);

    // Search in the document for the original node
    var origNode = _.find(nodes, function(nodeInDom) {
      return matchOriginalNode(nodeInDom, node);
    });

    if (!origNode) {
      // If node is not found in document, it may have been removed from
      // document as part of mutations.
      origNode = _.find(summary.removed, function(removedNode) {
        return eid === (removedNode.id || (removedNode.nodeName !== '#text' &&
        (removedNode.getAttribute &&
         removedNode.getAttribute('qowt-eid'))));
      });
    }
    return origNode;
  }

  function matchOriginalNode(nodeInDom, node) {
    if(node.getAttribute('formattedRun') === 'true') {
      return nodeInDom === node;
    }
    return nodeInDom !== node;
  }


  /**
   * Create a true QowtElement based off a plain node if possible.
   * Note: since we have not converted all legacy widgets, there
   * are cases where we can't convert (eg inline images). So this
   * function returns a boolean to indicate success. If it was not
   * able to create a new node, we should not ignore the plain node
   *
   * @param {MutationSummary} summary the mutation summary object
   * @param {HTMLElement} node the original plain node
   * @return {HTMLElement|undefined} returns the new QowtElement or undefined
   */
  function createNewQowtElement_(node) {
    var newEl;
    switch (true) {

      case isWordPara_(node):
        newEl = new QowtWordPara();
        break;

      case isPointPara_(node):
        newEl = new QowtPointPara();
        break;

      case isWordRun_(node):
        newEl = new QowtWordRun();
        break;

      case isPointRun_(node):
        newEl = new QowtPointRun();
        break;

      case isTable_(node):
        newEl = new QowtTable();
        break;

      case isTableRow_(node):
        newEl = new QowtTableRow();
        break;

      case isTableCell_(node):
        newEl = new QowtTableCell();
        break;

      case isHyperlinkNode_(node):
        newEl = new QowtHyperlink();
        break;

      default:
        break;
    }

    return newEl;
  }

  function isWordPara_(node) {
    return node.nodeName === 'P' && EnvModel.app === 'word';
  }

  function isPointPara_(node) {
    return node.nodeName === 'P'  && EnvModel.app === 'point';
  }

  function isWordRun_(node) {
    return EnvModel.app === 'word' && node.nodeName === 'SPAN' &&
        !(node instanceof QowtWordImage);
  }

  function isPointRun_(node) {
    return node.nodeName === 'SPAN' && EnvModel.app === 'point' &&
        node.getAttribute('qowt-divtype') === null;
  }

  function isTable_(node) {
    return node.nodeName === 'TABLE';
  }

  function isTableRow_(node) {
    return node.nodeName === 'TR';
  }

  function isTableCell_(node) {
    return node.nodeName === 'TD';
  }

  function isHyperlinkNode_(node) {
    return node.nodeName === 'A';
  }

  function cacheSelection_(originalNode, newNode) {
    resetCache_();
    var sel = window.getSelection();
    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      try {
        var comparison = RangeUtils.compareNode(range, originalNode);
        if (comparison !== RangeUtils.RANGE_BEFORE &&
            comparison !== RangeUtils.RANGE_AFTER) {

          // cache the current container and offset of the caret. If the
          // container is the original node, then cache the newNode
          cachedSelectionContainer_ =
              (range.startContainer === originalNode) ? newNode :
              range.startContainer;
          cachedSelectionOffest_ = range.startOffset;
        }
      } catch(e) {
        // range could have been in a different document than this
        // ignore this case
      }
    }
  }

  function restoreSelection_() {
    if (cachedSelectionContainer_) {
      var sel = window.getSelection();
      var range = document.createRange();
      range.setStart(cachedSelectionContainer_, cachedSelectionOffest_);
      sel.removeAllRanges();
      sel.addRange(range);
      sel.collapseToStart();
    }
    resetCache_();
  }

  function resetCache_() {
    cachedSelectionContainer_ = undefined;
    cachedSelectionOffest_ = undefined;
  }

  var cachedSelectionContainer_;
  var cachedSelectionOffest_;


  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.ADDED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['P', 'SPAN', 'A', 'TABLE', 'TR', 'TD']
      },
      callback: handleNewElement_
    }
  };
});
