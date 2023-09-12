// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Promise-based wrapper for requests to our transport channel.
 */
define([
    'qowtRoot/variants/comms/transport',
    'qowtRoot/utils/promiseUtils',
    'qowtRoot/utils/typeUtils'
    ], function(
      Transport,
      PromiseUtils,
      TypeUtils) {

  'use strict';

  var api_ = {

    /**
     * Sends payload to our transport.
     * @param payload {Object|Promise} the payload to send as a JSONnable
     *     object.
     * @param cancelPromise {Promise} reject this to abort the send.
     * @returns {Promise} the promise with the payload.
     */
    send: function(payload, cancelPromise) {
      TypeUtils.checkArgTypes('Request.send', {
        cancelPromise: [cancelPromise, 'promiseLike']
      });

      var transportToken;

      var sendPromise = PromiseUtils.cast(payload).then(function(payloadValue) {
        TypeUtils.checkArgTypes('Request.send', {
          payload: [payload, 'object']
        });

        return new Promise(function(resolve) {
          transportToken = Transport.sendMessage(payloadValue, resolve);
        });
      });

      cancelPromise = cancelPromise.catch(function(reason) {
        if (transportToken && transportToken.queueId) {
          Transport.cancelQueueId(transportToken.queueId);
        }
        throw reason;
      });

      return Promise.race([cancelPromise, sendPromise]);
    }
  };

  return api_;
});
