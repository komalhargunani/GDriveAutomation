/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Utilities for different DOM operations
 *
 */
define([
    'qowtRoot/models/env',
    'qowtRoot/utils/deprecatedUtils',
    'qowtRoot/utils/typeUtils'
  ], function(
    EnvModel,
    DeprecatedUtils,
    TypeUtils) {

  'use strict';

  var _api = {

    /**
     * Get the total height of a node; meaning the height +
     * borders + padding + margins
     *
     * @param {HTML Element} node the node to get the height of
     */
    totalHeight: function(node) {
      var box = node.getBoundingClientRect();
      return box.height;
    },

    /**
     * @return {number} returns the index of this element amongst its peers;
     *                  aka the index of this element within its parent
     */
    peerIndex: function(node) {
      if (!node) {
        return undefined;
      }
      var index = 0;
      var iter = node;

      while (iter.previousElementSibling) {
        if(iter.previousElementSibling.nodeName !== 'TEMPLATE') {
          index++;
        }
        iter = iter.previousElementSibling;
      }
      return index;
    },

    /**
     * @return {boolean} true if the node is editable, false if not
     */
    isEditable: function(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
      }
      var cs = window.getComputedStyle(node);
      return cs ? cs['-webkit-user-modify'] === 'read-write' : false;
    },

    /**
     * @return {HTML Element} the previous node in reverse document order, eg:
     *
     *                     A
     *                    / \
     *                   /   \
     *                  B     C
     *                 /\     /\
     *                D  E   F  G
     *                      /
     *                     H
     *
     *  previousNode(C) === E
     *  previousNode(G) === H
     *  previousNode(F) === E
     *  previousNode(E) === D
     */
    previousNode: function(srcNode) {
      var prevNode = srcNode ? srcNode.previousSibling : undefined;
      while (!prevNode && srcNode && srcNode.parentNode) {
        srcNode = srcNode.parentNode;
        prevNode = srcNode.previousSibling;
      }
      while (prevNode && prevNode.lastChild) {
        prevNode = prevNode.lastChild;
      }
      return prevNode;
    },

    nextNode: function(srcNode) {
      var nextNode = srcNode ? srcNode.nextSibling : undefined;
      while (!nextNode && srcNode && srcNode.parentNode) {
        srcNode = srcNode.parentNode;
        nextNode = srcNode.nextSibling;
      }
      while (nextNode && nextNode.firstChild) {
        nextNode = nextNode.firstChild;
      }
      return nextNode;
    },

    /**
     * Get the right most leaf of the node's children
     *
     * @param {HTML Element} node the node for which to search for leaf
     * @return {node|undefined} returns the right most leaf
     *                                     of the node's children or undefined
     */
    rightMostLeafNode: function(node) {
      var leaf;
      if (node && node.nodeName === 'P') {
        leaf = node && node.lastElementChild;
        while (leaf && Polymer.dom(leaf).lastChild) {
          leaf = Polymer.dom(leaf).lastChild;
          if (leaf.nodeName.toLowerCase() === 'span' && leaf.lastChild) {
            leaf = leaf.lastChild;
          }
        }
      } else {
        leaf = node && Polymer.dom(node).lastChild;
        while (leaf && Polymer.dom(leaf).lastChild) {
          leaf = Polymer.dom(leaf).lastChild;
          if (leaf.nodeName.toLowerCase() === 'span' && leaf.lastChild) {
            leaf = leaf.lastChild;
          }
        }
      }
      
      return leaf;
    },

    /**
     * Get the left most leaf of the node's children
     *
     * @param {HTML Element} node the node for which to search for leaf
     * @return {node|undefined} returns the left most leaf
     *                                     of the node's children or undefined
     */
    leftMostLeafNode: function(node) {
      var leaf;
      if (node && node.nodeName === 'P') { 
        leaf = node && node.firstElementChild;
        while (leaf && Polymer.dom(leaf).firstChild) {
          leaf = Polymer.dom(leaf).firstChild;
          if (leaf.nodeName.toLowerCase() === 'span' && leaf.firstChild) {
            leaf = leaf.firstChild;
          }
        }
      } else {
        leaf = node && Polymer.dom(node).firstChild;
        while (leaf && Polymer.dom(leaf).firstChild) {
          leaf = Polymer.dom(leaf).firstChild;
          if (leaf.nodeName.toLowerCase() === 'span' && leaf.firstChild) {
            leaf = leaf.firstChild;
          }
        }
      }
      return leaf;
    },

    /**
     * Return the Nth sibling of the current node. If 'N' is greater than the
     * number of sibling nodes null is returend. If 'N' is zero, node is
     * returned.
     *
     * @param {Node} node The node to index from.
     * @param {Integer} siblingIndex The index of the sibling to find.
     *                  When this is 0, node is returned.
     *                  When this is > sibglingCount, null is returned.
     * @returns {Node|null} The Nth sibling node.
     */
    getSiblingByIndex: function(node, siblingIndex) {
      for (; siblingIndex > 0; siblingIndex--) {
        node = Polymer.dom(node).nextSibling;
        if (!node) {
          return null;
        }
      }
      return node;
    },

    /**
     * Insert node at the start of a given element
     *
     * @param {Element} nodeToInsert - the node to be inserted at start
     * @param {Element} referenceNode - the node before which the given element
     *                                  has to be inserted.
     */
    insertAtStart: function(nodeToInsert, referenceNode) {
      if (EnvModel.app === 'point') {
        if(referenceNode.children.length > 0) {
          referenceNode.insertBefore(nodeToInsert, referenceNode.children[0]);
        } else {
          referenceNode.appendChild(nodeToInsert);
        }
      }
      if (EnvModel.app === 'word') {
        if (referenceNode.nodeName === 'P') {
          if(referenceNode.children.length > 0) {
            referenceNode.insertBefore(nodeToInsert,referenceNode.children[0]);
          } else {
            referenceNode.appendChild(nodeToInsert);
          }
        } else {
          if(Polymer.dom(referenceNode).children.length > 0) {
            Polymer.dom(referenceNode).insertBefore(nodeToInsert,
                Polymer.dom(referenceNode).children[0]);
            Polymer.dom(referenceNode).flush();
          } else {
            Polymer.dom(referenceNode).appendChild(nodeToInsert);
            Polymer.dom(referenceNode).flush();
          }
        }
      }
    },

    /**
     * Insert node at the end of a given element
     *
     * @param {Element} nodeToInsert - the node to be inserted at end
     * @param {Element} referenceNode - the node to which the give element
     *                                       has to be appended.
     */
    insertAtEnd: function(nodeToInsert, referenceNode) {
      if (referenceNode.nodeName === 'P') {
        referenceNode.appendChild(nodeToInsert);
      } else {
        Polymer.dom(referenceNode).appendChild(nodeToInsert);
        Polymer.dom(referenceNode).flush();
      }
    },


    /**
     * insert the node behind the reference node
     * If the reference node does not have a parentNode, this
     * function will do nothing
     *
     * @param {Element} nodeToInsert - the node to insert
     * @param {Element} referenceNode - the node which
     *                       should be the previousSibling
     */
    insertAfter: function(nodeToInsert, referenceNode) {
      // this will work even if reference.nextSibling is null because
      // in that case the node will simply be inserted at the end
      // which is exactly what we want
      var parent = Polymer.dom(referenceNode).parentNode;
      if (parent) {
        if (EnvModel.app === 'word') {
          if (parent.nodeName === 'P') {
            parent.insertBefore(nodeToInsert,referenceNode.nextSibling);
          } else {
            Polymer.dom(parent).insertBefore(nodeToInsert,
              Polymer.dom(referenceNode).nextElementSibling);
            Polymer.dom(parent).flush();
          }
        } else {
          if (nodeToInsert instanceof QowtPointRun) {
            parent = referenceNode.parentNode;
          }
          if (parent) {
            parent.insertBefore(nodeToInsert,referenceNode.nextSibling);
          }
        }
      }
    },


    /**
     * insert the node in front of the reference node
     * If the reference node does not have a parentNode, this
     * function will do nothing
     *
     * @param {Element} nodeToInsert - the node to insert
     * @param {Element} referenceNode - the node that is to be used as reference
     *                                  to insert a given node
     */
    insertBefore: function(nodeToInsert, referenceNode) {
      var parent;
      if (EnvModel.app === 'word') {
        parent = Polymer.dom(referenceNode).parentNode;
        if (parent) {
          if (parent.nodeName === 'P') {
            if (!referenceNode.isQowtElement && parent.children.length === 1) {
              parent.appendChild(nodeToInsert);
            } else {
              parent.insertBefore(nodeToInsert, referenceNode);
            }
          } else {
            if (!referenceNode.isQowtElement && parent.children.length === 1) {
              Polymer.dom(parent).appendChild(nodeToInsert);
              Polymer.dom(parent).flush();
            } else {
              Polymer.dom(parent).insertBefore(nodeToInsert, referenceNode);
              Polymer.dom(parent).flush();
            }
          }
        }
      } else {
        parent = referenceNode.parentNode;
        if (parent) {
          parent.insertBefore(nodeToInsert, referenceNode);
        }
      }
    },


    /**
     * Inserts a node at one of the specified positions. If a sibling node
     * is found we insert after that. If there is no sibling then find the
     * parent and insert as the first child.
     *
     * Text (Qowt) commands are the main user of this.
     *
     * @param {Object} context
     * @param {String} context.node The node to insert.
     * @param {String} context.parentNodeId Parent element id.
     * @param {String| undefined} context.siblingNodeId Sibling element id.
     */
    insertAtSiblingOrParent: function(context, errorFunction) {
      // Validate we have the necessary input to succeed.
      if (!context) {
        throw new Error('insertAtSiblingOrParent missing context');
      }
      if (!context.parentNodeId && !context.siblingNodeId) {
        throw new Error('insertAtSiblingOrParent requires either ' +
                        'parentNodeId or siblingNodeId');
      }
      if (!context.parentNodeId) {
        throw new Error('insertAtSiblingOrParent missing parentNodeId');
      }
      if (errorFunction && !TypeUtils.isFunction(errorFunction)) {
        throw new Error('insertAtSiblingOrParent errorFuncton must be ' +
                        ' a function');
      }

      var sibling, parent, message;
      sibling = document.getElementById(context.siblingNodeId);
      if (sibling) {
        // put the node back after the sibling that we found.
        _api.insertAfter(context.node, sibling);
      } else {
        // no sibling, so try and add under the parent
        parent = document.getElementById(context.parentNodeId);
        if (parent) {
          // put node back at the start of the parent
          parent.insertBefore(context.node, Polymer.dom(parent).children[0]);
        } else {
          message = ' failed to insert node - no parent or sibling node found!';
          if (errorFunction && TypeUtils.isFunction(errorFunction)) {
            errorFunction(message);
          }
        }
      }
    },


    /**
     * return a contextual information object about the given TEXT_NODE
     * This object contains the textNodeIndex within it's parent and the
     * relative character position start of this text node
     *
     * @param textNode {TEXT_NODE} textnode to get the relative position for
     */
    relativePosition: function(textNode) {
      if (textNode.nodeType !== Node.TEXT_NODE) {
        throw new Error('error: relativePosition needs to be given text node');
      }

      var characterOffset = 0,
          textNodeIndex = 0;

      var sibling = Polymer.dom(textNode).previousSibling;
      while (sibling && (sibling.nodeType === Node.TEXT_NODE)) {
        characterOffset += sibling.textContent.length;
        sibling = sibling.previousSibling;
        textNodeIndex++;
      }

      return {
        textNodeIndex: textNodeIndex,
        characterOffset: characterOffset
      };
    },

    /**
     * return the absolute position of an element by walking
     * the offsetParent tree and cumulating the offsetTop and offsetLeft
     *
     * @param el {HTML Element} html element to start the tree walk
     */
    absolutePos: function(el) {
      var curTop = 0,
        curLeft = 0;
      if (el.offsetParent) {
        do {
          curTop += el.offsetTop;
          curLeft += el.offsetLeft;
          el = el.offsetParent;
        } while (el !== null);
      }
      return {
        top: curTop,
        left: curLeft
      };
    },

    /**
     * return the absolute scroll offset of an element by walking
     * the offsetParent tree and cumulating the scrollTop and scrollLeft
     *
     * @param el {HTML Element} html element to start the tree walk
     */
    absoluteScroll: function(el) {
      var curTop = 0,
        curLeft = 0;
      if (el.offsetParent) {
        do {
          curTop += el.scrollTop;
          curLeft += el.scrollLeft;
          el = el.offsetParent;
        } while (el !== null);
      }
      return {
        top: curTop,
        left: curLeft
      };
    },


    /**
     * Replacement for document.getElementById() that
     * will use the correct environment document object
     * TODO: Do we still need this?
     * @param element {String||DOM Element} Any number
     *        of DOM Element IDs or actual DOM Elements
     * @return {DOM Element||Array} The DOM Element that
     *         has a matching ID attribute or an Array of
     *         DOM Elements if multiple arguments are given
     */
    'getById': function(element) {
      if (arguments.length > 1) {
        for (var i = 0, elements = [], length = arguments.length;
             i < length; i++) {
          elements.push(_api.getById(arguments[i]));
        }
        return elements;
      }
      if (TypeUtils.isString(element)) {
        element = document.getElementById(element);
      }
      return element;
    },

    /**
     * Prepends a string to all child node ID attributes
     * Can be used to ensure IDs are unique
     * @param node {HTML Element}
     * @param str {String}
     * @param sep {String} Optional: Seperator
     */
    'prependChildrenID': function(node, str, sep) {
      sep = sep || '-';
      if (node && node.id) {
        node.id = '' + str + sep + node.id;
        if (node.childNodes && node.childNodes.length) {
          for (var ci = 0, ct = node.childNodes.length; ci < ct; ci++) {
            _api.prependChildrenID(node.childNodes[ci], str, sep);
          }
        }
      }
    },

    /**
     * Method for adding new DOM Elements to the document
     * @author DJT
     * @param ref {DOM Element} What element to insert on
     * @param elm {DOM Element} The element to insert
     * @param loc {String} Where to insert, values of:
     *        replace || before || after || top || bottom
     */
    'insert': function(ref, elm, loc) {
      switch (loc) {
      case 'replace':
        Polymer.dom(ref).parentNode.replaceChild(elm, ref);
        Polymer.dom(ref).flush();
        break;
      case 'before':
        Polymer.dom(ref).parentNode.insertBefore(elm, ref);
        Polymer.dom(ref).flush();
        break;
      case 'after':
        if (ref === Polymer.dom(ref).parentNode.
          childNodes[Polymer.dom(ref).parentNode.childNodes.length - 1]) {
          Polymer.dom(ref).parentNode.appendChild(elm);
          Polymer.dom(ref).flush();
        } else {
          var nxtElm = Polymer.dom(ref).nextSibling;
          while (nxtElm &&
            (nxtElm.nodeType !== DeprecatedUtils.NodeType.ELEMENT_NODE)) {
            nxtElm = Polymer.dom(nxtElm).nextSibling;
          }
          Polymer.dom(nxtElm).parentNode.insertBefore(elm, nxtElm);
          Polymer.dom(nxtElm).flush();
        }
        break;
      case 'top':
        Polymer.dom(ref).insertBefore(elm, Polymer.dom(ref).childNodes[0]);
        Polymer.dom(ref).flush();
        break;
      default:
        // includes "bottom" location
        Polymer.dom(ref).appendChild(elm);
        Polymer.dom(ref).flush();
        break;
      }
    },

    'stopEvent': function(inEvent) {
      // JELTE TODO: remove this old code once the new is proven
      // to indeed work ok
      // var eventName = inEvent.eventName || inEvent.type;
      // console.log('JSFW: Stopping propagation of event '+eventName);
      // inEvent.keyCode = 0;
      // inEvent.cancelBubble = true;
      // inEvent.returnValue = false;
      if (inEvent) {
        if (inEvent.preventDefault) {
          inEvent.preventDefault();
        }
        if (inEvent.stopPropagation) {
          inEvent.stopPropagation();
        }
      }
    },

    /**
     * quick utility function to check if one html element is contained
     * within another (at an arbitrary depth).
     * Note: this function does not penetrate shadow boundaries
     *
     * @param outer {HTML Element} the outer html element
     * @param inner {HTML Element} the inner html element
     * @return result {boolean} true if inner is inside outer
     */
    contains: function(outer, inner) {
      if (!outer) {
        return false;
      }
      // NOTE: we used to use node.contains(), but this has
      // one major (and very hard to find) bug under phantomJs
      // in that node.contains does not appear to work for TEXT_NODEs !!!
      // So stick with the compareDocumentPosition instead.
      return !!(outer.compareDocumentPosition(inner) &
          document.DOCUMENT_POSITION_CONTAINED_BY);
    },

    /**
     * Returns true if the element is in view port.
     *
     * @param {Element} el The HTML element under inspection.
     *
     * @return {boolean} true if element is in viewport, false otherwise.
     */
    isElementInViewport: function(el) {
      var rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight ||
                          document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth ||
                         document.documentElement.clientWidth)
      );
    },

    /**
     * Removes node from parent.
     * @param node {DOM} HTML element
     */
    removeNode: function(node) {
      if (node && TypeUtils.isNode(node)) {
       var parentNode = Polymer.dom(node).parentNode;
       if ( parentNode && TypeUtils.isNode(parentNode)) {
          Polymer.dom(node).parentNode.removeChild(node);
          Polymer.dom(node).flush();
        }
      }
    },

    /**
     * Gets transform value of provided property
     * @param {HTMLElement} node HTML node
     * @param {string} property Name of the property of which value is required
     * @return {string|boolean|object} Returns property value if found. False
     *                                 otherwise.
     */
    getTransformValue: function(node, property) {
      var transformStyle = node.style.webkitTransform;
      if (transformStyle !== '') {
        var values = transformStyle.split(')');
        for (var i = 0; i < values.length; i++) {
          var val = values[i];
          var prop = val.split('(');
          if (prop[0].trim() === property) {
            switch (property) {
              case 'scale':
                var scale = prop[1].split(',');
                var horizontalFlip = scale[0].trim(),
                    verticalFlip = scale[1].trim(),
                    transformValue = {
                      flipH: horizontalFlip,
                      flipV: verticalFlip
                    };
                return transformValue;

              case 'rotate':
                return prop[1];
              default:
            }
          }
        }
      }
      return false;
    },

    /**
     * Clone style from source node to target node
     * @param {HTMLElement} targetDiv Target node
     * @param {HTMLElement} sourceDiv Source node
     */
    cloneStyle: function(targetDiv, sourceDiv) {
      if (!sourceDiv || !targetDiv) {
        return;
      }
      targetDiv.style.cssText = sourceDiv.style.cssText;
    },

    /**
     * returns true if given node is a field
     * (dateField, pageNum or numPage)
     * @param {HTMLElement} node element
     */
    isField: function(node) {
      var divType = node ? (node.getAttribute &&
        node.getAttribute('qowt-divtype')) : '';
      if(divType === 'qowt-field-datetime' ||
        divType === 'qowt-field-numpages' ||
        divType === 'qowt-field-pagenum') {
          return true;
      }
      return false;
    },

    /**
     * returns last editable child of the paragraph
     * @param {HTMLElement} para paragraph
     */
    getLastEditableNode: function(para) {

      if(para.children.length === 1) {
        if(para.isEmpty() || para.children[0] instanceof QowtHyperlink) {
          return para.children[0];
        }
      }
      var childNodes = para.childNodes;
      var i = childNodes.length - 1;
      while (i > -1 && !((childNodes[i] instanceof QowtWordRun &&
        !childNodes[i].isEmpty()) ||
        (childNodes[i]instanceof HTMLBRElement) ||
        childNodes[i]instanceof QowtHyperlink)) {
        i--;
      }
      return childNodes[i];
    },

    /**
     * Clones the given node and its hierarchy.
     * This is special method for cloning purpose and shoudl be used when you
     * have normal HTML node hierarchy with some of the nodes polymerized.
     * For polymerized nodes, we have implemented tailored clone method
     * (cloneMe) and we do want to get it invoked while cloning.
     * In order to invoke cloneMe, we need to stop native deep cloning and do it
     * on our own.
     *
     * @param {HTMLElement} sourceNode The node to be cloned
     * @param {boolean=} opt_deep The flag to perform deep cloning. If true,
     *     cloning will be deep, otherwise shallow.
     * @return {HTMLElement} The cloned HTML element
     */
    cloneNode: function(sourceNode, opt_deep, opt_import) {
      function doClone(node, opt_import) {
        var dup;
        if (node.cloneMe) {
          dup = node.cloneMe(opt_import);
        } else {
          dup = opt_import ? document.importNode(node, false) :
              node.cloneNode(false);
        }

        // cloneMe removes the id; but for backward compatibility we want the
        // cloned node to have the same eid (including in its model)
        if (dup.setEid) {
          dup.setEid(node.getEid());
        }
        return dup;
      }

      function validShadyChild(parent, child) {
        if (parent instanceof QowtDrawing &&
            (child instanceof QowtTextBox ||
            child instanceof QowtWordImage)) {
            return true;
        }
        return false;
      }
      var dup = doClone(sourceNode, opt_import);
      if (opt_deep) {
        for (var i = 0; i < sourceNode.childNodes.length; i++) {
          var child = sourceNode.childNodes[i];
          var childDup = this.cloneNode(child, opt_deep,opt_import);
          if (EnvModel.app === 'word' && validShadyChild(dup, childDup)) {
            Polymer.dom(dup).appendChild(childDup);
          } else {
            dup.appendChild(childDup);
          }
        }
      }
      if (EnvModel.app === 'word') {
        Polymer.dom(dup).flush();
      }
      return dup;
    }

  };

  return _api;
});
