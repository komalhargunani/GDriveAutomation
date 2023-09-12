define([
    'common/elements/ui/menuItems/qowt-point-edit-item/qowt-point-edit-item'
  ], function() {

  'use strict';

  describe('qowt-point-edit-item element', function() {
    var item;

    beforeEach(function() {
      this.stampOutTempl('qowt-point-edit-item-test-template');
      item = this.getTestDiv().querySelector('qowt-point-edit-item');
    });

    it('should have a presentation non-empty state initially', function() {
      assert.isFalse(item.presentationEmpty, 'expect presentation not-empty');
    });

    it('should set empty when emptyListener is fired', function() {
      assert.isFalse(item.presentationEmpty, 'initially not empty');
      item.presoEmptyListener();
      assert.isTrue(item.presentationEmpty, 'it becomes empty');
    });

    it('should set non-empty when notEmptyListener is fired', function() {
      item.presentationEmpty = true;
      item.presoNotEmptyListener();
      assert.isFalse(item.presentationEmpty, 'item becomes non-empty');
    });

    it('should not change state when repeated handlers fired', function() {
      assert.isFalse(item.presentationEmpty, 'initially not empty');
      item.presoNotEmptyListener();
      assert.isFalse(item.presentationEmpty, 'still not empty');

      item.presentationEmpty = true;
      assert.isTrue(item.presentationEmpty, 'initially empty');
      item.presoEmptyListener();
      assert.isTrue(item.presentationEmpty, 'still empty');
    });
  });
});
