define([
  'common/elements/ui/buttonGroup/subMenuButtonGroup'
], function(/*subMenuButtonGroup*/) {

  'use strict';

  describe('QowtSubMenuButtonGroup Polymer Element', function() {

    var subMenuButtonGroup;

    beforeEach(function() {
      subMenuButtonGroup = new window.QowtSubMenuButtonGroupTestElement();
      var div1 = document.createElement('div');
      var div2 = document.createElement('div');
      var div3 = document.createElement('div');
      div1.active = div2.active = div3.active = true;
      subMenuButtonGroup.appendChild(div1);
      subMenuButtonGroup.appendChild(div2);
      subMenuButtonGroup.appendChild(div3);
    });

    afterEach(function() {
      subMenuButtonGroup = undefined;
    });

    it('should be able to deactivate all menu items', function() {
      subMenuButtonGroup.blurAllItems();
      var items = subMenuButtonGroup.items;
      assert.isTrue(!_.isEmpty(items) && items.every(function(button) {
        return (button.active === false);
      }), 'all items should be deactivated');
    });
  });
});
