// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview Generic content manager that handles all generic actions.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/common/commandSequenceEnd',
  'qowtRoot/commands/common/commandSequenceStart',
  'qowtRoot/commands/common/downloadFile',
  'qowtRoot/commands/common/saveFile',
  'qowtRoot/commands/common/writeToUserFile',
  'qowtRoot/commands/common/writeToExistingDriveFile',
  'qowtRoot/commands/common/undo',
  'qowtRoot/commands/common/redo',
  'qowtRoot/commands/common/convertToDocs',
  'qowtRoot/commands/common/makeACopy',
  'qowtRoot/commands/contentCheckers/docChecker',
  'qowtRoot/configs/common',
  'qowtRoot/media/insertMediaFactory',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/models/fileInfo',
  'qowtRoot/models/env',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/userFeedback',
  'qowtRoot/utils/platform',
  'qowtRoot/widgets/ui/imagePicker'], function(
  CommandManager,
  CommandSeqEndCmd,
  CommandSeqStartCmd,
  DownloadFileCmd,
  SaveFileCmd,
  WriteToUserFileCmd,
  WriteToExistingDriveFileCmd,
  UndoCmd,
  RedoCmd,
  ConvertToDocsCmd,
  MakeACopyCmd,
  DocumentChecker,
  CommonConfig,
  InsertMediaFactory,
  MessageBus,
  FileInfo,
  EnvModel,
  PubSub,
  UserFeedback,
  Platform,
  ImagePicker) {

  'use strict';

  var _api = {};

  // vvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvv

  /**
   * String identifier for which 'doAction' messages this manager will respond
   * to.
   * @private
   */
  var _contentType = 'common',
      _bounceId,
      _nodesToVerify = [];

  /**
   * Handle all 'action' signals.
   * @private
   * @param {string} eventType The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   */
  _api.handleCommonAction = function(event, eventData) {
    event = event || {};
    var action;
    if (eventData &&
        eventData.context &&
        eventData.context.contentType &&
        eventData.context.contentType === _contentType) {
      action = eventData.action;
      switch (action) {
        case 'saveAs':
          _saveAs(eventData.context);
          break;
        case 'makeCopy':
          _makeCopy();
          break;
        case 'autoSave':
          _autoSaveFile(eventData.context.newRevision);
          break;
        case 'convertToDocs':
          _convertToDocs();
          break;
        case 'share':
          _shareConversionFlow();
          break;
        case 'print':
          _print(eventData.context);
          break;
        case 'download':
          _download();
          break;
        case 'undo':
          // TODO(chehayeb) use Core-driven Undo/Redo for word. Remove this hack
          // once all the three product use the same solution.
          if (EnvModel.app === 'word' || EnvModel.app === 'point') {
            _coreDrivenUndo(eventData.context);
          } else {
            _qowtDrivenUndo(eventData.context);
          }
          break;
        case 'redo':
          // TODO(chehayeb) use Core-driven Undo/Redo for word. Remove this hack
          // once all the three product use the same solution.
          if (EnvModel.app === 'word' || EnvModel.app === 'point') {
            _coreDrivenRedo(eventData.context);
          } else {
            _qowtDrivenRedo(eventData.context);
          }
          break;
        case 'insertMedia':
          _insertMedia(eventData.context);
          break;
        case 'imagePickerDialog':
          _showImagePickerDialog();
          break;
        case 'reportIssue':
          _reportIssue(eventData.context);
          break;
        case 'helpCenter':
          _helpCenter(eventData.context);
          break;
        case 'commandSequenceStart':
          _commandSequenceStart(eventData.context);
          break;
        case 'commandSequenceEnd':
          _commandSequenceEnd(eventData.context);
          break;
        case 'lockScreen':
          _lockScreen(eventData.context);
          break;
        case 'unlockScreen':
          _unlockScreen(eventData.context);
          break;
        case 'officeCompatibilityMode':
          _showOCMConversionPromoDialog();
          break;
        case 'keyboardShortcutsDialog':
          _showKeyboardShortcutsDialog();
          break;
        case 'versionInfoDialog':
          _showVersionInfoDialog();
          break;
        case 'verifyDocStructure':
          DocumentChecker.setStatePending();

          // add the nodes to our existing array
          var nodes = eventData.context.nodesToVerify;
          _nodesToVerify = _nodesToVerify.concat(nodes);

          if (_bounceId) {
            window.clearTimeout(_bounceId);
          }
          if (CommonConfig.DOC_VERIFY_DEBOUNCE > 0) {
            _bounceId = window.setTimeout(
                _verifyDocStructure, CommonConfig.DOC_VERIFY_DEBOUNCE);
          } else {
            _verifyDocStructure();
          }
          break;
        case 'logGAEvent':
          var command = eventData.context.command;
          MessageBus.pushMessage({
            id: 'recordEvent',
            category: command.category,
            action: command.action,
            label: command.label,
            value: command.value
          });
          break;
        case 'createNewTab':
          var link = eventData.context.link;
          MessageBus.pushMessage({
            id: 'createNewTab',
            link: link
          });
          break;
        default:
          console.warn('Common content manager did not handle action ' +
              eventData.action);
          break;
      }
    }
  };

  /**
   * Display a conversion promotion dialog for OCM menu item clicks.
   * This dialog allows the user to convert their content to Google Docs.
   */
  function _showOCMConversionPromoDialog() {
    // Note: MessageBus cannot be used in the shareButton custom element
    // because it creates a circular dependency, so sending message here.
    // The message must specify an Analytics category and the action.
    MessageBus.pushMessage({
      id: 'recordEvent',
      category: 'button-bar',
      action: 'share'
    });

    var dialog = new QowtPromoDialog();
    dialog.promoType = 'ocm';
    dialog.app = EnvModel.app;
    dialog.callback = function(type) {
      if (type === 'convert') {
        _convertToDocs();
      } else {
        MessageBus.pushMessage({
          id: 'recordEvent',
          category: 'menu',
          action: 'convertToDocsCancelled'
        });
      }
    };
    dialog.show();
  }

  /**
   * Display the keyboard shortcuts dialog if it is not already on the page.
   */
  function _showKeyboardShortcutsDialog() {
    var alreadyShown = document.querySelector(
        '[is=qowt-keyboard-shortcuts-dialog]');
    if (!alreadyShown) {
      var dialog = new QowtKeyboardShortcutsDialog();
      dialog.show();
    }
  }

  /**
   * Display the version info dialog.
   */
  function _showVersionInfoDialog() {
    var dialog = new QowtVersionInfoDialog();
    var para = document.createElement('p');
    para.setAttribute("id", "dialogDesc1");
    para.textContent = chrome.runtime.getManifest().version;
    dialog.appendChild(para);
    dialog.show();
  }
  /**
   * Make a copy of the currently open file.
   *
   * If the current file is a Drive-hosted file then make a new
   * Drive-hosted file from the current content of the private file.
   * If the current file is a non-Drive-hosted file then make a new
   * local file from the current content of the private file.
   * Non-Drive hosted files include CrOS files opened from the Files
   * app and also all streams (blue web links, and files opened on
   * the desktop via the 'File -> Open' browser menu)
   */
  function _makeCopy() {
    CommandManager.addCommand(MakeACopyCmd.create());
  }

  function _saveAs(context) {
    var cmd = SaveFileCmd.create();
    cmd.addChild(WriteToUserFileCmd.create('writeToNew', context));
    CommandManager.addCommand(cmd);
  }

  function _autoSaveFile(newRevision) {
    // 1. we always auto-save to the private file
    var cmd = SaveFileCmd.create();
    // 2. we also auto-save to the local file or Drive file if one exists
    if(FileInfo.userFileType === 'local' && !FileInfo.isRenamed) {
      cmd.addChild(WriteToUserFileCmd.create('writeToExisting'));
    }
    else if(FileInfo.userFileType === 'drive') {
      cmd.addChild(WriteToExistingDriveFileCmd.create(newRevision));
    }
    CommandManager.addCommand(cmd);
  }

  function _convertToDocs() {
    CommandManager.addCommand(ConvertToDocsCmd.create());
  }

  /**
   * Display a conversion promotion dialog for Sharing this document.
   * This encourages the user to convert their content to Google Docs.
   */
  function _shareConversionFlow() {

    var dialog = new QowtPromoDialog();
    dialog.promoType = 'share';
    dialog.app = EnvModel.app;
    dialog.callback = function(type) {
      if (type === 'convert') {
        _convertToDocs();
      } else {
        MessageBus.pushMessage({
          id: 'recordEvent',
          category: 'button-bar',
          action: 'shareConversionCancelled'
        });
      }
    };
    dialog.show();
  }

  function _print() {
    window.print();
  }

  function _download() {
    CommandManager.addCommand(DownloadFileCmd.create());
}

  function _qowtDrivenUndo() {
    CommandManager.undoLastCommand();
  }

  function _qowtDrivenRedo() {
    CommandManager.redoLastCommand();
  }

  function _coreDrivenUndo() {
    CommandManager.addCommand(UndoCmd.create());
  }

  function _coreDrivenRedo() {
    CommandManager.addCommand(RedoCmd.create());
  }

  function _reportIssue(context) {
    UserFeedback.reportAnIssue(context.description);
  }

  function _commandSequenceStart(/*context*/) {
    CommandManager.addCommand(CommandSeqStartCmd.create());
  }

  function _commandSequenceEnd(context) {
    CommandManager.addCommand(CommandSeqEndCmd.create(context.command));
  }

  function _lockScreen(/*context*/) {
    PubSub.publish("qowt:lockScreen", {});
  }

  function _unlockScreen(/*context*/) {
    PubSub.publish("qowt:unlockScreen", {});
  }

  function _helpCenter(/*context*/) {
    // TODO support being passed different context-dependant links from
    // content managers. For now hardcoding only this link.
    var link = Platform.isCros ?
      'http://support.google.com/chromeos/bin/answer.py?hl=en&answer=2481498' :
      'https://support.google.com/docs/?p=ocm_help';
    _openNewPage(link);
  }

  function _openNewPage(link) {
    MessageBus.pushMessage({id: 'showHelp', link: link});
  }

  /**
   * Retrieve the document content once again so we can verify our
   * HTML representation.
   * @private
   */
  function _verifyDocStructure() {
    DocumentChecker.begin(_nodesToVerify);
    _nodesToVerify = [];
  }


  function _insertMedia(media) {
    var insertMediaHandler = InsertMediaFactory.create(media);
    insertMediaHandler.insertMedia();
  }


  function _showImagePickerDialog() {
    ImagePicker.invokeNativePicker();
  }

  return _api;

});
