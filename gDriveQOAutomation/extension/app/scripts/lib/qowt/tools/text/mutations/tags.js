
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview tags used by the text tool when sequencing the edits
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  // BITWISE (!) flags to identify the mutation types
  var _api = {
    'ADDED': 1,
    'MOVED': 2,
    'DELETED': 4,
    'FORMAT': 8,
    'CHARDATA': 16,
    'ATTRIB-ID': 32,
    'ATTRIB-STYLE': 64,
    'ATTRIB-CLASS': 128,
    /**
     * TODO(dtilley): Revisit this design at a less risky time, is it worth
     * having an 'ATTRIB-QOWT' tag that can be used to track changes to custom
     * element attributes, such as qowt-divtype?
     */

    // used by the sequencer as we walk the nodes
    'PROCESSED': 256,
    'PROCESSING': 1024,
    'ATTRIB-FORMAT':2048
  };

  return _api;
});

