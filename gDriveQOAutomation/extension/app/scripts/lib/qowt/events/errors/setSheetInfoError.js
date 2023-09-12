// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * A factory for creating SetSheetInfo errors.
 *
 * @fileoverview error whenever setSheetInfo command fails.
 *
 * @author hussain.pithawala@synerzip.com (Hussain Pithawala)
 */
define(['qowtRoot/events/errors/generic'], function (ErrorEvent) {

  'use strict';

  var factory_ = {

    errorId:'set_sheet_info_error',

    create:function () {
      var evt = ErrorEvent.create();
      evt.errorId = factory_.errorId;
      evt.fatal = false;
    }
  };

  return factory_;
});
