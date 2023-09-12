define([
  'common/elements/ui/accessibleBehaviors/keyNavigation/leftRightKeys',
  'common/elements/ui/accessibleBehaviors/keyNavigation/selectionKeys',
  'common/elements/ui/selectable-behavior/selectable-behavior'
  ], function(
    /* LeftRightArrowKeyBehavior */
    /* SelectionKeyBehavior */
    /* SelectableBehavior */
  ) {

  'use strict';

  /**
   * `MenubarBehavior` implements accessible menubar behavior.
   */
  window.MenubarBehaviorImpl = {
    hostAttributes: {
      'role': 'menubar',
      'tabindex': '0'
    },

    listeners: {
      'keyboard-shortcut': 'onKeyboardShortcut_'
    },

    onKeyboardShortcut_: function(event) {
      if (!event.defaultPrevented) {
        var idx = this.indexOf(event.target);
        if (idx >= 0) {
          this.focus();
          var target = this.items[idx];
          this._setSelectedItem(target);
          this._setFocusedItem(target);
        }
      }
    },

    toggleFocusedItem_: function(/*event*/) {
      if (this.selectedItem !== this.focusedItem) {
        this._setSelectedItem(this.focusedItem);
      } else {
        this._setSelectedItem(null);
      }
    },

    /**
     * If there is an item/ element selected(i.e. opened) on menubar then, on
     * shift of the focus, the selection follows, meaning the focused item is
     * selected(or opened). This function ensures the same
     * @private
     */
    setSelected_: function() {
      if (this.selectedItem) {
        this._setSelectedItem(this.focusedItem);
      }
    }
  };

  window.MenubarBehavior = [
    LeftRightArrowKeyBehavior,
    SelectionKeyBehavior,
    SelectableBehavior,
    window.MenubarBehaviorImpl
  ];

  return {};
});
