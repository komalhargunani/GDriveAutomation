define([
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/widgets/point/slidesContainer',

  'third_party/lo-dash/lo-dash.min'
], function(
    QOWTSilentError,
    PubSub,
    SelectionManager,
    SlidesContainer) {

  'use strict';

  /**
   * Handles formatting of object such as outline width, etc.
   * @param {object} actionData context of shape
   * @private
   */
  var handleFormatObject_ = function(actionData) {
    // Check if action from actionData is available in supportedActions
    if (api_.supportedActions.indexOf(actionData.action) === -1) {
      throw new QOWTSilentError('Action is not in the list of supported ' +
          'actions');
    }

    var currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
    var currentSlideIndex = currentSlideWidget.getSlideIndex();

    var selection = SelectionManager.getSelection();
    var shapeElement = selection.scope;
    var formatting = {};

    var keysToUpdate = Object.keys(actionData.context.formatting);
    keysToUpdate.forEach(function(keyToUpdate) {
      formatting[keyToUpdate] =
          _.mergeWith({}, shapeElement[keyToUpdate],
              actionData.context.formatting[keyToUpdate]);
    });

    var data = {
      action: 'formatObject',
      context: {
        contentType: 'shape',
        command: {
          name: 'formatObject',
          eid: shapeElement.getEid(),
          sn: currentSlideIndex + 1,
          formatting: formatting
        }
      }
    };

    PubSub.publish('qowt:doAction', data);
  };

  var api_ = {

    supportedActions: [
      'modifyShapeOutlineWidth',
      'modifyShapeOutlineStyle',
      'modifyShapeOutlineColor'],

    callback: handleFormatObject_
  };

  return api_;
});
