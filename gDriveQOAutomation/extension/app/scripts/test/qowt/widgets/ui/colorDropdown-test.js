define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/ui/colorDropdown'
], function(
    PubSub,
    ColorDropdown) {

  'use strict';

  xdescribe('Color Dropdown Widget Factory', function() {

    var kColorDropdown_, dummyDiv_, colorDropdownWidget_, colorItemElement_,
        eventData_;

    beforeEach(function() {
      kColorDropdown_ = {
        className: 'qowt-button-dropdown',
        classNameActive: 'qowt-menu-active',
        node: 'div',
        action: 'modifyShapeFillColor',
        items: [
          {
            action: ''
          }
        ]
      };
      dummyDiv_ = document.createElement(kColorDropdown_.node);
      colorDropdownWidget_ = ColorDropdown.create(kColorDropdown_);
      colorDropdownWidget_.appendTo(dummyDiv_);

      eventData_ = {
        action: 'modifyShapeFillColor',
        context: {
          formatting: {
            fillClr: '#FF0000'
          }
        }
      };
    });

    afterEach(function() {
      colorDropdownWidget_.destroy();
      colorDropdownWidget_ = undefined;
      dummyDiv_ = undefined;
      colorItemElement_ = undefined;
      eventData_ = undefined;
    });

    describe('API', function() {

      it('should support widget factory creation', function() {
        assert.isDefined(colorDropdownWidget_, 'widget created');
      });

      it('should set correct ARIA attributes to colorDropdown created',
          function() {
            colorItemElement_ = dummyDiv_.getElementsByClassName(
                'qowt-button-color')[0];
            assert.strictEqual(colorItemElement_.getAttribute('role'),
                'menuButton', 'role attribute set properly');
            assert.strictEqual(colorItemElement_.getAttribute('aria-haspopup'),
                'true', 'aria-haspopup attribute set properly');
            assert.strictEqual(colorItemElement_.getAttribute('aria-expanded'),
                'false', 'aria-expanded attribute set properly');
            var colorDropdownElement = dummyDiv_.getElementsByClassName(
                'qowt-button-dropdown')[0];
            assert.strictEqual(colorDropdownElement.getAttribute(
                'aria-haspopup'), 'true', 'aria-haspopup attribute');
          });

      it('should set widget state enabled', function() {
        colorDropdownWidget_.setEnabled(true);
        assert.isTrue(colorDropdownWidget_.isEnabled(), 'enabled state');
      });

      it('should set widget state disabled', function() {
        colorDropdownWidget_.setEnabled(false);
        assert.isFalse(colorDropdownWidget_.isEnabled(), 'disabled state');
      });
    });

    describe('Handle color choice', function() {

      afterEach(function() {
        colorDropdownWidget_.setSelectedItem.restore();
      });

      it('should handle color choice for shape fill color', function() {
        sinon.spy(colorDropdownWidget_, 'setSelectedItem');
        PubSub.publish('qowt:requestAction', eventData_);
        assert(colorDropdownWidget_.setSelectedItem.calledWith(
            eventData_.context.formatting.fillClr));
        assert.strictEqual(colorDropdownWidget_.getSelectedItemColor(),
            'rgb(255, 0, 0)');
      });

      it('should reset selected color if shape fill color is none', function() {
        eventData_.context.formatting.fillClr = 'NONE';
        sinon.spy(colorDropdownWidget_, 'setSelectedItem');
        PubSub.publish('qowt:requestAction', eventData_);
        assert(colorDropdownWidget_.setSelectedItem.calledWith(
            eventData_.context.formatting.fillClr));
        assert.strictEqual(colorDropdownWidget_.getSelectedItemColor(), '');
      });

      it('should handle color choice for outline fill color', function() {
        kColorDropdown_.action = 'modifyShapeOutlineColor';

        // Destroy the previous widget created in beforeEach
        colorDropdownWidget_.destroy();
        colorDropdownWidget_ = ColorDropdown.create(kColorDropdown_);
        colorDropdownWidget_.appendTo(dummyDiv_);

        eventData_.action = 'modifyShapeOutlineColor';
        eventData_.context.formatting = {
          ln: {
            fill: {
              color: {
                clr: '#FF0000'
              }
            }
          }
        };
        sinon.spy(colorDropdownWidget_, 'setSelectedItem');
        PubSub.publish('qowt:requestAction', eventData_);
        assert.isTrue(colorDropdownWidget_.setSelectedItem.calledWith(
            '#FF0000'));
        assert.strictEqual(colorDropdownWidget_.getSelectedItemColor(),
            'rgb(255, 0, 0)');
      });

    });
  });
  return {};
});
