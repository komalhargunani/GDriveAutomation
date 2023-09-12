/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview dcp handler for character run elements
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  // PUBLIC METHODS
  //---------------------------------------------------------------------------
  var _api = {

    /* DCP Type Code
        This is used by the DCP Manager to register this Handler */
    etp: 'ncr',

    /**
     * This is the main Handler function that processes DCP
     * @param dcp {Object} Arbitrary DCP
     * @return {Element || undefined}
     */
    visit: function(dcp) {
      var element, TABCODE = 9;

      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp &&
         (dcp.el.etp === _api.etp) && dcp.el.eid) {

        element = new QowtWordRun();
        element.setEid(dcp.el.eid);

        // dont store the actual text in the model; that
        // would take up too much memory; the qowt-word-run is
        // smart enough to include it's textContent when
        // calculating the crc32 checksum.
        element.setModel(_.omit(dcp.el, 'data'));

        element.textContent = dcp.el.data;
        /**
         * Adding the extra attribute to run to differentiate the run which
         * represents tab in paragraph.
         */
        if (element.textContent.charCodeAt(0) === TABCODE) {
          element.setAttribute('qowt-runtype', 'qowt-tab');
        }

        dcp.node.appendChild(element);

      }

      return element;
    }

  };



  return _api;
});