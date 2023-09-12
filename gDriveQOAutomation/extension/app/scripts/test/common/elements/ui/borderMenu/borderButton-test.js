require([
  'common/elements/ui/borderMenu/borderButton/borderButton'
], function(/* border button itself */) {

  'use strict';

  describe('QowtBorderButton Polymer Element', function() {

    var borderButton;

    beforeEach(function() {
      borderButton = new QowtBorderButton();
    });

    afterEach(function() {
      borderButton = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(borderButton instanceof QowtBorderButton,
        'border button is QowtBorderButton');
    });

    it('should have the value of empty string for action', function() {
      assert.strictEqual(borderButton.action, '', 'action is empty string');
    });

    it('should have the value of \'borders\' string for formatCode',
      function() {
      assert.strictEqual(borderButton.formatCode, 'borders',
        'formatCode is borders');
    });

    it('should set formatting when button is active', function() {
      var formatting = {};
      borderButton.setFormattingByButtonState_(formatting, true);
      assert.isTrue('borders' in formatting, 'formating has borders');
    });
  });
});
