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

    'id': 'sheetChartElement',

    'sheetChartElement': function(index) {
      return {
        addChild: FIXTURES.addChild,
        etp: 'sch',
        elm: [
          {
            ancr: {
              type: 'two',
              to: {
                ri: 5,
                ci: 4,
                xo: 15000,
                yo: 21000
              },
              frm: {
                ri: 1,
                ci: 2,
                xo: 50000,
                yo: 20000
              }
            }
          }
        ],
        chid: 'chart' + (index || 0)
      };
    }

  };

});
