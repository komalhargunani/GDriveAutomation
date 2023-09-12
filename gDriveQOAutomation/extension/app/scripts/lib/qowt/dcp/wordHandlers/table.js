/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview DCP Handler for Table elements
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var api_ = {

    /**
     * the dcp Element TyPe (etp) for tables
     */
    etp: 'tbl',

    /**
     * visit function called by dcp manager for a given table element
     *
     * @param dcp {object} JSON describing this table element. It also
     *                     holds a reference to the parent HTML node
     *                     to which we can/should add our table
     * @return {Element || undefined}
     */
    visit: function(dcp) {
      if (dcp && dcp.el && dcp.el.eid &&
          dcp.el.tableProperties && dcp.el.tableProperties.cgr) {
        var element = new QowtTable();
        element.setEid(dcp.el.eid);
        element.setModel(dcp.el);

        // add this element to our stack; we'll add it to the DOM
        // in the postTraverse
        tables_.push(element);

        return element;
      }
    },

    /**
     * There are two reasons we MUST use postTraverse for top
     * level elements such as paragraphs and tables:
     *
     * 1- The main reason is the fact that the dcp manager can
     *    and WILL reschedule the handling of a dcp response at
     *    *any* point within that response. Once it reschedules,
     *    we will reflow the document, meaning half finished
     *    paragraphs or tables could get paginated. When the dcp
     *    manager resumes, it's breadcrumb would then point to wrong
     *    elements. So we MUST only ever add top level items to
     *    the page when all their children have been added.
     * 2- By adding these elements only once all the children are
     *    added, we limit the hits on the DOM and increase performance
     */
    postTraverse: function(dcp) {
      // since this dcp handler is a singleton, it could handle
      // multiple nested tables. In order to add the correct one
      // we use a stack of tables created in the visit function
      var table = tables_.pop();
      Polymer.dom(dcp.node).appendChild(table);
      Polymer.dom(dcp.node).flush();
    }

  };
  // ------------------------ PRIVATE -----------------------

  /**
   * Table array which we use so that we can push table elements as
   * we get them, and thereby be able to handle nested table elements
   * @private
   */
  var tables_ = [];

  return api_;

});
