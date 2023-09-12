define([
  'common/elements/ui/baseMenu/baseMenuButton'
], function(/*baseMenuButton*/) {

  'use strict';
  window.QowtCellAlignMenuButton = Polymer({
    is: 'qowt-cellAlign-menu-button',
    iconName: 'cellAlign',
    behaviors: [QowtBaseMenuButtonBehavior]
  });

  return {};
});