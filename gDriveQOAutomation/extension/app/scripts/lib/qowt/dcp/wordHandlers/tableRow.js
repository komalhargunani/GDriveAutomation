/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileOverview DCP Handler for each row in an MS Word Table
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var _api = {

    /**
     * the dcp Element TyPe (etp) for table rows
     */
    etp: 'row',

    /**
     * visit function called by dcp manager for a given table element
     *
     * @param dcp {object} JSON describing this table element. It also
     *                     holds a reference to the parent HTML node
     *                     to which we can/should add our table
     */
    visit: function(dcp) {

      if (dcp && dcp.el && dcp.el.eid) {
        var element = new QowtTableRow();
        element.setEid(dcp.el.eid);
        element.setModel(dcp.el);

        Polymer.dom(dcp.node).appendChild(element);
        Polymer.dom(dcp.node).flush();
        return element;
      }
    }
  };

  return _api;
});
