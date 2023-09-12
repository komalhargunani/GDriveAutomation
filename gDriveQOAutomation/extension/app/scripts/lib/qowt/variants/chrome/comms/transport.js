/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * A transport channel for communicating with Core.
 * @author Jelte Liebrand (jliebrand@google.com)
 */
 define([
    'qowtRoot/utils/typeUtils',
    'qowtRoot/variants/utils/resourceLocator',
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/dcp/commandHandler',
    'utils/xhr'
  ], function(
    TypeUtils,
    ResourceLocator,
    MessageBus,
    DcpCommandHandler,
    XHR) {

  'use strict';

  // private data
  var _workQueue = [],
      _responseFn,
      _initialised = false,
      _sendingBBD = false,
      _cacheLocation,
      _nextQueueId = 0;

  var _api = {
    /**
     * in chrome QOWT runs inside a sandbox'ed iframe. So to send the message to
     * the core we post it to the window's parent, in which the NaCl plugin
     * runs.
     * @param {!Object} payload to be sent
     * @param {!Function} callBack The callback to be invoked when message has
     *     been processed
     * @return {Object.queueId} the queueId if the payload has been queued, for
     * use with cancelQueueId
     * TODO: this function can throw an exception; how should we write that in
     * JSDoc tags?
     */
    sendMessage: function(payload, callBack) {
      if (typeof(callBack) !== 'function') {
        throw ("Chrome Transport sendMesssage must be given a valid callback" +
            " function!");
      }

      var queueInfo;
      if (payload.name === 'insertBBD') {
        queueInfo = _sendBlobOrGetQIdIfQueued(payload, callBack);
      } else if (!_lockAndSend(payload, callBack)) {
        queueInfo = _addToQueueAndGetQId(payload, callBack);
      }
      return queueInfo;
    },


    /**
     * Cancels a queued payload. If sendMessage is called while a Core response
     * is still pending, then the payload is queued. Calling cancelQueueId will
     * remove the payload off the queue, effectively cancelling it. If the
     * payload identified by queueId is no longer on the queue, the call to this
     * method will be a no-op. queueIds are returned by sendMessage for payloads
     * that are queued.
     * @param queueId
     *
     * TODO (dtilley): If the queue is only 1 long and we cancel that message
     * the transport will be locked with no response from the Core to unlock,
     * should this function check the queue and unlock if empty?
     */
    cancelQueueId: function(queueId) {
      for (var i = 0; i < _workQueue.length; i++) {
        if (_workQueue[i].queueId === queueId) {
          _workQueue.splice(i, 1);
          return;
        }
      }
    }
  };


   /**
    * Splits the payload into two.
    * 1) Inform core with the URI for a binary blob. This also means that core
    *    should note that the next information will be an array buffer with the
    *    blob.
    * 2) The binary blob of the image.
    * @param {Object} payload - payload with binary blob
    * @param {String} payload.name - insertBBD
    * @param {String} payload.loc - URI for the image
    * @param {Function} callBack - The callback to be invoked when message has
    *                              been processed
    * @return {Object.queueId | undefined} - the queueId if the payload has been
    *                               queued, for use with cancelQueueId
    * @private
    */
  var _sendBlobOrGetQIdIfQueued = function(payload, callBack) {
    var arrayBuffer;

    var blobUrl = ResourceLocator.pathToUrl(payload.loc);
    var xhr = new XHR({baseUrl: blobUrl, responseType: 'arraybuffer'});
    xhr.send().then(function(blob) {arrayBuffer = blob;});

    var bbdResponseCallBack = function() {
      if (!arrayBuffer) {
        window.setTimeout(bbdResponseCallBack, 50);
        return;
      }
      _sendingBBD = false;
      _lockAndSend(arrayBuffer, callBack);
    };
    return !_lockAndSend(payload, bbdResponseCallBack) ?
        _addToQueueAndGetQId(payload, bbdResponseCallBack) : undefined;
  };


   /**
    * @param {!Object} payload - payload to be sent
    * @param {!Function} callBack - The callback to be invoked when message has
    *                               been processed
    * @return {Object.queueId} the queueId if the payload has been queued, for
    * use with cancelQueueId
    * @private
    */
  var _addToQueueAndGetQId = function(payload, callBack) {
    var newQueueId = _nextQueueId++;
    _workQueue.push({
      payload: payload,
      callBack: callBack,
      queueId: newQueueId
    });
    return {queueId: newQueueId};
  };


  /**
   * Protecting our _responseFn, and _cacheLocation resources. Since this
   * module is asynchronous, but not reentrant as it has global state, we
   * need to enforce that the users of this module don't try to use it in
   * a reentrant way.
   *
   * @return {boolean} Whether this channel was locked.
   */
  var _lockTransport = function(callBack) {
    if (_responseFn) {
      return false;
    }
    _responseFn = callBack;
    return true;
  };

  /**
   * When _responseFn, and _cacheLocation are no longer needed for the
   * previous message, call this.
   *
   * @return {!Function} The callback to invoke when message has been
   *                     processed.
   */
  var _unlockTransport = function() {
    var oldResponseFn = _responseFn;
    if (!oldResponseFn) {
      throw new Error("Called _unlockTransport when " +
                      "transport was already unlocked");
    }
    _responseFn = undefined;
    _cacheLocation = undefined;
    // Do not dequeue until the Blob is transferred to core
    if (!_sendingBBD && _workQueue.length > 0) {
      var workItem = _workQueue.shift();
      _lockAndSend(workItem.payload, workItem.callBack);
    }
    return oldResponseFn;
  };

  var _lockAndSend = function(payload, callBack) {
    if (!TypeUtils.isObject(payload)) {
      throw new Error('Transport expects json objects for payload');
    }
    if (_sendingBBD || !_lockTransport(callBack)) {
      return false;
    }
    if (!_initialised) {
        MessageBus.listen(_handleDcpMessage, _dcpMessageFilter);
        MessageBus.listen(_handleAppUiMsg, _uiMsgFilter);
        _initialised = true;
    }
    if (payload.name === 'insertBBD') {
      _sendingBBD = true;
    }
    MessageBus.pushMessage({id: 'dcpRequest', content: payload});
    return true;
  };

  var _dcpMessageFilter = function(message) {
    var result = false;
    if(message && message.data && (message.data.id === 'dcp')) {
      result = true;
    }
    return result;
  };

  var _uiMsgFilter = function(message) {
    return !_dcpMessageFilter(message);
  };

  /**
   * Entry point for messages coming from the Core. It delegates to
   * the appropriate handler based on the the message type (binary,
   * DCP message or DCP command).
   *
   * @param {String} Incoming DCP message.
   */
  var _handleDcpMessage = function(message) {
    if(message && message.data && message.data.content) {
      var content = message.data.content;

      if (content instanceof ArrayBuffer) {
        _handleBinaryDcpResponse(content);
      } else {
        // TODO(chehayeb) so far the Core is not able to add the message
        // type for DCP responses. This is due to a limitation in Wessel
        // (crbug 310217). Once this is fixed, we will be able to get rid
        // of this work around. For now assume no type means dcpResponse
        var dcpMessageType = content.type || "dcpResponse";

        // delegate the data processing to the appropriate method.
        switch(dcpMessageType) {
        case 'dcpResponse':
          _handleDcpResponse(content);
          break;
        case 'dcpCommand':
          _handleDcpCommand(content);
          break;
        default:
          console.warn('unknown DCP message type: ' + dcpMessageType);
          break;
        }
      }
    }
  };

  /**
   * Handler for DCP commands. Unlike normal DCP responses, they do not
   * have associated a previous DCP request. They are initiated by the
   * core itself (for example, in response to an undo/redo action. Here
   * we just delegate its processing to the Command Handler.
   *
   * @param {Object} message Incoming JSON data.
   */
  var _handleDcpCommand = function(message) {
    // make sure we are handling a DCP command.
    if (!message.name || !message.type || (message.type !== 'dcpCommand')) {
      throw new Error('invalid message: expected command: ' + message);
    }
    // delegate the processing to the DCP command handler.
    DcpCommandHandler.handle(message);
  };

  /**
   * Handler for DCP responses.
   *
   * @param {Object} message Incoming JSON data.
   */
  var _handleDcpResponse = function(message) {
    if (message.name === "BBD") {
      // indicator from Core that the next message we will receive will
      // be binary data for an image, prepare our BLOB map for that data
      _cacheLocation = message.loc;
    } else {
      // This is a regular DCP response.
      var toCall = _unlockTransport();
      toCall(message);
    }
  };

  var _handleBinaryDcpResponse = function(content) {
    // Convert binary data in to a blob and store url
    if(content instanceof ArrayBuffer) {
      // only if we dont already have a blob for this url.
      if(ResourceLocator.pathToUrl(_cacheLocation) === undefined) {
        var dataView;
        try {
          dataView = new window.DataView(content);
          var blob = new window.Blob([dataView]);
          var url = window.URL.createObjectURL(blob);
          ResourceLocator.registerUrl(_cacheLocation, url);
        }
        catch(e) {
          console.log('error creating blob for data:');
          console.log(content);
          throw new Error('error receiving binary data from dcp');
        }
      }
    }
  };

  // TODO @lorrainemartin: Think about whether messages on the bus
  // should have a 'service' property so that they are more precisely
  // 'targeted' at an appropriate end point - e.g. handling the 'print'
  // message in this transport probably isn't ideal
  var _handleAppUiMsg = function(message) {
    if(message && message.data) {
      switch (message.data.id) {
        case 'print':
          window.print();
          break;

        default:
          break;
      }
    }
  };

  return _api;
 });

