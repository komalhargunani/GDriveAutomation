// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Menu Base
 * The Menu Base module contains common code that is shared by all menu widgets.
 * Currently it is used by the Context Menu and Autocomplete Menu widgets.
 * Each of these menu widgets extends the API that is provided by
 * this Menu Base module.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/domListener',
  'qowtRoot/widgets/ui/menuItem'
], function(
    ArrayUtils,
    DomListener,
    MenuItem) {

  'use strict';

  var _factory = {

    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        /**
         * A map of the html elements making up our menu item.
         * @private
         */
        var _domNodes = {};

        /**
         * An array of menu item widgets attached to this menu widget.
         * @private
         */
        var _menuItems = [];

        /**
         * An map of menu item widgets.
         * @private
         */
        var _menuItemsMap = {};

        /**
         * An array of visible menu item widgets.
         * @private
         */
        var _visibleMenuItems = [];

        var _parentNode,
            _menuActive = true;

        var _api = {

          /**
           * Adds the given menu item to the menu
           *
           * @param menuItem {object} A menu item widget
           */
          addMenuItem: function(menuItem) {
            menuItem.appendTo(_domNodes.menu);
            _api.attachWidget(menuItem);
          },

          removeTabindex: function() {
            var menuNodes = _domNodes.menu.childNodes;
            for(var i = 0; i < menuNodes.length; i++) {
              if(menuNodes[i].hasAttribute('tabindex')) {
                menuNodes[i].removeAttribute('tabindex');
              }
            }
          },

          /**
           * Removes the given menu item from the menu
           *
           * @param menuItem {object} A menu item widget
           */
          removeMenuItem: function(menuItem) {
            menuItem.removeFrom(_domNodes.menu);
            _api.detachWidget(menuItem);
          },

          /**
           * Removes all menu items from the menu
           */
          removeAllMenuItems: function() {
            while (_menuItems[0]) {
              _api.removeMenuItem(_menuItems[0]);
            }
            _menuItemsMap = {};
            _visibleMenuItems = [];
          },

          /**
           * Hides all visible menu items from the menu
           */
          hideVisibleMenuItems: function() {
            _visibleMenuItems.forEach(function(menuItem) {
              menuItem.hide();
            });
            _visibleMenuItems = [];
          },

          /**
           * Sets all the menu item widgets in one go, using the array of
           * strings passed as an argument.
           * Hides the previously created menu items that are not available
           * anymore and returns the array of menu items currently visible.
           * This method is currently used and extended by the
           * Autocomplete Menu widget.
           *
           * @param items {array} An array of strings
           */
          updateMenuItemsBase: function(items) {
            _api.hideVisibleMenuItems();

            items.forEach(function(item, ix) {
              // Create menu items if they don't exist yet
              if (_menuItemsMap[item] === undefined) {
                _menuItemsMap[item] = MenuItem.create({
                  'string': item,
                  'action': config.action,
                  'context': {
                    'value': item
                  }
                });
                _api.addMenuItem(_menuItemsMap[item]);
              }
              else {
                _menuItemsMap[item].show();
              }
              _visibleMenuItems[ix] = _menuItemsMap[item];
            });
            return _visibleMenuItems;
          },

          /**
           * Attach the specified widget to this widget.
           * Here the specified menu item widget is attached to this menu widget
           * Keep references to menu item widgets within the menu.
           *
           * @param menuItem {object} A menuItem widget
           */
          attachWidget: function(menuItem) {
            _menuItems.push(menuItem);
          },

          /**
           * Detach the specified widget from this widget.
           * Here the specified menu item widget is detached from this menu
           * widget.
           *
           * @param menuItem {object} A menuItem widget
           */
          detachWidget: function(menuItem) {
            ArrayUtils.removeElement(_menuItems, menuItem);
          },

          /**
           * Shows the menu
           */
          showBase: function() {
            if (!_menuActive) {
              _domNodes.menu.style.visibility = 'visible';
              _domNodes.menu.style.opacity = '1';
              _menuActive = true;
            }
          },

          /**
           * Hides the menu
           */
          hideBase: function() {
            if (_menuActive) {
              // To hide the menu we have to set visibility 'hidden' rather than
              // display 'none' because we need to be able to get the width and
              // height when the menu is hidden
              _domNodes.menu.style.visibility = 'hidden';
              // Setting opacity to '0' fixes a bug (272974) on Chromebook Pixel
              // where the scrollbars are still visible when the menu is hidden
              _domNodes.menu.style.opacity = '0';
              _menuActive = false;
            }
          },

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           *
           * @param node {Node} The HTML node that this widget is to append
           *                    itself to
           */
          appendTo: function(node) {
            if (node === undefined) {
              throw ('appendTo - missing node parameter!');
            }
            node.appendChild(_domNodes.menu);
            _parentNode = node;

            // setMenuScrollable needs info from the render tree
            // so can only be called once this container is appended.
            _api.onResize();
          },

          /**
           * Set the menu position
           *
           * @param left {number} The left position
           * @param top {number} The top position
           */
          setPosition: function(left, top) {
            _domNodes.menu.style.left = left + 'px';
            _domNodes.menu.style.top = top + 'px';
          },

          /**
           * Returns the menu height
           */
          getHeight: function() {
            return _domNodes.menu.offsetHeight;
          },

          /**
           * Returns the menu width
           */
          getWidth: function() {
            return _domNodes.menu.offsetWidth;
          },

          /**
           * Returns a context menu item based on the 'id'
           * @param id - Id of the menu-item
           */
          getMenuItem: function(id) {
            for(var i = 0; i < _menuItems.length; i++) {
              var menuItem = _menuItems[i];
              if(menuItem.getId() === id) {
                return menuItem;
              }
            }
          },

          /**
           * Sets the max width of the menu
           *
           * @param maxWidth {number|'none'} The max width value
           */
          setMaxWidth: function(maxWidth) {
            if (maxWidth === 'none') {
              _domNodes.menu.style.maxWidth = maxWidth;
            }
            else {
              _domNodes.menu.style.maxWidth = maxWidth + 'px';
            }
          },

          /**
           * Gets the menu DOM element
           */
          getElement: function() {
            return _domNodes.menu;
          },

          /**
           * Returns true if the menu is active, false otherwise
           */
          isMenuActive: function() {
            return _menuActive;
          },

          /**
           * Handles a resize event calling setMenuScrollable
           */
          onResize: function() {
            if (config.opt_scrollable) {
              _setMenuScrollable(_parentNode);
            }
          }
        };

        /**
         * Makes this menu scrollable. Sets the max height of this menu.
         * @private
         *
         * @param opt_node {HTMLElement} Optional HTML node that is the outer
         *                               container for this menu widget
         */
        var _setMenuScrollable = function(opt_node) {
          // Constants
          var kGutter = 28;
          // kGutterWindow is a gutter when an outer container node is not
          // provided and we use window.innerHeight
          var kGutterWindow = 80;

          _domNodes.menu.classList.add('qowt-scroll-vertical');

          // Limits the menu height making sure we fit in the space available
          // and leaves a gutter on the edges
          _domNodes.menu.style.maxHeight = opt_node !== undefined ?
              opt_node.clientHeight - kGutter :
              window.innerHeight - kGutterWindow;
        };

        var _init = function() {
          _domNodes.menu = document.createElement('menu');
          _api.hideBase();
          _domNodes.menu.classList.add('qowt-menu-mouse-mode');
          //Setting ARIA attribute for menu.
          _domNodes.menu.setAttribute('role', 'menu');
          DomListener.addListener(window, 'resize', _api.onResize);
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

  return _factory;
});