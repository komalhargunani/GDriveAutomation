define([], function() {

  'use strict';

  var api_ = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'background',

    /**
     * This is the main Handler function that processes DCP.
     * @param {Object} dcl Arbitrary DCP.
     * @return {Element || undefined} The generated element.
     */
    visit: function(dcp) {
      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === api_.etp)) {
        // Ensure that we create a single 'qowt-background' element irrespective
        // of number of gDC responses.
        var backgroundElement = dcp.node.getElementById(dcp.el.eid) ||
            document.getElementById(dcp.el.eid);

        // If not create a new element
        if (!backgroundElement) {
          backgroundElement = document.createElement('qowt-background');
          backgroundElement.setEid(dcp.el.eid);
          backgroundElement.setModel(dcp.el);

          var msdoc = dcp.node.closest('qowt-msdoc');
          msdoc.insertBefore(backgroundElement, msdoc.firstChild);
        }

        // There is only one document level background.
        return backgroundElement;
      }
    }
  };

  return api_;
});
