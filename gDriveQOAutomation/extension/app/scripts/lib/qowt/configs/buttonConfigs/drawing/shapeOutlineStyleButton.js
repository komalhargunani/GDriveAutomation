define([], function() {

  'use strict';

  /**
   * Returns a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   *
   * @return {object} A button configuration.
   * @return {string} config.type The type of widget to create.
   * @return {string} config.action The widgets requested action.
   * @return {object} config.items An array containing all the menuitem
   *     configurations.
   * @return {Function} config.formatter A custom function to style the items
   *     being created.
   * @return {object} config.subscribe Set of signals with callbacks that give
   *     button behaviours.
   */
  return {
    type: 'dropdown',
    action: 'modifyShapeOutlineStyle',
    preExecuteHook: function(value) {
      return {
        formatting: {
          ln: {
            prstDash: value
          }
        }
      };
    },

    items: ['solid', 'dot', 'dash', 'dashDot', 'lgDash', 'lgDashDot'],

    formatter: function(menuItemNode, name) {
      menuItemNode.textContent = '';
      menuItemNode.classList.add('shapeOutlineStyle-' + name);
    },

    subscribe: {
      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {Object} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var selection = signalData.newSelection &&
            signalData.newSelection.scope;
        var isEnable = false;
        var shapeOutlineStyle;

        if (selection instanceof QowtPointShape && selection.supports('ln')) {
          isEnable = true;
          shapeOutlineStyle = selection.getComputedDecorations().ln.prstDash;
        }
        this.setEnabled(isEnable);
        this.setSelectedItem(shapeOutlineStyle);
      },

      /**
       * Reflects the current applied style in the dropdown. This is essential
       * when current selection is same (i.e. for same shape) but the applied
       * style is different.
       * @param {string} signal The signal name.
       * @param {Object} signalData Contextual information about selection.
       */
      'qowt:formattingChanged': function(signal, signalData) {
        signal = signal || '';
        var selection = signalData && signalData.node;
        var shapeOutlineStyle;

        if (selection instanceof QowtPointShape && selection.supports('ln')) {
          shapeOutlineStyle = selection.getComputedDecorations().ln.prstDash;
        }
        this.setSelectedItem(shapeOutlineStyle);
      }
    }
  };
});
