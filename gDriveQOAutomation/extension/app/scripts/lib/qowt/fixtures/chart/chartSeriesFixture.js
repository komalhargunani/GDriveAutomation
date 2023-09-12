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

    'id': 'chartSeries',

    'seriesWithoutMarkers': function() {
      return {
        label: "North",
        etp: "csr"
      };
    },

    'seriesWithoutLabel': function() {
      return {
        etp: "csr"
      };
    },

    'seriesWithDiamondMarker': function() {
      return {
        label: "South",
        marker: { sym: "dia", clr: "#123456", size: "1" },
        etp: "csr"
      };
    },

    'seriesWithSquareMarker': function() {
      return {
        label: "South",
        marker: { sym: "squ", clr: "#123456", size: "2" },
        etp: "csr"
      };
    },

    'seriesWithXMarker': function() {
      return {
        label: "South",
        marker: { sym: "x", clr: "#123456", size: "3" },
        etp: "csr"
      };
    },

    'seriesWithCircMarker': function() {
      return {
        label: "South",
        marker: { sym: "circ", clr: "#123456", size: "4" },
        etp: "csr"
      };
    },

    'seriesWithPlusMarker': function() {
      return {
        label: "South",
        marker: { sym: "plus", clr: "#123456", size: "5" },
        etp: "csr"
      };
    },

    'seriesWithDashMarker': function() {
      return {
        label: "South",
        marker: { sym: "dash", clr: "#123456", size: "6" },
        etp: "csr"
      };
    },

    'seriesWithTriangleMarker': function() {
      return {
        label: "South",
        marker: { sym: "tri", clr: "#123456", size: "7" },
        etp: "csr"
      };
    },

    'seriesWithStarMarker': function() {
      return {
        label: "South",
        marker: { sym: "star", clr: "#123456", size: "8" },
        etp: "csr"
      };
    },

    'seriesWithDotMarker': function() {
      return {
        label: "South",
        marker: { sym: "dot", clr: "#123456", size: "9" },
        etp: "csr"
      };
    },

    'seriesWithAutoMarker': function() {
      return {
        label: "South",
        marker: { sym: "auto", clr: "#123456", size: "10" },
        etp: "csr"
      };
    },

    'seriesWithPictMarker': function() {
      return {
        label: "South",
        marker: { sym: "pict", clr: "#123456", size: "11" },
        etp: "csr"
      };
    }

  };

});
