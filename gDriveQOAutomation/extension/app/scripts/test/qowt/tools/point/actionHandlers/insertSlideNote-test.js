define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/insertSlideNote'
], function(PubSub, InsertSlideNoteActionHandler) {

  'use strict';

  describe('insertSlideNote select action handler test', function() {
    var context_;
    beforeEach(function() {
      sinon.spy(PubSub, 'publish');
      context_ = {
        context: {}
      };
    });
    afterEach(function() {
      context_ = undefined;
      PubSub.publish.restore();
    });

    it('should publish doAction event for action insertSlideNote', function() {
      context_.action = 'insertSlideNote';
      InsertSlideNoteActionHandler.callback(context_);
      assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:doAction',
          'PubSub.publish called with correct event type');
      assert.equal(PubSub.publish.firstCall.args[1].action, 'insertSlideNote',
          'PubSub.publish called with correct action name');
      assert.equal(PubSub.publish.firstCall.args[1].context.contentType,
          'slide', 'PubSub.publish called with correct action name');
    });

  });
});
