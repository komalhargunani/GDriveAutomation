/**
 * Unit Tests for presentation CSS managers
 */


define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/dcp/pointHandlers/util/cssManagers/presentation'
], function(UnitConversionUtils, CssManagerPresentation) {

  'use strict';

  describe('Presentation module under CSSMAnager folder', function() {
    var presentationCSSManager = CssManagerPresentation;

    it('should return correct value when slide width is 10', function() {
      presentationCSSManager.createSlideSize(10, 20);
      var retValue = presentationCSSManager.getAdjustedMarginValueForAlign();
      var expectedValue = (UnitConversionUtils.convertEmuToPoint(10) * -10);

      expect(retValue).toEqual(expectedValue);
    });

    it('should return correct value when slide width is -10', function() {
      presentationCSSManager.createSlideSize(-10, 20);
      var retValue = presentationCSSManager.getAdjustedMarginValueForAlign();
      var expectedValue = (UnitConversionUtils.convertEmuToPoint(10) * 10);

      expect(retValue).toEqual(expectedValue);
    });

    it('should return correct value when slide width is 0', function() {
      presentationCSSManager.createSlideSize(0, 20);
      var retValue = presentationCSSManager.getAdjustedMarginValueForAlign();
      var expectedValue = 0;

      expect(retValue).toEqual(expectedValue);
    });

    it('should return correct value when slide width is undefined', function() {
      presentationCSSManager.createSlideSize(undefined, 20);
      var retValue = presentationCSSManager.getAdjustedMarginValueForAlign();
      var expectedValue = 0;

      expect(retValue).toEqual(expectedValue);
    });

  });
});
