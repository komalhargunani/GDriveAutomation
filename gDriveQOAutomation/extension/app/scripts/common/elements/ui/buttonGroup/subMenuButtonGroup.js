define([
  'common/elements/ui/buttonGroup/buttonGroup'
], function(/*base*/) {

  'use strict';

  var subMenuButtonGroupBehaviorImpl = {
    blurAllItems: function() {
      var items = this.items;
      _.isArray(items) && items.forEach(function(button) {
        button.active = false;
      });
    }
  };

  window.QowtSubMenuButtonGroupBehavior = [
    QowtButtonGroupBehavior,
    subMenuButtonGroupBehaviorImpl
  ];

  return {};
});
