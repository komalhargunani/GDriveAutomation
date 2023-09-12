/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview this command used to exist to prod the paginator
 * which now no longer exists (qowt-pages auto-paginate...)
 *
 * I suspect we can remove this module all together, but as the
 * CL to introduce polymer-word is already large, I do not want to
 * overly rock the boat wrt changing dependencies. So for now leaving
 * this command as it is, but in the future we should probably remove it.
 *
 * TODO(jliebrand): remove this command if it's no longer needed
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
    'qowtRoot/commands/common/transactionEnd'
  ], function(CoreTransactionEnd) {

  'use strict';

  var _factory = {

    create: function() {
      // extend transaction end command
      // Notice the arguments of optimistic = true, callsService = true
      var _api = CoreTransactionEnd.create('textTxEnd', true, true);

      return _api;
    }
  };

  return _factory;
});
