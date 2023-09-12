/*
 * Test suite for colNum2colName bi-directional converter
 */
define([
  'qowtRoot/utils/converters/converter'
], function(
    Converter) {

  'use strict';

  describe('colNum 2 colName bi-directional converter', function() {

    beforeEach(function() {
    });
    afterEach(function() {
    });

    it('should correctly convert col number to column name', function() {
      var colNum = 1;
      var colName = Converter.colNum2colName(colNum);
      expect(colName).toBe('A');

      colNum = 16;
      colName = Converter.colNum2colName(colNum);
      expect(colName).toBe('P');

      colNum = 26;
      colName = Converter.colNum2colName(colNum);
      expect(colName).toBe('Z');

      colNum = 27;
      colName = Converter.colNum2colName(colNum);
      expect(colName).toBe('AA');

      colNum = 63;
      colName = Converter.colNum2colName(colNum);
      expect(colName).toBe('BK');
    });

    it('should correctly convert col name to column number', function() {
      var colName = 'A';
      var colNum = Converter.colName2colNum(colName);
      expect(colNum).toBe(1);

      colName = 'P';
      colNum = Converter.colName2colNum(colName);
      expect(colNum).toBe(16);

      colName = 'Z';
      colNum = Converter.colName2colNum(colName);
      expect(colNum).toBe(26);

      colName = 'AA';
      colNum = Converter.colName2colNum(colName);
      expect(colNum).toBe(27);

      colName = 'BK';
      colNum = Converter.colName2colNum(colName);
      expect(colNum).toBe(63);
    });
  });

  return {};
});

