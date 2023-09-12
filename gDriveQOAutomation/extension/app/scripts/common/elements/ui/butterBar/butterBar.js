/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview API for the qowt-butter-bar element.
 *
 * <qowt-butter-bar> is a temporary ui notification widget.  It extends the
 * message bar with the behaviour of having the notification melt away
 * after a configurable timeout. (Butter melts).
 *
 * Javascript example:
 *
 *   var butter = document.createElement('qowt-butter-bar');
 *  or...
 *   var butter = new QowtButterBar();
 *
 * The default melt timer is 10 seconds. You can change this by setting a new
 * microsecond value for the meltTimer.
 *
 *   butter.meltTimer = 1000; // Set a 1 second melt timer.
 *
 *   butter.show(messageText, actionText, callback);
 *
 * Note: messageText and actionText default to empty strings if not supplied.
 *
 * The element has the "QowtButterBar" constructor, so the following is true...
 *   butter instanceof QowtButterBar;
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',

  // ensure the message-bar is loaded
  'common/elements/ui/messageBar/messageBar'
  ], function(
    MixinUtils,
    QowtElement
    /* MessageBar */
    ) {

 'use strict';

  var butterBarProto = {
    is: 'qowt-butter-bar',

    properties: {
      /**
       * The default timeout for butter melting. Can be overriden.
       */
      meltTimer: {type: Number, value: 10000},
      messageText: String,
      actionText: String
    },

    /**
     * This property allows to set the correct position of butter bar when it is
     * hidden.
     */
    ready: function() {
      this.setAttribute('showing-butter-bar', false);
    },

    isShown: function() {
      return this.$.messagebar.isShown();
    },

    /**
     * Show the Butter Bar, and it will automatically melt away (become hidden)
     * after a timeout. Calling show() multiple times cancels existing timers
     * such that only the last call melts away.
     *
     * @param {String} messageText The message text to display.
     * @param {String} actionText The action text to display.
     * @param {Function} callback The action callback to invoke.
     */
    show: function(messageText, actionText, callback) {
      this.$.messagebar.show(messageText, actionText, callback);
      this.setAttribute('showing-butter-bar', true);
      this.autoHideJob = this.debounce(this.autoHideJob, function() {
        this.hide();
      }, this.meltTimer);
    },

    /**
     * Hide the Butter Bar, and cancel the autoHideJob in case the user
     * manually invoked hide.
     */
    hide: function() {
      if(this.autoHideJob) {
        this.autoHideJob.stop();
        this.autoHideJob = null;
      }
      this.setAttribute('showing-butter-bar', false);
      this.$.messagebar.hide();
    }
   };

  /* jshint newcap: false */
  window.QowtButterBar =  Polymer(
      MixinUtils.mergeMixin(QowtElement, butterBarProto));
  /* jshint newcap: true */

  return {};
});
