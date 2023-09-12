/*
 * Test suite for the formula utility methods
 */
define([
  'qowtRoot/utils/formulaUtils'
], function(
    FormulaUtils) {

  'use strict';

  describe('Formula Utils', function() {

    var formulaText = '=D14+X173-$N$73/CK208 F1^Z89hello-UV123\u00A0P13*GHT' +
        '1999world &A1!AA50,JJ817.C1:ABC5555/$H52(Q121<HHH77>ZZ3^T$66+B0' +
        '16+f59 B8:D12:G5:K19the_end';

    beforeEach(function() {
    });
    afterEach(function() {
    });

    it('should correctly tokenize the given text into prefixed cell refs',
       function() {
         var cellRefArray = FormulaUtils.tokenizeIntoPrefixedCellRefs(
             formulaText);
         expect(cellRefArray).toBeDefined();
         expect(cellRefArray.length).toBe(25);
         expect(cellRefArray[0]).toBe('=D14');
         expect(cellRefArray[1]).toBe('+X173');
         expect(cellRefArray[2]).toBe('-$N$73');
         expect(cellRefArray[3]).toBe('/CK208');
         expect(cellRefArray[4]).toBe(' F1');
         expect(cellRefArray[5]).toBe('^Z89');
         expect(cellRefArray[6]).toBe('-UV123');
         expect(cellRefArray[7]).toBe('\u00A0P13');
         expect(cellRefArray[8]).toBe('*GHT1999');
         expect(cellRefArray[9]).toBe('&A1');
         expect(cellRefArray[10]).toBe('!AA50');
         expect(cellRefArray[11]).toBe(',JJ817');
         expect(cellRefArray[12]).toBe('.C1');
         expect(cellRefArray[13]).toBe(':ABC5555');
         expect(cellRefArray[14]).toBe('/$H52');
         expect(cellRefArray[15]).toBe('(Q121');
         expect(cellRefArray[16]).toBe('<HHH77');
         expect(cellRefArray[17]).toBe('>ZZ3');
         expect(cellRefArray[18]).toBe('^T$66');
         expect(cellRefArray[19]).toBe('+B016');
         expect(cellRefArray[20]).toBe('+f59');
         expect(cellRefArray[21]).toBe(' B8');
         expect(cellRefArray[22]).toBe(':D12');
         expect(cellRefArray[23]).toBe(':G5');
         expect(cellRefArray[24]).toBe(':K19');

         // undefined text
         cellRefArray = FormulaUtils.tokenizeIntoPrefixedCellRefs();
         expect(cellRefArray).toBe(undefined);

         // no cell refs in text
         cellRefArray = FormulaUtils.tokenizeIntoPrefixedCellRefs(
             'some normal text');
         expect(cellRefArray).toBe(null);
       });

    it('should correctly determine if a given character is a valid cell' +
        'ref prefix character', function() {
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 0)).toBe(
              true); // =
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 1)).toBe(
              false); // D
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 2)).toBe(
              false); // 1
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 4)).toBe(
              true); // +
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 5)).toBe(
              false); // X
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 9)).toBe(
              true); // -
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 10)).toBe(
              false); // $
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 15)).toBe(
              true); // /
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 21)).toBe(
              true); // (space char)
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 24)).toBe(
              true); // ^
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 28)).toBe(
              false); // h
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 33)).toBe(
              true); // -
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 39)).toBe(
              true); // \u00A0
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 43)).toBe(
              true); // *
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 51)).toBe(
              false); // w
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 57)).toBe(
              true); // &
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 60)).toBe(
              true); // !
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 61)).toBe(
              false); // A
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 65)).toBe(
              true); // ,
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 71)).toBe(
              true); // .
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 72)).toBe(
              false); // C
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 74)).toBe(
              true); // :
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 79)).toBe(
              false); // 5
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 82)).toBe(
              true); // /
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 83)).toBe(
              false); // $
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 87)).toBe(
              true); // (
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 92)).toBe(
              true); // <
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 93)).toBe(
              false); // H
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 98)).toBe(
              true); // >
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 99)).toBe(
              false); // Z
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 102)).toBe(
              true); // ^
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 104)).toBe(
              false); // $
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 107)).toBe(
              true); // +
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 112)).toBe(
              true); // +
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 116)).toBe(
              true); // (space char)
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 119)).toBe(
              true); // :
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 123)).toBe(
              true); // :
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 124)).toBe(
              false); // G
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 126)).toBe(
              true); // :
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 127)).toBe(
              false); // K
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 128)).toBe(
              false); // 1
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 129)).toBe(
              false); // 9
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 130)).toBe(
              false); // t
          expect(FormulaUtils.charIsValidCellRefPrefix(formulaText, 133)).toBe(
              false); // _

          // undefined text
          expect(FormulaUtils.charIsValidCellRefPrefix(undefined, 0)).toBe(
              false);

          // invalid character position
          expect(FormulaUtils.charIsValidCellRefPrefix('blah', -1)).toBe(false);

          // out-of-range character position
          expect(FormulaUtils.charIsValidCellRefPrefix('blah', 100)).toBe(
              false);
        });

    it('should correctly find the final cell area in the given text',
       function() {
         expect(FormulaUtils.findFinalCellArea('=D18+F34')).toEqual(
             {startCellRef: 'F34'});
         expect(FormulaUtils.findFinalCellArea('=D18+F34-')).toEqual(
             {startCellRef: 'F34'});
         expect(FormulaUtils.findFinalCellArea('=D18+F34-C76:E100')).toEqual(
             {startCellRef: 'C76', endCellRef: 'E100'});

         // undefined text
         expect(FormulaUtils.findFinalCellArea()).toBe(undefined);

         // text containing no cell refs
         expect(FormulaUtils.findFinalCellArea('=')).toBe(undefined);
       });

    it('should correctly find the index of the final cell ref prefix ' +
        'character in the given text', function() {
          expect(FormulaUtils.findFinalPrefixCharIndex(formulaText)).toBe(
              126); // :

          // undefined text
          expect(FormulaUtils.findFinalPrefixCharIndex()).toBe(-1);

          // text containing no prefix characters
          expect(FormulaUtils.findFinalPrefixCharIndex('blah')).toBe(-1);
        });

    it('should correctly convert a given cell ref into row and column numbers',
       function() {
         expect(FormulaUtils.cellRefToRowAndColNums('D18')).toEqual(
             {rowNum: '18', colNum: 4});
         expect(FormulaUtils.cellRefToRowAndColNums('AC137')).toEqual(
             {rowNum: '137', colNum: 29});
         expect(FormulaUtils.cellRefToRowAndColNums('c9')).toEqual(
             {rowNum: '9', colNum: 3});

         // absolute cell ref (with dollar signs)
         expect(FormulaUtils.cellRefToRowAndColNums('$B$45')).toEqual(
             {rowNum: '45', colNum: 2});

         // undefined cell ref
         expect(FormulaUtils.cellRefToRowAndColNums()).toEqual({});

         // pretend cell ref that has no digits
         expect(FormulaUtils.cellRefToRowAndColNums('AA')).toEqual({});

         // pretend cell ref that has no letters
         expect(FormulaUtils.cellRefToRowAndColNums('15')).toEqual({});
       });

    it('should correctly convert a given row number and column number' +
        'into a cell ref', function() {
          expect(FormulaUtils.cellRowAndColNumsToRef({rowNum: 89, colNum: 4})).
              toBe('D89');
          expect(FormulaUtils.cellRowAndColNumsToRef({rowNum: 3, colNum: 29})).
              toBe('AC3');

          // undefined object
          expect(FormulaUtils.cellRowAndColNumsToRef()).toBe(undefined);

          // undefined row num
          expect(FormulaUtils.cellRowAndColNumsToRef({colNum: 8})).toBe(
              undefined);

          // undefined column num
          expect(FormulaUtils.cellRowAndColNumsToRef({rowNum: 2})).toBe(
              undefined);

          // undefined row num and column num
          expect(FormulaUtils.cellRowAndColNumsToRef({})).toBe(undefined);
        });
  });

  return {};
});

