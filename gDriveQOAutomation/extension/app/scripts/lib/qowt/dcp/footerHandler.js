/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview DCP Handler for Footer elements
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var api_ = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'ftr',

    /**
     * This is the main Handler function that processes DCP
     * @param {Object} dcp Arbitrary DCP.
     * @return {Element || undefined} The generated element.
     */
    visit: function(dcp) {
      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === api_.etp)) {

        if (dcp.node instanceof QowtSection) {
          dcp.node.footerId = dcp.el.eid;
          dcp.node.differentFirstPage = dcp.el.dfp || false;
          dcp.node.differentOddEven = dcp.el.doe || false;
          dcp.node.footerDistanceFromBottom = dcp.el.ftb || '';
        }
      }
    }

  };

  return api_;
});
