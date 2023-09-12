/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview API for the qowt-message-bar element.
 *
 * A base element for presenting messages to the user. The message
 * bar contains a message string and a clickable action string typically used
 * to dismiss the bar and remove it from the ui. The visible message requires
 * user-intervention to dismiss, otherwise it is permanent.
 *
 * Note: although you can use this element on it's own, it is recommended
 * that you use wither qowt-bacon-bar or qowt-butter-bar in your app.
 *
 * Javascript example:
 *
 *   var bar = document.createElement('qowt-message-bar');
 * or...
 *   var bar = new QowtMessageBar();
 *
 * To trigger the message bar...
 *   bar.show(messageText, actionText, callback);
 *
 * The element has the "QowtMessageBar" constructor, so the following is true...
 *   butter instanceof QowtMessageBar;
 *   butter instanceof QowtElement;
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/utils/typeUtils',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'
  ], function(
    TypeUtils,
    MixinUtils,
    QowtElement) {

  'use strict';

  var _kEnterKeyCode = 13,
      _kSpaceBarKeyCode = 32;

  var messageBarProto = {
    is: 'qowt-message-bar',

    properties: {
      type: {type: String, value: 'info'},
      messageText: {type: String, value: '', notify: true},
      actionText: {type: String, value: '', notify: true}
    },

    ready: function() {
      this.hide();
    },

    /**
     * Show the Bar.
     *
     * @param {String} messageText The message text to display.
     * @param {String} actionText The action text to display.
     * @param {Function} callback The action callback to invoke.
     */
    show: function(messageText, actionText, callback) {
      if (!messageText || !actionText) {
        throw new Error('messageBar.show missing message or action text.');
      }
      if (!callback || !TypeUtils.isFunction(callback)) {
        throw new Error('messageBar.show missing callback function.');
      }
      this.messageText = messageText;
      this.actionText = actionText;
      this.actionCallback_ = callback;
      this.style.removeProperty('display');
      this.style.visibility = 'visible';
      this.$.action.setAttribute('aria-hidden', false);
      this.$.action.setAttribute('aria-disabled', false);
      this.$.action.setAttribute('aria-label', messageText + ' ' + actionText);
    },

    /**
     * Hide the Bacon Bar
     */
    hide: function() {
      this.style.display = 'none';
      this.style.visibility = 'hidden';
      Polymer.dom(this.$.action).setAttribute('aria-hidden', true);
      Polymer.dom(this.$.action).setAttribute('aria-disabled', true);
    },

    isShown: function() {
      return this.style.visibility === 'visible';
    },

    /**
     * @private
     * Invoke the stored callback function.
     */
    handleCallback_: function() {
      if (TypeUtils.isFunction(this.actionCallback_)) {
        this.actionCallback_.call();
      }
    },

    handleKeyDown_: function(event) {
      if (event.keyCode === _kEnterKeyCode ||
          event.keyCode === _kSpaceBarKeyCode) {
        event.preventDefault();
        event.stopPropagation();
        this.handleCallback_();
      }
    },

    onFocusHandler_: function(/*event*/) {
      var txt = this.$.action.getAttribute('aria-label') + ' ' +
          this.$.action.getAttribute('role');
      var cvox = window.cvox;
      if (cvox) {
        cvox.Api.speak(txt, 0);
      }
    }
  };

  /* jshint newcap: false */
  window.QowtMessageBar = Polymer(
      MixinUtils.mergeMixin(QowtElement, messageBarProto));
  /* jshint newcap: true */

  return {};
});
