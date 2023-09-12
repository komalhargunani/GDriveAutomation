// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The button dropdown widget encapsulates the part of the HTML
 * DOM representing a button with a clickable down-arrow icon.
 * It is a top level widget that can be used in several instances (font-size
 * picker, font-face picker and paragraph style picker).
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/widgets/ui/menuPane',
  'qowtRoot/widgets/ui/menuItem',
  'qowtRoot/widgets/ui/button',
  'qowtRoot/utils/accessibilityUtils',
  'qowtRoot/utils/i18n',
  'common/mixins/ui/cvoxSpeak',
  'qowtRoot/utils/typeUtils',

  'third_party/lo-dash/lo-dash.min'
], function(
    WidgetFactory,
    ArrayUtils,
    PubSub,
    DomListener,
    MenuPane,
    MenuItem,
    Button,
    AccessibilityUtils,
    I18n,
    CvoxSpeak,
    TypeUtils) {

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
      if (config && config.type && config.type === 'dropdown') {
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
          className: 'qowt-button-dropdown',
          classNameActive: 'qowt-menu-active',
          node: 'div'
        },
            _kButton = {
              className: 'qowt-button-label',
              classNameFocus: 'focused-button',
              node: 'button'
            },
            _kLabel = {
              node: 'span'
            };

        /**
         * A map of the html elements making up our menu item.
         * @private
         */
        var _domNodes = {};

        var focusedPointElement = null;

        /**
         * A map of the menu item widgets making up our dropdown button.
         * @private
         */
        var _menuItems = {};

        /**
         * Ensure we have a single handler function instance.
         * Avoids defects where a new instance of the function is bound
         * each time addListeners is called.
         * @private
         */
        var _paneHider = _handleDismiss.bind(this),
            _itemChosen = _handleItemChoice.bind(this);
        var _subs = {};
        var _paneWidget,
            _menuActive,
            _requestActionToken,
            _menuItemsArray = [],
            _dropdownOpenedUsingKey = false;

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
           * Update the selected menu item and the text label in the button.
           *
           * @param {string} option New value to be shown in the button.
           */
          setSelectedItem: function(option) {
            _resetPreviousItemChoice();
            _domNodes.selectedMenuItem = undefined;
            if (option) {
              if (config.label) {
                _domNodes.label.textContent = option;
              }

              if (_menuItems[option]) {
                _menuItems[option].toggleSelectedItem(true);
                _domNodes.selectedMenuItem = _menuItems[option];
                var buttonStr = config.action + '_aria_spoken_word';
                var newlabel = I18n.getMessage(buttonStr.toLowerCase()) + 
                _domNodes.selectedMenuItem.getNode().getAttribute('aria-label')
                + ' selected';
                _domNodes.buttonDropdown.setAttribute('aria-label', newlabel);
                if (_dropdownOpenedUsingKey) {
                  _domNodes.buttonDropdown.focus();
                  _dropdownOpenedUsingKey = false;
                }
              }
            }
          },

          setNavigatedItem: function(option) {
            _resetPreviousItemChoice();
            _resetPreviousNavigatedItem();
            _domNodes.navigatedMenuItem = undefined;
            if (option && _menuItems[option]) {
              _menuItems[option].toggleNavigatedItem(true);
              _domNodes.navigatedMenuItem = _menuItems[option];
              speakDropdownItem_(option);
            }
          },

          /**
           * Returns the text of selected item.
           */
          getSelectedItemText: function() {
            var text;
            if (_domNodes.label) {
              text = _domNodes.label.textContent;
            }
            return text;
          },

          getSelectedMenuItem: function() {
            return _domNodes.selectedMenuItem;
          },

          getNavigatedMenuItem: function() {
            return _domNodes.navigatedMenuItem;
          },

          /**
           * Set all menu items within a menu pane in one sweep.
           * This first removes any items that might have previously been set!
           * @param {array} items String array of items to set in the menu.
           * @param {Function=} opt_formatter A custom function to style the
           *     items being created. eg to apply a specific font.
           */
          setItems: function(items, opt_formatter) {
            var widget;

            // remove old menu items
            if (_paneWidget) {
              _paneWidget.removeAllMenuItems();
            }

            // TODO: not have coupled knowledge of the 2 widgets created here,
            // instead depend on the widget factory and make the factory
            // generate these 2 forms of widget. Makes this code simpler.
            if (items.length > 0 && config.action) {
              for (var ix = 0; ix < items.length; ix++) {
                var item = items[ix];
                if (item.type === 'button') {
                  widget = Button.create({
                    action: item.action
                  });
                } else {

                  var context = config.context || {};
                  if (config.preExecuteHook &&
                      TypeUtils.isFunction(config.preExecuteHook)) {
                    context = _.merge(context, config.preExecuteHook(item));
                  }

                  widget = MenuItem.create({
                    'string': item,
                    'formatter': opt_formatter,
                    'action': config.action,
                    'context': context
                  });
                  _menuItems[item] = widget;
                }

                _paneWidget.addMenuItem(widget);
              }
            }
            _menuItemsArray = items;
          },

          /**
           * Returns the menu item node within a menu pane.
           *
           * @param {String} value - node value
           * @return {object} menu item node of a menu pane
           */
          getItem: function(value) {
            return _menuItems[value].getNode();
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
           * Returns menuItems array within a menu pane.
           * @return {Array} menu items array of a menu pane
           */
          getMenuItemsArray: function() {
            return _menuItemsArray;
          },

          /**
           * Get button item within a button bar.
           *
           * @return {HTML Element} Returns button item of a menu pane.
           */
          getButtonItem: function(id) {
            return _paneWidget.getMenuItemNode(id);
          },

          /**
           * Invoked during testing to clean up event subscriptions.
           */
          destroy: function() {
            PubSub.unsubscribe(_requestActionToken);
          },

          /**
           * @returns {Boolean} - true, if dropdown menu is opened
           */
          isMenuOpened: function() {
            return _menuActive;
          },

          /**
           * Set this dropdown button to be enabled or disabled.
           *
           * @param {Boolean=} opt_state Optional opt_state value
           * Enable if true, disable if false.
           */
          setEnabled: function(opt_state) {
            opt_state = (opt_state === undefined) ? true : !!opt_state;
            _domNodes.button.disabled = !opt_state;
            if (opt_state) {
              _domNodes.buttonDropdown.removeAttribute('disabled');
            } else {
              _domNodes.buttonDropdown.setAttribute('disabled','');
            }
          },

          /**
           * Query if the dropdown button is enabled or not.
           *
           * @return {Boolean} true if the dropdown button is enabled, otherwise
           *     false.
           */
          isEnabled: function() {
            return (_domNodes.button.disabled !== true);
          },

          getButtonNode: function() {
            return _domNodes.button;
          },

          getDropdownNode: function() {
            return _domNodes.buttonDropdown;
          }
        };

        // TODO(Upasana):This function contains cvox speak api specific changes.
        // Should be removed when cvox supports shadow dom.
        /**
         * Speaks the dropdown item with their specific information.
         * Information to speak in the given sequence-
         * 1. Focused item aria-label
         * 2. Focused item role - menuitem
         * 3. Selected state true or false. True if 'selected' else false for
         *   'not selected'
         * 4. Position of the focused item in list out of total items length.
         *
         * @param focusedItem {String} - currently focused item text
         * @private
         */
        function speakDropdownItem_(focusedItem) {
          var totalItems = _menuItemsArray.length;
          var itemPosition = _.indexOf(_menuItemsArray, focusedItem) + 1;
          var selectedState =
              _domNodes.selectedMenuItem === _domNodes.navigatedMenuItem;
          var itemToSpeak = _domNodes.navigatedMenuItem.getNode();

          CvoxSpeak.speakFocusedDropdownItem(itemToSpeak, false, selectedState,
              itemPosition, totalItems);

        }

        // TODO(Upasana):This function contains cvox speak api specific changes.
        // Should be removed when cvox supports shadow dom.
        /**
         * Speaks the dropdown name & its state(expanded) when dropdown is
         * opened. And if that dropdown has any label/selected item then it
         * speaks the label/selected item & its information.
         *
         * For e.g., for Font Style dropdown whose label is 'Heading 1" then it
         * will speak on opening-
         * "Font Style dropdown list expanded Heading 1 selected 2 of 6'
         * where 2 is the position of 'Heading 1' in the list of length 6.
         *
         * @param itemToSpeak {DOM node} - button dropdown node
         * @private
         */
        function speakDropdownLabelOnOpening_(itemToSpeak) {
          var itemText = getItemText();
          var itemPosition = getItemPositionInList(itemText);

          var selectedState = true;
          var totalItems = _menuItemsArray.length;

          CvoxSpeak.speakDropdownWhenOpened(itemToSpeak, false, itemText,
              selectedState, itemPosition, totalItems);
        }

        /**
         * Returns the text representation of item in the dropdown list.
         *
         * @return {String} text - text representation of current selected item
         *     in dropdown list.
         */
        function getItemText() {
          var text;
          if (_domNodes.label) {
            text = _domNodes.label.textContent;
          } else {
            var selectedItem = getCurrentSelectedItem();
            if (selectedItem) {
              text = selectedItem.getNode().textContent ||
                  getKeyOfSelectedItem(selectedItem);
            }
          }
          return text;
        }

        /**
         * @param {String} item - text representing the item in dropdown list
         * @return {Number} - position of item in the list
         */
        function getItemPositionInList(item) {
          var itemPosition = -1;
          if (_domNodes.button.id === 'cmd-modifyShapeOutlineWidth') {
            var key = getKeyOfSelectedItem(_domNodes.selectedMenuItem);
            itemPosition = _.indexOf(_menuItemsArray, key) + 1;
          } else {
            itemPosition = _.indexOf(_menuItemsArray, item) + 1;
          }
          return itemPosition;
        }


        /**
         * @private
         * Shows the dropdown menu.
         */
        function _showMenu() {
          if (!_menuActive) {
            _domNodes.button.setAttribute('aria-expanded', true);
            _subs.dismissSelectionChanged =
                PubSub.subscribe('qowt:selectionChanged',
                    _hideMenu);
            _subs.dismissFormattingChanged =
                PubSub.subscribe('qowt:formattingChanged',
                    _hideMenu);
            _addListeners();
            _paneWidget.show();
            _menuActive = true;
            _domNodes.buttonDropdown.classList.add(
                _kButtonDropdown.classNameActive);
            speakDropdownLabelOnOpening_(_domNodes.buttonDropdown);
          }
        }

        /**
         * @private
         * Hides the dropdown menu.
         */
        function _hideMenu() {
          if (_menuActive) {
            _domNodes.button.setAttribute('aria-expanded', false);
            PubSub.unsubscribe(_subs.dismissSelectionChanged);
            PubSub.unsubscribe(_subs.dismissFormattingChanged);
            _removeListeners();
            _paneWidget.hide();
            _menuActive = false;
            _domNodes.buttonDropdown.classList.remove(_kButtonDropdown.
                classNameActive);
            CvoxSpeak.speakDropdownNameAndState(_domNodes.buttonDropdown);
          }
        }

        /**
         * @private
         * Implements the button dropdown behaviour when actioned.
         * @param {object} event  The W3C event received.
         */
        function _handleButtonClick(/*event*/) {
          _handleActionOnButton();
        }

        function _handleKeyDown(event) {
          if (event.type === 'keydown' && event.detail && event.detail.key) {
            var button = _domNodes.button;
            //TODO: (Upasana) : Temporary having this check just to insure
            // that it does not break sheet. Once, we support other
            // button dropdowns accessibility for sheet. This check
            // should be removed.
            if (button.id === 'cmd-cellAlign') {
              _handleActionOnButton();
            } else if (event.detail.key === 'down') {
              if (!_menuActive) {
                _showMenu();
              } else {
                moveToNextItem();
              }
              event.preventDefault();
            } else if (event.detail.key === 'up') {
              if (!_menuActive) {
                _showMenu();
              } else {
                moveToPreviousItem();
              }
              event.preventDefault();
            } else if (event.detail.key === 'enter') {
              _dropdownOpenedUsingKey = true;
              performActionForSelectedItem();
              event.preventDefault();
            }
          }
        }

        function _handleActionOnButton() {
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
          // TODO(davidshimel) This code to determine if the click occurred on
          // this element is repeated in several places. It should be
          // consolidated, perhaps in QowtElement.
          var clickedOutside;
          if (event && event.path) {
            clickedOutside = !(_.find(event.path, function(elm) {
              return elm === _domNodes.button || elm === _domNodes.label;
            }));
          }
          if (clickedOutside) {
            _hideMenu();
            AccessibilityUtils.setApplicationSpecificFocusedElement(
              focusedPointElement);
          } else {
            _domNodes.buttonDropdown.focus();
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
         * Handle a menu item choice.
         */
        function _handleItemChoice(eventType, eventData) {
          eventType = eventType || '';
          if (eventData && eventData.action === config.action) {

            // TODO(jliebrand): this is an ugly hack to make old style
            // drops downs work in the polymer world. The new polymer based
            // menu and toolbar elements should not have this quirk. The
            // reason for this is ultimate that all drop downs get the
            // itemChoice of ALL dropdowns.. it's all quite wrong, but
            // this code "makes it work" until duncan and greg land
            // the toolbar and menu changes
            // note: also assumes a formatting object with just ONE property
            // which for menu/toolbars right now holds true
            var formatting = eventData.context.formatting;
            var prop = Object.keys(formatting)[0];
            var value = formatting[prop];
            // var x = config.preExecuteHook(value);
            if (config.id2Name) {
              value = config.id2Name(value);
            }

            _api.setSelectedItem(value);
          }
        }

        /**
         * @private
         * Reset the previous menu item choice deselecting the menu item.
         */
        function _resetPreviousItemChoice() {
          if (_domNodes.selectedMenuItem) {
            _domNodes.selectedMenuItem.toggleSelectedItem(false);
          }
        }


        function _resetPreviousNavigatedItem() {
          if (_domNodes.navigatedMenuItem) {
            _domNodes.navigatedMenuItem.toggleNavigatedItem(false);
          }
        }

        /**
         * Focuses button drop down button, if button id matches.
         * @param evt - event
         * @param evtData - event data
         * @private
         */
        function focusDropdownBtn_(/* event */) {
          var button = _domNodes.button;
          var btnDropDown = _domNodes.buttonDropdown;
          btnDropDown.classList.add('dropdown-button-focused');
          button.classList.add(_kButton.classNameFocus);
        }

        /**
         * Removes focus from button drop down button and will close the
         * dropdown if opened.
         * @param evt - event
         * @param evtData - eventData
         * @private
         */
        function removeFocus_(event) {
          var button = _domNodes.button;
          var btnDropDown = _domNodes.buttonDropdown;
          if (_menuActive &&
            !event.currentTarget.contains(event.relatedTarget)) {
            _hideMenu();
            if (_domNodes.selectedMenuItem && _domNodes.label) {
              _api.setSelectedItem(_domNodes.label.textContent);
            }
            _resetPreviousNavigatedItem();
            _domNodes.navigatedMenuItem = undefined;
          }

          if (button.classList.contains(_kButton.classNameFocus)) {
            btnDropDown.classList.remove('dropdown-button-focused');
            button.classList.remove(_kButton.classNameFocus);
          }
        }

        function setFocusedElementInPoint(event, eventData) {
          event = event || {};
          focusedPointElement = eventData;
        }

        function moveToNextItem() {
          var curSelectedItemIdx = getCurrentSelectedItemIdx();
          var itemSelected = false;
          var len = _menuItemsArray.length;
          if (curSelectedItemIdx === -1 || curSelectedItemIdx === len - 1) {
            _api.setNavigatedItem(_menuItemsArray[0]);
            _menuItems[_menuItemsArray[0]].getNode().focus();
            itemSelected = true;
          }
          for (var i = 0; i < len && !itemSelected; i++) {
            if (curSelectedItemIdx === i) {
              _api.setNavigatedItem(_menuItemsArray[i + 1]);
              _menuItems[_menuItemsArray[i + 1]].getNode().focus();
              itemSelected = true;
            }
          }
        }

        function moveToPreviousItem() {
          var curSelectedItemIdx = getCurrentSelectedItemIdx();
          var len = _menuItemsArray.length;
          var itemSelected = false;
          if (curSelectedItemIdx === -1 || curSelectedItemIdx === 0) {
            _api.setNavigatedItem(_menuItemsArray[len - 1]);
            _menuItems[_menuItemsArray[len - 1]].getNode().focus();
            itemSelected = true;
          }
          for (var i = len - 1; i >= 0 && !itemSelected; i--) {
            if (curSelectedItemIdx === i) {
              _api.setNavigatedItem(_menuItemsArray[i - 1]);
              _menuItems[_menuItemsArray[i - 1]].getNode().focus();
              itemSelected = true;
            }
          }
        }

        function performActionForSelectedItem() {
          if (_menuActive && _domNodes.navigatedMenuItem) {
            var curSelectedItemIdx = getCurrentSelectedItemIdx();
            var len = _menuItemsArray.length;
            if (curSelectedItemIdx >= 0 && curSelectedItemIdx < len) {
              _domNodes.navigatedMenuItem.handleKey();
              _resetPreviousNavigatedItem();
            }
          }
          _handleActionOnButton();
        }

        function getCurrentSelectedItemIdx() {
          var curSelectedItem = getCurrentSelectedItem();
          var itemIdx = -1, itemKey;
          if (curSelectedItem) {
            itemKey = getKeyOfSelectedItem(curSelectedItem);
            itemIdx = _.indexOf(_menuItemsArray, itemKey);
          }
          return itemIdx;
        }

        function getCurrentSelectedItem() {
          return _domNodes.navigatedMenuItem ?
              _domNodes.navigatedMenuItem : _domNodes.selectedMenuItem;
        }

        function getKeyOfSelectedItem(curSelectedItem) {
          var curSelectedItemKey;
          for (var key in _menuItems) {
            if (curSelectedItem === _menuItems[key]) {
              curSelectedItemKey = key;
              break;
            }
          }
          return curSelectedItemKey;
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
            _api.setItems(config.items, config.formatter);
          }

          //Setting default value for button drop down state as collapsed.
          _domNodes.button.setAttribute('aria-expanded', false);
        }

        /**
         * Initialise this buttonDropdown widget.
         * @private
         */
        function _init() {
          // Create our main container
          _domNodes.buttonDropdown = document.createElement(_kButtonDropdown.
              node);
          _domNodes.buttonDropdown.classList.add(_kButtonDropdown.className);
          _domNodes.buttonDropdown.setAttribute('role', 'listbox');

          PubSub.subscribe('qowt:focusedElementInPoint',
            setFocusedElementInPoint);

          // TODO(upasana): Adding class name 'qowt-main-toolbar' here to
          // enable styles from mainToolbar polymer element to apply when
          // in shady dom mode. Remove once all elements are polymerized.
          _domNodes.buttonDropdown.classList.add('qowt-main-toolbar');

          // Create the button element
          _domNodes.button = document.createElement(_kButton.node);
          // TODO(upasana): Adding class name 'qowt-main-toolbar' here to
          // enable styles from mainToolbar polymer element to apply when
          // in shady dom mode. Remove once all elements are polymerized.
          _domNodes.button.classList.add('qowt-main-toolbar');

          _domNodes.buttonDropdown.appendChild(_domNodes.button);

          if (config.action) {
            _domNodes.button.id = 'cmd-' + config.action;
          }
          // Create a label for this control
          if (config.label) {
            _domNodes.label = document.createElement(_kLabel.node);
            _domNodes.button.appendChild(_domNodes.label);
            _domNodes.button.classList.add(_kButton.className);
          }
          //Setting wai-aria attributes for buttons and button drop down menu.
          _domNodes.button.setAttribute('role', 'button');
          _domNodes.button.setAttribute('aria-haspopup', true);
          _domNodes.buttonDropdown.setAttribute('aria-haspopup', true);
          _domNodes.buttonDropdown.setAttribute('tabIndex', -1);
          _domNodes.button.setAttribute('tabIndex', -1);

          if (config.action) {
            var buttonStr = config.action + '_aria_spoken_word';
            _domNodes.buttonDropdown.setAttribute('aria-label',
                I18n.getMessage(buttonStr.toLowerCase()));
            _domNodes.button.setAttribute('aria-label', I18n.getMessage(
                buttonStr.toLowerCase()));
          }

          // We listen for click events just on the button, not on the entire
          // buttonDropdown widget
          DomListener.addListener(_domNodes.button, 'click',
              _handleButtonClick);
          DomListener.addListener(_domNodes.buttonDropdown, 'keydown',
              _handleKeyDown);
          DomListener.addListener(_domNodes.buttonDropdown, 'focus',
              focusDropdownBtn_);
          DomListener.addListener(_domNodes.buttonDropdown, 'blur',
              removeFocus_);

          _requestActionToken =
              PubSub.subscribe('qowt:requestAction', _itemChosen);
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
