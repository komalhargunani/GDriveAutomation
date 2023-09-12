define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/platform',
  'common/elements/ui/baseButton/baseButton'
  ], function(
    MixinUtils,
    QowtElement,
    PubSub,
    Platform
    /* base */) {

  var prefix = Platform.isOsx ? '⌘' : 'Ctrl+';
  var printButtonProto = {
    is: 'qowt-print-button',
    behaviors: [
      QowtBaseButtonBehavior
    ],

    action: 'print',
    shortCut: prefix + 'P',

    /** @private */
    ready: function() {
      this.toggles = false;
      this.icon = "qo-chrome-icons:print";
    },

    /*
     * @protected
     * @override
     */
    triggerAction_: function(/*event*/) {
      var eventData = {
        action: this.action,
        context: {}
      };
      PubSub.publish('qowt:requestAction', eventData);
    }
  };

  window.QowtPrintButton =
      Polymer(MixinUtils.mergeMixin(QowtElement, printButtonProto));

  return {};
});
