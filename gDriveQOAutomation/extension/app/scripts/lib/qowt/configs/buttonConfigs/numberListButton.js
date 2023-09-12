/**
 * @fileoverview Defines a 'Number List' button for generic use.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/widgets/factory',
  'common/elements/customSelector',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/listFormatManager',
  'third_party/lo-dash/lo-dash.min'
  ], function(
    WidgetFactory,
    CustomSelector,
    I18n,
    ListFormatManager
    /*lo-dash*/) {

  'use strict';

  /**
   * Return a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   * @return config {object} A button configuration.
   *         config.type {string} The type of widget to create.
   *         config.action {string} The widgets requested action.
   *         config.sticky {boolean} True for a bi-state button,
   *                False for a plain button that doesn't latch.
   *         config.subscribe {object} Optional set of signals with callbacks
   *                that give button behaviours.
   */
  return {
    type: 'button',
    action: 'toggleNumbered',
    shortcut: {
      'OSX': 'CMD+Shift+7',
      'DEFAULT': 'CTRL+Shift+7'
    },
    sticky: true,
    group: I18n.getMessage('keyboard_shortcut_group_paragraph_formatting'),
    preExecuteHook: function(set) {
      var defaultNumberedInfo = {};
      if (set) {
        defaultNumberedInfo = ListFormatManager.getDefaultInfo('n', 0);
      }
      return {
        formatting: {
          'lvl': defaultNumberedInfo.level,
          'lfeID': defaultNumberedInfo.entryId
        }
      };
    },

    subscribe: {
      /**
       * Update the button status as a result of a changed formatting.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about formatting.
       */
      'qowt:formattingChanged': function(signal, signalData) {
        signal = signal || '';
        if (_.has(signalData, 'formatting.lvl') ||
            _.has(signalData, 'formatting.lfeID')) {
          var element = signalData.eid &&
              document.getElementById(signalData.eid);
          if (element) {
            this.setActive(element.isNumberedList());
          }
        }
      },

      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';

        // TODO(jliebrand): currently EACH button in the toolbar both
        // walks the selection chain to find support for a particular
        // action AND gets the computed style for the selection. This
        // is inefficient. In the new polymer toolbar/buttons we should
        // ensure the toolbar is smart enough to do this once for all
        // buttons and dropdowns

        // if there is no element in the selection chain that
        // supports our action, we will disable this button
        var elements = CustomSelector.findAllInSelectionChain(['lvl', 'lfeID']);
        var isNumberedList;

        if (elements && elements.length > 0) {
          // now get the computed decorations for the elements and
          // toggle our button accordingly. We get computed decorations
          // here, because the element might inherit styling from elsewhere.

          // TODO(jliebrand): change dcp schema to be readable
          // so that we do not need to have unreadable code like this 'lfeID'
          // see http://crbug/404137
          isNumberedList = false;
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element) {
              var computedDecorations = element.getComputedDecorations();
              var isList = computedDecorations.lvl || computedDecorations.lfeID;
              var isNumber = element.isNumberedList();
              isNumberedList = (isList && isNumber);
              if (!isNumberedList) {
                break;
              }
            }
          }
        }
        else {
          if (signalData.newSelection) {
            var node = signalData.newSelection.startContainer;
            var widget = WidgetFactory.create({
              'fromNode': node,
              'supportedActions': ['toggleNumbered']
            });
            isNumberedList =
                (widget && widget.hasNumbered && widget.hasNumbered());
          }
        }

        this.setActive(isNumberedList);
      }
    }
  };

});
