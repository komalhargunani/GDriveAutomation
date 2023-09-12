define(function() {

  'use strict';

  var api_ = {
    etp: 'drawing',

    visit: function(dcp) {
      if (dcp && dcp.el && dcp.el.etp && dcp.el.etp === api_.etp &&
          dcp.el.eid) {
        var drawingElement = document.getElementById(dcp.el.eid);

        // The drawingElement might already be present in the DOM eg. when it
        // contains a text box whose contents are spread across multiple gDC
        // responses, the continued response for remaining textbox content comes
        // with the complete DOM hierarchy data. If the drawingElement does not
        // exists in the DOM, create a new one and add it to the dcp.node
        if (!drawingElement) {
          drawingElement = new QowtDrawing();
          drawingElement.setEid(dcp.el.eid);
          drawingElement.setModel(dcp.el);
          dcp.node.appendChild(drawingElement);
        }
      }
      return drawingElement;
    }
  };

  return api_;
});
