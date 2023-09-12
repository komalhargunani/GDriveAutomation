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
 * Constructor for the UpdateRow DCP Handler.
 * This handler processes a 'urw' (row) element from a DCP response, in its
 * visit() method
 *
 * @constructor
 * @return {object} A UpdateRow DCP handler
 */
define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/models/sheet',
  'qowtRoot/models/dcp'
  ],
  function(
    UnitConversionUtils,
    Workbook,
    SheetModel,
    DcpModel) {

  'use strict';

  var _api;

  _api = {
    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this handler
     */
    etp: 'urw',

    /**
     * Processes a 'urw' (row) element from a DCP response.
     * This involves updating the sheet model with retrieved information
     * about the row and processing information on all of the cells that
     * contain content in this row.
     *
     * @param v {object}   A row element from a DCP response
     * @return {undefined} No object is returned
     */
    visit: function(v) {
      if(!v || !v.el || !v.el.etp || (v.el.etp !== 'urw')) {
        return undefined;
      }

      DcpModel.dcpHandlingRow = v.el.ri;

      // check whether this row has a specific height
      if (v.el.rh) {

        // convert the rowHeight from point units to pixel units
        SheetModel.specificRowHeights[v.el.ri] =
            UnitConversionUtils.convertPointToPixel(v.el.rh);
      }
      // If specific row height is not present for this row, check whether this
      // row previously had any specific height. If yes, then remove that height
      // from specificRowHeight array and update it with new values.
      else if (SheetModel.RowHeights[v.el.ri] !==
          SheetModel._defaultRowHeightInPx) {
            delete SheetModel.specificRowHeights[v.el.ri];
      }

      // check whether this row is hidden
      if(v.el.hd){

        // store the height of the row before it is hidden
        // (for use if the user later unhides the row)
        var rowWidget = Workbook.getRow(v.el.ri);
        if(rowWidget) {
          rowWidget.setPreHiddenHeight(v.el.rh ||
            Workbook.getDefaultRowHeight());
        }

        // this row will have a height of 0
        SheetModel.specificRowHeights[v.el.ri] = 0;
      }
      //code to store previous row formatting
      var row = Workbook.getRow(v.el.ri);
      var prevFormatting = row.getFormatting();
      Workbook.formatRow(v.el.ri, v.el.fm, v.el.delfm);
      if (v.el.fm && v.el.fm.borders) {
        if (!prevFormatting || !prevFormatting.borders ||
         ! _.isEqual(prevFormatting.borders, v.el.fm.borders)) {
          _api.createRequiredCells(v);
        }
      } else if (prevFormatting && prevFormatting.hasOwnProperty('borders')) {
        _api.createRequiredCells(v);
      }


      return undefined;
    },

    /**
     * Called after all of the child (i.e. cell) elements of this row have been
     * processed
     */
    postTraverse: function() {
      DcpModel.dcpHandlingRow = undefined;
    },

    createRequiredCells: function(v) {
      var noOfNonEmptyCells = v.el.elm ? v.el.elm.length : 0;
      var noOfColumns = Workbook.getNumOfCols();
      for (var i = 0; i < noOfColumns; i++) {
        var cellIsEmpty = true;
        for (var j = 0; j < noOfNonEmptyCells; j++) {
          if (i === v.el.elm[j].ci) {
            cellIsEmpty = false;
          }
        }
        if (cellIsEmpty) {
          var config = {
            ci: i,
            etp: 'scl',
            fm: SheetModel.defaultFormatting
          };
          if (v.el.fm && v.el.fm.borders) {
            config.fm.borders = v.el.fm.borders;
          } else {
            config.fm.borders = {};
          }
          if (!v.el.elm) {
            v.el.elm = [];
          }
          v.el.elm.push(config);
        }
      }
    }

  };



  return _api;
});
