/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Constructor for the Series DCP Handler.
 * This handler processes a 'csr' (chart series) element from a DCP response,
 * in its visit() method
 *
 * @constructor
 * @return {object} A Series DCP handler
 */
define([
    'qowtRoot/utils/charts/chartUtils',
    'qowtRoot/models/charts',
    'qowtRoot/models/dcp'
    ],
    function(ChartUtils, ChartsModel, DcpModel) {

  'use strict';

  var markerNone_ = 'none';

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'csr',

    /**
     * Processes a 'csr' (chart series) element from a DCP response.
     * Caches information for this series in ChartsModel.
     *
     * The series information that is cached may include:
     * - Series label
     * - Series marker description
     * - Series data point array (which is empty for now)
     *
     * @param v {object} A chart series element from a DCP response
     * @return {undefined} No object is returned
     */
    visit : function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        if ((ChartsModel === undefined) ||
            (DcpModel.dcpHandlingChart === undefined) ||
            (DcpModel.dcpHandlingSeries === undefined)) {
          return undefined;
        }

        var seriesDCP = v.el,
            seriesOptions = {},
            label = seriesDCP.label,
            marker = seriesDCP.marker;

        // process the label of this series (if there is one)
        if (label && label.length > 0) {
            seriesOptions.label = label;
        }

        // process the marker for this series (if there is one)
        if (marker && marker.size && marker.sym !== markerNone_) {

          seriesOptions.markerOptions = {};
          ChartUtils.setMarkerVisibility(true, seriesOptions);
          ChartUtils.setMarkerSize(marker.size, seriesOptions);
        }

        // cache the series information
        if(ChartsModel[DcpModel.dcpHandlingChart].options.series !== undefined)
        {
            ChartsModel[DcpModel.dcpHandlingChart].options.
              series[DcpModel.dcpHandlingSeries] = seriesOptions;
        }

        // cache an empty data point array for this series
        if(ChartsModel[DcpModel.dcpHandlingChart].data !== undefined) {
            ChartsModel[DcpModel.dcpHandlingChart].
              data[DcpModel.dcpHandlingSeries] = [];
        }
      }
      return undefined;
    },

    /**
     * Called after all of the child (i.e. datapoint) elements of this series
     * have been processed
     *
     * @param v {object} A series element in a DCP response
     */
    postTraverse : function(/* v */){
      if(DcpModel.dcpHandlingSeries !== undefined) {
        DcpModel.dcpHandlingSeries++;
      }
    }
  };

    return _api;
});
