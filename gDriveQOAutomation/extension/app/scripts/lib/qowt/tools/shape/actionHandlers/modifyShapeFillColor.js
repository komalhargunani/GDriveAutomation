// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Shape tool action handler to handle requestAction for
 * solid fill of a shape.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/widgets/point/slidesContainer'
], function(PubSub, SelectionManager, QOWTSilentError, SlidesContainer) {

  'use strict';

  /**
   * Handles shape fill for shape from context
   * @param {object} actionData context of shape
   */
  var _handleShapeFill = function(actionData) {
    // Check first action from actionData is available in supportedActions
    if (_api.supportedActions.indexOf(actionData.action) === -1) {
      throw new QOWTSilentError('Action is not in the list ' +
          'of supported actions');
    }

    var currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
    var currentSlideIndex = currentSlideWidget.getSlideIndex();

    var selection = SelectionManager.getSelection();
    var shapeNode = selection.scope;
    var shapeColorFillData = {
      action: actionData.action,
      context: {
        command: {
          name: 'modShapeFill',
          eid: shapeNode.id,
          sn: currentSlideIndex + 1
        }
      }
    };
    if (actionData.context.formatting.fillClr === 'NONE') {
      shapeColorFillData.context.command.fill = {'type': 'noFill'};
    } else {
      shapeColorFillData.context.command.fill = {
        'color': {
          'clr': actionData.context.formatting.fillClr,
          'effects': [
            {
              'name': 'alpha',
              'value': 100000
            }
          ],
          'type': 'srgbClr'
        },
        'type': 'solidFill'
      };
    }
    shapeColorFillData.context.contentType = 'shape';
    PubSub.publish('qowt:doAction', shapeColorFillData);
  };

  var _api = {

    supportedActions: ['modifyShapeFillColor'],

    callback: _handleShapeFill
  };

  return _api;
});
