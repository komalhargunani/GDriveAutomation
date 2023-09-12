// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The autocomplete menu widget encapsulates the part of the HTML
 * DOM representing a menu with a list of suggestions that can be selected
 * either by clicking or by using the keyboard.
 * It is currently used in Sheet to display text suggestions when typing
 * in the inline editor widget.
 * It extends the Menu Base widget.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/widgets/ui/menuBase'
], function(
    WidgetFactory,
    ArrayUtils,
    PubSub,
    DomListener,
    MenuBase) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'AutocompleteMenu Widget Factory',

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
      if (config && config.type && config.type === 'autocompleteMenu') {
        score = 100;
      }
      return score;
    },

    /**
     * Creates a new instance of an autocomplete menu widget.
     * @param config {object}      Autocomplete menu configuration
     * @param config.type {string} Defines this as an autocomplete menu widget
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        /**
         * _kClassNameMouseMode is needed to handle situations where a user
         * switches between mouse and keyboard selection. If the mouse is
         * hovering on a menu item the suggestion will be highlighted. In the
         * moment the user presses a up/down key another menu item will become
         * highlighted and we need to remove the highlight due to mouse hover,
         * even if the mouse is still hovering on a menu item.
         * @private
         */
        var _kClassNameMouseMode = 'qowt-menu-mouse-mode';

        /**
         * A map of the html elements making up our menu item.
         * @private
         */
        var _domNodes = {};

        /**
         * Aa array of the visible menu item widgets.
         * @private
         */
        var _visibleMenuItems = [];

        var _eventX, _eventY,
            _suggestions = [],
            _selectedMenuItem;

        /**
         * Ensure we have a single handler function instance. Avoids defects
         * where a new instance of the function is bound
         * each time addListeners is called.
         * @private
         */
        var _paneHider = _handleDismiss.bind(this);

        /**
         * Keys that the menu is interested in.
         * @private
         */
        var _kTabKeyCode = 9,
            _kEnterKeyCode = 13,
            _kEscapeKeyCode = 27,
            _kPageUpKeyCode = 33,
            _kPageDownKeyCode = 34,
            _kEndKeyCode = 35,
            _kHomeKeyCode = 36,
            _kArrowUpKeyCode = 38,
            _kArrowDownKeyCode = 40;

        // Extend menu base
        var _api = MenuBase.create(config);

        _api.name = 'AutocompleteMenu Widget Instance';

        /**
         * Sets the menu items in the autocomplete menu
         * @param suggestions {Array} array of strings
         */
        _api.updateMenuItems = function(suggestions) {
          _suggestions = suggestions;
          _deselectItemChoice();
          _selectedMenuItem = undefined;
          _toggleMouseMode(false);
          _visibleMenuItems = _api.updateMenuItemsBase(suggestions);
        };

        /**
         * Shows the autocomplete menu.
         * Starts listening for the events this menu is interested in.
         */
        _api.show = function() {
          if (!_api.isMenuActive()) {
            _addListeners();
            // Call showBase() in Menu Base
            _api.showBase();
          }
        };

        /**
         * Hides the autocomplete menu. Stops listening for the events.
         */
        _api.hide = function() {
          if (_api.isMenuActive()) {
            _deselectItemChoice();
            _selectedMenuItem = undefined;
            _toggleMouseMode(false);
            _removeListeners();
            // Call hideBase() in Menu Base
            _api.hideBase();
            _api.setMaxWidth('none');
          }
        };

        /**
         * Resets the autocomplete menu.
         * Removes all the menu items previously created.
         */
        _api.reset = function() {
          _api.hide();
          _api.removeAllMenuItems();
          _suggestions = [];
          _visibleMenuItems = [];
        };

        /**
         * @private
         * Dismisses the menu.
         */
        function _handleDismiss() {
          _api.hide();
        }

        /**
         * @private
         * Adds the event listeners. Called when showing the menu.
         */
        function _addListeners() {
          // Listen for keyup and keydown events (set the 'useCapture' param to
          // true to catch these events before the SheetTextTool does)
          DomListener.add(config.type, document, 'keyup', _onKeyUp, true);
          DomListener.add(config.type, document, 'keydown', _onKeyDown, true);

          // Listen for click events anywhere in the document as these
          // should close the open menu
          DomListener.add(config.type, document, 'click', _paneHider);

          // Listen for mouseover events. These are needed to handle situations
          // when using at the same time mouse and keyboard selection
          DomListener.add(config.type, _domNodes.menu,
              'mouseover', _onMouseOver);
        }

        /**
         * @private
         * Removes the event listeners. Called when hiding the menu.
         */
        function _removeListeners() {
          DomListener.removeGroup(config.type);
        }

        /**
         * @private
         * Resets the previous menu item choice deselecting the menu item.
         */
        function _deselectItemChoice() {
          if (_visibleMenuItems[_selectedMenuItem]) {
            _visibleMenuItems[_selectedMenuItem].toggleSelectedItem(false);
          }
        }

        /**
         * @private
         * Handles key down events.
         */
        function _onKeyDown(event) {
          switch (event.keyCode) {
            case _kArrowUpKeyCode:
              event.preventDefault();
              _moveSelectionUp();
              break;
            case _kArrowDownKeyCode:
              event.preventDefault();
              _moveSelectionDown();
              break;
            case _kHomeKeyCode:
            case _kPageUpKeyCode:
              event.preventDefault();
              _moveSelectionFirst();
              break;
            case _kEndKeyCode:
            case _kPageDownKeyCode:
              event.preventDefault();
              _moveSelectionLast();
              break;
          }
        }

        /**
         * @private
         * Handles key up events.
         */
        function _onKeyUp(event) {
          switch (event.keyCode) {
            case _kEnterKeyCode:
            case _kTabKeyCode:
              if (_selectedMenuItem !== undefined) {
                // When a menu item is selected we stop the event propagation
                // to make sure that the Sheet Text Tool does not receive
                // key events so it doesn't commit the edit.
                // We want to control when the commit is done, ie we want to
                // commit after the text has been injected in the inline editor
                if (event.stopPropagation) {
                  event.stopPropagation();
                }
                PubSub.publish('qowt:requestAction', {
                  'action': config.action,
                  'context': {
                    value: _suggestions[_selectedMenuItem],
                    commitEvent: event
                  }
                });
              }
              _api.hide();
              break;
            case _kEscapeKeyCode:
              _api.hide();
              break;
          }
        }

        /**
         * @private
         * Handles mouse over events.
         */
        function _onMouseOver(event) {
          // When scrolling the menu using the keys, mouseover events are fired
          // even if the mouse didn't move, so we want to ignore these events.
          // So we check event.x and event.y against cached values.
          if (event.x !== _eventX || event.y !== _eventY) {
            _eventX = event.x;
            _eventY = event.y;
            // Enables the hover styles
            _toggleMouseMode(true);
            // When selecting with the mouse we need to deselect the menu item
            // selected using the keyboard
            _deselectItemChoice();
            _selectedMenuItem = undefined;
          }
        }

        /**
         * @private
         * Selects a menu item below in the menu. When we reach the last
         * item of the menu it selects the first item, in a circular fashion.
         */
        function _moveSelectionDown() {
          // Removing this class we disable the hover styles. This is needed to
          // handle when we start moving menu selection using the keyboard
          // and the mouse is still hovering on a menu item
          _toggleMouseMode(false);
          _deselectItemChoice();
          if (_visibleMenuItems.length > 0) {
            if (_selectedMenuItem === undefined) {
              _selectedMenuItem = 0;
            }
            else {
              _selectedMenuItem += 1;
              _selectedMenuItem = _selectedMenuItem % _visibleMenuItems.length;
            }
            _highlightSelectedItem();
          }
        }

        /**
         * @private
         * Selects a menu item above in the menu. When we reach the first
         * item of the menu it selects the last item, in a circular fashion.
         */
        function _moveSelectionUp() {
          _toggleMouseMode(false);
          _deselectItemChoice();
          if (_visibleMenuItems.length > 0) {
            if (_selectedMenuItem === undefined || _selectedMenuItem === 0) {
              _selectedMenuItem = _visibleMenuItems.length - 1;
            }
            else {
              _selectedMenuItem -= 1;
            }
            _highlightSelectedItem();
          }
        }

        /**
         * @private
         * Selects the first menu item of the menu.
         */
        function _moveSelectionFirst() {
          _toggleMouseMode(false);
          _deselectItemChoice();
          if (_visibleMenuItems.length > 0) {
            _selectedMenuItem = 0;
            _highlightSelectedItem();
          }
        }

        /**
         * @private
         * Selects the last menu item of the menu.
         */
        function _moveSelectionLast() {
          _toggleMouseMode(false);
          _deselectItemChoice();
          if (_visibleMenuItems.length > 0) {
            _selectedMenuItem = _visibleMenuItems.length - 1;
            _highlightSelectedItem();
          }
        }

        /**
         * @private
         * Highlights and scrolls into view the selected menu item.
         */
        function _highlightSelectedItem() {
          _visibleMenuItems[_selectedMenuItem].toggleSelectedItem(true);
          _visibleMenuItems[_selectedMenuItem].getNode().scrollIntoView(false);
        }

        /**
         * @private
         * Enables or disable mouse mode.
         * @param isMouseMode {boolean} true to enable mouse mode, false or
         *                              undefined to disable it
         */
        function _toggleMouseMode(isMouseMode) {
          if (isMouseMode) {
            _domNodes.menu.classList.add(_kClassNameMouseMode);
          }
          else {
            _domNodes.menu.classList.remove(_kClassNameMouseMode);
          }
        }

        var _init = function() {
          _domNodes.menu = _api.getElement();
          _domNodes.menu.id = 'qowt-autocomplete-menu';
          _domNodes.menu.classList.add('qowt-contextmenu');
          PubSub.subscribe('qowt:zoomChanged', _api.onResize);
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
