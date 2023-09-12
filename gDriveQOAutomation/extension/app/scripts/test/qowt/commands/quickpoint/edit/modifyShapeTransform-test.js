define([
  'qowtRoot/commands/quickpoint/modifyShapeTransform',
  'qowtRoot/events/errors/point/pointEditError',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/widgets/shape/shape',
  'test/qowt/commands/commandTestUtils',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts'
], function(
    ModifyShapeTransform,
    ShapeEditError,
    PlaceHolderManager,
    PlaceHolderPropertiesManager,
    PubSub,
    SlidesContainer,
    ShapeWidget,
    CommandUtils,
    EditCommandStandardAsserts) {

  'use strict';

  describe('Point: "modifyShapeTransform" Command', function() {

    var context_, cmd_, shapeWidget_, xfrm_;

    beforeEach(function() {
      context_ = {
        id: '111',
        action: 'modifyTransform',
        command: {
          name: 'modTrfm',
          eid: '111',
          xfrm: {
            ext: {x: 10, y: 10},
            off: {x: 10, y: 10},
            flipH: true,
            flipV: true
          },
          sn: 1
        }
      };
      xfrm_ = {
        ext: {x: 0, y: 0},
        off: {x: 0, y: 0},
        flipH: false,
        flipV: false
      };
      // Mock a shape widget
      shapeWidget_ = {
        setTransforms: function() {},
        getTransforms: function() {},
        getPlaceholderType: function() {},
        getPlaceholderIndex: function() {}
      };
      sinon.stub(ShapeWidget, 'create').returns(shapeWidget_);
      sinon.stub(shapeWidget_, 'setTransforms');
      sinon.stub(shapeWidget_, 'getTransforms').returns(xfrm_);

      var dummySlideWidget = {
        getSlideIndex: function() {
          return 1;
        },
        getLayoutId: function() {
          return 1;
        }
      };
      sinon.stub(SlidesContainer, 'getCurrentSlideWidget').returns(
          dummySlideWidget);

      cmd_ = ModifyShapeTransform.create(context_);
    });

    afterEach(function() {
      ShapeWidget.create.restore();
      shapeWidget_.setTransforms.restore();
      shapeWidget_.getTransforms.restore();
      SlidesContainer.getCurrentSlideWidget.restore();
      shapeWidget_ = undefined;
      xfrm_ = undefined;
      context_ = undefined;
      cmd_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'modTrfm', 'Command name');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          ModifyShapeTransform.create(context_);
        }, Error, 'should not throw error during creation');
      });

      it('should execute slide selection if the shape to be moved is not on ' +
          'the same slide', function() {
            context_.command.sn = 1;
            sinon.stub(PubSub, 'publish');
            ModifyShapeTransform.create(context_);
            assert.strictEqual(PubSub.publish.firstCall.args[0],
                'qowt:doAction', 'publish() called with correct event');
            assert.strictEqual(PubSub.publish.firstCall.args[1].action,
                'slideSelect', 'publish() called with correct action name');
            assert.strictEqual(PubSub.publish.firstCall.args[1].context.index,
                0, 'publish() called with correct index');
            PubSub.publish.restore();
          });

      it('should not execute slide selection if the shape to be moved is on ' +
          'the same slide', function() {
            context_.command.sn = 2;
            sinon.stub(PubSub, 'publish');
            ModifyShapeTransform.create(context_);
            assert.isTrue(PubSub.publish.notCalled, 'no event published');
            PubSub.publish.restore();
          });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'Modify shape transform cmd missing context'
          },
          {
            // Missing command
            context: {},
            errorMsg: 'Modify shape transform cmd missing command'
          },
          {
            // Missing eid
            context: {command: {sn: 1}},
            errorMsg: 'Modify shape transform cmd missing eid'
          },
          {
            // Missing sn
            context: {command: {eid: 'E111'}},
            errorMsg: 'Modify shape transform cmd missing slide number'
          }
        ];
        CommandUtils.expectInvalidConstructionContextsToThrow(
            ModifyShapeTransform, invalidContexts);
      });
    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(cmd_.dcpData, 'modifyShapeTransform.dcpData()');
      });
      it('should return a JSON object', function() {
        var data = cmd_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });
      it('should define xfrm object', function() {
        var data = cmd_.dcpData();
        assert.isObject(data.xfrm, 'dcp data is an object');
      });
      it('should define the name property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.name, 'modTrfm', 'name values are equal');
      });
      it('should define the eid property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.eid, '111', 'eid values are equal');
      });
      it('should define the slide number property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.sn, 1, 'slide number values are equal');
      });
    });

    describe('changeHtml:', function() {
      it('should call function setTransforms for resize action', function() {
        context_.action = 'modifyTransform';
        cmd_ = ModifyShapeTransform.create(context_);
        cmd_.changeHtml();
        assert.isTrue(
            shapeWidget_.setTransforms.calledWith(context_.command.xfrm),
            'setTransforms method called with correct transforms');
      });
    });

    describe('onFailure:', function() {
      it('Should handle a non-fatal QOWTError', function() {
        var error = {
          errorId: 'modify_shape_transform_error',
          fatal: false
        };
        sinon.stub(ShapeEditError, 'create').returns(error);
        sinon.stub(PubSub, 'publish');
        cmd_.onFailure();
        assert.strictEqual(
            ShapeEditError.create.firstCall.args[0], error.errorId,
            'ShapeEditError.create called with correct first parameter');
        assert.strictEqual(ShapeEditError.create.firstCall.args[1], false,
            'ShapeEditError.create called with correct second parameter');
        assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:error',
            'PubSub.publish called with correct first parameter');
        assert.deepEqual(PubSub.publish.firstCall.args[1], error,
            'PubSub.publish called with correct second parameter');
        ShapeEditError.create.restore();
        PubSub.publish.restore();
      });
    });

    describe('doRevert:', function() {
      it('should set original transforms', function() {
        cmd_.doRevert();
        assert.isTrue(shapeWidget_.setTransforms.calledWith(xfrm_),
            'setTransforms method called with original transforms');
      });
    });

    describe('modifyTransform editCommandStandardAsserts', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(cmd_);
        EditCommandStandardAsserts.asOptimistic(cmd_, true, true);
        EditCommandStandardAsserts.asCallsService(cmd_, true);
      });
    });

    describe('Modify shape transform undo initiated command', function() {
      it('should pass standard edit command assert for undo initiated command',
          function() {
            context_.command.type = 'dcpCommand';
            cmd_ = ModifyShapeTransform.create(context_);

            EditCommandStandardAsserts.standard(cmd_);
            EditCommandStandardAsserts.asCallsService(cmd_, false);
            EditCommandStandardAsserts.asOptimistic(cmd_, true, false);
          });

      it('should update placeholder shape transforms correctly', function() {
        context_.command.type = 'dcpCommand';
        context_.command.xfrm = undefined;
        var resolvedSpPr = {
          xfrm: {
            ext: {x: 100, y: 100},
            off: {x: 100, y: 100},
            flipH: true,
            flipV: false
          }
        };
        sinon.stub(PlaceHolderManager, 'updateCurrentPlaceHolderForShape');
        sinon.stub(PlaceHolderPropertiesManager, 'getResolvedShapeProperties').
            returns(resolvedSpPr);
        cmd_ = ModifyShapeTransform.create(context_);

        cmd_.changeHtml();
        assert.isTrue(
            SlidesContainer.getCurrentSlideWidget.called,
            'getCurrentSlideWidget method called');
        assert.isTrue(
            PlaceHolderManager.updateCurrentPlaceHolderForShape.calledOnce,
            'updateCurrentPlaceHolderForShape method called');
        assert.isTrue(
            PlaceHolderPropertiesManager.getResolvedShapeProperties.calledOnce,
            'getResolvedShapeProperties method called');
        PlaceHolderManager.updateCurrentPlaceHolderForShape.restore();
        PlaceHolderPropertiesManager.getResolvedShapeProperties.restore();
      });
    });
  });
});
