define([
    'common/elements/ui/focus-manager-behavior/focus-manager-behavior'
  ], function(
    /* FocusManagerBehavior */
  ) {

  'use strict';

  /**
   * `SelectableBehavior` implements a selectable list.
   */
  window.SelectableBehaviorImpl = {
    properties: {
      selectedItem: {
        type: Object,
        readOnly: true,
        notify: true,
        observer: 'onSelectedItemChanged_'
      },

      selectionFollowsFocus: {
        type: Boolean,
        value: false
      }
    },

    listeners: {
      'tap': 'onTap_'
    },


    /**
     * Selects the previous item.
     *
     * @method selectPrevious
     */
    selectPrevious: function() {
      var length = this.items.length;
      var index =
          (Number(this.indexOf(this.selectedItem)) - 1 + length) % length;
      this._setSelectedItem(this.items[index]);
    },

    /**
     * Selects the next item.
     *
     * @method selectNext
     */
    selectNext: function() {
      var index =
          (Number(this.indexOf(this.selectedItem)) + 1) % this.items.length;
      this._setSelectedItem(this.items[index]);
    },

    onBlur_: function(/* event */) {
      window.FocusManagerBehaviorImpl.onBlur_.apply(this, arguments);
      // Deselect menus
      this._setSelectedItem(null);
    },

    onTap_: function(event) {
      if (!event.defaultPrevented) {
        var idx = this.indexOf(event.target);
        if ( idx >= 0 ) {
          var target = this.items[idx];
          // Toggle selected item
          if (this.selectedItem === target) {
            this._setSelectedItem(null);
          } else {
            this._setSelectedItem(target);
          }
          event.preventDefault();
        }
      }
    },

    onSelectedItemChanged_: function(current, previous) {
      // Unselect previous item along with it's children if any.
      if (this.isNavInMenuBar(current, previous) ||
          this.selectedNonSubmenuItem(current, previous)) {
          _.forEach(Polymer.dom(previous).children, function (submenuItem) {
              submenuItem.active = false;
          });
          previous.active = false;
      }

      if (this.isNestedSubmenuOpen(previous)) {
        // When nested submenu is open and clicked anywhere in the document or
        // selected other submenu, we need to close the parent submenu as well.
        previous.parentNode.active = false;
      }

      if (current && current.active !== undefined) {
        current.active = true;
        this.speakFocusedItem(current);
      }
    },

    focusedItemChanged_: function(current, previous) {
      window.FocusManagerBehaviorImpl.focusedItemChanged_.apply(
          this, arguments);
      if (this.selectionFollowsFocus && this.selectedItem) {
        this._setSelectedItem(this.focusedItem);
      }
      if (current instanceof QowtSubmenu && current.showArrow &&
          this.isMouseNavigation) {
        this._setSelectedItem(this.focusedItem);
      } else if (previous instanceof QowtSubmenu && previous.showArrow &&
          this.isMouseNavigation) {
        this._setSelectedItem(null);
      }
    },

    /**
     * Checks for navigation in menu bar
     *
     * @method isNavInMenuBar
     * @param {Object} current currently selected item
     * @param {Object} previous previously selected item
     * @return {boolean} true if navigation in menu bar items, false otherwise.
     */
    isNavInMenuBar: function(current, previous) {
      // Check both prev and current are menu bar items.
      return (previous && current !== previous && previous.active !== undefined
          && (current && !(current.parentNode instanceof
          QowtSubmenu)));
    },

    /**
     * Checks for navigation from menu bar item to non submenu item.
     *
     * @method selectedNonSubmenuItem
     * @param {Object} current currently selected item
     * @param {Object} previous previously selected item
     * @return {boolean} true if non submenu item is selected,false otherwise.
     */
    selectedNonSubmenuItem: function(current, previous) {
      return (previous && previous.active !== undefined && current === null);
    },

    /**
     * Checks if nested submenus are open.
     *
     * @method isNestedSubmenuOpen
     * @param {Object} previous previously selected item
     * @return {boolean} true if nested submenus are open,false otherwise.
     */
    isNestedSubmenuOpen: function(previous) {
      return (previous instanceof QowtSubmenu && (previous &&
          (previous.parentNode instanceof QowtSubmenu)));
    }
  };

  window.SelectableBehavior = [
    FocusManagerBehavior,
    window.SelectableBehaviorImpl
  ];

  return {};
});
