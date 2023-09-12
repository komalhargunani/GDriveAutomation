// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The button drop-down widget encapsulates the part of the HTML
 * DOM representing a button with a clickable down-arrow icon.
 * It is a top level widget that can be used in several instances (This is used
 * in tool bar and menu list).
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/widgets/ui/menuPane',
  'qowtRoot/widgets/point/shapeMenuItem',
  'qowtRoot/widgets/ui/button',
  'qowtRoot/utils/accessibilityUtils',
  'qowtRoot/utils/i18n',
  'common/mixins/ui/cvoxSpeak'
], function(
    WidgetFactory,
    ArrayUtils,
    PubSub,
    DomListener,
    MenuPane,
    ShapeMenuItem,
    Button,
    AccessibilityUtils,
    I18n,
    CvoxSpeak) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Button Dropdown Widget Factory',

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
     *     qowtRoot/widgets/factory
     *
     * @param {object} config  Configuration object, consists of:
     *     <ul>
     *     <li>config.fromNode {HTML Element} Determine if this widget can be
     *         constructed given this as a base
     *     <li>config.supportedActions {Array} a list of features the widget
     *         must support
     *     </ul>
     *
     * @return {integer} Confidence Score;
     *     This integer between 0 and 100 indicates the determined ability of
     *     this factory to create a widget for the given configuration object.
     *     <ul>
     *     <li>0 is negative: this factory cannot construct a widget for the
     *         given configuration.
     *     <li>100 is positive: this factory definitely can construct a widget
     *         for the given configuration.
     *     <li>1 to 99: This factory could create a widget from the given
     *         configuration data, but it is not a perfect match if another
     *         factory returns a higher score then it would be a more suitable
     *         factory to use.
     *     </ul>
     */
    confidence: function(config) {
      config = config || {};
      // first check that we match the required feature set
      if (config.supportedActions && !ArrayUtils.subset(config.supportedActions,
          _factory.supportedActions)) {
        return 0;
      }
      var score = 0;
      // Now check that the config node matches
      if (config && config.type && config.type === 'addShapeDropdown') {
        score = 100;
      }
      return score;
    },

    /**
     * Creates a new instance of a button dropdown widget.
     * @param {object} config The button dropdown configuration.
     * @param {'dropdown'} config.type Defines this as a button dropdown widget.
     * @param {string} config.label The localised text label for the menu item.
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        /**
         * Configs for our constituent html elements.
         * @private
         */
        var _kButtonDropdown = {
          className: 'qowt-button-addShape-dropdown',
          classNameActive: 'qowt-menu-active',
          classNameDisabled: 'qowt-menu-addShape-disabled',
          classNameFocus: 'focused-button',
          classNameDropdown: 'qowt-button-dropdown',
          node: 'div'
        }, _kButtonShape = {
          className: 'qowt-button-shape-label',
          node: 'div'
        }, _kButtonDown = {
          className: 'qowt-button-down-label',
          node: 'div'
        }, _kLabel = {
          node: 'span'
        };

        var focusedPointElement = null;

        /**
         * A map of the html elements making up our menu item.
         * @private
         */
        var _domNodes = {};

        /**
         * A map of the menu item widgets making up our dropdown button.
         * @private
         */
        var _menuItems = {};

        /**
         * True if the item is enabled, else false.
         * @type {boolean}
         * @private
         */
        var enabled_ = true;

        /**
         * Ensure we have a single handler function instance.
         * Avoids defects where a new instance of the function is bound
         * each time addListeners is called.
         * @private
         */
        var _paneHider = _handleDismiss.bind(this);
        var _subs = {};
        var _paneWidget,
            _menuActive,
            _subMenus = [];

        var _api = {

          name: 'Button Dropdown Widget Instance',

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * @param {Node} parentNode The container node to attach to.
           */
          appendTo: function(parentNode) {
            parentNode.appendChild(_domNodes.buttonDropdown);

            // The menu pane needs info from the render tree
            // so can only be initialised once this container is appended.
            if (!_paneWidget) {
              _initMenuPane(config.items);
            }
          },
          /**
           * Set all menu items within a menu pane in one sweep.
           * This first removes any items that might have previously been set!
           * @param {array} items String array of items to set in the menu.
           */
          setItems: function(items) {
            var widget;
            // remove old menu items
            if (_paneWidget) {
              _paneWidget.removeAllMenuItems();
            }
            if (items.length > 0 && config.action) {
              for (var ix = 0; ix < items.length; ix++) {
                var item = items[ix];
                if (item.type === 'button') {
                  widget = Button.create({
                    action: item.action
                  });
                } else {
                  widget = ShapeMenuItem.create({
                    'type': 'shapeMenuItem',
                    'string': item.name,
                    'action': config.action,
                    'items': item.elements,
                    'iconClass': item.iconClass
                  });
                  _menuItems[item.name] = widget;
                  _subMenus.push(item.name);
                }
                _paneWidget.addMenuItem(widget);
              }
            }
          },

          /**
           * Gets all menu items within a menu pane.
           *
           * @return {object} menu items of a menu pane
           */
          getItems: function() {
            return _menuItems;
          },
          /**
           * Query the HTML element.
           * @return {element} the menu pane element.
           */
          getElement: function() {
            return _domNodes.buttonDropdown;
          },

          /**
           * Query the HTML element.
           * @return {element} the shape Button element.
           */
          getShapeButtonNode: function() {
            return _domNodes.buttonShape;
          },

          /**
           * Invoked during testing to clean up event subscriptions.
           */
          destroy: function() {
          },

          /**
           * Set this button to be enabled or disabled.
           * Default value is True
           * @param {boolean} state Enable if true, disable if false.
           */
          setEnabled: function(state) {
            if (state) {
              _domNodes.buttonDropdown.classList.remove(_kButtonDropdown.
                  classNameDisabled);
              enabled_ = true;
            }
            else {
              _domNodes.buttonDropdown.classList.add(_kButtonDropdown.
                  classNameDisabled);
              enabled_ = false;
            }
          },

          /**
           * Determines if the dropdown is enabled
           * @return {boolean} True if dropdown is enabled, false otherwise
           */

          isEnabled: function() {
            return enabled_;
          },

          /**
           * @returns {Boolean} - true, if dropdown menu is opened
           */
          isMenuOpened: function() {
            return _menuActive;
          },

          getDownArrowNode: function() {
            return _domNodes.label;
          },

          /**
           * Returns currently selected menu in the shape dropdown.
           * @return {*}
           */
          getCurrentSelectedMenu: function() {
            return _domNodes.focusedItem;
          },

          /**
           * Returns submenus name in the order they are in UI.
           * Submenus are- Shapes, Arrows, Callouts and Equation.
           *
           * @return {Array}
           */
          getSubMenusText: function() {
            return _subMenus;
          }
        };

        /**
         * @private
         * Shows the dropdown menu.
         */
        function _showMenu() {
          if (!_menuActive) {
            //Setting button state to expanded when menu is shown.
            _domNodes.buttonDropdown.setAttribute('aria-expanded', true);
            _subs.dismiss = PubSub.subscribe('qowt:selectionChanged',
                _hideMenu);
            _addListeners();
            _paneWidget.show();
            _menuActive = true;
            _domNodes.buttonDropdown.classList.add(
                _kButtonDropdown.classNameActive);
            PubSub.publish('qowt:dropdown:opened');
            CvoxSpeak.speakDropdownNameAndState(_domNodes.buttonDropdown);
          }
        }

        /**
         * Hides the dropdown menu.
         * @private
         */
        function _hideMenu() {
          if (_menuActive) {
            PubSub.unsubscribe(_subs.dismiss);
            _domNodes.buttonDropdown.setAttribute('aria-expanded', false);
            _removeListeners();
            _paneWidget.hide();
            _menuActive = false;
            _domNodes.buttonDropdown.classList.remove(_kButtonDropdown.
                classNameActive);
            resetPreviousItemChoice_();
            _domNodes.focusedItem = undefined;
            PubSub.publish('qowt:dropdown:closed');
            CvoxSpeak.speakDropdownNameAndState(_domNodes.buttonDropdown);
          }
        }

        /**
         * @private
         * Implements the button dropdown behaviour when actioned.
         * @param {object} event  The W3C event received.
         */
        function _handleButtonClick(event) {
          if (event.target.parentNode.id === _domNodes.button.id) {
            handleActionOnDropdownBtn_();
          }
        }


        function _handleKeyDown(event) {
          if (event.type === 'keydown' && event.detail && event.detail.key) {
            if (!_menuActive && isActionKey(event)) {
              handleActionOnFocusedBtn_();
              event.preventDefault();
            } else if (_menuActive) {
              if (event.detail.key === 'enter' && !isAnySubMenuOpened()) {
                _hideMenu();
                this.focus();
                event.preventDefault();
              } else {
                handleKeys_(event);
              }
            }

          }
        }

        function isActionKey(event) {
          return (event.detail.key === 'down' || event.detail.key === 'up' ||
              event.detail.key === 'enter');
        }

        function isAnySubMenuOpened() {
          var itemKey = _subMenus[0];
          var isAnySubMenuPaneOpened = false;
          var shapeSubMenuPanes = _menuItems[itemKey].getShapesPaneWidgets();
          for (var key in shapeSubMenuPanes) {
            if (shapeSubMenuPanes.hasOwnProperty(key)) {
              if (shapeSubMenuPanes[key].isSubMenuPaneOpened()) {
                isAnySubMenuPaneOpened = true;
                break;
              }
            }
          }

          return isAnySubMenuPaneOpened;
        }

        function handleKeyOnPane_(key) {
          var curSelectedMenu = _api.getCurrentSelectedMenu();
          // Default set to first item
          var itemKey = _subMenus[0];
          if (curSelectedMenu) {
            itemKey = getKeyOfSelectedMenu_(curSelectedMenu);
          }

          var openedPane = _menuItems[itemKey].getOpenedMenuPane();

          openedPane.handleKey_(key);
        }


        function handleKeys_(event) {
          var action = event.detail.key;
          var isAnySubMenuPaneOpened = isAnySubMenuOpened();

          if (isAnySubMenuPaneOpened) {
            handleKeyOnPane_(action);
            // When shapeMenuNavigation test is run, event.detail.key
            // is unicode of escape key i.e. u+001b
            if (action === 'u+001b' || action === 'escape') {
              PubSub.publish('qowt:buttonbar:button:actionPerformed');
            }

            event.preventDefault();
          } else {
            switch (action) {
              case 'up':
                selectPreviousItem_();
                PubSub.publish('qowt:shapeSelectedMenuChanged');
                event.preventDefault();
                break;
              case 'down':
                selectNextItem_();
                PubSub.publish('qowt:shapeSelectedMenuChanged');
                event.preventDefault();
                break;
              case 'right':
                var curSelectedItem = _api.getCurrentSelectedMenu();
                if (curSelectedItem) {
                  var itemKey = getKeyOfSelectedMenu_(curSelectedItem);
                  _menuItems[itemKey].handleKey_(event);
                  event.preventDefault();
                }
                break;
            }
          }
        }

        function selectNextItem_() {
          var curSelectedItemIdx = getCurrentSelectedItemIdx_();
          var itemSelected = false;
          var len = _subMenus.length;
          if (curSelectedItemIdx === -1 || curSelectedItemIdx === len - 1) {
            setSelectedItem_(_subMenus[0]);
            itemSelected = true;
          }
          for (var i = 0; i < len && !itemSelected; i++) {
            if (curSelectedItemIdx === i) {
              setSelectedItem_(_subMenus[i + 1]);
              itemSelected = true;
            }
          }
        }

        function selectPreviousItem_() {
          var curSelectedItemIdx = getCurrentSelectedItemIdx_();
          var len = _subMenus.length;
          var itemSelected = false;
          if (curSelectedItemIdx === -1 || curSelectedItemIdx === 0) {
            setSelectedItem_(_subMenus[len - 1]);
            itemSelected = true;
          }
          for (var i = len - 1; i >= 0 && !itemSelected; i--) {
            if (curSelectedItemIdx === i) {
              setSelectedItem_(_subMenus[i - 1]);
              itemSelected = true;
            }
          }
        }

        function getCurrentSelectedItemIdx_() {
          var curSelectedItem = _api.getCurrentSelectedMenu();
          var itemIdx = -1, itemKey;
          if (curSelectedItem) {
            itemKey = getKeyOfSelectedMenu_(curSelectedItem);
            itemIdx = _.indexOf(_subMenus, itemKey);
          }
          return itemIdx;
        }

        function getKeyOfSelectedMenu_(curSelectedItem) {
          var curSelectedItemKey;
          for (var key in _menuItems) {
            if (curSelectedItem === _menuItems[key]) {
              curSelectedItemKey = key;
              break;
            }
          }
          return curSelectedItemKey;
        }

        function setSelectedItem_(option) {
          resetPreviousItemChoice_();
          _domNodes.focusedItem = undefined;
          if (option && _menuItems[option]) {
            _menuItems[option].toggleSelectedItem(true);
            _menuItems[option].getNode && _menuItems[option].getNode().focus();
            _domNodes.focusedItem = _menuItems[option];

            // TODO(Upasana): Below code is for verbalization. Remove this once
            // cvox issue for shadow dom will be resolved.
            speakFocusedShapeMenu(option);

          }
        }

        function speakFocusedShapeMenu(option) {
          var hasRightPointer = _menuItems[option].hasSubMenu();
          var length = _subMenus.length;
          var position = _.indexOf(_subMenus, option) + 1;
          CvoxSpeak.speakShapeDropdownFocusedItem(
            _domNodes.focusedItem.getNode(), hasRightPointer, position,
            length);
        }

        /**
         * @private
         * Reset the previous menu item choice deselecting the menu item.
         */
        function resetPreviousItemChoice_() {
          if (_domNodes.focusedItem) {
            _domNodes.focusedItem.toggleSelectedItem(false);
          }
        }

        /**
         * Focuses drop down button, if button id matches.
         * @param event - event
         * @private
         */
        function focusDropdownBtn_(/* event */) {
          var button = _domNodes.button;
          var btnDropDown = _domNodes.buttonDropdown;
          btnDropDown.classList.add('dropdown-button-focused');
          button.classList.add(_kButtonDropdown.classNameFocus);
        }

        /**
         * Removes focus from drop down button and will close the dropdown
         * if opened.
         * @param event - event
         * @private
         */
        function removeFocusFromDropdown_(event) {
          var button = _domNodes.button;
          var btnDropDown = _domNodes.buttonDropdown;
          if (_menuActive) {
            btnDropDown.classList.remove('dropdown-button-focused');
            button.classList.remove(_kButtonDropdown.classNameFocus);
            if (!event.currentTarget.contains(event.relatedTarget)) {
              _hideMenu();
              AccessibilityUtils.setApplicationSpecificFocusedElement(
                focusedPointElement);
            }
          }
        }

        function setFocusedElementInPoint(event, eventData) {
          event = event || {};
          focusedPointElement = eventData;
        }

        /**
         * Handles respective action on focused button when enter key is
         * pressed.
         * - In this case, dropdown will be opened if closed and vice-versa.
         * @param event - event
         * @private
         */
        function handleActionOnFocusedBtn_(/* event */) {
          var button = _domNodes.button;
          var btnDropDown = _domNodes.buttonDropdown;
          if (btnDropDown.classList.contains('dropdown-button-focused') &&
              button.classList.contains(_kButtonDropdown.classNameFocus)) {
            handleActionOnDropdownBtn_();
          }
        }

        function handleActionOnDropdownBtn_() {
          if (_menuActive) {
            _hideMenu();
          } else {
            _showMenu();
          }
        }

        /**
         * Dismiss the menu pane.
         * @param {event} The received event.
         * @private
         */
        function _handleDismiss(event) {
          // We dismiss the menu if the user clicked outside of the button.
          if (event.srcElement !== _domNodes.button &&
              event.srcElement !== _domNodes.label) {
            _hideMenu();
          }
        }

        /**
         * Listen for clicks anywhere in the document as this should close
         * the open menu.
         * @private
         */
        function _addListeners() {
          DomListener.addListener(document, 'click', _paneHider, true);
        }

        /**
         * Stop listening for those click when we are not visible/active.
         * @private
         */
        function _removeListeners() {
          DomListener.removeListener(document, 'click', _paneHider, true);
        }

        /**
         * @private
         * Construct the menu pane container and the necessary item widgets.
         * We use info from the render tree here, so the buttonDropdown
         * element must have been added to the DOM before this is called.
         */
        function _initMenuPane() {
          _paneWidget = MenuPane.create(
              {opt_scrollable: config.opt_scrollable});
          _paneWidget.setPosition(_domNodes.buttonDropdown.offsetLeft,
              _domNodes.buttonDropdown.offsetHeight);

          _paneWidget.appendTo(_domNodes.buttonDropdown);

          if (config.items) {
            _api.setItems(config.items);
          }

          //Setting default value for button drop down state as collapsed.
          _domNodes.buttonDropdown.setAttribute('aria-expanded', false);
        }

        /**
         * Initialise this buttonDropdown widget.
         * @private
         */
        function _init() {
          // Create our main container
          _domNodes.buttonDropdown = document.createElement(_kButtonDropdown.
              node);
          _domNodes.buttonDropdown.classList.
              add(_kButtonDropdown.classNameDropdown);
          _domNodes.buttonDropdown.classList.add(_kButtonDropdown.className);

          // Create the button element
          _domNodes.button = document.createElement(_kButtonShape.node);
          _domNodes.buttonShape = document.createElement(_kButtonShape.node);
          _domNodes.buttonShape.classList.add(_kButtonShape.className);
          _domNodes.buttonDown = document.createElement(_kButtonDown.node);
          _domNodes.buttonDown.classList.add(_kButtonDown.className);
          _domNodes.button.appendChild(_domNodes.buttonShape);
          _domNodes.button.appendChild(_domNodes.buttonDown);
          _domNodes.buttonDropdown.appendChild(_domNodes.button);

          PubSub.subscribe('qowt:focusedElementInPoint',
          setFocusedElementInPoint);

          if (config.action) {
            _domNodes.button.id = 'cmd-dropdown_' + config.action;
          }
          // Create a label for this control
          if (config.label) {
            _domNodes.label = document.createElement(_kLabel.node);
            _domNodes.button.appendChild(_domNodes.label);
          }
          //Setting wai-aria attributes for buttons and button drop down menu.
          _domNodes.buttonDropdown.setAttribute('role', 'listbox');
          _domNodes.buttonDropdown.setAttribute('tabindex', '-1');
          _domNodes.buttonDropdown.setAttribute('aria-haspopup', true);

          //TODO (Pankaj Avhad) We need to add I18n entries.
          if (config.action) {
            var buttonStr = 'cmd_dropdown_' + config.action +
                '_aria_spoken_word';
            _domNodes.buttonDropdown.setAttribute('aria-label', I18n.getMessage(
                buttonStr.toLowerCase()));
          }

          // We listen for click events just on the button, not on the entire
          // buttonDropdown widget
          DomListener.addListener(_domNodes.buttonDropdown, 'click',
              _handleButtonClick);
          DomListener.addListener(_domNodes.buttonDropdown, 'keydown',
              _handleKeyDown);
          DomListener.addListener(_domNodes.buttonDropdown, 'focus',
              focusDropdownBtn_);
          DomListener.addListener(_domNodes.buttonDropdown, 'blur',
              removeFocusFromDropdown_);
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

  // register with the widget factory;
  WidgetFactory.register(_factory);

  return _factory;
});
