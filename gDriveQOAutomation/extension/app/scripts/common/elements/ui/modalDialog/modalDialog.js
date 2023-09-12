/**
 * @fileoverview API for the qowt-modal-dialog element. Creates a one time use
 * dialog, meaning that when the dialog is closed the element will be removed
 * completely from the DOM as well.
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/ui/cvoxSpeak',
  'common/mixins/ui/trapFocus',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/localStorageManager',
  'qowtRoot/utils/platform'
  ], function(
    MixinUtils,
    QowtElement,
    CvoxSpeak,
    TrapFocus,
    PubSub,
    I18n,
    LocalStorageManager,
    Platform) {

  'use strict';

  var api_ = {
    properties: {
      open: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
        observer: 'openChanged_'
      }
    },

    hostAttributes: {
      'trap-focus': true,
      'static-trap': true,
      'tabindex': 0,
      'role': 'dialog',
      'aria-labelledby': "dialogLabel dialogDesc1 dialogDesc2",
      'aria-describedby': "dialogDesc3 close",
      'aria-modal': "true"
    },

    /**
     * Create a listener for the dialog closing so we can remove it from the
     * DOM. Add the listener once we are attached to the DOM. This means it will
     * get automatically removed when we are removed from the DOM, thus not
     * leaking event listeners.
     * @public
     */
    attached: function() {
      this.addEventListener('close', this.destroy_);
    },

    openChanged_: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.fire(newValue ? 'dialog-shown' : 'dialog-closed');
      }
    },

    /**
     * Shows the modal dialog. If it's not added to the DOM already, it's
     * appended to the body.
     *
     * Example:
     * var dlg = new QowtModalDialog();
     * dlg.show(); // Shows an empty dialog
     *
     * @public
     */
    show: function() {
      // Wait until all drawing is complete.
      window.setTimeout(function() {
        if(Platform.isCros) {
          this.removeAttribute('aria-labelledby');
          this.removeAttribute('aria-describedby');
        }
        // Tell QOWT this widget wants control.
        PubSub.publish('qowt:requestFocus', {contentType: 'modalDialog'});

        // Add it to the DOM if it's not there.
        if (!this.parentNode) {
          document.body.appendChild(this);
        }

        if (!this.open) {
          this.showModal();
          this.setAttribute('open', 'true');

          // TODO(cuiffo): Really shouldn't have to do this because it should
          // autofocus on the button that has autofocus... but it only does that
          // on the first open of a dialog.
          var autofocused = this.shadowRoot &&
                            this.shadowRoot.querySelector('[autofocus]');
          if (autofocused) {
            autofocused.focus();
          }
        }
      }.bind(this), 0);
    },


    /**
     * Destroy the dialog and remove it from the DOM if it was attached
     */
    destroy: function() {
      this.destroy_();
    },


    /**
     * Shows a "remember" dialog if it has not been previously set to not be
     * shown. Specific to the remember template.
     */
    showRememberDialog: function() {
      var storageKey = 'do_not_open_' + this.subtype + '_dialog';
      var canOpen = LocalStorageManager.getItem(storageKey) !== 'true';
      if (canOpen) {
        LocalStorageManager.setItem(storageKey, true);
        this.show();
      } else {
        this.destroy();
      }
    },


    /**
     * Handles a checkbox selection by adding it's checked value into
     * localStorage. Specific to the remember template.
     * @param {Event} evt The event which triggered the function.
     */
    rememberChoice_: function(evt) {
      if (evt && evt.target && this.subtype) {
        var storageKey = 'do_not_open_' + this.subtype + '_dialog';
        LocalStorageManager.setItem(storageKey, evt.target.checked);
      }
    },


    /**
     * Calls the callback if there is one and closes the dialog. Passes in the
     * id of the button pressed to the callback so that it is able to respond to
     * each action separately.
     * @param {Event} evt The event which triggered the function.
     * @private
     */
    handleAction_: function(evt) {
      evt.preventDefault();
      if (this.callback) {
        this.callback(evt.currentTarget && evt.currentTarget.id);
      }
      this.close();
    },

    /**
     * Suppress default action of an event.
     * @param {Event} evt The event which triggered the function.
     * @private
     */
    suppressEvent_: function(evt) {
      evt.preventDefault();
    },


    /**
     * Gets the value of a message in the correct language according to the key
     * provided.
     * @param {Event} key The key of the message to fetch.
     * @return {String} The message value.
     * @private
     */
    getMessage_: function(key) {
      return I18n.getMessage(key);
    },


    /**
     * Removes the dialog completely from the DOM and does some cleanup.
     * @private
     */
    destroy_: function() {

      // Remove the dialog from the DOM.
      var parentNode = Polymer.dom(this).parentNode;
      if (parentNode) {
        Polymer.dom(parentNode).removeChild(this);

        // Tell QOWT this widget no longer is in control.
        PubSub.publish('qowt:requestFocusLost', {contentType: 'modalDialog'});
      }
    }
  };


  window.QowtModalDialogBehavior =
      MixinUtils.mergeMixin(QowtElement, TrapFocus, CvoxSpeak, api_);

  return {};
});
