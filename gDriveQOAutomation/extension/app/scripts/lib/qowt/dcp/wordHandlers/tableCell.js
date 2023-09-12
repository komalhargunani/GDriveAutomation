define([], function() {

  'use strict';

  var _api = {

    /**
     * the dcp Element TyPe (etp) for table cells
     */
    etp: 'cll',

    /**
     * visit function called by dcp manager for a given table element
     *
     * @param dcp {object} JSON describing this table element. It also
     *                     holds a reference to the parent HTML node
     *                     to which we can/should add our table
     * @return {Element || undefined}
     */
    visit: function(dcp) {
      var element = new QowtTableCell();
      element.setEid(dcp.el.eid);
      element.setModel(dcp.el);

      Polymer.dom(dcp.node).appendChild(element);
      return element;
    }

  };

  return _api;
});
