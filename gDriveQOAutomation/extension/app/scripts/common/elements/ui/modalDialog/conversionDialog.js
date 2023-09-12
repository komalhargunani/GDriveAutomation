define(['common/elements/ui/modalDialog/modalDialog'], function() {

  'use strict';

  window.QowtConversionDialog = Polymer({
    is: 'qowt-conversion-dialog',
    extends: 'dialog',

    behaviors: [
      QowtModalDialogBehavior
    ],

    properties: {
      'app': String
    },

    localizeString: function(app, str) {
      var computedStr = str.
          replace('{{app}}', app);

      return this.getMessage_(computedStr);
    }
  });

  return {};
});