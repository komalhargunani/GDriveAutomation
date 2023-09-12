define(['common/elements/document/section/section'], function() {
  'use strict';

  describe('<qowt-section>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('section-test-template');
      element = document.querySelector('qowt-section');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should update header when headerDistanceFromTop updated', function() {
      sinon.stub(element, 'fire');
      element.headerDistanceFromTopChanged();
      sinon.assert.calledOnce(element.fire);
      sinon.assert.calledWith(element.fire, 'header-changed');
      element.fire.restore();
    });

    it('should update footer when footerDistanceFromBottom updated', function(){
      sinon.stub(element, 'fire');
      element.footerDistanceFromBottomChanged();
      sinon.assert.calledOnce(element.fire);
      sinon.assert.calledWith(element.fire, 'footer-changed');
      element.fire.restore();
    });

  });

  return {};
});
