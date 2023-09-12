/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'getSheetInformationResponse',

    'getSheetInformationResponse': function(err) {
      var response = {
        addChild: FIXTURES.addChild,
        id:"1000",
        name:"gsi",
        elm: []
      };
      if(err !== undefined) {
        response.e = err;
      } else {
        response.e = [];
      }
      return response;
    },

    'getSheetInformationResponseElement': function(numRows, numCols, defaults, sparseCols, frozenRowIdx, frozenColIdx, activeRowIdx, activeCellIdx, isChartSheet) {
      var res = {
        addChild: FIXTURES.addChild,
        etp:"gsi",
        cc: numCols,
        rc: numRows,
        ari: activeRowIdx?activeRowIdx:0,
        aci: activeCellIdx?activeCellIdx:0,
        df: defaults,
        sc: sparseCols,
        fp: {ri:frozenRowIdx, ci:frozenColIdx}
      };

      if(isChartSheet) {
        res.cs = true;
      }

      return res;
    },

    'getNoGridLinesElement': function() {
      var response = {
        el: {
          "aci":0,
          "ari":15,
          "cc":26,
          "df":{
            "cw":63,
            "fm":{
              "fi":0,
              "fs":10,
              "ha":"l",
              "va":"b"
            },
            "rh":13
          },
          "etp":"gsi",
          "rc":1000,
          "sn":"Sheet1",
          "hgl":true
        }
      };
      return response;
    },

    'getDefaultGridLinesElement': function() {
      var response = {
        el:{
          "aci":0,
          "ari":15,
          "cc":26,
          "df":{
            "cw":63,
            "fm":{
              "fi":0,
              "fs":10,
              "ha":"l",
              "va":"b"
            },
            "rh":13
          },
          "etp":"gsi",
          "rc":1000,
          "sn":"Sheet1"
        }
      };
      return response;
    }

  };

});
