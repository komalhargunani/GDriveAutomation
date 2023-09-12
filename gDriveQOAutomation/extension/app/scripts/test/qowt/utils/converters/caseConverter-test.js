define([
  'qowtRoot/utils/converters/caseConverter'
], function(
    CaseConverter) {

  'use strict';

  describe('Test caseConverter.js', function() {
    describe('Test camelCase2_', function() {

      it('should convert the camel case string to equivalent underscore ' +
          'separated string and return the converted string', function() {
            var str = 'aCamelCaseString';
            var expectedStr = 'a_camel_case_string';
            assert.strictEqual(CaseConverter.camelCase2_(str), expectedStr);
          });


      it('should not alter the string if there is no camel case', function() {
        var str = 'anormalstring';
        var expectedStr = 'anormalstring';
        assert.strictEqual(CaseConverter.camelCase2_(str), expectedStr);
      });


      it('should convert to lower case if the first letter is Caps, and ' +
          'return the converted string', function() {
            var str = 'Firstlettercaps';
            var expectedStr = 'firstlettercaps';
            assert.strictEqual(CaseConverter.camelCase2_(str), expectedStr);
          });


      it('should throw an error if the argument is not a string', function() {
        assert.throws(function() {
          CaseConverter.camelCase2_(100);
        }, 'Invalid parameter! Expected string');
      });
    });


    describe('Test _2CamelCase', function() {

      it('should convert the underscore separated string to its equivalent ' +
          'camelCase separated string and return the converted string',
          function() {
            var str = 'an_underscore_separated_string';
            var expectedStr = 'anUnderscoreSeparatedString';
            assert.strictEqual(CaseConverter._2CamelCase(str), expectedStr);

            str = '_what_happens_to_this_string';
            expectedStr = 'whatHappensToThisString';
            assert.strictEqual(CaseConverter._2CamelCase(str), expectedStr);

            str = 'or_this_';
            expectedStr = 'orThis';
            assert.strictEqual(CaseConverter._2CamelCase(str), expectedStr);
          });


      it('should not alter the string if there is no underscore in it',
          function() {
            var str = 'anormalstring';
            var expectedStr = 'anormalstring';
            assert.strictEqual(CaseConverter._2CamelCase(str), expectedStr);
          });


      it('should remove the underscore if the string begins with it',
          function() {
            var str = '_someString';
            var expectedStr = 'someString';
            assert.strictEqual(CaseConverter._2CamelCase(str), expectedStr);
          });


      it('should remove the underscore if the string ends with it',
          function() {
            var str = 'someString_';
            var expectedStr = 'someString';
            assert.strictEqual(CaseConverter._2CamelCase(str), expectedStr);
          });


      it('should throw an error if the argument is not a string', function() {
        assert.throws(function() {
          CaseConverter.camelCase2_({invalid: 'parameter'});
        }, 'Invalid parameter! Expected string');
      });
    });
  });
});
