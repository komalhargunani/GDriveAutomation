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

    'id': 'sheetCellElement',

    'sheetCellElement': function(index, text, editText, leftNeighbour,
        rightNeighbour, formatting) {

      return {
        addChild: FIXTURES.addChild,
        etp:"scl",
        ci: (index || 0),
        x: text,
        xe: editText,
        ln: leftNeighbour,
        rn: rightNeighbour,
        fm: formatting
      };
    }

  };

});
