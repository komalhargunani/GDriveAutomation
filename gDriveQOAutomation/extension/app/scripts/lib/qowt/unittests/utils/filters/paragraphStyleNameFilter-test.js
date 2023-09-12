
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit Test module for the paragraphStyleNameFilter module.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/utils/filters/paragraphStyleNameFilter',
  'qowtRoot/utils/typeUtils'
], function(
    Filter,
    TypeUtils) {

  'use strict';

  describe('configs/buttonConfigs/wordStyleButton', function() {
    describe('Filter function', function() {
      it('should expose a filter function.', function() {
        expect(Filter.filter).toBeDefined();
        expect(TypeUtils.isFunction(Filter.filter)).toBe(true);
      });

      it('should honour the pre-defined slots and sort everything else ' +
          'alphabetically after that.', function() {
            var list = [
              'ZZZ',
              'alpha',
              'Beta',
              'Heading 3',
              'Heading 2',
              'Alpha',
              'Heading 1',
              'Normal'
            ];
            Filter.sort(list);
            expect(list[0]).toBe('Normal');
            expect(list[1]).toBe('Heading 1');
            expect(list[2]).toBe('Heading 2');
            expect(list[3]).toBe('Heading 3');
            expect(list[4]).toBe('Alpha');
            expect(list[5]).toBe('Beta');
            expect(list[6]).toBe('ZZZ');
            expect(list[7]).toBe('alpha');
          });
    });
  });
});
