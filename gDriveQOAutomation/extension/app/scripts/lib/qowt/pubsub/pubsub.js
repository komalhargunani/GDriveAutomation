define(['third_party/lo-dash/lo-dash.min'], function() {
  'use strict';

  /**
   * The Publisher/Subscriber is a singleton object that can be used by any
   * other object to publish QOWT events and subscribe to particular QOWT events
   * of interest. This allows communication to occur between QOWT objects
   * without those objects being tightly coupled and without the use HTML DOM
   * events.
   * @constructor
   */
  var PubSub = Object.create(Object.prototype, {
    subscriberCount:   { get: function() { return getSubscriberCount_(); }},
    registeredSignals: { get: function() { return _.keys(registry_); }},
    publishCount:      { get: function() { return publishCount_; }}
  });

  /**
   * PubSub.subscribe(signal, callback, opt_config);
   * @param {string} signal
   * @param {function(string, Object)} callback
   * @param {{once:boolean, after:boolean}} opt_config Behavior configuration
   * @returns {string} Subscription token, can be used to unsubscribe
   */
  PubSub.subscribe = function(signal, callback, opt_config) {
    if (!_.isString(signal) || !signal) {
      throw new TypeError('invalid signal');
    }
    if (!_.isFunction(callback)) {
      throw new TypeError('invalid callback');
    }
    opt_config = opt_config || {};
    opt_config.once = !!opt_config.once;
    opt_config.after = !!opt_config.after;
    return subscribe_(signal, callback, opt_config);
  };

  /**
   * PubSub.publish(signal, data);
   * @param {string} signal
   * @param {Object} opt_data
   * @returns {Promise} Resolves to subscriber callback return values
   */
  PubSub.publish = function(signal, opt_data) {
    if (!_.isString(signal) || !signal) {
      throw new TypeError('invalid signal');
    }
    opt_data = opt_data || {};
    return publish_(signal, opt_data);
  };

  /**
   * PubSub.doAction(action, context);
   * @param {string} action
   * @param {(Object|string)} opt_context
   * @returns {Promise} Resolves to subscriber callback return values
   */
  PubSub.doAction = function(action, opt_context) {
    if (!_.isString(action) || !action) {
      throw new TypeError('invalid action');
    }
    opt_context = opt_context || {};
    opt_context = _.isString(opt_context) ?
        {contentType: opt_context} : opt_context;
    return doAction_(action, opt_context);
  };

  /**
   * PubSub.unsubscribe(token);
   * @param {?string} token
   * @returns {Object} Removed subscriber details
   */
  PubSub.unsubscribe = function(token) {
    if (token === undefined) {
      return;
    }
    if (!_.isString(token) || !token) {
      throw new TypeError('invalid token');
    }
    return unsubscribe_(token);
  };

  /**
   * PubSub.subscriberCountForSignal(signal);
   * @param {string} signal
   * @returns {number}
   */
  PubSub.subscriberCountForSignal = function(signal) {
    if (!_.isString(signal) || !signal) {
      throw new TypeError('invalid signal');
    }
    return getSubscriberCount_(signal);
  };

  /** PubSub.clear(); // Removes all registered signals and subscribers */
  PubSub.clear = clear_;

  /** PubSub.reset(); // Resets all internal state */
  PubSub.reset = reset_;


  /** @private */
  var registry_ = {},
      lastToken_ = 0,
      publishCount_ = 0;


  function subscribe_(signal, callback, config) {
    var token = (++lastToken_).toString();
    registry_[signal] = registry_[signal] || [];
    registry_[signal].push({
      token: token,
      callback: callback,
      config: config
    });
    return token;
  }


  function publish_(signal, data) {
    // Ensure registry arrays are not modified here or in a callback by copying
    // the subscriber objects into the following temporary arrays
    var callbackQueue = [],
        callbackAfterQueue = [],
        callbackResults = [],
        toUnsubscribe = [];
    if (registry_[signal] && registry_[signal].length) {
      publishCount_++;
      registry_[signal].forEach(function(subscriber) {
        if (subscriber.config.after) {
          callbackAfterQueue.push(subscriber);
        } else {
          callbackQueue.push(subscriber);
        }
        if (subscriber.config.once) {
          toUnsubscribe.push(subscriber);
        }
      });
      callbackQueue.concat(callbackAfterQueue).forEach(function(subscriber) {
        callbackResults.push(subscriber.callback(signal, data));
      });
      toUnsubscribe.forEach(function(subscriber) {
        unsubscribe_(subscriber.token);
      });
    }
    return Promise.all(callbackResults);
  }


  function doAction_(action, context) {
    return publish_('qowt:doAction', {
      action: action,
      context: context
    });
  }


  function unsubscribe_(token) {
    var removed;
    // use Array.some here to short circuit the loop when token is found
    _.values(registry_).some(function(subscribers) {
      return subscribers.some(function(subscriber, index) {
        if (subscriber.token === token) {
          // splice returns an array so select its first item
          removed = subscribers.splice(index, 1)[0];
          return true;
        }
        return false;
      });
    });
    return removed;
  }


  function getSubscriberCount_(opt_signal) {
    var count = 0;
    if (opt_signal) {
      count = registry_[opt_signal] ? registry_[opt_signal].length : 0;
    } else {
      count = _.values(registry_).reduce(function(sum, subscribers) {
        return sum + subscribers.length;
      }, 0);
    }
    return count;
  }


  function clear_() {
    registry_ = {};
  }


  function reset_() {
    clear_();
    lastToken_ = 0;
    publishCount_ = 0;
  }


  return PubSub;
});
