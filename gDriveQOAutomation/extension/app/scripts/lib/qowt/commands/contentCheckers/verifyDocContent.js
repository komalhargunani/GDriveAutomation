/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview command to verify the integrity of a specific element.
 * It uses the core 'getElementContent' with childList='flat' to retrieve
 * the content of a specific element. It uses the responseHook to "unset"
 * the response from the Core, so that the DCP Manager does not attempt to
 * auto-process the response (since we do not want to "render" this response)
 *
 * Instead, it compares the response JSON to the expectedModel JSON that
 * was passed in at construction time.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/commands/contentCheckers/hackUnsupportedProps',
  'qowtRoot/commands/commandBase',
  'qowtRoot/errors/unique/domSyncError'
  ], function(
    HackUnsupportedProps,
    CommandBase,
    DomSyncError) {

  'use strict';

  var _factory = {

    /**
     * Creates a new command.
     *
     * @public
     * @param {string} eid the EID of the element to verify
     * @param {Object} expectedModel the JSON representing the expected model
     * @param {Function} callback when the verification is done and successful
     */
    create: function(eid, expectedModel, callback) {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create("verifyDocContent", false, true);

          /**
           * Since the core does not (yet) support returning checksums
           * for content elements, we simply get all dcp and then generate
           * the checksum ourselves. And since the core also does not
           * support getting content for a specific section, we ask it to
           * give us the content around that section. Which means we need
           * to "fish out" the section we are interested in. We then do NOT
           * want the dcp manager to attempt to render this content, so
           * we reset the response to undefined, but keep the section dcp
           * which we can then return to the caller (ie the DocChecker)
           */
          _api.responseHook = function(response) {

            response = HackUnsupportedProps.removeUnsupportedProps(response);

            // TODO(jliebrand): getElementContent currently sends the
            // entire child elm array; once DCP validation is fixed it
            // wont do this anymore, but for now, rip out the elm array
            // before attempting to compare models
            var coreSignature = {
              element: _.omit(_.pick(response, 'element').element, 'elm'),
              children: _.pick(response, 'children').children || []
            };

            // TODO(jliebrand): remove this once all widgets
            // have been transformed to qowt elements
            if (expectedModel.element.legacyWidget !== undefined) {
              coreSignature.element = {
                legacyWidget: coreSignature.element.eid
              };
            }

            if (!(_.isEqual(coreSignature, expectedModel))) {
              console.error('Doc checker mismatch:');
              logComparison_(coreSignature, expectedModel);
              throw new DomSyncError('Doc checker error');
            }

            // return undefined; we dont want the
            // dcp manager rendering this response
            return undefined;
          };

          /**
           * Return an object containing the payload of the DCP request.
           * The name property is mandatory.
           *
           * @return {Object} The JSON Payload data to send to the dcp service.
           */
          _api.dcpData = function() {
            var data = {
              name: "getElementContent",
              eid: eid,
              includeChildList: 'flat'
            };

            return data;
          };


          /**
           * Invoked by command framework when successful. In our case the
           * response object is undefined since we set it in the responseHook
           *
           * @override
           * @param {DCPresponse} response undefined for us
           * @see src/commands/qowtCommand.js
           */
          _api.onSuccess = function(/* response */) {
            callback();
          };

          return _api;
        };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  function logComparison_(coreSignature, expectedModel) {
    console.log('Core model:');
    console.log(coreSignature);
    console.log('Qowt model:');
    console.log(expectedModel);
  }

  return _factory;
});
