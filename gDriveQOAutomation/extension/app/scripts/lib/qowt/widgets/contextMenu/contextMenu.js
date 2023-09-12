// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Context Menu
 * The context menu widget encapsulates the part of the HTML DOM representing
 * a context menu that displays a set of menu items.
 * This context menu overrides the default OS context menu.
 *
 * A context menu widget must be customized with the appropriate menu items.
 * For example, in Quicksheet the context menu may contain menu items for
 * 'cut', 'copy', 'paste', 'freeze' and 'unfreeze'.
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/widgets/ui/menuBase',
  'qowtRoot/utils/typeUtils'
], function(
    WidgetFactory,
    ArrayUtils,
    PubSub,
    DomListener,
    MenuBase,
    TypeUtils) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'ContextMenu Widget Factory',

    supportedActions: [],

    /**
     * Method used by the Abstract Widget Factory to determine if this widget
     * factory can be used to fulfil a given configuration object.
     *
     * IMPORTANT: This method is called in a loop for all widgets, so its
     * performance is critical. You should limit as much as possible intensive
     * DOM look up and other similar processes.
     *
     * See Also: Abstract Widget Factory, for how the confidence score is used
     *           qowtRoot/widgets/factory
     *
     * @param config {object} Configuration object, consists of:
     *        config.type {string} The type of widget to create
     *        config.supportedActions {Array} a list of features the widget must
     *                                        support
     *
     * @return {integer} Confidence Score;
     *                   This integer between 0 and 100 indicates the determined
     *                   ability of this factory to create a widget for the
     *                   given configuration object.
     *                   0 is negative: this factory cannot construct a widget
     *                   for the given configuration.
     *                   100 is positive: this factory definitely can construct
     *                   a widget for the given configuration.
     *                   1 to 99: This factory could create a widget from the
     *                   given configuration data, but it is not a perfect match
     *                   if another factory returns a higher score then it would
     *                   be a more suitable factory to use.
     */
    confidence: function(config) {
      config = config || {};
      // first check that we match the required feature set
      if (config.supportedActions && !ArrayUtils.subset(
          config.supportedActions,
          _factory.supportedActions)) {
        return 0;
      }
      var score = 0;
      // Now check that the config node matches
      if (config && config.type && config.type === 'contextMenu') {
        score = 100;
      }
      return score;
    },

    /**
     * Creates a new instance of an context menu widget.
     * @param config {object}             Context menu configuration
     * @param config.type {'contextMenu'} Defines this as a context menu widget
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        var _kSignal_ToolbarClicked = 'qowt:toolbarClicked',
            _domNodes = {}, _preExecutecallback,
            _parentNode;

        // Extend menu base
        var _api = MenuBase.create(config);

        _api.name = 'ContextMenu Widget Instance';

        /**
         * Overrides the appendTo() method of Menu Base.
         *
         * @param node {Node} The HTML node that this widget is to append
         *                    itself to
         */
        _api.appendTo = function(node) {
          if (node === undefined) {
            throw ('appendTo - missing node parameter!');
          }

          window.document.body.appendChild(_domNodes.menu);

          _parentNode = node;
          _addListeners();
        };

        /**
         * Set pre-execute hook routine
         *
         * @param {Function} callback the callback function to be set.
         */
        _api.setPreExecuteHook = function(callback) {
          _preExecutecallback = callback;
        };

        /**
         * Handles a 'contextmenu' HTML DOM event, which occurs when the user
         * right-clicks to trigger the context menu to appear.
         *
         * Also executes any pre-requisite that might be required by the menu
         * by executing the preExecute callback set.
         *
         * @param event {Object} The 'contextmenu' event
         */
        var _handleTriggerEvent = function(event) {
          var pos;
          if (TypeUtils.isFunction(_preExecutecallback)) {
            _preExecutecallback(event);
          }
          _api.hideBase();

          if (event !== undefined) {
            event.preventDefault();

            if (!_api.isMenuActive()) {
              _api.showBase();
              pos = _calculatePosition(event.x, event.y);
              _api.setPosition(pos.x, pos.y);
              _domNodes.menu.tabIndex = '1';
              _domNodes.menu.focus();
            }
          }
        };

        /**
         * Calculates the menu position. Returns an object containing an x and y
         * coordinates.
         *
         * @param eventX {number} The x coordinate
         * @param eventY {number} The y coordinate
         */
        var _calculatePosition = function(eventX, eventY) {
          var pos = {},
              kGutter = 10,
              kMinPos = 0;

          // make sure we fit in the window.body and leave a little
          // gutter on the edges
          var onscreenX = window.document.body.offsetWidth -
              _domNodes.menu.offsetWidth - kGutter;
          var onscreenY = window.document.body.offsetHeight -
              _domNodes.menu.offsetHeight - kGutter;

          pos.x = Math.max(Math.min(onscreenX, eventX), kMinPos);
          pos.y = Math.max(Math.min(onscreenY, eventY), kMinPos);

          return pos;
        };

        var _addListeners = function() {
          // listen for the 'contextmenu' event to bring up the menu
          // listen for the 'click' event inside the menu (which
          // bubbles up from the menu item) and hide the menu when that
          // happens, and finally also listen for blur - losing focus
          // means hide as well
          DomListener.addListener(_parentNode,
              'contextmenu', _handleTriggerEvent);
          DomListener.addListener(_domNodes.menu, 'click', _api.hideBase);
          DomListener.addListener(_domNodes.menu, 'blur', _onBlur);
          PubSub.subscribe(_kSignal_ToolbarClicked, _api.hideBase);
        };

        var _onBlur = function() {
          // only process the blur event if it has occured because something
          // else has gained focus *within* the QO app (in which case the
          // document's activeElement will have changed); ignore it if the
          // focus has gone to something *outwith* the QO app (in which case
          // the document's activeElement will remain the same) - e.g. another
          // browser window
          if(document.activeElement !== _domNodes.menu) {
            _api.hideBase();
          }
        };

        var _init = function() {
          _domNodes.menu = _api.getElement();
          _domNodes.menu.classList.add('qowt-contextmenu');
          _domNodes.menu.classList.add('qowt-text-capitalize');
        };

        _init();
        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  // register with the widget factory;
  WidgetFactory.register(_factory);

  return _factory;
});
