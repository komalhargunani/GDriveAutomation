
define([
  'qowtRoot/utils/domListener',
  'common/elements/ui/accessibleBehaviors/keyNavigation/upDownKeys',
  'common/elements/ui/selectable-behavior/selectable-behavior',
  'third_party/lo-dash/lo-dash.min'
], function(
  DomListener
  /* UpDownArrowKeyBehavior */
  /* SelectableBehavior */
  /* lo-dash library*/
) {

  window.QowtSubmenu = Polymer({
    is: 'qowt-submenu',
    properties: {
      label: String,
      showArrow: {
        type: Boolean,
        value: false
      },
      focused: {
        type: Boolean,
        value: false,
        notify: true,
        readOnly: true,
        reflectToAttribute: true
      },
      active: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
        observer: 'activeChanged_'
      }
    },

    hostAttributes: {
      'role': 'menuitem',
      'aria-haspopup': 'true',
      'tabindex': -1
    },

    behaviors: [
      UpDownArrowKeyBehavior,
      SelectableBehavior
    ],

    keyBindings: {
      'right': 'onRightKey_',
      'left': 'onLeftKey_',
      'enter': 'onEnter_'
    },

    listeners: {
      'keyboard-shortcut': 'onKeyboardShortcut_'
    },

    ready: function() {
      var _paneHider = this._handleDismiss.bind(this);
      var baseSelector = this.id ? ('#' + this.id) : 'qowt-submenu';
      this.selectable =
          baseSelector + '>div>qowt-item:not([disabled]), ' +
          baseSelector + '>div>qowt-toggle-item:not([disabled]), ' +
          baseSelector + '>div>qowt-submenu:not([disabled]), ' +
          baseSelector + '>div>qowt-sheet-rowcol-item:not([disabled]), ' +
          baseSelector + '>div>qowt-sheet-undo-item:not([disabled]), ' +
          baseSelector + '>div>qowt-slide-hide-item:not([disabled]), ' +
          baseSelector + '>div>qowt-slide-unhide-item:not([disabled]), ' +
          baseSelector + '>div>qowt-duplicate-slide-item:not([disabled])';
      this.focusOnHover = true;
      this.focusItemOnFocusReceived = false;
      this.addEventListener('focus', this.boundFocusBlurHandler_.bind(this));
      this.addEventListener('blur', this.boundFocusBlurHandler_.bind(this));
      DomListener.addListener(document, 'click', _paneHider, true);
    },

    onRightKey_: function(event) {
      if (this.active) {
        // Redirect to currently virtually focused element
        var canceled = this.redirectKey_(event.detail.keyboardEvent);
        if (canceled) {
          event.detail.keyboardEvent.preventDefault();
        } else {
          if (this.showArrow) {
            this.checkNestedSubmenuOnRightKey_();
          } else {
            this.checkPreviousMenu();
            if(this.nextElementSibling &&
              this.nextElementSibling instanceof QowtSubmenu){
              this.focusNextMenu_(this);
            } else {
              var children =
              this.parentElement.querySelectorAll('qowt-submenu');
              this.focusOtherSubmenu_(children[0]);
            }
          }
        }
        event.detail.keyboardEvent.preventDefault();
        event.detail.keyboardEvent.stopPropagation();
      } else if (this.showArrow) {
        this.checkNestedSubmenuOnRightKey_();
        event.detail.keyboardEvent.preventDefault();
        event.detail.keyboardEvent.stopPropagation();
      }
    },

    checkNestedSubmenuOnRightKey_: function() {
      if(this.ariaExpanded === 'true') {
        this.active = false;
        this._setFocused(false);
        var mainMenu = this.parentElement.parentElement;
        if(mainMenu instanceof QowtSubmenu) {
          mainMenu.active = false;
          mainMenu.parentElement._setFocusedItem(null);
          this.focusNextMenu_(mainMenu);
        }
      } else {
        // Submenu is closed and right key pressed causes menu to open.
        this.active = true;
      }
    },

    checkNestedSubmenuOnLeftKey_: function() {
      if(this.ariaExpanded === 'true') {
        // Submenu is open and left key pressed causes menu to close.
        this.active = false;
        this.focus();
      } else {
        var mainMenu = this.parentElement.parentElement;
        if(mainMenu instanceof QowtSubmenu) {
          mainMenu.active = false;
          mainMenu.parentElement._setFocusedItem(null);
          this.focusPrevMenu_(mainMenu);
        }
      }
    },

    focusNextMenu_: function(current) {
      current.nextElementSibling.active = true;
      current.nextElementSibling.focus();
      current.parentElement._setFocusedItem(current.nextElementSibling);
      current.nextElementSibling._setFocused(true);
    },

    focusPrevMenu_: function(current) {
      current.previousElementSibling.active = true;
      current.previousElementSibling.focus();
      current.parentElement._setFocusedItem(current.previousElementSibling);
      current.previousElementSibling._setFocused(true);
    },

    focusOtherSubmenu_: function(otherSubmenu) {
      otherSubmenu.active = true;
      otherSubmenu.focus();
      this.parentElement._setFocusedItem(otherSubmenu);
      otherSubmenu._setFocused(true);
    },

    onLeftKey_: function(event) {
      if (this.active) {
        // Redirect to currently virtually focused element
        var canceled = this.redirectKey_(event.detail.keyboardEvent);
        if (canceled) {
          event.detail.keyboardEvent.preventDefault();
        } else if (this.showArrow) {
          this.checkNestedSubmenuOnLeftKey_();
        } else {
          this.checkPreviousMenu();
          if(this.previousElementSibling &&
            this.previousElementSibling instanceof QowtSubmenu) {
            this.focusPrevMenu_(this);
          } else {
            var children = this.parentElement.querySelectorAll('qowt-submenu');
            this.focusOtherSubmenu_(children[children.length-1]);
          }
        }
        event.detail.keyboardEvent.preventDefault();
        event.detail.keyboardEvent.stopPropagation();
      }
    },

    onKeyboardShortcut_: function(event) {
      if(!this.active) {
        this.checkPreviousMenu();
        this.focus();
        this.parentElement._setFocusedItem(this);
        this.active = true;
        event.preventDefault();
        event.stopPropagation();
      }
    },

    onEnter_: function(event) {
      this.active = this.active ? false : true;
      event.detail.keyboardEvent.preventDefault();
      event.detail.keyboardEvent.stopPropagation();
    },

    checkPreviousMenu: function() {
      var previous =
      this.parentElement.querySelectorAll('qowt-submenu[active]')[0];
      if(previous) {
        previous.active = false;
        previous.classList.remove('focused');
        previous._setFocused(false);
        previous.blur();
      }
    },

    _handleDismiss: function(event) {
      // We dismiss the menu if the user clicked outside of the button.
      if (!(event && event.currentTarget &&
        event.currentTarget.contains(event.relatedTarget))) {
        this.active = false;
        this.classList.remove('focused');
      }
    },

    activeChanged_: function(active) {
      this.$.collapse.style.display = active ? 'block' : 'none';
      this.setAttribute('aria-expanded', active ? 'true' : 'false');
    },

    boundFocusBlurHandler_: function(event) {
      var focused = event.type === 'focus';
      this._setFocused(focused);
    }
  });

  return {};
});
