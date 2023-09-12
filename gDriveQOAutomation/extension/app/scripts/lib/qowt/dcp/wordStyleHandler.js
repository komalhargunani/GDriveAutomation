/**
 * @fileOverview A DCP handler that supports Word style definitions.
 * The handler adds every valid style object to the QowtOfficeStyles container.
 *
 * @author dskelton@google.com (Duncan Skelton)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */
define([], function() {

  'use strict';

  var api_ = {
    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    'etp': 'stl',
    /**
     * This is the main Handler function that processes DCP.
     * @param {Object} dcp Arbitrary DCP.
     * @return {undefined} Style data is written to a temporary space.
     */
    visit: function(dcp) {
      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === api_.etp) &&
          (dcp.el.eid !== undefined) && (dcp.el.id !== undefined) &&
          (dcp.el.type !== undefined)) {
        // Get the element that manages all the styles in the Office document,
        // and add the style to the element.
        var officeStyles = document.querySelector('[is="qowt-office-styles"]');
        var tableStyles = document.querySelector('[is="qowt-table-styles"]');
        var style = dcp.el;
        if (style.type === 'table') {
          tableStyles.add(style);
        } else {
          officeStyles.add(style);
        }
      }
      return undefined;
    }
  };
  return api_;
});
