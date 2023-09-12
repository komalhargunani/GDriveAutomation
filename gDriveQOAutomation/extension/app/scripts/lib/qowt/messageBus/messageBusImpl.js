// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * Message Bus Impl
 * ================
 *
 * @fileoverview The Message Bus Impl module provides the
 * constructor method to create a Message Bus instance, and its API.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/configs/common',
  'qowtRoot/third_party/when/when'],
  function(
    TypeUtils,
    CommonConfig,
    when) {

  'use strict';

  /**
   * Constructor method to create a Message Bus instance.
   *
   * @constructor
   * @param {object} opt_TEST_myWin An optional HTML window object.
   *                                This is only used for testing, to create
   *                                different message bus instances which are
   *                                listening on different window objects
   */
  var MessageBusImpl = function(opt_TEST_myWin) {
    this.myWin_ = opt_TEST_myWin || window;
    this.pendingConnections_ = [];
    this.acceptedConnections_ = [];
    this.completedConnections_ = [];
    this.acknowledgements_ = [];
    this.listeners_ = [];
    this.msgQueue_ = [];
    this.pendingMsgs_ = [];

    // listen for incoming messages on the window
    // in which this message bus instance exists
    this.myWin_.addEventListener('message',
      this.handleIncomingMessage_.bind(this),
      false);
  };

  MessageBusImpl.prototype = Object.create(Object.prototype);
  MessageBusImpl.prototype.constructor = MessageBusImpl;

  /**
   * Connects this message bus instance to another 'environment context',
   * the entry point of which is the provided HTML window object.
   * That environment context should have its own message bus instance too,
   * which in turn is, or will be, connect()-ed to this message bus instance.
   *
   * Note that the connect operation is asynchronous since it uses internal
   * 'handshake' messages to verify that a two-way connection can be
   * established between this message bus instance and the other one.
   * Both message bus instances must successfully connect() to the other
   * for each individual connect() call to be deemed successful.
   *
   * This method returns a promise which is resolved when the asynchronous
   * connection process is successfully completed; the promise is rejected
   * if this doesn't happen within a certain time threshold.
   *
   * After being successfully connected to one or more other message bus
   * instances any message that is pushed onto this bus will be relayed to
   * the other environment contexts. In effect, connected message bus instances
   * ‘sync’ with each other via their window objects.
   *
   * @param {object} win An HTML window object
   * @param {function or undefined} opt_callbackFunc An optional callback
   *                                function which is invoked as soon as
   *                                the connection has been established
   * @return {promise} The returned promise
   */
  MessageBusImpl.prototype.connect = function(win, opt_callbackFunc) {
    if(!win || (win === null) || !TypeUtils.isObject(win) ||
      (!win.postMessage)) {
      throw new Error('MessageBus: A valid HTML window object has ' +
        'not been provided to connect()');
    }

    if(win === this.myWin_) {
      throw new Error('MessageBus: Trying to connect to its own window');
    }

    if(opt_callbackFunc && !TypeUtils.isFunction(opt_callbackFunc)) {
      throw new Error('MessageBus: The provided callback function ' +
        'is not of the correct type');
    }

    var len = this.pendingConnections_.length;
    for(var i = 0; i < len; i++) {
      if(this.pendingConnections_[i].win === win) {
        throw new Error('MessageBus: Trying to connect to a window ' +
          'that we are already trying to connect to');
      }
    }

    len = this.acceptedConnections_.length;
    for(i = 0; i < len; i++) {
      if(this.acceptedConnections_[i].win === win) {
        throw new Error('MessageBus: Trying to connect to a window ' +
          'that we are already trying to connect to');
      }
    }

    len = this.completedConnections_.length;
    for(i = 0; i < len; i++) {
      if(this.completedConnections_[i].win === win) {
        throw new Error('MessageBus: Trying to connect to a window ' +
          'that has already been connected');
      }
    }

    var obj = {
      win: win,
      callback: opt_callbackFunc,
      currentWaitTime: 0,
      deferred: when.defer()
    };
    this.pendingConnections_.push(obj);
    this.tryToConnect_(obj);
    return obj.deferred.promise;
  };

  /**
   * Pushes a message onto this message bus instance.
   * The message will be relayed to each environment
   * context that this bus has been connect()-ed to.
   *
   * Note that this method should not be called until
   * this message bus instance has been successfully
   * connected to at least one other message bus instance
   *
   * @param {object} msg A message object
   */
  MessageBusImpl.prototype.pushMessage = function(msg) {
    if(!TypeUtils.isObject(msg)) {
      throw new Error('MessageBus: A valid message object has ' +
        'not been provided to pushMessage()');
    }

    var len = this.completedConnections_.length;
    if(len === 0) {
      // buffer any messages that we can't send yet
      this.pendingMsgs_.push(msg);
      return;
    }

    markAsQuickofficeMsg_(msg);

    if(this.msgQueue_.length >= kQueue_Max_Length_) {
      this.msgQueue_.shift();
    }
    this.msgQueue_.push(msg);

    for(var i = 0; i < len; i++) {
      this.completedConnections_[i].win.postMessage(msg, '*');
    }
  };

  /**
   * Registers a listener function with this message bus instance.
   * The listener function will be invoked whenever a new message
   * is pushed onto a message bus instance that this message bus
   * instance is connect()-ed to.
   *
   * If a 'filter’ function is also specified then the listener function
   * will only be invoked for those messages that ‘match’ the filter.
   * The filter function must take a message as a parameter and return a
   * boolean - true if the message 'matches' the filter, otherwise false.
   *
   * The listen() method can be used repeatedly to set up several
   * listener functions on this message bus instance.
   *
   * @param {function} listenerFunc A listener function
   * @param {function or undefined} opt_filterFunc An optional filter function,
   *                                which must take a message as a parameter
   *                                and return a boolean
   */
  MessageBusImpl.prototype.listen = function(listenerFunc, opt_filterFunc) {
    if(!TypeUtils.isFunction(listenerFunc)) {
      throw new Error('MessageBus: A valid listener function has ' +
        'not been provided to listen()');
    }

    if(opt_filterFunc && !TypeUtils.isFunction(opt_filterFunc)) {
      throw new Error('MessageBus: The provided filter function ' +
        'is not of the correct type');
    }

    this.listeners_.push({
      listener: listenerFunc,
      filter: opt_filterFunc
    });
  };

  /**
   * Unregisters a listener function from this message bus instance.
   * After being unregistered the listener function will no longer be
   * invoked whenever a new message is pushed onto a message bus instance
   * that this message bus instance is connect()-ed to.
   *
   * @param {function} listenerFunc The listener function to unregister
   */
  MessageBusImpl.prototype.stopListening = function(listenerFunc) {
    if(!TypeUtils.isFunction(listenerFunc)) {
      throw new Error('MessageBus: A valid listener function has ' +
        'not been provided to stopListening()');
    }

    var len = this.listeners_.length;
    for(var i = 0; i < len; i++) {
      if(this.listeners_[i].listener === listenerFunc) {
        this.listeners_.splice(i, 1);
        break;
      }
    }
  };

  /**
   * Checks whether this message bus instance is connected
   * to the 'environment context' whose entry point is the
   * given HTML window object.
   *
   * @param {object} win An HTML window object
   * @return {boolean} True if this message bus instance
   *                   is connected to the given window,
   *                   otherwise false
   */
  MessageBusImpl.prototype.isConnectedTo = function(win) {
    var result = false;
    var len = this.completedConnections_.length;
    for(var i = 0; i < len; i++) {
      if(win === this.completedConnections_[i].win) {
        result = true;
        break;
      }
    }
    return result;
  };

  // ------- THESE METHODS SHOULD NOT BE INVOKED EXTERNALLY -------

  MessageBusImpl.prototype.tryToConnect_ = function(obj) {
    // try to connect to the desired window, but not forever
    if(obj.currentWaitTime > CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT) {
      this.handleTimeOut_(obj);
    }
    else {
      obj.currentWaitTime += CommonConfig.kMESSAGE_BUS_CONNECTION_RETRY;

      if(this.pendingConnections_.indexOf(obj) !== -1) {
        obj.win.postMessage(kConnectionRequest_, '*');
      }

      obj.timeoutId = setTimeout(this.tryToConnect_.bind(this, obj),
        CommonConfig.kMESSAGE_BUS_CONNECTION_RETRY);
    }
  };

  MessageBusImpl.prototype.handleTimeOut_ = function(obj) {
    // augment the error if we have details about when
    // the app and qowt attempted their connections. This
    // allows us to determine if either did not try to
    // connect, or if the handshaking failed
    // TODO(jliebrand): THIS IS A TEMP SOLUTION! We are
    // only adding this to allow us to analyse Google Analytics
    // data in the wild. Once we determine the root cause
    // of connection failures, we should remove this and
    // make the msg bus impl generic (no qowt/app references)
    var errorMsg = CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT_MSG;

    if (window.connectFromAppToQowt) {
      // we are in the app and have at least some time stamps

      if (!window.connectFromQowtToApp) {
        errorMsg += ":qowt failed to connect";
      } else {
        // check if qowt connected later than 80% in to our time out
        var gap = Math.abs(Math.round(window.connectFromQowtToApp -
          window.connectFromAppToQowt) / 1000);
        var threshold = Math.round(
          CommonConfig.kMESSAGE_BUS_CONNECTION_TIMEOUT / 1000 * 0.8);
        if (gap > threshold) {
          // a message bus connect() call by the App and one by QOWT
          // occurred with a significant delay between them, which may
          // explain why the App's connect() call has timed out.
          // Basically the handshake only had 20% of the time out left
          // to complete.
          // We use a generic error message to report this case in
          // GA so that repeated instances of this will be grouped
          // together and thus give a clear indication of its impact
          // Note: if this is happening a lot, we should probably reset
          // the msg bus time out timer when we receive the qowt connect
          errorMsg += ":qowt too late to connect";
        } else {
          errorMsg += ":qowt and app connected:handshake failed?";
        }
      }
    }

    obj.deferred.reject(new Error(errorMsg));
  };

  MessageBusImpl.prototype.handleIncomingMessage_ = function(msg) {
    if(msg) {
      // check for circular dependencies between message bus instances,
      // which would result in a message that was pushed onto this message
      // bus instance (via pushMessage()) ending up back on this message bus
      // instance (via handleIncomingMessage_())
      if(this.msgQueue_.indexOf(msg.data) !== -1) {
        throw new Error('MessageBus: A message that was pushed onto this' +
          'bus has arrived back on it - we have a circular dependancy!');
      }

      if(msg.data === kConnectionRequest_) {
        this.handleConnectionRequestMsg_(msg);
      }
      else if(msg.data === kConnectionAccepted_) {
        this.handleConnectionAcceptedMsg_(msg);
      }
      else if(msg.data === kConnectionAck_) {
        this.handleConnectionAckMsg_(msg);
      }
      else if(isMarkedAsQuickofficeMsg_(msg)) {
        this.handleClientMsg_(msg);
      }
      // Otherwise, don't handle the message. It could be
      // coming from some 3rd-party extension, such as ChromeVox
    }
  };

  MessageBusImpl.prototype.handleConnectionRequestMsg_ = function(msg) {
    // a window is asking to connect to us - send it back an accepted message
    if(!msg.source) {
      throw new Error('MessageBus: Unknown source of ' +
        'qoConnectionRequest message');
    }
    msg.source.postMessage(kConnectionAccepted_, '*');
  };

  MessageBusImpl.prototype.handleConnectionAcceptedMsg_ = function(msg) {
    // a window that we've been trying to connect to has accepted
    if(!msg.source) {
      throw new Error('MessageBus: Unknown source of ' +
        'qoConnectionAccepted message');
    }

    var len = this.pendingConnections_.length;
    for(var i = 0; i < len; i++) {
      if(this.pendingConnections_[i].win === msg.source) {
        var removedElms = this.pendingConnections_.splice(i, 1);
        var obj = removedElms[0];
        var idx = this.acknowledgements_.indexOf(msg.source);
        if(idx === -1) {
          // we don't yet have an acknowledgement from the other side that
          // we've accepted a connection request from them (perhaps the
          // acknowledgement has just not arrived yet, or perhaps the other
          // side hasn't even sent a connection request yet) so we don't yet
          // have a two-way connection. So move pending -> accepted
          this.acceptedConnections_.push(obj);
        }
        else {
          // we have an acknowledgement from the other side that we've already
          // accepted a connection request from them, so we now have a two-way
          // connection. So move pending -> completed, and invoke the callback
          this.acknowledgements_.splice(idx, 1);
          this.connectionCompleted_(obj);
        }

        // finally, acknowledge to the other side that we have
        // received their acceptance of our connection request message.
        // Note that it is important to do this AFTER the callback has
        // been invoked above, so that the callback can do its work
        // (e.g. call listen() to add listeners) before the other side
        // gets the go-ahead to start sending client messages
        obj.win.postMessage(kConnectionAck_, '*');
        break;
      }
    }
  };

  MessageBusImpl.prototype.handleConnectionAckMsg_ = function(msg) {
    // a window is acknowledging that we have accepted their connection request
    if(!msg.source) {
      throw new Error('MessageBus: Unknown source of ' +
        'qoConnectionAck message');
    }

    var len = this.acceptedConnections_.length;
    for(var i = 0; i < len; i++) {
      if(this.acceptedConnections_[i].win === msg.source) {
        // the other side has already accepted a connection request from us,
        // so we now have a two-way connection. So move accepted -> completed,
        // and invoke the callback
        var removedElms = this.acceptedConnections_.splice(i, 1);
        var obj = removedElms[0];
        this.connectionCompleted_(obj);
        return;
      }
    }

    // store this acknowledgement message (for later processing)
    // if the sender was not already in our accepted list
    this.acknowledgements_.push(msg.source);
  };

  MessageBusImpl.prototype.handleClientMsg_ = function(msg) {
    // a window has sent a client message
    if(!msg.source) {
        return;
    }

    // callback the appropriate listeners.
    // Clone the listener array so that if a listener
    // removes itself from the array (e.g stopListening())
    // during its callback then we will still safely loop
    // through the remaining listeners
    var clonedListeners = this.listeners_.slice();
    var len = clonedListeners.length;
    for (var i = 0; i < len; i++) {
      var listener = clonedListeners[i];
      if (listener &&
        ((!listener.filter) || listener.filter.call(this, msg))) {
          listener.listener.call(this, msg);
      }
    }

    // relay the message to all the connect()-ed environment contexts
    // except the one that the incoming message was received from
    // TODO @lorrainemartin: Imagine a scenario where environment contexts
    // A, B and C are all connected to each other (A to B & C, B to A & C
    // and C to A & B) and B calls pushMessage() - this would result in an
    // infinite loop occuring whereby all of the contexts, including B,
    // repeatedly receive the message (the 'source' property would change
    // from being B when it is relayed). How can we ensure that a message
    // is only received once by each environment context, excluding the
    // one that called pushMessage() ?
    len = this.completedConnections_.length;
    for(i = 0; i < len; i++) {
      if(this.completedConnections_[i].win !== msg.source) {
        this.completedConnections_[i].win.postMessage(msg.data, '*');
      }
    }
  };

  MessageBusImpl.prototype.connectionCompleted_ = function(obj) {
    this.completedConnections_.push(obj);
    clearTimeout(obj.timeoutId);
    if(obj.callback) {
      obj.callback.call(this);
    }
    // send any pending messages that were already attempted to be sent
    while (this.pendingMsgs_.length > 0) {
      this.pushMessage(this.pendingMsgs_.shift());
    }
    obj.deferred.resolve();
  };

  // -------------------- PRIVATE ---------------------

  var kQueue_Max_Length_ = 10,
  kConnectionRequest_ = 'qoConnectionRequest',
  kConnectionAccepted_ = 'qoConnectionAccepted',
  kConnectionAck_ = 'qoConnectionAck';

  var markAsQuickofficeMsg_ = function(msg) {
    if (!TypeUtils.isObject(msg)) {
      throw new Error('Cannot mark non-object value as quickoffice message');
    }
    msg.qoMessageBus = true;
  };

  var isMarkedAsQuickofficeMsg_ = function(msg) {
    return msg && msg.data && (msg.data.qoMessageBus === true) &&
      (msg.origin === 'chrome-extension://gbkeegbaiigmenfmjfclcdgdpimamgkj' ||
       msg.origin === 'chrome-extension://bpmcpldpdmajfigpchkicefoigmkfalc' ||
       msg.origin === 'chrome-extension://ehibbfinohgbchlgdbfpikodjaojhccn');
  };

  return MessageBusImpl;
});
