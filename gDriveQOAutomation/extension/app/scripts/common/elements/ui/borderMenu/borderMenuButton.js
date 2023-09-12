define([
  'common/elements/ui/baseMenu/baseMenuButton'
], function(/*baseMenuButton*/) {

  'use strict';
  window.QowtBorderMenuButton = Polymer({
    is: 'qowt-border-menu-button',
    iconName: 'border',
    behaviors: [QowtBaseMenuButtonBehavior]
  });

  return {};
});
