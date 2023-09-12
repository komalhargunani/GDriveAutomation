define([
  'utils/analytics/fileLoadTimeLogger',
  'qowtRoot/contentMgrs/documentContentMgr',
  'qowtRoot/contentMgrs/presentationContentMgr',
  'qowtRoot/contentMgrs/quicksheet/workbookContentMgr',
  'qowtRoot/controls/viewLayoutControl',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/observers/disableQowt',
  'qowtRoot/errors/observers/errorUi',
  'qowtRoot/features/utils',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/models/env',
  'qowtRoot/models/fileInfo',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/savestate/autoSaveScheduler',
  'qowtRoot/savestate/saveDialogHandler',
  'qowtRoot/utils/eventUtils',
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/ui/modalSpinner',
  'qowtRoot/qowtModules',
  'common/elements/all'], function(
  FileLoadtimeLogger,
  DocumentContentManager,
  PresentationContentManager,
  WorkbookContentManager,
  ViewLayoutControl,
  ErrorCatcher,
  DisableQowt,
  ErrorUi,
  Features,
  MessageBus,
  EnvModel,
  FileInfo,
  PubSub,
  AutoSaveScheduler,
  SaveDialogHandler,
  EventUtils,
  I18n,
  ModalSpinner
  /* QOWT Modules */
  /* Custom Elements */) {

  'use strict';

  /**
   * NOTE: This file returns the following function, not a module object!
   * When the iframe document is loaded this module is required and it returns
   * this initialize function to be called by mainQOWT.js
   * @param {Error?} error
   */
  function initializeQowt(error) {
    setupSubscriptions_();
    connectMessageBus_();
    initErrorFramework_(error);
    // QOWT Initialization: Singletons should NOT execute any code onLoad except
    // subscribe to qowt:init qowt:disable or qowt:destroy
    PubSub.publish('qowt:init', {});
  }


  function setupSubscriptions_() {
    // TODO dtilley@ The LockScreen/ModalSpinner should be a Polymer element
    // that can handle its own subscriptions
    PubSub.subscribe('qowt:lockScreen', toggleModalSpinner_);
    PubSub.subscribe('qowt:unlockScreen', toggleModalSpinner_);
    /**
     * Add key listener to cancel default print as it doesn't work well with
     * iframes; we intercept it and call print from within the frame instead
     * This is handled both here and in the parent window since the window focus
     * will determine whether the key is intercepted or not
     */
    window.addEventListener('keydown', handleKeyDown_);
  }


  function toggleModalSpinner_(signal) {
    if (signal === 'qowt:lockScreen') {
      ModalSpinner.show();
    } else {
      ModalSpinner.hide();
    }
  }


  var P_KEYCODE = 80;
  function handleKeyDown_(event) {
    if (!event.keyCode) {
      return;
    }
    // TODO dtilley@ We should really have some sort of utility module for
    // dealing with capturing and analyzing keyboard interaction, possibly
    // modify some code for the mock keyboard E2E utility?
    if ((event.keyCode === P_KEYCODE) && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      window.print();
    } else if (EventUtils.isSaveKeyCombo(event)) {
      event.preventDefault();
      event.stopPropagation();
      if (!document.querySelector('dialog') && !document.webkitIsFullScreen) {
        PubSub.publish('qowt:ss:saveUsingCtrl-S');
      }
    }
  }


  function connectMessageBus_() {
    // Connect QOWT's message bus to the App's message bus
    // Note: the connectFromQowtToApp variable is only used to provide some
    // additional logging in case the msg bus fails to connect. This logging
    // (to Google Analytics) should help us identify if our handshaking is
    // failing, or if it's a mere time out
    // TODO(jliebrand): remove this when we know the real error
    window.parent.connectFromQowtToApp = new Date();
    MessageBus.connect(window.parent);
  }


  function initErrorFramework_(error) {
    ErrorUi.init();
    ErrorCatcher.addObserver(ErrorUi.show);
    ErrorCatcher.addObserver(DisableQowt);
    ErrorCatcher.init();
    if (error) {
      ErrorCatcher.handleError(error);
    } else{
      MessageBus.listen(handleAppMessage_);
    }
  }


  function handleAppMessage_(message) {
    if (message && message.data) {
      switch (message.data.id) {

        case 'featureOverrides':
          Features.setOverrides(message.data.overrides);
          break;

        case 'openFile':
          // got a message to open a file... once we do, the transport
          // will start listening to the bus... So we can stop listening
          // TODO(jliebrand): is there a chance for a race condition here??
          // it will take the transport some (async) time to connect to the bus
          // is there a chance we will miss a message?
          // historically we had the qowtController handle the initial app msg
          // but now i wonder if we still need this two-phase listen... could
          // we not have the transport listen from the start? and even listen
          // to the 'openFile' and 'featureOverride' messages??
          // isn't the whole point of the msgBus that we dont have to do this
          // wacky "stop listening"?

          // Tests are only loaded in debug mode.
          require(['monkeyLoader!monkeyClient'], function() {
            require(['monkeyLoader!monkeyTests'], function() {
              _openFile(message);
            });
          });
          break;

        case 'stateChange':
          window.qowtState = message.data.data;
          break;

        case 'updateFileInfo':
          FileInfo.isRenamed = undefined;
          MessageBus.stopListening(handleAppMessage_);
          break;
        default:
          // ignore other messages (like the errorCatcher's 'errorSync' as
          // that is handled by the errorCatcher itself)
          break;
      }
    }
  }

  // TODO dtilley@ Most of this functionality should be taking care of by the
  // AppLayoutControl, which would be a new Polymer element to replace the
  // viewLayoutControl.
  function _openFile(message) {
    var data = message.data;
    var env = data.environment;
    EnvModel.app = env.app;
    EnvModel.embedded = data.embedded;
    // store url, display name and format (eg OOXML vs CBF)
    FileInfo.originalURL = data.originalURL;
    FileInfo.displayName = data.displayName;
    FileInfo.format = data.format;
    FileInfo.upsaveNeeded = data.format !== 'OOXML';
    FileInfo.userFileType = data.userFileType;
    FileInfo.driveFileReadOnly = data.driveFileReadOnly;
    FileInfo.entryPoint = data.entryPoint;
    FileInfo.isMacroEnabledFile = data.isMacroEnabledFile;
    FileInfo.isRenamed = data.isRenamed;
    FileInfo.extension = data.extension;
    FileInfo.fileSize = data.fileSize;
    FileInfo.app = env.app;
    // enable the correct style sheet
    _enableStylesheet(EnvModel.app);

    // initialise the view layout control
    // TODO dtilley Should this init be triggered by a signal?
    _initAppLayout(EnvModel.app, data.newDocument);

    // initialize the auto-save scheduler and save dialog handler now that the
    // document info has been stored and the control has been constructed. Save
    // dialog handler, in its init method tries to get the butter bar and bacon
    // bar items from the main toolbar. However, mainToolbar is available in
    // editor mode only, so restrict this handler as well for editor mode.
    if (Features.isEnabled('edit')) {
      // TODO dtilley Should this init be triggered by a signal?
      AutoSaveScheduler.init();
      var baconBar = ViewLayoutControl.getToolbarItem('bacon-bar');
      var butterBar = ViewLayoutControl.getToolbarItem('butter-bar');
      SaveDialogHandler.init(baconBar, butterBar);
    }

    var action = {
      'word': {
        action: 'openDocument',
        context: {contentType: 'document'}
      },
      'sheet': {
        action: 'openWorkbook',
        context: {contentType: 'workbook'}
      },
      'point': {
        action: 'openPresentation',
        context: {contentType: 'presentation'}
      }
    }[EnvModel.app];
    action.context.displayName = data.displayName;
    action.context.originalURL = data.originalURL;
    action.context.isIncognito = data.isIncognito;

    // start everything off by executing the initial action
    PubSub.publish('qowt:doAction', action);

    // if we are opening a Drive file for which the user only has 'read'
    // permission then we want to display 'Read only' in the notification bar.
    // The Autosave Scheduler will also have used this information to disable
    // auto-saves to a read only Drive file. Note that read permission applies
    // to any Drive document to which the user only has 'view' or 'comment'
    // permission (not 'edit' permission)
    if(FileInfo.driveFileReadOnly) {
      PubSub.publish('qowt:notification', {
        msg: I18n.getMessage('read_only'),
        timeOut: -1
      });
    }

    toggleModalSpinner_('qowt:unlockScreen');

    // signal to allow E2E tests to trigger running at THIS point in time
    PubSub.publish('qowt:openFile', {});
  }


  /**
   * initialise the view layout control for this app
   *
   * @param {string} app name of the app
   */
  function _initAppLayout(app, newDocument) {
    FileLoadtimeLogger.init();
    // TODO dtilley Should this init be triggered by a signal?
    ViewLayoutControl.init({
      'anchorNode': document.getElementById('qo_app'),
      'appContext': app,
      'newDocument': newDocument
    });
    switch (app) {
      case 'word':
        DocumentContentManager.init();
        break;
      case 'sheet':
        WorkbookContentManager.init();
        break;
      case 'point':
        PresentationContentManager.init();
        break;
      default:
        throw new Error('missing app; failed to initialise');
    }
  }


  /**
   * Enable the relevant stylesheet for the active content (app).
   * @private
   * @param {string} envirionment The appContext to grab CSS for.
   */
  var SHOW_TOOLBAR_DELAY = 100;
  function _enableStylesheet(appContext) {
    if (!appContext) {
      throw new Error('Unknown appContext, failed to enable css');
    }
    var styleElm = appContext + '-css';
    var css = document.getElementById(styleElm);
    css.disabled = false;
    // Fix for QW-1885: Hide the toolbar until the CSS has been enabled
    // Here we set a timeout to allow the stylesheet to load and apply
    // its styles before we show the toolbar
    window.setTimeout(
        ViewLayoutControl.showToolbar.bind(null, appContext),
        SHOW_TOOLBAR_DELAY);
  }

  return initializeQowt;

});
