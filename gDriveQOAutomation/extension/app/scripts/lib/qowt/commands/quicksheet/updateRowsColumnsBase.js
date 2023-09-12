// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Base class for a command that updates
 * the rows or columns of a sheet
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/commands/markDocDirtyCommandBase'
  ], function(
    MarkDocDirtyCommandBase) {

  'use strict';

  var factory_ = {

    /**
     * Create a new command object.
     *
     * @param {string or undefined} cmdName A unique name for this command
     * @return {object} A new command object
     */
    create: function(cmdName) {
      var callsService = true;
      return MarkDocDirtyCommandBase.create(cmdName, callsService);
    }
  };

  return factory_;
});
