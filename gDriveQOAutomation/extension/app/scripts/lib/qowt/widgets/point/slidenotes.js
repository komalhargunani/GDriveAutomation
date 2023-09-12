/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Slide Notes
 * ===========
 *
 * A slide notes widget encapsulates the part of the HTML DOM representing
 * the slide notes that may be part of a presentation
 *
 * Slide notes are attached to a particular slide within a presentation
 *
 * Slide notes can be hidden
 *
 * It is assumed that if there are no notes for a slide - then on slide display
 * the generic string "Click to add notes" is shown.
 *
 * The slide notes display area cannot cover the entire application display
 * space.
 *
 *
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/variants/configs/point'
], function(
    PubSub,
    DeprecatedUtils,
    PointConfig) {

  'use strict';


  /**
   *  @api private
   */
  var _kNotes_Node = {
    Tag: 'div',
    Class: 'qowt-point-notes-container',
    Id: 'qowt-point-notes'
  };

  /**
   *  @api private
   */
  var _slideNotes,
      _slideNotesNode,
      _destroyToken;


  /*!
   *
   */
  var _api = {

    /**
     * Initialise this slides notes representation.
     * @param {String} text - text to be displayed in slide notes
     */
    init: function(text) {
      if (_slideNotesNode) {
        throw new Error('_slideNotes.init() called multiple times.');
      }
      if (text === undefined) {
        throw new Error('SlideNote - widget missing constructor');
      }

      _slideNotesNode = window.document.createElement(_kNotes_Node.Tag);
      _slideNotesNode.id = _kNotes_Node.Id;
      _slideNotesNode.className = _kNotes_Node.Class;
      _slideNotesNode.setAttribute('qowt-divtype', 'slideNotes');

      _slideNotesNode.textContent = text;
      _slideNotes = text;
      _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
    },
    /**
     * Remove the html elements from their parents and destroy all references.
     * Removes the event listeners attached and unsubscribes the PubSub events.
     */
    destroy: function() {
      if (_slideNotesNode && _slideNotesNode.parentNode) {
        _slideNotesNode.parentNode.removeChild(_slideNotesNode);
      }
      PubSub.unsubscribe(_destroyToken);
      _destroyToken = undefined;
      _slideNotesNode = undefined;
    },
    /**
     * gets the content of the notes slide
     *
     * @method getSlideNotes()
     */
    getSlideNotes: function() {
      return _slideNotes;
    },

    /**
     * gets the slide note div
     *
     * @method getSlideNotesNode()
     */
    getSlideNotesNode: function() {
      return _slideNotesNode;
    },

    /**
     * gives slide notes node editable state
     *
     * @return {boolean} True if slide note editable, otherwise false.
     *
     * @method isSlideNoteEditable()
     */
    isSlideNoteEditable: function() {
      var slideNotesDiv = _slideNotesNode.getElementById('slide-notes-div');
      return slideNotesDiv ? true : false;
    },

    /**
     * show or hide the notes for the displayed slide
     *
     * @param show {boolean} indication of whether to show or hide the notes
     * for the displayed slide
     * @method showNotes()
     */
    showNotes: function(show) {
      if (show === undefined) {
        throw new Error('SlideNotes widget - missing setPosition parameters!');
      }
      if (show) {
        _slideNotesNode.style.display = 'block';
      } else {
        _slideNotesNode.style.display = 'none';
      }
    },


    /**
     * sets the text displayed within the slide notes area
     *
     * @param text {string} text to display
     * @method setSlideNotes()
     */
    setSlideNotes: function(text) {
      if (text === '' || text === undefined) {
        _slideNotesNode.textContent = ' ';
      } else {
        _slideNotesNode.textContent = text;
      }
      _slideNotes = text;
    },


    /**
     * clears the notes area - re-adds "click to add notes"
     *
     * @method clearNotes()
     */
    clearNotes: function() {
      _slideNotesNode.textContent = ' ';
      _slideNotes = ' ';
    },


    /**
     * Every widget has an appendTo() method.
     * This is used to attach the HTML elements of the widget to a specified
     * node in the HTML DOM.
     * Here the cell's format div element, if it exists, is appended as a
     * child to the specified node and the cell's burst area div element
     * or content div element, if either exists, is appended as a child to the
     * specified node
     *
     * @param node {object} The HTML node that this widget is to attach
     * itself to
     * @method appendTo(node)
     */
    appendTo: function(node) {
      if (node === undefined) {
        throw new Error("appendTo - missing node parameter!");
      }

      if (_slideNotesNode) {
        node.appendChild(_slideNotesNode);
      }
    },

    /**
     * Gets the slide notes height.
     * WARNING: Calling this method causes a relayout of the
     * HTML DOM render tree!
     *
     * @return {integer} The height
     * @method height()
     */
    height: function() {
      return _slideNotesNode.offsetHeight;
    },

    /**
     * Sets the slide notes height.
     *
     * @param height {integer} The height
     * @method setHeight(height)
     */
    setHeight: function(height) {
      _slideNotesNode.style.height = height + "px";
    },

    /**
     * Clones data from speaker notes into thumbnail
     *
     * @param currentSlideWidget {object} Current slide widget
     *
     * @method cloneSpeakerNotesIntoThumbnail(currentSlideWidget)
     */
    cloneSpeakerNotesIntoThumbnail: function(currentSlideWidget) {
      var slideNotesContainer = _api.getSlideNotesNode();
      var clonedSldNotesContainer =
          DeprecatedUtils.cloneDiv(slideNotesContainer);

      var slideNotesDiv = clonedSldNotesContainer.firstChild;
      if (slideNotesDiv) {
        var slideNodeFromSldArea, slideNodeFromThumbArea;
        slideNodeFromSldArea = currentSlideWidget.innerNode().
            querySelector('[qowt-divtype=slide]');
        if (slideNodeFromSldArea) {
          slideNodeFromThumbArea = document.getElementById(
              PointConfig.kTHUMB_ID_PREFIX + slideNodeFromSldArea.id);

          // create document fragment and append slideNotesDiv to it
          var docFragment = document.createDocumentFragment();
          docFragment.appendChild(slideNotesDiv);

          // attach this document fragment to thumbnail as object
          slideNodeFromThumbArea.slidenotes = docFragment;
        }
      }
    }
  };
  return _api;
});
