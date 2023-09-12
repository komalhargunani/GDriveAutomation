// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview Define a custom element for the App icon element.
 * When clicked, the icon will take the user to Google Drive.
 *
 * @author jonbronson@google.com (Jonathan Bronson)
 */
define([
  'qowtRoot/models/env',
  'qowtRoot/utils/i18n',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/utils/domListener'
], function(
    EnvModel,
    I18n,
    PubSub,
    MessageBus,
    DomListener) {

  'use strict';

  var QowtAppIconProto = Object.create(HTMLElement.prototype);

  var links = {
    'word' : 'http://docs.google.com/document',
    'sheet' : 'http://docs.google.com/spreadsheets',
    'point' : 'http://docs.google.com/presentation'
  };

  var actions = {
    'word': 'docs-home-visit',
    'sheet': 'sheets-home-visit',
    'point': 'slides-home-visit'
  };

  QowtAppIconProto.createdCallback = function() {
    // create anchor
    var anchor = document.createElement('a');
    anchor.href = links[EnvModel.app];

    // make sure it opens in new window
    anchor.target = '_blank';

    // create visual content & make the app icon accessible on enter key
    // press.
    anchor.classList.add('qowt-main-appIcon');


    // TODO(Upasana): Adding class name 'qowt-main-toolbar' here to
    // enable styles from mainToolbar polymer element to apply when
    // in shady dom mode. Remove once all elements are polymerized.
    anchor.classList.add('qowt-main-toolbar');

    anchor.setAttribute('tabindex', 0);
    anchor.setAttribute('role', 'link');
    var home = EnvModel.app + I18n.getMessage('app_icon_aria_spoken_word');
  anchor.setAttribute('aria-label', home);
    DomListener.addListener(anchor, 'focus', this.onFocus_.bind(this), false);
    DomListener.addListener(anchor, 'click', this.onClick_.bind(this), false);
    DomListener.addListener(anchor, 'keydown',
    this.onKeyDownHandler_.bind(this), false);

    // attach elements
    this.appendChild(anchor);
  };

  QowtAppIconProto.appendTo = function(parent) {
    parent.appendChild(this);
  };

  QowtAppIconProto.onFocus_ = function(event) {
    if ((event.path && Array.prototype.slice.call(event.path).
        indexOf(this) !== -1)) {
      var txt =
          this.querySelector('a.qowt-main-appIcon').getAttribute('aria-label')
              + ' ' +
              this.querySelector('a.qowt-main-appIcon').getAttribute('role');
      var cvox = window.cvox;
      if (cvox) {
        cvox.Api.speak(txt, 0);
      }
    }
  };

  QowtAppIconProto.onKeyDownHandler_ = function(event) {
    if(event.key === 'Enter') {
      this.onClick_(event);
    }
  };

  QowtAppIconProto.onClick_ = function(event) {
    event.preventDefault();
    PubSub.publish('qowt:doAction', {
      action: 'createNewTab',
      context: {
        contentType: 'common',
        link: event.target.href
      }
    });

    MessageBus.pushMessage({
      id: 'recordEvent',
      category: 'app-home-icon',
      action: actions[EnvModel.app]
    });
  };

  window.QOWTAppIcon = document.registerElement('qowt-app-icon', {
    prototype: QowtAppIconProto
  });

  return {};
 });
