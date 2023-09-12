/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
/*
 * Unit tests for POINT utils.js
 */

define([
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(UnitConversionUtils) {

  'use strict';


  describe('Point utils', function() {

    describe('Emu to Point Conversion', function() {

      it('should convert correctly from EMU to point unit', function() {
        expect(UnitConversionUtils.convertEmuToPoint(914400)).toEqual(72);
      });

      it('should return undefined if EMU is undefined', function() {
        expect(UnitConversionUtils.convertEmuToPoint(undefined)).
            toEqual(undefined);
      });

      it('should return zero if EMU is zero', function() {
        expect(UnitConversionUtils.convertEmuToPoint(0)).toEqual(0);
      });

    });

    describe('Emu to Pixel Conversion', function() {

      it('should convert correctly from EMU to pixel unit', function() {
        expect(UnitConversionUtils.convertEmuToPixel(914400)).toEqual(96);
      });

      it('should return undefined if EMU is undefined', function() {
        expect(UnitConversionUtils.convertEmuToPixel(undefined)).
            toEqual(undefined);
      });

      it('should return zero if EMU is zero', function() {
        expect(UnitConversionUtils.convertEmuToPixel(0)).toEqual(0);
      });

    });

    describe('Pixel to Emu Conversion', function() {

      it('should convert correctly from pixel to EMU unit', function() {
        expect(UnitConversionUtils.convertPixelToEmu(96)).toEqual(914400);
      });

      it('should return undefined if pixel is undefined', function() {
        expect(UnitConversionUtils.convertPixelToEmu(undefined)).
            toEqual(undefined);
      });

      it('should return zero if pixel is zero', function() {
        expect(UnitConversionUtils.convertPixelToEmu(0)).toEqual(0);
      });

    });

    describe('should validate STPercentage To CSSPercent Conversion',
        function() {

          it('should convert correctly from STPercentage Simple value ' +
              'To CSSPercent', function() {
                expect(UnitConversionUtils.
                    convertSTPercentageToCSSPercent('30%')).toEqual('30%');
              });

          it('should convert correctly from STPercentage Decimal value ' +
              'To CSSPercent', function() {
                expect(UnitConversionUtils.
                    convertSTPercentageToCSSPercent(30000)).toEqual('30%');
              });

          it('should return undefined if STPercentage is undefined',
              function() {
                expect(UnitConversionUtils.convertSTPercentageToCSSPercent(
                    undefined)).toEqual(undefined);
              });

          it('should return zero if STPercentage is zero', function() {
            expect(UnitConversionUtils.convertSTPercentageToCSSPercent(0)).
                toEqual(undefined);
          });

        });

    describe('should compute spacing percentage value', function() {
      it('should return 0 when both font-size and spacingPercent are 0',
         function() {
           expect(UnitConversionUtils.computePercentSpacing(0, 0)).
               toEqual(0);
         });

      it('should return 9 when both font-size is 3 and spacingPercent ' +
          'are 300%', function() {
            expect(UnitConversionUtils.computePercentSpacing(3, 300)).
                toEqual(9);
          });

      it('should return 0 when both font-size is 3 and spacingPercent are 0%',
         function() {
           expect(UnitConversionUtils.computePercentSpacing(3, 0)).
               toEqual(0);
         });

      it('should return 0 when both font-size is 0 and spacingPercent ' +
          'are 300%', function() {
            expect(UnitConversionUtils.computePercentSpacing(0, 300)).
                toEqual(0);
          });
    });

  });
});
