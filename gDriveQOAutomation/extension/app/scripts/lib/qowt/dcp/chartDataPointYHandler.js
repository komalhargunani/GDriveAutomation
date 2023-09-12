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
 * Constructor for the Chart Data Point Y DCP Handler.
 *
 * This handler processes a 'dpY' (data point Y) element from a DCP response,
 * in its visit() method.
 * A 'Y' data point appears in a series in a chart, where the data point value
 * applies to the Y axis of the chart, for example, in a LINE chart or COLUMN
 * chart.
 *
 * @constructor
 * @return {object} A Chart Data Point Y DCP handler
 */
 define([
     'qowtRoot/models/charts',
     'qowtRoot/models/dcp'
     ],
     function(ChartsModel, DcpModel) {

  'use strict';



    var _api;

    _api = {

        /**
         * DCP Type Code
         * This is used by the DCP Manager to register this handler
         */
        etp: 'dpY',

        /**
         * Processes a 'dpY' (data point Y) element from a DCP response.
         * Caches information for this data point in ChartsModel.
         *
         * The data point information that is cached may include:
         * - Data point number (i.e. where it appears in relation to the other
         *   data points in this series, starting at 1)
         * - Data point value
         *
         * @param v {object} A data point element from a DCP response
         * @return {undefined} No object is returned
         */
        visit : function(v) {
            if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

                var dpY = v.el.y;

                if((ChartsModel === undefined) ||
                   (DcpModel.dcpHandlingChart === undefined) ||
                   (DcpModel.dcpHandlingSeries === undefined) ||
                   (dpY === undefined)) {
                    return undefined;
                }

                var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
                if (targetChart !== undefined) {

                    var chartData = targetChart.data;
                    if(chartData !== undefined) {

                        var targetSeries =
                            chartData[DcpModel.dcpHandlingSeries];
                        if(targetSeries !== undefined) {

                            // add this data point to the target series in the
                            // target chart
                            var nextIdx = targetSeries.length;
                            targetSeries[nextIdx] = [nextIdx + 1, dpY];
                        }
                    }
                }
            }

            return undefined;
        }
    };

    return _api;
});
