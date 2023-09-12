/**
 * @fileoverview Notification Area UI Widget.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/widgets/factory'
  ], function(
    PubSub,
    WidgetFactory
  ) {

  'use strict';

  var _api = {

    create: function() {
      _setupHTML();
      _hide(true);
      return _api;
    },

    confidence: function(config) {
      var score = 0;
      if (config && config.type && config.type === 'notification') {
        score = 100;
      }
      return score;
    },

    init: function() {
      _init();
      return _container;
    },

    /**
     * Show notification message
     *
     * @param title {string} the notification string;  passing empty string will
     *        hide the notification area
     * @param opt_timeOut {number} optional time out value (in ms); defaults to
     *        _kTIME_OUT; use -1 for indefinite message
     * @param opt_showSpinner {boolean} optional boolean to indicate a spinner
     *        should be shown
     * @param opt_blink {boolean} optional boolean to indicate if the text
     *        should blink
     *
     * @method show(title, opt_timeOut, opt_showSpinner, opt_blink)
     */
    show: function(title, opt_timeOut, opt_showSpinner, opt_blink) {
      if (_timerId) {
        window.clearTimeout(_timerId);
        _timerId = undefined;
      }
      if (opt_blink) {
        _notificationDiv.classList.add('qowt-notification-blink');
      } else {
        _notificationDiv.classList.remove('qowt-notification-blink');
      }
      if (title === '') {
        _hide(true);
      } else {
        _notificationDiv.textContent = title || '';
        if (opt_showSpinner) {
          console.warn('Warning; notification area doesnt support spinner');
        }
        if (opt_timeOut !== undefined) {
          if (opt_timeOut !== -1) {
            _timerId = window.setTimeout(_api.close, opt_timeOut);
          }
        } else {
          _timerId = window.setTimeout(_api.close, _kTIME_OUT);
        }
        _hide(false);
      }
    },

    close: function() {
      _hide(true);
    }
  };

  // PRIVATE

  var _container,
      _notificationDiv,
      _timerId,
      _disableToken,
      _notifyToken;

  /**
   * @private
   * The default length of time that a notification will be displayed for (ms).
   */
  var _kTIME_OUT = 4000;

  function _hide(hide) {
    if (hide) {
      _notificationDiv.classList.remove('shown');
    } else {
      _notificationDiv.classList.add('shown');
    }
  }

  function _handleNotification(eventType, eventData) {
    eventType = eventType || '';
    if (eventData !== undefined) {
      _api.show(eventData.msg, eventData.timeOut,
                eventData.spinner, eventData.blink);
    }
  }

  function _setupHTML() {
    _container = document.createElement('div');
    _container.classList.add('qowt-notification-container');
    _notificationDiv = document.createElement('div');
    _notificationDiv.classList.add('qowt-notification-area');
    _notificationDiv.textContent = '';
    _container.appendChild(_notificationDiv);
  }

  function _disable() {
    PubSub.unsubscribe(_disableToken);
    PubSub.unsubscribe(_notifyToken);
    _disableToken = undefined;
    _notifyToken = undefined;
  }

  function _init() {
    _disableToken = PubSub.subscribe('qowt:disable', _disable);
    _notifyToken = PubSub.subscribe('qowt:notification', _handleNotification);
  }

  WidgetFactory.register(_api);
  return _api;

});
