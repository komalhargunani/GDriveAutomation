
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview QOWT text transaction start command factory.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/commands/commandBase'
  ], function(
    CommandBase) {

  'use strict';

  var _factory = {
    /**
     * Create a new TextQowtTransactionStart instance.
     *
     * @return {Object} A new TextQowtTransactionStart command.
     */
    create: function() {
      var cmd = CommandBase.create('textQowtTransactionStart', false, false);

      return cmd;
    }
  };

  return _factory;
});
