/**
 * PresetColorMap test cases
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/drawing/color/presetColorMap'
], function(PresetColorMap) {

  'use strict';

  var _presetColorMap = PresetColorMap;

  describe('Preset Color Map Test', function() {

    it('should get undefined if color name is undefined', function() {
      var expectedRGBValue = _presetColorMap.getRgbEquivalentPresetColor(
          undefined);
      expect(expectedRGBValue).toEqual(undefined);
    });

    it('should get undefined if color name is not available in map',
        function() {
          var expectedRGBValue = _presetColorMap.getRgbEquivalentPresetColor(
              'xyz');
          expect(expectedRGBValue).toEqual(undefined);
        });

    it('should get correct RGB value for color name black', function() {
      var expectedRGBValue = _presetColorMap.getRgbEquivalentPresetColor(
          'black');
      expect(expectedRGBValue).toEqual([0, 0, 0]);
    });

    it('should get correct RGB value n number of times for color name black',
        function() {
          var expectedRGBValue1 = _presetColorMap.getRgbEquivalentPresetColor(
              'black');
          expect(expectedRGBValue1).toEqual([0, 0, 0]);

          var expectedRGBValue2 = _presetColorMap.getRgbEquivalentPresetColor(
              'black');
          expect(expectedRGBValue2).toEqual(expectedRGBValue1);
        });

  });
});
