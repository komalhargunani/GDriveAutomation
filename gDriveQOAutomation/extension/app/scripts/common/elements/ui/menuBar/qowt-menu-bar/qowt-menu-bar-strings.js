
define([
  'common/mixins/ui/verbalizationHelper',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/platform'
],
function(
    VerbalizationHelper,
    I18n,
    Platform) {

  'use strict';

  var api_ = {
    buttonKeyComboMap: {
      'menu_item_print': {'keycomboOsx': 'CMD+P', 'keycombo': 'CTRL+P'},
      'menu_item_undo': {'keycomboOsx': 'CMD+Z', 'keycombo': 'CTRL+Z'},
      'menu_item_redo': {'keycomboOsx': 'CMD+Y', 'keycombo': 'CTRL+Y'},
      'menu_item_cut': {'keycomboOsx': 'CMD+X', 'keycombo': 'CTRL+X'},
      'menu_item_copy': {'keycomboOsx': 'CMD+C', 'keycombo': 'CTRL+C'},
      'menu_item_paste': {'keycomboOsx': 'CMD+V', 'keycombo': 'CTRL+V'},
      'menu_item_insertslide': {'keycomboOsx': 'CMD+M', 'keycombo': 'CTRL+M'},
      'menu_item_duplicateslide': {'keycomboOsx': 'CMD+D', 'keycombo':
            'CTRL+D'},
      'menu_item_hideslide': {'keycomboOsx': 'CMD+H', 'keycombo':
            'CTRL+H'},
      'menu_item_unhideslide': {'keycomboOsx': 'CMD+U', 'keycombo': 'CTRL+U'},
      'menu_item_moveslideup': {'keycomboOsx': 'CMD+#38', 'keycombo':
            'CTRL+#38'},
      'menu_item_moveslidedown': {'keycomboOsx': 'CMD+#40', 'keycombo':
            'CTRL+#40'},
      'menu_item_moveslidetostart': {'keycomboOsx': 'CMD+SHIFT+#38', 'keycombo':
            'CTRL+SHIFT+#38'},
      'menu_item_moveslidetoend': {'keycomboOsx': 'CMD+SHIFT+#40', 'keycombo':
            'CTRL+SHIFT+#40'},
      'menu_item_bold': {'keycomboOsx': 'CMD+B', 'keycombo': 'CTRL+B'},
      'menu_item_italic': {'keycomboOsx': 'CMD+I', 'keycombo': 'CTRL+I'},
      'menu_item_underline': {'keycomboOsx': 'CMD+U', 'keycombo': 'CTRL+U'},
      'menu_item_strikethrough': {'keycomboOsx': 'ALT+SHIFT+5', 'keycombo':
            'ALT+SHIFT+5'},
      'menu_item_align_left': {'keycomboOsx': 'CMD+SHIFT+L', 'keycombo':
            'CTRL+SHIFT+L'},
      'menu_item_align_center': {'keycomboOsx': 'CMD+SHIFT+E', 'keycombo':
            'CTRL+SHIFT+E'},
      'menu_item_align_right': {'keycomboOsx': 'CMD+SHIFT+R', 'keycombo':
            'CTRL+SHIFT+R'},
      'menu_item_align_justified': {'keycomboOsx': 'CMD+SHIFT+J', 'keycombo':
            'CTRL+SHIFT+J'},
      'menu_item_word_count': {'keycomboOsx': 'CMD+SHIFT+C', 'keycombo':
            'CTRL+SHIFT+C'},
      'menu_item_keyboard_shortcuts': {'keycomboOsx': 'CMD+#191', 'keycombo':
            'CTRL+#191'}
    },

    /**
     * Gets the shortcut label in form of sensible text that can be read out to
     * user.
     * @param {string} keyCombo - String representing the shortcut
     * eg. 'Cmd+Shift+R'
     * @return {string} - Transformed string eg. 'Command+Shift+R'.
     * @private
     */
    getShortcutLabel: function(keyCombo) {
      var revisedKeyCombo = VerbalizationHelper.
          transformShortcutLabel_(keyCombo);
      return I18n.getMessage('shortcut', [revisedKeyCombo]);
    },

    /**
     * Gets the aria label with shortcut key. eg. 'bold Command+B'
     * @param {string} label - string representing button.
     * @param {string} keyCombo - String representing the shortcut
     * eg. 'Cmd+Shift+R'
     * @return {string} - aria label with shortcut key
     * @private
     */
    getAriaLabel: function(label, keyCombo) {
      var ariaLabel = I18n.getMessage(label);
      ariaLabel += ' ' + api_.getShortcutLabel(keyCombo);
      return ariaLabel;
    },

    /**
     * Gets the platform specific shortcut key combination
     * @param {string} label - string representing button.
     * @return {string} - platform specific shortcut key combination
     * @private
     */
    getKeyCombo: function(label) {
      return Platform.isOsx ? api_.buttonKeyComboMap[label].keycomboOsx :
          api_.buttonKeyComboMap[label].keycombo;
    },

    /**
     * Gets the label, aria label and keycombo for the button
     * @param {string} label - string representing button.
     * @return {object} - object containing label, aria label and keycombo
     * for the button.
     * @private
     */
    getButtonInfo: function(label) {
      var keyCombo = api_.getKeyCombo(label);
      var ariaLabel = api_.getAriaLabel(label, keyCombo);
      return {
        'label': I18n.getMessage(label),
        'ariaLabel': ariaLabel,
        'keycombo': keyCombo
      };
    },

    /** @return Object with all the string ids for our menus for all editors. */
    getMessages: function() {
      var messages = {
        common: {
          officeCompatibilityMode: I18n.getMessage('office_compatibility_mode')
        },
        file: {
          label: I18n.getMessage('menu_button_file'),
          saveAsDocs: I18n.getMessage('menu_item_convert_to_docs'),
          saveAsSheets: I18n.getMessage('menu_item_convert_to_sheets'),
          saveAsSlides: I18n.getMessage('menu_item_convert_to_slides'),
          print: (function() {
            return api_.getButtonInfo('menu_item_print');
          })()
        },
        edit: {
          label: I18n.getMessage('menu_button_edit'),
          undo: (function() {
            return api_.getButtonInfo('menu_item_undo');
          })(),

          redo: (function() {
            return api_.getButtonInfo('menu_item_redo');
          })(),
          cut: (function() {
            return api_.getButtonInfo('menu_item_cut');
          })(),

          copy: (function() {
            return api_.getButtonInfo('menu_item_copy');
          })(),

          paste: (function() {
            return api_.getButtonInfo('menu_item_paste');
          })(),
          deleterow: I18n.getMessage('menu_item_delete_row'),
          deletecolumn: I18n.getMessage('menu_item_delete_column')
        },
        insert: {
          label: I18n.getMessage('menu_button_insert'),
          image: I18n.getMessage('menu_item_insert_image'),
          textbox: I18n.getMessage('menu_item_insert_text_box'),
          row: I18n.getMessage('menu_item_insert_row'),
          column: I18n.getMessage('menu_item_insert_column')
        },
        slide: {
          label: I18n.getMessage('menu_button_slide'),
          insert: (function() {
            return api_.getButtonInfo('menu_item_insertslide');
          })(),

          duplicate: (function() {
            return api_.getButtonInfo('menu_item_duplicateslide');
          })(),

          delete: I18n.getMessage('menu_item_deleteslide'),
          hide: (function() {
            return api_.getButtonInfo('menu_item_hideslide');
          })(),

          unhide: (function() {
            return api_.getButtonInfo('menu_item_unhideslide');
          })(),

          moveup: (function() {
            return api_.getButtonInfo('menu_item_moveslideup');
          })(),

          movedown: (function() {
            return api_.getButtonInfo('menu_item_moveslidedown');
          })(),

          movetop: (function() {
            return api_.getButtonInfo('menu_item_moveslidetostart');
          })(),

          movebottom: (function() {
            return api_.getButtonInfo('menu_item_moveslidetoend');
          })()
        },
        format: {
          label: I18n.getMessage('menu_button_format'),
          bold: (function() {
            return api_.getButtonInfo('menu_item_bold');
          })(),

          italic: (function() {
            return api_.getButtonInfo('menu_item_italic');
          })(),

          underline: (function() {
            return api_.getButtonInfo('menu_item_underline');
          })(),

          strikethrough: (function() {
            return api_.getButtonInfo('menu_item_strikethrough');
          })(),
          align: {
            label: I18n.getMessage('menu_item_align'),
            left: (function() {
              return api_.getButtonInfo('menu_item_align_left');
            })(),

            center: (function() {
              return api_.getButtonInfo('menu_item_align_center');
            })(),

            right: (function() {
              return api_.getButtonInfo('menu_item_align_right');
            })(),

            justified: (function() {
              return api_.getButtonInfo('menu_item_align_justified');
            })()
          },
          numberformat: I18n.getMessage('menu_item_number_format'),
          wraptext: I18n.getMessage('menu_item_wrap_text'),
          mergecells: {
            label: I18n.getMessage('menu_item_merge_cells'),
            merge_all: I18n.getMessage('menu_item_merge_all'),
            merge_vertical: I18n.getMessage('menu_item_merge_vertically'),
            merge_horizontal: I18n.getMessage('menu_item_merge_horizontally'),
            unmerge: I18n.getMessage('menu_item_unmerge')
          }
        },
        tools: {
          label: I18n.getMessage('menu_button_tools'),
          wordCount: (function() {
            return api_.getButtonInfo('menu_item_word_count');
          })()
        },
        help: {
          label: I18n.getMessage('menu_button_help'),
          helpCenter: I18n.getMessage('menu_item_help_center'),
          keyboardShortcuts: (function() {
            return api_.getButtonInfo('menu_item_keyboard_shortcuts');
          })(),
          reportIssue: I18n.getMessage('menu_item_report_issue'),
          versionInfo: I18n.getMessage('menu_item_version_info')
        },
        group: {
          actions: I18n.getMessage('keyboard_shortcut_group_actions'),
          other: I18n.getMessage('keyboard_shortcut_group_other'),
          textFormatting:
              I18n.getMessage('keyboard_shortcut_group_text_formatting'),
          topMenus: I18n.getMessage('keyboard_shortcut_group_top_menus'),
          withSlides: I18n.getMessage('keyboard_shortcut_group_with_slides'),
          paragraphFormatting:
              I18n.getMessage('keyboard_shortcut_group_paragraph_formatting')
        }
      };
      return messages;
    }
  };
  return api_;
});
