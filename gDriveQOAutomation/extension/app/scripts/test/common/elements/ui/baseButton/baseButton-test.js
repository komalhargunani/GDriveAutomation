require([
  'common/elements/ui/baseButton/baseButton'],
  function(/* base button itself */) {

  'use strict';

  describe('QowtBaseButton Polymer Element', function() {

    var baseButton;

    beforeEach(function() {
      this.stampOutTempl('base-button-test-template');
      baseButton = document.querySelector('base-button-test-element');
    });

    afterEach(function() {
      baseButton = undefined;
    });

    it('should create the proper role on the base button', function() {
      assert.strictEqual(baseButton.getAttribute('role'), 'button',
        'role is button');
    });

    it('should have the value of empty string for action', function() {
      assert.strictEqual(
          baseButton.action, '', 'action is empty string');
    });

    it('should have the value of empty string for formatCode', function() {
      assert.strictEqual(
          baseButton.formatCode, '', 'formatCode is empty string');
    });

    it('should have the value of \'cmd-\' for id', function() {
      assert.strictEqual(baseButton.id, 'cmd-', 'id is cmd-');
    });

    it('should be able to get and set the button\'s active state', function() {
      baseButton.setActive(true);
      assert.isTrue(baseButton.active, 'button set to active');
      baseButton.setActive(false);
      assert.isFalse(baseButton.active, 'button set to inactive');
    });

    it('should be a toggle button', function() {
      assert.isTrue(baseButton.isToggleButton(), 'button is not toggle button');
    });

  });

  describe('Tool tip test for base button', function() {

    var baseButton, toolTip;

    beforeEach(function() {
      this.stampOutTempl('base-button-test-template');
      baseButton = document.querySelector('base-button-test-element');
      toolTip = document.createElement('qowt-tool-tip');
      var main = {'$': {tooltip: toolTip}};
      sinon.stub(document, 'getElementById').returns(main);
    });

    afterEach(function() {
      document.getElementById.restore();
      baseButton = undefined;
    });

    it('should display tool tip when mouse over on a button', function() {
      baseButton.id = 'cmd_bold';
      sinon.stub(baseButton, 'getBoundingClientRect').returns(
          toolTip.getBoundingClientRect());
      sinon.stub(toolTip, 'show');
      baseButton.showToolTip();
      assert.isTrue(toolTip.show.calledOnce, 'show method called');
      baseButton.getBoundingClientRect.restore();
      toolTip.show.restore();
    });

    it('should hide tool tip when mouse out from a button', function() {
      sinon.stub(toolTip, 'hide');
      baseButton.hideToolTip();
      assert.isTrue(toolTip.hide.calledOnce, 'hide method called');
      toolTip.hide.restore();
    });
  });
});
