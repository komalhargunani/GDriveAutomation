define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/tools/shape/actionHandlers/formatObject',
  'qowtRoot/widgets/point/slidesContainer'
], function(
    PubSub,
    SelectionManager,
    FormatObjectActionHandler,
    SlidesContainer) {

  'use strict';

  describe('Point: "formatObject" Action Handler', function() {
    var context_, sandbox_;
    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
      sandbox_.stub(PubSub, 'publish');
      var shape = new QowtPointShape();
      shape.setEid('testId');
      sandbox_.stub(SelectionManager, 'getSelection', function() {
        return {scope: shape};
      });
      context_ = {'action': 'modifyShapeOutlineWidth',
        'context': {formatting: {
          ln: {
            w: 3175
          }
        }}};
      sandbox_.stub(SlidesContainer, 'getCurrentSlideWidget', function() {
        return {
          getSlideIndex: function() {
            return 0;
          }
        };
      });
    });

    afterEach(function() {
      sandbox_.restore();
      context_ = undefined;
    });

    it('should publish doAction event for action modifyShapeOutlineWidth with' +
        ' supplied width value', function() {

          FormatObjectActionHandler.callback(context_);
          var expectedContext = {
            'action': 'formatObject',
            'context': {
              'command': {
                'name': 'formatObject',
                eid: 'testId',
                sn: 1,
                formatting: {
                  ln: {
                    w: 3175
                  }
                }
              },
              'contentType': 'shape'
            }
          };

          assert.isTrue(PubSub.publish.calledWith('qowt:doAction',
              expectedContext), 'Signal published by action handler');
        });

    it('should publish doAction event for action modifyShapeOutlineStyle with' +
        ' supplied outline value', function() {
          context_.context.formatting.ln = {
            prstDash: 'dot'
          };
          FormatObjectActionHandler.callback(context_);
          var expectedContext = {
            'action': 'formatObject',
            'context': {
              'command': {
                'name': 'formatObject',
                eid: 'testId',
                sn: 1,
                formatting: {
                  ln: {
                    prstDash: 'dot'
                  }
                }
              },
              'contentType': 'shape'
            }
          };

          assert.isTrue(PubSub.publish.calledWith('qowt:doAction',
              expectedContext), 'Signal published by action handler');
        });

    it('should publish doAction event for action modifyShapeOutlineColor with' +
        ' supplied outline value', function() {
          context_.context.formatting.ln = {
            fill: {}
          };
          FormatObjectActionHandler.callback(context_);
          var expectedContext = {
            'action': 'formatObject',
            'context': {
              'command': {
                'name': 'formatObject',
                eid: 'testId',
                sn: 1,
                formatting: {
                  ln: {
                    fill: {}
                  }
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
            FormatObjectActionHandler.callback(context_);
          } catch (e) {
            assert.strictEqual(e.message, '"Action is not in the list of ' +
                'supported actions"');
          }
        });
  });
});
