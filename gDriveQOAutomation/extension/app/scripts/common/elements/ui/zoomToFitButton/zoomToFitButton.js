define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/baseButton/baseButton'
  ], function(
    MixinUtils,
    QowtElement,
    PubSub
    /* base */) {

  var zoomToFitButtonProto = {
    is: 'qowt-zoom-to-fit-button',
    behaviors: [
      QowtBaseButtonBehavior
    ],
    action: 'toggleZoom',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:zoom_to_fit";
    },

    /*
     * @protected
     * @override
     */
    triggerAction_: function(/*event*/) {
      if (!this.disabled) {
        var eventData = {
          action: this.action,
          context: {
            contentType: 'document',
            zoomFullPage: this.active
          }
        };
        PubSub.publish('qowt:doAction', eventData);
      }
    }
  };

  window.QowtZoomToFitButton =
      Polymer(MixinUtils.mergeMixin(QowtElement, zoomToFitButtonProto));
});
