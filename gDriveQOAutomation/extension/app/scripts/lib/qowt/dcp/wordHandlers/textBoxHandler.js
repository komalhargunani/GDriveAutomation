define([], function() {

  'use strict';

  var api_ = {

    /**
     * The dcp Element Type (etp) for text box.
     */
    etp: 'textBox',

    /**
     * visit function called by dcp manager for a given text box element.
     *
     * @param dcp {object} JSON describing this text box element. It also holds
     * a reference to the parent HTML node to which we can/should add our text
     * box.
     */
    visit: function(dcp) {

      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === api_.etp) &&
          dcp.el.eid) {
        var element = document.getElementById(dcp.el.eid);

        // The textbox might already be present in the DOM eg. when its contents
        // are spread across multiple gDC responses, the continued response for
        // remaining textbox content comes with the complete DOM hierarchy data.
        // If the textbox does not exists in the DOM, create a new one.
        if (!element) {
          element = new QowtTextBox();
          element.setEid(dcp.el.eid);
          element.setModel(dcp.el);

          dcp.node.insertBefore(element, dcp.node.lastChild);
        }
        return element;
      }
    }
  };

  return api_;
});
