// TODO(davidshimel) Perhaps make bold, italic, and underline buttons into
// parameterized instances of formatButton (instead of separate classes) once
// the toolbar is fully declarative.

define([
  'qowtRoot/models/env',
  'qowtRoot/models/transientFormatting',
  'qowtRoot/widgets/factory',

  'common/elements/ui/baseButton/baseButton'
  ], function(
    EnvModel,
    TransientFormatting,
    WidgetFactory /* and base button */) {

  'use strict';

  var FormatButtonBehaviorImpl = {
    widgetFormat: '',
    signalToCallbackMap_: {},

    /**
     * Polymer callback on element creation.
     * @private
     */
    created: function() {
      // TODO(davidshimel) Make app an attribute of the base button element so
      // we don't have to import EnvModel
      if (EnvModel.app === 'word' || EnvModel.app === 'point') {
        this.signalToCallbackMap_['qowt:transientModelUpdate'] =
            this.changeStateViaContext_.bind(this);
        this.signalToCallbackMap_['qowt:selectionChanged'] =
            this.changeStateViaTransientFormatting_.bind(this);
      }
      else if (EnvModel.app === 'sheet') {
        this.signalToCallbackMap_['qowt:selectionChanged'] =
            this.changeStateViaWidget_.bind(this);
        this.signalToCallbackMap_['qowt:formattingChanged'] =
            this.changeStateViaContext_.bind(this);
      }
    },

    /**
     * Get a copy of the map of PubSub signals to their callbacks without
     * providing access to the underlying map.
     * @private
     */
    getSignalToCallbackMap: function() {
      return _.clone(this.signalToCallbackMap_);
    },

    /**
     * @private
     * @param {string} signal The signal sent by PubSub.
     * @param {Object} signalData The data associated with the signal.
     */
    changeStateViaContext_: function(signal, signalData) {
      signal = signal || '';
      if(signalData &&
         signalData.action === this.action) {
        this.setActiveByContext_(signalData.context);
      }
    },

    /**
     * Sets the button's active state based on the transient formatting
     * context.
     * @private
     * @param {string} signal The signal sent by PubSub.
     * @param {Object} signalData The data associated with the signal.
     */
    changeStateViaTransientFormatting_: function(signal, signalData) {
      signal = signal || '';
      signalData = signalData || {};
      var context =
          TransientFormatting.getTransientContext(this.action);

      if (context !== undefined) {
        this.setActiveByContext_(context);
      }
    },

    /**
     * Sets the button's active state based on a formatting context.
     * @private
     * @param {Object} context The formatting context.
     */
    setActiveByContext_: function(context) {
      this.setActive(context &&
                     context.formatting &&
                     context.formatting[this.formatCode]);
    },

    // Sheet still uses widgets.
    /**
     * Creates a widget based on the current selection, the sets the active
     * state of the button based on that widget's formatting.
     * @private
     * @param {string} signal The signal sent by PubSub.
     * @param {Object} signalData The data associated with the signal.
     */
    changeStateViaWidget_: function(signal, signalData) {
      signal = signal || '';
      var contentType = signalData.newSelection ?
          signalData.newSelection.contentType : undefined;
      var widget = WidgetFactory.create(signalData.newSelection);

      this.disabled = (contentType !== 'sheetCell' &&
          contentType !== 'sheetText');
      if (widget && widget[this.widgetFormat]) {
        this.setActive(widget[this.widgetFormat]());
      }
    }
  };

  window.QowtFormatButtonBehavior = [
    QowtBaseButtonBehavior,
    FormatButtonBehaviorImpl
  ];

  return {};
});
