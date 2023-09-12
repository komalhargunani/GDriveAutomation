// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetSheetInfo command including response behaviours.
 * Creates a SetSheetInfo command for updating the sheetname. Command is
 * optimistic in nature.
 *
 * @author hussain.pithawala@synerzip.com (Hussain Pithawala)
 */
define([
  'qowtRoot/utils/i18n',
  'qowtRoot/commands/markDocDirtyCommandBase',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/events/errors/setSheetInfoError',
  'qowtRoot/widgets/grid/sheetSelector'
],
  function (
    I18n,
    MarkDocDirtyCommandBase,
    PubSub,
    SetSheetInfoError,
    SheetSelector) {

  'use strict';

    var factory_ = {
      /**
       *
       *  @param config     Configuration object An object which contains the
       *                    parameters to work upon sheetname and sheetindex are
       *                    required parameters
       */

      create: function (config) {
        if (!config.sheetName) {
          throw new Error("SetSheetInfo requires a name");
        }

        var kSetSheetInfoCmdName_ = "SetSheetInfo";

        config.errorFactory = SetSheetInfoError;

        var api_ =
          MarkDocDirtyCommandBase.create(kSetSheetInfoCmdName_, true);

        /**
         * Return an object with the data to be used as the payload of
         * the DCP request. Request manager will add the unique ID to
         * this payload to track and match client-server
         * request-response. The name property is mandatory.
         *
         * @see     dcplegacyservice/schemas/requests/quicksheet/
         *          SetSheetInformation/
         *          SetSheetInformation-response-schema.json
         * @return  {Object} The JSON Payload data to send to the dcp
         *          service
         */
        api_.dcpData = function () {
          return {
            name:"ssi",
            si:  config.sheetIndex,
            sn:  config.sheetName
          };
        };

        /**
         * @override
         * @see    src/commands/qowtCommand.js
         * @param  response {DCP Response | undefined}  The failing DCP
         *         response from service call or undefined if optimistic
         *         handling failure.
         * @param  errorPolicy {object} A policy object used to determine what
         *         behaviour to use in handling the response.
         */
        api_.onFailure = function (response, errorPolicy) {
          response = response || {};
          PubSub.publish('qowt:notification', {
            msg:I18n.getMessage(config.errorFactory.errorId + '_msg')
          });

          if (errorPolicy) {
            // ensure the framework will not present an actual error dialog
            errorPolicy.eventDispatched = true;
          }
        };

        /**
         * @override
         * Reverts the sheet tab name to the previous one, in case an error
         * occurs.
         */

        api_.doRevert = function(){
          SheetSelector.setSheetName(config.sheetIndex, config.oldSheetName);
          SheetSelector.resizeSelector();
        };

        return api_;
      }
    };

    return factory_;
  });
