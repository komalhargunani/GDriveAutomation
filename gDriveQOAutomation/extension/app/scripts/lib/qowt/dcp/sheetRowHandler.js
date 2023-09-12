/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Constructor for the SheetRow DCP Handler.
 * This handler processes a 'srw' (row) element from a DCP response, in its
 * visit() method
 *
 * @constructor
 * @return {object} A SheetRow DCP handler
 */
define([
    'qowtRoot/controls/grid/workbook',
    'qowtRoot/dcp/updateRowHandler',
    'qowtRoot/dcp/utils/unitConversionUtils',
    'qowtRoot/models/sheet',
    'qowtRoot/models/dcp'
    ],
    function(
      Workbook,
      UpdateRowHandler,
      UnitConversionUtils,
      SheetModel,
      DcpModel) {

  'use strict';



    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    var _api;

    _api = {

        /**
         * DCP Type Code
         * This is used by the DCP Manager to register this handler
         */
        etp: 'srw',

        /**
         * Processes a 'srw' (row) element from a DCP response.
         * This involves updating the sheet model with retrieved information
         * about the row and processing information on all of the cells that
         * contain content in this row, to aid SheetCell.create with
         * the bursting of cells
         *
         * @param v {object}   A row element from a DCP response
         * @return {undefined} No object is returned
         */
        visit: function(v) {
            if(!v || !v.el || !v.el.etp || (v.el.etp !== 'srw')) {
              return undefined;
            }

            DcpModel.dcpHandlingRow = v.el.ri;

            // cache non-empty row indexes. used for the calculation of row
            // height.
            SheetModel.NonEmptyRowIndexArray.push(v.el.ri);

            // check whether this row has a specific height
            if(v.el.rh){
                // convert the row height from point units to pixel units
                SheetModel.specificRowHeights[v.el.ri] = UnitConversionUtils.
                                                  convertPointToPixel(v.el.rh);
            }

            // check whether this row is hidden
            if(v.el.hd){

                // store the height of the row before it is hidden
                // (for use if the user later unhides the row)
                var rowWidget = Workbook.getRow[v.el.ri];
                if(rowWidget) {
                    rowWidget.setPreHiddenHeight(v.el.rh ||
                      Workbook.getDefaultRowHeight());
                }

                // this row will have a height of 0
                SheetModel.specificRowHeights[v.el.ri] = 0;
            }
            // apply formatting if this row has formatting
            Workbook.formatRow(v.el.ri, v.el.fm);
            if (v.el.fm && v.el.fm.borders) {
              UpdateRowHandler.createRequiredCells(v);
            }
            return undefined;
        },

        /**
         * Called after all of the child (i.e. cell) elements of this row have
         * been processed
         *
         * @param v {object} A row element in a DCP response
         */
        postTraverse: function(/* v */) {
            DcpModel.dcpHandlingRow = undefined;
        }
    };

    return _api;
});
