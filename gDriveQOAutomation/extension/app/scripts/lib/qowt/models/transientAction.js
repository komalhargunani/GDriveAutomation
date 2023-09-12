define(['qowtRoot/pubsub/pubsub'], function(PubSub) {

  'use strict';

  var api_ = {
    /**
     * Set the transient action in the model
     * @param {object} actionData - the action to set
     */
    setTransientAction: function(actionData) {
      transientData_ = actionData;
    },

    /**
     * Remove all the transient values from the model.
     */
    clearTransientValues: function() {
      PubSub.publish('qowt:transientActionClear', {});
      transientData_ = {};
    },

    /**
     * Return an array of formatting actions for the stored transient data.
     * @return {object} Contains action objects of the form:
     *          obj.action {string} The action name, eg. "bold"
     *          obj.context.set|value {*} The value of the action, eg. true
     */
    getPendingTransientActions: function() {
      return transientData_;
    }
  };

  var transientData_ = {};

  return api_;

});
