/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/commands/quicksheet/getModifiedCells',
  'qowtRoot/models/sheet'
], function(
    GetModifiedCellsCmd,
    SheetModel) {

  'use strict';


  describe('GetModifiedCellsCmd command', function() {

    beforeEach(function() {
      SheetModel.activeSheetIndex = 3;
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
    });

    describe('creation', function() {
      it('constructor should throw if no row index is given as an argument',
         function() {
           expect(function() {
             var sheetIndex;
             var rowIndex1 = 1;
             var colIndex1 = 2;
             var rowIndex2 = 3;
             var colIndex2 = 4;
             GetModifiedCellsCmd.create(sheetIndex, rowIndex1, colIndex1,
                 rowIndex2, colIndex2);
           }).toThrow('ERROR: GetModifiedCellsCmd requires a sheetIndex, ' +
               'rowIndex1, colIndex1, rowIndex2, colIndex2');
         });
      it('constructor should throw if no row index is given as an argument',
         function() {
           expect(function() {
             var sheetIndex = 1;
             var rowIndex1;
             var colIndex1 = 2;
             var rowIndex2 = 3;
             var colIndex2 = 4;
             GetModifiedCellsCmd.create(sheetIndex, rowIndex1, colIndex1,
                 rowIndex2, colIndex2);
           }).toThrow('ERROR: GetModifiedCellsCmd requires a sheetIndex, ' +
               'rowIndex1, colIndex1, rowIndex2, colIndex2');
         });
      it('constructor should throw if no row index is given as an argument',
          function() {
            expect(function() {
              var sheetIndex = 1;
              var rowIndex1 = 1;
              var colIndex1;
              var rowIndex2 = 3;
              var colIndex2 = 4;
              GetModifiedCellsCmd.create(sheetIndex, rowIndex1, colIndex1,
                  rowIndex2, colIndex2);
            }).toThrow('ERROR: GetModifiedCellsCmd requires a sheetIndex, ' +
                'rowIndex1, colIndex1, rowIndex2, colIndex2');
          });
      it('constructor should throw if no row index is given as an argument',
          function() {
            expect(function() {
              var sheetIndex = 1;
              var rowIndex1 = 1;
              var colIndex1 = 2;
              var rowIndex2;
              var colIndex2 = 4;
              GetModifiedCellsCmd.create(sheetIndex, rowIndex1, colIndex1,
                  rowIndex2, colIndex2);
            }).toThrow('ERROR: GetModifiedCellsCmd requires a sheetIndex, ' +
                'rowIndex1, colIndex1, rowIndex2, colIndex2');
          });
      it('constructor should throw if no row index is given as an argument',
          function() {
            expect(function() {
              var sheetIndex = 1;
              var rowIndex1 = 1;
              var colIndex1 = 2;
              var rowIndex2 = 3;
              var colIndex2;
              GetModifiedCellsCmd.create(sheetIndex, rowIndex1, colIndex1,
                  rowIndex2, colIndex2);
            }).toThrow('ERROR: GetModifiedCellsCmd requires a sheetIndex, ' +
                'rowIndex1, colIndex1, rowIndex2, colIndex2');
          });

      it('constructor should create a command if a valid parameters ' +
          'are specified', function() {
            var sheetIndex = 3;
            var rowIndex1 = 1;
            var colIndex1 = 2;
            var rowIndex2 = 3;
            var colIndex2 = 4;
            var cmd = GetModifiedCellsCmd.create(sheetIndex, rowIndex1,
                colIndex1, rowIndex2, colIndex2);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('GetModifiedCellsCmd');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(false);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.onSuccess).toBeDefined();
            expect(cmd.dcpData().name).toBe('gmc');
            expect(cmd.dcpData().si).toBe(3);
            expect(cmd.dcpData().r1).toBe(rowIndex1);
            expect(cmd.dcpData().c1).toBe(colIndex1);
            expect(cmd.dcpData().r2).toBe(rowIndex2);
            expect(cmd.dcpData().c2).toBe(colIndex2);
          });
    });
  });
});
