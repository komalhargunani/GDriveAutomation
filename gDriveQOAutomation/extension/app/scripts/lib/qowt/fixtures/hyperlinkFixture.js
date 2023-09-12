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

    'id': 'hyperlink',

    /**
     * Fixtures for hyperlinks
     * See qowt/comms/schema/hyperlink-schema.js
     */

    /**
     * Produces a simple hyperlink
     * @param lnk {String}
     */
    'link': function(lnk) {
      FIXTURES.idCounter++;
      var el = {
        'addChild': FIXTURES.addChild,
        'etp':      'hlk',
        'eid':      FIXTURES.idCounter,
        'elm':      [],
        'lnk':      lnk
      };
      return el;
    },

    /**
     * Produces an anchor
     * @param nam {String}
     */
    'anchor': function(nam) {
      FIXTURES.idCounter++;
      var el = {
        'addChild': FIXTURES.addChild,
        'etp':      'hlk',
        'eid':      FIXTURES.idCounter,
        'elm':      [],
        'nam':      nam
      };
      return el;
    },

    /**
     * Produces a full hyperlink with href and name
     * @param lnk {String}
     * @param nam {String}
     */
    'hyperlink': function(lnk, nam) {
      FIXTURES.idCounter++;
      var el = {
        'addChild': FIXTURES.addChild,
        'etp':      'hlk',
        'eid':      FIXTURES.idCounter,
        'elm':      [],
        'lnk':      lnk,
        'nam':      nam
      };
      return el;
    }

  };

});
