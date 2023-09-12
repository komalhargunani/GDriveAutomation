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
 * Constructor for the Chart DCP Handler.
 * This handler processes a 'cht' (chart) element from a DCP response, in its
 * visit() method
 *
 * @constructor
 * @return {object} A Chart DCP handler
 */
define([
  'qowtRoot/models/charts',
  'qowtRoot/models/dcp',
  'qowtRoot/variants/configs/common'], function(
    ChartsModel,
    DcpModel,
    CommonConfig) {

  'use strict';


  var _api = {

    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this handler
     */
    etp: 'cht',

    /**
     * Processes a 'cht' (chart) element from a DCP response.
     * Caches information for this chart in ChartsModel.
     *
     * The chart information that is cached may include:
     * - Chart type
     * - Chart subtype
     * - Chart categories
     * - Chart colors
     * - Chart title
     *
     * @param v {object} A chart element from a DCP response
     * @return {undefined} No object is returned
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        if (v.el.chid === undefined) {
          return undefined;
        }

        var chartDCP = v.el,
          chartOptions = {
            series: []
          };

        // process the colors to use for this chart
        if (chartDCP.clrArr && chartDCP.clrArr.length > 0) {
          ChartsModel.colors = chartDCP.clrArr;
        } else {
          ChartsModel.colors = CommonConfig.DEFAULT_COLORS;
        }

        // process the title of this chart (if there is one)
        if (chartDCP.title !== undefined && chartDCP.title !== null) {
          chartOptions.title = {
            text: chartDCP.title.join('<br/>')
          };
        }

        // gviz displays vertical axis only for continous axes i.e. first
        // column should be a number/date.
        // core schema is defined to send categories as string and since we
        // are using categories as first column for charts we need to convert
        // to number before rendering charts.
        // If all values of categories are numbers then only categories can
        // be converted to numbers else we are leaving categories untouched.
        var convertCategoriesToNumber = function() {
          var categories = [];
          var numericCats = chartDCP.cats !== undefined;
          var catsLength = chartDCP.cats && chartDCP.cats.length;
          for(var i = 0; i < catsLength && numericCats; i++) {
            var category = +chartDCP.cats[i];
            numericCats = !_.isNaN(category);
            categories.push(category);
          }
          return numericCats ? categories : chartDCP.cats;
        };

        // cache the chart information
        ChartsModel[chartDCP.chid] = {
          data: [],
          options: chartOptions,
          type: chartDCP.type,
          subtype: chartDCP.subt,
          scattype: chartDCP.scatStyle,
          categories: convertCategoriesToNumber(),
          rendered: false
        };

        DcpModel.dcpHandlingChart = chartDCP.chid;
        DcpModel.dcpHandlingSeries = 0;
      }
      return undefined;
    },

    /**
     * Called after all of the child (i.e. series) elements of this chart have
     * been processed
     *
     * @param v {object} A chart element in a DCP response
     */
    postTraverse: function(/* v */) {
      DcpModel.dcpHandlingChart = undefined;
      DcpModel.dcpHandlingSeries = undefined;
    }
  };

  return _api;
});
