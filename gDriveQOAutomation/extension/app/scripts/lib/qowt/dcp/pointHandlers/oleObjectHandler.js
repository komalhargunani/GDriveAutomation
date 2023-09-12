define([], function() {

  'use strict';

  var api_ = {
    etp: 'oleObject',

    visit: function(v) {
      var oleObjectDiv;

      if (v && v.el && v.el.etp && v.el.etp === api_.etp && v.el.eid) {
        var oleObjectElement = v.el,
            graphicFrameNode = v.node;

        oleObjectDiv = new QowtOleObject();
        oleObjectDiv.setEid(oleObjectElement.eid);

        graphicFrameNode.appendChild(oleObjectDiv);
      }

      return oleObjectDiv;
    }
  };

  return api_;
});
