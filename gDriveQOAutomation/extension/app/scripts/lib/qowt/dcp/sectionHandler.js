/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview DCP Handler for MS Office Section elements
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var api_ = {
    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    'etp': 'sct',

    /**
     * This is the main Handler function that processes DCP
     * @param dcp {Object} Arbitrary DCP
     * @return {Element || undefined}
     */
    visit: function(dcp) {
      // Error check to make sure we got the required values
      if (dcp && dcp.el && dcp.el.eid &&
        dcp.el.etp && (dcp.el.etp === api_.etp)) {

        var thisSectionSelector = '[qowt-eid="' + dcp.el.eid + '"]';
        var sections =
          Polymer.dom(document).querySelectorAll(thisSectionSelector);
        if (sections.length === 0) {
          // doesn't exist, create a new section and add it to the dcp.node
          var section = document.createElement('qowt-section');
          section.setEid(dcp.el.eid);
          section.setModel(dcp.el);

          Polymer.dom(dcp.node).appendChild(section);
          sections = [section];
          Polymer.dom(dcp.node).flush();
        }

        // return the last section in our flow chain
        var lastInstance = sections[sections.length - 1];
        return lastInstance;
      }
    }
  };

  return api_;
});