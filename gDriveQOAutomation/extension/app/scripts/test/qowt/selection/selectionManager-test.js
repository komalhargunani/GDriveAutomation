define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/helpers/helper',
  'qowtRoot/selection/selectionManager'
], function(PubSub, Helper, SelectionManager) {

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
    assert.isDefined(selection);
    assert.strictEqual(selection.contentType, K_CONTENT_TYPE,
        'selection added with correct contentType');
    return selection;
  }

  describe('common QOWT Selection Manager', function() {
    beforeEach(function() {
      SelectionManager.init();
    });

    it('should activate helper while activating previous tool', function() {
      // Push our first selection context
      expectSelectionAdded();

      // Push a new selection context with different content type.
      PubSub.publish('qowt:requestFocus', {contentType: 'newType'});
      assert.strictEqual(SelectionManager.getSelection().contentType,
          'newType');

      sinon.stub(Helper.prototype, 'activate');
      // And check it pops correctly and maintains the lower selection frame.
      PubSub.publish('qowt:requestFocusLost', {contentType: 'newType'});
      assert.strictEqual(SelectionManager.getSelection().contentType,
          K_CONTENT_TYPE, 'previous selection popped');
      assert.isTrue(Helper.prototype.activate.called,
          'corresponding helper activated');
    });

    it('should deactivate helper while activating previous tool if context ' +
        'is undefined', function() {
      // Push a selection context with different content type.
      PubSub.publish('qowt:requestFocus', {contentType: 'newType'});
      assert.strictEqual(SelectionManager.getSelection().contentType,
          'newType');

      sinon.stub(Helper.prototype, 'deactivate');
      // And check it pops correctly and maintains the lower selection frame.
      PubSub.publish('qowt:requestFocusLost', {contentType: 'newType'});
      assert.isTrue(Helper.prototype.deactivate.called,
          'corresponding helper deactivated');
    });
  });
});
