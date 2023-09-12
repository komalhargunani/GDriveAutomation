/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview dcp handler for page and line breaks.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    'etp' : 'brk',

    /**
     * Processing of the Break Element coming from DCP.
     */
    'visit' : function visit(dcp) {
      var breakElement;
      if (!dcp || !dcp.el || !dcp.el.etp || (dcp.el.etp !== _api.etp)) {
        return undefined;
      }
      if (dcp.el.hasOwnProperty('btp') && dcp.el.btp) {
        if (dcp.el.btp === 'pbr') {
          breakElement = new QowtPageBreak();
        } else if (dcp.el.btp === 'lbr') {
          breakElement = new QowtLineBreak();
          breakElement.setModel(dcp.el);
        } else if (dcp.el.btp === 'cbr') {
          breakElement = new QowtColumnBreak();
        }
      }
      breakElement.setEid(dcp.el.eid);
      dcp.node.appendChild(breakElement);
      return breakElement;
    }
  };

  return _api;
});
