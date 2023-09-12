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

    'id': 'axis',

    'axisWithoutMinMaxPos': function() {
      return {
        etp: "cax"
      };
    },

    'axisWithMinMax': function() {
      return {
        etp: "cax",
        miv: "12",
        mjv: "97"
      };
    },

    'axisWithPosWithoutMinMax': function() {
      return {
        etp: "cax",
        pos: "t"
      };
    },

    'axisWithPosMin': function() {
      return {
        etp: "cax",
        miv: "12",
        pos: "r"
      };
    },

    'axisWithPosMax': function() {
      return {
        etp: "cax",
        mjv: "65",
        pos: "l"
      };
    },

    'axisWithPosNegMin': function() {
      return {
        etp: "cax",
        miv: "-65",
        pos: "l"
      };
    },

    'axisWithPosLMinMax': function() {
      return {
        etp: "cax",
        miv: "35",
        mjv: "90",
        pos: "l"
      };
    },

    'axisWithPosRMinMax': function() {
      return {
        etp: "cax",
        miv: "21",
        mjv: "87",
        pos: "r"
      };
    },

    'axisWithPosTMinMax': function() {
      return {
        etp: "cax",
        miv: "25",
        mjv: "99",
        pos: "t"
      };
    },

    'axisWithPosBMinMax': function() {
      return {
        etp: "cax",
        miv: "23",
        mjv: "76",
        pos: "b"
      };
    },

    'axisWithMinMaxIncorrectPos': function() {
      return {
        etp: "cax",
        miv: "3",
        mjv: "20",
        pos: "x"
      };
    },

    'axisWithMajorUnitNoPos': function() {
      return {
        etp: "cax",
        mju: "5"
      };
    },

    'axisWithPosMajorUnit': function() {
      return {
        etp: "cax",
        pos: "b",
        mju: "10"
      };
    },

    'axisWithMajorGridLinesForXaxis': function() {
      return {
        etp: "cax",
        pos: "b",
        mju: "10",
        mjg: true
      };
    },

    'axisWithMajorGridLinesForYaxis': function() {
      return {
        etp: "cax",
        pos: "r",
        mju: "10",
        mjg: true
      };
    }

  };

});
