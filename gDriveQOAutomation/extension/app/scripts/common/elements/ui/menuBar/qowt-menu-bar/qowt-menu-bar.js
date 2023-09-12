
define([
  'common/elements/ui/menubar-behavior/menubar-behavior'
], function (
    /* MenubarBehavior */
) {

  'use strict';

  window.QowtMenuBar = Polymer({
    is: 'qowt-menu-bar',

    behaviors: [
      MenubarBehavior
    ],

    ready: function() {
      // Configure the menubar to select only non disabled menu's
      this.selectable = 'qowt-menu-bar>qowt-submenu:not([disabled]), '+
          'qowt-submenu>qowt-submenu:not([disabled])';
      this.focusOnHover = true;
      this.selectionFollowsFocus = true;
    }
  });

  return {};
});

