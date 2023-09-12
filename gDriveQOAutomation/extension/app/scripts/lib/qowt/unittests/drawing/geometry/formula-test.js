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
  'qowtRoot/drawing/geometry/formula'
], function(Formula) {

  'use strict';

  describe('Geometry formula tests', function() {
    var formula = Formula;

    it('should perform multiplyDivide operation', function() {
      var value = formula.evaluateExpression('*/', [1, 6, 2]);
      expect(value).toEqual(3);
    });

    it('should perform multiplyDivide operation when args are strings',
        function() {
          var value = formula.evaluateExpression('*/', ['1', '6', '2']);
          expect(value).toEqual(3);
        });

    it('should perform addSubtract operation when arguments are in strings ' +
        'format', function() {
          var value = formula.evaluateExpression('+-', ['6', '0', '2']);
          expect(value).toEqual(4);
        });

    it('should perform addSubtract operation', function() {
      var value = formula.evaluateExpression('+-', [1, 6, 2]);
      expect(value).toEqual(5);
    });

    it('should perform addDivide operation', function() {
      var value = formula.evaluateExpression('+/', [1, 5, 2]);
      expect(value).toEqual(3);
    });

    it('should perform addDivide operation when args are string', function() {
      var value = formula.evaluateExpression('+/', ['1', '5', '2']);
      expect(value).toEqual(3);
    });

    it('should perform ifElse operation, when condition evaluates to true',
        function() {
          var value = formula.evaluateExpression('?:', [1, 6, 2]);
          expect(value).toEqual(6);
        });

    it('should perform ifElse operation, when condition evaluates to true ' +
        'and args are string', function() {
          var value = formula.evaluateExpression('?:', ['1', '6', '2']);
          expect(value).toEqual(6);
        });

    it('should perform ifElse operation, when condition evaluates to false',
        function() {
          var value = formula.evaluateExpression('?:', [-1, 6, 2]);
          expect(value).toEqual(2);
        });

    it('should perform ifElse operation, when condition evaluates to false ' +
        'args are string', function() {
          var value = formula.evaluateExpression('?:', ['-1', '6', '2']);
          expect(value).toEqual(2);
        });

    it('should perform abs operation, when argument is positive', function() {
      var value = formula.evaluateExpression('abs', [10]);
      expect(value).toEqual(10);
    });

    it('should perform abs operation, when agrument is negative', function() {
      var value = formula.evaluateExpression('abs', [-10]);
      expect(value).toEqual(10);
    });

    it('should perform abs operation, when argument is positive when args ' +
        'are string', function() {
          var value = formula.evaluateExpression('abs', ['10']);
          expect(value).toEqual(10);
        });

    it('should perform abs operation, when agrument is negative and args ' +
        'are string', function() {
          var value = formula.evaluateExpression('abs', ['-10']);
          expect(value).toEqual(10);
        });

    it('should perform Trigonometric arc tangent of a quotient operation',
        function() {
          var value = formula.evaluateExpression('at2', [25, 35]);
          expect(value).toEqual(parseFloat(Math.atan2(35, 25).toFixed(4)));
        });

    it('should perform Trigonometric arc tangent of a quotient operation and ' +
        'args are string', function() {
          var value = formula.evaluateExpression('at2', ['25', '35']);
          expect(value).toEqual(parseFloat(Math.atan2(35, 25).toFixed(4)));
        });

    it('should perform Trigonometric arc tangent modified of a quotient ' +
        'operation', function() {
          var value = formula.evaluateExpression('at2M', [25, 35]);
          expect(value).toEqual(parseFloat(
              (Math.atan2(35, 25) * 60000 * 180 / Math.PI).toFixed(4)));
       });

    it('should perform Trigonometric arc tangent modified of a quotient ' +
        'operation and args are string', function() {
          var value = formula.evaluateExpression('at2M', ['25', '35']);
          expect(value).toEqual(parseFloat(
              (Math.atan2(35, 25) * 60000 * 180 / Math.PI).toFixed(4)));
       });

    it('should perform Cosine ArcTan operation', function() {
      var value = formula.evaluateExpression('cat2', [1, 25, 45]);
      expect(value).toEqual(1 * Math.cos(Math.atan(45 / 25)));
    });

    it('should perform Cosine ArcTan operation and args are string',
        function() {
          var value = formula.evaluateExpression('cat2', ['1', '25', '45']);
          expect(value).toEqual((1 * Math.cos(Math.atan(45 / 25))));
        });

    it('should perform Max operation', function() {
      var value = formula.evaluateExpression('max', [1, 45]);
      expect(value).toEqual(45);
    });

    it('should perform Max operation and args string', function() {
      var value = formula.evaluateExpression('max', ['1', '45']);
      expect(value).toEqual(45);
    });

    it('should perform Min operation', function() {
      var value = formula.evaluateExpression('min', [1, 45]);
      expect(value).toEqual(1);
    });

    it('should perform Min operation and args are string', function() {
      var value = formula.evaluateExpression('min', ['1', '45']);
      expect(value).toEqual(1);
    });

    it('should perform Mod operation', function() {
      var value = formula.evaluateExpression('mod', [1, 3, 4]);
      expect(value).toEqual(6);
    });

    it('should perform Mod operation and args are string', function() {
      var value = formula.evaluateExpression('mod', ['1', '3', '4']);
      expect(value).toEqual(6);
    });

    it('should perform Pin operation, when (1st argument > 2nd argument)',
        function() {
          var value = formula.evaluateExpression('pin', [10, 2, 3]);
          expect(value).toEqual(10);
        });

    it('should perform Pin operation, when (1st argument > 2nd argument) and ' +
        'args are string', function() {
          var value = formula.evaluateExpression('pin', ['10', '2', '3']);
          expect(value).toEqual(10);
        });

    it('should perform Pin operation, when (1st argument < 2nd argument) AND ' +
        '(2nd argument > 3nd argument)', function() {
          var value = formula.evaluateExpression('pin', [10, 20, 3]);
          expect(value).toEqual(3);
        });

    it('should perform Pin operation, when (1st argument < 2nd argument) AND ' +
        '(2nd argument < 3nd argument)', function() {
          var value = formula.evaluateExpression('pin', [10, 20, 30]);
          expect(value).toEqual(20);
        });

    it('should perform Sine ArcTan operation', function() {
      var value = formula.evaluateExpression('sat2', [1, 25, 45]);
      expect(value).toEqual((1 * Math.sin(Math.atan(45 / 25))));
    });

    it('should perform Sine ArcTan operation and args are string', function() {
      var value = formula.evaluateExpression('sat2', ['1', '25', '45']);
      expect(value).toEqual((1 * Math.sin(Math.atan(45 / 25))));
    });

    it('should perform Square root operation', function() {
      var value = formula.evaluateExpression('sqrt', [49]);
      expect(value).toEqual(7);
    });

    it('should perform Square root operation and args are string', function() {
      var value = formula.evaluateExpression('sqrt', ['49']);
      expect(value).toEqual(7);
    });

    it('should perform Sine operation', function() {
      var value = formula.evaluateExpression('sin', [1, 60000 * 30]);
      expect(value).toEqual(0.5);
    });

    it('should perform Sine operation with args as string', function() {
      var value = formula.evaluateExpression('sin', ['1', 60000 * 30 + '']);
      expect(value).toEqual(0.5);
    });

    it('should perform Cosin operation', function() {
      var value = formula.evaluateExpression('cos', [1, 60000 * 60]);
      expect(value).toEqual(0.5);
    });

    it('should perform Cosin operation', function() {
      var value = formula.evaluateExpression('cos', ['1', 60000 * 60 + '']);
      expect(value).toEqual(0.5);
    });

    it('should perform Tangent operation', function() {
      var value = formula.evaluateExpression('tan', [1, 60000 * 45]);
      expect(value).toEqual(1);
    });

    it('should perform Tangent operation args are string', function() {
      var value = formula.evaluateExpression('tan', ['1', 60000 * 45 + '']);
      expect(value).toEqual(1);
    });

    it('should perform Val operation', function() {
      var value = formula.evaluateExpression('val', [111]);
      expect(value).toEqual(111);
    });

    it('should perform Val operation and args are string', function() {
      var value = formula.evaluateExpression('val', ['111']);
      expect(value).toEqual(111);
    });

  });
});
