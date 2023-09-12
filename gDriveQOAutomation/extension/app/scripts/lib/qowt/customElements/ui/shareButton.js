// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview Define a custom element for a Google share button element.
 * This implementation presents a promotion dialog supporting a conversion flow
 * to convert the current file a Drive-hosted GDocs format.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/models/fileInfo',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/i18n'], function(
    FileInfo,
    PubSub,
    DomListener,
    I18n) {

  'use strict';
  var _kEnterKeyCode = 13,
      _kSpaceBarKeyCode = 32;

  var QowtShareButtonProto = Object.create(HTMLElement.prototype);

  QowtShareButtonProto.createdCallback = function() {
    // Define this to be a primary button.
    this.classList.add('button');
    this.classList.add('primary');
    this.classList.add('blue');
    if (FileInfo.isMacroEnabledFile) {
      this.classList.add('disabled');
    }

    // TODO(dskelton) Use shadow dom here.
    this.innerText = I18n.getMessage('share_button');
    var span = document.createElement('span');
    this.insertBefore(span, this.firstChild);

    DomListener.addListener(this, 'mouseover', this.onMouseOver_);
    DomListener.addListener(this, 'mouseout', this.onMouseOut_);

    if (!this.classList.contains('disabled')) {
      // Handle button activations.
      DomListener.addListener(this, 'click', this.onClick_, false);
      DomListener.addListener(this, 'keydown', this.onKeyDownHandler_, false);
      DomListener.addListener(this, 'focus', this.onFocus_.bind(this), false);
      this.setAttribute('aria-label', I18n.getMessage('share_button'));
    } else {
      this.setAttribute('aria-label', I18n.getMessage('disabled_share_button'));
    }
    this.setAttribute('tabIndex', 0);
    this.setAttribute('role', 'button');
  };

  QowtShareButtonProto.appendTo = function(parent) {
    parent.appendChild(this);
  };

  QowtShareButtonProto.onClick_ = function() {
    // Trigger the action by publishing the requested action.
    PubSub.publish('qowt:doAction', {
      'action': 'share',
      'context': {contentType: 'common'}
    });
  };
  /**
   * This will show the toolTip for the share button.
   * @private
   */
  QowtShareButtonProto.onMouseOver_ = function() {
    var button = {name: 'share', dimensions: this.getBoundingClientRect()};
    if (this.classList.contains('disabled')) {
      button.name = 'share_for_macroenabledfiles';
    } else {
      button.name = 'share';
    }
    var mainToolbar = document.getElementById('main-toolbar');
    var toolTip = mainToolbar.$.tooltip;
    toolTip.show(button);
  };

  /**
   * This will hide the toolTip for the share button.
   * @private
   */
  QowtShareButtonProto.onMouseOut_ = function() {
    var mainToolbar = document.getElementById('main-toolbar');
    var toolTip = mainToolbar.$.tooltip;
    toolTip.hide();
  };

  QowtShareButtonProto.onKeyDownHandler_ = function(event) {
    if (event.keyCode === _kEnterKeyCode ||
        event.keyCode === _kSpaceBarKeyCode) {
      event.preventDefault();
      event.stopPropagation();
      this.onClick_();
    }
  };

  QowtShareButtonProto.onFocus_ = function(/*event*/) {
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
  QowtShareButtonProto.detach = function() {
    DomListener.removeListener(this, 'click', this.onClick_, false);
    DomListener.removeListener(this, 'mouseover', this.onMouseOver_);
    DomListener.removeListener(this, 'mouseout', this.onMouseOut_);
    DomListener.removeListener(this, 'keydown', this.onKeyDownHandler_, false);
    DomListener.removeListener(this, 'focus', this.onFocus_.bind(this), false);
  };

  window.QOWTShareButton = document.registerElement('qowt-sharebutton', {
    prototype: QowtShareButtonProto
  });

  return {};

});
