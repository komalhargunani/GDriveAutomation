/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/utils/search'
], function(
    SearchUtils) {

  'use strict';

  describe('binary search algo', function() {

    beforeEach(function() {});
    afterEach(function() {});

    it('should be able to find exact match (odd length array)', function() {
      var a = [2, 4, 7, 10, 56, 78, 99, 110, 200];
      var pos = SearchUtils.array.binSearch(a, 10);
      expect(pos).toBe(3);
    });

    it('should be able to find exact match (even length array)', function() {
      var a = [2, 4, 7, 10, 56, 78, 99, 110];
      var pos = SearchUtils.array.binSearch(a, 78);
      expect(pos).toBe(5);
    });

    it('should return -1 if exact match not found (even length array)',
       function() {
         var a = [2, 4, 7, 10, 56, 78, 99, 110];
         var pos = SearchUtils.array.binSearch(a, 66);
         expect(pos).toBe(-1);
       });

    it('should return -1 if exact match not found (odd length array)',
       function() {
         var a = [2, 4, 7, 10, 56, 78, 99, 110, 200];
         var pos = SearchUtils.array.binSearch(a, 66);
         expect(pos).toBe(-1);
       });

    it('should return -1 if exact match not found (zero length array)',
       function() {
         var a = [];
         var pos = SearchUtils.array.binSearch(a, 66);
         expect(pos).toBe(-1);
       });

    it('should return -1 if searching for lowest match on empty array',
       function() {
         var a = [];
         var pos = SearchUtils.array.binSearch(a, 66, 'low');
         expect(pos).toBe(-1);
       });

    it('should return -1 if searching for highest match on empty array',
       function() {
         var a = [];
         var pos = SearchUtils.array.binSearch(a, 66, 'high');
         expect(pos).toBe(-1);
       });

    it('should be able to find nearest low match (odd length array)',
       function() {
         var a = [2, 4, 7, 10, 56, 78, 99, 110, 200];
         var pos = SearchUtils.array.binSearch(a, 50, 'low');
         expect(pos).toBe(3);
       });

    it('should be able to find nearest high match (odd length array)',
       function() {
         var a = [2, 4, 7, 10, 56, 78, 99, 110, 200];
         var pos = SearchUtils.array.binSearch(a, 50, 'high');
         expect(pos).toBe(4);
       });

    it('should be able to find nearest low match (even length array)',
       function() {
         var a = [2, 4, 7, 10, 56, 78, 99, 110];
         var pos = SearchUtils.array.binSearch(a, 50, 'low');
         expect(pos).toBe(3);
       });

    it('should be able to find nearest high match (even length array)',
       function() {
         var a = [2, 4, 7, 10, 56, 78, 99, 110];
         var pos = SearchUtils.array.binSearch(a, 50, 'high');
         expect(pos).toBe(4);
       });

    it('should find the first element if searching for negative value in ' +
        'positive array with lowest match precision (even legth array)',
        function() {
          var a = [2, 4, 7, 10, 56, 78, 99, 110];
          var pos = SearchUtils.array.binSearch(a, -200, 'low');
          expect(pos).toBe(0);
        });

    it('should find the first element if searching for negative value in ' +
        'positive array with lowest match precision (odd legth array)',
        function() {
          var a = [2, 4, 7, 10, 56, 78, 99, 110, 200];
          var pos = SearchUtils.array.binSearch(a, -200, 'low');
          expect(pos).toBe(0);
        });

    it('should find the last element if searching for out of scope value in ' +
        'array with highest match precision (even legth array)', function() {
          var a = [2, 4, 7, 10, 56, 78, 99, 110];
          var pos = SearchUtils.array.binSearch(a, 10000, 'high');
          expect(pos).toBe(7);
        });

    it('should find the last element if searching for out of scope value in ' +
        'array with highest match precision (odd legth array)', function() {
          var a = [2, 4, 7, 10, 56, 78, 99, 110, 200];
          var pos = SearchUtils.array.binSearch(a, 10000, 'high');
          expect(pos).toBe(8);
        });

  });

  return {};
});
