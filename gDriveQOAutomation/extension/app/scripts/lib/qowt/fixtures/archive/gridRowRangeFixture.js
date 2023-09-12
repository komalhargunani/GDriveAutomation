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

    'id': 'gridRowRange',

    /**
     * simple grid row range element.
     *
     * See qowt/comms/schema/elements/gridRowRange-schema.json
     *
     */
    'gridRowRangeElement': function(firstRowIndex, lastRowIndex, dummyRow,
                                    minSegmentIdx, maxSegmentIdx) {
      if(firstRowIndex===undefined || lastRowIndex===undefined) {
        throw new Error("FIXTURES.gridRowRangeElement missing mandatory parameters");
      }
      var el = {
        etp: 'grr',
        addChild: FIXTURES.addChild,
        elm: [],
        rg: {
          si: 0,
          r1: firstRowIndex,
          r2: lastRowIndex
        },
        dummyRow: dummyRow,
        segmentMinIdx: minSegmentIdx,
        segmentMaxIdx: maxSegmentIdx
      };
      return el;
    },

    'gridRowEmptyRangeElement': function(firstRowIndex, lastRowIndex, dummyRow,
                                         minSegmentIdx, maxSegmentIdx) {
      if(firstRowIndex===undefined || lastRowIndex===undefined) {
        throw new Error("FIXTURES.gridRowRangeElement missing mandatory parameters");
      }
      var el = {
        etp: 'grr',
        addChild: FIXTURES.addChild,
        rg: {
          si: 0,
          r1: firstRowIndex,
          r2: lastRowIndex
        },
        dummyRow: dummyRow,
        segmentMinIdx: minSegmentIdx,
        segmentMaxIdx: maxSegmentIdx
      };
      return el;
    }

  };

});
