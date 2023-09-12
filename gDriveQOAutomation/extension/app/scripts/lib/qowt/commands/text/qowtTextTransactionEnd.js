/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Text transaction end. We capture the selection position which we
 * can then use in undo.
 * TODO(jliebrand): check if we actually still use this; otherwise delete
 * this command
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/selection/selectionManager'
  ], function(
    CommandBase,
    SelectionManager) {

  'use strict';

  var _factory = {
    /**
     * Create and return a new TextQowtTransactionEnd command instance.
     *
     * @return {Object} A new TextQowtTrnsactionEnd instance.
     */
    create: function() {
      // we capture the context during command creation on purpose. If we
      // put it off, then the selection might not be valid when we try to
      // restore it as part of the redo processing.
      var cmd = CommandBase.create(
          'textQowtTransactionEnd', true, false, SelectionManager.snapshot());

      return cmd;
    }
  };

  return _factory;
});
