
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Constructor for the OpenWorkbookFile DCP Handler.
 * This handler processes the DCP response for a OpenWorkbookFile command in
 * its visit() method.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

/**
 * @constructor
 * @return {object} An OpenWorkbookFile DCP handler.
 */
define([
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/models/sheet',
    'qowtRoot/utils/fontManager',
    'qowtRoot/widgets/grid/sheetSelector'
  ], function(
    MessageBus,
    SheetModel,
    FontManager,
    SheetSelector
  ) {

  'use strict';

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'owb',

    /**
     * Processes the DCP response for an 'open workbook' command.
     * This involves updating the sheet model with retrieved information
     * about the workbook and creating the sheet tabs in the sheet selector.
     *
     * @param {object} v The DCP response as a nested JSON object.
     * @return {undefined} No object is returned.
     */
    visit: function(v) {
      if (!v || !v.el || !v.el.etp || (v.el.etp !== 'owb')) {
        return undefined;
      }

      // TODO: we really should be getting styles, not fonts?!
      SheetModel.activeSheetIndex = v.el.asi ? v.el.asi : 0;
      SheetModel.fileIsReadOnly = v.el.ro || false;
      SheetModel.filePassword = v.el.pw;
      SheetModel.fontNames = v.el.fn;
      SheetModel.sheetNames = v.el.sn;
      if (SheetModel.sheetNames.length) {
        _recordData('SheetCount', SheetModel.sheetNames.length);
      }

      FontManager.initFonts(SheetModel.fontNames);

      if (SheetSelector !== undefined) {
        SheetModel.sheetNames.forEach(function(label) {
          SheetSelector.createTab(label);
        });
        SheetSelector.setActiveTab(SheetModel.activeSheetIndex);
      }

      return undefined;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  /**
   * Write file statistics to the user metrics module.
   * @private
   * @param {String} dataPoint The name of the data point to log.
   * @param {Integer} count The value to log against the data point.
   */
  function _recordData(dataPoint, count) {
    MessageBus.pushMessage({
      id: 'recordCount', context: {
        dataPoint: dataPoint,
        value: count
      }
    });
  }

    return _api;
});
