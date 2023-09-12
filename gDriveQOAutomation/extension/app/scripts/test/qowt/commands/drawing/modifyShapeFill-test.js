define([
  'qowtRoot/commands/drawing/modifyShapeFill',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/widgets/shape/shape'
], function(
    ModifyShapeFill,
    PubSub,
    SlidesContainer,
    ShapeWidget) {

  'use strict';

  describe('Point: "modifyShapeFill" Command', function() {

    var context_, shapeWidget_;

    beforeEach(function() {
      context_ = {
        id: '111',
        action: 'modifyShapeFillColor',
        command: {
          name: 'modShapeFill',
          eid: '111',
          fill: {
            'color': {
              'clr': '#ffff00',
              'effects': [
                {
                  'name': 'alpha',
                  'value': 100000
                }
              ],
              'type': 'srgbClr'
            },
            'type': 'solidFill'
          },
          sn: 1
        }
      };

      // Mock a shape widget
      shapeWidget_ = {
        isPlaceholderShape: function() {
          return true;
        },
        setFill: function() {
        },
        getFill: function() {
        },
        getWidgetElement: function() {
        },
        getJson: function() {
          return {
            spPr: {
            }
          };
        },
        setJson: function() {
        },
        updatePlaceholderProperties: function() {
        }
      };

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

      sinon.stub(ShapeWidget, 'create').returns(shapeWidget_);
      sinon.stub(PubSub, 'publish');
    });

    afterEach(function() {
      context_ = undefined;
      SlidesContainer.getCurrentSlideWidget.restore();
      ShapeWidget.create.restore();
      PubSub.publish.restore();
      shapeWidget_ = undefined;
    });

    describe('create:', function() {

      it('should execute slide selection if the shape to be filled is not on ' +
          'the same slide', function() {
            ModifyShapeFill.create(context_);
            assert.strictEqual(PubSub.publish.firstCall.args[0],
                'qowt:doAction', 'publish() called with correct event');
            assert.strictEqual(PubSub.publish.firstCall.args[1].action,
                'slideSelect', 'publish() called with correct action name');
            assert.strictEqual(PubSub.publish.firstCall.args[1].context.index,
                0, 'publish() called with correct index');
          });

      it('should not execute slide selection if the shape to be moved is on ' +
          'the same slide', function() {
            context_.command.sn = 2;
            ModifyShapeFill.create(context_);
            assert.isTrue(PubSub.publish.notCalled, 'no event published');
          });
    });

    describe('changeHtml:', function() {
      it('should update the placeholder properties', function() {
        sinon.stub(shapeWidget_, 'updatePlaceholderProperties');
        var cmd = ModifyShapeFill.create(context_);
        cmd.changeHtml();
        assert.isTrue(shapeWidget_.updatePlaceholderProperties.calledOnce,
            'update placeholder properties');
        shapeWidget_.updatePlaceholderProperties.restore();
      });
    });
  });
});
