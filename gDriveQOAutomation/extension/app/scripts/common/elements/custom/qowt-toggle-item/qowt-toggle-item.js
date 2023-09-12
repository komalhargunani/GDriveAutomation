define([
    'common/elements/customSelector',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/widgets/factory',
    'qowtRoot/models/env',

    'common/elements/custom/qowt-item/qowt-item-behavior',
    'third_party/lo-dash/lo-dash.min'
  ], function(
    CustomSelector,
    PubSub,
    WidgetFactory,
    EnvModel
    /* QowtItemBehavior */
  ) {

  'use strict';

  var proto = {
    is: 'qowt-toggle-item',

    behaviors: [
      QowtItemBehavior
    ],

    properties: {
      icon: String,
      src: String,
      label: String,
      /**
       * The DCP name of the formatting decoration this item represents.
       *
       * @attribute toggleOnDecoration
       * @type string
       * @default undefined
       */
      toggleOnDecoration: String,


      /**
       * The value of the formatting decoration item.
       *
       * @type {boolean | string}
       */
      toggleSetValue: String,

      /**
       * The value of the formatting decoration item.
       *
       * @type {boolean | string}
       */
      toggleUnsetValue: String
    },

    created: function() {
      this.toggleListener = this.toggleHandler_.bind(this);
    },


    ready: function() {
      this.tokens.selectionChanged =
          PubSub.subscribe('qowt:selectionChanged', this.toggleListener);
      this.tokens.formattingChanged =
          PubSub.subscribe('qowt:formattingChanged', this.toggleListener);
      // Used for unsubscribing events during testing.
      this.toggleSetValue = this.getAttribute('toggleSetValue') || true;
      this.toggleUnsetValue = this.getAttribute('toggleUnsetValue') || false;
      // Enable toggles behavior (@see IronButtonState)
      this.toggles = true;
    },

    /**
     * @return {Object} Config object describing the action of this item. Since
     *   this is a toggle item we have to set the current data model into the
     *   returned config. As a qowt-toggle-item we know to look for the
     *   formatting property. Returns undefined if things are not as expected.
     */
    get config() {
      var config = (this.toggleOnDecoration && (this.config_ &&
          this.config_.context && this.config_.context.formatting)) ?
        _.cloneDeep(this.config_) : undefined;

      if (config) {
        config.context.formatting[this.toggleOnDecoration] =
            this.active ? this.toggleSetValue : this.toggleUnsetValue;
      }
      return config;
    },

    toggle: function() {
      this.active = !this.active;
    },

    /**
     * Update this items binary model as a result of a changed selection.
     * @param {String} signal The signal name.
     * @param {String} signalData Contextual information about selection.
     * @private
     */
    toggleHandler_: function(signal, signalData) {
      var element, widget;
      signal = signal || '';

      var sel = window.getSelection();
      if(!sel.isCollapsed && EnvModel.app === 'word') {
      // The below section is written to check the styles(formatcode)
      // of all the elements in the selection and if any of the element is 
      // having same style as that of performed action style then we are  
      // applying the same style to all the remaning elements 
      // and accordingly we are toggeling the menu bar button.
        var formatCode = this.toggleOnDecoration;
        var elements = CustomSelector.findAllInSelectionChain(formatCode);
        if (elements && elements.length > 0) {
          var allElementHasSameStyle = false;
          var elementStyle;
          for (var i = 0; i < elements.length; i++) {
            var elementData = elements[i];
            if (elementData) {
              var decorations = elementData.getComputedDecorations();
              if (decorations && formatCode in decorations) {
                if (elementStyle === undefined) {
                  elementStyle = decorations[formatCode];
                  allElementHasSameStyle = true;
                } else {
                  allElementHasSameStyle =
                      elementStyle === decorations[formatCode];
                  if (!allElementHasSameStyle) {
                    if(!elementStyle){
                      elementStyle = true;
                    }
                    break;
                  }
                }
              }
            }
          }
          this.active = allElementHasSameStyle && elementStyle;
        }
      } else {
      element = CustomSelector.findInSelectionChain([this.toggleOnDecoration]);
        if (!element) {
          // Check for legacy widget support.
          widget = WidgetFactory.create(signalData);
        }

        if (element) {
      // Set our model using computed decorations from the selection.
      // We use computed decorations as we may inherit styling from elsewhere.
          var value = element.getComputedDecorations()[this.toggleOnDecoration];
          this.active = (value === this.toggleSetValue);
          this.disabled = false;
        } else if (widget && widget[this.toggleOnDecoration] !== undefined) {
      // Relevant legacy widgets gained a simple facade API to get formatting.
          this.active = widget[this.toggleOnDecoration];
          // TODO(dskelton) Renable the code below when this blocking issue has
          // been resolved.
          // https://code.google.com/p/chromium/issues/detail?id=434451
          /*
        } else {
          // No element supporting this decoration found, so disable ourselves.
          this.disabled = true;
          */
        }
      }
    }
  };

  window.QowtToggleItem = Polymer(proto);
  return {};
});
