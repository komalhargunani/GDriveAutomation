define(['common/elements/ui/modalDialog/modalDialog'], function() {

  'use strict';

  window.QowtConversionErrorDialog = Polymer({
    is: 'qowt-conversion-error-dialog',
    extends: 'dialog',

    behaviors: [
      QowtModalDialogBehavior
    ],

    properties: {
      'titleText': String,
      'messageText': String,
      'affirmativeButton': {
        type: String,
        value: '',
        observer: 'affirmativeButtonChanged_'
      },
      'negativeButton': {
        type: String,
        value: '',
        observer: 'negativeButtonChanged_'
      }
    },

    affirmativeButtonChanged_: function(newVal /*, oldVal */) {
      if (newVal === '') {
        this.$.affirmative.style.display = 'none';
      } else {
        this.$.affirmative.style.removeProperty('display');
      }
    },

    negativeButtonChanged_: function(newVal /*, oldVal*/) {
      if (newVal === '') {
        this.$.negative.style.display = 'none';
      } else {
        this.$.negative.style.removeProperty('display');
      }
    }
  });

  return {};
});