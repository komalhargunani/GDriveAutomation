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
 * Sheet Header
 * ==============
 *
 * The sheet header widget encapsulates the part of the HTML DOM representing
 * a workbook that displays the top left square in the grid where the row
 * headers and column headers meet.
 * The user is able to click on this square to select the entire grid.
 * The sheet header widget manages the construction and logic of this square.
 *
 * this is a singleton
 */
define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  /**
   * @private
   */
  var _api = {
    /**
     * initialisation of the singleton - should be called
     * by the layout control (eg workbook), not during load
     */
    init: function() {
      if (_destroyToken) {
        throw new Error('sheetHeader.init() called multiple times.');
      }

      _container = document.createElement('div');
      _container.className = 'qowt-sheet-header';
      _container.style.position = 'absolute';

      _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
    },

    /**
     * append the main container div to the given html node
     *
     * @param {HTMLElement} node  node to append ourselves to
     */
    appendTo: function(node) {
      node.appendChild(_container);
    },

    /**
     * returns the container for other widgets to append themselves
     * to; note we actually return the inner zoom div, to ensure the
     * widgets add themselves to the right div;
     */
    container: function() {
      return _container;
    },

    /**
     * Destroys all that was initialized here like HTML elements, unsubscribes
     * itself for events and resets private variables
     */
    destroy: function() {
      if (_container && _container.parentNode) {
        _container.parentNode.removeChild(_container);
      }

      PubSub.unsubscribe(_destroyToken);

      _container = undefined;
      _destroyToken = undefined;
    }
  };

  // vvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvv

  var _container,
      _destroyToken;

  return _api;
});
