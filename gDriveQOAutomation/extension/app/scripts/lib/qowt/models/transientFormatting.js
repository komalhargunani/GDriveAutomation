define(['qowtRoot/pubsub/pubsub'], function(PubSub) {
  'use strict';

  /** Specialised API to store and access the transient formatting model */
  var api_ = {

    /**
     * Consume a formatting action and set the value when appropriate
     * @param {object} actionData The action object that has the form:
     *         obj.action {string} The action name, eg. "bold"
     *         obj.context {objcet} the context for the action
     */
    update: function(actionData) {
      if (actionData &&
          actionData.action &&
          actionData.context) {
        // Store context for given action (overwrite if we had previous)
        set_(actionData);
      }
    },

    /**
     * There are edge cases where we do not want a selection change event to
     * cause us to blow away any stored transient formatting. In particular this
     * is the case when a user splits a paragraph. This function will ensure the
     * next call to clearTransientValues gets ignored (once)
     */
    holdValues: function() {
      ignoreNextClear_ = true;
    },

    /**
     * Remove all the transient values from the model
     */
    clearTransientValues: function() {
      if (!ignoreNextClear_) {
        transientData_ = {};
      }
      ignoreNextClear_ = false;
    },

    /**
     * Return an array of formatting actions for the stored transient data
     * @return {array} Contains action objects of the form:
     *          obj.action {string} The action name, eg. "bold"
     *          obj.context.set|value {*} The value of the action, eg. true
     */
    getPendingTransientActions: function() {
      var pendingActions = [];
      for (var action in transientData_) {
        pendingActions.push({
          action: action,
          context: transientData_[action]
        });
      }
      return pendingActions;
    },

    /**
     * Get a transient formatting context for a given action
     * @param {String} name The name of the action
     */
    getTransientContext: function(name) {
      // TODO(jliebrand): remove this hack once all clients have updated to use
      // transient formatting with proper action objects (rather than these
      // legacy data.set value things); eg remove this when all of polymer word
      // has landed
      var data = transientData_[name];
      if (data && data.hasOwnProperty('set')) {
        data = data.set;
      }
      if (data && data.hasOwnProperty('value')) {
        data = data.value;
      }
      return data;
    }
  };

  /** @private */
  var kModelDataSet_ = 'textTool';
  var kModelKey_ = 'transientFormatting';
  var ignoreNextClear_;
  var transientData_ = {};

  /**
   * @override
   * Calls the base set method then publishes a transient specific signal
   */
  function set_(actionData) {
    transientData_[actionData.action] = actionData.context;
    PubSub.publish('qowt:transientModelUpdate', {
      dataSet: kModelDataSet_,
      key: kModelKey_,
      action: actionData.action,
      context: actionData.context
    });
  }

  return api_;
});
