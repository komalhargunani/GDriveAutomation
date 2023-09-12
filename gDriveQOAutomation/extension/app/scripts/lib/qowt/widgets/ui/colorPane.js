// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Color Picker widget encapsulates the part of the HTML DOM
 * representing a generic color picker that can used for text color and
 * background color pickers.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([], function() {

  'use strict';

  var _factory = {

    /**
     * Create a new color pane widget populated with a grid of colored
     * squares.
     *
     * TODO(gbiagiotti): Color Pane should inherit from MenuBase
     */
    create: function() {

      // use module pattern for instance object
      var module = function() {

        /**
         * Configs for our constituent html elements.
         * @private
         */
        var _kColorPane = {
        //TODO(upasana): Adding class name 'qowt-main-toolbar' here to
        // enable styles from mainToolbar polymer element to apply when
        // in shady dom mode. Remove once all elements are polymerized.
          className: 'qowt-color-pane qowt-menuPane qowt-main-toolbar',
          node: 'menu'
        };

        /**
         * A map of the html elements making up our color picker.
         * @private
         */
        var _domNodes = {};

        var _api = {

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           *
           * @param node {Node} The HTML node that this widget is to append
           *                    itself to.
           * @method appendTo(node)
           */
          appendTo: function(node) {
            if (node !== undefined) {
              node.appendChild(_domNodes.colorPane);
            }
          },

          /**
           * Query the menu pane HTML element.
           * Use by container widgets.
           * @returns {element} the menu pane element.
           */
          getElement: function() {
            return _domNodes.colorPane;
          },

          /**
           * Adds the given item to the color picker.
           * @param {object} widget A widget, that can be a Color, a Spacer
           * or a MenuItem.
           */
          addItem: function(widget) {
            if (widget.getId) {
              _menuItems[widget.getId()] = widget;
            }
            if(widget instanceof QowtColorSwatch) {
              _domNodes.colorPane.appendChild(widget);
            }
            else {
              widget.appendTo(_domNodes.colorPane);
            }
          },

          setPosition: function(left, top) {
            _domNodes.colorPane.style.left = left;
            _domNodes.colorPane.style.top = top;
          },

          show: function() {
            _domNodes.colorPane.style.visibility = 'visible';
            _domNodes.colorPane.style.opacity = '1';
          },

          hide: function() {
            _domNodes.colorPane.style.visibility = 'hidden';
            // Setting opacity to '0' fixes a bug (272974) on Chromebook Pixel
            // where the scrollbars are still visible when the menu is hidden
            _domNodes.colorPane.style.opacity = '0';
          },

          /**
           * Return the menuItem DOM element present inside top menuButton
           * based on the 'id'.
           *
           * @return {object} - DOM element of menuItem corresponding to 'id'.
           */
          getMenuItemNode: function(id) {
            var menuItemNode;
            var menuItem = _menuItems[id];
            if (menuItem && menuItem.getNode) {
              menuItemNode = menuItem.getNode();
            }
            return menuItemNode;
          }
        };

        // vvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv
        var _menuItems = {};

        /**
         * @private
         * @method _init()
         */
        function _init() {
          _domNodes.colorPane = document.createElement(_kColorPane.node);
          _domNodes.colorPane.className = _kColorPane.className;
          _domNodes.colorPane.classList.add('qowt-main-toolbar');
          _api.hide();
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