
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview mutation tool cleaner to reset any element Ids that got
 * wiped out during the mutation
 *
 * This is a singleton
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/tools/text/mutations/tags'
  ], function(Tags) {

  'use strict';

  // top priority for ID cleaning
  var _kPriority = 0,
      _kIdAttrib = 'id';

  function _resetIds(summary, node) {
    node.id = summary.getOldAttribute(node, _kIdAttrib);
  }

  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags['ATTRIB-ID'],
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['P', 'SPAN']
      },
      callback: _resetIds,
      priority: _kPriority
    }
  };
});
