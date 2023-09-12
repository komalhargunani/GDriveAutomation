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

    'id': 'dodgyElement',

    /**
     * Random element which should be ignored by handlers and not cause things
     * to fall over
     */
    'foobarElement': function () {
      FIXTURES.idCounter++;
      return {
        etp: 'foobar',
        eid: FIXTURES.idCounter,
        addChild: FIXTURES.addChild,
        data: 'my mother'
      };
    },

    /**
     * Empty element, again this should not cause anything to fall over
     */
    'emptyElement': function () {
      return {};
    },

    /**
     * Corrupt element; it might be better to have this be binary data or
     * something, but for now just having a non "key-value" object, aka a random
     * string, will do
     */
    'corruptElement': function () {
      return "#$TRGWG$#%VRwtgwrg445";
    }

  };

});
