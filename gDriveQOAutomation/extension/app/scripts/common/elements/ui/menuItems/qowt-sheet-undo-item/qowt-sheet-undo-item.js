define([
  'qowtRoot/pubsub/pubsub',
  'common/elements/custom/qowt-item/qowt-item-behavior'
  ], function(
    PubSub
    /*QowtItemBehavior*/
  ) {

  'use strict';

  window.QowtSheetUndoItem = Polymer({
    is: 'qowt-sheet-undo-item',

    behaviors: [
      QowtItemBehavior
    ],

    properties: {
      icon: String,
      src: String,
      label: String,

      /** Specifies the type of signals to listen on - undo or redo. */
      type: {
        type: String,
        value: 'undo'
      }
    },

    /** @private Boolean specifies when this stack is empty. */
    stackEmpty_: true,

    /** @private Specifies if this item can be enabled at this time. */
    allowEnable_: true,


    created: function() {
      this.stackEmptyListener = this.stackHandler_.bind(this, true);
      this.stackNonEmptyListener = this.stackHandler_.bind(this, false);
    },


    ready: function() {
      var stackEmptySignal = (this.type === 'redo') ?
          'qowt:redoEmpty' : 'qowt:undoEmpty';
      var stackNonEmptySignal = (this.type === 'redo') ?
          'qowt:redoNonEmpty' : 'qowt:undoNonEmpty';

      this.tokens.nonEmpty =
          PubSub.subscribe(stackNonEmptySignal, this.stackNonEmptyListener);
      this.tokens.empty =
          PubSub.subscribe(stackEmptySignal, this.stackEmptyListener);
    },


    detached: function() {
      // Don't need to super call here. We unsubscribe all tokens.
      for (var token in this.tokens) {
        PubSub.unsubscribe(this.tokens[token]);
      }
    },


    /**
     * @private
     * @param {Boolean} isEmpty True is the stack is now empty, otherwise False.
     */
    stackHandler_: function(isEmpty) {
      this.stackEmpty_ = isEmpty;
      this.disabled = isEmpty || !this.allowEnable_;
    },


    /**
     * @override
     * @param {Boolean} isDisabled Sets the menu item disabled state.
     * @param {String} signal Name of the signal being handled.
     * @param {Object} signalData
     * @param {Object} signalData.newSelection
     * @param {String} signalData.contentType
     */
    enableHandler: function(makeDisabled, signal, signalData) {
      makeDisabled = makeDisabled || '';
      signal = signal || '';
      var newSel = signalData && signalData.newSelection ?
          signalData.newSelection : undefined;
      var isSheetText = (newSel && newSel.contentType === 'sheetText');

      this.allowEnable_ = !isSheetText;
      this.disabled = isSheetText || this.stackEmpty_;
    }
  });

  return {};
});

