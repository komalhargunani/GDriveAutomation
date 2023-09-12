/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Defines an OpenWorkbookFile command including response
 * behaviours See the dcp schema on details of response, but in general this
 * command opens a workbook document file and retrieves initial information,
 * such as the file password, the active sheet index and the sheet names.
 *
 */
define([
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/errors/unique/invalidFileFormatError',
  'qowtRoot/errors/unique/outOfMemoryError',
  'qowtRoot/errors/unique/passwordError',
  'qowtRoot/errors/unique/unsupportedFileFormatError',
  'qowtRoot/models/fileInfo',
  'qowtRoot/commands/commandBase'
  ], function(
    QOWTException,
    CorruptFileError,
    InvalidFileFormatError,
    OutOfMemoryError,
    PasswordError,
    UnsupportedFileFormatError,
    FileInfo,
    CommandBase) {

  'use strict';


  var _factory = {

    create: function(config) {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('OpenWorkbookFile', false, true);

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response.The name property is
           * mandatory.
           *
           * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
           *          OpenWorkbook/OpenWorkbook-request-schema.json
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {

            // WORKAROUND : Send locale & timeOffset info to the service, as
            // NACL plugin doesn't have locale/offset supporting versions of
            // c-library functions 'locale' & 'localtime' => hence we use the
            // browser (which has good values for these & send the useful items
            // to the service which processes them as required.
            var localeString = navigator.language;
            var currentDate = new Date();
            var timeOffsetFromGmtInMinutes =
                currentDate.getTimezoneOffset() * -1;

            var localeData = {
              ls: localeString,
              to: timeOffsetFromGmtInMinutes
            };

            var data = {
              name: "owb",
              loc: localeData
            };

            return data;
          };

          /**
           * @override
           * @see     src/commands/qowtCommand.js
           * @param  response {DCP Response | undefined}  The failing DCP
           *         response from service call or undefined if optimistic
           *         handling failure.
           *
           * @param  errorPolicy {object} A policy object used to determine what
           *         behaviour to use in handling the response.
           *
           */
          _api.onFailure = function(response /* errorPolicy */) {
            var errDetails = {
              message: _api.name + ' command failed: ' + response.e + ' ' +
                  (response.m || '')
            };
            console.error(errDetails.message);

            // For streamed files we want to allow the user to download the file
            // despite us not being able to open it.
            if (FileInfo.originalURL) {
              errDetails.linkData = {
                msg: 'file_open_fail_download_link_text',
                url: FileInfo.originalURL,
                download: FileInfo.displayName
              };
            }

            var err;
            switch (response.e) {
              case 'ip':
              case 'pnf':
              case 'ppe':
              case 'irmf':
                err = new PasswordError(errDetails);
                break;
              case 'iff':
                err = new InvalidFileFormatError(errDetails);
                break;
              case 'uff':
                err = new UnsupportedFileFormatError(errDetails);
                break;
              case 'out_of_memory':
                err = new OutOfMemoryError(errDetails);
                break;
              case 'fof':
                if (config.isIncognito) {
                  err = new QOWTException({
                    title: 'file_opened_in_incognito_mode_error_title',
                    details: 'file_opened_in_incognito_mode_error_details'
                  });
                } else {
                  err = new CorruptFileError(errDetails);
                }
                break;
              default:
                err = new CorruptFileError(errDetails);
                break;
            }
            throw err;
          };

          return _api;
        };

      // We create a new instance of the object by invoking the module
      // constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
