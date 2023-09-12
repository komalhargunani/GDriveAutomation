// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines the getDocContent command for Word.
 * The onSuccess will interpret the DCP response to see if all document content
 * has been received. If there is content outstanding then a new getDocContent
 * command is created and added to the command manager queue.
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/commandManager',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/errors/qowtError'
  ], function(
    PubSub,
    CommandBase,
    CommandManager,
    ErrorCatcher,
    CorruptFileError,
    QOWTError
    ) {

  'use strict';

  var _factory = {

    /**
     * Factory function to create a new command instance.
     * @param {string} opt_paraId The paragraph Id of the last
     * loaded paragraph.
     *                 If present only subsequent paragraph content is returned.
     *                 If absent content is returned from the start.
     * @return {Object} a new getDocContent command instance.
     */
    create: function(opt_paraId) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==false, callsService==true)
        var _api = CommandBase.create("getDocContent", false, true);

        /**
         * Returns the data for the payload of the DCP command.
         * The name property is mandatory.
         *
         * @return  {Object} The JSON Payload data to send to the dcp service
         */
        _api.dcpData = function() {
          var data = {
              name: "gDC",
              // Tell the service that we want shallow elements
              shal: true
          };
          if (opt_paraId) {
            data.pid = opt_paraId;
          }
          return data;
        };


        /**
         * Only called for after successful (non error) responses.
         * Invoked after the framework has processed any DCP response.
         *
         * @override
         * @param response {DCPresponse}    The newly handled response object
         * @see src/commands/qowtCommand.js
         */
        _api.onSuccess = function(response) {
          PubSub.publish('qowt:contentReceived', {});
          // If the command was silently ignored then we don't have the full
          // content, but don't want to continue getting as this will
          // just fail.
          if ((response && response.end) || _failedToComplete || !response) {
            PubSub.publish('qowt:contentComplete', {'complete': true});
          } else {
            _onProgress(response);
          }
        };


        /**
         * Callback invoked on command failure.
         * If this is the first getContent to fail then no content has yet been
         * rendered. So we inform the user that there is a problem.
         *
         * If previous getContent command have completed, then we will have
         * already rendered some content. In this case only we should
         * absorb the error silently and let the user continue to use the
         * document. As and when/if the user saves any changes we'll deal
         *
         * @override
         * @see src/commands/qowtCommand.js
         * @param {dcp} response The failed DCP response.
         * @param {object} errorPolicy A policy object used to determine what
         *                 behaviour to use in handling the response.
         */
        _api.onFailure = function(response, errorPolicy) {
          var failureMsg = _api.name + " command - failed: " + response.e;
          console.error(failureMsg);

          if (errorPolicy) {
            if (opt_paraId === undefined) {
              // no content has been rendered at all; so report as
              // fatal file open error (eg "File appears to be corrupt");
              throw new CorruptFileError(failureMsg);
            } else {

              // if we DID already render some content, then instead
              // show a non-fatal error dialog, and keep going.
              ErrorCatcher.handleError(new QOWTError({
                message: failureMsg, // logged to GA
                title: 'file_missing_content_short_msg',
                details: 'file_missing_content_msg'
              }));
              errorPolicy.ignoreError = true;
              _failedToComplete = true;
            }
          }
        };


        /**
         * Silently queue another get command to fetch further document content
         * using the last loaded paraId as the seed.
         * This gives us progressive loading of the doc content.
         * @private
         */
        var _onProgress = function() {
          var lastEid;
          var lastElement = _getLastElement();
          if (lastElement) {
            lastEid = lastElement.getAttribute('qowt-eid') || undefined;
          }
          var cmd = _factory.create(lastEid);
          CommandManager.addCommand(cmd);
        };

        var _getLastElement = function() {
          var sections = document.querySelectorAll('qowt-section');
          var lastElement, lastSection;
          if (sections.length > 0) {
            lastSection = sections[sections.length - 1];          
            lastElement = lastSection.getLastElement();
          }
          return lastElement;
        };

        // vvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Since we silently absorb some failures we need to avoid scheduling
        // further calls to get content. We use this var to communicate this.
        var _failedToComplete;

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
