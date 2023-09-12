/// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview A GetWorkbookInformation DCP Handler.
 * This handler processes the DCP response for a
 * GetWorkbookInformation command in its visit() method
 *
 * @author anchals@google.com (Anchal Sharma)
 */
define([
  'qowtRoot/messageBus/messageBus'
], function(
  MessageBus) {

  'use strict';

  var api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'gwi',

    /**
     * Processes the DCP response for a 'get workbook information' command.
     *
     * @param {object}  v  The DCP response as a nested JSON object
     * @return {undefined} No object is returned
     */
    visit: function(v) {
      if (!v || !v.el || !v.el.etp || !v.el.se || (v.el.etp !== 'gwi')) {
        return undefined;
      }
      var len = v.el.se.length;
      for (var i = 0; i < len; i++)
      {
        var val = v.el.se[i];
        recordData('NonEmptyCellCount', val.ncd);
        recordData('FormattedCellCount', val.ncf);
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
  function recordData(dataPoint, count) {
    MessageBus.pushMessage({
      id: 'recordCount', context: {
        dataPoint: dataPoint,
        value: count
      }
    });
  }

  return api;
});

