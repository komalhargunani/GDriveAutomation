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

    'id': 'section',

    /**
     * Sections can be landscape or portrait, and contain column count
     * information.
     *
     * See qowt/comms/schema/section-schema.js
     * @param {object} config Valid section DCP object. All member data is
     * optional and will assume default values if not supplied.
     */
    'sectionElement': function (config) {
      config = config || {};
      var el = {
        addChild: FIXTURES.addChild,
        etp: 'sct',
        elm: []
      };
      if(config.id && typeof config.id === 'string') {
        el.eid = config.id;
      } else {
        FIXTURES.idCounter++;
        el.eid = FIXTURES.idCounter;
      }
      if(config.col && typeof config.col === 'number') {
        el.col = config.col;
      }
      if(config.bkc && typeof config.bkc === 'string') {
        el.bkc = config.bkc;
      }
      if(config.width && typeof config.width === 'number') {
        el.width = config.width;
      }
      if(config.height && typeof config.height === 'number') {
        el.height = config.height;
      }
      if(config.mgt && typeof config.mgt === 'string') {
        el.mgt = config.mgt;
      }
      if(config.mgr && typeof config.mgr === 'string') {
        el.mgr = config.mgr;
      }
      if(config.mgb && typeof config.mgb === 'string') {
        el.mgb = config.mgb;
      }
      if(config.mgl && typeof config.mgl === 'string') {
        el.mgl = config.mgl;
      }
      switch(config.otn) {
        case 'L':
          el.otn = 'L';
          break;
        case 'P':
        default:
          el.otn = 'P';
          break;
      }
      return el;
    }

  };

});
