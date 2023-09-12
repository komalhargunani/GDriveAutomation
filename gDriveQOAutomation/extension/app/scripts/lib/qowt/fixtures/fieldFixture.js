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

    'id': 'field',

    /**
     * See qowt/comms/schema/field-schema.js
     */
    'fieldElement': function() {
      FIXTURES.idCounter++;
      var el = {
        addChild: FIXTURES.addChild,
        etp: 'fld',
        eid: FIXTURES.idCounter,
        type: "DATE",
        format: "dd/MMMM/yyyy",
        elm: [
          {
            "etp": "ncr",
            "eid": "CHAR1",
            "data": "15/May/2012"
          }
        ]
      };
      return el;
    }

  };

});
