require([
  'common/elements/ui/justifyButtons/justifyButton/justifyButton'],
  function(/* justify button itself */) {

  'use strict';

  describe('QowtJustifyButton Polymer Element', function() {

    var justifyButton;

    beforeEach(function() {
      this.stampOutTempl('justify-button-test-template');
      justifyButton = document.querySelector('justify-button-test-element');
    });
    afterEach(function() {
      justifyButton = undefined;
    });

    it('should have the value of empty string for alignment', function() {
      assert.strictEqual(
          justifyButton.alignment, '', 'alignment is empty string');
    });

    it('should have the value of \'jus\' string for formatCode', function() {
      assert.strictEqual(
          justifyButton.formatCode, 'jus', 'formatCode is jus');
    });

    it('should not set formatting when button is inactive', function() {
      var formatting = {};
      justifyButton.setFormattingByButtonState_(formatting, false);
      assert.isFalse('jus' in formatting, 'formating does not have jus');
    });

    it('should set formatting when button is active', function() {
      var formatting = {};
      justifyButton.setFormattingByButtonState_(formatting, true);
      assert.isTrue('jus' in formatting, 'formating has jus');
    });
  });
});