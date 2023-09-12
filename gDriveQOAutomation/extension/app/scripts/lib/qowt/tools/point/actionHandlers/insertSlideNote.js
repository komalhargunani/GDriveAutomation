define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  /**
   * Handles insertion of new slide note
   * @param {object} actionData context of slide note
   * @private
   */
  var handleInsertSlideNoteAction_ = function(actionData) {
    actionData.context.contentType = 'slide';
    PubSub.publish('qowt:doAction', actionData);
  };

  var api_ = {
    supportedActions: ['insertSlideNote'],
    callback: handleInsertSlideNoteAction_
  };
  return api_;
});
