define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/ui/trapFocus',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/i18n'
  ], function(
    MixinUtils,
    QowtElement,
    TrapFocus,
    MessageBus,
    DomListener,
    I18n) {

  'use strict';
  var _kEnterKeyCode = 13,
      _kEscapeKeyCode = 27;

  var hyperlinkDialogProto = {
    is: 'qowt-hyperlink-dialog',
    listeners: {
      'click': 'onClickHandler_',
      'focus': 'onFocusHyperlinkDlgHandler_'
    },

    properties: {
      /**
       * The maximum number of characters to show from the url.
       *
       * @attribute maxLength
       * @type integer
       * @default 30
       */
      maxLength: { type: Number, value: 30 },

      /**
       * A message text tells user to navigate through the link.
       *
       * @attribute messageText
       * @type String
       * @default default message is - "Go to link:"
       */
      messageText: { type: String, value: '' },

      /**
       * Displayed URL text in hyperlink dialog.
       *
       * @attribute actionText
       * @type String
       */
      actionText: { type: String, value: '' },

      /**
       * States whether the link to be shown in new tab or not.
       *
       * @attribute showLinkInNewTab
       * @type boolean
       * @default true
       */
      showLinkInNewTab: {type: Boolean, value: true},

      /**
       * Target URL.
       *
       * @attribute link
       * @type String
       */
      link: {type: String, value: ''},

      /**
       * Currently, Word/Point/Sheet all 3 verbalise different shortcut key for
       * focusing dialog elements. As a default value keeping it as Sheet
       * verbalise it. Each module can pass it as parameter for their specific
       * requirement.
       *
       * @attribute msgToActivateLink
       * @type String
       * @default message- "Press Alt + Enter to activate link"
       */
      msgToActivateLink: {
        type: String,
        value: I18n.getMessage('qowt_hyperlink_activate_short_key')
      }
    },

    hostProperties: {
      'role': 'dialog',
      'trap-focus': true,
      'static-trap': true,
      'focust-start': true,
      'tabindex': 0
    },

    created: function(){
      this.handleEventOnDocument_ = this.handleEventOnDocument_.bind(this);
    },

    publish: {
      // Reflecting properties to achieve dynamic ARIA markup.
      'aria-label': {
        value: '',
        reflect: true
      },
      'aria-hidden': {
        value: true,
        reflect: true
      }
    },

    /**
     * Shows the hyperlink dialog.
     *
     * @param {Boolean} showLinkInNewTab - true if the link to be open in new
     *     tab and, false if link is of internal type.
     * @param {String} actionText- The action text to display. This action text
     *     is a click-able link.
     * @param {String} msgToActivateLink - string to verbalise to get focus or
     *     activate dialog link. If not passed, default value is taken as of
     *     sheet i.e. "Press ALT + Enter to activate link".
     */
    show: function(showLinkInNewTab, actionText, msgToActivateLink) {
      if (!actionText) {
        throw new Error('hyperlinkDialog.show missing action text.');
      }
      this.messageText = I18n.getMessage('qowt_hyperlink_dialog_message_text');
      this.setAttribute('aria-hidden', false);
      this.msgToActivateLink = msgToActivateLink || this.msgToActivateLink;
      // TODO: Currently chromevox does not verbalize text within shadow dom.
      // So, as and when chromeVox supports this we need to revisit the ARIA
      // change.
      this.setAttribute('aria-label', this.msgToActivateLink);
      this.showLinkInNewTab = showLinkInNewTab || this.showLinkInNewTab;
      // The target url and the displayed link text are the same.
      this.actionText = actionText;
      this.link = actionText;
      this.style.display = 'flex';

      // If the link string exceeds maximum length, the link to be shown in
      // hyperlink dialog will be modified to restrict the maximum length.
      if (this.maxLength && actionText.length > this.maxLength) {
        this.actionText = this.modifyLinkToShow_(actionText);
      }
      this.addListeners_();
    },

    /**
     * Returns a string with ellipsis in between the text.
     * If we have hyperlink string whose length exceeds maximum length, then we
     * need to create a string which has ellipsis in between making sure that
     * number of characters are not greater than max length.
     * For example: if we have a link like:
     * 'http://www.google.com/doSomething/this/is/very/big'
     *
     * Then this function returns this link as:
     * 'http://www.goog.../is/very/big'
     * i.e. Text + ellipsis + Text
     *
     * @param actionText {string}- link string which needs to be modified with
     *     ellipsis
     * @returns {string} - string with ellipsis
     * @private
     */
    modifyLinkToShow_: function(actionText) {
      var text = actionText;
      var ellipsisText = '\u2026';
      var beforeEllipsis = text.substr(0, this.maxLength / 2);
      var afterEllipsisTextLength = this.maxLength -
          (beforeEllipsis.length + ellipsisText.length);
      var afterEllipsis = text.substr(text.length - afterEllipsisTextLength,
          text.length);

      return beforeEllipsis + ellipsisText + afterEllipsis;
    },

    /** Hides the hyperlink dialog. */
    hide: function() {
      this.style.display = 'none';
      this.removeListeners_();
      this.setAttribute('aria-hidden', true);
    },

    /**
     * @param {integer} top - Set the top position at which the dialog is
     *     opened.
     */
    setPosition: function(top) {
      this.style.top = top;
    },

    /**
     * @private
     * In hyperlink dialog, the action text is a click-able link. "on-click"
     * action on this action text invokes this function. This function takes
     * action based on the type of link. If link is of external type it will
     * open link in new tab.
     *
     * Note: Right now this dialog only handles link that is intended to open in
     * new tab. Internal type of links are not yet handled.
     */
    activateLink_: function(/*event*/) {
      if (this.showLinkInNewTab) {
        MessageBus.pushMessage({
          id: 'createNewTab',
          link: this.link
        });
      }
    },

    /**
     * A click event on an opened hyperlink dialog will focus the dialog. If we
     * do not handle this click event here, it will result in propagating the
     * event to parent and will close the dialog.
     * For e.g., In sheet app, clicking on an opened hyperlink dialog, will
     * close the dialog and selects the beneath cell present in the clicked
     * area. In word/point app, this action will place the cursor on clicked
     * area and close the dialog.
     *
     * @param evt - event to handle
     * @private
     */
    onClickHandler_: function(evt) {
      evt.stopPropagation();
    },

    /**
     * Setting correct aria-label to dialog when it is in focus.
     * @private
     */
    onFocusHyperlinkDlgHandler_: function(/*event*/) {
      var hyperlinkDialog = I18n.getMessage('qowt_hyperlink_dialog');
      this.setAttribute('aria-label', hyperlinkDialog);
    },

    /**
     * Setting correct aria-label to dialog when the link is in focus.
     * @param evt - a key down or mouse down event
     * @private
     */
    onFocusLinkHandler_: function(evt) {
      this.setAttribute('aria-label', this.actionText);
      evt.stopPropagation();
    },

    /**
     * Handling 'keydown' and 'mousedown' event on entire document, if occurred
     * while hyperlink dialog is opened. When hyperlink dialog is opened and
     * focused, and if any keydown event occurred (such as Escape key) or any
     * mousedown event such as clicking on toolbar buttons, the dialog should
     * be unhighlighted/lost focus however it is still open.
     *
     * Based on keydown event occured on document dialog takes action-
     * 1. Esc key - is pressed, dialog should lost its focus.
     * 2. Alt + Enter - It should open link when dialog is open but NOT focused.
     * 3. Enter - It should open link when link is focused.
     *
     * @param evt - event (keydown or mousedown)
     * @private
     */
    handleEventOnDocument_: function(evt) {
      if ((evt.type === 'mousedown' || evt.keyCode === _kEscapeKeyCode) &&
          this.isDialogFocused(evt)) {
        this.blur();
      } else if (evt.altKey && evt.keyCode === _kEnterKeyCode &&
          !(this.isDialogFocused(evt))) {
        this.activateLink_();
      } else if (evt.keyCode === _kEnterKeyCode && !evt.altKey &&
          evt.path && evt.path[0] === this.$.action) {
        this.activateLink_();
      }
    },

    /**
     * Adding event listeners for 'keydown' and 'mousedown' event on document.
     *
     * @private
     */
    addListeners_: function() {
      DomListener.add('hyperlinkDialog', document, 'keydown',
          this.handleEventOnDocument_, true);
      DomListener.add('hyperlinkDialog', document, 'mousedown',
          this.handleEventOnDocument_, true);
    },

    /**
     * Removing listeners from hyperlink dialog when dialog is hidden.
     * @private
     */
    removeListeners_: function() {
      DomListener.removeGroup('hyperlinkDialog');
    },

    /**
     * @returns {Boolean} - true if hyperlink dialog is visible, otherwise false
     */
    isShowing: function() {
      return (this.style.display !== "" &&
          this.style.display !== "none");
    },

    /**
     * @param evt - a key down or mouse down event
     * @returns {Boolean} - true, if dialog or any element inside dialog has
     *      focus, otherwise, false.
     */
    isDialogFocused: function(evt) {
      return ((evt.path && Array.prototype.slice.call(evt.path).
          indexOf(this) !== -1) || document.activeElement === this);
    }
  };

  window.QowtHyperlinkDialog = Polymer(
      MixinUtils.mergeMixin(QowtElement, TrapFocus, hyperlinkDialogProto));

  return {};
});
