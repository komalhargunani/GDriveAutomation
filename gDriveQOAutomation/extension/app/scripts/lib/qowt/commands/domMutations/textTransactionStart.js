
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview
 *
 * A text transaction START command means we are about to start changing the
 * content, and thus is responsible for updating the SaveStateManager and
 * marking the file as dirty (edited but not saved).
 *
 * Instances of this Core transactoin START are created by the Text Tool during
 * its processing of mutations. It is never, and should never, be created by
 * any other means.
 *
 * @author jelte@google.com (Jelte Liebrand)
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/commands/common/transactionStart',
    'qowtRoot/savestate/saveStateManager',
    'qowtRoot/tools/text/textTool',
  ], function(
    CoreTransactionStart,
    SaveStateManager,
    TextTool) {

  'use strict';

  var _factory = {

    create: function() {
      // extend transaction start command
      // Notice the arguments of optimistic = true, callsService = true
      var _api = CoreTransactionStart.create('textTxStart', true, true),
          _dcpDataBase = _api.dcpData,
          _context = TextTool.getSnapshotBeforeEdit();

      // extend the 'transaction start' base command in order to add the
      // context information before the edit occurred. If the transaction
      // is reverted, then this context will be retrieved from the Core
      // in order to restore it.
      _api.dcpData = function() {
        var payload = _dcpDataBase();
        payload.context = JSON.stringify(_context);
        return payload;
      };

      var _superOptimistic = _api.doOptimistic;
      _api.doOptimistic = function() {
        if (_superOptimistic) {
          _superOptimistic();
        }
        SaveStateManager.markAsDirty();
      };

      return _api;
    }
  };

  return _factory;
});
