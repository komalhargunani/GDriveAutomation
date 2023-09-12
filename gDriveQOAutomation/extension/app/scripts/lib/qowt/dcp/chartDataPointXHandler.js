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
 * Constructor for the Chart Data Point X DCP Handler.
 *
 * This handler processes a 'dpX' (data point X) element from a DCP response,
 * in its visit() method.
 * A 'X' data point appears in a series in a chart, where the data point value
 * applies to the X axis of the chart, for example, in a BAR chart.
 *
 * @constructor
 * @return {object} A Chart Data Point X DCP handler
 */
 define([
     'qowtRoot/dcp/chartDataPointYHandler'
     ],
     function(ChartDataPointYHandler) {

  'use strict';



    var _api;

    _api = {

        /**
         * DCP Type Code
         * This is used by the DCP Manager to register this handler
         */
        etp: 'dpX',

        /**
         * Processes a 'dpX' (data point X) element from a DCP response.
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
                // lorrainemartin TODO: The X data point can be stored in
                // exactly the same way in the QOWT Charts model as a Y data
                // point, so we just use the Y data point dcp handler here to
                // store it.
                // Note that we should just remove this X data point dcp handler
                // and simply use the Y data point dcp handler for both X and Y
                // data points (and rename it 'one axis value' dcp handler)
                v.el.etp = 'dpY';
                v.el.y = v.el.x;
                return ChartDataPointYHandler.visit(v);
            }

            return undefined;
        }
    };

    return _api;
});
