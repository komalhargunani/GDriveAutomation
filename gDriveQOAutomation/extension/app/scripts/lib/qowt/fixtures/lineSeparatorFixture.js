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

    'id': 'lineSeparator',

    'lsepElement': function(ovrid) {
      var eopid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var _el = {
        'etp': 'lsep',
        'eid': eopid,
        'addChild': FIXTURES.addChild
      };
      return _el;
    }

  };

});
