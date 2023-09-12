/**
 * @fileoverview
 * Testing utility module to track and report test pollution
 * created between Jasmine test specs, including nodes added
 * to the DOM, QOWT PubSub subscribers and event listeners.
 *
 * @author dtilley@google.com (Dan Tilley)
 */

// NOTE: This module needs to be loaded before any others so
// that the following non-module code is executed first.
// Likewise, if/when we move to Karma for our unit tests,
// we will need to hoist this up such that we set this
// before we load any of our QOWT tests.
var nativeAddListener_ = EventTarget.prototype.addEventListener,
    nativeRemoveListener_ = EventTarget.prototype.removeEventListener,
    addedListeners_ = {};

(function() {

  'use strict';

  EventTarget.prototype.addEventListener = function(eventName) {
    var listenerName = eventName + '_' + this.toString();
    addedListeners_[listenerName] = addedListeners_[listenerName] ?
        addedListeners_[listenerName] += 1 : 1;
    return nativeAddListener_.apply(this, arguments);
  };

  EventTarget.prototype.removeEventListener = function(eventName) {
    var listenerName = eventName + '_' + this.toString();
    if (addedListeners_[listenerName]) {
      addedListeners_[listenerName]--;
      if (addedListeners_[listenerName] < 1) {
        delete addedListeners_[listenerName];
      }
    }
    return nativeRemoveListener_.apply(this, arguments);
  };

})();

define([
  'qowtRoot/pubsub/pubsub',
  'third_party/lo-dash/lo-dash.min'], function(
  PubSub
  /* lo-dash provides _ utilities */) {

  'use strict';

  var api_ = {

    /**
     * Should be called in the beforeEach,
     * saves a snapshot of the HTML, PubSub subscribers & event listeners.
     */
    cacheTestState: function() {
      domPollution_.saveCache();
      subscriberPollution_.saveCache();
      listenerPollution_.saveCache();
      snapShotSaved_ = true;
    },

    /**
     * Should be called in the afterEach,
     * checks the current state against the saved snapshot
     * and produces a report of any leftover nodes, subscribers or listeners.
     * @return {Object} with the format:
     *         {
     *            pollutant: {String}
     *              {
     *                 before {Integer}
     *                 after  {Integer}
     *                 details {String}
     *              }
     *         }
     */
    getPollutionDetails: function() {
      if (!snapShotSaved_) {
        throw new Error('No cache snapshot was saved');
      }
      var leftovers = {},
          domLeftovers = domPollution_.diffCache(),
          subscriberLeftovers = subscriberPollution_.diffCache(),
          listenerLeftovers = listenerPollution_.diffCache();
      if (domLeftovers) {
        leftovers.node = domLeftovers;
      }
      if (subscriberLeftovers) {
        leftovers.subscriber = subscriberLeftovers;
      }
      if (listenerLeftovers) {
        leftovers['event listener'] = listenerLeftovers;
      }
      return Object.keys(leftovers).length ? leftovers : undefined;
    },

    /**
     * Delete all data and zero all variables.
     */
    reset: function() {
      snapShotSaved_ = false;
      domPollution_.reset();
      subscriberPollution_.reset();
      listenerPollution_.reset();
    }

  };

  // PRIVATE ===================================================================

  function DomPollution() {
    this.cache = {};
  }

  DomPollution.prototype = {
    __proto__: Object.prototype,

    reset: function() {
      this.cache = {};
    },

    getDom: function() {
      return document.body.querySelectorAll('*');
    },

    saveCache: function() {
      var dom = this.getDom();
      this.cache.count = dom.length;
      this.cache.asStrings = this.asStrings(dom);
    },

    diffCache: function() {
      var dom = this.getDom();
      if (dom.length > this.cache.count) {
        var asStrings = this.asStrings(dom);
        return {
          before: this.cache.count,
          after: dom.length,
          detail: _.difference(asStrings, this.cache.asStrings).join(' ')
        };
      } else {
        return undefined;
      }
    },

    asStrings: function(dom) {
      return Array.prototype.map.call(dom, this.nodeStr);
    },

    nodeStr: function(node, index) {
      return '<' + node.nodeName + index +
        (node.id ? ' id="' + node.id + '"' : '') + '>';
    }
  };

  function SubscriberPollution() {
    this.cache = {};
  }

  SubscriberPollution.prototype = {
    __proto__: Object.prototype,

    reset: function() {
      this.cache = {};
    },

    saveCache: function() {
      this.cache.count = PubSub.subscriberCount;
      this.cache.asStrings = this.asStrings(getSubscribersPerSignal_());
    },

    diffCache: function() {
      var subCount = PubSub.subscriberCount,
          asStrings = this.asStrings(getSubscribersPerSignal_()),
          extraSubs = _.difference(asStrings, this.cache.asStrings),
          missingSubs = _.difference(this.cache.asStrings, asStrings);
      if (extraSubs.length) {
        return {
          before: this.cache.count,
          after: subCount,
          detail: extraSubs.join(' ')
        };
      } else if (missingSubs.length) {
        return {
          before: this.cache.count,
          after: subCount,
          detail: missingSubs.join(' ')
        };
      } else {
        return undefined;
      }
    },

    asStrings: function(subs) {
      return _.map(subs, function(count, signal) {
        return signal + '(' + count + ')';
      });
    }
  };

  function getSubscribersPerSignal_() {
    var subs = {};
    PubSub.registeredSignals.forEach(function(signal) {
      subs[signal] = PubSub.subscriberCountForSignal(signal);
    });
    return subs;
  }

  function ListenerPollution() {
    this.cache = {};
  }

  ListenerPollution.prototype = {
    __proto__: Object.prototype,

    reset: function() {
      this.cache = {};
    },

    saveCache: function() {
      this.cache.count = this.listenerCount(addedListeners_);
      this.cache.asStrings = this.asStrings(addedListeners_);
    },

    diffCache: function() {
      var count = this.listenerCount(addedListeners_);
      if (count > this.cache.count) {
        var asStrings = this.asStrings(addedListeners_);
        return {
          before: this.cache.count,
          after: count,
          detail: _.difference(asStrings, this.cache.asStrings).join(' ')
        };
      } else {
        return undefined;
      }
    },

    asStrings: function(listeners) {
      return _.map(listeners, function(count, event) {
        return event + '(' + count + ')';
      });
    },

    listenerCount: function(listeners) {
      return _.reduce(listeners, function(sum, count) {
        return sum + count;
      });
    }
  };

  var snapShotSaved_ = false,
      domPollution_ = new DomPollution(),
      subscriberPollution_ = new SubscriberPollution(),
      listenerPollution_ = new ListenerPollution();

  return api_;

});
