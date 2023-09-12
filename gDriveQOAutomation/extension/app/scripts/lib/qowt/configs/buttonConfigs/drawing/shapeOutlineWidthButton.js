define([], function() {

  'use strict';

  var kEMUsPerPoint_ = 12700;

  /**
   * Formats the given value in the form of (Integer + Rational) value.
   * e.g. 1.5 value is formatted to '1 1/2'.
   * @param {Number} value Number value to be formatted
   * @return {String} String representation of (Integer + Rational) value
   * @private
   */
  function fractionFormatter_(value) {
    if (value === undefined || value === null || isNaN(value)) {
      return '';
    }

    var parts = value.toString().split('.');
    if (parts.length === 1) {
      return parts;
    } else if (parts.length === 2) {
      var wholeNum = parts[0],
          decimal = parts[1],
          denom = Math.pow(10, decimal.length),
          factor = getHighestCommonFactor_(decimal, denom),
          integerPart = wholeNum === '0' ? '' : (wholeNum + ' '),
          rationalPart = (decimal / factor) + '/' + (denom / factor);
      return (integerPart + rationalPart);
    } else {
      return '';
    }
  }

  /**
   * Finds the highest common factor for the given values.
   * @param {Number} val1 Given value1
   * @param {Number} val2 Given value2
   * @return {Number} highest common factor for the given values.
   * @private
   */
  function getHighestCommonFactor_(val1, val2) {
    var U = val1, V = val2;
    while (true) {
      if (!(U %= V)) {
        return V;
      }
      if (!(V %= U)) {
        return U;
      }
    }
  }

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
    action: 'modifyShapeOutlineWidth',
    preExecuteHook: function(value) {
      return {
        formatting: {
          ln: {
            w: parseInt(value, 10)
          }
        }
      };
    },
    // These item values are in EMUs. However, we display their respective point
    // values in dropdown.
    // Refer ECMA third edition, part one, section 20.1.10.35
    // 1pt = 12700 EMU
    items: ['3175', '6350', '9525', '12700', '19050', '28575', '38100', '57150',
      '76200'],

    formatter: function(menuItemNode, name) {
      menuItemNode.textContent =
          fractionFormatter_((parseInt(name, 10) / kEMUsPerPoint_)) + ' pt';
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
        var shapeOutlineWidth;

        if (selection instanceof QowtPointShape) {
          isEnable = true;
          shapeOutlineWidth = selection.getComputedDecorations().ln.w;
        }
        this.setEnabled(isEnable);
        this.setSelectedItem(shapeOutlineWidth);
      },

      /**
       * Reflects the current applied width in button dropdown. This is
       * essential when current selection is same (i.e. for same shape) but the
       * applied width is different.
       * @param {string} signal The signal name.
       * @param {Object} signalData Contextual information about selection.
       */
      'qowt:formattingChanged': function(signal, signalData) {
        signal = signal || '';
        var selection = signalData && signalData.node;
        var shapeOutlineWidth;

        if (selection instanceof QowtPointShape) {
          shapeOutlineWidth = selection.getComputedDecorations().ln.w;
        }
        this.setSelectedItem(shapeOutlineWidth);
      }
    }
  };
});
