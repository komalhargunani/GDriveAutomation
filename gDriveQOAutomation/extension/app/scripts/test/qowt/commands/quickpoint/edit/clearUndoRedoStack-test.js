define([
  'qowtRoot/commands/quickpoint/edit/clearUndoRedoStack',
  'qowtRoot/pubsub/pubsub'
], function(
    ClearUndoRedoStackCommand,
    PubSub) {

  'use strict';

  describe('Point: "ClearUndoRedostack" command', function() {

    var cmd_;

    beforeEach(function() {
      cmd_ = ClearUndoRedoStackCommand.create();
    });

    afterEach(function() {
      cmd_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'clearUndoRedoStack', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isFalse(cmd_.isOptimistic(),
            'clearUndoRedoStack.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(cmd_.callsService(), 'clearUndoRedoStack.callsService()');
      });
    });

    describe('dcpData:', function() {
      it('Should override dcpData', function() {
        assert.isFunction(cmd_.dcpData, 'clearUndoRedoStack.dcpData()');
      });

      it('Should return the payload', function() {
        var expectedPayload = {
          name: 'clearUndoRedoStack'
        };
        var payload = cmd_.dcpData();
        assert.deepEqual(payload, expectedPayload, 'correct payload');
      });
    });

    describe('onSuccess:', function() {
      it('Should override onSuccess', function() {
        assert.isFunction(cmd_.onSuccess, 'clearUndoRedoStack.onSuccess()');
      });

      it('should disable undo redo buttons and menu items', function() {
        sinon.stub(PubSub, 'publish');
        cmd_.onSuccess();
        assert.isTrue(PubSub.publish.calledTwice,
            'PubSub.publish called twice by onSuccess');
        assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:undoEmpty',
            'First PubSub.publish called with correct parameters by onSuccess');
        assert.strictEqual(PubSub.publish.secondCall.args[0], 'qowt:redoEmpty',
            'Second PubSub.publish called with correct parameters by ' +
                'onSuccess');
        PubSub.publish.restore();
      });
    });
  });
});
