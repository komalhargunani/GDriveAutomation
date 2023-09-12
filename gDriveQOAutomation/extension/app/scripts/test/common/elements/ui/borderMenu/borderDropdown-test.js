require([
  'common/elements/ui/borderMenu/borderDropdown'],
  function() {

  'use strict';

  describe('QowtBorderDropdown Polymer Element', function() {

    var borderDropdown;

    beforeEach(function() {
      borderDropdown = new QowtBorderDropdown();
    });


    afterEach(function() {
      borderDropdown = undefined;
    });


    it('should support Polymer constructor creation', function() {
      assert.isTrue(borderDropdown instanceof QowtBorderDropdown,
          'border dropdown is QowtBorderDropdown');
    });

    it('should have the value of \'border\' for id', function() {
      assert.strictEqual(borderDropdown.id, 'cmd-border', 'id is border');
    });


    it('should create the aria label on the border dropdown', function() {
      assert.strictEqual(borderDropdown.getAttribute('aria-label'),
        'border_aria_spoken_word', 'aria-label is border drop down menu');
    });

  });
});
