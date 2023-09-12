define([
    'common/elements/custom/qowt-item/qowt-item-behavior'
  ], function() {

  'use strict';

  window.QowtItem = Polymer({
    is: 'qowt-item',

    behaviors: [
      QowtItemBehavior
    ],

    properties: {
      icon: String,
      src: String,
      label: String
    }
  });

  return {};
});

