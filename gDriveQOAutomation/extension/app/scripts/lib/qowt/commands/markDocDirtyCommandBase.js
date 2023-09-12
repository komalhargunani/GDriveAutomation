// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Base class for a command that marks the document
 * as dirty as part of its execution. In this context a 'dirty'
 * document is one that has had changes made to its content
 * which have not yet been saved.
 *
 * Dirty documents may be indicated as such to the user and
 * treated specially. For example, if a user attempts to unload
 * a dirty document from the browser then they will be given
 * the chance to return to the page and save the changes first.
 * See SaveStateManager for further details.
 *
 * Note that if a subclass of this module requires to
 * perform its own optimistic work then the subclass should
 * define a doDirtyOptimistic() method as part of its public API,
 * which carries out that work. The doDirtyOptimistic() method
 * will be invoked from within the immutable doOptimistic()
 * method of MarkDocDirtyCommandBase.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/savestate/saveStateManager'
  ], function(
    CommandBase,
    SaveStateManager) {

  'use strict';

  var factory_ = {

    /**
     * Create a new command object.
     *
     * @param {string or undefined} cmdName A unique name for this command
     * @param {boolean or undefined} callsService True if the command sends
     *                               data to the service, otherwise false.
     *                               Defaults to false if undefined
     * @return {object} A new command object
     */
    create: function(cmdName, callsService) {
      var optimistic = true;
      var api_ = CommandBase.create(cmdName, optimistic, callsService);

      api_.doOptimistic = function() {
        SaveStateManager.markAsDirty();

        // call the 'extra' optimistic part (if there is one) of the subclass
        if(api_.doDirtyOptimistic) {
          api_.doDirtyOptimistic();
        }
      };

      // prevent the subclass from overwriting the doOptimistic() method
      Object.defineProperties(api_, {doOptimistic: {writable: false}});

      return api_;
    }
  };

  return factory_;
});
