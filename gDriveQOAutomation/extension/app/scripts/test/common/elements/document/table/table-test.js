define(['common/elements/document/table/table'], function() {
  'use strict';

  describe('<qowt-table>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('table-test-template');
      element = document.querySelector('[is="qowt-table"]');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

  });

  return {};
});
