/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * simple bulleted list without any styling
 *
 * See qowt/comms/schema/bulletedList-schema.js
 *
 */
define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'bulletedList',

    'bulletedListElement': function(styles, ovrid) {
      var bllid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var _el = {
        etp: 'bls',
        eid: bllid,
        addChild: FIXTURES.addChild,
        setStyles: FIXTURES.setStyles,
        elm: []
      };
      _el.setStyles(styles);
      return _el;
    }

  };

});
