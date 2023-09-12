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


  var QowtDownloadButtonProto = Object.create(HTMLElement.prototype);

  /**
   * Custom element lifecycle callback method.
   */
  QowtDownloadButtonProto.createdCallback = function() {
    // Define this to be a basic button.
    this.classList.add('button');
    this.classList.add('basic');

    this.innerText = I18n.getMessage('download_button');
    var span = document.createElement('span');
    this.insertBefore(span, this.firstChild);

    // Handle button activations.
    DomListener.addListener(this, 'click', this.onClick_, false);
    DomListener.addListener(this, 'mouseover', this.onMouseOver_);
    DomListener.addListener(this, 'mouseout', this.onMouseOut_);
    DomListener.addListener(this, 'keydown', this.onKeyDownHandler_, false);
    DomListener.addListener(this, 'focus', this.onFocus_.bind(this), false);

    // Handle accessibility for button.
    this.setAttribute('tabIndex', 0);
    this.setAttribute('role', 'button');
    this.setAttribute('aria-label', I18n.getMessage('download_button'));
  };

  /**
   * Append this element to the given node
   * @param {Node} parent The container node to attach to.
   */
  QowtDownloadButtonProto.appendTo = function(parent) {
    parent.appendChild(this);
  };

  /**
   * Registered event listener for 'click' event
   * @private
   */
  QowtDownloadButtonProto.onClick_ = function() {
    // Trigger the action by publishing the requested action.
    PubSub.publish('qowt:doAction', {
      'action': 'download',
      'context': {contentType: 'common'}
    });
  };

  /**
   * This will show the toolTip for the download button.
   * @private
   */
  QowtDownloadButtonProto.onMouseOver_ = function() {
    var button = {name: 'download', dimensions: this.getBoundingClientRect()};
    var mainToolbar = document.getElementById('main-toolbar');
    var toolTip = mainToolbar.$.tooltip;
    toolTip.show(button);
  };

  /**
   * This will hide the toolTip for the download button.
   * @private
   */
  QowtDownloadButtonProto.onMouseOut_ = function() {
    var mainToolbar = document.getElementById('main-toolbar');
    var toolTip = mainToolbar.$.tooltip;
    toolTip.hide();
  };
  /**
   * Handles action on button when enter or space key pressed. And removes
   * focus from button after action.
   * @param event - key events either "Enter" or "Space" key.
   * @private
   */
  QowtDownloadButtonProto.onKeyDownHandler_ = function(event) {
    if (event.keyCode === _kEnterKeyCode ||
        event.keyCode === _kSpaceBarKeyCode) {
      event.preventDefault();
      event.stopPropagation();
      this.onClick_();
      // After action, remove focus from download button
      this.blur();
    }
  };

  QowtDownloadButtonProto.onFocus_ = function(/*event*/) {
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
  QowtDownloadButtonProto.detach = function() {
    DomListener.removeListener(this, 'click', this.onClick_, false);
    DomListener.removeListener(this, 'mouseover', this.onMouseOver_);
    DomListener.removeListener(this, 'mouseout', this.onMouseOut_);
    DomListener.removeListener(this, 'keydown', this.onKeyDownHandler_, false);
    DomListener.removeListener(this, 'focus', this.onFocus_.bind(this), false);
  };

  window.QOWTDownloadButton = document.registerElement('qowt-downloadbutton', {
    prototype: QowtDownloadButtonProto
  });

  return {};

});
