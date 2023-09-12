define(['common/elements/object/oleObject/oleObject'], function() {
  'use strict';

  describe('<qowt-ole-object>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('oleObject-test-template');
      element = this.getTestDiv().querySelector('qowt-ole-object');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

  });

  return {};
});
