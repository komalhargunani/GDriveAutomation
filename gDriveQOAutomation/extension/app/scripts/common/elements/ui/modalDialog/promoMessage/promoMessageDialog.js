define([
  'qowtRoot/utils/typeUtils',
  'common/elements/ui/modalDialog/modalDialog'
], function(
    TypeUtils
    /* ModalDialogBehavior */) {

  'use strict';

  var _kEnterKeyCode = 13;

  window.QowtPromoMessageDialog = Polymer({
    is: 'qowt-promo-message-dialog',
    extends: 'dialog',

    behaviors: [
      QowtModalDialogBehavior
    ],

    properties: {
      'headerText': String,
      'messageText': String,
      'additionalAction': Object
    },

    attached: function() {
      this.setAttribute('aria-label', this.headerText);
      this.$.action.setAttribute('aria-label',
        this.getMessage_('qowt_modal_dialog_link_text'));
      this.$.closeButton.setAttribute('aria-label',
        this.getMessage_('qowt_modal_dialog_close_button'));
      this.$.affirmative.setAttribute('aria-label',
        this.getMessage_('office_first_time_confirm'));
    },

    learnMoreAction: function() {
      this.close();
      if (this.additionalAction &&
          TypeUtils.isFunction(this.additionalAction)) {
        this.additionalAction.call();
      }
    },

    linkFocused_:function(){
      this.speakLabelForElement(this.$.action, true);
    },

    focus: function() {
      HTMLElement.prototype.focus.apply(this);
      this.speakLabelForElement(this, true);
    },

    affirmativeFocused_: function() {
      this.speakLabelForElement(this.$.affirmative, true);
    },

    closeButtonFocused_: function() {
      this.speakLabelForElement(this.$.closeButton, true);
    },

    handleLinkKeyDown_: function(event) {
      if (event.keyCode === _kEnterKeyCode) {
        event.preventDefault();
        event.stopPropagation();
        this.learnMoreAction();
      }
    }
  });

  return {};
});