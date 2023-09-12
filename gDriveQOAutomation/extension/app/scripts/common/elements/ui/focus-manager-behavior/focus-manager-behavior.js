define([
  'common/mixins/ui/cvoxSpeak',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/accessibilityUtils',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/utils/platform'
], function(
  CvoxSpeak,
  PubSub,
  AccessibilityUtils,
  NavigationUtils,
  Platform) {
  'use strict';

  /**
   * `FocusManagerBehavior` implements an accessible container that manages
   *  "virtual" focus for its children.
   */
  window.FocusManagerBehaviorImpl = {
    properties: {
      /**
       * This is a CSS selector string.  If this is set, only items that match
       * the CSS selector are selectable.
       *
       * @attribute selectable
       * @type {string}
       */
      selectable: String,

      focusedPointElement: String,

      /**
       * Returns the currently focused item.
       * @type {?Object}
       */
      focusedItem: {
        observer: 'focusedItemChanged_',
        readOnly: true,
        type: Object
      },

      /**
       * Class to add to focused items
       */
      focusedClass: {
        type: String,
        value: 'focused'
      },

      focusOnHover: {
        type: Boolean,
        value: false
      },

      focusItemOnFocusReceived: {
        type: Boolean,
        value: true
      },

      hasVirtualFocus: {
        type: Boolean,
        value: false
      },

      isMouseNavigation: {
        type: Boolean,
        value: false
      }
    },

    listeners: {
      'focus': 'onFocus_',
      'blur': 'onBlur_',
      'mousedown': 'onMousedown_',
      'keydown': 'onKeyDown_',
      'mousemove': 'onMouseMove_'
    },

    keyBindings: {
      'esc': 'onEscKey_',
      'shift+tab': 'onShiftTabKey_'
    },

    ready: function() {
      PubSub.subscribe('qowt:focusedElementInPoint',
        this.setFocusedElementInPoint.bind(this));
    },

    /**
     * Returns an array of selectable items.
     *
     * @property items
     * @type Array
     */
    get items() {
      return Polymer.dom(this).querySelectorAll(this.selectable || '*');
    },

    /**
     * Returns the index of the given item.
     *
     * @method indexOf
     * @param {Object} item
     * @returns Returns the index of the item
     */
    indexOf: function(item) {
      var index = -1;

      while(item && item !== this) {
        var i = this.items.indexOf(item);
        if (i >= 0) {
          index = i;
          break;
        }
        item = item.parentNode;
      }
      return index;
    },

    focusedItemChanged_: function(focusedItem, old) {
      if(old && focusedItem) {
        this.callBlurItem(old);
        old.blur();
        this.callFocusItem(focusedItem);
        focusedItem.focus();
      } else {
        if (old) {
          this.callBlurItem(old);
          old.blur();
        }
        if (focusedItem) {
          this.callFocusItem(focusedItem);
          if(focusedItem.getAttribute('role') !== 'button') {
            focusedItem.focus();
          }
        }
      }
    },

    callFocusItem: function(focusedItem) {
      focusedItem.classList.add(this.focusedClass);
      PubSub.publish('qowt:itemFocused');
      this.setAttribute('aria-activedescendant', focusedItem.id);
      focusedItem.hasSibling && focusedItem.fire('siblingFocused');

      if(focusedItem.getAttribute('role') === 'menuitem') {
        focusedItem.setAttribute('aria-hidden', false);
      }

      var customFocusEvent = new CustomEvent('focus');
      focusedItem.dispatchEvent(customFocusEvent);
      if (!Platform.isCros) {
        this.speakFocusedItem(focusedItem);
      }
    },

    callBlurItem: function(blurItem) {
      blurItem.classList.remove(this.focusedClass);
      PubSub.publish('qowt:itemBlurred');
      this.removeAttribute('aria-activedescendant');
      blurItem.hasSibling && blurItem.fire('siblingBlurred');

      if(blurItem.getAttribute('role') === 'menuitem') {
        blurItem.setAttribute('aria-hidden', true);
      }

      var customBlurEvent = new CustomEvent('blur');
      blurItem.dispatchEvent(customBlurEvent);
    },

    onMousedown_: function(event) {
      // Mouse click should capture focus
      if (!this.hasVirtualFocus) {
        this.focus();
      }
      // Change focus if the user taps one of the child items
      var idx = this.indexOf(event.target);
      if (idx >= 0) {
        this._setFocusedItem(this.items[idx]);
      } else {
        this._setFocusedItem(null);
      }
    },

    onFocus_: function(/* event */) {
      this.hasVirtualFocus = true;
      if (!this.focusedItem && this.focusItemOnFocusReceived) {
        this._setFocusedItem(this.items[0]);
      }
    },

    onBlur_: function(event) {
      if (!(event && event.currentTarget &&
        event.currentTarget.contains(event.relatedTarget))) {
        if(event && event.currentTarget &&
          (event.currentTarget instanceof QowtSubmenu) &&
          event.relatedTarget &&
          (!NavigationUtils.isTargetWithinMenuBar(event.relatedTarget))) {
          event.currentTarget.parentElement.hasVirtualFocus = false;
          if(event.currentTarget.parentElement._setFocusedItem) {
            event.currentTarget.parentElement._setFocusedItem(null);
          }
        } else {
          this.hasVirtualFocus = false;
          this._setFocusedItem(null);
        }
      }
    },

    onShiftTabKey_: function(event) {
      if(event.detail.keyboardEvent.target.parentElement
        instanceof QowtToolbar) {
          if(document.getElementById('action')
            .getAttribute('aria-disabled') === 'false') {
              setTimeout(function(){
                document.getElementById('action').focus();
              }, 0);
          } else {
            setTimeout(function(){
              document.getElementById('menu-bar').focus();
            }, 0);
          }
        }
      if(event.detail.keyboardEvent.target instanceof QowtSubmenu) {
        document.querySelectorAll('qowt-sharebutton')[0].focus();
        event.preventDefault();
      }
      if(event.detail.keyboardEvent.target instanceof QowtToolbar) {
        if(document.getElementById('action')
          .getAttribute('aria-disabled') === 'false') {
            setTimeout(function(){
              document.getElementById('action').focus();
            }, 0);
        } else {
          setTimeout(function() {
            var menubar = document.getElementById('menu-bar');
            menubar.focus();
            var firstMenu = document.getElementById('menuFile');
            firstMenu.classList.add('focused');
            firstMenu.focus();
            menubar._setFocusedItem(firstMenu);
            event.preventDefault();
          }, 0);
        }
      }
    },

    onEscKey_: function(event) {
      // Redirect to currently virtually focused element
      var canceled = this.redirectKey_(event.detail.keyboardEvent);
      if (!canceled) {
        // esc blurs the control
        if (this === document.activeElement) {
          this.blur();
        } else {
          this.onBlur_();
        }
        var evt = event.detail.keyboardEvent;
        if(evt &&
          (evt.currentTarget instanceof QowtSubmenu) &&
          (NavigationUtils.isTargetWithinMenuBar(evt.currentTarget))) {
            evt.currentTarget.active = false;
            evt.currentTarget.blur();
            if(evt.currentTarget.parentElement._setFocusedItem) {
              evt.currentTarget.parentElement._setFocusedItem(null);
          }
        }
        AccessibilityUtils.setApplicationSpecificFocusedElement(
          this.focusedPointElement);
      }
    },

    setFocusedElementInPoint: function(event, eventData) {
      event = event || {};
      this.focusedPointElement = eventData;
    },

    onKeyDown_: function(event) {
      this.isMouseNavigation = false;
      var handledKeys = Object.keys(this.keyBindings).join(' ');
      if (this.keyboardEventMatchesKeys(event, handledKeys)) {
        return;
      }

      // all other keys should be sent to corresponding item
      var canceled = this.redirectKey_(event);
      if (canceled) {
        event.preventDefault();
      }
    },

    onMouseMove_: function(event) {
      // Change focused item on mouse move
      if (this.focusOnHover && this.hasVirtualFocus) {
        var idx = this.indexOf(event.target);
        if (idx >= 0) {
          this.isMouseNavigation = !!(event.type === 'mousemove');
          var target = this.items[idx];
          this._setFocusedItem(target);
        }
      }
    },

    /**
     * @param {Event} event - Key event
     * @return {boolean} - true if redirection successful, false otherwise
     * @private
     */
    redirectKey_: function(event) {
      if (this.needToCloseDropdown_(event)) {
        if (this.itemsGroup_) {
          this.itemsGroup_.blurAllItems();
        }
        this.active = false;
        if(!(this.parentElement instanceof QowtMenuBar)) {
          PubSub.publish('qowt:dropdownClosedBy:enter', {id: this.id});
        } else {
          if(this._setFocused) {
            this._setFocused(false);
            this.parentElement._setFocusedItem(null);
          }
        }
      }
      return this.focusedItem ?
          !this.focusedItem.dispatchEvent(this.getCustomKeyEvent(event)) :
          false;
    },
    needToCloseDropdown_: function(event) {
      if(event.detail.key === 'enter') {
        return this.isActive && this.isActive() &&
         this.focusedItem &&
         (this.id === 'cmd-border' || this.id === 'cmd-mergeDropdown' ||
          this.id === 'cmd-cellAlign' ||
          this.id === 'cmd-dropdown_initAddShape');
      }
      if(event.key === 'Tab') {
        return event.currentTarget &&
        event.currentTarget instanceof QowtSubmenu;
      }
    },

    focusPrevious_: function() {
      var length = this.items.length;
      var index = this.focusedItem ?
          (Number(this.indexOf(this.focusedItem)) - 1 + length) % length :
          length - 1;
      // Recalculate the index if it is pointing to the nested submenu item.
      if(this.isNavToNestedSubmenu(this.items[index]))
      {
        index = (Number(index - 1)) % length;
      }

      this._setFocusedItem(this.items[index]);
    },

    focusNext_: function() {
      var length = this.items.length;
      var index = this.focusedItem ?
          (Number(this.indexOf(this.focusedItem)) + 1) % length :
          0;
      // Recalculate the index if it is pointing to the nested submenu item.
      if(this.isNavToNestedSubmenu(this.items[index]))
      {
        index = (Number(index + 1)) % length;
      }
      this._setFocusedItem(this.items[index]);
    },

    focusPreviousItemInCol_: function() {
      var length = this.items.length;
      var index = length - 1;
      if (this.focusedItem) {
        index = (this.indexOf(this.focusedItem) - this.noOfCols + length) %
            length;
      }
      this._setFocusedItem(this.items[index]);
    },

    focusNextItemInCol_: function() {
      var index = 0;
      if (this.focusedItem) {
        index = this.indexOf(this.focusedItem) + this.noOfCols;
        if (index > this.items.length - 1) {
          index %= this.noOfCols;
        }
      }
      this._setFocusedItem(this.items[index]);
    },

    /**
     * Checks whether the Navigation is from Menu bar items to nested submenu .
     *
     * @method isNavToNestedSubmenu
     * @param {Object} item
     * @return {boolean} true in case of navigation from menu bar item to
     * the nested submenu, false otherwise.
     */
    isNavToNestedSubmenu: function(item) {
      return (item instanceof QowtSubmenu &&
          item.parentNode instanceof QowtSubmenu &&
          this.focusedItem instanceof QowtSubmenu);
    },

    getCustomKeyEvent: function(event) {
      function mapArrowKeyNames(keyName) {
        var name;
        switch (keyName) {
          case 'arrowup':
            name = 'up';
            break;
          case 'arrowdown':
            name = 'down';
            break;
          case 'arrowleft':
            name = 'left';
            break;
          case 'arrowright':
            name = 'right';
            break;
          default :
            name = keyName;
        }
        return name;
      }

      return new CustomEvent('keydown', {
        cancelable: true,
        detail: {
          // NOTE(elqursh): The key would come from the detail if the
          // event we captured was a CustomEvent, otherwise it comes from
          // the keyIdentifier for regular key down events.
          key: event.detail.key ||
              mapArrowKeyNames(event.key.toLowerCase()) ||
              event.keyIdentifier.toLowerCase()
        }
      });
    }
  };

  window.FocusManagerBehavior = [
    Polymer.IronA11yKeysBehavior,
    CvoxSpeak,
    window.FocusManagerBehaviorImpl
  ];

  return {};
});
