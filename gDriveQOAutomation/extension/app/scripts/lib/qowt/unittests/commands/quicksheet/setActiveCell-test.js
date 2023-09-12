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
  'qowtRoot/commands/quicksheet/setActiveCell',
  'qowtRoot/models/sheet'], function(
    SetActiveCell,
    SheetModel) {

  'use strict';

  describe('SetActiveCell command', function() {

    beforeEach(function() {
      SheetModel.activeSheetIndex = 3;
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
    });

    describe('creation', function() {
      it('constructor should throw if no sheetIndex is given as ' +
          'an argument', function() {
            expect(function() {
              SetActiveCell.create(undefined, 1, 1);
            }).toThrow('ERROR: SetActiveCell requires a sheet index');
          });

      it('constructor should throw if no rowIndex is given as an argument',
         function() {
           expect(function() {
             SetActiveCell.create(0, undefined, 1);
           }).toThrow('ERROR: SetActiveCell requires a row index');
         });

      it('constructor should throw if no columnIndex is given as ' +
          'an argument', function() {
            expect(function() {
              SetActiveCell.create(0, 1, undefined);
            }).toThrow('ERROR: SetActiveCell requires a column index');
          });

      it('constructor should create a command if valid parameters ' +
          'are specified', function() {
            var sheetIndex = 0,
                rowIndex = 10,
                colIndex = 10;
            var cmd = SetActiveCell.create(sheetIndex, rowIndex, colIndex);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SetActiveCell');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(false);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.doRevert).not.toBeDefined();
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.dcpData().name).toBe('sac');
            expect(cmd.dcpData().si).toBe(0);
            expect(cmd.dcpData().r1).toBe(rowIndex);
            expect(cmd.dcpData().c1).toBe(colIndex);
          });
    });
  });

});
