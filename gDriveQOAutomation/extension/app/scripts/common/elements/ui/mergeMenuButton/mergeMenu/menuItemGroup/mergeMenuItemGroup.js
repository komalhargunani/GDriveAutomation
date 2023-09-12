define([], function() {

  'use strict';
  window.QowtMergeMenuItemGroup = Polymer({
    is: 'qowt-merge-menu-item-group',
    formatCode: 'merge',
    ready: function() {
      // TODO: This is done programatically now but should be
      // done declaratively when all the items are polymerized.
      var configs = [
        {action: 'mergeAll'},
        {action: 'mergeHorizontally'},
        {action: 'mergeVertically'},
        {action: 'unmerge'}
      ];

      configs.forEach(function(config) {
        var item = new QowtMergeMenuItem();
        item.setAttribute('aria-setsize', configs.length);
        item.setAttribute('aria-posinset', configs.indexOf(config) + 1);
        item.itemAction = config.action;
        Polymer.dom(this).appendChild(item);
        Polymer.dom(this).flush();
      }.bind(this));
    },


    get items() {
      return Polymer.dom(this).querySelectorAll(this.selectable || '*');
    },


    blurAllItems: function() {
      _.isArray(this.items) && this.items.forEach(function(item) {
        item.active = false;
        item.removeAttribute('focused');
        item.classList.remove('focused');
      });
    }
  });

  return {};
});
