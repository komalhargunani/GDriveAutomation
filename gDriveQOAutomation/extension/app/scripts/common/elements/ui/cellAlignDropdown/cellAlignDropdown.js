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

  var cellAlignDropdownProto = {
    is: 'qowt-cellAlign-dropdown',
    name: 'cellAlign',
    behaviors: [
      GridNavigationBehavior,
      QowtBaseDropdownBehavior
    ],

    getNewItems_: function() {
      return new QowtCellAlignButtonGroup();
    },

    getSelectableQuery: function() {
      return 'qowt-cellAlign-button-group > qowt-cellAlign-button';
    }
  };

  window.QowtCellAlignDropdown =
    Polymer(MixinUtils.mergeMixin(QowtElement, cellAlignDropdownProto));

  return {};
});