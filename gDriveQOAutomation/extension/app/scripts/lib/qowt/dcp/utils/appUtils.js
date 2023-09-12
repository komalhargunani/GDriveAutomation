define([
  'qowtRoot/controls/viewLayoutControl',
  'qowtRoot/models/env',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/i18n',
  'utils/converter'], function(
    ViewLayoutControl,
    EnvModel,
    PubSub,
    DomListener,
    I18n,
    Converter) {

  'use strict';

  var _api = {

    toggleShareButton: function() {
      var shareButton = document.querySelector('qowt-sharebutton');
      var action;
      if (shareButton.classList.contains('disabled')) {
        action = 'addListener';
        shareButton.classList.remove('disabled');
        shareButton.setAttribute('aria-label', I18n.getMessage('share_button'));
      } else {
        action = 'removeListener';
        shareButton.classList.add('disabled');
        shareButton.setAttribute('aria-label',
            I18n.getMessage('disabled_share_button'));
      }
      DomListener[action](shareButton, 'click', shareButton.onClick_, false);
      DomListener[action](shareButton, 'keydown',
          shareButton.onKeyDownHandler_, false);
      DomListener[action](shareButton, 'focus',
          shareButton.onFocus_.bind(shareButton), false);
    },

    getMenuitemSaveAsId: function(app) {
      if (app === 'word') {
        return 'menuitemSaveAsDocs';
      } else if (app === 'point') {
        return 'menuitemSaveAsSlides';
      } else if (app === 'sheet') {
        return 'menuitemSaveAsSheets';
      }
    },

    editSharingOptions: function(res) {
      var isMacroEnabled = this.isMacroEnabledFile(res.displayName);

      var menuItemSaveAsId = this.getMenuitemSaveAsId(EnvModel.app);
      var saveAsItem = ViewLayoutControl.getToolbarItem(menuItemSaveAsId);
      var iconString = this.getIconString(EnvModel.app);
      var shareButton = document.querySelector('qowt-sharebutton');
      if (isMacroEnabled) {
        if (shareButton && !shareButton.classList.contains('disabled')) {
          // Opened macro enabled file and Sharing options are Enabled,
          // need to Disable them.
          this.toggleShareButton();
          saveAsItem.icon = iconString + '_disabled';
        }
        PubSub.publish('qowt:openedMacroEnabledFile');
      } else {
        if (shareButton && shareButton.classList.contains('disabled')) {
          // Opened non-macro enabled file and Sharing options are Disabled,
          // need to Enable them.
          this.toggleShareButton();
        }
        PubSub.publish('qowt:openedNormalFile');
        saveAsItem.icon = iconString;
      }
    },

    isFileRoundTripped: function(res) {
      return res.name === 'writeToNew' && !res.userCancelled;
    },

    isMacroEnabledFile: function(displayName) {
      var fileExtension = Converter.name2ext(displayName);
      return fileExtension === 'docm' ||
          fileExtension === 'pptm' || fileExtension === 'xlsm';
    },

    getIconString: function(app) {
      if (app === 'word') {
        return 'docs-icons:document';
      } else if (app === 'point') {
        return 'docs-icons:presentation';
      } else if (app === 'sheet') {
        return 'docs-icons:spreadsheet';
      }
    }
  };

  return _api;
});
