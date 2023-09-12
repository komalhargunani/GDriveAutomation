// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a GetWorkbookInformation response fixture
 *
 * @author anchals@google.com (Anchal Sharma)
 */


define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'getWorkbookInformationResponse',

    'getWorkbookInformationResponse': function(err) {
      var response = {
        addChild: FIXTURES.addChild,
        id:"1000", //using same id as gsi
        name:"gwi",
        elm: []
      };
      if(err !== undefined) {
        response.e = err;
      } else {
        response.e = [];
      }
      return response;
    },

    'getWorkbookInformationResponseElement': function(searr) {
      var res = {
        addChild: FIXTURES.addChild,
        etp:"gwi",
       se:searr
      };

      return res;
    },
  };

});
