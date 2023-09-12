define([
    'common/elements/ui/menuItems/qowt-slide-unhide-item/qowt-slide-unhide-item'
  ], function() {

  'use strict';

  describe('qowt-slide-unhide-item element', function() {
    var item;
    var hide = {hide: true};
    var unhide = {hide: false};
    var signalNotUsed = 'updateSlideMenu';

    beforeEach(function() {
      this.stampOutTempl('qowt-slide-unhide-item-test-template');
      item = this.getTestDiv().querySelector('qowt-slide-unhide-item');
      item.presentationEmpty = false;
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(item, QowtSlideUnhideItem,
          'is a qowt-slide-unhide-item');
    });

    it('should handle updateSlideMenu with preso not empty and hide command ' +
        'resulting in item being disabled', function() {
      item.enableHandler(false, signalNotUsed, hide);
      assert.isTrue(item.disabled, 'item should be disabled');
    });

    it('should handle updateSlideMenu with preso not empty and unhide command' +
        ' resulting in item being disabled', function() {
      item.enableHandler(false, signalNotUsed, unhide);
      assert.isFalse(item.disabled, 'item should be enabled');
    });
  });
});
