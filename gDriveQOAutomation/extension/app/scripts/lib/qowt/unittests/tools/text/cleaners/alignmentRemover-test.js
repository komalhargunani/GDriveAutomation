/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test to ensure the text alignment cleaner removes
 * the CSS text-align property correctly.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/tools/text/mutations/cleaners/alignmentRemover'
], function(Cleaner) {

  'use strict';

  describe('textAlignment cleaner', function() {

    var styleTestCases = {
      'text-align:left;': '',
      'text-align:center;': '',
      'text-align:right;': '',
      'text-align:justify;': '',
      'text-align:inherit;': '',
      ' text-align: center ; ': '',
      'color:red;text-align:right;font-weight:bold;': 'color: red; ' +
          'font-weight: bold;'
    };

    it('should remove any text-align CSS value', function() {

      var cases = Object.keys(styleTestCases),
          caseNum, totalCases = cases.length,
          thisCase, thisExpected,
          testSpan;

      for (caseNum = 0; caseNum < totalCases; caseNum++) {
        thisCase = cases[caseNum];
        thisExpected = styleTestCases[thisCase];

        testSpan = document.createElement('span');
        testSpan.appendChild(document.createTextNode('hello'));
        testSpan.setAttribute('style', thisCase);

        Cleaner.__clean(testSpan);

        expect(testSpan.style.cssText).toBe(thisExpected);

        testSpan = undefined;
      }
    });

  });

  return {};

});
