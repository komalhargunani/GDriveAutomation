/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview API for the qowt-notification-area element.
 *
 * A base element for presenting notification messages to the user. The
 * notification area contains a message string and a path string typically used
 * to show the saved file location. For long file location message which can not
 * fit in the notification area an ellipsis will be shown at the end of message,
 * it requires user-intervention(eg. on mouse hover) to show the full path
 * string via tooltip message.
 *
 * Javascript example:
 *
 *   var bar = document.createElement('qowt-notification-area');
 * or...
 *   var bar = new QowtNotificationArea();
 *
 */
define([
  'qowtRoot/pubsub/pubsub',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'
], function(
  PubSub,
  MixinUtils,
  QowtElement) {

  'use strict';

  /**
   * @private
   * The default length of time that a notification will be displayed for (ms).
   */
  var _kTIME_OUT = 4000,
    _timerId;

  var notificationAreaProto = {
    is: 'qowt-notification-area',

    subscriptionTokens_: [],

    properties: {
      isShowingFileURL: {
        type: Boolean,
        value: false
      }
    },

    listeners: {
      mouseover: 'showToolTip',
      mouseout: 'hideToolTip'
    },

    ready: function() {
      this.hide_(true);
     },

    attached: function() {
      var handleNotification  = this.handleNotification_.bind(this);
      this.subscriptionTokens_.push(PubSub.subscribe('qowt:notification',
        handleNotification));
    },


    detached: function() {
      this.subscriptionTokens_.forEach(function(token) {
        PubSub.unsubscribe(token);
      });
    },

    isShown: function() {
      return this.$.notificationDiv.classList.contains('shown');
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
     * @param opt_fileSavedAtLoc {boolean} optional boolean true, to indicate if
     *        user saves the file locally at particular location otherwise false
     *
     * @method show(title, opt_timeOut, opt_showSpinner, opt_blink)
     */
    show: function(title, opt_timeOut, opt_showSpinner, opt_blink,
                   opt_fileSavedAtLoc) {
      this.isShowingFileURL = false;
      if (_timerId) {
        window.clearTimeout(_timerId);
        _timerId = undefined;
      }
      if (opt_blink) {
        this.$.notificationDiv.classList.add('qowt-notification-blink');
      } else {
        this.$.notificationDiv.classList.remove('qowt-notification-blink');
      }
      if (title === '') {
        this.hide_(true);
      } else {
        this.$.notificationDiv.textContent = title || '';
        if (opt_showSpinner) {
          console.warn('Warning; notification area doesnt support spinner');
        }
        if (opt_timeOut !== undefined) {
          if (opt_timeOut !== -1) {
            _timerId = window.setTimeout(this.close.bind(this), opt_timeOut);
          }
        } else {
          if(!opt_fileSavedAtLoc){
            _timerId = window.setTimeout(
              this.close.bind(this, title), _kTIME_OUT);
          } else {
            this.isShowingFileURL = true;
            this.$.notificationDiv.classList.add('truncateMsg');
          }
        }
        this.hide_(false);
      }
    },

    close: function(title) {
      this.hide_(true, title);
    },

    /**
     * This will show the toolTip for the notification area.
     */
    showToolTip: function() {
      if(this.isShowingFileURL) {
        // The tooltip text should not contain any other text except the saved
        // file location.
        var config = {
          name: this.fileLocation,
          dimensions: this.getBoundingClientRect(),
          isFileSavedAtLocation: true
        };

        var mainToolbar = document.getElementById('main-toolbar');
        var toolTip = mainToolbar.$.tooltip;
        toolTip.show(config);
      }
    },

    /**
     * This will hide the toolTip for notification area on mouse hover.
     */
    hideToolTip: function() {
      var mainToolbar = document.getElementById('main-toolbar');
      var toolTip = mainToolbar.$.tooltip;
      toolTip.hide();
    },

    hide_: function(hide, title) {
      if (hide) {
        this.$.notificationDiv.classList.remove('shown');
        if(this.$.notificationDiv.classList.contains('truncateMsg')){
          this.$.notificationDiv.classList.remove('truncateMsg');
        }
      } else {
        this.$.notificationDiv.classList.add('shown');
      }
      if(title === "Saving cancelled."){
        PubSub.publish('qowt:ss:unsaved changes');
      }
    },

    handleNotification_: function(eventType, eventData) {
      eventType = eventType || '';
      if (eventData !== undefined) {
        if(eventData.location) {
          this.fileLocation = eventData.location;
        }
        this.show(eventData.msg, eventData.timeOut,
          eventData.spinner, eventData.blink, eventData.fileSavedAtLoc);
      }
    }
  };

  /* jshint newcap: false */
  window.QowtNotificationArea = Polymer(
    MixinUtils.mergeMixin(QowtElement, notificationAreaProto));
  /* jshint newcap: true */

  return {};
});
