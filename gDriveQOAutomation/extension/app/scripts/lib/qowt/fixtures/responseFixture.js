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

    'id': 'response',

    /**
     * DCP responses can either be of type 'update' (also used for insertNew),
     * or 'delete'
     *
     * See qowt/comms/schema/response-schema.js
     *
     */
    'response': function(type, name, id, finalResponse) {
      var kind;
      switch(type) {
        case 'delete':
          kind = 'D';
          break;
        case 'update':
        default:
          kind = 'U';
          break;
      }
      return {
        addChild: FIXTURES.addChild,
        knd: kind,
        id: id,
        name: name,
        end: finalResponse,
        elm: []
      };
    },

    'failedResponse': function(type, name, id, error) {
      var kind;
      switch(type) {
        case 'delete':
          kind = 'D';
          break;
        case 'update':
        default:
          kind = 'U';
          break;
      }
      return {
        addChild: FIXTURES.addChild,
        knd: kind,
        id: id,
        name: name,
        e: error
      };
    },

    'createNewWorkbookResponse': function(id, sheetNames, fontNames) {
      var response = {
        addChild: FIXTURES.addChild,
        id: id,
        name: 'createNewWkbk',
        docId: 3,
        ro: false,
        sn: sheetNames
      };
      if(fontNames) {
        response.fn = fontNames;
      }
      return response;
    }

  };

});
