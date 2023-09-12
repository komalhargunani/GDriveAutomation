/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview open word document. This command does not
 * require any path information. The app will sniff this command
 * and augment it with relevant path behaviour. Thereby keeping
 * QOWT blissfully oblivious to any FileEntries or paths.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/errors/unique/invalidFileFormatError',
  'qowtRoot/errors/unique/unsupportedFileFormatError',
  'qowtRoot/errors/unique/passwordError',
  'qowtRoot/errors/unique/pdfFileError',
  'qowtRoot/errors/unique/rtfFileError',
  'qowtRoot/errors/unique/coreError',
  'qowtRoot/models/dcp',
  'qowtRoot/models/fileInfo'
  ], function (
    CommandBase,
    QOWTException,
    CorruptFileError,
    InvalidFileFormatError,
    UnsupportedFileFormatError,
    PasswordError,
    PDFFileError,
    RTFFileError,
    CoreError,
    DCPModel,
    FileInfo) {

  'use strict';

  var _factory = {

    /**
     * Command to open the specified document and return information about it.
     * This is a query command, so has nothing to render optimistically.
     *
     * @param {object} config Arguments for the open command.
     * @param {string} config.path The full path of the file to open.
     * @return {object} an openDoc command.
     */
    create: function (config) {

      // use module pattern for instance object
      var module = function () {

        // extend default command (optimistic==false, callsService==true)
        var _api = CommandBase.create('openDocument', false, true);

        /**
         * Return an object with the data to be used as the payload of the
         * DCP request.
         * Request manager will add the unique ID to this payload to track
         * and match client-server request-response.
         *  The name property is mandatory.
         *
         * @return  {Object} The JSON Payload data to send to the dcp service
         * @method dcpData()
         */
        _api.dcpData = function () {
          var data = {
            name: "oDC"
          };

          return data;
        };

        // DuSk TODO: Remove this when the core sends up a visitable respone.
        _api.responseHook = function(response) {
          var rsp;

          if (response.elm === undefined) {
            rsp = {
              elm: [{
                'docId': response.docId,
                'etp': 'odi',
              }],
              'id': response.id,
              'name': response.name,
              'version': (response.version || 1)
            };
            response = rsp;
          } else {
            console.warn('DCP response is fixed - remove this hook now!');
          }

          return rsp;
        };

        /**
         * Hook for any command-specific behaviour you may have.
         *  Invoked after the framework has processed any DCP response.
         *  Only called for after successful responses.
         * CommandBase provides a try block to catch exceptions
         * generated herein.
         *
         * @param   response {DCPresponse}    The newly handled response object
         * @override
         * @see     src/commands/qowtCommand.js
         * @method onSuccess(response)
         */
        _api.onSuccess = function(response) {
          if (response && response.version) {
            DCPModel.version = response.version;
          }
        };


        /**
         * Throw a fatal error if the core failed.
         *
         * NOTE: this uses the new error handling (eg throw an exception)
         * and since that is a fatal exception, we no longer need to use
         * the old "errorPolicy" object anymore.
         *
         * @param {object} response The recevied DCP response.
         */
        _api.onFailure = function(response) {
          var errorDetails = {
            message: _api.name + ' command failed: ' + response.error.name +
                ' ' + (response.error.details || '')
          };
          console.error(errorDetails.message);

          // For streamed files we want to allow the user to download the file
          // despite us not being able to open it.
          if (FileInfo.originalURL) {
            errorDetails.linkData = {
              msg: 'file_open_fail_download_link_text',
              url: FileInfo.originalURL,
              download: FileInfo.displayName
            };
          }

          if (FileInfo.displayName) {
            errorDetails.fileName =
              FileInfo.displayName.replace(/\.((docx?)|(pptx?)|(xlsx?))$/, '');
          }

          var error;
          switch (response.error.name) {
            case 'DocumentParsingError':
              // for now, assume parsing errors are corrupt documents
              error = new CorruptFileError(errorDetails);
              break;
            case 'PasswordProtectedError':
              error = new PasswordError(errorDetails);
              break;
            case 'InvalidFileFormatError':
              error = new InvalidFileFormatError(errorDetails);
              break;
            case 'UnsupportedFileFormatError':
              error = new UnsupportedFileFormatError(errorDetails);
              break;
            case 'ZipArchiveCorruptError':
            case 'ZipStructureInvalidError':
              error = new CorruptFileError(errorDetails);
              break;
            case 'PDFFileError':
              error = new PDFFileError(errorDetails);
              break;
            case 'RTFFileError':
              error = new RTFFileError(errorDetails);
              break;
            case 'UnrecognizedHeaderError':
            case 'ParseFileError':
            case 'EndOfFileError':
              // for GA purposes, assume these are same as invalid file format
              error = new InvalidFileFormatError(errorDetails);
              break;
            case 'FileOpenFailedError':
              if (config.isIncognito) {
                error = new QOWTException({
                  title: 'file_opened_in_incognito_mode_error_title',
                  details: 'file_opened_in_incognito_mode_error_details'
                });
              } else {
                response.error.title = 'file_open_crash_error_short_msg';
                response.error.details = 'file_open_crash_error_msg';
                error = new CoreError(response.error);
              }
              break;
            default:
              response.error.title = 'file_open_crash_error_short_msg';
              response.error.details = 'file_open_crash_error_msg';
              error = new CoreError(response.error);
              break;
          }

          throw error;
        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
