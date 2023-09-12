define(['common/elements/ui/buttonGroup/subMenuButtonGroup'],
  function(/*base*/) {

    'use strict';

    var cellAlignButtonGroupProto = {
      is: 'qowt-cellAlign-button-group',
      behaviors: [QowtSubMenuButtonGroupBehavior],

      formatCode: 'cellAlign',

      ready: function() {
        // TODO: This is done programatically now but should be done
        // declaratively when all the buttons are polymerized.

        var configs = [

          {
            action: 'cellHAlignLeft', icon: 'qo-chrome-icons:text_align_left',
            groupId: 'horizontal-alignment'
          },
          {
            action: 'cellHAlignCenter',
            icon: 'qo-chrome-icons:text_align_center',
            groupId: 'horizontal-alignment'
          },
          {
            action: 'cellHAlignRight', icon: 'qo-chrome-icons:text_align_right',
            groupId: 'horizontal-alignment'
          },
          {
            action: 'cellVAlignTop', icon: 'qo-chrome-icons:cellVAlignTop',
            groupId: 'vertical-alignment'
          },
          {
            action: 'cellVAlignCenter',
            icon: 'qo-chrome-icons:cellVAlignCenter',
            groupId: 'vertical-alignment'
          },
          {
            action: 'cellVAlignBottom',
            icon: 'qo-chrome-icons:cellVAlignBottom',
            groupId: 'vertical-alignment'
          }

        ];

        // Listen to child nodes change events
        configs.forEach(function(config) {
          var button = new QowtCellAlignButton();
          button.cellAlignAction = config.action;
          button.icon = config.icon;
          Polymer.dom(this).appendChild(button);
          Polymer.dom(this).flush();
        }.bind(this));
      }

    };

    window.QowtCellAlignButtonGroup = Polymer(cellAlignButtonGroupProto);

    return {};
  });
