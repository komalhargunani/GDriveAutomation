define([
  'qowtRoot/utils/i18n',
  'common/elements/ui/baseButton/baseButton'
], function(
   I18n
   /*baseButton*/) {

  'use strict';

  var cellAlignButtonProto = {
    is: 'qowt-cellAlign-button',
    behaviors: [QowtBaseButtonBehavior],
    properties: {
      cellAlignAction: {
        type: String,
        value: undefined
      }
    },

    formatCode: 'cellAlign',

    ready: function() {
      this.blurOnClick = false;
    },

    attached: function() {
      this.action = this.cellAlignAction;
      this.id = 'cmd-' + this.action;
      this.setAttribute('aria-label',
        I18n.getMessage(this.action.toLowerCase() + '_aria_spoken_word'));
    }
  };

  window.QowtCellAlignButton = Polymer(cellAlignButtonProto);

  return {};
});
