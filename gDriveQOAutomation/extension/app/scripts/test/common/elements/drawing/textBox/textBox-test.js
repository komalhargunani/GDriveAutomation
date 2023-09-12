define(['common/elements/drawing/textBox/textBox'], function() {
  'use strict';

  describe('<qowt-text-box>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('text-box-test-template');
      element = this.getTestDiv().querySelector('qowt-text-box');
    });

    afterEach(function() {
      element = undefined;
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should mixin FlowChildren algorithm', function() {
      assert.isTrue(element.supports('flow-children'), 'support flow');
    });

    it('should mixin InternalMargins', function() {
      assert.isTrue(element.supports('leftMargin'), 'support left margin');
      assert.isTrue(element.supports('topMargin'), 'support top margin');
      assert.isTrue(element.supports('rightMargin'), 'support right margin');
      assert.isTrue(element.supports('bottomMargin'), 'support bottom margin');
    });

    it('should mixin ShapeBackgroundColor', function() {
      assert.isTrue(element.supports('backgroundColor'),
          'support background color');
    });

    it('should mixin ShapeBorder', function() {
      assert.isTrue(element.supports('borders'), 'support borders');
    });

    it('should mixin ShapeSize', function() {
      assert.isTrue(element.supports('width'), 'support width');
      assert.isTrue(element.supports('height'), 'support height');
    });

    it('should be inactive when initialized', function() {
      assert.isFalse(element.active);
    });

    it('should be activated when clicked', function() {
      var evt = {
        path: [element]
      };

      // Directly call the handler function with our fake event.
      element.handleMouseDown_(evt);

      assert.isTrue(element.active);
    });

    it('should remain inactive when something else was clicked while inactive',
        function() {
      var evt = {
        path: [document.body]
      };

      // Directly call the handler function with our fake event.
      element.handleMouseDown_(evt);

      assert.isFalse(element.active);
    });

    it('should deactivate when something else was clicked while it was active',
        function() {

      // Activate the textbox.
      var evt = {
        path: [element]
      };
      element.handleMouseDown_(evt);

      // Deactivate it.
      evt = {
        path: [document.body]
      };
      element.handleMouseDown_(evt);

      assert.isFalse(element.active);
    });
  });

  return {};
});
