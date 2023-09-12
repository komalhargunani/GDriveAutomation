// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview Define a custom element for a Google Present button element.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/i18n'], function(
  PubSub,
  DomListener,
  I18n) {

  'use strict';

  var _kEnterKeyCode = 13,
      _kSpaceBarKeyCode = 32;

  var QowtPresentButtonProto = Object.create(HTMLElement.prototype);

  QowtPresentButtonProto.createdCallback = function() {
    // Define this to be a basic button.
    this.classList.add('button');
    this.classList.add('basic');

    this.innerText = I18n.getMessage('present_button');
    var span = document.createElement('span');
    this.insertBefore(span, this.firstChild);

    // Handle button activations.
    DomListener.addListener(this, 'click', this.onClick_, false);
    DomListener.addListener(this, 'mouseover', this.onMouseOver_);
    DomListener.addListener(this, 'mouseout', this.onMouseOut_);
    DomListener.addListener(this, 'keydown', this.onKeyDownHandler_, false);
    DomListener.addListener(this, 'focus', this.onFocus_.bind(this), false);
    this.setAttribute('tabIndex', 0);
    this.setAttribute('role', 'button');
    this.setAttribute('aria-label', I18n.getMessage('present_button'));
  };

  QowtPresentButtonProto.appendTo = function(parent) {
    parent.appendChild(this);
  };

  QowtPresentButtonProto.onClick_ = function() {
    // Trigger the action by publishing the requested action.
    PubSub.publish('qowt:doAction', {
      'action': 'startSlideshow',
      'context': {contentType: 'presentation'}
    });
  };

  /**
   * This will show the toolTip for the present button.
   * @private
   */
  QowtPresentButtonProto.onMouseOver_ = function() {
    var button = {
      name: 'presentation',
      dimensions: this.getBoundingClientRect()
    };

    var mainToolbar = document.getElementById('main-toolbar');
    var toolTip = mainToolbar.$.tooltip;
    toolTip.show(button);
  };

  /**
   * This will hide the toolTip for the present button.
   * @private
   */
  QowtPresentButtonProto.onMouseOut_ = function() {
    var mainToolbar = document.getElementById('main-toolbar');
    var toolTip = mainToolbar.$.tooltip;
    toolTip.hide();
  };

  QowtPresentButtonProto.onKeyDownHandler_ = function(event) {
    if (event.keyCode === _kEnterKeyCode ||
        event.keyCode === _kSpaceBarKeyCode) {
      event.preventDefault();
      event.stopPropagation();
      this.onClick_();
    }
  };

  QowtPresentButtonProto.onFocus_ = function(/*event*/) {
    var txt = this.getAttribute('aria-label') + ' ' +
        this.getAttribute('role');
    var cvox = window.cvox;
    if (cvox) {
      cvox.Api.speak(txt, 0);
    }
  };

  /**
   * Remove the listeners.
   */
  QowtPresentButtonProto.detach = function() {
    DomListener.removeListener(this, 'click', this.onClick_, false);
    DomListener.removeListener(this, 'mouseover', this.onMouseOver_);
    DomListener.removeListener(this, 'mouseout', this.onMouseOut_);
    DomListener.removeListener(this, 'keydown', this.onKeyDownHandler_, false);
    DomListener.removeListener(this, 'focus', this.onFocus_.bind(this), false);
  };

  window.QOWTPresentButton = document.registerElement('qowt-presentbutton', {
    prototype: QowtPresentButtonProto
  });

  return {};

});
