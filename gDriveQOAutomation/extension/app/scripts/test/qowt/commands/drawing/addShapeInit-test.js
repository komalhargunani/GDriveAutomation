define([
  'test/qowt/commands/commandTestUtils',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/drawing/addShapeInit',
  'qowtRoot/models/transientAction',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/savestate/saveStateManager',
  'qowtRoot/utils/typeUtils'
], function(
    CommandUtils,
    CommandBase,
    AddShapeInit,
    TransientActionModel,
    PubSub,
    SaveStateManager,
    TypeUtils) {

  'use strict';

  describe('Point: "addShapeInit" Command', function() {

    var contextData_, cmd_;

    beforeEach(function() {
      contextData_ = {
        action: 'initAddShape',
        context: {
          contentType: 'slide',
          isTxtBox: true,
          prstId: 88,
          set: true
        }
      };
      cmd_ = AddShapeInit.create(contextData_);
    });

    afterEach(function() {
      cmd_ = undefined;
      contextData_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.equal(cmd_.name, 'addShapeInit', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isTrue(cmd_.isOptimistic(), 'addShape.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isFalse(cmd_.callsService(), 'addShape.callsService()');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          AddShapeInit.create(contextData_);
        }, Error, 'should not throw error during creation');
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing contextData args*/
            contextData: undefined,
            errorMsg: 'Add Shape Init cmd missing contextData'
          }
        ];
        CommandUtils.expectInvalidConstructionContextsToThrow(
            AddShapeInit, invalidContexts);
      });
    });

    describe('changeHtml:', function() {
      it('should setTransientAction when context is set in changeHtml',
        function() {
          sinon.stub(PubSub, 'publish');
          sinon.stub(TransientActionModel, 'setTransientAction');

          cmd_.changeHtml();
          assert.isTrue(PubSub.publish.calledTwice, 'two signals published');
          assert.strictEqual(PubSub.publish.getCall(0).args[0],
              'qowt:clearSlideSelection', 'selection cleared');
          assert.strictEqual(PubSub.publish.getCall(1).args[0],
              'qowt:requestFocus', 'requested focus');
          assert.strictEqual(PubSub.publish.getCall(1).args[1].contentType,
              'slide', 'requested focus with contentType slide');
          assert.isTrue(TransientActionModel.setTransientAction.calledOnce,
              'transient action set');
          assert.strictEqual(TransientActionModel.setTransientAction.
              getCall(0).args[0], contextData_, 'selection cleared');
          PubSub.publish.restore();
          TransientActionModel.setTransientAction.restore();
      });

      it('should clearTransientAction when context is not set in changeHtml',
          function() {
            contextData_.context.set = false;
            cmd_ = AddShapeInit.create(contextData_);

            sinon.stub(PubSub, 'publish');
            sinon.stub(TransientActionModel, 'clearTransientValues');

            cmd_.changeHtml();
            assert.isTrue(PubSub.publish.calledTwice, 'two signals published');
            assert.strictEqual(PubSub.publish.getCall(0).args[0],
                'qowt:clearSlideSelection', 'selection cleared');
            assert.strictEqual(PubSub.publish.getCall(1).args[0],
                'qowt:requestFocus', 'requested focus');
            assert.strictEqual(PubSub.publish.getCall(1).args[1].contentType,
                'slide', 'requested focus with contentType slide');
            assert.isTrue(TransientActionModel.clearTransientValues.calledOnce,
                'transient action cleared');
            PubSub.publish.restore();
            TransientActionModel.clearTransientValues.restore();
          });
    });

    describe('common:', function() {
      it('should be a command', function() {
        assert.isTrue(CommandBase.isCommand(cmd_), 'should be a command');
      });

      it('should implement a changeHtml function', function() {
        assert.isDefined(cmd_.changeHtml,
            'changeHtml is defined');
        assert.isTrue(TypeUtils.isFunction(cmd_.changeHtml),
            'addShapeInitCommand.changeHtml()');
      });
    });

    describe('optimistic:', function() {
      it('should be optimistic', function() {
        CommandUtils.expectIsOptimistic(cmd_, true);
      });

      it('should implement a doRevert function', function() {
        CommandUtils.expectIsRevertible(cmd_, false);
      });

      it('should implement a doOptimistic function', function() {
        assert.isFunction(cmd_.doOptimistic,
            'addShapeInitCommand.doOptimistic()');
      });

      it('should not mark the file state as dirty', function() {
        cmd_.changeHtml = function() {};
        sinon.spy(SaveStateManager, 'markAsDirty');
        cmd_.doOptimistic();
        assert.isTrue(
            SaveStateManager.markAsDirty.notCalled,
            'markAsDirty method never called');
        SaveStateManager.markAsDirty.restore();
      });
    });

    describe('service:', function() {
      it('should not call the core', function() {
        CommandUtils.expectCallsService(cmd_, false);
      });
    });
  });
});
