/**
 * @fileoverview API for the qowt-keyboard-shortcuts-dialog element.
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/elements/ui/modalDialog/modalDialog'
  ], function(
    MixinUtils,
    QowtElement) {

  'use strict';

  /**
   *  The symbols representing keys in the shortcut information shown to user.
   */
  var SHORTCUT_SYMBOLS = (window.__polymer_core_platform_info.isOsx) ? {
    // Support policy of OSX showing modfiers as glyphs rather than strings.
    CTRL: 'Ctrl+',
    CMD: '\u2318+',
    ALT: 'Option+',
    SHIFT: 'Shift+',
    '#9': '\u21E5', /* tab */
    '#13': '\u23CE',
    '#33': '\u21DE', /* page up */
    '#34': '\u21DF', /* page down */
    '#35': '\u21F2', /* end */
    '#36': '\u21F1', /* home */
    '#37': '\u21E0',
    '#38': '\u21E1',
    '#39': '\u21E2',
    '#40': '\u21E3',
    '#191': '\u002F'} : {

    // For non OSX platforms policy is to use string-based shortcut labels.
    CTRL: 'Ctrl+',
    CMD: 'Cmd+',
    ALT: 'Alt+',
    SHIFT: 'Shift+',
    '#9': 'TAB',
    '#13': 'RETURN',
    '#33': 'PAGEUP',
    '#34': 'PAGEDOWN',
    '#35': 'END',
    '#36': 'HOME',
    '#37': '\u21E0',
    '#38': '\u21E1',
    '#39': '\u21E2',
    '#40': '\u21E3',
    '#191': '\u002F'};

  var keyboardShortcutsDialogProto_ = {
    is: 'qowt-keyboard-shortcuts-dialog',
    extends: 'dialog',

    properties: {
      /**
       * Contains a list of all the core-keyboard-shortcuts on the page.
       * Separated into groups so that the group name acts as a key to an array
       * of info about each shortcut.
       * @type {Object.<String, Array.<{label: String, keys: String}>}
       * @public
       */
      shortcuts: {
        type: Object,
        value: function() { return {}; }
      }
    },

    behaviors: [
      QowtModalDialogBehavior
    ],

    attached: function() {
      var toolbar = document.querySelector('qowt-main-toolbar');
      var shortcuts = [];
      if (toolbar) {
        shortcuts = toolbar.getElements('core-keyboard-shortcut');
      }

      // Iterate over each core-keyboard-shortcut element to find out if it has
      // enough information to include in the table.
      var computed = {};
      for (var i = 0; i < shortcuts.length; i++) {
        var shortcut = shortcuts[i];

        // The parent contains the group and label of the shortcut, so first
        // check if we have a parent and then find those values.
        var parent = shortcut.parentElement;
        if (parent && parent.nodeName === 'DIV') {
          parent = parent.parentElement;
        }
        if (parent) {
          var group = parent.group || parent.getAttribute('group');
          var label = parent.label || parent.getAttribute('label');
          var keys = shortcut.platformShortcut_ &&
                     this.getShortcutLabel_(shortcut.platformShortcut_);

          // If we have everything, add label and keys to an entry in its group.
          if (group && label && keys) {
            if (!computed[group]) {
              computed[group] = [];
            }
            var item = {
              label: label,
              keys: keys
            };
            computed[group].push(item);
          }
        }
      }
      this.addKeyDownEventListner();
      this.shortcuts = computed;
      this.fire('qowt-shortcuts-dialog-loaded');
    },

    addKeyDownEventListner: function() {
      this.addEventListener('keydown', function(event) {
        var code = event.code;
        var scrollingDiv = document.querySelector('#scroller');
        var scrollStep = 36;
        if (scrollingDiv) {
          if (code === 'ArrowDown') {
            scrollingDiv.scrollTop = scrollingDiv.scrollTop + scrollStep;
          } else if (code === 'ArrowUp') {
            scrollingDiv.scrollTop = scrollingDiv.scrollTop - scrollStep;
          }
        }
      }, false);
    },


    /** @private */
    getGroups_: function(shortcuts) {
      return shortcuts ? Object.keys(shortcuts) : [];
    },


    /** @private */
    getGroupItems_: function(group) {
      return this.shortcuts[group];
    },

    /**
     * Returns the label to be shown to the user informing the shortcut keys.
     * @param keycombo Platform specific shortcut like 'ctrl+alt+f'
     * @returns {string} Shortcut label like 'Ctrl+Option+F'
     * @private
     */
    getShortcutLabel_: function(keycombo) {
      var label = '';
      if (keycombo) {
        var keys = keycombo.toUpperCase().split('+');
        keys.forEach(function (key) {
          label += SHORTCUT_SYMBOLS[key] || key;
        }, this);

        // For shortcuts with cmd like '⌘B',the shortcut label contains no '+'
        // in it.
        if (keys.length === 2 && keys[0] === 'CMD') {
          label = label.replace('+', '');
        }
      }
      return label;
    },
  };

  window.QowtKeyboardShortcutsDialog = Polymer(
      MixinUtils.mergeMixin(QowtElement, keyboardShortcutsDialogProto_));

  return {};
});
