/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview little utility module used by both the doc
 * checker and the verifyDocContent command to rip out any
 * formatting properties that we do not support completely.
 * This allows us to compare the rest of an elements model
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  // TODO(chehayeb): the doc verification fails for underline
  // style ('ustyle'). This issue is covered by crbug 441332.
  // In the meanwhile we ignore this property when performing
  // the verification.
  var ignore_ = ['ustyle', 'allowOverlap'];

  var api_ = {
    removeUnsupportedProps: function(obj) {
      return _.transform(obj, function(result, val, key) {
        if (_.isPlainObject(val) && ignore_.indexOf(key) === -1) {
          result[key] = api_.removeUnsupportedProps(val);
        } else if (ignore_.indexOf(key) === -1) {
          result[key] = val;
        }
      });
    }
  };

  return api_;
});
