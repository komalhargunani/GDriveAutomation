define([], function() {

  'use strict';

  var api_ = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    'etp' : 'crr',

    /**
     * Processing of the Carriage Return Element coming from DCP.
     */
    'visit' : function visit(dcp) {

      if (!dcp || !dcp.el || !dcp.el.etp || (dcp.el.etp !== api_.etp)) {
        return undefined;
      }
      var element = new QowtLineBreak();
      element.setEid(dcp.el.eid);
      element.setModel(dcp.el);
      dcp.node.appendChild(element);
      return element;
    }
  };

  return api_;
});
