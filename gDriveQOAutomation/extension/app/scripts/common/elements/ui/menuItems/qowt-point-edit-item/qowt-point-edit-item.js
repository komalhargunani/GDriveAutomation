define([
  'qowtRoot/pubsub/pubsub',
  'common/elements/custom/qowt-item/qowt-item'
  ], function(
    PubSub
    /*QowtItem*/
  ) {

  'use strict';

  var QowtPointEditItemBehaviorImpl = {
    hostAttributes: {
      class: 'qowt-menu-item'
    },

    /**
     * Simple state responding to empty/non-empty presentation signals.
     *
     * @type boolean
     * @default false
     */
    presentationEmpty: false,

    created: function() {
      this.presoEmptyListener = this.presoEmptyHandler.bind(this, true);
      this.presoNotEmptyListener = this.presoEmptyHandler.bind(this, false);
    },


    ready: function() {
      this.tokens.nonEmpty = PubSub.subscribe('qowt:presentationNonEmpty',
          this.presoNotEmptyListener);
      this.tokens.empty = PubSub.subscribe('qowt:presentationEmpty',
          this.presoEmptyListener);
    },


    detached: function() {
      // Don't need to super call here. We unsubscribe all tokens.
      for (var token in this.tokens) {
        PubSub.unsubscribe(this.tokens[token]);
      }
    },


    /** @param {Boolean} isEmpty True if presentation empty else False. */
    presoEmptyHandler: function(isEmpty) {
      this.presentationEmpty = isEmpty;
    }
  };

  window.QowtPointEditItemBehavior = [
    QowtItemBehavior,
    QowtPointEditItemBehaviorImpl
  ];

  return {};
});
