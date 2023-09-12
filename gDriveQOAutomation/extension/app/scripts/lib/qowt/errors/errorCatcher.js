/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview catches errors and sync's them across
 * the msg bus. Then dispatches them to registered observers.
 *
 * Both the app and QOWT have one catcher instance, but
 * each have different observers.
 *
 * This is a singleton
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/errors/qowtError',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/qowtException'], function(
  TypeUtils,
  MsgBus,
  PubSub,
  QOWTError,
  QOWTSilentError,
  QOWTException) {

  'use strict';

  var ErrorCatcher = {

    /**
     * Initialise the catcher, causing it to listen
     * for error events in this window and set up
     * it's sync'ing logic with the msg bus.
     */
    init: function() {
      // TODO(jliebrand): remove this once we have fixed all old
      // code to use the new error system (see http://crbug/351431)
      psToken_ = PubSub.subscribe('qowt:error', handleDeprecatedError_);

      window.addEventListener('error', uncaughtException_);
      MsgBus.listen(receiveError_, errorFilter_);

      // Don't truncate stack traces.
      Error.stackTraceLimit = Infinity;
    },

    /**
     * Reset the catcher. Useful in unit tests to
     * remove any listeners etc.
     * NOTE: since the ErrorCatcher itself is the trigger
     * for a pubsub qowt:disable, we do not listen for that
     * ourselves... we are always "active". This function
     * is really only here for unit tests
     */
    reset: function() {
      PubSub.unsubscribe(psToken_);
      window.removeEventListener('error', uncaughtException_);
      MsgBus.stopListening(receiveError_);
      observers_ = [];
    },

    /**
     * When the client code does not want to break
     * it's flow by throwing an error, it can call
     * this function passing the error directly to
     * the catcher.
     *
     * @param {Error} error the error object (instanceOf Error)
     */
    handleError: function(error) {
      handleError_(error);
    },

    /**
     * Add an error observer.
     * Will get notified of all errors.
     *
     * @param {Function} obs the observing function
     */
    addObserver: function(obs) {
      if (TypeUtils.isFunction(obs)) {
        observers_.push(obs);
      } else {
        console.warn('Error observer must be a function');
      }
    },

    /**
     * return all observers. Useful for unit testing
     *
     * @return {Array} the array of all observer functions
     */
    observers: function() {
      return observers_;
    },

    lastError: function() {
      return errorLog_[errorLog_.length - 1];
    }
  };

  // -------------------- PRIVATE ----------------

  var SYNCID = 'errorSync';
  var observers_ = [];
  var world_ = (window.name === 'sandbox' ? 'QOWT' : 'App');
  var psToken_;
  var errorLog_ = [];

  /**
   * callback for uncaught exceptions on this window
   *
   * @param {ErrorEvent} evt the error event
   */
  function uncaughtException_(evt) {
    if (evt.error) {
      var str = (evt.error.name || evt.error.message) ?
          (evt.error.name + ': ' + evt.error.message) :
          evt.error;
      console.error('%s caught js exception: %s', world_, str);
      console.error(evt.error.stack);
      // for built in errors, fatal is not defined so
      // we set it to true as default.
      if (evt.error.fatal === undefined) {
        evt.error.fatal = true;
      }
      handleError_(evt.error);
    } else {
      console.error(evt);
    }
  }

  /**
   * Handle old deprecated qowt:error pubsub signals
   *
   * @param {string} signal the signal that was fired ('qowt:error')
   * @param {Object} error the old deprecated error object
   */
  function handleDeprecatedError_(signal, error) {
    signal = signal || '';
    console.log('%s caught deprecated error', world_);
    console.log(error);
    error.isDeprecatedError = true;
    handleError_(error);
  }

  /**
   * handle the actual error
   *
   * @param {Error} error the error (instanceof Error)
   */
  function handleError_(error) {
    if (error instanceof Error) {
      // true errors (like syntax errors), should be fatal unless
      // it's specifically stated that it's not fatal
      if (error.fatal === undefined) {
        error.fatal = true;
      }
    } else {
      error = convert_(error);
    }

    errorLog_.push(error);

    dispatchError_(error);
    syncError_(error);
  }

  /**
   * Dispatch error to all observers. Catches and
   * ignores any further exceptions that the observer
   * might make to avoid eternal looping.
   *
   * @param {Error} error the error (instanceof Error)
   */
  function dispatchError_(error) {
    console.log('%s dispatching error to observers', world_);
    observers_.forEach(function(obs) {
      try {
        obs.call(obs, error);
      } catch(err) {
        // we ignore additional errors thrown in the observers. Since if we
        // were to handle these with our observers, we could get in to an
        // eternal loop... warn in the console though
        var name = obs.name || '';
        console.warn('Error observer %s threw an exception; ignored', name);
        console.warn(err.stack);
      }
    });
  }

  /**
   * Sync this error over the message bus to other catchers
   *
   * @param {Error} error the error (instanceof Error)
   */
  function syncError_(error) {
    // set the isSynced boolean to avoid cyclic sending of errors
    // between app and qowt.
    if (!error.isSynced) {
      console.log('%s pushing error to msg bus', world_);

      // create a clone json object that we can stringify
      // and ensure the details from the original
      // error prototype are sent along as well.
      // TODO(jliebrand): remove this if/when http://crbug/351434 is fixed
      var clone = _.extend({}, error);
      clone.name = error.name;
      clone.message = error.message;
      clone.stack = error.stack;

      // TODO(jliebrand): the message bus should queue pushed messages
      // if it's not yet connected to another window. Once it's connected
      // it can then sync the queued messages. Right now, pushMessage will
      // throw an exception if the bus isn't connected yet; which is bad
      // because the client should not care about it. For now, guarding against
      // this edge case here (especailly for unit test cases), but we need
      // to make the bus more robust. see http://crbug/348638
      try {
        MsgBus.pushMessage({
          id: SYNCID,
          // TODO(jliebrand): fix http://crbug/349539 so that we do
          // not have to stringify here
          error: JSON.stringify(clone)
        });
      } catch(e) {}
    }
  }

  /**
   * Receive an error from the msg bus and handle it
   *
   * @param {Object} msg the message containing the error
   */
  function receiveError_(msg) {
    if (msg && msg.data && msg.data.error) {
      console.log('%s receiving error from msg bus', world_);
      var error = castError_(JSON.parse(msg.data.error));
      error.isSynced = true;
      handleError_(error);
    }
  }

  /**
   * MsgBus filter to ensure we only get errorSync msg's
   *
   * @param {Object} msg the msg on the bus
   */
  function errorFilter_(msg) {
    return (msg && msg.data && msg.data.id === SYNCID);
  }


  /**
   * when we sync an Error via the msg bus, we will receive
   * just the JSON Object representation of the Error. Cast
   * it back to a real Error object based on it's name
   *
   * TODO(jliebrand): remove this if/when http://crbug/351434 is fixed
   *
   * @param {Object} err the json error object
   */
  function castError_(err) {
    var error = {};
    var validTypes = [
      // built in
      'Error',
      'EvalError',
      'RangeError',
      'ReferenceError',
      'SyntaxError',
      'TypeError',
      'URIError',

      // qowt
      'QOWTError',
      'QOWTSilentError',
      'QOWTException'
    ];

    if (validTypes.indexOf(err.name) !== -1) {
      console.log('cast to %s', err.name);

      // construct the correct error object based on name
      // eg new window.TypeError or new window.ScriptError etc
      error = new window[err.name]();
    } else {
      // default to normal built in error
      console.log('cast fallback to Error');
      error = new Error();
    }

    // this will override all the properties of our newly created
    // Error object, and thus things like the stack trace should
    // be accurate.
    _.extend(error, err);

    // if the original error didn't have a stack, then ensure we
    // remove the stack from this new error we generated here
    if (err.stack === undefined) {
      error.stack = undefined;
    }

    return error;
  }


  /**
   * Converts old deprecated qowt:error objects and
   * badly formed exceptions (eg if someone did: throw 'just a string');
   *
   * @param {anything} err the exception which is not an instanceof Error
   * @return {QOWTError | QOWTException}
   */
  function convert_(err) {
    console.log('%s converting deprecated/bad error', world_);
    var error;
    switch (true) {
      case (TypeUtils.isObject(err) && (err.isDeprecatedError)):
        // old deprecated qowt:error
        var conf = {
          title: (err.errorId ? err.errorId + '_short_msg' : undefined),
          details: (err.errorId ? err.errorId + '_msg' : undefined),
          linkData: err.linkData,
          message: err.additionalInfo
        };
        error = err.fatal ? new QOWTException(conf) :
            err.silent ? new QOWTSilentError(conf) : new QOWTError(conf);
        break;

      case (TypeUtils.isNumber(err)):
        error = new QOWTException({code: err});
        break;

      case (TypeUtils.isString(err)):
        error = new QOWTException(err);
        break;

      default:
        // assume fatal errors by default
        error = new QOWTException(err.toString());
        break;
    }

    // since we are converting bad errors which did not have a stack
    // trace to begin with, we should not keep the stack trace of this
    // newly created error here. It would lead to confusion
    error.stack = undefined;

    return error;
  }

  return ErrorCatcher;
});