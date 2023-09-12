define([], function() {

  'use strict';

  describe('Tool tip test for present button', function() {
    var button, toolTip;

    beforeEach(function() {
      this.stampOutTempl('qowt-present-button-test-template');
      button = this.getTestDiv().querySelector('qowt-presentbutton');
      toolTip = {show: function() {}, hide: function() {}};
      var main = {'$': {tooltip: toolTip}};
      sinon.stub(document, 'getElementById').returns(main);
    });

    afterEach(function() {
      document.getElementById.restore();
    });

    it('should call the tooltip show method', function() {
      var evt = document.createEvent('Event');
      evt.initEvent('mouseover', true);
      sinon.stub(toolTip, 'show');
      button.dispatchEvent(evt);
      assert.isTrue(toolTip.show.calledOnce, 'show method called');
      toolTip.show.restore();
    });

    it('should call the tooltip hide method', function() {
      var evt = document.createEvent('Event');
      evt.initEvent('mouseout', true);
      sinon.stub(toolTip, 'hide');
      button.dispatchEvent(evt);
      assert.isTrue(toolTip.hide.calledOnce, 'hide method called');
      toolTip.hide.restore();
    });
  });
});
