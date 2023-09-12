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

    'id': 'openWorkBookResponse',

    'openWorkBookResponse': function() {
      return {
        addChild: FIXTURES.addChild,
        id:"1000",
        name:"owb",
        el: []
      };
    },

    'openWorkBookResponseElement': function(path, sheetNames, asi) {
      return {
        addChild: FIXTURES.addChild,
        etp:"owb",
        pa:path,
        asi:asi,
        sn:sheetNames,
        name: 'openWorkBook',
        fn:[],
        docId: 3,
        ro: false
      };
    }

  };

});
