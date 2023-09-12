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
 * Constructor for the Axis DCP Handler.
 * This handler processes a 'cax' (chart axis) element from a DCP response, in
 * its visit() method
 *
 * @constructor
 * @return {object} An Axis DCP handler
 */
define([
  'qowtRoot/models/charts',
  'qowtRoot/models/dcp'
], function(
    ChartsModel,
    DcpModel) {

  'use strict';

  var _api = {
    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this handler
     */
    etp: 'cax',

    /**
     * Processes a 'cax' (chart axis) element from a DCP response.
     * Caches information for this axis in QOWT.MODEL.Charts.
     *
     * The axis information that is cached may include:
     * <ul>
     * <li>Axis min and max value
     * <li>Axis major and minor units
     * </ul>
     *
     * @param {object} v  A chart axis element from a DCP response
     * @return {undefined} No object is returned
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        if ((DcpModel === undefined) ||
            (DcpModel.dcpHandlingChart === undefined)) {
          return undefined;
        }

        var axisDCP = v.el,
            axisOptions = {},
            pos = axisDCP.pos,
            min = axisDCP.miv,
            max = axisDCP.mjv,
            major = axisDCP.mju,
            gridLine = axisDCP.mjg;

        if (pos && (min || max || major || gridLine)) {
          axisOptions.min = min;
          axisOptions.max = max;
          axisOptions.major = major;
          axisOptions.showMajorGridline = gridLine;

          if (!ChartsModel[DcpModel.dcpHandlingChart].options.axes) {
            ChartsModel[DcpModel.dcpHandlingChart].options.axes = {};
          }

          if (pos === 'l' || pos === 'r') {
            ChartsModel[DcpModel.dcpHandlingChart].options.axes.yaxis =
                axisOptions;
          } else if (pos === 't' || pos === 'b') {
            ChartsModel[DcpModel.dcpHandlingChart].options.axes.xaxis =
                axisOptions;
          }
        }
      }
      return undefined;
    }

  };

  return _api;
});
