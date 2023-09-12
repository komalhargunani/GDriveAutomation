/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview DCP Handler for header elements
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var api_ = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'hdr',

    /**
     * This is the main Handler function that processes DCP
     * @param {Object} dcp Arbitrary DCP.
     * @return {Element || undefined} A header element.
     */
    visit: function(dcp) {
      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === api_.etp)) {

        if (dcp.node instanceof QowtSection) {
          dcp.node.headerId = dcp.el.eid;
          dcp.node.differentFirstPage = dcp.el.dfp || false;
          dcp.node.differentOddEven = dcp.el.doe || false;
          dcp.node.headerDistanceFromTop = dcp.el.htp || '';
        }
      }
    }

  };


  return api_;
});