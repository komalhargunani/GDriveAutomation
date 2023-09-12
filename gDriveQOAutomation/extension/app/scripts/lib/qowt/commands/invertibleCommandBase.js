
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Invertible commands are a class of commands that are invertible
 * and by default behave as a null command/no-op.
 *
 * All Qowt (text) commands must be invertible, and these inverses must be
 * null commands (since it's the transaction END command that delivers all the
 * correct inverses).
 *   - This fulfills the requirement that inverse commands are invertible.
 *
 * This factory module therefore makes writing Qowt Text Command inverse classes
 * easier.
 *
 * TODO(ganetsky/dskelton) Ultimately we want to remove the invariant that
 * inverse commands must themselves be invertible. This will remove layers of
 * accumulated null commands and improve performance of repeated undo/redo
 * cycles of the same operation.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/commands/commandBase'
  ], function(
    CommandBase
  ) {

  'use strict';

  var _factory = {

    create: function() {
      var _api = CommandBase.create('invertibleCmdBase');
      _api.makeNullCommand();

      _api.canInvert = true;
      _api.getInverse = function() {
        return _factory.create();
      };

      return _api;
    }
  };

  return _factory;
});


