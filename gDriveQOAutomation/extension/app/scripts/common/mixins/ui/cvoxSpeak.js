/**
 * @fileoverview A helper class for verbalization of aria-labels using chromevox
 * api. This will contain the api(s) which can be used for verbalization
 * purpose.
 *
 * Note: Once chromevox supports verbalization inside shadow dom. This must be
 * removed.
 *
 */
define([
  'common/mixins/ui/colorNameUtil',
  'qowtRoot/utils/i18n'
], function(
   ColorNameUtil,
   I18n) {

  'use strict';

  return {

    /**
     * This is a map representing the labels against the keycodes for the keys
     * used in shortcut. The labels will be used to get the internationalized
     * message to be read out.
     */
    SHORTCUT_KEY_LABELS_: {
      'CTRL': 'control_key',
      'CMD': 'command_key',
      'ALT': (window.__polymer_core_platform_info.isOsx) ? 'option_key':
          'alt_key',
      'SHIFT': 'shift_key'
    },

    /**
     * Identifies the text to be read to the user for the focused element eg.
     * aria-label, shortcut etc and speaks using chromevox-api.
     *
     * @param {DOM node} focusedItem - Currently focused item
     * @private
     */
    speakFocusedItem: function(focusedItem) {
      if (focusedItem) {
        var role = focusedItem.getAttribute('role');
        var actsAs = focusedItem.getAttribute('actsAs');
        if (role === 'menu' || role === 'menuitem') {
          this.speakMenuItem_(focusedItem);
        } else if (role === 'listbox' || role === 'button' &&
            actsAs === 'dropdown') {
          this.speakDropdownNameAndState(focusedItem);
        } else {
          var textToSpeak = this.prepareFocusedBtnText_(focusedItem);
          this.speakText(textToSpeak);
        }
      }
    },


    /**
     * Speaks the label and other information for menu items.
     * @param focusedItem - Currently focused item
     * @private
     */
    speakMenuItem_: function(focusedItem) {
      if (focusedItem.classList.contains('topLevel')) {
        this.speakTopLevelMenu_(focusedItem);
      } else {
        this.speakSubMenu_(focusedItem);
      }
    },


    /**
     * Speaks the label and other information for top level menu item.
     * @param focusedItem - Currently focused item
     * @private
     */
    speakTopLevelMenu_: function(focusedItem) {
      var ariaLabel = focusedItem.getAttribute('aria-label');
      var textToSpeak = focusedItem.active ?
                        I18n.getMessage('expanded_menu', [ariaLabel]) :
                        I18n.getMessage('collapsed_menu', [ariaLabel]);
      this.speakText(textToSpeak);
    },


    /**
     * Speaks the label and other information for sub menu items.
     * @param focusedItem - Currently focused item
     * @private
     */
    speakSubMenu_: function(focusedItem) {
      var ariaLabel = focusedItem.getAttribute('aria-label');

      var rightPointer = focusedItem.showArrow ?
                         I18n.getMessage('right_pointed_submenu') : '';

      var siblings = focusedItem.parentNode.
          querySelectorAll(':scope > [role="menuitem"], [role="menu"]');
      var menuIndex = [].indexOf.call(siblings, focusedItem) + 1;
      var positionText = I18n.getMessage('menu_item_numbering',
          [menuIndex, siblings.length]);

      var textToSpeak = I18n.getMessage('submenu_spoken_text',
          [ariaLabel, rightPointer, positionText]);
      this.speakText(textToSpeak);
    },


    /**
     * Transforms the shortcut label to sensible text that can be read out to
     * user. eg replaces 'Cmd' with 'Command'
     * @param keycombo - String representing the shortcut eg. 'Cmd+Shift+R'
     * @returns {string} - Transformed string eg. 'Command+Shift+R'.
     * @private
     */
    transformShortcutLabel_: function(keycombo) {
      var revisedLabel = '';
      if (keycombo) {
        var keys = keycombo.split('+');
        keys.forEach(function(key) {
          var label;
          var keyLabel = this.SHORTCUT_KEY_LABELS_[key.toUpperCase()];
          label = keyLabel ? I18n.getMessage(keyLabel) : key;
          revisedLabel += label + '+';
        }, this);
      }
      return revisedLabel.slice(0, -1);
    },

    /**
     * Speaks dropdown aria-label & its state depending upon whether dropdown
     * is opened or closed. State could be expanded if open & collapsed if
     * closed. And also reads out the selected item if present/visible in
     * dropdown head when dropdown is collapsed.
     *
     * @param {DOM node} focusedItem - currently focused item
     */
    speakDropdownNameAndState: function(focusedItem) {
      var ariaLabel = focusedItem.getAttribute('aria-label');
      var ariaExpanded = focusedItem.getAttribute('aria-expanded');
      // TODO(Upasana):Replace below with 'aria-expanded' for every dropdown
      var isDropdownOpened = focusedItem.classList.
          contains('qowt-menu-active') || ariaExpanded === 'true';
      var state = isDropdownOpened ? 'expanded' : 'collapsed';
      var textToSpeak = ariaLabel + ' ' + I18n.getMessage(state);

      // Adding selected item text of dropdown (if visible) and 'selected' state
      // to text to speak when dropdown is focused and collapsed.
      if (!isDropdownOpened && focusedItem.querySelector('button')) {
        var selectedText = focusedItem.querySelector('button').textContent;
        if (selectedText) {
          textToSpeak = textToSpeak + ' ' + selectedText + ' ' +
              I18n.getMessage('selected');
        }
      }

      this.speakText(textToSpeak);
    },

    /**
     * Speaks dropdown item with their information when item gets focus.
     * Syntax to speak -
     * "focused item aria-label + role + state of the item + Position of item"
     *
     * For eg., In font style dropdown when focus is in 'Heading 1' item then
     * it will speak-
     * 'Heading 1 + menu-item + Not selected + 2 of 6'
     * Where,
     * - Heading 1 is the aria-label of focused item.
     * - menu-item is the role of focused item.
     * - 'Not selected' is the state of the focused item. It means the focused
     *   item is not the selected item of the dropdown. The selected item is
     *   the item which is in label of dropdown.
     * - '2 of 6' is the position of the item in list which 2 in list of 6
     *   items.
     *
     * @param {DOM node} focusedItem - currently focused item
     * @param {Boolean} role - If true, it will fetch 'role' attribute for
     *    focused item and speak aria role. If false, it will not speak the
     *    'role'.
     * @param {Boolean} selectedState - True for 'Selected' & False for
     *     'Not selected'
     * @param {Number} position - position of the focused item in list
     * @param {Number} listLength - total items in list
     * @private
     */
    speakFocusedDropdownItem: function(focusedItem, role, selectedState,
                                       position, listLength) {
      if (focusedItem) {
        var textToSpeak = this.prepareTextForFocusedDropdownItem_(focusedItem,
            role, selectedState, position, listLength);
        this.speakText(textToSpeak);
      }
    },

    /**
     * Speaks the dropdown name & its role when dropdown is opened. And if
     * that dropdown has any label then it speaks the label & its
     * information.
     * Syntax to speak-
     * "focused dropdown name + role + label (if any) + selected state +
     * position in list "
     *
     * For e.g., for Font Style dropdown whose label is 'Heading 1" then it
     * will speak on opening-
     * "Font Style dropdown menu list box Heading 1 selected 2 of 6'
     * where
     * - 'Font Style dropdown menu' is aria-label of focused drop down.
     * - 'list box' is role.
     * - 'Heading 1' is the label i.e. selected item in list.
     * - 'selected' is the state of the label item.
     * - 2 is the position of 'Heading 1' in the list of length 6.
     *
     * @param {DOM node} focusedItem - currently opened dropdown
     * @param {Boolean} role - If true, it will fetch 'role' attribute for
     *    opened dropdown and speak aria role. If false, it will not speak the
     *    'role'.
     * @param {String} label - Optional, dropdown label
     * @param {Boolean} selectedState - Optional, true if 'Selected' & false
     *     if 'Not selected'.
     * @param {Number} position - Optional, position of the focused item in list
     * @param {Number} listLength - Optional, total items in list
     * @private
     */
    speakDropdownWhenOpened: function(focusedItem, role, label, selectedState,
                                      position, listLength) {
      if (focusedItem) {
        var textToSpeak = this.prepareTextForDropdownWhenOpened_(focusedItem,
            role, label, selectedState, position, listLength);
        this.speakText(textToSpeak);
      }
    },

    speakLabelForElement: function(elem, role) {
      this.speakText(this.prepareTextWithAriaLabelAndRole_(elem, role));
    },

    /**
     * @param {DOM node} focusedItem - currently focused item node
     * @param {Boolean} role - If true, it will fetch 'role' attribute for
     *    focused item and speak aria role. If false, it will not speak the
     *    'role'.
     * @return {String} - returns text string composed of focused item's
     *     aria-label & its role.
     * @private
     */
    prepareTextWithAriaLabelAndRole_: function(focusedItem, role) {
      var text = focusedItem.getAttribute('aria-label');
      if (role) {
        text = text + ' ' + focusedItem.getAttribute('role');
      }
      return text;
    },

    /**
     * @param {String} textToSpeak - existing text to speak for focused item.
     * @param {Boolean} selectedState - Optional, true if 'Selected' & false
     *     if 'Not selected'.
     * @param {Number} position - Optional, position of the focused item in list
     * @param {Number} listLength - Optional, total items in list
     * @return {string} - returns text string composed of focused item's
     *     selectedState & its position in the list .
     * @private
     */
    prepareTextWithStateAndPosition_: function(textToSpeak, selectedState,
                                               position, listLength) {

      var selectedText = selectedState ? 'selected' : 'notselected';
      textToSpeak = textToSpeak + ' ' + I18n.getMessage(selectedText);

      /* In QO app, sometimes the dropdown label shows the option which is not
       * in the list. For instance if we open a file which has some text of font
       * size '16' then in this case the font size dropdown label will show 16
       * however in list the '16' option does not appear. In this case
       * verbalizing the position is futile. Hence this check is needed.
       */
      if (position > 0 && listLength > 0) {
        textToSpeak = textToSpeak + ' ' + position + ' of ' + listLength;
      }
      return textToSpeak;
    },

    /**
     * Prepares text to speak for the dropdown when opened using given
     * parameters.
     *
     * @param {DOM node} focusedItem - currently opened dropdown
     * @param {Boolean} role - If true, it will fetch 'role' attribute for
     *    opened dropdown and speak aria role. If false, it will not speak the
     *    'role'.
     * @param {String} label - Optional, dropdown label
     * @param {Boolean} selectedState - Optional, true if 'Selected' & false
     *     if 'Not selected'.
     * @param {Number} position - Optional, position of the focused item in list
     * @param {Number} listLength - Optional, total items in list
     * @return {String} - text to speak via cvox api
     * @private
     */
    prepareTextForDropdownWhenOpened_: function(focusedItem, role, label,
                                                selectedState, position,
                                                listLength) {
      var textToSpeak =
          this.prepareTextWithAriaLabelAndRole_(focusedItem, role);
      // Adding expanded state in text to be spoken
      textToSpeak = textToSpeak + ' ' + I18n.getMessage('expanded');

      if (label) {
        textToSpeak = textToSpeak + ' ' + label;
        textToSpeak = this.prepareTextWithStateAndPosition_(textToSpeak,
            selectedState, position, listLength);
      }
      return textToSpeak;
    },

    /**
     * Prepares text to speak for the focused dropdown item.
     *
     * @param {DOM node} focusedItem - currently focused dropdown item
     * @param {Boolean} role - If true, it will fetch 'role' attribute for
     *    focused item and speak aria role. If false, it will not speak the
     *    'role'.
     * @param {Boolean} selectedState - True for 'Selected' & False for
     *     'Not selected'
     * @param {Number} position - position of the focused item in list
     * @param {Number} listLength - total items in list
     * @return {String} - text to speak via cvox api
     * @private
     */
    prepareTextForFocusedDropdownItem_: function(focusedItem, role,
                                                 selectedState, position,
                                                 listLength) {
      var textToSpeak =
          this.prepareTextWithAriaLabelAndRole_(focusedItem, role);
      textToSpeak = this.prepareTextWithStateAndPosition_(textToSpeak,
          selectedState, position, listLength);
      return textToSpeak;
    },

    /**
     * Speaks currently focused color item name & its selected state.
     * @param {DOM Node} colorItem - currently focused color swatch item
     */
    speakColorDropdownFocusedItem: function(colorItem) {
      if (colorItem) {
        // var textToSpeak = this.prepareTextForFocusedColorItem_(colorItem);
        // this.speakText(textToSpeak);
      }
    },

    /**
     * Speaks currently focused shape item name, submenu & its position in list.
     * @param {DOM Node} item - currently focused shape item. one of - Shapes,
     *     Arrows, Callouts or Equation
     * @param {Object} hasRightPointer - submenu right pointer arrow
     * @param {number} pos - position of item in list
     * @param {number} len - length of list
     */
    speakShapeDropdownFocusedItem: function(item, hasRightPointer, pos, len) {
      if (item) {
        var textToSpeak = this.prepareTextWithAriaLabelAndRole_(item, false);
        var rightPointer = hasRightPointer ?
            I18n.getMessage('right_pointed_submenu') : '';

        var positionText = I18n.getMessage('menu_item_numbering', [pos, len]);
        textToSpeak = textToSpeak + rightPointer + positionText;

        this.speakText(textToSpeak);
      }
    },

    speakShapeSubMenuItem: function(item) {

      var textToSpeak = this.prepareTextWithAriaLabelAndRole_(item, false);
      var selectedState = item.getAttribute('aria-selected') === 'true' ?
          'selected' : 'notselected';
      textToSpeak = textToSpeak + ' ' + I18n.getMessage(selectedState);
      this.speakText(textToSpeak);
    },

    /**
     * Prepares text to speak for the currently focused color swatch item.
     * Example - 'color name + selected state(either Selected or Not Selected)'
     *
     * @param {DOM Node} colorItem - currently focused color swatch item
     * @return {String} textToSpeak - Prepared text to speak for the focused
     *     color item
     * @private
     */
    prepareTextForFocusedColorItem_: function(colorItem) {
      var color = colorItem.getColor();
      var selectedState = colorItem.isSelected() ? 'selected' : 'notselected';
      var colorName = ColorNameUtil.getColorName(color);
      colorName = 'color_' + colorName.toLowerCase();
      var textToSpeak =
          I18n.getMessage(colorName) + ' ' + I18n.getMessage(selectedState);
      return textToSpeak;
    },

    /**
     * Speaks provided text via cvox.
     * @param {String} text - text to speak
     */
    speakText: function(text) {
      var cvox = window.cvox;
      if (cvox && text) {
        // cvox.Api.speak(text, 0);
      }
    },

    /**
     * Prepares focused button text to speak. This text consists of button's
     * aria-label + shortcut key + button state(pressed or notPressed).
     *
     * @param {DOM Node} focusedItem - focused button
     * @return {string} text to speak
     * @private
     */
    prepareFocusedBtnText_: function(focusedItem) {
      var ariaLabel = focusedItem.getAttribute('aria-label');
      var btnStateText = this.getButtonStateText_(focusedItem);
      if (btnStateText) {
        btnStateText = I18n.getMessage(btnStateText);
        ariaLabel += ' ' + btnStateText;
      }
      return ariaLabel;
    },

    /**
     * Gets the text for state of focused button. For toggle buttons it will
     * return either pressed or not pressed otherwise will return empty string.
     * @param {DOM Node} focusedItem - focused button
     * @return {string} - toggle button state either pressed or not pressed.
     *     And empty string for non-toggle buttons.
     * @private
     */
    getButtonStateText_: function(focusedItem) {
      var pressed = 'pressed';
      var notPressed = 'not_pressed';
      var stateOfBtn;

      var isPolymerToggleButton = this.isPolymerToggleButton_(focusedItem);

      if (isPolymerToggleButton) {
        stateOfBtn = focusedItem.isActive() ? pressed : notPressed;
      } else {
        // This is for non-polymer buttons where we do not have any way to know
        // which button is a toggle button. Hence, need to check their
        // 'aria-pressed' attribute. 'aria-pressed' attribute do not applies to
        // non-toggle buttons & hence returns null when queried.
        var btnState = focusedItem.getAttribute('aria-pressed');
        stateOfBtn = (btnState === 'true') ? pressed :
            (btnState === 'false') ? notPressed : '';
      }
      return stateOfBtn;
    },

    /**
     * @param {DOM Node} focusedItem - focused button
     * @return {Boolean} - true if focused item is a polymer toggle button.
     * @private
     */
    isPolymerToggleButton_: function(focusedItem) {
      return focusedItem.isToggleButton ? focusedItem.isToggleButton() : false;
    }

  };
});
