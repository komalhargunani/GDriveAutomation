/*
 * Unit tests for POINT - Text Spacing handler
 *
 * TextSpacingHandler
 * public methods ---
 * 1. setProperties : function(properties)
 * 2. getLineSpacing : function()
 * 3. getSpacingBefore : function()
 * 4. getSpacingAfter : function()
 *
 * private methods ---
 * 1. initialize = function()
 * 2. computeSpacingValue = function(spacing)
 */


define([
  'qowtRoot/dcp/pointHandlers/textSpacingHandler',
  'qowtRoot/models/point'
], function(TextSpacing,
            PointModel) {

  'use strict';


  describe('dcp/pointHandlers/TextSpacingHandler', function() {
    var spacingHandler, properties;

    beforeEach(function() {
      spacingHandler = TextSpacing;
      properties = {
        'lnSpc': undefined,
        'spcBef': undefined,
        'spcAft': undefined
      };
      PointModel.maxParaFontSize = 80;
    });

    // getLineSpacing() tests
    describe('test text spacing handler -- getLineSpacing', function() {


      it('should return  correct line spacing with percent ', function() {
        properties.lnSpc = {
          format: 'percentage',
          value: '200%'
        };
        spacingHandler.setProperties(properties);

        var returnValue = spacingHandler.getLineSpacing();
        var expectedValue = 2.4;
        expect(returnValue).toEqual(expectedValue);
      });

      it('should return  correct line spacing with percent and value is not ' +
          'in percent format', function() {
            properties.lnSpc = {
              format: 'percentage',
              value: '200000'
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getLineSpacing();
            var expectedValue = 2.4;
            expect(returnValue).toEqual(expectedValue);
          });

      it('should return  correct line spacing with percent and value is ' +
          'undefined', function() {
            properties.lnSpc = {
              format: 'percentage',
              value: undefined
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getLineSpacing();
            var expectedValue = 1.2;
            expect(returnValue).toEqual(expectedValue);
          });

      it('should return  correct line spacing with decimal ', function() {
        properties.lnSpc = {
          format: 'points',
          value: '200'
        };
        spacingHandler.setProperties(properties);

        var returnValue = spacingHandler.getLineSpacing();
        var expectedValue = '2pt';
        expect(returnValue).toEqual(expectedValue);
      });

      it('should return  correct line spacing with decimal and value is ' +
          'undefined', function() {
            properties.lnSpc = {
              format: 'points',
              value: undefined
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getLineSpacing();
            var expectedValue = 1.2;
            expect(returnValue).toEqual(expectedValue);
          });

      // test for line spacing with reduction applied
      describe('test text spacing handler with line spacing reduction -- ' +
          'getLineSpacing', function() {
            beforeEach(function() {
              PointModel.textBodyProperties.lnSpcReduction = '30';
            });

            afterEach(function() {
              PointModel.textBodyProperties.lnSpcReduction = undefined;
            });

            it('should return  correct line spacing with percent ', function() {
              properties.lnSpc = {
                format: 'percentage',
                value: '200%'
              };
              spacingHandler.setProperties(properties);

              var returnValue = spacingHandler.getLineSpacing();
              var expectedValue = 1.68;
              expect(returnValue).toEqual(expectedValue);
            });

            it('should return  correct line spacing with points ', function() {
              properties.lnSpc = {
                format: 'points',
                value: '2000'
              };
              spacingHandler.setProperties(properties);

              var returnValue = spacingHandler.getLineSpacing();
              var expectedValue = '14pt';
              expect(returnValue).toEqual(expectedValue);
            });

            it('should return  correct line spacing with percent and value' +
                ' is undefined', function() {
                  properties.lnSpc = {
                    format: 'percentage',
                    value: undefined
                  };
                  spacingHandler.setProperties(properties);

                  var returnValue = spacingHandler.getLineSpacing();
                  var expectedValue = 0.84;
                  expect(returnValue).toEqual(expectedValue);
                });
          });
    });

    // getSpacingBefore() method tests
    describe('test text spacing handler -- getSpacingBefore', function() {
      it('should return correct before spacing with percent ', function() {
        properties.spcBef = {
          format: 'percentage',
          value: '200%'
        };
        spacingHandler.setProperties(properties);

        var returnValue = spacingHandler.getSpacingBefore();
        var expectedValue = '160pt';
        expect(returnValue).toEqual(expectedValue);
      });

      it('should return  correct before spacing with percent and value is ' +
          'not in percent format', function() {
            properties.spcBef = {
              format: 'percentage',
              value: '200000'
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getSpacingBefore();
            var expectedValue = '160pt';
            expect(returnValue).toEqual(expectedValue);
          });

      it('should return  correct before spacing with percent and value is ' +
          'undefined', function() {
            properties.spcBef = {
              format: 'percentage',
              value: undefined
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getSpacingBefore();
            expect(returnValue).toEqual(undefined);
          });

      it('should return  correct before spacing with decimal ', function() {
        properties.spcBef = {
          format: 'points',
          value: '200'
        };
        spacingHandler.setProperties(properties);

        var returnValue = spacingHandler.getSpacingBefore();
        var expectedValue = '2pt';
        expect(returnValue).toEqual(expectedValue);
      });

      it('should return  correct before spacing with decimal and value is ' +
          'undefined', function() {
            properties.spcBef = {
              format: 'points',
              value: undefined
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getSpacingBefore();
            expect(returnValue).toEqual(undefined);
          });
    });


    // getSpacingAfter() method tests
    describe('test text spacing handler -- getSpacingAfter', function() {


      it('should return  correct after spacing with percent ', function() {
        properties.spcAft = {
          format: 'percentage',
          value: '200%'
        };
        spacingHandler.setProperties(properties);

        var returnValue = spacingHandler.getSpacingAfter();
        var expectedValue = '160pt';
        expect(returnValue).toEqual(expectedValue);
      });

      it('should return  correct after spacing with percent and value is ' +
          'not in percent format', function() {
            properties.spcAft = {
              format: 'percentage',
              value: '200000'
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getSpacingAfter();
            var expectedValue = '160pt';
            expect(returnValue).toEqual(expectedValue);
          });

      it('should return  correct after spacing with percent and value is ' +
          'undefined', function() {
            properties.spcAft = {
              format: 'percentage',
              value: undefined
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getSpacingAfter();
            expect(returnValue).toEqual(undefined);
          });

      it('should return  correct after spacing with decimal ', function() {
        properties.spcAft = {
          format: 'points',
          value: '200'
        };
        spacingHandler.setProperties(properties);

        var returnValue = spacingHandler.getSpacingAfter();
        var expectedValue = '2pt';
        expect(returnValue).toEqual(expectedValue);
      });

      it('should return  correct after spacing with decimal and value is ' +
          'undefined', function() {
            properties.spcAft = {
              format: 'points',
              value: undefined
            };
            spacingHandler.setProperties(properties);

            var returnValue = spacingHandler.getSpacingAfter();
            expect(returnValue).toEqual(undefined);
          });
    });

  });
});
