// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Menu Pane widget encapsulates the part of the HTML DOM
 * representing a single menu pane which will be filled with menu items. The
 * menu pane can be displayed and hidden, and positioned via CSS.
 */

define([
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/domListener'], function(
    ArrayUtils,
    DomListener) {

  'use strict';

  var _factory = {

    /**
     * Create a new menu pane widget populated with menu items.
     * @returns {MenuPane} a new MenuPane widget empty of any menu items.
     *
     * TODO(gbiagiotti): Menu Pane should inherit from MenuBase
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        /**
         * Configs for our constituent html elements.
         * @private
         */
        var _kMenuPane = {
          className: 'qowt-menuPane',
          node: 'menu'
        };

        /**
         * A map of the html elements making up our menu item.
         * @private
         */
        var _domNodes = {};

        var _api = {
          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * @param node {Node} The HTML node that this widget is
           *                    to append itself to
           */
          appendTo: function(node) {
            if (node !== undefined) {
              node.appendChild(_domNodes.menu);
            }

            _onResize();
          },

          /**
           * Query the menu pane HTML element.
           * Use by container widgets.
           * @returns {element} the menu pane element.
           */
          getElement: function() {
            return _domNodes.menu;
          },

          /**
           * Adds the given menu item to the menu
           * @param {MenuItem} menuItem A MenuItem widget.
           */
          addMenuItem: function(menuItem) {
            _menuItems.push(menuItem);
            menuItem.appendTo(_domNodes.menu);
          },

          /**
           * remove a given menu item from the menu
           * @param {MenuItem} menuItem A MenuItem widget.
           */
          removeMenuItem: function(menuItem) {
            _removeMenuItem(menuItem);
          },

          /**
           * remove all menu items from the pane
           */
          removeAllMenuItems: function() {
            while (_menuItems[0]) {
              _removeMenuItem(_menuItems[0]);
            }
          },

          setPosition: function(left, top) {
            _domNodes.menu.style.left = left;
            _domNodes.menu.style.top = top;
          },

          /**
           * Explicitly sets the menu pane to be visible.
           * Use this where you want the pane to be visible beyond a casual
           * mouse-over/hover. Eg, with context menu panes and drop down
           * buttons.
           */
          show: function() {
            _domNodes.menu.style.visibility = 'visible';
            _domNodes.menu.style.opacity = '1';
          },

          /**
           * Explicitly sets the menu pane to be hidden.
           * Use this where you want the pane to be visible beyond a casual
           * mouse-out/non-hover. Eg, with context menu panes and drop down
           * buttons.
           */
          hide: function() {
            _domNodes.menu.style.visibility = 'hidden';
            // Setting opacity to '0' fixes a bug (272974) on Chromebook Pixel
            // where the scrollbars are still visible when the menu is hidden
            _domNodes.menu.style.opacity = '0';
          },

          /**
           * Return the menuItem DOM element present inside top menuButton
           * based on the 'id'.
           *
           * @return {object} - DOM element of menuItem corresponding to 'id'.
           */
          getMenuItemNode: function(id) {
            var menuItemNode;
            for(var i = 0; i < _menuItems.length; i++) {
              if (_menuItems[i].getNode) {
                var menuItemId = _menuItems[i].getId();
                if(menuItemId === id) {
                  menuItemNode = _menuItems[i].getNode();
                  break;
                }
              }
            }
            return menuItemNode;
          },

          getMenuItemWidget: function(id) {
            var menuItemWidget;
            for (var i = 0; i < _menuItems.length; i++) {
              if (_menuItems[i].getNode) {
                var menuItemId = _menuItems[i].getId();
                if (menuItemId === id) {
                  menuItemWidget = _menuItems[i];
                  break;
                }
              }
            }
            return menuItemWidget;
          }
        };

        // vvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv
        var _menuItems = [];

        /**
         * Handles a resize event calling setMenuScrollable
         * @private
         */
        function _onResize() {
          if (config.opt_scrollable) {
            _setMenuScrollable();
          }
        }

        /**
         * Makes this menu pane scrollable.
         * Sets the max height of this menu.
         * @private
         */
        function _setMenuScrollable() {
          // Constants
          var kGutterWindow = 80;

          _domNodes.menu.classList.add('qowt-scroll-vertical');

          // Limits the menu height making sure we fit in the space
          // available and leaves a gutter on the edges
          _domNodes.menu.style.maxHeight = window.innerHeight - kGutterWindow;
        }

        /**
         * @api private
         * @method _init()
         */
        function _init() {
          _domNodes.menu = document.createElement(_kMenuPane.node);
          _domNodes.menu.className = _kMenuPane.className;
          _api.hide();
          //Setting ARIA attribute for menu.
          _domNodes.menu.setAttribute('role', 'menu');

          // TODO(Upasana): Adding class name 'qowt-main-toolbar' here to
          // enable styles from mainToolbar polymer element to apply when
          // in shady dom mode. Remove once all elements are polymerized.
          _domNodes.menu.classList.add('qowt-main-toolbar');

          DomListener.addListener(window, 'resize', _onResize);
        }

        function _removeMenuItem(menuItem) {
          ArrayUtils.removeElement(_menuItems, menuItem);
          menuItem.removeFrom(_domNodes.menu);
        }

        _init();
        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});


