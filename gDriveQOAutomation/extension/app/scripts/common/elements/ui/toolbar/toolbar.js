define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/navigationUtils',
  'common/elements/ui/focus-manager-behavior/focus-manager-behavior',
  'common/elements/ui/accessibleBehaviors/keyNavigation/leftRightKeys',
  'common/elements/ui/accessibleBehaviors/keyNavigation/selectionKeys',
], function(
    PubSub,
    NavigationUtils
    /* FocusManagerBehavior */
    /* LeftRightArrowKeyBehavior */
    /* SelectionKeyBehavior */) {

  'use strict';

  window.QowtToolbar = Polymer({
    is: 'qowt-toolbar',

    hostAttributes: {
      'role': 'toolbar',
      'tabindex': '0'
    },

    behaviors: [
      FocusManagerBehavior,
      SelectionKeyBehavior,
      LeftRightArrowKeyBehavior
    ],

    ready: function() {
      this.focusedClass = 'focused-button';

      // Configure the toolbar to consider only non-spacers as items
      this.selectable = 'qowt-toolbar>[role=listbox]:not([disabled]),' +
          'qowt-toolbar>[role=button]:not([disabled]),' +
          'qowt-justify-button-group>[role=button]:not([disabled])';
      this.focusOnHover = false;
      this.selectionFollowsFocus = false;
      PubSub.subscribe('qowt:undoEmpty', this.focusUndoRedo_.bind(this));
      PubSub.subscribe('qowt:redoEmpty', this.focusUndoRedo_.bind(this));
      PubSub.subscribe('qowt:dropdownClosedBy:enter',
        this.focusDropdown_.bind(this));
      PubSub.subscribe('qowt:zoomInEmpty', this.focusZoom_.bind(this));
      PubSub.subscribe('qowt:zoomOutEmpty', this.focusZoom_.bind(this));
      this.addEventListener('focusout', this.loseFocus_.bind(this));
    },

    focusZoom_: function() {
      var toolbar = this;
      function getZoomButton() {
        var zoomButton;
        for (var i = 0; i < toolbar.items.length && !zoomButton; i++) {
          var id = toolbar.items[i].id;
          if (id === 'cmd-zoomIn' || id === 'cmd-zoomOut') {
            zoomButton = toolbar.items[i];
          }
        }
        return zoomButton;
      }
      var activeElement = document.activeElement;
      setTimeout(function() {
        if (NavigationUtils.zoomInOutUsingTBButton(activeElement)) {
          setTimeout(function() {
            toolbar._setFocusedItem(getZoomButton());
          }, 0);
        }
      }, 0);

    },

    focusDropdown_: function(event, eventData) {
      event = event || {};
      var toolbar = this;
      function getDropdown() {
        var dropdown;
        for (var i = 0; i < toolbar.items.length && !dropdown; i++) {
          var id = toolbar.items[i].id;
          if (id === eventData.id) {
            dropdown = toolbar.items[i];
          }
        }
        return dropdown;
      }
      setTimeout(function() {
        var dropdown = getDropdown();
        toolbar._setFocusedItem(null);
        toolbar._setFocusedItem(dropdown);
        dropdown.focus();
      }, 0);
    },
    focusUndoRedo_: function() {
      var toolbar = this;
      function getUndoButton() {
        var undoRedoButton;
        for (var i = 0; i < toolbar.items.length && !undoRedoButton; i++) {
          var id = toolbar.items[i].id;
          if (id === 'cmd-undo' || id === 'cmd-redo') {
            undoRedoButton = toolbar.items[i];
          }
        }
        return undoRedoButton;
      }
      var activeElement = document.activeElement;
      if (NavigationUtils.undoRedoUsingTBButton(activeElement)) {
        PubSub.publish('qowt:focus-undo-redo', {focusUndoRedoFlag: true});
        setTimeout(function() {
          toolbar._setFocusedItem(getUndoButton());
          PubSub.publish('qowt:focus-undo-redo', {focusUndoRedoFlag: false});
        }, 0);
      }
    },

    toggleFocusedItem_: function(event) {
      if (this.focusedItem && _.isFunction(this.focusedItem.toggleActive_)) {
        this.focusedItem.toggleActive_(event);
      }
      this.speakFocusedItem(this.focusedItem);
    },

    blurToolbar: function() {
      this._setFocusedItem(null);
      this.blur();

    },

    loseFocus_: function(event) {
      if(event.relatedTarget &&
        (event.relatedTarget.id === 'zoomable' ||
        event.relatedTarget instanceof QowtMainToolbar ||
        event.relatedTarget instanceof QowtPointShape ||
        event.relatedTarget instanceof QowtPointThumbnail ||
        event.relatedTarget.getAttribute('qowt-divtype') === 'textBox')) {
        this.hasVirtualFocus = false;
        this._setFocusedItem(null);
      }
    },
  });

  return {};
});

