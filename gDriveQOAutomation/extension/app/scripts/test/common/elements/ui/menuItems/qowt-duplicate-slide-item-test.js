define([
    'common/elements/ui/menuItems/' +
        'qowt-duplicate-slide-item/qowt-duplicate-slide-item'
  ], function() {

  'use strict';

  describe('qowt-duplicate-slide-item element', function() {
    var item;

    beforeEach(function() {
      this.stampOutTempl('qowt-duplicate-slide-item-test-template');
      item = this.getTestDiv().querySelector('qowt-duplicate-slide-item');
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(item, QowtDuplicateSlideItem,
          'is a qowt-duplicate-slide-item');
    });

    it('should handle unlockScreen when preso not empty ' +
        'resulting in item being enabled', function() {
      // Set up test
      item.isEditLocked = true;
      item.presentationEmpty = false;

      item.enableListener();
      assert.isFalse(item.isEditLocked, 'item should become non-editLocked');
      assert.isFalse(item.disabled, 'item should be enabled');
    });

    it('should handle unlockScreen when preso empty ' +
        'resulting in item remaining disabled', function() {
      // Set up test
      item.disabled = true;
      item.isEditLocked = true;
      item.presentationEmpty = true;

      item.enableListener();
      assert.isFalse(item.isEditLocked, 'item should become non-editLocked');
      assert.isTrue(item.disabled, 'item should remain enabled');
    });

    it('should handle lockScreen when preso not empty ' +
        'resulting in item becoming disabled.', function() {
      item.disabled = false;
      item.isEditLocked = false;

      item.disableListener();
      assert.isTrue(item.isEditLocked, 'item should become editLocked');
      assert.isTrue(item.disabled, 'item should become disabled');
    });

    it('should handle presoEmpty when enabled and not locked ' +
        'resulting in item being disabled', function() {
      // Set up test
      item.presentationEmpty = false;
      item.disabled = false;

      item.presoEmptyListener();
      assert.isTrue(item.presentationEmpty, 'presentation should be empty');
      assert.isTrue(item.disabled, 'item should be disabled');
    });

    it('should handle presoNotEmpty when disabled and not locked ' +
        'resulting in enabled', function() {
      // Set up the test
      item.disabled = true;
      item.isEditLocked = false;

      item.presoNotEmptyListener();
      assert.isFalse(item.presentationEmpty, 'should not be empty');
      assert.isFalse(item.disabled, 'becomes enabled');
    });

    it('should handle presoNotEmpty when disabled and locked ' +
        'leaving item disabled', function() {
      // Set up the test
      item.disabled = true;
      item.isEditLocked = true;

      item.presoNotEmptyListener();
      assert.isFalse(item.presentationEmpty, 'should not be empty');
      assert.isTrue(item.disabled, 'remains disabled');
    });
  });
});
