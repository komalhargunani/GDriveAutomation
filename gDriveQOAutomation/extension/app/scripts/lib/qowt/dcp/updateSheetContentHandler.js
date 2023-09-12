/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * Constructor for the UpdateSheetContent DCP Handler.
 * This handler processes the DCP response for a
 * UpdateSheetContent command in its visit() method
 *
 * @constructor
 * @return {object} A UpdateSheetContent DCP handler
 */

define([
    'qowtRoot/controls/grid/workbook',
    'qowtRoot/models/sheet'
    ],
    function(Workbook, SheetModel) {

  'use strict';



  var _api = {
    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this handler
     */
    etp: 'ucc',

    /**
     * Processes the DCP response for a 'update sheet content' command.
     * This method does little - more happens in the contained DCP
     *
     * @param v {object}   The DCP response as a nested JSON object
     * @return {undefined} No object is returned
     */
    visit: function(v) {
        if(!v || !v.el || !v.el.etp || (v.el.etp !== 'ucc')) {
          return undefined;
        }

        SheetModel.numberOfNonEmptyRows = v.el.rc;
        SheetModel.numberOfNonEmptyCols = v.el.cc;

        if(v.el.rfl) {
          Workbook.getActivePane().getFloaterManager().reset();
        }

        // if required, increase the number of rows in the baseDiv grid element
        // now that we have the real data from the service on the sheet's last
        // non-empty row
        Workbook.ensureMinimalRowCount(SheetModel.numberOfNonEmptyRows - 1);

        return undefined;
    },

    /**
     * Called after all of the child (i.e. cell) elements have been processed
     *
     * @param v {object} A row element in a DCP response
     */
    postTraverse: function(/* v */) {
        return;
    }

  };

  return _api;
});
