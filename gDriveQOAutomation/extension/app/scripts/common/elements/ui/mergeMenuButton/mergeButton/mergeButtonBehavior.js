define([
  'qowtRoot/utils/sheetSelection/selectionUtils',
  'qowtRoot/widgets/factory',
  'common/elements/ui/formatButton/formatButton'
], function(
    SheetSelectionUtils,
    WidgetFactory
    /*base*/) {

  'use strict';

  var mergeButtonBehaviorImpl = {
    // Override only the required functions from format button behavior.
    setFormattingByButtonState_: function(formatting, buttonState) {
      formatting = formatting || {};
      this.action = buttonState ? 'mergeAll' : 'unmerge';
    },


    // Sheet still uses widgets.
    /**
     * Sets the button state based on widget's formatting.
     *
     * @private
     * @param {String} signal - The published signal.
     * @param {Object} signalData - The data associated with the signal.
     */
    changeStateViaWidget_: function(signal, signalData) {
      signal = signal || '';
      var widget = WidgetFactory.create(signalData.newSelection);
      if (widget && widget[this.widgetFormat]) {
        var isMerged = widget[this.widgetFormat]();
        this.setActive(isMerged);
        this.disable = !(isMerged ||
            SheetSelectionUtils.isSelectionARange(signalData.newSelection));
      }
    },


    /**
     * Toggles button state based on the merge action performed
     *
     * @private
     * @param {string} signal - The published signal
     * @param {Object} signalData - The data associated with the signal.
     */
    changeStateViaContext_: function(signal, signalData) {
      signal = signal || {};
      var buttonState = false;
      var action = signalData && signalData.action;

      if (action === 'mergeAll') {
        this.setActive(true);
      } else if (action === 'unmerge') {
        this.setActive(false);
      } else if (action === 'mergeHorizontally') {
        var fromRowIdx = _.get(signalData, 'context.fromRowIndex');
        var toRowIdx = _.get(signalData, 'context.toRowIndex');
        buttonState = _.areValidIdx(fromRowIdx, toRowIdx) &&
            (fromRowIdx === toRowIdx);
        this.setActive(buttonState);
      } else if (action === 'mergeVertically') {
        var fromColIdx = _.get(signalData, 'context.fromColIndex');
        var toColIdx = _.get(signalData, 'context.toColIndex');
        buttonState = _.areValidIdx(fromColIdx, toColIdx) &&
            (fromColIdx === toColIdx);
        this.setActive(buttonState);
      }
    }
  };


  window.QowtMergeButtonBehavior = [
    QowtFormatButtonBehavior,
    mergeButtonBehaviorImpl
  ];

  return {};
});
