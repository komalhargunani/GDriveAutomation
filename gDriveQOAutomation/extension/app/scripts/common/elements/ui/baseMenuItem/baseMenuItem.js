define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/utils/converters/caseConverter',
  'qowtRoot/utils/i18n',
  'common/elements/custom/qowt-item/qowt-item-behavior'
], function(
    MixinUtils,
    QowtElement,
    CaseConverter,
    I18n
    /*qowt-item-behavior*/) {

  'use strict';

  window.QowtBaseMenuItemBehaviorImpl = {
    properties: {
      icon: String,
      src: String,
      label: String,
      itemAction: {
        type: String,
        value: undefined
      }
    },


    hostAttributes: {
      'role': 'menuitem'
    },


    ready: function() {
      this.blurOnClick = true;
    },


    attached: function() {
      if (this.itemAction) {
        this.action = this.itemAction;
        this.id = 'menuitem-' + this.action;
        var key = CaseConverter.camelCase2_(this.action);
        this.label = I18n.getMessage('menu_item_' + key);
        this.setAttribute('aria-label',
            I18n.getMessage(key + '_aria_spoken_word'));

        this.config_ = {
          action: this.action
        };
      }
    }
  };

  // Behaviors have to be defined on the global object
  window.QowtBaseMenuItemBehavior = [
    QowtItemBehavior,
    MixinUtils.mergeMixin(QowtElement, window.QowtBaseMenuItemBehaviorImpl)
  ];

  return {};
});
