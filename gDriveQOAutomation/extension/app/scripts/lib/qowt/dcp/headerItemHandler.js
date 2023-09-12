/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Header Item handler;
 *
 * Header's can have one or more header items. These items can be off
 * type: odd, even, both, firstPage; to indicate the content for said
 * headers.
 *
 * This header item dcp handler will get the correct element to use for
 * this particular header type from the section (which it's given via
 * dcp.node)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var api_ = {
    /**
     *  DCP type code used to validate the dcp element with
     */
    etp: 'hdi',

    /**
     * This is the main Handler function that processes DCP
     * @param dcp {Object} Arbitrary DCP
     * @return {Element || undefined}
     */
    visit: function(dcp) {

      var retNode;

      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el &&
          dcp.el.etp && (dcp.el.etp === api_.etp) &&
          dcp.el.tp) {

        if (dcp.node instanceof QowtSection){

          var headerType = {
            'b': 'both',
            'e': 'even',
            'o': 'odd',
            'f': 'first-page'
          };

          // request the correct node to use from our section based on the type
          retNode = dcp.node.getHeaderItem(headerType[dcp.el.tp], dcp.el);
          retNode.setAttribute('qowt-eid', dcp.el.eid);
          retNode.id = dcp.el.eid;
        }
      }

      return retNode;
    }

  };

  return api_;
});
