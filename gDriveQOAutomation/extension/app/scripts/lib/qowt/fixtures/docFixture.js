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
 * Document element contains properties of the document. At the moment we only
 * support the author name in this fixture. Although the handlers dont even use
 * that. It's merely to be used as an example
 *
 * See qowt/comms/schema/document-schema.js
 *
 */
define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'doc',

    'docElement': function(author) {
      var el = {
        addChild: FIXTURES.addChild,
        etp: 'doc',
        eid: 'qowt-msdoc',
        elm: []
      };
      if(author) {
        el.atr = author;
      }
      return el;
    }

  };

});
