// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview requests the Core to redo the previous transaction.
 *
 * @author Anibal Chehayeb (chehayeb@google.com)
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/savestate/saveStateManager'], function(
  CommandBase,
  QOWTSilentError,
  SaveStateManager) {

  'use strict';

  return {

    create: function() {

      return (function() {

        // Extend default command (optimistic==true, callsService==true)
        var api_ = CommandBase.create('redo', true, true);

        api_.doOptimistic = function() {
          SaveStateManager.markAsDirty();
        };

        /**
         * Returns the data for the payload of the DCP command.
         * The name property is mandatory.
         * @return  {Object} Command payload object.
         */
        api_.dcpData = function() {
          return {name: 'redo'};
        };

        /**
         * Command-specific failure responses.
         * @param {Object} response The received DCP response.
         * @param {Object} errorPolicy The framework default error policy.
         */
        api_.onFailure = function(response, errorPolicy) {
          if (response.e === 'RedoStackEmptyError') {
            errorPolicy.ignoreError = true;
            // Using a silent error here so that this use-case is
            // tracked in the GA data but does not interrupt the user.
            throw new QOWTSilentError('Cannot redo, stack is empty');
          }
        };

        return api_;

      })();

    }

  };

});
