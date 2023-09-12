define([
  'common/elements/ui/baseMenu/baseMenuButton'
], function(/*baseMenuButton*/) {

  'use strict';
  window.QowtMergeMenuButton = Polymer({
    is: 'qowt-merge-menu-button',
    iconName: 'arrowdown',
    behaviors: [QowtBaseMenuButtonBehavior]
  });

  return {};
});
