/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Test cases for shape outline width action handler
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/shape/actionHandlers/modifyShapeFillColor',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/widgets/point/slidesContainer'
],
function(
    PubSub,
    ModifyShapeFillColorActionHandler,
    SelectionManager,
    SlidesContainer) {

  'use strict';

  describe('Point: "modifyShapeFillColor" Action Handler', function() {
    var context_;
    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
      sinon.stub(SelectionManager, 'getSelection', function() {
        return {scope: {id: 'testId'}};
      });
      context_ = {'action': 'modifyShapeFillColor',
        'context': {formatting: {'fillClr': '#FFFF99'}}};

      var dummySlideWidget = {
        getSlideIndex: function() {
          return 0;
        }
      };
      sinon.stub(SlidesContainer, 'getCurrentSlideWidget').returns(
          dummySlideWidget);
    });

    afterEach(function() {
      PubSub.publish.restore();
      SelectionManager.getSelection.restore();
      context_ = undefined;
      SlidesContainer.getCurrentSlideWidget.restore();
    });

    it('should publish doAction event for action modifyShapeFillColor with' +
        ' supplied width value', function() {
          context_.action = 'modifyShapeFillColor';

          ModifyShapeFillColorActionHandler.callback(context_);
          var expectedContext = {
            'action': 'modifyShapeFillColor',
            'context': {
              'command': {
                'name': 'modShapeFill',
                eid: 'testId',
                sn: 1,
                'fill': {
                  'color': {
                    'clr': '#FFFF99',
                    'effects': [
                      {
                        'name': 'alpha',
                        'value': 100000
                      }
                    ],
                    'type': 'srgbClr'
                  },
                  'type': 'solidFill'
                }
              },
              'contentType': 'shape'
            }
          };
          assert.isTrue(PubSub.publish.calledWith('qowt:doAction',
              expectedContext), 'Signal published by action handler');
        });

    it('should publish doAction event for action modifyShapeFillColor with' +
        ' noFill when supplied color value is NONE', function() {
          context_.context.formatting.fillClr = 'NONE';

          ModifyShapeFillColorActionHandler.callback(context_);
          var expectedContext = {
            'action': 'modifyShapeFillColor',
            'context': {
              'command': {
                'name': 'modShapeFill',
                eid: 'testId',
                sn: 1,
                'fill': {
                  'type': 'noFill'
                }
              },
              'contentType': 'shape'
            }
          };

          assert.isTrue(PubSub.publish.calledWith('qowt:doAction',
              expectedContext), 'Signal published by action handler');
        });

    it('should throw silent error if action from actionData is not available ' +
        'in supportedActions', function() {
          context_.action = 'unsupportedAction';

          try {
            ModifyShapeFillColorActionHandler.callback(context_);
          } catch (e) {
            assert.strictEqual(e.message, '"Action is not in the list of ' +
                'supported actions"');
          }
        });
  });
});

