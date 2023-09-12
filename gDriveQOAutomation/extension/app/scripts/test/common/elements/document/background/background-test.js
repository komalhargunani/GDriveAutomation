define(['common/elements/document/background/background'], function() {
  'use strict';

  describe('<qowt-background>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('background-test-template');
      element = document.querySelector('qowt-background');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should have a DCP definition', function() {
      assert.strictEqual(element.etp, 'background', 'etp is background');
    });

    it('should have a model', function() {
      assert.isDefined(element.model, 'model is defined');
      assert.strictEqual(element.model.etp, 'background',
        'model has etp property with value background');
    });

    it('should have a getBackgroundColor function', function() {
      assert.isUndefined(element.getBackgroundColor(),
          'function exists, returns undefined when no formatting exists');
    });

  });

  return {};
});
