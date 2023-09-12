
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Module unit tests for the generic Selection Manager
 *
 * @author dskelton@google.com (Duncan Skelton)
 */


define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/selectionManager'
], function(PubSub, SelectionManager) {

  'use strict';

  /**
   * @private
   * Defines a dummy selection context we can signal for testing.
   */
  var K_CONTENT_TYPE = 'SelectionManager test';
  var selectionContext = {contentType: K_CONTENT_TYPE};

  /**
   * @private
   * Test function that adds a dummy selection context and checks it was added.
   */
  function expectSelectionAdded() {
    PubSub.publish('qowt:requestFocus', selectionContext);
    var selection = SelectionManager.getSelection();
    expect(selection).toBeDefined();
    expect(selection.contentType).toBe(K_CONTENT_TYPE);
    return selection;
  }

  /**
   * @private
   * Test function to remove a selection context and return the
   * resulting context.
   * @returns {Object} The resulting selection context. May be undefined.
   */
  function removeSelection() {
    PubSub.publish('qowt:requestFocusLost', selectionContext);
    var selection = SelectionManager.getSelection();
    return selection;
  }

  /**
   * @private
   * Test function to update an existing selection
   *
   * @param {boolean} forceSelectionUpdate  True to ensure an updated selection,
   *                  False to ensure no updated selection.
   * @return {Object} The current selection context. May or may not be
   *                  the updated context argument.
   */
   function testUpdateSelection(forceSelectionUpdate) {
    var newContext = {contentType: K_CONTENT_TYPE, newData: '123'};

    expect(SelectionManager.getSelection()).not.toBeDefined();
    expectSelectionAdded();
    if (!forceSelectionUpdate) {
      newContext.contentType = 'bogus content type';
    }
    PubSub.publish('qowt:updateSelection', newContext);
    return SelectionManager.getSelection();
   }

// --------------------------------------------------------

  describe('common QOWT Selection Manager', function() {
    beforeEach(function() {
      SelectionManager.init();
    });

    it('should throw if SelectionManager.init() called multiple times',
        function() {
          expect(SelectionManager.init).toThrow(
              'selectionManager.init() called multiple times.');
    });

    it('should handle qowt:requestFocus signals', function() {
      // We should have a null selection.
      expect(SelectionManager.getSelection()).not.toBeDefined();

      // Push a selection context and check it got tracked.
      expectSelectionAdded();
    });

    it('should signal qowt:selectionChanged after adding a new selection',
        function() {
      expect(SelectionManager.getSelection()).not.toBeDefined();
      spyOn(PubSub, 'publish').andCallThrough();
      expectSelectionAdded();
      expect(PubSub.publish).wasCalled();

      var args = PubSub.publish.mostRecentCall.args;
      expect(args[0]).toBe('qowt:selectionChanged');
      expect(args[1].newSelection).toBeDefined();
    });

    it('should handle qowt:requestFocusLost signals', function() {
      expect(SelectionManager.getSelection()).not.toBeDefined();
      expectSelectionAdded();

      // Test the focus lost.
      expect(removeSelection()).not.toBeDefined();
    });

    it('should clear selection when qowt:resetSelection is published',
        function() {
      expect(SelectionManager.getSelection()).not.toBeDefined();
      expectSelectionAdded();

      spyOn(PubSub, 'publish').andCallThrough();
      PubSub.publish('qowt:resetSelection', selectionContext);
      expect(SelectionManager.getSelection()).not.toBeDefined();
      expect(PubSub.publish).toHaveBeenCalledWith(
          'qowt:tool:requestDeactivate', undefined);
    });

    it('should update the current selection if a qowt:updateSelection has ' +
        'selection context with the same content type', function() {
      expect(testUpdateSelection(true).newData).toBe('123');
    });

    it('should ignore a qowt:updateSelection signal for a selection context ' +
        'with a different content type.', function() {
      expect(testUpdateSelection(false).newData).not.toBeDefined();
    });

    it('should signal qowt:selectionChanged after updating existing selection',
        function() {
      spyOn(PubSub, 'publish').andCallThrough();
      expect(testUpdateSelection(true).newData).toBe('123');
      expect(PubSub.publish).wasCalled();

      var args = PubSub.publish.mostRecentCall.args;
      expect(args[0]).toBe('qowt:selectionChanged');
      expect(args[1].newSelection).toBeDefined();
    });

    it('should stack selection contexts of different contentTypes', function() {
      // Push our first selection context
      expectSelectionAdded();

      // Push a new selection context with different content type.
      PubSub.publish('qowt:requestFocus', {contentType: 'newType'});
      expect(SelectionManager.getSelection().contentType).toBe('newType');

      // And check it pops correctly and maintains the lower selection frame.
      PubSub.publish('qowt:requestFocusLost', {contentType: 'newType'});
      expect(SelectionManager.getSelection().contentType).toBe(K_CONTENT_TYPE);
    });
  });
});
