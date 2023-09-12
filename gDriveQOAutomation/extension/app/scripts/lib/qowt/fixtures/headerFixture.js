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

    'id': 'header',

    'headerElement': function(ovrid) {
      var headid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var el = {
        'etp':'hdr',
        'eid':headid,
        'dfp':false,
        'addChild': FIXTURES.addChild,
        'setStyles': FIXTURES.setStyles,
        'elm': []
      };
      return el;
    }

  };

});
