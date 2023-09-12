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

    'id': 'nestedCharRun',

    /**
     * Nested characture runs are 'nested' inside their parent (aka paragraphs
     * or table cells etc) They support the various text formatting features
     * text has.
     *
     * See qowt/comms/schema/nestedCharRun-schema.js
     *
     */

    /**
     * Produces a simple (optional formatting) character run of lorem ipsum text
     * at the specified length. If you pass in a string, it will use that for
     * the nested character run.
     */
    'nestedCharRun': function(len, styles, ovrid) {
      var chrid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var d;
      if(len === undefined) {
        len = FIXTURES.lorem.length;
      }
      if(typeof(len) === 'string') {
        d = len;
      } else {
        d = FIXTURES.lorem.substr(0, Math.min(len, FIXTURES.lorem.length));
      }
      var _el = {
        etp: 'ncr',
        eid: chrid,
        addChild: FIXTURES.addChild,
        setStyles: FIXTURES.setStyles,
        data: d
      };
      _el.setStyles(styles);
      return _el;
    },

    /**
     * Produces a single, random word with optional formatting the word is not
     * strictly random. We use the idCounter modulo the lenght of the ipsum
     * array. This way we get the same results each time, which is useful for
     * when you run repeated tests, like when using selenium optional boolean
     * spc parameter determines if a space is added after the word
     */
    'singleWordNestedCharRun': function(styles, spc, ovrid) {
      var chrid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var el = {
        etp: 'ncr',
        eid: chrid,
        addChild: FIXTURES.addChild,
        setStyles: FIXTURES.setStyles,
        data: FIXTURES.ipsum[FIXTURES.idCounter % FIXTURES.ipsum.length]
      };
      if(spc) {
        el.data += ' ';
      }
      el.setStyles(styles);
      return el;
    }

  };

});
