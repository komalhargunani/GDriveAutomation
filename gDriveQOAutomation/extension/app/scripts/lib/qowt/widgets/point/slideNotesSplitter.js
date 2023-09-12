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
 * Slide Notes Splitter
 * =====================
 *
 * The slide notes splitter widget encapsulates the part ofthe HTML DOM
 * representing an horizontal splitter used to resize the slide notes panel.
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/variants/configs/point',
  'qowtRoot/features/utils'
], function(
    PubSub,
    PointConfig,
    Features) {

  'use strict';

  var _draggableFn, _mousePressed = false, _destroyToken;

  var _api = {
    /**
     * Initialise this slide splitter node.
     * @param {Function} draggableFn function responsible for doing layout
     */
    init: function(draggableFn) {
      if (_destroyToken) {
        throw new Error('_slideNotesSplitter.init() called multiple times.');
      }
      _draggableFn = draggableFn;
      _slideNotesSplitterNode =
          window.document.createElement(_kNotesSplitter_Node.Tag);
      _slideNotesSplitterNode.id = _kNotesSplitter_Node.Id;
      var slideNotesSplitterInnerNode =
          document.createElement(_kNotesSplitterInner_Node.Tag);
      slideNotesSplitterInnerNode.textContent =
          _kNotesSplitterInner_Node.Content;
      _slideNotesSplitterNode.appendChild(slideNotesSplitterInnerNode);
      _slideNotesSplitterNode.style.position = 'absolute';
      _slideNotesSplitterNode.addEventListener('mousedown',
          _handleSlideNotesSplitterDragDown, true);
      _slideNotesSplitterNode.addEventListener('click',
          _handleSlideNotesSplitterDragUp, true);
      document.addEventListener('mouseout',
          _handleSlideNotesSplitterDragOut, false);
      _destroyToken = PubSub.subscribe('qowt:destroy', _destroy);
    },
    /**
     * Gets the slide notes splitter node
     */
    node: function() {
      return _slideNotesSplitterNode;
    },

    /**
     * Every widget has an appendTo() method.
     * This is used to attach the HTML elements of the widget to a
     * specified node in the HTML DOM.
     * Here the cell's format div element, if it exists, is appended as
     * a child to the specified node and the cell's burst area div element
     * or content div element, if either exists, is appended as a child
     * to the specified node
     *
     * @param {object} node The HTML node that this widget is to
     * attach itself to
     */
    appendTo: function(node) {
      if (node === undefined) {
        throw new Error('SlideNotesSplitter widget - missing appendTo' +
            ' parameter!');
      }

      if (_slideNotesSplitterNode) {
        node.appendChild(_slideNotesSplitterNode);
      }
    },

    /**
     * Gets the slide notes splitter top.
     * WARNING: Calling this method causes a re-layout of
     * the HTML DOM render tree!
     *
     * @return {Number} top
     */
    top: function() {
      return _slideNotesSplitterNode.offsetTop;
    },

    /**
     * Sets the slide notes splitter top.
     * @param {integer} top the value for top.
     */
    setTop: function(top) {
      _slideNotesSplitterNode.style.top = top + 'px';
    },

    /**
     * Gets the slide notes splitter height.
     * WARNING: Calling this method causes a re-layout of
     * the HTML DOM render tree!
     * @return {integer} The height
     */
    height: function() {
      return _slideNotesSplitterNode.offsetHeight;
    },

    /**
     * show or hide the notes for the displayed slide
     * @param {boolean} flag indication of whether to show or
     * hide the notes for the displayed slide
     */
    show: function(flag) {
      if (flag === undefined) {
        throw new Error('SlideNotesSplitter widget - missing show parameters!');
      }
      if (flag) {
        _slideNotesSplitterNode.style.display = 'block';
      } else {
        _slideNotesSplitterNode.style.display = 'none';
      }
    },

    /**
     * Gets the slide notes splitter id, prepended by an '#' character.
     * @return {string} The id prepended by an '#'
     */
    id: function() {
      return '#' + _slideNotesSplitterNode.id;
    }
  };


  /**
   *  @private
   */
  var _kNotesSplitter_Node = {
    Tag: 'div',
    Id: 'qowt-point-notes-splitter'
  };

  var _kNotesSplitterInner_Node = {
    Tag: 'span',
    Content: '...'
  };

  var _slideNotesSplitterNode;

  //TODO:(Pankaj Avhad) This hardcoded value needs to be removed.
  //This value needs to be calculated based on the editor layout.
  var _adjustHeightForEdit = 77;

  /**
   * Remove the html elements from their parents and destroy all references.
   * Removes the event listeners attached and unsubscribes the PubSub events.
   * @private
   */
  var _destroy = function() {
    document.removeEventListener('mouseout',
        _handleSlideNotesSplitterDragOut, false);
    _slideNotesSplitterNode.removeEventListener('click',
        _handleSlideNotesSplitterDragUp, true);
    _slideNotesSplitterNode.removeEventListener('mousedown',
        _handleSlideNotesSplitterDragUp, true);
    if (_slideNotesSplitterNode && _slideNotesSplitterNode.parentNode) {
      if (_slideNotesSplitterNode.children[0]) {
        _slideNotesSplitterNode.removeChild(
            _slideNotesSplitterNode.children[0]);
      }
      _slideNotesSplitterNode.parentNode.removeChild(_slideNotesSplitterNode);
    }
    PubSub.unsubscribe(_destroyToken);
    _destroyToken = undefined;
    _slideNotesSplitterNode = undefined;
  };

  /**
   * This method updates the layout of slide as the slide notes size gets
   * resize.It responds to the mouse move event attached to the body after
   * mouse down is fired on the splitter node.
   * @param {Event} event event object
   * @private
   */
  var _handleSlideNotesSplitterDragMove = function(event) {
    var restrictSplitterToNotesHeight, adjustToolBarHeightForEdit = 0;

    if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
      adjustToolBarHeightForEdit = _adjustHeightForEdit;
    }
    restrictSplitterToNotesHeight =
        PointConfig.kNOTES_SPLITTER_CONTAINMENT_TOP +
            PointConfig.MAIN_TOOLBAR_HEIGHT + _api.height();
    if (_mousePressed) {
      if (event.clientY >= restrictSplitterToNotesHeight) {
        _api.setTop(event.clientY - adjustToolBarHeightForEdit);
      }
      _draggableFn(event);
      event.preventDefault();
    }
  };


  /**
   * This method attaches the required handlers responsible  for resize
   * operation of slide notes using splitter. This basically responds to the
   * mouse down operation on the splitter node.
   * @private
   */
  var _handleSlideNotesSplitterDragDown = function() {
    _mousePressed = true;
    document.body.addEventListener('mousemove',
        _handleSlideNotesSplitterDragMove, true);
    document.body.addEventListener('mouseup',
        _handleSlideNotesSplitterDragUp, true);
  };

  /**
   * This method removes the handlers responsible for resize operation of
   * slide notes using splitter. This basically responds to the mouse out
   * operation on the body.
   * @param {Event} e event object
   * @private
   */
  var _handleSlideNotesSplitterDragOut = function(e) {
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName === 'HTML') {
      _handleSlideNotesSplitterDragUp(e);
    }
  };

  /**
   * This method removes the handlers responsible for resize operation of
   * slide notes using splitter. This basically responds to the mouse up
   * operation on the body.
   * @private
   */
  var _handleSlideNotesSplitterDragUp = function() {
    _mousePressed = false;
    document.body.removeEventListener('mousemove',
        _handleSlideNotesSplitterDragMove, true);
    document.body.removeEventListener('mouseup',
        _handleSlideNotesSplitterDragUp, true);
  };

  return _api;
});


