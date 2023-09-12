require([
  'common/elements/ui/borderMenu/borderMenuButton'],
  function() {

  'use strict';

  describe('QowtBorderMenuButton Polymer Element', function() {

    var borderMenuButton;

    beforeEach(function() {
      borderMenuButton = new QowtBorderMenuButton();
    });


    afterEach(function() {
      borderMenuButton = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(borderMenuButton instanceof QowtBorderMenuButton,
          'border menu button is QowtBorderMenuButton');
    });
  });
});
