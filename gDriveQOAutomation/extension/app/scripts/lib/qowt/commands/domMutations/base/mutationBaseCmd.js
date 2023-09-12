/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview base class for all mutation commands
 * handles generic things like the onFailure for example
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/commands/commandBase',
  'qowtRoot/errors/unique/textualEditError'
  ], function(
    Features,
    CommandBase,
    TextualEditError
  ) {

  'use strict';

  var _factory = {

    create: function(
        opt_cmdName, opt_optimistic, opt_callsService, opt_context) {

      // extend command base
      var _api = CommandBase.create(
              opt_cmdName, opt_optimistic, opt_callsService);

      var context = opt_context;
      /**
       * On success merely log (if logging is enabled)
       *
       * @param {object} response The received DCP response.
       */
      _api.onSuccess = function(/* response */) {
        if (Features.isEnabled('logMutations')) {
          console.log(_api.name + ' success');
        }
      };

      /**
       * Throw a fatal error if the core failed. This will instruct the
       * user to reload the page to recover any changes they made
       *
       * NOTE: this uses the new error handling (eg throwing a QOWTException)
       * and since that is a fatal exception, we no longer need to use
       * the old "errorPolicy" object anymore.
       *
       * @param {object} response The recevied DCP response.
       */
      _api.onFailure = function(response) {
        var failureMsg = '';

        // crude test to see if the failure was down to widow/orphan
        // so that we can log that to GA... not foolproof, but hopefully
        // will give us something. It simply groups the usual suspects
        // from the context object like the span/node/parent/sibling ids
        // and checks if any of them have a reference to an 'owchain', which
        // they should NOT have...
        //
        // TODO(jliebrand): the list of id's here is a good indicator of
        // our incosistency between commands... we should ensure consistency
        // and name things accordingly!
        //
        // TODO(jliebrand): remove this once we've solved all widow orphan
        // related issues; or once we have a more robust way to edit them
        var verify = [
          context.spanEid,
          context.nodeId,
          context.parentId,
          context.siblingId,
          context.nodeCoreId,
          context.parentCoreId,
          context.coreEid,
          context.oldParentId].join('');
        if (verify.indexOf('owchain') !== -1) {
          failureMsg += 'WIDOW-ORPHAN-ERROR ';
        }

        failureMsg += _api.name + " failed: " + response.e;
        console.error("%s, dcpData:", failureMsg, _api.dcpData());

        throw new TextualEditError(failureMsg);
      };

      return _api;
    }
  };

  return _factory;
});
