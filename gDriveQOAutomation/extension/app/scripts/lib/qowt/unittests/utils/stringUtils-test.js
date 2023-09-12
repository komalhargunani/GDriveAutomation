// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/utils/stringUtils'
], function(
    StringUtils) {

  'use strict';

  describe('StringUtils', function() {

    beforeEach(function() {
    });
    afterEach(function() {
    });

    it('should be able to wrap a string in double quotes', function() {
      expect(StringUtils.doubleQuote('hello')).toBe('"hello"');
    });

    it("should not add double quote to the start of a string if it's already " +
        'there', function() {
          expect(StringUtils.doubleQuote('"hello')).toBe('"hello"');
        });

    it("should not add double quote to the end of a string if it's already " +
        'there', function() {
          expect(StringUtils.doubleQuote('hello"')).toBe('"hello"');
        });


    it('should remove non-css-friendly character', function() {
      expect(StringUtils.cssFriendly('he-%$llo')).toBe('hello');
    });

    it('should increase offset by 1 for each astral symbol', function() {
      expect(StringUtils.astralCorrections('a😀b😁c😂d', 7)).toBe(10);
    });

    it('should not increase offset for normal characters', function() {
      expect(StringUtils.astralCorrections('abcdefg', 7)).toBe(7);
    });

  });

  return {};
});
