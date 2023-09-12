
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview WRITE ME
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/pubsub/pubsub'], function(PubSub) {

  'use strict';

  var _api = {

    /**
     * creates (or updates) key/value pair against a data-set identifier
     *
     * @param dataSet {string} identifier for a given data set
     * @param key {string} key identifier for data
     * @param value {anything} the actual value of data; can be anything
     */
    set: function(dataSet, key, value) {
      _dataSets[dataSet] = _dataSets[dataSet] || {};
      _dataSets[dataSet][key] = value;
      PubSub.publish(_kEvent, {
        dataSet: dataSet,
        key: key,
        value: value
      });
    },

    /**
     * Subscribes to updates on a particular data set.
     *
     * @param dataSet {string} the identifier for the data set to subscribe to.
     * @param callback {function} the callback function that receives an event.
     *    the event object has 3 parameters: dataSet, key, and value,
     *    corresponding to the values passed in to set.
     * @returns {string | undefined} A token to be passed to unsubscribe.
     */
    subscribe: function(dataSet, callback) {
      return PubSub.subscribe(_kEvent, function(eventName, eventData) {
        if (eventData.dataSet === dataSet) {
          callback(eventName, eventData);
        }
      });
    },

    /**
     * Unsubscribes to updates on a particular data set.
     *
     * @param token {string} The token returned by Model.subscribe.
     * @returns {boolean} True if successfully unsubscribed.
     */
    unsubscribe: function(token) {
      return PubSub.unsubscribe(token);
    },

    /**
     * getting data out of model; can get the entire dataSet or
     * an individual key within a dataSet
     *
     * @param dataSet {string} identifier for a dataSet
     * @param key_opt {string} optional key of data to get
     */
    get: function(dataSet, key_opt) {
      var ds = _dataSets[dataSet];
      if (key_opt && ds) {
        return ds[key_opt];
      }
      return ds;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  var _kEvent = 'qowt:modelUpdate';
  var _dataSets = {};

  return _api;
});

