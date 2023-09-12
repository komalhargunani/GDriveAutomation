define([
  'common/elements/ui/buttonGroup/buttonGroup'
], function(
    /*base*/) {

  'use strict';

  var justifyButtonGroupProto = {
    is: 'qowt-justify-button-group',
    behaviors: [QowtButtonGroupBehavior],

    formatCode: 'jus',

    ready: function() {
      // TODO(elqursh): This is done programatically now but should be
      // done declaratively when all the buttons are polymerized.
      //  Append the justify buttons
      var buttons = [
        new QowtJustifyLeftButton(),
        new QowtJustifyCenterButton(),
        new QowtJustifyRightButton(),
        new QowtJustifyFullButton()
      ];

      // Listen to child nodes change events
      buttons.forEach(function(button) {
        Polymer.dom(this).appendChild(button);
        Polymer.dom(this).flush();
      }.bind(this));
    },

    setActive: function(alignment) {
      // Setting default left alignment is incorrect,
      // selection should decide the alignment type, it could be none as well.
      if ((_.indexOf(['L', 'C', 'R', 'J'], alignment) < 0) &&
          (alignment !== false)) {
        alignment = 'L';
      }
      _.forEach(this.items, function(justifyButton) {
        justifyButton.setActive(alignment === justifyButton.alignment);
      }.bind(this));
    }
  };

  window.QowtJustifyButtonGroup = Polymer(justifyButtonGroupProto);

  return {};
});
