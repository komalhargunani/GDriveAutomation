define([
  'common/elements/ui/baseMenuItem/baseMenuItem'
], function(
    /*baseMenuItem*/) {

  'use strict';
  window.QowtMergeMenuItem = Polymer({
    is: 'qowt-merge-menu-item',
    formatCode: 'merge',
    behaviors: [
      QowtBaseMenuItemBehavior
    ]
  });

  return {};
});
