/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([], function() {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'chartDataPoints',

    'dataPointX': function(xVal) {
      if(xVal === undefined) {
        xVal = 27;
      }
      var el = {
        etp: "dpX",
        x: xVal
      };
      return el;
    },

    'dataPointY': function(yVal) {
      if(yVal === undefined) {
        yVal = 85;
      }
      var el = {
        etp: "dpY",
        y: yVal
      };
      return el;
    },

    'dataPointXY': function(xVal, yVal) {
      if(xVal === undefined) {
        xVal = 73;
      }
      if(yVal === undefined) {
        yVal = 24;
      }
      var el = {
        etp: "dpXY",
        x: xVal,
        y: yVal
      };
      return el;
    },

    'dataPointV': function(val, label) {
      if(val === undefined) {
        val = 19;
      }
      var el = {
        etp: "dpV",
        val: val,
        label: label
      };
      return el;
    }

  };

});
