define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/elements/ui/accessibleBehaviors/keyNavigation/gridNavigationKeys',
  'common/elements/ui/baseMenu/baseDropdown'
], function(
    MixinUtils,
    QowtElement
    /*GridNavigationBehavior*/
    /*baseDropdown*/) {

  'use strict';

  var borderDropdownProto = {
    is: 'qowt-border-dropdown',
    name: 'border',
    behaviors: [
      GridNavigationBehavior,
      QowtBaseDropdownBehavior
    ],

    getNewItems_: function() {
      return new QowtBorderButtonGroup();
    },

    getSelectableQuery: function() {
      return 'qowt-border-button-group > qowt-border-button';
    }
  };

  window.QowtBorderDropdown =
      Polymer(MixinUtils.mergeMixin(QowtElement, borderDropdownProto));

  return {};
});
