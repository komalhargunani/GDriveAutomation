// Copyright 2014 Google Inc. All Rights Reserved.


/**
 * @fileoverview  The thumbnail strip layout control has a number of widgets,
 * each of which encapsulates an area of the HTML DOM that represents a
 * thumbnail on screen. It is also responsible for handling DOM events
 * performed on thumbnail.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/accessibilityUtils',
  'qowtRoot/features/utils',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/widgets/point/thumbnailContextMenu'
], function(
    PubSub,
    DomListener,
    AccessibilityUtils,
    Features,
    ThumbnailStrip,
    ThumbnailContextMenu) {

  'use strict';

  var _node,
      _contextMenu;
  var _disableToken,
      _destroyToken;

  var _api = {
    /**
     * Initialise the thumbnail strip control.
     */
    init: function() {
      if (_disableToken) {
        throw new Error('thumbnailStrip.init() called multiple times.');
      }
      ThumbnailStrip.init();
      _node = ThumbnailStrip.node();

      //add listeners
      DomListener.addListener(_node, 'click', _onclickHandler, true);

      //Initialize context menu for thumbnail
      if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
        _initContextMenu();
      }
      _disableToken = PubSub.subscribe('qowt:disable', _disable);
      _destroyToken = PubSub.subscribe('qowt:destroy', _destroy);
    },

    /**
     * Append this control to the html node passed as argument
     * @param {HTMLElement} parentNode parent element to which thumbnailStrip
     * widget is added
     */
    appendTo: function(parentNode) {
      ThumbnailStrip.appendTo(parentNode);
    }
  };

  /**
   * Remove the html elements from their parents and destroy all references.
   */
  var _destroy = function() {

    if (_node) {
      if (_node.parentNode) {
        _node.parentNode.removeChild(_node);
      }

      //remove listeners
      DomListener.removeListener(_node, 'click', _onclickHandler, true);
    }
    _disable();
  };

  /**
   * Disable the module
   */
  var _disable = function() {
    PubSub.unsubscribe(_disableToken);
    PubSub.unsubscribe(_destroyToken);

    _disableToken = undefined;
    _destroyToken = undefined;
  };

  /**
   * Initialise context menu for thumbnail
   *
   * @private
   */
  var _initContextMenu = function() {
    _contextMenu = ThumbnailContextMenu.init();
    if (_contextMenu) {
      _contextMenu.appendTo(_node);
      _contextMenu.setPreExecuteHook(_onContextMenu);
    }
  };

  /**
   * Handler for contextmenu
   * @param {object} event contextmenu event
   *
   * @private
   */
  var _onContextMenu = function(event) {
    var target;
    if (event.target) {
      target = _getSelectedSlideNode(event.target);
    }
    if (target) {
      var _index = ThumbnailStrip.getThumbnailIndexFromDiv(target);
      if (_index === undefined) {
        return;
      }
      // Activate the thumbnailStrip tool while displaying the slide context
      // sensitive menu
      if (ThumbnailStrip.thumbnail(_index).isHighlighted()) {
        // Clear any selection in slide
        PubSub.publish('qowt:clearSlideSelection');
        PubSub.publish('qowt:requestFocus', {contentType: 'slideManagement'});
      } else {
        _executeThumbnailSelection(_index, event);
      }
    }
  };

  /**
   * Click handler for thumbnail strip.
   * @param {object} event click Event
   * @private
   */
  var _onclickHandler = function(event) {
    var target;
    if (event.target) {
      target = _getSelectedSlideNode(event.target);
    }
    if (target) {
      var _index = ThumbnailStrip.getThumbnailIndexFromDiv(target);

      _executeThumbnailSelection(_index, event);
      _node.focus();
    }

    AccessibilityUtils.updateFocusedElementInPoint();

  };

  /**
   * Publish selection events for thumbnail.
   * @param {Number} index index of thumbnail to be selected
   * @param {object} event key down event
   * @private
   */
  var _executeThumbnailSelection = function(index, event) {
    // Activate metaKey for both
    // 1. command key(Mac)
    // 2. control key(Windows/Ubuntu/Chromebook)
    var meta = event.ctrlKey || event.metaKey;

    var _contextData = {
      contentType: 'slideManagement',
      index: index,
      meta: meta,
      shift: event.shiftKey,
      type: event.type,
      keyIdentifier: event.keyIdentifier
    };
    // Clear any selection in slide
    PubSub.publish('qowt:clearSlideSelection');
    PubSub.publish('qowt:requestFocus', _contextData);
  };

  /**
   * Return the thumbnail div related to the slide which is clicked.
   * @param {object} target HTML element which was clicked.
   * @return {object} HTML element related to slide which was clicked.
   * @private
   */
  var _getSelectedSlideNode = function(target) {
    var divType = target.getAttribute('qowt-divtype');
    while (divType !== 'thumbnail') {
      target = target.parentElement;
      if (target === null) {
        return undefined;
      }
      divType = target.getAttribute('qowt-divtype');
    }
    return target;
  };

  return _api;
});
