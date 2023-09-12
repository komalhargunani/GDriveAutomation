define([
    'common/elements/ui/menuItems/qowt-slide-hide-item/qowt-slide-hide-item'
  ], function() {

  'use strict';

  describe('qowt-slide-hide-item element', function() {
    var item;
    var hide = {hide: true};
    var unhide = {hide: false};
    var signalNotUsed = 'updateSlideMenu';

    beforeEach(function() {
      this.stampOutTempl('qowt-slide-hide-item-test-template');
      item = this.getTestDiv().querySelector('qowt-slide-hide-item');
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(item, QowtSlideHideItem,
          'is a qowt-slide-hide-item');
    });

    it('should handle updateSlideMenu with preso not empty and hide command ' +
        'resulting in item being disabled', function() {
      //Set up test
      item.presentationEmpty = false;

      item.enableHandler(false, signalNotUsed, hide);
      assert.isFalse(item.disabled, 'item should be disabled');
    });

    it('should handle updateSlideMenu with preso not empty and unhide command' +
        ' resulting in item being disabled', function() {
      //Set up test
      item.presentationEmpty = false;

      item.enableHandler(false, signalNotUsed, unhide);
      assert.isTrue(item.disabled, 'item should be enabled');
    });

    it('should handle presoEmpty resulting in item being disabled', function() {
      item.presoEmptyListener();
      assert.isTrue(item.presentationEmpty, 'presoEmpty state true');
      assert.isTrue(item.disabled, 'item should be disabled');
    });

    it('should handle presoNotEmpty resulting in item enabled', function() {
      item.presoNotEmptyListener();
      assert.isFalse(item.presentationEmpty, 'presoEmpty state false');
      assert.isFalse(item.disabled, 'item should be enabled');
    });
  });
});
