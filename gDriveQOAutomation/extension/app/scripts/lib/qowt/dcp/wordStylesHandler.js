/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileOverview A DCP handler that supports Word styles definitions.
 * Word styles is a container of each individual word style.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([], function() {

  'use strict';

  var api_ = {
    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    'etp': 'stls',

    /**
     * This is the main Handler function that processes stlyes DCP.
     * @param {Object} dcp Arbitrary DCP.
     * @return {undefined}
     */
    visit: function(dcp) {
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === api_.etp) &&
          (dcp.el.eid !== undefined)) {
        // Create the QowtOfficeStyles polymer element,
        // that encapsulates all the styles present in the Office document.
        officeStyles_ = new QowtOfficeStyles();
        document.head.appendChild(officeStyles_);
        // Create the QowtTableStyles polymer element,
        // that encapsulates all the table styles present in Office document.
        tableStyles_ = new QowtTableStyles();
        document.head.appendChild(tableStyles_);
      }
    },

    /**
     * Called after all of the child (i.e. series) elements of this chart have
     * been processed.
     */
    postTraverse: function() {
      // After all styles have been handled, request the
      // QowtTableStyles and the QowtOfficeStyles polymer element
      // to write out the dynamic CSS rules.
      tableStyles_.writeStyles();
      officeStyles_.writeStyles();
    }
  };

  /**
   * @private
   * QowtOfficeStyles polymer element,
   * that manages all the styles in the Office document.
   * @see officeStyles
   */
  var officeStyles_;
  /**
   * @private
   * QowtTableStyles polymer element,
   * that manages all the table styles in the Office document.
   * @see tableStyles
   */
  var tableStyles_;

  return api_;
});
