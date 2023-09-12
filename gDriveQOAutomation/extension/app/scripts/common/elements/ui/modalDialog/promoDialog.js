define(['common/elements/ui/modalDialog/modalDialog'], function() {

  'use strict';

  window.QowtPromoDialog = Polymer({
    is: 'qowt-promo-dialog',
    extends: 'dialog',

    behaviors: [
      QowtModalDialogBehavior
    ],

    properties: {
      'app': String,
      'promoType': String
    },

    localizeString: function(promoType, app, str) {
      var computedStr = str.
          replace('{{app}}', app).
          replace('{{promoType}}', promoType);

      return this.getMessage_(computedStr);
    },

    imageClass: function(promoType, app) {
      return 'image ' + promoType + '_' + app;
    }
  });

  return {};
});