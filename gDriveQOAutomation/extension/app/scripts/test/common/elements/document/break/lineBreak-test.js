define(['common/elements/document/break/lineBreak'], function() {
  'use strict';

  describe('Line Break', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('line-break-test-template');
      element = document.querySelector('[is="qowt-line-break"]');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });


    it('should return correct element type', function() {
      assert.equal(element.etp, 'brk', 'should have correct element type');
    });

    it('should return the br node as child element', function() {
      assert.equal(element.childNodes[0].nodeName, 'BR',
          'should return the br node as child element');
    });


  });

  return {};
});
