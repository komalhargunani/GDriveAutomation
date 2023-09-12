define(['common/elements/ui/buttonGroup/subMenuButtonGroup'],
  function(/*base*/) {

  'use strict';

  var borderButtonGroupProto = {
    is: 'qowt-border-button-group',
    behaviors: [QowtSubMenuButtonGroupBehavior],

    formatCode: 'borders',

    ready: function() {
      // TODO(elqursh): This is done programatically now but should be
      // done declaratively when all the buttons are polymerized.
      //  Append the justify buttons
      var configs = [
        {action: 'border_all', icon: 'qo-chrome-icons:border_all'},
        {action: 'border_inner', icon: 'qo-chrome-icons:border_inner'},
        {
          action: 'border_horizontal',
          icon: 'qo-chrome-icons:border_horizontal'
        },
        {action: 'border_vertical', icon: 'qo-chrome-icons:border_vertical'},
        {action: 'border_outer', icon: 'qo-chrome-icons:border_outer'},
        {action: 'border_left', icon: 'qo-chrome-icons:border_left'},
        {action: 'border_top', icon: 'qo-chrome-icons:border_top'},
        {action: 'border_right', icon: 'qo-chrome-icons:border_right'},
        {action: 'border_bottom', icon: 'qo-chrome-icons:border_bottom'},
        {action: 'border_none', icon: 'qo-chrome-icons:border_none'}
      ];

      // Listen to child nodes change events
      configs.forEach(function(config) {
        var button = new QowtBorderButton();
        button.borderaction = config.action;
        button.icon = config.icon;
        Polymer.dom(this).appendChild(button);
        Polymer.dom(this).flush();
      }.bind(this));
    }
  };

  window.QowtBorderButtonGroup = Polymer(borderButtonGroupProto);

  return {};
});
