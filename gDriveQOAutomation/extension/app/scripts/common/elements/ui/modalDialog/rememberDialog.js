define(['common/elements/ui/modalDialog/modalDialog'], function() {

  'use strict';

  window.QowtRememberDialog = Polymer({
    is: 'qowt-remember-dialog',
    extends: 'dialog',

    behaviors: [
      QowtModalDialogBehavior
    ],

    properties: {
      'subtype': String
    },

    localizeString_: function(str, subtype) {
      var computedStr = str.replace('{{subtype}}', subtype);
      return this.getMessage_(computedStr);
    },

  });

  return {};
});