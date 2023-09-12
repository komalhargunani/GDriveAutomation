/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/*
 * Main application module, which contains and handles the NaCl plugin.
 * It also talks to QOWT inside the sandboxed iframe and acts as a messenger
 * between NaCl and QOWT.
 */
define([
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/fileDoesNotExistError',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/tryUtils',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/features/utils',
  'controllers/appState',
  'controllers/fileManager',
  'errorObservers/gaExceptionLogger',
  'errorObservers/hideUI',
  'errorObservers/showQOWT',
  'utils/analytics/googleAnalytics',
  'utils/converter',
  'utils/metrics',
  'utils/sendUserFeedback',
  'utils/backgroundPageUtils',
  'utils/gdrive/driveUtils',
  'utils/urlUtils',
  'qowtRoot/third_party/when/when',
  'utils/gdrive/drive',
  'qowtRoot/utils/uuid',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/localStorageManager',
  'common/elements/google-consumer-survey/google-consumer-survey'
  ],
  function(
    ErrorCatcher,
    QOWTException,
    FileDoesNotExistError,
    TypeUtils,
    Try,
    PromiseUtils,
    MessageBus,
    Features,
    AppState,
    FileManager,
    GAExceptionLogger,
    HideUiOnError,
    ShowQOWT,
    GA,
    Converter,
    Metrics,
    SendUserFeedBack,
    BpUtils,
    DriveUtils,
    UrlUtils,
    when,
    Drive,
    UUIDUtils,
    PubSub,
    LocalStorageManager) {

  'use strict';

  var _api = {

    /**
     * Open the file described in the app model.
     * Throws an exception if no file information is set in the model
     */
    openFile: function() {
      if (!FileManager.isReady) {
        throw new Error('Error: app not ready to open file yet');
      }

      // set our state to opening... any further state updates
      // will come from qowt... see '_handleQowtUiMsg' for msg 'qowtState'
      AppState.updateState('Opening');

      _setFavIcon();
      _setupNaclListeners();

      _tellQowtFeatureOverrides();
      _tellQowtToOpenFile();
    }
  };

  // VVVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVV
  /**
   * Reference to the <sandbox> iframe element that QOWT resides in.
   */
  var _sandboxFrame;

  /**
   * Holds the locale environment for app
   */
  var _environment;

  /**
   * Reference to the <embed> element holds the NaCl plugin instance.
   */
  var _plugin;

  var _didNaClCrash;

  var _featureOverrides;
  var _kMsgId = 'featureOverrides';
  var PENDING_GA_STORE_KEY = 'pending_ga';

  var _tabId;
  var _uuid;
  var _isIncognito = false;
  var _convertWasCanceled = false;
  var _uniqueListenerOfChromeDownloads = true;

  function _setFavIcon() {
    // Update the browser/tab title to reflect the chosen document.
    // and set the correct fav icon
    _updateTitle();
    var favIcon = Converter.mime2Icon(FileManager.mimeType());
    if(favIcon) {
      var link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = favIcon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

  }


  /**
   * set the correct listeners to handle communication between qowt and
   * the plugin (and handling of errors)
   */
  function _setupNaclListeners() {
    _plugin = document.getElementById('qonacl');
    if (_plugin) {
      _plugin.addEventListener('message', _handleNaClMessage, false);
    } else {
      throw new Error('App can not find core plugin');
    }
  }

  function _getFeatureOverrides() {
    try {
      _featureOverrides = {};
      // overrides can be set in either local or session storage
      // with local storage overriding session storage. This allows us
      // for example to have the "experimental" overrides trump the
      // "release" overrides.
      var sessionStr = window.sessionStorage.getItem(_kMsgId);
      var localStr = LocalStorageManager.getItem(_kMsgId);

      if (!localStr) {
        // In case the local storage is not ready, manually setting the values
        // here.
        // Do match `localStr` with the content in allEditFeatures.js
        localStr = '{"edit":true,"pointEdit":true}';
      }

      TypeUtils.extend(_featureOverrides, JSON.parse(sessionStr));
      TypeUtils.extend(_featureOverrides, JSON.parse(localStr));

      if (Object.keys(_featureOverrides).length > 0) {
        // override our local features (for this window)
        Features.setOverrides(_featureOverrides);
      }
    } catch(e) {
      // ignore errors; assume no overrides in case there was some dodgy
      // stuff in the localStorage
    }
  }

  function _tellQowtFeatureOverrides() {
    // tell qowt about any feature overrides we have
    if (_featureOverrides) {
      MessageBus.pushMessage({
        id: _kMsgId,
        overrides: _featureOverrides
      });
    }
  }

  function notifyQOWTToUpdateFileInfo() {
    // tell qowt to update File Info
    MessageBus.pushMessage({
      id: 'updateFileInfo'
    });
  }

  function _tellQowtToOpenFile() {
    // tell qowt to open the file
    _environment.app = Converter.mime2App(FileManager.mimeType());
    var fileExtension = Converter.mime2Extension(FileManager.mimeType());
    var isMacroEnabledFile = !!((fileExtension === 'docm' ||
        fileExtension === 'pptm' || fileExtension === 'xlsm'));
    FileManager.getPrivateFileFromEntry().then(function(privateFile) {
      MessageBus.pushMessage({
        id: 'openFile',
        displayName: FileManager.displayName(),
        originalURL: FileManager.originalURL(),
        userFileType: _getUserFileType(),
        entryPoint: FileManager.getEntryPoint(),
        driveFileReadOnly: FileManager.driveFileRole() === 'reader',
        format: Converter.mime2Format(FileManager.mimeType()),
        isRenamed: FileManager.getCache().isRenamed,
        environment: _environment,
        isMacroEnabledFile: isMacroEnabledFile,
        newDocument: FileManager.isNewDocument(),
        embedded: FileManager.isEmbedded(),
        isIncognito: _isIncognito,
        extension: fileExtension,
        fileSize: privateFile.size
      });
    });
  }

  /**
   * Deal with the message received from NaCl. These are messages for QOWT.
   * @param {Object} message The message received from NaCl.
   * @param {Any} message.data
   */
  function _handleNaClMessage(message) {
    var content = message.data;
    if (!TypeUtils.isString(content) && !TypeUtils.isObject(content)) {
      throw new Error('Invlid content from Core');
    }

    // We can receive either an ArrayBuffer or string content.
    // For strings, we parse it in to a json object.
    if (TypeUtils.isString(content)) {
      content = Try.withWarning("JSON Syntax error in content from Core")
          .rethrow(JSON.parse.bind(JSON, content));
      if (content.name === 'NaClCrash') {
        // set this flag to true so that next time we receive binary data, we
        // know it corresponds to the minidump.
        _didNaClCrash = true;
      }
    } else if (_didNaClCrash) {
      // handle the NaCl crash including the minidump.
      _uploadNaClCrash(content);
      _reportNaClCrash();
    }

    // place NaCl messages straight on to the message bus
    if (!_didNaClCrash) {
      MessageBus.pushMessage({id: 'dcp', content: content});
    }
  }

  /**
   * Upload the minidump binary data to the external server.
   * @param {Object} minidump The minidump of NACL crash
   */
  function _uploadNaClCrash(minidump) {
    console.error('reporting minidump to local server');
    var formData = new FormData();
    formData.append('prod', 'Quickoffice');
    formData.append('ver', chrome.runtime.getManifest().version);
    formData.append('upload_file_minidump', new Blob([minidump]));

    var request = new XMLHttpRequest();
    request.open('POST', chrome.runtime.getManifest().crash_dump_server, true);
    request.send(formData);
  }

  /**
   * NACL exception/crash signal is handled by breakpad.
   * We need to present user about the same by telling pluginLoader about
   * this NaCl Crash.
   */
  function _reportNaClCrash() {
    PubSub.publish('app:naclCrash');
  }

  /**
   * Handle the Chrome menu shortcuts to cancel default behaviours that
   * don't suit the nature of our app.
   */
  function _handleKeyDown(evt) {
    // DuSk TODO: Remove this whole key handling framework from the app once we
    // have forced focus to the sandboxed iframe - or when we get real
    // browser events to use rather then key handling.
    if(!evt.keyCode) {
      return;
    }

    // key codes for S and P
    var printKeyCode = 80,
      saveKeyCode = 83;

    // block both mac "cmd-X" and windows "cntrl-X" keys
    if(evt.metaKey || evt.ctrlKey) {
      switch(evt.keyCode) {

      case printKeyCode:
        // prevent default print and trigger print from within iframe
        // instead. This works around problems printing iframes
        evt.preventDefault();
        MessageBus.pushMessage({id: 'print'});
        break;

      case saveKeyCode:
        // Prevent default save (of HTML page). We cannot invoke our own save
        // from the app since that introduces unwanted qowt dependancies.
        evt.preventDefault();
        break;

      default:
        break;
      }
    }
  }

  function _init() {
    // make sure we clear the tab title until such time that we have a
    // filename; to reduce the flickering of "Chrome Viewer"
    document.title = "";
    _connectToQowtMessageBus();

    // generate a unique session id to be used with reporting to GA
    var sessionId = UUIDUtils.generateUUID();
    GA.setSessionGroup(sessionId);

    AppState.init();



    //prepare and cache app locale environment
    _environment = {
      locale: chrome.i18n.getMessage('@@ui_locale'),
      defaultLocale: 'en'
    };

    // Add key listener to cancel default print as it doesn't work well
    // with iframes; we intercept it and call print from within the frame
    // instead
    // Note: We handle this both in the app here and in the sanboxed iframe,
    // since depending on which window has focus determines whether the key
    // is intercepted or not.
    window.addEventListener('keydown', _handleKeyDown);

    ErrorCatcher.addObserver(GAExceptionLogger);
    ErrorCatcher.addObserver(HideUiOnError);
    ErrorCatcher.addObserver(ShowQOWT);
    ErrorCatcher.init();

    // when we have successfully parsed the URL and also obtained the
    // id of the current tab then we can add the listeners and initialise
    // the entry point.
    // NOTE: we are using when.done here; so if either of the
    // promises fails (or timesout), then the error will be
    // rethrown and caught by the errorCatcher
    when.all([
        _sendInitInstruments(),
        _getUUID(),
        _getCurrentTabId(),
        _addMessageBusListeners()
      ])
    .then(_initializeEntryPoint)
    .then(_surveyUser)
    .done();

  }

  function _sendInitInstruments() {
    // Send pending events
    _sendPendingGAEvents();

    // Send online status
    _sendCachableGAEvent({
      category: 'network-status',
      action: window.navigator.onLine ? 'online' : 'offline'
    });

    var identityResolver = function(resolve) {
      chrome.identity.getProfileUserInfo(function(userInfo) {

        var signedIn = (userInfo.email !== '');
        var online = window.navigator.onLine;

        _sendCachableGAEvent({
          category: 'account-status',
          action: signedIn ? 'signed-in' : 'signed-out'
        });

        var action = signedIn ?
            ( online ? 'signedin-online' : 'signedin-offline') :
            ( online ? 'signedout-online': 'signedout-offline');

        _sendCachableGAEvent({
          category: 'account-network',
          action: action
        });

        resolve();

      }.bind(this));
    };

    var promise = when.promise(identityResolver.bind(this))
        .timeout(3000, 'Timed-out waiting for identity info')
        .catch( function(){
          // Catch timeout errors to avoid having them prevent the app from
          // loading.
        });

    return promise;
  }

  function _sendCachableGAEvent(event) {
    if (window.navigator.onLine) {
      GA.sendEvent(event);
    } else {
      var store = _getGAPendingStore();
      store.push(event);
      LocalStorageManager.setItem(PENDING_GA_STORE_KEY, JSON.stringify(store));
    }
  }

  function _sendPendingGAEvents() {
    if (window.navigator.onLine) {
      var store = _getGAPendingStore();

      if (store.length > 0) {
        for (var i=0; i<store.length; i++) {
          if (store[i] && typeof store[i] === 'object') {
            GA.sendEvent({
              category: store[i].category,
              action: store[i].action,
              label: store[i].label
            });
          }
        }
      }

      LocalStorageManager.setItem(PENDING_GA_STORE_KEY, JSON.stringify([]));
    }
  }

  function _getGAPendingStore() {
    var store;
    try {
      // use the previously cached store if there is one
      store = LocalStorageManager.getItem(PENDING_GA_STORE_KEY);
      store = JSON.parse(store);
      if (!Array.isArray(store)) {
        store = [];
      }
    }
    catch(e) {
      store = [];
      console.warn('Failed to initialize file store ' +
        'so resetting it to be empty: ' + e);
    }
    return store;
  }

  function _connectToQowtMessageBus() {
    // connect the app's message bus to QOWT's message bus
    // note: the connectFromAppToQowt variable is only used
    // to provide some additional logging in case the msg bus
    // fails to connect. This logging (to Google Analytics)
    // should help us identify if our handshaking is failing,
    // or if it's a mere time out.
    // TODO(jliebrand): remove this we know the real error
    _sandboxFrame = document.getElementById('sandbox');
    window.connectFromAppToQowt = new Date();
    MessageBus.connect(_sandboxFrame.contentWindow);
  }

  function _checkForIncognitoMode() {
    return new Promise(function(resolve, reject) {
      if(chrome && chrome.tabs && chrome.tabs.get) {
        chrome.tabs.get(_tabId, function(tab) {
          if (tab) {
            _isIncognito = tab.incognito;
            resolve();
          } else {
            reject(new Error('Missing tab for tabId ' + _tabId));
          }
        });
      } else {
        reject(new Error('Missing chrome.tabs API'));
      }
    });
  }

  function _getCurrentTabId() {
    // get the Chrome tab id so that we can use it to lock the file reaper
    var deferred = when.defer();

    _getMimeHandlerStreamInfo().then(function(streamInfo)  {
      _tabId = streamInfo.tabId;
      deferred.resolve();
    }, function() {
      if(chrome && chrome.tabs && chrome.tabs.getCurrent) {
        chrome.tabs.getCurrent(function(tab) {
          if(tab && tab.id) {
            _tabId = tab.id;
            deferred.resolve();
          }
          else {
            deferred.reject(new Error('Missing tab id'));
          }
        });
      }
      else {
        deferred.reject(new Error('Missing chrome.tabs API'));
      }
    });

    // return a promise that waits for the first of two
    // things to happen: a) the attempt to retrieve the
    // tab id succeeds or fails, or b) 30 seconds pass
    return Promise.race([
      deferred.promise,
      PromiseUtils.delayThenReject(30000,
        new Error('Requesting current tab id timed out'))
    ]);
  }

  function _addMessageBusListeners() {
    // listen for DCP requests from QOWT (intended for the Nacl plugin)
    // and UI messages from QOWT (intended for the app)
    MessageBus.listen(_handleQowtDcpRequest, _dcpRequestFilter);
    MessageBus.listen(_handleQowtUiMsg, _uiMsgFilter);
    return Promise.resolve();
  }

  var _getMimeHandlerStreamInfoPromise = null;
  function _getMimeHandlerStreamInfo() {
    if (_getMimeHandlerStreamInfoPromise === null) {
      _getMimeHandlerStreamInfoPromise = new Promise(function(resolve, reject) {
        chrome.mimeHandlerPrivate.getStreamInfo(function(streamInfo) {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(streamInfo);
        });
      });
    }
    return _getMimeHandlerStreamInfoPromise;
  }

  function _getUUID() {
    return Promise.all([_getMimeHandlerStreamInfo(), BpUtils.getPage()]).then(
        function(args) {
          var cache = FileManager.getCache();
          var streamInfo = args[0];
          if (cache && cache.originalURL === streamInfo.originalUrl) {
            chrome.mimeHandlerPrivate.abortStream();
            throw new Error('Load from cache');
          }
      return args[1].registerMimeHandlerStream(args[0]);
    }).catch(function() {
      // Not a MimeHandler stream.
      // 1. Parse URL
      var urlObject = UrlUtils.parseURL(window.location.href);

      // 2. Cache Query String if non-empty, otherise pull from cache
      if (urlObject.queryObject) {
        // cache before stripping in case refreshing
        FileManager.cacheFileDetails(urlObject.queryObject);
        // strip querty from the location.href so that future refreshes will
        // reload our private file, rather than re-download from drive/stream.
        UrlUtils.stripQueryString();
      } else {
        urlObject.queryObject = FileManager.getCache();
      }

      // 3. Check entry-point-specific source
      if (urlObject.queryObject.state) {
        return _retrieveUUIDForDriveDoc(urlObject.queryObject.state);
      } else if (urlObject.queryObject.uuid) {
        return urlObject.queryObject.uuid;
      } else {
        throw new FileDoesNotExistError();
      }
    });
  }

  /**
   * Retrieves the UUID for the first provided Drive doc by adding
   * the provided Drive doc id(s) to the background page's store
   *
   * @param {string} stateString The query state string from the url
   * @return {promise} returns a promise which resolves with
   *                   the UUID of the first provided Drive
   *                   doc, otherwise it rejects
   */
  function _retrieveUUIDForDriveDoc(stateString) {
    return BpUtils.getPage()
      .then(function(bp) {
        var firstPromise;

        try {
          var stateObj = JSON.parse(stateString);
          if (bp.handleDriveDoc && stateObj.ids) {
            var pr = bp.handleDriveDoc(stateObj.ids, stateObj.resourceKeys);

            // this promise will resolve with the
            // UUID for the first provided Drive Doc
            firstPromise = pr;
            // since this is a Drive document we also cache the userId
            // that is provided in the URL, for authentication purposes
            Drive.setUserId(stateObj.userId);
          } else {
            throw new QOWTException('Missing handleDriveDoc api');
          }
        } catch (e) {
          throw new QOWTException({
            title: 'something_not_right',
            details: 'file_not_found_error_msg'
          });
        }

        return firstPromise || when.reject(
          new Error('Failed to retrieve the UUID for first Drive Doc'));
    });
  }

  function _initializeEntryPoint(resolvedArray) {
    return BpUtils.getPage()
      .then(function(bp) {
        if(!bp.addReaperLock) {
          throw new Error("Background page's " +
            "'addReaperLock' function is undefined");
        }
        else {
          _uuid = resolvedArray[1];
          if(!TypeUtils.isString(_uuid)) {
            throw new Error("Failed to get a valid UUID");
          }

          // add a lock on the file reaper until we have created
          // our private temp file and added it to the background cache
          bp.addReaperLock(_tabId);

          // now let the FileManager module work out how our app got started
          var fileDetails = bp.getFileDetails(_uuid);
          if(!fileDetails) {
            throw new QOWTException('Missing FileDetails object');
          }
          if (fileDetails.lsUsed) {
            GA.sendEvent({
              category: 'local-storage',
              action: 'true'
            });
          }
          var clone = Object.create(fileDetails);
          return FileManager.init(clone, _uuid);
        }
      })
      .then(_privateFileReady);
  }


  function _dcpRequestFilter(message) {
    var result = false;
    if(message && message.data &&
      message.data.id === 'dcpRequest') {
      result = true;
    }
    return result;
  }


  function _uiMsgFilter(message) {
    return !_dcpRequestFilter(message);
  }


  /**
   * Survey the user if:
   *  1- the user is running in release mode
   *  2- the "hats" feature is enabled
   *  3- this is not the first time use of the app
   *  4- the user is running American English as language
   *  5- then bucket and sample the user based on which app (to ensure roughly
   *     2k - 3k surverys a week)
   */
  function _surveyUser() {
    var onboardingDone = LocalStorageManager.getItem('onboardingComplete');
    var language = chrome.i18n.getMessage('@@ui_locale');

    // match "en_US" as well as "en-us" for language
    if ((language.match(/en[-_]us/i)) && onboardingDone &&
        !Features.isDebug() &&  Features.isEnabled('hats')) {

      // use a somewhat arbitrary 3 sec timeout before displaying any surveys so
      // that it shows up after the chrome/content is shown to the user
      window.setTimeout(function() {
        // percentage rates are determined from our current 28DA's from GA to
        // ensure we survey roughly around 2k or 3k users a week. We will
        // tweak these numbers over time
        var buckets = 12;
        var config = {
          'word':  {siteId: 'wtkwz5qvgh3olklj43wihw3lhi', rate: 3},
          'sheet': {siteId: 'renjicjirwkihjol6bv5k5q7hm', rate: 8},
          'point': {siteId: '4jgyc2mhqmpdwpatxatmggghiq', rate: 4}
        };
        var app = Converter.mime2App(FileManager.mimeType());
        if (config[app]) {
          var gcs = _createSurveyElement();
          gcs.siteId = config[app].siteId;
          gcs.targetPercentage = config[app].rate;
          gcs.bucketing = buckets;
          document.body.appendChild(gcs);
        }
      }, 3000);
    }
  }


  function _createSurveyElement() {
    var gcs = document.createElement('google-consumer-survey');
    gcs.addEventListener('user-considered-for-sampling', function() {
      GA.sendEvent({
        category: 'user-survey',
        action: 'sampling',
        label: 'user-consired'
      });
    });
    gcs.addEventListener('user-sampled-for-survey', function() {
      GA.sendEvent({
        category: 'user-survey',
        action: 'sampling',
        label: 'user-sampled'
      });
    });
    return gcs;
  }

  /**
   * Deal with a DCP request received from the sandboxed QOWT.
   * These are messages intended for the Nacl plugin or the app itself.
   *
   * TODO@lorrainemartin: We need to refactor things so that requests
   * that are intended for the app (not for core) are sent as 'fire
   * and forget' messages on the MessageBus, rather than as DCP commands.
   * We could also do with splitting up the functionality in
   * application.js into seperate modules for better encapsulation
   *
   * @param {object} message The DCP request received from QOWT
   */
  function _handleQowtDcpRequest(message) {
    if(message && message.data && message.data.content) {
      var dcpRequest = message.data.content;
      if(_isDcpRequestForApp(dcpRequest)) {
        // this DCP request is intended to be processed by the app itself
        _processAppRequest(dcpRequest);
      }
      else {
        // this DCP request is intended to be sent to and processsed by
        // the core - prepare the request first if there is something
        // we need to do with it. For example for open/save
        // we need to add the fileName of our private file entry.
        // We pass the _sendToCore function as a callback
        _processCoreRequest(dcpRequest, _sendToCore);
      }
    } else {
      throw new Error('DCP Requests must have content');
    }
  }

  // augment the request to become a save AS request
  // since we are upsaving to a new priv file
  function _transformSaveToSaveAs(request, sendRequestFunc) {
    request.name = 'saveAs';
    request.dst = FileManager.privateFilePath();
    sendRequestFunc(request);
  }

  function _augmentSavePriv(request, sendRequestFunc) {
    request.dst = FileManager.privateFilePath();
    sendRequestFunc(request);
  }

  function _isDcpRequestForApp(request) {
    var appRequests = ['writeToExisting', 'writeToNew',
      'writeToExistingDriveFile', 'convertToDocs', 'makeACopy', 'download'];
    return appRequests.indexOf(request.name) !== -1;
  }

  function _processCoreRequest(request, sendRequestFunc) {
    switch (request.name) {
      // open document/workbook/presentation
      case 'oPT':
      case 'oDC':
      case 'owb':
        // 'pa' is the path the core should open
        request.pa = FileManager.privateFilePath();
        sendRequestFunc(request);
        break;

      // save document; we need to hook in here if we are doing an
      // upsave, to ensure we create a new priv file entry to write to
      // with the correct extension
      case 'sDC':
        if (Converter.mime2Format(FileManager.mimeType()) === 'OOXML') {
          // no need for upsave, just send the request
          sendRequestFunc(request);
        } else {
          // upsaving for word: first create a new priv file for docx
          FileManager.createPrivateFile('docx').
              done(_transformSaveToSaveAs.bind(_api, request, sendRequestFunc));
        }
        break;

      // save workbook require 'pa' to be set for save
      // (even though technically it shouldn't really be needed);
      case 'saveWkbk':
        if (Converter.mime2Format(FileManager.mimeType()) === 'OOXML') {
          // no need for upsave, just send the request
          _augmentSavePriv(request, sendRequestFunc);
        } else {
          // upsaving for sheet: create a new priv file for xlsx.
          FileManager.createPrivateFile('xlsx').
              done(_augmentSavePriv.bind(_api, request, sendRequestFunc));
        }
        break;

      // save presentation; we need to hook in here if we are doing an
      // upsave, to ensure we create a new priv file entry to write to
      // with the correct extension
      case 'sPT':
        if (Converter.mime2Format(FileManager.mimeType()) === 'OOXML') {
          // no need for upsave, just send the request
          _augmentSavePriv(request, sendRequestFunc);
        } else {
          // upsaving for point: first create a new priv file for pptx.
          // presentation require 'dst' to be set for save
          FileManager.createPrivateFile('pptx').
              done(_augmentSavePriv.bind(_api, request, sendRequestFunc));
        }
        break;

      default:
        // nothing augmented, just pass the request straight through
        sendRequestFunc(request);
        break;
    }
  }

  function _processAppRequest(request) {
    switch (request.name) {
      // write to the existing user file
      case 'writeToExisting':
        FileManager.overwriteUserFile()
            .done(
              _onUserFileSaveSuccess.bind(_api, request.name,
                FileManager.userFilePath()),
              _fakeCoreResponse.bind(_api, request.name));
        break;

      // write to a new user file
      case 'writeToNew':
        var forceLocal = request.context && request.context.toLocal;
        FileManager.newUserFile(false, forceLocal)
          .then(_onUserFileSaveSuccess.bind(_api, request.name,
                FileManager.userFilePath()),
                _onUserFileSaveCancel.bind(_api, request.name))
          .done(function() {/*do nothing on success*/},
                _fakeCoreResponse.bind(_api, request.name));
        break;

      // make a copy
      case 'makeACopy':
        // if the current file is a Drive-hosted file then communicating with
        // Drive could take some time over the air so send a fake success
        // response to QOWT immediately to unblock subsequent non-optimistic
        // commands. When the actual Drive response is received then tell QOWT
        // about it so that it can update the UI
        _fakeCoreResponse(request.name);
        var makeACopy = true;
        FileManager.newUserFile(makeACopy)
            .done(
              _onCopySuccess.bind(_api, FileManager.userFilePath()),
              _onCopyFailure);
        break;

      // write to the existing Drive file
      case 'writeToExistingDriveFile':
        // uploading to Drive could take some time over the air so send a
        // fake success response to QOWT immediately to unblock subsequent
        // non-optimistic commands. When the actual Drive response is
        // received then tell QOWT about it so that it can update the UI
        _fakeCoreResponse(request.name);
        FileManager.overwriteUserFile(request.newRevision)
            .done(
              _onDriveFileSaveSuccess.bind(_api, request.token),
              _onDriveFileSaveFailure.bind(_api, request.token));
        break;

      // create a new Drive-hosted GoogleDocs file from the current Office file
      case 'convertToDocs':
        // uploading to Drive could take some time over the air so send a
        // fake success response to QOWT immediately to unblock subsequent
        // non-optimistic commands
        _fakeCoreResponse(request.name);
        FileManager.convertToDocs()
          .done(
            _onDriveFileConvertSuccess,
            _onDriveFileConvertFailure);
        break;

      // download the file
      case 'download':
        // Continuous clicking of 'Download' button leads to multiple listener
        // registered for onDeterminingFilename event. That leads to crash.
        // So, to have unique listener, at any given time, we are using flag
        // _uniqueListenerOfChromeDownloads
        if (_uniqueListenerOfChromeDownloads) {
          chrome.downloads.onDeterminingFilename.addListener(
            /* eslint-disable no-unused-vars */
            function listenToChromeDownloads(item, suggest) {
            /* eslint-enable no-unused-vars */
              suggest({filename: FileManager.tryAndGetDownloadFileName(),
                       conflictAction: 'uniquify'});
              // If we didn't remove this event listener here, it will keep
              // listening to downloads event outside QuickOffice too.
              // That renames other downloaded (not initiated by QO) files too.
              chrome.downloads.onDeterminingFilename.removeListener(
                  listenToChromeDownloads);
              _uniqueListenerOfChromeDownloads = true;
          });
          _uniqueListenerOfChromeDownloads = false;
          FileManager.downloadToLocalFile();
        }
        _fakeCoreResponse(request.name);
        break;

      default:
        console.log("#!#! Unexpected processAppRequest " + request.name);
        break;
    }
  }

  function _openDriveFileInNewTab(response) {
    // open the new Drive file in a new tab
    return when.promise(function(resolve) {
      _openNewTab(_getLinkToOpenInQO(response), resolve);
    });
  }

  function _openDriveFileInCurrentTab(response) {
    // open the new Drive file in the current tab
    return when.promise(function(resolve) {
      _updateCurrentTab(_getLinkToOpenInQO(response), resolve);
    });
  }

  /**
   * Construct a URL that will open a Drive-hosted Office file
   * or converted Google Docs file in a new browser tab.
   *
   * The URL is constructed from info in the passed Drive response which is a
   * response to either of a 'convert to docs' or 'make a copy' request.
   *
   * @param {Object} response The raw response from a 'convert' or 'copy'.
   * @return {String} A correct URL.
   */
  function _getLinkToOpenInQO(response) {
    var openUrl;
    var responseUrl = response.result ? response.result.alternateLink
        : undefined;
    var extension = response.result ? response.result.fileExtension
        : undefined;
    var qoSupportedFormat = Converter.extension2Format(extension);
    if (responseUrl && !responseUrl.match(/.*\/file\/.*/) &&
        !qoSupportedFormat) {
      // The alternate link is to a native type (Google Docs/Sheets/Slides)
      // and needs no tinkering to open in a tab.
      openUrl = responseUrl;

      // The only additional thing we need to do here is add a 'convertnative=1'
      // param to the URL, so that when it is opened in a new tab Docs can
      // detect this param and display an Office->Docs post-conversion message
      var param = 'nativeconvert=1';
      var matches = openUrl.match(/(.*)\?(.*)/);
      if(!matches) {
        // there is no query section, so create one now containing our param
        openUrl += '?' + param;
      }
      else if(matches[2] && (matches[2].length > 0)) {
        // the query section already contains params, so append ours using '&'
        openUrl += '&' + param;
      }
      else {
        // the query section is empty, so just add our param to it
        openUrl += param;
      }
    } else if (!responseUrl || responseUrl.match(/.*\/file\/.*/) ||
               qoSupportedFormat) {
      // The alternate link will tell us what we need to know.
      // If it contains '/file/' the link refers to a "third party app" -
      // ie not a Google Docs/Slides/Sheets, and we'll need to mangle our own
      // url to open the Office file in our extension.
      openUrl = 'chrome-extension://' +
      chrome.runtime.id + '/views/app.html?state={' +
      '"ids":["' + response.result.id + '"],' +
      '"action":"open"' +
      '}';
      // TODO(dskelton) Confirm that we don't need to set a 'userId' argument.
      // Empirically we don't need to - the copy opens and is editable.
    }

    return openUrl;
  }

  /**
   * A save to a user file was successful or the save was cancelled.
   * If the user file is new then some details
   * in the background page's cache are updated.
   * Also sends a response to QOWT as if it came from Core.
   *
   * @param {string} requestName The original request (e.g 'writeToNew')
   * @param {string|undefined} prevPath The user file path that
   *                                    was previously stored
   * @param {object} response The success or cancel response
   */
  function _onUserFileSaveSuccess(requestName, prevPath, response) {
    _processUserFile(prevPath);

    // if the operation was a 'Save As' on a Drive file then open
    // the new Drive file in the current tab (do this before calling
    // fakeCoreResponse_ which will unsuppress the unload dialog)
    if((requestName === 'writeToNew') && _getUserFileType() === 'drive') {
      _openDriveFileInCurrentTab(response)
      .then(_fakeCoreResponse.bind(_api, requestName));
    }
    else {
      _fakeCoreResponse(requestName);
    }

    // TODO@lorrainemartin: For now we will send a 'userFileNotification'
    // message so that the SaveDialogHandler can update itself based on the
    // new user file details. When we refactor things so that all user file
    // operations are implemented as fire & forget messages we should have
    // the app only send 'userFileNotification' messages (containing a
    // 'drive' or 'local' value) and remove the 'driveFileNotification'
    // and 'localFileNotification' messages
    MessageBus.pushMessage({
      id: 'userFileNotification',
      context: {
        type: 'saveSuccess',
        format: Converter.mime2Format(FileManager.mimeType()),
        userFileType: _getUserFileType(),
        isRenamed: undefined,
        localFilePath:
          _getUserFileType() === "local" ? response.localFilePath : '',
        driveFileReadOnly: FileManager.driveFileRole() === 'reader'
      }
    });
  }

  function _onUserFileSaveCancel(requestName) {
    MessageBus.pushMessage({
      id: 'dcp',
      content: {
        name: requestName,
        userCancelled: true,
        format: Converter.mime2Format(FileManager.mimeType()),
        userFileType: _getUserFileType(),
        driveFileReadOnly: FileManager.driveFileRole() === 'reader'
      }
    });

    MessageBus.pushMessage({
      id: 'userFileNotification',
      context: {
        type: 'saveCancel'
      }
    });
  }

  function _processUserFile(prevPath) {
    if(FileManager.userFilePath() !== prevPath) {
      // there is a new user file - cache the private file
      // incase this was an upsave and it has changed to 2007 format
      _cachePrivateFile();
    }
  }

  /**
   * A save to a Drive file was successful.
   * Sends a message to QOWT so that it can update it's UI as necessary
   *
   * @param {object} token The token for the successful save
   *                       (this was generated by QOWT)
   */
  function _onDriveFileSaveSuccess(token) {
    MessageBus.pushMessage({
      id: 'driveFileNotification',
      context: {
        type: 'saveSuccess',
        saveToken: token
      }
    });
  }

  /**
   * A save to a Drive file failed.
   * Sends a message to QOWT so that it can update it's UI as necessary
   *
   * @param {object} token The token for the failed save
   *                       (this was generated by QOWT)
   * @param {object} response The error response
   */
  function _onDriveFileSaveFailure(token, response) {
    MessageBus.pushMessage({
      id: 'driveFileNotification',
      context: {
        type: 'saveFailure',
        saveToken: token,
        errorCode: DriveUtils.getErrorCode(response)
      }
    });
  }

  /**
   * A conversion to Google Docs was successful.
   * If the user didn't cancel the operation then a
   * new tab is opened displaying the converted document
   *
   * @param {object} response The success response
   */
  function _onDriveFileConvertSuccess(response) {
    var canceled = _convertWasCanceled;

    // Tell qowt of the success.
    MessageBus.pushMessage({
      id: 'driveFileNotification',
      context: {
        type: 'convertSuccess'
      }
    });
    _convertWasCanceled = false;

    if(!canceled) {
      return _openDriveFileInNewTab(response);
    }
  }

  /**
   * A conversion to Google Docs failed.
   * Sends a message to QOWT so that it can update it's UI as necessary
   *
   * @param {object} response The error response
   */
  function _onDriveFileConvertFailure(response) {
    var canceled = _convertWasCanceled;
    _convertWasCanceled = false;

    if(!canceled) {
      // here we record a GA Event to log the failed conversion. This is
      // different from any of the error responses that would be logged.
      // This makes it easy to track the proportion of conversions that fail.
      // The message must specify an Analytics category and the action.
      MessageBus.pushMessage({
        id: 'recordEvent',
        category: 'menu',
        action: 'convertToDocsFailed'
      });
    }

    MessageBus.pushMessage({
      id: 'driveFileNotification',
      context: {
        type: 'convertFailure',
        errorCode: DriveUtils.getErrorCode(response)
      }
    });
  }

  function _onCopySuccess(prevPath, response) {
    if(_getUserFileType() === 'drive') {
      _openDriveFileInNewTab(response);
    }
    else {
      _updateTitle();
      _processUserFile(prevPath);

      MessageBus.pushMessage({
        id: 'localFileNotification',
        context: {
          type: 'copySuccess',
          displayName: FileManager.displayName(),
          format: Converter.mime2Format(FileManager.mimeType()),
          userFileType: _getUserFileType(),
          driveFileReadOnly: false
        }
      });
    }
  }

  function _onCopyFailure(response) {
    if(_getUserFileType() === 'drive') {
      // TODO@lorrainemartin: Why is the category 'menu'? -
      // we are not using a menu item here - need to refactor this
      // and all other places where we log to GA using 'menu' for
      // non-menu scenarios
      MessageBus.pushMessage({
        id: 'recordEvent',
        category: 'menu',
        action: 'makeCopyFailed'
      });

      MessageBus.pushMessage({
        id: 'driveFileNotification',
        context: {
          type: 'copyFailure',
          errorCode: DriveUtils.getErrorCode(response)
        }
      });
    }
  }

  /**
   * Send a response to QOWT as if it came from Core. Basically
   * since we handle the file saving requests, we send a DCP response
   * back to QOWT. For more detail on the response syntax:
   * @see pronto/src/dcp/schemas/responses/response.json
   *
   * @param {string} requestName The original request (e.g 'writeToNew')
   * @param {object|undefined} opt_error Optional error object
   */
  function _fakeCoreResponse(requestName, opt_error) {
    _updateTitle();

    // send a message to qowt (even if it's an error) so
    // that it can handle command.onFailure code paths etc
    MessageBus.pushMessage({
      id: 'dcp',
      content: {
        name: requestName,
        displayName: FileManager.displayName(),
        format: Converter.mime2Format(FileManager.mimeType()),
        userFileType: _getUserFileType(),
        driveFileReadOnly: FileManager.driveFileRole() === 'reader',
        e: (opt_error && opt_error.message) || opt_error
      }
    });
  }

  function _sendToCore(payload) {
    if (!_plugin || !_plugin.postMessage) {
      throw new Error('Error: NaCl module not ready?');
    } else {
      var buffer = (payload instanceof ArrayBuffer) ? payload :
          Try.withWarning('Msg to Core must be JSON').
              rethrow(JSON.stringify.bind(JSON, payload));

      _plugin.postMessage(buffer);
    }
  }

  /**
   * Return the type of user file that exists -
   * this can either be a local file or a Drive file -
   * or undefined if there is no user file (e.g. for a stream)
   *
   * @return {string|undefined} Either 'local', 'drive' or undefined
   */
  function _getUserFileType() {
    var type;
    if(FileManager.userFilePath()) {
      type = 'local';
    }
    else if(FileManager.driveDocId()) {
      type = 'drive';
    }
    return type;
  }

  function _updateTitle() {
    document.title = FileManager.displayName();
  }

  /**
   * Deal with a UI message received from the sandboxed QOWT.
   * These are messages intended for the the app itself.
   * @param {Object} message The UI message received from QOWT
   */
  function _handleQowtUiMsg(message) {
    if(message && message.data) {
      switch(message.data.id) {

        case 'closeApp':
          window.close();
          break;
        case 'reportAnIssue':
          SendUserFeedBack.openFeedbackUI(message.data.description);
          break;
        case 'showHelp':
        case 'signIntoDrive':
          _openNewTab(message.data.link);
          break;
        case 'recordCount':
          Metrics.recordCount(message.data.context);
          break;
        case 'stateChange':
          var qowtState = message.data.data;
          AppState.updateState(qowtState.state, qowtState.context);
          break;
        case 'recordEvent':
          // message.data has category, action, label, value.
          GA.sendEvent(message.data);
          break;
        case 'recordCachableEvent':
          _sendCachableGAEvent(message.data);
          break;
        case 'createNewTab':
          _openNewTab(message.data.link);
          break;
        case 'conversionCancelled':
          _convertWasCanceled = true;
          break;
        case 'reloadTab':
          if (_tabId && chrome && chrome.tabs) {
            chrome.tabs.reload(_tabId);
            break;
          }
          window.location.reload();
          break;
        case 'setBlockUnload':
          if (chrome.mimeHandlerPrivate &&
              chrome.mimeHandlerPrivate.setShowBeforeUnloadDialog) {
            chrome.mimeHandlerPrivate.setShowBeforeUnloadDialog(
                !!message.data.blockUnload);
          }
          break;
        case 'fileNotFound':
          FileManager.updateConfigAndCache(true);
          break;
        case 'fileSaveSuccess':
          FileManager.updateConfigAndCache();
          notifyQOWTToUpdateFileInfo();
          break;
        default:
          // ignore other messages (like the errorSync messages)
          break;
      }
    }
  }

  function _openNewTab(link, opt_callback) {
    if (chrome && chrome.tabs && link &&
        link.match(/^https?:\/\/|^file:\/\/|^mailto:/i)) {
      chrome.tabs.create({url: link}, opt_callback);
    }
  }

  function _updateCurrentTab(link, callback) {
    if(chrome && chrome.tabs && link) {
      chrome.tabs.update(_tabId, {url: link}, callback);
    }
  }

  /**
   * When this function is invoked we know that
   * the private temp file for this app is ready
   */
  function _privateFileReady() {
    // cache the file details and then remove
    // our file reaper lock and open the file
    _sendFileMetaDataGAEvents();
    _cacheTabId();
    _cachePrivateFile();
    _cacheDownloadFile();
    _cacheTimestamp();
    _removeReaperLock();
    _checkForIncognitoMode()
      .then(function() {
        _api.openFile();
      }).catch(function() {
        // Even though failed to determine incognito mode,
        // try opening file assuming non-incognito mode.
        _isIncognito = false;
        _api.openFile();
      });
  }

  function _sendFileMetaDataGAEvents() {
    FileManager.getPrivateFileFromEntry().then(function(privateFile) {
      // record filesize
      GA.sendEvent({
        id: 'recordEvent',
        category: 'raw-data',
        action: 'ViewingFullContent',
        label: 'fileSize_bytes',
        value: privateFile.size
      });
      // record file type.
      GA.sendEvent({
        id: 'recordEvent',
        category: 'raw-data',
        action: 'file-ready',
        label: Converter.mime2Extension(FileManager.mimeType())
      });
    });
  }
  /**
   * Sends the tab id to the background page to cache
   */
  function _cacheTabId() {
    return BpUtils.getPage().then(function(bp) {
      if (bp.cacheTabId) {
        bp.cacheTabId(_uuid, _tabId);
      } else {
        throw new Error("Background page's " +
          "'cacheTabId' function is undefined");
      }
    });
  }

  /**
   * Sends the private file path to the background page to cache
   */
  function _cachePrivateFile() {
    return BpUtils.getPage().then(function(bp) {
      if (bp.cachePrivateFilePath) {
        bp.cachePrivateFilePath(_uuid, FileManager.privateFilePath());
      } else {
        throw new Error("Background page's " +
          "'cachePrivateFilePath' function is undefined");
      }
    });
  }

  /**
   * Sends the download file path to the background page to cache
   */
  function _cacheDownloadFile() {
    return BpUtils.getPage().then(function(bp) {
      if (bp.cacheDownloadFilePath) {
        bp.cacheDownloadFilePath(_uuid, FileManager.downloadFilePath());
      } else {
        throw new Error("Background page's " +
            "'cacheDownloadFilePath' function is undefined");
      }
    });
  }

  /**
   * Sends the timestamp to the background page to cache
   */
  function _cacheTimestamp() {
    return BpUtils.getPage().then(function(bp) {
      if (bp.cacheTimestamp) {
        bp.cacheTimestamp(_uuid);
      } else {
        throw new Error("Background page's " +
          "'cacheTimestamp' function is undefined");
      }
    });
  }

  /**
   * Removes a lock on the file reaper
   */
  function _removeReaperLock() {
    return BpUtils.getPage().then(function(bp) {
      if (bp.removeReaperLock) {
        bp.removeReaperLock(_tabId);
      } else {
        throw new Error("Background page's " +
          "'removeReaperLock' function is undefined");
      }
    });
  }

  /**
   * Adds a listener for messages from the background page
   */
  function _listenForBackgroundPageMsgs() {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        sender = sender || '';
        if(request === 'reaperCheck') {
          // send file details for this tab to the background page
          sendResponse({uuid: FileManager.getUUID()});
        }
      });
  }

  _listenForBackgroundPageMsgs();
  _getFeatureOverrides();
  // Tests are only loaded in debug mode.
  require(['monkeyLoader!monkeyAppClient'], _init);
  return _api;
});
