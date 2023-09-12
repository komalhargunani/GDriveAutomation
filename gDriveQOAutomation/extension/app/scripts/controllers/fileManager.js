/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview application's file manager. This module is responsible
 * for managing all file related activity in the app. In particular that
 * means file opening and saving. It ensures we always have a unique
 * private file entry on which our Core operates. And can save to an
 * optional userFile.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/third_party/when/when',
  'utils/converter',
  'utils/xhr',
  'utils/pluginLoader',
  'utils/fileWriter',
  'utils/metrics',
  'utils/gdrive/drive',
  'utils/gdrive/driveUtils',
  'ui/progressSpinner',
  'controllers/appState',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/tryUtils',
  'qowtRoot/utils/pathUtils',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/httpErrorFileNotFound',
  'qowtRoot/errors/unique/httpErrorZero',
  'qowtRoot/errors/unique/timeoutError',
  'qowtRoot/errors/unique/scriptLoadingTimeout',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/driveErrors',
  'qowtRoot/utils/uuid',
  'qowtRoot/utils/localStorageManager',
  'utils/analytics/googleAnalytics',
  'third_party/lo-dash/lo-dash.min'], function(
    when,
    Converter,
    XHR,
    PluginLoader,
    FileWriter,
    Metrics,
    Drive,
    DriveUtils,
    ProgressSpinner,
    AppState,
    I18n,
    Try,
    PathUtils,
    QOWTException,
    HTTPErrorFileNotFound,
    HTTPErrorZero,
    TimeoutError,
    ScriptLoadingTimeout,
    TypeUtils,
    DriveErrors,
    UUIDUtils,
    LocalStorageManager,
    GA
    /*lo-dash*/) {

  'use strict';

  var kCacheId_ = '__fileManagerCache';
  var PENDING_GA_STORE_KEY = 'pending_ga';

  /* Entry Point is the mode we used to load the file.
   * Valid values: 'driveDoc', 'stream',  'userFile', 'restore'
   */
  var entryPoint_;

  var FileManager = function() {
  };

  FileManager.prototype = {
    __proto__: Object.prototype,

    /**
     * Initialise the file manager. This can be done from a number of
     * separate entry points, resulting in either
     *  - restore from sessionStorage (browser refresh), or
     *  - start downloading a stream, or
     *  - copy userFile entry to private file entry
     *
     * This is an async function. It uses promises to complete. Use
     * FileManager.isReady boolean to know when it's ready.
     *
     * @param {object} config Object containing various properties
     * @param {string} uuid The uuid associated with the file being opened
     * @return {promise} Returns a promise that will resolve once the
     *                   FileManager has successfully initialised
     *                   itself for the file being opened
     */
     init: function(config, uuid) {
      // TODO@lorrainemartin: Rather than use and extend a cloned
      // FileDetails object in this.config_ we should just reference
      // the FileDetails properties directly when required, otherwise
      // this copy may get out of date
      this.config_ = config;
      this.uuid_ = uuid;

      /**
       * This is a public boolean value to indicate whether or not the
       * FileManager is done initialising from the given config. This is
       * used by the Application module to guard against accidentally
       * attempting to open the document before it is ready
       *
       * @return {boolean} set to true when our inner state is ready
       */
      this.isReady = false;

      /**
       * We cannot load the plugin until we know the filetype. This promise
       * decouples the calls to load a file from the call to load the plugin.
       */
      this.fileTypeKnown = when.defer();
      var pluginPromise = when(this.fileTypeKnown.promise).then(
        this.loadPlugin_.bind(this)).catch(function(error){
          throw error;
        });

      // First check if the file is cached in local storage.
      // If it is, try to restore the file from cache.
      // If it is not, or if attempts to restore from cache fail,
      // then determine point of entry and open original file.
      var documentPromise = when.resolve().then(
          this.tryToRestoreOrDeleteFromCache_.bind(this)).
          catch (this.openOriginalFile_.bind(this));

      return when.all([pluginPromise, documentPromise]).then(
          this.whenDone_.bind(this));
    },

    /**
     * @return {string|undefined} Returns the UUID that is stored in session
     *                            storage
     */
    getUUID: function() {
      return this.getCache().uuid;
    },

    //update config and cache info
    updateConfigAndCache:function(isRenamed){
      if(isRenamed){
        this.config_.preferredFilename = this.config_.userFile.name;
        this.config_.userFile = undefined;
      }
      this.config_.isDownloaded = true;
      this.config_.isRenamed = isRenamed;
      this.cacheInfo_();
    },

    /**
     * @return {Object|{}} - a cache object from session if present | {}
     */
    getCache: function() {
      var cacheStr = window.sessionStorage.getItem(kCacheId_);
      return Try.ignore(JSON.parse.bind(JSON, cacheStr)) || {};
    },

    /**
    * Returns the entryPoint from which we loaded this file
    * This is not the same as the origin type of the file.
    * For example, a 'Drive' file may be loaded from Cache.
    *
    * @return {string|undefined} the entry point string
    */
    getEntryPoint: function() {
      return entryPoint_;
    },

    /**
     * @return {string|undefined} the original URL from where the HTTP Stream
     *                            was generated
     */
    originalURL: function() {
      return _.get(this, 'config_.originalURL');
    },

    /**
     * @return {string|undefined} the path to our private file
     */
    privateFilePath: function() {
      return this.returnFilePath_(_.get(this, 'config_.privateFile',
          {} /*default*/));
    },

    /**
     * @return {string|undefined} the path to our private downloadable file
     */
    downloadFilePath: function() {
      return this.returnFilePath_(_.get(this, 'config_.downloadFile',
          {} /*default*/));
    },

    /**
     * @return {string|undefined} the path to the user file
     */
    userFilePath: function() {
      return this.returnFilePath_(_.get(this, 'config_.userFile',
          {} /*default*/));
    },

    mimeTypeFromFileName: function(fileName) {
      return Converter.extension2Mime(Converter.name2ext(fileName));
    },

    /**
     * Returns the mimeType of the document. This
     * is either the mimeType as sent along with the
     * HTTP Stream, or it is determined from our filePath (by extension)
     *
     * @return {string} the mimeType of the document
     */
    mimeType: function() {
      var mimeType = this.config_.mimeType;
      if (!Converter.mime2App(mimeType)) {
        // If appropriate app is not found, it means no mime type or invalid
        // mime type given by server. Try to determine mime from file
        // extension of either the user file, our private file, or from the
        // original url or the file extension from the drive meta data.
        // Ideally we should always take the user file into consideration
        // because user might change the file type while saving and if we take
        // private file into consideration then we might end up taking incorrect
        // mime type.
        var path =
            this.userFilePath() || this.privateFilePath() || this.originalURL();
        var pu = PathUtils.create(path);
        var extension = pu.extension() || this.config_.extension;
        mimeType = Converter.extension2Mime(extension);
      }
      return mimeType;
    },

    /**
     * Display name of the document. eg filename without path
     *
     * @return {string} the display name
     */
    displayName: function() {

      // Give preferred filename if defined
      var preferredFilename = _.get(this, 'config_.preferredFilename',
          {} /*default*/);
      if (preferredFilename.length > 0) {
        return preferredFilename;
      }

      var name;
      var path = this.userFilePath() || this.originalURL();
      if (path) {
        var pu = PathUtils.create(path);
        var fn = pu.fileName();
        // After "make a copy" the file name is not URI encoded,
        // if it contains a URI escape character (% for example)
        // the decoding functions will throw, so we need to catch
        // those exceptions and just use the filename as is.
        try {
          name = window.decodeURIComponent(fn);
        } catch(e) {
          try {
            name = window.unescape(fn);
          } catch(err) {
            name = fn;
          }
        }
      } else {
        // fall back to any title that might have been set (eg by Drive)
        name = this.config_.title;
      }
      return name;
    },

    /**
     * @return {string|undefined} The Drive doc id, or
     *                            undefined if there isn't one
     */
    driveDocId: function() {
      return _.get(this, 'config_.driveDocId');
    },

    /**
     * @return {string|undefined} The Drive file role. For example, 'reader',
     *                            'owner' or 'writer'
     */
    driveFileRole: function() {
      return _.get(this, 'config_.driveFileRole');
    },

    isNewDocument: function() {
      return _.get(this, 'config_.newDocument');
    },

    isEmbedded: function() {
      return _.get(this, 'config_.embedded');
    },

    /**
     * Create a NEW private file. This is really only ever used
     * by a client (eg the app) to create a new zero byte priv file
     * that can then be used to upSave an existing document in to.
     *
     * @param {string} extension the extension to use (eg 'docx')
     * @return {promise} returns a promise (see 'when' library)
     */
    createPrivateFile: function(extension) {
      this.config_.mimeType = Converter.extension2Mime(extension);

      return this.createPrivateFile_(extension)
          .then(this.cacheInfo_.bind(this));
    },

    /**
     * Overwrite the user File with the contents of our private file.
     * Note: the "user file" can be a drive file, which we will upload.
     *
     * If there is no existing user file (or Drive file) then the
     * returned promise will reject
     * @param {boolean} newRevision Flag to create new revisions for Drive files
     *
     * @return {Promise} returns a promise (see 'when' library)
     */
    overwriteUserFile: function(newRevision) {
      var promise;
      if (!this.config_.privateFile) {
        promise = when.reject(new Error('Cannot overwrite user file: private' +
            ' is file missing'));
      } else if (!this.config_.driveDocId && !this.config_.userFile) {
        promise = when.reject(new Error('Cannot overwrite user file: No user' +
            ' or drive file'));
      } else {
        promise = this.config_.driveDocId ? this.uploadDriveFile_(newRevision) :
            this.copyFile_(this.config_.privateFile, this.config_.userFile);
      }
      return promise;
    },

    /**
     * Create a new user File with the contents of our private file.
     * The new user file will be a Drive-hosted file if the current file is on
     * Drive, and will be a local file for anything else (ie, local files
     * on CrOS and streams).
     *
     * @param {boolean || undefined} opt_isMakeACopy A flag that indicates
     *                                               whether this operation is
     *                                               'make a copy' or not.
     *                                               Defaults to false if
     *                                               undefined
     * @param {boolean || undefined} opt_forceLocal  A flag that indicates
     *                                               whether the new file should
     *                                               be forced to be created
     *                                               locally or not.
     *                                               Defaults to false if
     *                                               undefined
     * @return {promise} returns a promise (see 'when' library)
     */
    newUserFile: function(opt_isMakeACopy, opt_forceLocal) {

      function doSaveAsOperation(fileBlob) {
        // if the Drive request fails then fallback to
        // asking the user to specify a local file
        // TODO@lorrainemartin: Note that if even the local file
        // path fails then we could be left with a scenario whereby
        // we have an upsaved 2007 private file but are still displaying
        // a 2003 Drive file. In which case any subsequent edits will
        // cause us to auto-save over the 2003 Drive file with the 2007
        // private file. To avoid this we should consider reverting
        // our private file back to 2003
        return Drive.createFileFromNonDriveFile(fileBlob,
                false /*convertToDocs*/, metadata)
            .catch(function() {return this.saveAsLocal_();}.bind(this));
      }

      var promise, metadata;
      if (!this.config_.privateFile) {
        promise = when.reject(new Error('Cannot create new user file: ' +
            'Private file missing'));
      } else if (!this.config_.driveDocId || opt_forceLocal) {
        promise = this.saveAsLocal_(opt_isMakeACopy);
      } else if (opt_isMakeACopy) {
        // this is a 'make a copy' operation, so we're just making a copy
        // of the current Office file - set the title for the new file copy
        metadata = {'title': this.nameForCopiedFile_()};
        promise = Drive.createFileFromDriveFile(this.config_.driveDocId,
            false /*convertToDocs*/, metadata);
      } else {
        // this is a 'save as' operation for a Drive file,
        // which could be an upsave - set the title for the new file.
        // Also set the parent folder for the new file to be the
        // current Drive folder (rather than the root Drive folder)
        metadata = {
          'title': this.nameForSaveAsFile_(),
          'mimeType': this.mimeType(),
          'parents': [_.get(this, 'config_.parents[0]')]
        };
        promise = this.getFileFromEntry_(this.config_.privateFile)
            .then(doSaveAsOperation.bind(this));
      }
      return promise;
    },

    /**
     * Download the private downloadable file created at file load.
     * In case, the file name already exists on the local machine, it will
     * automatically uniquify it by including a counter before the filename
     * extension.
     */
    downloadToLocalFile: function() {
      this.getFileFromEntry_(this.config_.downloadFile).
          then(function downloadFile(response) {
            var fileWithType = new File([response],
                response.name,
                {type : this.mimeTypeFromFileName(response.name)});
            var url = window.URL.createObjectURL(fileWithType);
            var downloadFileName = this.tryAndGetDownloadFileName();
            chrome.downloads.download({url: url,
              filename: downloadFileName,
              conflictAction: 'uniquify',
              saveAs: false
            });
          }.bind(this));
    },

    tryAndGetDownloadFileName: function() {
      function hasExtension(fileName) {
        // considering macro enabled, office Template and csv files as well.
        var allowedExtensions =
            /(\.do[ct][xm]?|\.p[po]t[xm]?|\.xl[st][xm]?|\.csv)$/i;
        return allowedExtensions.exec(fileName);
      }

      var fileName = _.get(this, 'config_.downloadFileName', 'downloadedFile');
      var extension = '.' + (this.config_.extension ? this.config_.extension :
          Converter.mime2Extension(this.mimeType()));
      try {
        fileName = fileName.
            replace(/[<>:"/\\|?*]/g, function(c) {
              return '%' + c.charCodeAt(0).toString(16).toUpperCase();
            });
        if (!hasExtension(fileName)) {
          fileName += extension;
        }
      } catch (e) {
        // In case encodeURIComponent fails to encode the name, we fallback to
        // provide a default file name
        fileName = 'downloadedFile' + extension;
      }
      return fileName;
    },

    /**
     * Create a new Drive-hosted Google Docs file from the contents of our
     * currently open private file.
     *
     * @return {Promise} returns a promise.
     */
    convertToDocs: function() {
      // set the title for the converted file
      var metadata = {
        'title': this.nameForConvertedFile_(),
        'mimeType': this.mimeType()
      };

      var promise;
      if (this.config_.driveDocId) {
        promise = Drive.createFileFromDriveFile(this.config_.driveDocId,
            true /*convertToDocs*/, metadata);
      } else {
        promise = this.getFileFromEntry_(this.config_.privateFile)
          .then(function(fileBlob) {
              return Drive.createFileFromNonDriveFile(fileBlob,
                  true /*convertToDocs*/, metadata);
            });
      }
      return promise;
    },

    /**
     * Saves file details to session storage.
     * @param {Object} fileDetails - file details to be stored
     */
    cacheFileDetails: function(fileDetails) {
      window.sessionStorage.setItem(kCacheId_, JSON.stringify(fileDetails));
    },

    // ----------------------------------------------------------------
    // ----------------------------- PRIVATE --------------------------
    /**
     * @param {Object} file - the file object | {}
     * @return {string|undefined} file path or undefined
     * @private
     */
    returnFilePath_: function(file) {
      return file.fullPath || file.name;
    },

    /**
     * @return {String|undefined} - returns the file type, which is also marked
     *                              as an entry_.
     * @private
     */
    getFileType_: function() {
      var fileType;
      if (this.config_.driveDocId) {
        fileType = 'driveDoc';
      } else if (this.config_.streamURL) {
        fileType = 'stream';
      } else if (this.config_.userFile) {
        fileType = 'userFile';
      } else if (this.config_.newDocument) {
        fileType = 'newdocument';
      }
      return fileType;
    },

    getDriveDoc_: function() {
      function updateConfigAndDownloadDriveDoc(metaData) {
        var promise;
        if (metaData.mimeType === undefined ||
            metaData.title === undefined ||
            metaData.id === undefined) {
          // make sure we log errors specifically if the file is
          // NOT an MS Office file. This can happen if the user had
          // (accidentally or intentionally) converted a docx file to
          // google docs and not renamed the file... eg we *can* get
          // launched with google docs that have ms office file
          // extensions... make sure we record that case specifically
          // in google analytics.
          if (Converter.mime2App(metaData.mimeType) === undefined) {
            promise = when.reject(new Error('Drive mimeType not an MS Office ' +
                'mimeType'));
          } else {
            promise = when.reject(new Error('Drive document missing ' +
                'crucial information'));
          }
        } else {
          // update our config with the meta data.
          // Note that it's important to do this before creating
          // the private file, so that it's extension can be
          // deduced from the mime type
          this.config_.mimeType = metaData.mimeType;
          this.config_.extension = metaData.fileExtension;
          this.config_.title = metaData.title;
          this.config_.driveDocId = metaData.id;
          this.config_.parents = metaData.parents;
          this.config_.driveFileRole = _.get(metaData, 'userPermission.role');

          var appState = 'DownloadingDriveDoc';
          promise = this.createPrivateFile_().then(this.updateInfoAndDownload_.
              bind(this, appState));
        }
        return promise;
      }

      return Drive.getMetaData(this.config_.driveDocId, 
        this.config_.driveDocResourceKey)
          .then(updateConfigAndDownloadDriveDoc.bind(this)).yield(true);
    },

    getStream_: function() {
      var appState = 'DownloadingStream';
      return this.createPrivateFile_().then(this.updateInfoAndDownload_.
          bind(this, appState)).yield(true);
    },

    getUserFile_: function() {
      function updateInfoAndCopyFile() {
        // now that we have a private file, we can set app state
        this.updateAppStateAndCache_('LocalFile' /*app state*/);
        //  copy the user file to priv
        return this.copyFile_(this.config_.userFile,
            this.config_.privateFile);
      }
      return this.createPrivateFile_().then(updateInfoAndCopyFile.bind(this));
    },

    getNewDocument_: function(type) {
      var appState = 'LoadingNewDocument';
      if (type === 'word') {
        this.config_.mimeType = "application/vnd.openxmlformats-" +
                                "officedocument.wordprocessingml.document";
        this.config_.title = 'Untitled document.docx';
      } else if (type === 'point') {
        this.config_.mimeType = "application/vnd.openxmlformats-" +
                                "officedocument.presentationml.presentation";
        this.config_.title = 'Untitled presentation.pptx';
      } else if (type === 'sheet') {
        this.config_.mimeType = "application/vnd.openxmlformats-" +
                                "officedocument.spreadsheetml.sheet";
        this.config_.title = 'Untitled spreadsheet.xlsx';
      }

      return this.createPrivateFile_().then(this.updateInfoAndLoadNewDocument_.
          bind(this, appState, type)).yield(true);
    },

    updateInfoAndLoadNewDocument_: function(appState, type) {
      this.updateAppStateAndCache_(appState);
      return this.loadNewDocument_(type);
    },

    getTemplateUrl_: function(type) {
      if (type === 'word') {
        return 'templates/blank.docx';
      } else if (type === 'point') {
        return 'templates/blank.pptx';
      } else if (type === 'sheet') {
        return 'templates/blank.xlsx';
      }
    },

    loadNewDocument_: function(type) {
      ProgressSpinner.show();
      var spinnerUpdateFunc = ProgressSpinner.addContributor(0.9);
      var templateUrl = this.getTemplateUrl_(type);
      var xhr = new XHR({baseUrl: chrome.runtime.getURL(templateUrl)});
      var promise = xhr.send();

      return promise.then(function writeToFile(response) {
          var writer =
              new FileWriter(this.config_.privateFile);
          return writer.writeData(response);
        }.bind(this), undefined, spinnerUpdateFunc)
         .then(function cacheFileEntry() {
          this.config_.isDownloaded = true;
          this.cacheInfo_();
          spinnerUpdateFunc(1);
          ProgressSpinner.hide();
        }.bind(this));
    },

    updateInfoAndDownload_: function(appState) {
      this.updateAppStateAndCache_(appState);
      // download to private file
      return this.download_();
    },


    updateAppStateAndCache_: function(state) {
      this.initAppState_(state);
      this.cacheInfo_();
      // signify plugin choice determined
      this.fileTypeKnown.resolve();
    },


    restoreConfigFromCache_: function(cache) {
      // restore our config from the cache (or keep what was there)
      this.config_.isDownloaded = cache.isDownloaded;
      this.config_.isRenamed = cache.isRenamed;
      this.config_.mimeType = cache.mimeType || this.config_.mimeType;
      this.config_.extension = cache.extension || this.config_.extension;
      this.config_.driveDocId = cache.driveDocId || this.config_.driveDocId;
      this.config_.driveFileRole = cache.driveFileRole ||
        this.config_.driveFileRole;
      this.config_.newDocument = cache.newDocument || this.config_.newDocument;
      this.config_.title = cache.title || this.config_.title;
      this.config_.parents = cache.parents || this.config_.parents;
      this.config_.originalURL = cache.originalURL ||
        this.config_.originalURL;

    },

    deleteFromCache_: function(file) {
      return this.deletePrivateFile_(file).then(this.cacheFileDetails
          .bind(this, {}));
    },

    /**
     * Tries to delete the private file if it exists.
     *
     * @param {object} cache - cache info
     * @return {Promise} - a rejected promise
     * @private
     */
    tryDeletingPrivateFile_: function(cache) {
      // If delete succeeds then resolve it as incomplete download; if delete
      // fails then reject as deleting cache failed.
      function resolveLocal() {
        // rejecting here is intentional since this has to be a rejected promise
        return when.reject(new Error('IncompleteDownload'));
      }

      function rejectLocal() {
        return when.reject(new Error('CacheDeleteFailed'));
      }

      var promise = cache.privateFilePath ?
          this.deleteFromCache_(cache.privateFilePath).then(resolveLocal,
              rejectLocal) : when.reject(new Error('NoPrivateFile'));
      return promise;
    },

    /**
     * Try to restore the file from cache if it exists. Restore if ownload was
     * complete, delete the private file otherwise.
     * @return {Promise} Returns a promise to restore the file/ delete the cache
     * @private
     */
    tryToRestoreOrDeleteFromCache_: function() {
      var promise;
      var cache = this.getCache();

      if (!(cache && (cache.uuid === this.uuid_))) {
        promise = when.reject(new Error('NoCache'));
      } else if (cache.isDownloaded) {
        // download was completed, restore files.
        entryPoint_ = 'restore';
        this.restoreConfigFromCache_(cache);
        promise = this.tryToRestoreFiles_(cache);
      } else {
        // download was interrupted/ never started.
        promise = this.tryDeletingPrivateFile_(cache);
      }
      return promise;
    },

    /**
     * Saves the fileEntry to the this.config_.userFile and updates the cache
     * @param {Object} fileEntry - a FileEntry object
     * @private
     */
    saveFileEntryAndUpdateCache_: function(fileEntry) {
      this.config_.userFile = fileEntry;
      this.cacheInfo_();
    },

    /**
     * Tries to restore the private file, downloadable file and user file
     * @param {Object} cache - cache with file details
     * @return {Promise} - A promise that'll be resolved when private file,
     *                     downloadable file and user file(if exists) are
     *                     restored or rejected when any of them fail
     * @private
     */
    tryToRestoreFiles_: function(cache) {
      function updateCacheAndRestoreUserFile() {
        this.config_.downloadFileName = cache.downloadFileName;
        this.updateAppStateAndCache_('BrowserRefresh' /*app state*/);
        // restore the user file, if there is one
        return cache.userFileId ? this.restoreFileById_(cache.userFileId)
            .then(this.saveFileEntryAndUpdateCache_.bind(this)).yield(true) :
            true;
      }

      var promise;
      // TODO(jonbronson): Why are we only checking privateFilePath?
      if (!cache.privateFilePath) {
        promise = when.reject(new Error('There is no cached ' +
                                        'private file path'));
      } else {
        // restore the private file
        promise = this.restorePrivateFile_(cache.privateFilePath)
            .then(this.restoreDownloadFile_.bind(this, cache.downloadFilePath))
            .then(updateCacheAndRestoreUserFile.bind(this));
      }
      return promise;
    },

    nameForCopiedFile_: function() {
      // the title for a new copy of a file should be the
      // title of the current file prepended with 'Copy of '
      return 'Copy of ' + this.displayName();
    },

    nameForSaveAsFile_: function() {
      // the title for a new file created via a 'save as' should
      // be the title of the current file with the extension of
      // the private file (which may have been upsaved) prepended
      // with 'Copy of '
      return 'Copy of ' + PathUtils.create(this.displayName()).baseName() +
        '.' + Converter.mime2Extension(this.mimeType());
    },

    nameForConvertedFile_: function() {
      // the title for a converted file should be the
      // title of the current file without the extension
      return PathUtils.create(this.displayName()).baseName();
    },

    saveAsLocal_: function(opt_isMakeACopy) {
      // use the display name as suggested name, but if we already
      // have a userFile, then "smart rename" the display name and
      // append " - xx" on the end (where xx is an increasing number)
      var pu = PathUtils.create(this.displayName());
      var suggestedName = (this.config_.userFile && !this.config_.isRenamed) ?
          pu.smartBaseName() : pu.baseName();

      var app = Converter.mime2App(this.mimeType());
      var acceptedExtensions = opt_isMakeACopy ? [pu.extension()] :
          acceptedSave_[app];

      // if the current ext is not allowed, then pick the first one that is
      suggestedName += '.' +
          ((acceptedExtensions.indexOf(pu.extension()) === -1) ?
              acceptedExtensions[0] : pu.extension());

      function updateConfigAndCopyFile(fileEntry) {
        // [resolved promise] The user clicked Save on the dialog.
        // update our knowledge of the userFile. Note, since we could be
        // doing an upsave, this means our original mimeType might now
        // be out of date. So clear it (the mimeType function will now
        // determine it from the file extension). Similarly, if we had
        // a drive id then this is now invalid since we are now operating
        // on a local user file, so clear the drive doc id if there was
        // one. Then re-cache our updated info
        this.config_.mimeType = undefined;
        this.config_.extension = undefined;
        this.config_.driveDocId = undefined;
        this.config_.driveFileRole = undefined;
        this.config_.preferredFilename = undefined;
        this.config_.newDocument = undefined;
        this.saveFileEntryAndUpdateCache_(fileEntry);
        return this.copyFile_(this.config_.privateFile, this.config_.userFile);
      }

      function dialogCancelled() {
        // [rejected promise] The user cancelled the dialog.
         return when.reject({ userCancelled: true });
      }

      return this.selectFile_(suggestedName, acceptedExtensions)
          .then(updateConfigAndCopyFile.bind(this), dialogCancelled);
    },

    initAppState_: function(stateName) {
      var mime = this.mimeType();
      if (!mime || mime.length === 0) {
        throw new Error('Unknown mimeType; unable to know which app to load');
      } else {
        var appName = Converter.mime2App(mime);

        // add google analytics for local files
        var networkStatus = window.navigator.onLine ? 'online' : 'offline';
        var action = 'non-local-user-' + networkStatus;
        if (/^file:\/\/\//.test(this.originalURL()) || this.userFilePath()) {
          action = 'local-user-' + networkStatus;
        }
        this.sendCachableGAEvent_({
          category: 'file-source',
          action: action,
          label: appName
        });

        var extension = Converter.mime2Extension(mime);
        Metrics.recordFileType(extension);
        AppState.setApp(appName, extension);
        AppState.updateState(stateName);
      }
    },

    sendCachableGAEvent_: function(event) {
      if (window.navigator.onLine) {
        GA.sendEvent(event);
      } else {
        var store = this.getGAPendingStore_();
        store.push(event);
        LocalStorageManager.setItem(PENDING_GA_STORE_KEY,
          JSON.stringify(store));
      }
    },

    getGAPendingStore_: function() {
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
    },

    whenDone_: function() {
      this.isReady = true;
      return when.resolve(true);
    },


    handleDriveError_: function(error) {
      var errorCode = DriveUtils.getErrorCode(error);
      switch (errorCode) {
        case DriveErrors.FILE_NOT_FOUND:
          this.throwFileNotFoundException_();
          break;
        case DriveErrors.INTERNAL_SERVER_ERROR:
        case DriveErrors.OFFLINE:
          this.throwTemporaryUnableToOpenException_(error);
          break;
        default:
          this.handleGenericFileError_(error);
          break;
      }
    },

    throwTemporaryUnableToOpenException_: function (error) {
      throw new QOWTException({
        title: 'temporary_unable_to_open_error_short_msg',
        details: 'temporary_unable_to_open_error_msg',
        message: (TypeUtils.isString(error) && error) ||
          error.message || DriveUtils.getErrorCode(error)
      });
    },

    handleGenericFileError_: function(error) {
      if (error.name === 'SecurityError') {
        this.throwSecurityException_();
      } else if (error instanceof TimeoutError) {
        this.throwTimeoutException_(error);
      } else if (error instanceof HTTPErrorZero) {
        throw error;
      } else if (error instanceof HTTPErrorFileNotFound) {
        throw error;
      } else if (error instanceof ScriptLoadingTimeout) {
        throw error;
      } else {
        this.throwFileOpenCrashException_(error);
      }
    },

    throwEntryPointException_: function() {
      // we have failed to determine which entry point the file
      // has been opened from so show a crash screen saying so
      throw new QOWTException({
        title: 'entry_point_error_short_msg',
        details: 'entry_point_error_msg'
      });
    },

    throwSecurityException_: function() {
      // there has been a security error (e.g. the browser is in
      // Incognito mode) so show a crash screen with a newer error message
      throw new QOWTException({
        title: 'file_opened_in_incognito_mode_error_title',
        details: 'file_opened_in_incognito_mode_error_details'
      });
    },

    throwTimeoutException_: function(error) {
      // error already constructed, so override dialog text directly with i18n.
      error.title = I18n.getMessage('download_file_timeout_error_short_msg');
      error.details = I18n.getMessage('download_file_timeout_error_msg');
      throw error;
    },

    throwFileNotFoundException_: function() {
      // there has been a problem locating a Drive
      // file so show a crash screen saying so
      throw new QOWTException({
        title: 'file_not_found_error_short_msg',
        details: 'file_not_found_error_msg'
      });
    },

    throwFileOpenCrashException_: function(error) {
      // an error has occurred which is preventing the file from
      // opening so show a crash screen with an appropriate message.
      // We also want to log the specific error to GA so we extract
      // this information from the 'error' parameter which may be:
      // - a string from a rejected promise
      // - a thrown Error object with a 'message' property
      // - a Drive error that we want to extract the code from - e.g. 500
      var uiError = new QOWTException({
        title: 'file_open_crash_error_short_msg',
        details: 'file_open_crash_error_msg',
        message: (TypeUtils.isString(error) && error) ||
          error.message || DriveUtils.getErrorCode(error)
      });
      // make sure we log the ORIGINAL stack trace
      uiError.stack = error.stack;
      throw uiError;
    },

    cacheInfo_: function() {
      // store anything we need to be able to restore our file after refresh
      var cache = {
        originalURL: this.config_.originalURL,
        isDownloaded: this.config_.isDownloaded,
        streamURL: this.config_.streamURL,
        mimeType: this.config_.mimeType,
        extension: this.config_.extension,
        privateFilePath: this.privateFilePath(),
        downloadFilePath: this.downloadFilePath(),
        downloadFileName: this.config_.downloadFileName,
        // some file system access is disabled on ChromeOS in guest mode, so
        // don't retain an entry if we don't have file system access as this
        // causes a crash
        userFileId: (this.config_.userFile && window.RequestFileSystem &&
                     chrome.fileSystem.retainEntry(this.config_.userFile)),
        driveDocId: this.config_.driveDocId,
        newdocument: this.config_.newdocument,
        driveFileRole: this.config_.driveFileRole,
        title: this.config_.title,
        parents: this.config_.parents,
        isRenamed: this.config_.isRenamed,
        uuid: this.uuid_
      };

      this.cacheFileDetails(cache);
    },

    restoreFileById_: function(fileId) {
      return when.promise(function(resolve, reject) {
        // some file system access is disabled on ChromeOS in guest mode, so
        // don't restore an entry if we don't have full file system access as
        // this causes a crash
        if (window.RequestFileSystem) {
          chrome.fileSystem.restoreEntry(fileId, resolve);
        } else {
          reject(new Error('NoAccessToFileSystem'));
        }
      });
    },

    restorePrivateFile_: function(fileName) {
      return this.getTempFs_().then(function(fs) {
        // Open the file if available, otherwise create a new private; the user
        // did a restore before the original private file was created
        return fileName ? this.openFileAndSaveEntry_(fs, fileName,
            'privateFile' /*file type*/) : this.createPrivateFile_();
      }.bind(this));
    },

    /**
     * Create a private file which can be served to the user during download
     * @private
     */
    createDownloadableFile_: function() {
      return this.getTempFs_().then(function(fs) {
        return this.createDownloadableFileFromPrivateFile_(fs);
      }.bind(this)).then(function(fileEntry) {
        this.config_.downloadFile = fileEntry;
        // Upon save the display name of the file may change, hence cache the
        // original file name along with the file
        this.config_.downloadFileName = this.displayName();
      }.bind(this));
    },

    /**
     * Restore the download file from cache.
     * @private
     */
    restoreDownloadFile_: function(fileName) {
      return this.getTempFs_().then(function(fs) {
        // Open the file if available, otherwise create a new download file;
        // the user did a restore before the original download file was created
        return fileName ? this.openFileAndSaveEntry_(fs, fileName,
            'downloadFile' /*file type*/) : this.createDownloadableFile_();
      }.bind(this));
    },

    download_: function() {
      ProgressSpinner.show();
      var spinnerUpdateFunc = ProgressSpinner.addContributor(0.9);

      var promise;
      if (this.config_.driveDocId) {
        promise = Drive.download(this.config_.driveDocId, 
          this.config_.driveDocResourceKey);
      } else if (this.config_.streamURL === undefined) {
        promise = when.reject(new Error('FileManager needs URL to download'));
      } else {
        var xhr = new XHR({baseUrl: this.config_.streamURL});
        promise = xhr.send();
      }

      // TODO(jliebrand): NOTE: for Drive.download we use gapi.client.request
      // which does not yet support .onProgress. This is being worked
      // on (see http://b/12354365)
      // for now that means the spinnerUpdateFunc is never called. Once the
      // bug is fixed we need to hook gapi.client.request.onProgress up
      // to our own when.promise.notify
      return promise.then(function writeToFile(response) {
          var writer =
              new FileWriter(this.config_.privateFile);
          return writer.writeData(response);
        }.bind(this), undefined, spinnerUpdateFunc)
         .then(function cacheFileEntry() {
          this.config_.isDownloaded = true;
          this.cacheInfo_();
          spinnerUpdateFunc(1);
          ProgressSpinner.hide();
        }.bind(this));
    },

    loadPlugin_: function() {
      var mime = this.mimeType();
      var app = Converter.mime2App(mime);
      if (!app || app.length === 0) {
        throw new Error('Could not find app from mimeType: ' + mime);
      }

      var pluginLoader = new PluginLoader();
      return pluginLoader.loadPlugin(app);
    },

    selectFile_: function(suggestedName, acceptedExtensions) {
      return when.promise(function(resolve, reject) {
        window.chrome.fileSystem.chooseEntry({
          type: 'saveFile',
          suggestedName: suggestedName,
          accepts: [{
            extensions: acceptedExtensions
          }]
        }, function(fileEntry) {
          if (window.chrome.runtime.lastError &&
              window.chrome.runtime.lastError.message === 'User cancelled') {
            reject(new Error(window.chrome.runtime.lastError.message));
          } else {
            window.chrome.fileSystem.getDisplayPath(fileEntry, function(path){
              fileEntry.localFilePath = path;
              resolve(fileEntry);
            });
          }
        }.bind(this));
      }.bind(this));
    },

    /**
     * @return {Promise} - A promise that'll be resolved when the access to
     *                    sandboxed file system is available or rejected when
     *                    requestFileSystem fails.
     * @private
     */
    getTempFs_: function() {
      return when.promise(function(resolve, reject) {
        window.webkitRequestFileSystem(
            window.TEMPORARY, 1024 * 1024, resolve, reject);
      });
    },

    /**
     * @param {Object} fs - a file system object
     * @param {String} fileName - name of the file to be fetched
     * @param {Object} props - additional info for fetching the file
     * @return {Promise} - A promise that'll be resolved if the fetching the
     *                    file suceeds, rejected otherwise.
     * @private
     */
    getFileFromFs_: function(fs, fileName, props) {
      return when.promise(function(resolve, reject) {
        fs.root.getFile(fileName, props, resolve, reject);
      });
    },

    /**
     * Opens the file if present, Creates and opens the file if not present.
     *
     * @param {Object} fs - a file system object
     * @param {String} fileName - Name of the file to be created
     * @return {Promise} - A promise that'll be resolved if creating the file
     *                     succeeds or rejected if the creation fails.
     * @private
     */
    createFile_: function(fs, fileName) {
      var props = {'create': true, 'exclusive': false};
      return this.getFileFromFs_(fs, fileName, props);
    },

    /**
     * Opens the file if present, fails if the file is not present
     *
     * @param {Object} fs - a file system object
     * @param {String} fileName - Name of the file to be opened
     * @return {Promise} - A promise that'll be resolved if opening the file
     *                     succeeds or rejected if the file is not present/
     *                     failed to open the file
     * @private
     */
    openFile_: function(fs, fileName) {
      var props = {'create': false};
      return this.getFileFromFs_(fs, fileName, props);
    },

    /**
     * Create a copy the private file which can be used for download.
     * @private
     */
    createDownloadableFileFromPrivateFile_: function(fs) {
      return when.promise(function(resolve, reject) {
        var privateFile = this.config_.privateFile;
        var uniqueIdArr = privateFile.name.split('.');
        var downloadFileName = [uniqueIdArr[0], uniqueIdArr[1]].
            join('_downloadable.');
        privateFile.copyTo(fs.root, downloadFileName, resolve, reject);
      }.bind(this));
    },

    /**
     * Deletes the file with the given name
     * @param {String} fileName - name of the file that is to be deleted
     * @return {Promise} - A promise that'll be resolved when the file is
     *                    deleted or rejected when the deletion fails
     * @private
     */
    deletePrivateFile_: function(fileName) {
      function deleteFile(fs) {
        return when.promise(function(resolve, reject) {
          var props = {'create': false};
          fs.root.getFile(fileName, props, function(fileEntry) {
            fileEntry.remove(resolve, reject);
          });
        });
      }

      return this.getTempFs_().then(deleteFile);
    },

    createPrivateFile_: function(forceExtension) {
      return this.getTempFs_().then(function(forceExtension, fs) {
        var uniqueName = UUIDUtils.generateUUID();
        var ext = forceExtension || Converter.mime2Extension(this.mimeType());
        var fileName = [uniqueName, ext].join('.');

        return this.createFile_(fs, fileName);

      }.bind(this, forceExtension)).then(function(fileEntry) {
        this.config_.privateFile = fileEntry;
        return fileEntry;
      }.bind(this));
    },

    /**
     * Opens the file and save the entry to thi.config_[fileType]
     *
     * @param {Object} fs - File Fs (DOMFileSystem)
     * @param {String} fileName - file to be opened
     * @param {String} fileType - one of downloadFile/ privateFile/ userFile
     * @return {Promise} - A promise that'll be resolved when the file is opened
     *                     or rejected when file opening fails
     * @private
     */
    openFileAndSaveEntry_: function(fs, fileName, fileType) {
      return this.openFile_(fs, fileName).then(function(fileEntry) {
        this.config_[fileType] = fileEntry;
        return fileEntry;
      }.bind(this));
    },

    /**
     * Copies source File to destination file
     *
     * @param {Object} srcEntry - a FileEntry or a FileBlob, source
     * @param {Object} destEntry - a FileEntry, destination
     * @return {Promise} - A promise that'll be resolved when the file is copied
     *                     or rejected when copy fails/ invalid parameters are
     *                     passed
     * @private
     */
    copyFile_: function(srcEntry, destEntry) {
      function doCopyFile(destFile, srcFile) {
        var writer = new FileWriter(destFile);
        // Cannot use instanceof unless the following bug is resolved
        // https://bugs.chromium.org/p/chromium/issues/detail?id=471587
        // Having a workaround by using constructor.name
        return (srcFile.constructor.name === 'File') ?
            writer.writeData(srcFile) :
            when.reject('Cannot copy file: Source is not a File');
      }

      var promise;
      if (destEntry === undefined) {
        promise = when.reject(new Error('Cannot copy file: ' +
            'Missing destination file'));
      } else if (!destEntry.isFile) {
        promise = when.reject('Cannot copy file: Destination is not a ' +
            'FileEntry/ a File');
      } else if (srcEntry === undefined) {
        promise = when.reject(new Error('Cannot copy file: Missing source ' +
            'file'));
      } else {
        promise = srcEntry.file ?
            this.getFileFromEntry_(srcEntry).then(doCopyFile.
                bind(null, destEntry)) : doCopyFile(destEntry, srcEntry);
      }
      return promise;
    },

    /**
     * Upload the drive document.
     * @param {boolean} newRevision Flag to create new revisions for Drive files
     * @return {Promise} the promise that will resolve when the upload completes
     */
    uploadDriveFile_: function(newRevision) {
      var fileId = this.config_.driveDocId;
      var resourceKey = this.config_.driveDocResourceKey;
      return this.getFileFromEntry_(this.config_.privateFile)
          .then(function(fileBlob) {
            return Drive.upload(fileId, fileBlob, newRevision, resourceKey);
          });
    },


    /**
     * @param {Object} entry - a FileEntry object from which the fileBlob
     *                            needs to be fetched.
     * @return {Promise} - A promise that'll be resolved once the fileBlob is
     *                    available or rejected if there is no file function
     * @private
     */
    getFileFromEntry_: function(entry) {
      return when.promise(function(resolve, reject) {
        entry.file ? entry.file(resolve) :
            reject(new Error('Entry missing file function'));
      });
    },

    getPrivateFileFromEntry: function() {
      return this.getFileFromEntry_(this.config_.privateFile);
    },
    /**
     * callback to open the original file if restoration failed.
     * @param {Object} error - error object
     * @return {Promise} a deferred promise
     * @private
     */
    openOriginalFile_: function(error) {
      // TODO(jliebrand): if the check from restore failed, we
      // will try to open the original file. This means potential
      // edits COULD perceivable be lost. Therefore we might want to
      // add som UX to inform the user of this fact. Note, it could
      // be that the file was not edited, in which case we do NOT
      // want to show any UX. The decision on which UX to show
      // still needs to be made, see http://crbug/XXXXX
      //
      //
      // Once we decide what we want, we will add something like this:
      //
      // switch (error.message){
      //   case 'IncompleteDownload':
      //     // File was cached but marked incomplete
      //     PubSub.publish('qowt:notification', {msg: 're_download'});
      //     break;
      //   case 'CacheDeleteFailed':
      //     // Failed to delete incomplete cached file.
      //     break;
      //   case 'NoCache':
      //     // This file wasn't stored in cache
      //     break;
      //   default:
      //     // all other errors
      //     if (privFileWasEdited()) {
      //       PubSub.publish('qowt:notification',
      //                      {msg: 'potential_data_loss'});
      //     }
      //   break;
      // }

      var filePromise;
      var entryPoint_ = this.getFileType_();
      switch (entryPoint_) {
        case 'driveDoc':
          if (!DriveUtils.isValidDriveId(this.config_.driveDocId_)) {
            this.throwFileNotFoundException_();
          } else {
            filePromise = this.getDriveDoc_()
              .catch (this.handleDriveError_.bind(this));
          }
          break;

        case 'stream':
          filePromise = this.getStream_()
              .catch (this.handleGenericFileError_.bind(this));
          break;

        case 'userFile':
          filePromise = this.getUserFile_()
              .catch (this.handleGenericFileError_.bind(this));
          break;
        case "newdocument":
        filePromise = this.getNewDocument_(this.config_.newDocument)
              .catch (this.handleGenericFileError_.bind(this));
        break;
        default:
          this.throwEntryPointException_(error);
      }
      return filePromise.then(this.createDownloadableFile_.bind(this)).
          then(this.cacheInfo_.bind(this));
    }
  };

  // -------------------- HELPERS ----------------

  var acceptedSave_ = {
    'word': ['docx'],
    'sheet': ['xlsx'],
    'point': ['pptx']
  };

  var instance = new FileManager();
  return instance;
});
