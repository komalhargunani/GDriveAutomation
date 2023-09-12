// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The color dropdown widget encapsulates the part of the HTML
 * DOM representing a button with a clickable down-arrow icon.
 * It is a top level widget used for the different color picker instances.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

// DuSk TODO: It actually turns out this module shared 90% identical code
// with buttonDropdown.js. We need to remove this duplicate.

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/accessibilityUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/ui/colorPane',
  'qowtRoot/widgets/ui/menuItem',
  'qowtRoot/widgets/ui/spacer',
  'qowtRoot/utils/converters/converter',
  'common/mixins/ui/colorNameUtil',
  'qowtRoot/utils/i18n',
  'common/mixins/ui/cvoxSpeak'], function(
  WidgetFactory,
  ArrayUtils,
  DomListener,
  AccessibilityUtils,
  PubSub,
  ColorPane,
  MenuItem,
  SpacerWidget,
  Converter,
  ColorNameUtil,
  I18n,
  CvoxSpeak) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Color Dropdown Widget Factory',

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
     * @param {object} config Configuration object, consists of:
     *        config.fromNode {HTML Element} Determine if this widget can be
     *                                       constructed given this as a base
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
      if (config.supportedActions &&
            !ArrayUtils.subset(
              config.supportedActions,
              _factory.supportedActions)) {
        return 0;
      }
      var score = 0;
      // Now check that the config node matches
      if (config && config.type && config.type === 'colorDropdown') {
        score = 100;
      }
      return score;
    },

    /**
     * Creates a new instance of a color dropdown widget.
     * @param {object} config The configuration for this dropdown.
     * @param {string} config.type Defines this as a button dropdown widget.
     * @param {string} config.label The localised text label for the menu item.
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        /**
         * Configs for our constituent html elements.
         * @private
         */
        var _kColorDropdown = {
              className: 'qowt-button-dropdown',
              classNameActive: 'qowt-menu-active',
              node: 'div'
            },
            _kColorButton = {
              className: 'qowt-button-color',
              classNameFocus: 'focused-button',
              node: 'button'
            },
            _kColorIndicator = {
              node: 'span'
            };

        /**
         * We subscribe to request actions so we can update the UI of the
         * color picker.
         * @private
         */
        var _kAction_TextColor = 'textColor',
            _kAction_shapeFillColor = 'modifyShapeFillColor',
            _kAction_shapeOutlineColor = 'modifyShapeOutlineColor',
            _kAction_BackgroundColor = 'backgroundColor',
            _kAction_HighlightColor = 'highlightColor',
            _kAction_NoHighlightColor = 'noHighlightColor',
            _kAction_FillColor = 'fillColor';

        /**
         * Ensure we have a single handler function instance.
         * Avoids defects where a new instance of the function is bound
         * each time addListeners is called.
         * @private
         */
        var _paneHider = _handleDismiss.bake(this);

        /**
         * A map of the html elements making up our color dropdown.
         * @private
         */
        var _domNodes = {};

        /**
         * State (enabled/disabled) of color dropdown button.
         * @private
         */
        var dropDownButtonState_ = false;
        var _dropdownOpenedUsingKey = false;

        /**
         * A map of the color item widget making up our color dropdown.
         * @private
         */
        var _colorSwatches = {};
        var _colorSwatchesKeys = [];
        var swatchSelectedRow_ = -1;
        var swatchSelectedColumn_ = -1;
        var maxColumns_ = 10;
        var selectedColorPaneRow_ = -1;
        var noneColorMenuItem_;
        var focusedSwatch;
        var focusedPointElement = null;

        /**
         * PubSub subscriptions.
         * @private
         */
        var _subs = {};
        var _paneWidget,
            _menuActive,
            _requestActionToken;

        var _api = {

          name: 'Color Dropdown Widget Instance',

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * @param {Node} parentNode The container node to attach to.
           */
          appendTo: function(parentNode) {
            parentNode.appendChild(_domNodes.colorDropdown);

            // The menu pane needs info from the render tree
            // so can only be initialised once this container is appended.
            if (!_paneWidget) {
              _initColorPane(config.items);
            }
          },

          /**
           * Update the selected color in the grid and the color indicator
           * in the button.
           *
           * @param {string} option New value to be shown in the button.
           */
          setSelectedItem: function(option) {
            var hexColor;

            _resetPreviousColorChoice();

            if (option && option !== 'auto' && option !== 'NONE') {
              _domNodes.label.style.backgroundColor = option;

              hexColor = Converter.colorString2hex(option);

              if (hexColor) {
                hexColor = hexColor.toUpperCase();

                if (_colorSwatches[hexColor]) {
                  var colorSwatch = _colorSwatches[hexColor];
                  colorSwatch.selected = true;
                  _domNodes.selectedColorItem = colorSwatch;
                }
              }
            }
            else {
              _domNodes.label.style.backgroundColor = '';
            }
          },

          /**
           * Returns the selected color.
           */
          getSelectedItemColor: function() {
            return _domNodes.label.style.backgroundColor;
          },

          /**
           * Set all the items within a color picker in one sweep.
           * @param {array} items String array of items to set in the color
           * picker.
           */
          setItems: function(items) {
            var widget;
            items.forEach(function(item) {
              if (item.type === 'spacer') {
                widget = SpacerWidget.create(item);
              }
              else if (item.type === 'menuItem') {
                widget = MenuItem.create({
                  stringId: item.stringId,
                  action: item.action,
                  context: item.contentType || item.context,
                  iconClass: item.iconClass,
                  onSelect: item.onSelect});
                noneColorMenuItem_ = widget;
              }
              else {
                widget = new QowtColorSwatch();
                widget.rgb = item;
                widget.action = config.action;
                var colorName = ColorNameUtil.getColorName(widget.getColor());
                colorName = 'color_' + colorName.toLowerCase();
                widget.firstElementChild
                .setAttribute('aria-label', I18n.getMessage(colorName));

                if (config.transformFunction) {
                  widget.transformFunction = config.transformFunction;
                }
                // TODO(jliebrand): once the color dropdown itself
                // is a polymer element, then this formattingProp can
                // be handled declaratively.
                widget.formattingProp = config.formattingProp;

                _colorSwatches[item] = widget;
                _colorSwatchesKeys.push(item);
              }
              _paneWidget.addItem(widget);
            });
          },

          /**
           * Gets all menu items within a menu pane.
           *
           * @return {object} menu items of a menu pane
           */
          getItems: function() {
            return _colorSwatches;
          },

          getFocusedSwatch: function() {
            return focusedSwatch;
          },

          setFocusedSwatch: function(swatch) {
            focusedSwatch = swatch;
          },

          /**
           * Set this button to be enabled or disabled.
           *
           * @param {Boolean=} opt_state Optional opt_state value
           * Enable if true, disable if false.
           */
          setEnabled: function(opt_state) {
            dropDownButtonState_ = (opt_state === undefined) ?
                true :
                !!opt_state;
            _domNodes.colorButton.disabled = !dropDownButtonState_;
            if (dropDownButtonState_) {
              _domNodes.colorDropdown.removeAttribute('disabled');
            } else {
              _domNodes.colorDropdown.setAttribute('disabled','');
            }

          },

          /**
           * Query if the menu item is enabled or not.
           *
           * @return {boolean} true if the menu item is enabled, else false.
           */
          isEnabled: function() {
            return dropDownButtonState_;
          },

          /**
           * Invoked during testing to clean up event subscriptions.
           */
          destroy: function() {
            PubSub.unsubscribe(_requestActionToken);
          },

          /** Get menu item within a button bar.
           * @param {String} id - id of HTML element
           * @return {Object} Returns button item of a menu pane.
           */
          getMenuPaneItem: function(id) {
            return _paneWidget.getMenuItemNode(id);
          },


          /**
           * @returns {Boolean} - true, if dropdown menu is opened
           */
          isMenuOpened: function() {
            return _menuActive;
          },

          getFocusedCell: function() {
            return {
              colorPaneRow: selectedColorPaneRow_,
              gridRow: swatchSelectedRow_,
              gridCol: swatchSelectedColumn_
            };
          },

          isFirstCellSelected: function() {
            return selectedColorPaneRow_ === 1 &&
                _api.isFirstRowCellFocused() &&
                _api.isFirstColumnCellFocused();
          },

          isLastCellFocused: function() {
            return selectedColorPaneRow_ === 1 &&
                _api.isLastRowCellFocused() &&
                _api.isLastColumnCellFocused();
          },

          isLastColumnCellFocused: function() {
            return swatchSelectedColumn_ === maxColumns_ - 1 ||
                (swatchSelectedRow_ === getTotalRows_() - 1 &&
                    (swatchSelectedColumn_ ===
                        (_colorSwatchesKeys.length % maxColumns_) - 1));
          },

          isFirstColumnCellFocused: function() {
            return swatchSelectedColumn_ === 0;
          },

          isLastRowCellFocused: function() {
            return selectedColorPaneRow_ === 1 &&
                swatchSelectedRow_ === getTotalRows_() - 1;
          },

          isFirstRowCellFocused: function() {
            return swatchSelectedRow_ === 0;
          },

          isNoneColorButtonFocused: function () {
            return (noneColorMenuItem_ && selectedColorPaneRow_ === 0);
          },

          getButtonNode: function() {
            return _domNodes.colorButton;
          }
        };

        /**
         * @private
         * Shows the dropdown menu.
         */
        function _showMenu() {
          if (!_menuActive) {
            _subs.dismiss =
                PubSub.subscribe('qowt:selectionChanged', _hideMenu);
            _domNodes.colorButton.setAttribute('aria-expanded', true);
            _addListeners();
            swatchSelectedRow_ = -1;
            swatchSelectedColumn_ = -1;
            selectedColorPaneRow_ = -1;
            _paneWidget.show();
            _menuActive = true;
            _domNodes.colorDropdown.classList.add(
                _kColorDropdown.classNameActive);
            CvoxSpeak.speakDropdownNameAndState(_domNodes.colorDropdown);
          }
        }

        /**
         * @private
         * Hides the dropdown menu.
         */
        function _hideMenu() {
          if (_menuActive) {
            PubSub.unsubscribe(_subs.dismiss);
            _domNodes.colorButton.setAttribute('aria-expanded', false);
            _removeListeners();
            _paneWidget.hide();
            _menuActive = false;
            _dropdownOpenedUsingKey = false;
            _domNodes.colorDropdown.classList.remove(
                _kColorDropdown.classNameActive);
            _domNodes.colorDropdown.removeAttribute('consumeLeftRightKeys');
            var swatch = getSwatch();
            if (swatch) {
              swatch.removeFocus();
            }
            if (noneColorMenuItem_) {
              noneColorMenuItem_.removeFocus();
            }
            // CvoxSpeak.speakDropdownNameAndState(_domNodes.colorDropdown);
          }
        }

        /**
         * @private
         * Implements the button dropdown behaviour when actioned.
         * @param {object} event The W3C event received.
         */
        function _handleButtonClick(/* event */) {
          if (_menuActive) {
            _hideMenu();
            PubSub.publish('qowt:buttonbar:focus', _domNodes.colorButton);
          }
          else {
            PubSub.publish('qowt:buttonbar:focus', _domNodes.colorButton);
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
              return elm === _domNodes.colorButton || elm === _domNodes.label;
            }));
          }
          if (clickedOutside) {
            _hideMenu();
            AccessibilityUtils.setApplicationSpecificFocusedElement(
              focusedPointElement);
          } else {
            _domNodes.colorDropdown.focus();
          }
        }

        function setFocusedElementInPoint(event, eventData) {
          event = event || {};
          focusedPointElement = eventData;
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
         * Handle a color choice that can be generated by a click on a color
         * item or on a "no color" or "automatic" menu item.
         */
        function _handleColorChoice(eventType, eventData) {
          eventType = eventType || '';
          // compare the event action with the action of the color dropdown
          // and with the action on the 'no color" menu item
          if (eventData && (eventData.action === config.action ||
              eventData.action === config.items[0].action)) {
            switch (eventData.action) {
              // TODO(davidshimel): Polymerize the entire color picker to avoid
              // this switch statement.
              case _kAction_TextColor:
                _api.setSelectedItem(eventData.context.formatting.clr);
                break;
              case _kAction_HighlightColor:
                _api.setSelectedItem(eventData.context.formatting.hgl);
                break;
              case _kAction_NoHighlightColor:
                _api.setSelectedItem();
                break;
              case _kAction_FillColor:
                _api.setSelectedItem(
                  eventData.context.formatting.fill.color.clr);
                break;
              case _kAction_shapeFillColor:
                _api.setSelectedItem(eventData.context.formatting.fillClr);
                break;
              case _kAction_shapeOutlineColor:
                var outlineColor = eventData.context.formatting.ln.fill.color;
                var colorValue = outlineColor && outlineColor.clr;
                _api.setSelectedItem(colorValue);
                break;
              case _kAction_BackgroundColor:
                _api.setSelectedItem(eventData.context.formatting.bg);
                break;
              default:
                console.warn('Cannnot handle color choice for action: ' +
                  eventData.action);
                break;
            }
          }
        }

        /**
         * @private
         * Reset the previous color choice deselecting the color item.
         */
        function _resetPreviousColorChoice() {
          if (_domNodes.selectedColorItem) {
            _domNodes.selectedColorItem.selected = false;
          }
        }

        /**
         * Focuses color drop down button, if button id matches.
         * @param evt - event
         * @param evtData - event data
         * @private
         */
        function focusDropdownBtn_(/* event */) {
          var colorBtn = _domNodes.colorButton;
          var colorDropDown = _domNodes.colorDropdown;
          colorDropDown.classList.add('dropdown-button-focused');
          colorBtn.classList.add(_kColorButton.classNameFocus);
        }

        /**
         * Removes focus from color drop down button and will close the dropdown
         * if opened.
         * @param evt - event
         * @param evtData - eventData
         * @private
         */
        function removeFocus_(event) {
          if (_menuActive) {
            if(!(event.relatedTarget &&
              event.currentTarget.contains(event.relatedTarget))) {
                _hideMenu();
              }
          }

          var colorBtn = _domNodes.colorButton;
          var colorDropDown = _domNodes.colorDropdown;
          if (colorBtn.classList.contains(_kColorButton.classNameFocus)) {
            colorDropDown.classList.remove('dropdown-button-focused');
            colorBtn.classList.remove(_kColorButton.classNameFocus);
          }
        }

        /**
         * Handles respective action on focused button when enter key is
         * pressed.
         * - In this case, dropdown will be opened if closed and vice-versa.
         * @param evt - event
         * @param evtData - event data
         * @private
         */
        function handleActionOnFocusedBtn_(event) {
          if (!_menuActive && (event.detail.key === 'enter'
              || event.detail.key === 'down' || event.detail.key === 'up')) {
            _handleButtonClick();
            event.preventDefault();
          } else if (_menuActive && event.detail.key !== 'enter') {
            _handleKeyDown(event);
          } else if (_menuActive && event.detail.key === 'enter'){
            selectColor(event);
            if (_dropdownOpenedUsingKey) {
              _domNodes.colorDropdown.focus();
            }
            _hideMenu();
            event.preventDefault();
          }
        }

        function _handleKeyDown(event) {
          var action = event.detail.key;
          var oldSwatch = getSwatch();
          switch (action) {
            case 'right':
              if (anyColorDropdownItemFocused()) {
                if (!_api.isNoneColorButtonFocused()) {
                  if (_api.isLastColumnCellFocused()) {
                    swatchSelectedColumn_ = 0;
                    if (_api.isLastRowCellFocused()) {
                      swatchSelectedRow_ = 0;
                    } else {
                      swatchSelectedRow_++;
                    }
                  } else {
                    swatchSelectedColumn_++;
                  }
                  event.preventDefault();
                }
                PubSub.publish('qowt:colordropdown:done');
              }
              break;
            case 'left':
              if (anyColorDropdownItemFocused()) {
                if (!_api.isNoneColorButtonFocused()) {
                  if (_api.isFirstColumnCellFocused()) {
                    swatchSelectedColumn_ = maxColumns_ - 1;
                    if (_api.isFirstRowCellFocused()) {
                      swatchSelectedRow_ = getTotalRows_() - 1;
                      var remainder = (_colorSwatchesKeys.length % maxColumns_);
                      if (remainder !== 0) {
                        swatchSelectedColumn_ = remainder - 1;
                      }
                    } else {
                      swatchSelectedRow_--;
                    }
                  } else {
                    swatchSelectedColumn_--;
                  }
                  event.preventDefault();
                }
                PubSub.publish('qowt:colordropdown:done');
              }

              break;
            case 'down':
              if (noneColorMenuItem_ && !anyColorDropdownItemFocused()) {
                focusNoneColorButton_();
              } else if (selectedColorPaneRow_ <= 0 &&
                  swatchSelectedRow_ === -1) {
                swatchSelectedRow_ = 0;
                selectedColorPaneRow_ = 1;
                if (swatchSelectedColumn_ === -1) {
                  swatchSelectedColumn_ = 0;
                }

                if (noneColorMenuItem_) {
                  noneColorMenuItem_.removeFocus();
                }
              } else if (_api.isLastRowCellFocused()) {
                if (noneColorMenuItem_) {
                  focusNoneColorButton_();
                  swatchSelectedRow_ = -1;
                } else {
                  swatchSelectedRow_ = 0;
                }

              } else if (!indexOutOfBound(swatchSelectedRow_ + 1,
                  swatchSelectedColumn_)) {
                swatchSelectedRow_++;
              }
              if (!_api.isNoneColorButtonFocused()) {
                _domNodes.colorDropdown.setAttribute('consumeLeftRightKeys',
                    true);
              }
              event.preventDefault();
              PubSub.publish('qowt:colordropdown:done');
              break;
            case 'up':
              if (_api.isNoneColorButtonFocused()) {
                swatchSelectedRow_ = getTotalRows_() - 1;
                if (indexOutOfBound(swatchSelectedRow_,
                    swatchSelectedColumn_)) {
                  swatchSelectedRow_--;
                }
                noneColorMenuItem_.removeFocus();
                selectedColorPaneRow_ = 1;
                if (swatchSelectedColumn_ === -1) {
                  swatchSelectedColumn_ = 0;
                }

              } else if (swatchSelectedColumn_ === -1 &&
                  swatchSelectedRow_ === -1) {
                swatchSelectedRow_ = 0;
                swatchSelectedColumn_ = 0;
                selectedColorPaneRow_ = 1;
              } else if (_api.isFirstRowCellFocused()) {
                if (noneColorMenuItem_) {
                  focusNoneColorButton_();
                  swatchSelectedRow_ = -1;
                } else {
                  swatchSelectedRow_ = getTotalRows_() - 1;
                  if (indexOutOfBound(swatchSelectedRow_,
                      swatchSelectedColumn_)) {
                    swatchSelectedRow_--;
                  }
                }

              } else {
                swatchSelectedRow_--;
              }
              if (!_api.isNoneColorButtonFocused()) {
                _domNodes.colorDropdown.setAttribute('consumeLeftRightKeys',
                    true);
              }
              event.preventDefault();
              PubSub.publish('qowt:colordropdown:done');
              break;
          }
          var swatch = getSwatch();
          if (oldSwatch) {
            oldSwatch.removeFocus();
          }
          if (swatch) {
            swatch.addFocus();
            _api.setFocusedSwatch(swatch);
            //CvoxSpeak.speakColorDropdownFocusedItem(swatch);
          } else if (_api.isNoneColorButtonFocused()) {
            var noneColorText = noneColorMenuItem_.getNode().textContent;
            CvoxSpeak.speakText(noneColorText);
          }
        }

        function getTotalRows_() {
          return Math.ceil(_colorSwatchesKeys.length / maxColumns_);
        }

        function getSwatch() {
          var key = _colorSwatchesKeys[swatchSelectedRow_ * maxColumns_ +
              swatchSelectedColumn_];
          return _colorSwatches[key];
        }

        function anyColorDropdownItemFocused() {
          return (swatchSelectedRow_ !== -1 &&
              swatchSelectedColumn_ !== -1) ||
              _api.isNoneColorButtonFocused();
        }

        function indexOutOfBound(selectedRow, selectedColumn) {
          return (selectedRow * maxColumns_ + selectedColumn) >=
              _colorSwatchesKeys.length;
        }

        function focusNoneColorButton_() {
          noneColorMenuItem_.focus();
          selectedColorPaneRow_ = 0;
          _domNodes.colorDropdown.removeAttribute('consumeLeftRightKeys');
        }
        function selectColor(event) {
          if (_api.isNoneColorButtonFocused()) {
            noneColorMenuItem_.select();
          } else {
            var swatch = getSwatch();
            if (swatch) {
              swatch.select(event);
            }
          }
          _dropdownOpenedUsingKey = true;
        }

        /**
         * @private
         * Construct the color picker container and the necessary color
         * widgets.
         */
        function _initColorPane() {
          _paneWidget = ColorPane.create();
          _paneWidget.setPosition(
              _domNodes.colorDropdown.offsetLeft,
              _domNodes.colorDropdown.offsetHeight);

          _paneWidget.appendTo(_domNodes.colorDropdown);

          if (config.items) {
            _api.setItems(config.items);
          }
          // Setting default color button drop down state as collapsed.
          _domNodes.colorButton.setAttribute('aria-expanded', false);
        }

        /**
         * Initialise this colorDropdown widget.
         * @private
         */
        function _init() {
          // Create our main container
          _domNodes.colorDropdown =
            document.createElement(_kColorDropdown.node);
          _domNodes.colorDropdown.classList.add(_kColorDropdown.className);
          _domNodes.colorDropdown.setAttribute('role', 'listbox');

          // TODO(upasana): Adding class name 'qowt-main-toolbar' here to
          // enable styles from mainToolbar polymer element to apply when
          // in shady dom mode. Remove once all elements are polymerized.
          _domNodes.colorDropdown.classList.add('qowt-main-toolbar');

          // Create the button element
          _domNodes.colorButton = document.createElement(_kColorButton.node);
          _domNodes.colorDropdown.appendChild(_domNodes.colorButton);
          if (config.action) {
            _domNodes.colorButton.id = 'cmd-' + config.action;
          }

          // Create a label for this control
          _domNodes.label = document.createElement(_kColorIndicator.node);
          _domNodes.colorButton.appendChild(_domNodes.label);
          _domNodes.colorButton.classList.add(_kColorButton.className);

          // TODO(upasana): Adding class name 'qowt-main-toolbar' here to
          // enable styles from mainToolbar polymer element to apply when
          // in shady dom mode. Remove once all elements are polymerized.
          _domNodes.colorButton.classList.add('qowt-main-toolbar');


          PubSub.subscribe('qowt:focusedElementInPoint',
            setFocusedElementInPoint);


          //Setting wai-aria attributes to color button
          _domNodes.colorButton.setAttribute('role', 'menuButton');
          if (config.action) {
            var buttonStr = config.action + '_aria_spoken_word';
            _domNodes.colorDropdown.setAttribute('aria-label',
                I18n.getMessage(buttonStr.toLowerCase()));
            _domNodes.colorButton.setAttribute('aria-label',
                I18n.getMessage(buttonStr.toLowerCase()));
          }
          _domNodes.colorButton.setAttribute('aria-haspopup', true);
          _domNodes.colorDropdown.setAttribute('aria-haspopup', true);
          _domNodes.colorDropdown.setAttribute('tabIndex', -1);
          _domNodes.colorButton.setAttribute('tabIndex', -1);

          // We listen for click events just on the button, not on the entire
          // colorDropdown widget
          DomListener.addListener(_domNodes.colorButton, 'click',
              _handleButtonClick);
          DomListener.addListener(_domNodes.colorDropdown, 'keydown',
              handleActionOnFocusedBtn_);
          DomListener.addListener(_domNodes.colorDropdown, 'focus',
              focusDropdownBtn_);
          DomListener.addListener(_domNodes.colorDropdown, 'blur',
              removeFocus_);

          _requestActionToken =
              PubSub.subscribe('qowt:requestAction', _handleColorChoice);
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
