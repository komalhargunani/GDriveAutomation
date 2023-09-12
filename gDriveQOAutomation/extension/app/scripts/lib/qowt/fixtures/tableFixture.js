/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/fixtures/fixtureBase',
  'qowtRoot/fixtures/nestedCharRunFixture'
], function(
  FIXTURES,
  FixNestedCharRun
) {

  'use strict';

  var x = arguments.length;


  var _api = {

    'id': 'table',

    /**
     * Produces a table cell DCP element with optional styling argument
     *
     * styles argument is key-value pair, based on the schema
     *
     * See qowt/comms/schema/cell-schema.js for details on supported styles
     */
    'cellElement': function(styles, ovrid) {
      var celid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var el = {
        etp: 'cll',
        eid: celid,
        addChild: FIXTURES.addChild,
        elm: []
      };
      if(styles) {
        for(var st in styles) {
          el[st] = styles[st];
        }
      }
      return el;
    },

     /**
      * Produces a table row DCP element with optional styling argument
      *
      * styles argument is key-value pair, based on the schema
      *
      * See qowt/comms/schema/row-schema.js for details on supported styles
      */
    'rowElement': function(styles, ovrid) {
      var trid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var el = {
        etp: 'row',
        eid: trid,
        addChild: FIXTURES.addChild,
        elm: []
      };
      if(styles) {
        for(var st in styles) {
          el[st] = styles[st];
        }
      }
      return el;
    },

    /**
     * Produces a table row group DCP element without any styling
     */
    'rowGroupElement': function() {
      FIXTURES.idCounter++;
      var el = {
        etp: 'rgr',
        eid: FIXTURES.idCounter,
        addChild: FIXTURES.addChild,
        elm: []
      };
      return el;
    },

    /**
     * Produces a table col group without any styling
     * it will generate 'count' number of colums, with their width ranging
     * randomly between 'minWidth' and 'maxWidth'
     * If maxWidth is not given, then all columns will use minWidth
     */
    'colGroupElement': function(count, minWidth, maxWidth) {
      FIXTURES.idCounter++;
      if(minWidth === undefined) {
        minWidth = 150;
      }
      if(maxWidth === undefined) {
        maxWidth = minWidth;
      }
      var el = {
        etp: 'cgr',
        eid: FIXTURES.idCounter,
        addChild: FIXTURES.addChild,
        data: []
      };
      for(var i=count; i>0; i--) {
        // produce a random width between minWidth and maxWidth
        var randomWidth =
          minWidth + Math.floor(Math.random()*(maxWidth-minWidth));
        el.data.push(randomWidth);
      }
      return el;
    },

    /**
     * Produces a simple table element without any styling
     */
    'simpleTableElement': function(ovrid) {
      var tabid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var el = {
        etp: 'tbl',
        eid: tabid,
        addChild: FIXTURES.addChild,
        elm: []
      };
      return el;
    },

    /**
     * Produces a table element without 'rcount' rows, and 'ccount' columns.
     * The table has no particular styling; if you want styling,
     * useSimpleTableElement fixture and daisy chain your own colGroup,
     * rowGroup, rows and cells
     */
    'tableElement': function(ccount, rcount, colWidth) {
      FIXTURES.idCounter++;
      var el = {
        etp: 'tbl',
        eid: FIXTURES.idCounter,
        addChild: FIXTURES.addChild,
        elm: []
      };
      el.addChild(_api.colGroupElement(ccount, colWidth));
      var rg = _api.rowGroupElement();
      for(var r=0; r<rcount; r++) {
        var rw = _api.rowElement();
        for(var c=0; c<ccount; c++) {
          /*jsl:ignore*/
          rw.addChild(_api.cellElement()
            .addChild(FixNestedCharRun.singleWordNestedCharRun()));
          /*jsl:end*/
        }
        rg.addChild(rw);
      }
      el.addChild(rg);
      return el;
    }

  };

  return _api;

});
