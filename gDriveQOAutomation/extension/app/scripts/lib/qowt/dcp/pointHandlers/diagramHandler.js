define([], function() {

  'use strict';

  var api_ = {
    etp: 'dgm',

    visit: function(v) {
      var diagramElement;

      if (v && v.el && v.el.etp && v.el.etp === api_.etp && v.el.eid) {
        var graphicData = v.el,
            graphicFrameNode = v.node;

        diagramElement = new QowtDiagram();
        diagramElement.setEid(graphicData.eid);

        graphicFrameNode.appendChild(diagramElement);
      }

      return diagramElement;
    }
  };

  return api_;
});
