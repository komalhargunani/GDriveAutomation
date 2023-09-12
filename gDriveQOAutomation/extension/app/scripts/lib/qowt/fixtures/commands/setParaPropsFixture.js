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

    'id': 'setParaProps',

    /**
     * simple set paragraph properties command
     *
     */
    'setParaPropsCmd': function(alignment) {
      if(alignment !== "L" && alignment !== "R" && alignment !== "C" &&
        alignment !== "J") {
        alignment = "L";
      }
      FIXTURES.idCounter++;
      var req = {
        name: 'setParaProps',
        elm: [
          {
            etp: 'par',
            eid: FIXTURES.idCounter,
            jus: alignment
          }
        ]
      };
      return req;
    }

  };

});
