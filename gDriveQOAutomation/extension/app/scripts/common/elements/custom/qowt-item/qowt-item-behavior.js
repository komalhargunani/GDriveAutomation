define([
    'qowtRoot/messageBus/messageBus',
    'common/elements/ui/menuBar/qowt-menu-bar/qowt-menu-bar-configs',
    'qowtRoot/utils/navigationUtils',
    'qowtRoot/utils/typeUtils',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/models/env'
  ], function(
    MessageBus,
    Configs,
    NavigationUtils,
    TypeUtils,
    PubSub,
    Env
  ) {

  'use strict';

  var QowtItemBehaviorImpl = {
    properties: {
      enableOn: String,
      disableOn: String
    },

    listeners: {
      'keyboard-shortcut': 'onKeyboardShortcut_',
      'mousemove': 'onMouseMove_'
    },

    keyBindings: {
      // NOTE(elqursh): Here we modify the enter handler to additionally handle
      // the event.
      'enter:keydown': 'onEnterKey_'
    },

    /**
     * The config describing the action of this item. Read dynamically from
     * the Configs dependancy.
     *
     * @private
     * @type Object
     * @default undefined
     */
    config_: undefined,

    created: function() {
      this.enableListener = this.enableHandler.bind(this, false);
      this.disableListener = this.enableHandler.bind(this, true);
      this.tokens = {};
    },


    ready: function() {
      if (this.disableOn) {
        this.tokens.disable =
            PubSub.subscribe(this.disableOn, this.disableListener);
      }
      if (this.enableOn) {
        this.tokens.enable =
            PubSub.subscribe(this.enableOn, this.enableListener);
      }

      // Used for unsubscribing events during testing.
      this.tokens.destroy =
          PubSub.subscribe('qowt:destroy', this.destroy_.bind(this));
      // Read config to avoid inlining a json attribute and using json.parse.
      // Also keeps the html menu declarations more maintainable and readable.
      this.config_ = Configs[this.getAttribute('configId')];
    },


    detached: function() {
      this.unsubscribeAll_();
    },

    onMouseMove_: function(event) {
      if (this.parentElement && this.parentElement.parentElement &&
        this.parentElement.parentElement.onMouseMove_) {
        this.parentElement.parentElement.hasVirtualFocus = true;
        this.parentElement.parentElement.onMouseMove_(event);
      }
    },


    /** @return {Object} Config object describing the action of this item. */
    get config() {
      // return a pristine copy of the config to avoid downstream pollution.
      return _.cloneDeep(this.config_);
    },


    /** @param {Boolean} makeDisabled Sets the menu item disabled state. */
    enableHandler: function(makeDisabled) {
      this.disabled = makeDisabled;
    },

    /** @override */
    _tapHandler: function(event) {
      if (!this.disabled) {
        Polymer.IronButtonStateImpl._tapHandler.apply(this, arguments);
        this.triggerAction_(event);
      }
      if(event.detail.keyboardEvent) {
        if(this.id === 'menuitemRedo' || this.id === 'menuitemUndo') {
          var menubar = NavigationUtils.getMenubar(this);
          if(menubar.focusedItem) {
            menubar.focusedItem.active = false;
          }
          if(this.parentElement.parentElement instanceof QowtSubmenu) {
            this.parentElement.parentElement.active = false;
          }
          menubar._setFocusedItem(null);
        }
        event.detail.keyboardEvent.preventDefault();
        event.detail.keyboardEvent.stopPropagation();
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    onEnterKey_: function(event) {
      event.detail.keyboardEvent.preventDefault();
      this._tapHandler(event);
    },

    /** @param {Event} evt The keyboard shortcut event for this element. */
    onKeyboardShortcut_: function(event) {
      // disable undo & redo action when modal dialog is opened.
      if (!this.disabled && !document.querySelector('dialog')) {
        Polymer.IronButtonStateImpl._tapHandler.apply(this, arguments);
        this.triggerAction_(event);
      }
      event.preventDefault();
      event.stopPropagation();
    },

    triggerAction_: function(event) {
      if (TypeUtils.isFunction(this.onActivate)) {
        // The activated item may have pre-flight code. This must run before the
        // decision to request or do action.
        this.onActivate();
      }

      var config = this.config;
      if (config) {
        if (Env.embedded && event.type !=='keyboard-shortcut' &&
         this.isNotAllowedMenuItem_(event)) {
          PubSub.publish('qowt:iframed:copyCutPasteNotAllowed');
        } else {
          var action = (config && config.context &&
            config.context.contentType) ? 'qowt:doAction' :
            'qowt:requestAction';
          PubSub.publish(action, config);

          // Record usage of shortcut key versus menuitem access.
          MessageBus.pushMessage({
            id: 'recordEvent',
            category: event.type === 'keyboard-shortcut' ? event.type : 'menu',
            action: config.action});
        }
      }
      // TODO(elqursh): Find a cleaner way to loose focus.
      var activeItem = document.activeElement;
      if ((this.isMenuItem_() && event.type !== 'keyboard-shortcut') ||
        (NavigationUtils.isTargetWithinMainToolbar(activeItem) &&
        event.type !== 'keyboard-shortcut' && (event.type !== 'keydown'))) {
          if(NavigationUtils.isTargetWithinMenuBar(activeItem)) {
            this.setMenubarFocusAppropriately(activeItem);
          }
          activeItem.blur();
      } else if((NavigationUtils.isTargetWithinMenuBar(activeItem))) {
        this.setMenubarFocusAppropriately(activeItem);
        activeItem.blur();
      } else if(this.id === 'menuitemPaste' ||
        this.isMergeMenuItem()) {
        this.setMenubarFocusAppropriately(this);
      }
    },

    setMenubarFocusAppropriately: function(activeItem) {
      var menubar = NavigationUtils.getMenubar(activeItem);
      if(menubar && menubar.focusedItem) {
        this.closeInnerSubmenu(menubar);
        menubar.focusedItem.active = false;
      }
      menubar._setFocusedItem(null);
    },

    closeInnerSubmenu: function(menubar) {
      var submenu = menubar.focusedItem.querySelectorAll('qowt-submenu');
      for(var i=0; i < submenu.length; i++) {
        if(submenu[i].active) {
          submenu[i].active = false;
        }
      }
    },

    isMergeMenuItem: function() {
      var mergeMenuIds = ['menuitemMergeAll', 'menuitemMergeVertically',
      'menuitemMergeHorizontally', 'menuitemUnmerge'];
      return _.includes(mergeMenuIds, this.id);
    },

    isMenuItem_: function() {
      var menuIds = ['menuitemBold', 'menuitemItalic', 'menuitemUnderline',
      'menuitemStrikethrough', 'menuitemAlignLeft', 'menuitemAlignCenter',
      'menuitemAlignRight', 'menuitemAlignJustified', 'menuitemHideSlide',
      'menuitemUnhideSlide', 'menuitemMoveSlideUp', 'menuitemMoveSlideDown',
      'menuitemMoveSlideTop', 'menuitemMoveSlideBottom',
      'menuitemInsertTextBox', 'menuitemPrint'];
      return _.includes(menuIds, this.id);
    },

    isNotAllowedMenuItem_: function(event) {
      var currentTarget = event.currentTarget ||
        (event.detail && event.detail.keyboardEvent &&
           event.detail.keyboardEvent.currentTarget);
      var itemId;
      if (currentTarget) {
        itemId = currentTarget.id;
      }
      return "menuitemCut,menuitemCopy,menuitemPaste".indexOf(itemId) > -1;
    },

    /** @private */
    destroy_: function() {
      this.unsubscribeAll_();
    },


    /** @private */
    unsubscribeAll_: function() {
      for (var token in this.tokens) {
        PubSub.unsubscribe(this.tokens[token]);
      }
    }
  };

  window.QowtItemBehavior = [
    Polymer.IronButtonState,
    Polymer.IronControlState,
    QowtItemBehaviorImpl
  ];

  return {};
});

