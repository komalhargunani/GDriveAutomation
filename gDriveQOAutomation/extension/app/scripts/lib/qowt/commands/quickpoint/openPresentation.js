/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Open presentation command definition
 *
 */
define([
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/errors/unique/invalidFileFormatError',
  'qowtRoot/errors/unique/passwordError',
  'qowtRoot/models/fileInfo',
  'qowtRoot/commands/commandBase',
  'qowtRoot/utils/deprecatedUtils'
  ], function(
    QOWTException,
    CorruptFileError,
    InvalidFileFormatError,
    PasswordError,
    FileInfo,
    CommandBase,
    DeprecatedUtils
  ) {

  'use strict';


  var _factory = {

    /**
     * @param {object} config Arguments for the open command.
     * @return {Object} An openPresentation command
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('openPresentation', false, true);

          /**
           * Return an object with the data to be used as the payload of
           * the DCP request.
           * Request manager will add the unique ID to this payload to
           * track and match client-server request-response
           * The name property is mandatory.
           *
           * @return  {Object} The JSON Payload data to send to the dcp service
           * @see     TODO need dcp schema reference!
           */
          _api.dcpData = function() {
            var payload = {
              name: "oPT"
            };

            if (config.buffer) {
              payload.buffer = config.buffer;
            }

            return payload;
          };

          /**
           * Hook for any command-specific behaviour you may have.
           * Invoked after the framework has processed any DCP response
           * Only called for after successful responses
           * CommandBase provides a try block to catch exceptions
           * generated herein.
           *
           * @param   response {DCPresponse} The newly handled response object
           * @override
           * @see     src/commands/qowtCommand.js
           */
          _api.onSuccess = function(/* response */) {
            //adding check to add bulletTextMeasureElement
            // note this must happen after the dom tree has been updated hence
            // here in the command rather than the presentationHandler.
            if (DeprecatedUtils.bulletTextMeasureElement === undefined) {
              DeprecatedUtils.setBulletTextMeasureElement();
            }
          };

          /**
           * Callback for command-specific failure behaviour
           *
           * @override
           * @see     src/commands/qowtCommand.js
           * @param response {DCP Response | undefined} The failing
           * DCP response from service call
           * or undefined if optimistic handling failure.
           * @param errorPolicy {object} A policy object used to determine
           * what behaviour to use in
           *         handling the response.
           */
          _api.onFailure = function(response /* errorPolicy */) {
            var errDetails = {
              message: _api.name + ' command failed: ' + response.e
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
              case 'irmf':
                err = new PasswordError(errDetails);
                break;
              case 'iff':
                err = new InvalidFileFormatError(errDetails);
                break;
              case 'dzf':
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

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
