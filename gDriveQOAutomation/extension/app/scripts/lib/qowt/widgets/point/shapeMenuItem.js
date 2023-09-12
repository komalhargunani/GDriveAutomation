// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The shape menu item widget encapsulates the part of HTML DOM
 * representing an menu item that appears in a add shape drop-down.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/point/shapeItemsPane'
], function(
    PubSub,
    DomListener,
    I18n,
    ShapeItemsPane) {

  'use strict';

  //constants
  var _kDivType = 'qowt-menuitem', _allShapePaneWidgets = {};

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'ShapeMenuItem Widget Factory',


    /**
     * Create a new menu item instance.
     *
     * @param {object} config Widget configuration for new instance.
     * @param {string} config.stringId A string id to display as the item label.
     * @param {string} config.string Non-localisable string for the item label.
     * @param {string} config.action The action associated with this menu item.
     * @param {undefined|string|object} config.context May be undefined.
     *        A string is interpreted as a contentType. An object should contain
     *        at least a contentType property along with other necessary data.
     * @param {string} config.iconClass Classname for icon styling.
     * @param {string} config.shortcut Shortcut key identifier.
     * @param {Function} config.formatter A custom function to style the
     *        items being created. eg to apply a specific font.
     * @param {function} config.setOnSelect Function that returns true or false.
     *        Used by menu items that need to send context.set = [true | false].
     */
    create: function(config) {
      if (!(config && config.type && config.type === 'shapeMenuItem')) {
        throw new Error('ShapeMenuItem widget create with bad config');
      }

      // use module pattern for instance object
      var module = function() {

        /**
         * A map of the html elements making up our menu item.
         * @private
         */
        var _domNodes = {};

        var _api = {

          name: 'ShapeMenuItem Widget Instance',

          /**
           * Gets the menu item html node.
           *
           * @return {object} The menu item node.
           */
          getNode: function() {
            return _domNodes.item;
          },

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to
           * a specified node in the HTML DOM.
           *
           * @param {element} node The HTML node we are going to append to.
           */
          appendTo: function(node) {
            if (node === undefined) {
              console.warning('ShapeMenuItem.appendTo() -' +
                  'missing node parameter!');
            }

            if (_domNodes.item !== undefined) {
              node.appendChild(_domNodes.item);
              _initShapeItemsPane(node);
            }
          },

          /**
           * Shows this menu item.
           */
          show: function() {
            _domNodes.item.style.display = 'block';
          },

          /**
           * Gets shape pane widget
           *
           * @return {object} pane widgets of menu items
           */
          getShapesPaneWidgets: function() {
            return _allShapePaneWidgets;
          },


          /**
           * Hides this menu item.
           */
          hide: function() {
            _domNodes.item.style.display = 'none';
          },

          /**
           * Select or deselect a menu item.
           *
           * @param {boolean} select True/False
           */
          toggleSelectedItem: function(select) {
            if (select) {
              _domNodes.item.classList.add('selected');
            } else {
              _domNodes.item.classList.remove('selected');
            }
          },

          hasSubMenu: function() {
            return _domNodes.submenuArrow;
          },

          handleKey_: function(evt) {
            handleKeyDown_(evt);
          },

          getOpenedMenuPane: function() {
            var openedPaneWidget;
            for (var key in _allShapePaneWidgets) {
              if (_allShapePaneWidgets.hasOwnProperty(key)) {
                var isOpen = _allShapePaneWidgets[key].isSubMenuPaneOpened();
                if (isOpen) {
                  openedPaneWidget = _allShapePaneWidgets[key];
                  break;
                }
              }
            }
            return openedPaneWidget;
          }
        };

        /**
         * Trigger this menu item's action on mouse over.
         *
         * @param {event=} opt_event The triggering event.
         *                          Undefined if invoked via keyboard shortcut.
         * @private
         */
        var _handleMouseOverEvent = function(/* opt_event */) {
          for (var key in _allShapePaneWidgets) {
            if (_allShapePaneWidgets.hasOwnProperty(key)) {
              _allShapePaneWidgets[key].hide();
            }
          }
          var tempWidget = _allShapePaneWidgets[
              _domNodes.item.getAttribute('qowt-menutype')];
          if (tempWidget) {
            var buttonbarWrapper =
                document.querySelector('#main-toolbar')
                .$['qowt-main-buttonbar-wrapper'];
            tempWidget.setPosition(
                _domNodes.item.getBoundingClientRect().width + 1,
                _domNodes.item.getBoundingClientRect().top -
                _domNodes.item.getBoundingClientRect().height -
                buttonbarWrapper.offsetHeight);
            tempWidget.show();
          }
        };

        /**
         * Trigger this menu item's action on mouse over.
         *
         * @param {event=} opt_event The triggering event.
         *                          Undefined if invoked via keyboard shortcut.
         * @private
         */
        var _handleMouseOutEvent = function(/* opt_event */) {
          for (var key in _allShapePaneWidgets) {
            if (_allShapePaneWidgets.hasOwnProperty(key)) {
              _allShapePaneWidgets[key].hide();
            }
          }
        };

        /**
         * Blur the menu item when its sub pane is closed.
         * @private
         */
        var blurMenuItem_ = function() {
          var isSubPaneOpened = isSubMenuActive_();
          if (!isSubPaneOpened) {
            _api.toggleSelectedItem(false);
          }

        };

        /**
         * Keeps focus on the menu item when its sub pane is opened.
         * @private
         */
        var selectMenuItem_ = function() {
          var isSubPaneOpened = isSubMenuActive_();
          if (isSubPaneOpened) {
            _api.toggleSelectedItem(true);
          }

        };

        var isSubMenuActive_ = function() {
          var menuName = _domNodes.item.getAttribute('qowt-menutype');
          return _allShapePaneWidgets[menuName] &&
              _allShapePaneWidgets[menuName].isSubMenuPaneOpened();
        };


        /**
         * @private
         * Construct the shape items container widgets.
         */
        function _initShapeItemsPane(node) {
          var _paneWidget = ShapeItemsPane.create(config);
          if (node.parentNode) {
            _paneWidget.appendTo(node.parentNode);
            _allShapePaneWidgets[config.string] = _paneWidget;
          }
        }

        function handleKeyDown_(event) {
          if (_api.hasSubMenu()) {
            var action = event.detail.key;
            switch (action) {
              case 'right':
                _handleMouseOverEvent();
                PubSub.publish('qowt:shapeSubmenuPane:opened');
                break;
            }
          }
        }

        /**
         * Initialise a new shapeMenuItem widget.
         * @private
         */
        var _init = function() {
          // create the main container
          _domNodes.item = document.createElement('div');
          _domNodes.item.id = 'shapemenuitem-' + config.string;
          _domNodes.item.classList.add('shapemenuitem-' + config.action);
          _domNodes.item.classList.add('qowt-main-toolbar');
          _domNodes.item.setAttribute('qowt-divtype', _kDivType);
          _domNodes.item.setAttribute('qowt-menutype', config.string);
          var ariaLabel =
              I18n.getMessage('menu_item_' + config.string.toLowerCase());
          _domNodes.item.setAttribute('aria-label', ariaLabel);
          _domNodes.item.classList.add(_kDivType);

          // create the text content
          _domNodes.item.content = document.createElement('div');
          _domNodes.item.content.className = 'qowt-menuitem-content';
          _domNodes.item.setAttribute('role', 'menuitem');
          _domNodes.item.setAttribute('tabindex', '-1');

          // create the icon if present
          if (config.iconClass && config.iconClass !== '') {
            _domNodes.icon = document.createElement('div');
            _domNodes.icon.className = 'qowt-menuitem-icon';
            _domNodes.icon.classList.add('icon-' + config.iconClass);
            _domNodes.icon.classList.add('qowt-main-toolbar');
            _domNodes.item.content.appendChild(_domNodes.icon);
          }

          //TODO:Pankaj Avhad I18n entries not added for now.
          if (config.stringId) {
            _domNodes.item.content.appendChild(
                document.createTextNode(I18n.getMessage(config.stringId)));
          }
          else if (config.string) {
            _domNodes.item.content.appendChild(
                document.createTextNode(config.string));
          }

          _domNodes.submenuArrow = document.createElement('span');
          _domNodes.submenuArrow.textContent = '►';
          _domNodes.submenuArrow.className = 'qowt-submenu-arrow';
          _domNodes.submenuArrow.classList.add('qowt-main-toolbar');
          _domNodes.item.content.appendChild(_domNodes.submenuArrow);
          _domNodes.item.appendChild(_domNodes.item.content);

          DomListener.addListener(_domNodes.item, 'mouseover',
              _handleMouseOverEvent);
          DomListener.addListener(_domNodes.item, 'mouseout',
              _handleMouseOutEvent);
          PubSub.subscribe('qowt:shapeSubPaneClosed', blurMenuItem_);
          PubSub.subscribe('qowt:shapeSubPaneOpened', selectMenuItem_);
        };

        function _verifyInternals() {
          return _domNodes &&
              _domNodes.item.classList &&
              _domNodes.item.classList.contains(_kDivType) &&
              _domNodes.item.getAttribute &&
              _domNodes.item.getAttribute('qowt-divtype') === _kDivType;
        }

        _init();
        return _verifyInternals() ? _api : undefined;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };
  return _factory;
});
