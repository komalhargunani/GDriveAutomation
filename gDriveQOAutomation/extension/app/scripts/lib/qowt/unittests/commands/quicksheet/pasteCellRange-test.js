// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the pasteCellRange command
 */

define([
  'qowtRoot/commands/quicksheet/pasteCellRange',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet'
], function(pasteCellRange, Workbook, SheetModel, SheetConfig) {

  'use strict';

  describe('pasteCellRange command', function() {
    beforeEach(function() {
      SheetModel.activeSheetIndex = 1;
      Workbook.init();
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
      Workbook.reset();
    });

    describe('creation', function() {
      it('constructor should throw if rangeSelection object  is not given ' +
          'as an argument', function() {
            expect(function() {
              var rangeSelection;
              pasteCellRange.create(rangeSelection);
            }).toThrow('ERROR: PasteCellRange requires Range selection ' +
                'to be defined');
         });
      it('constructor should throw if topleft is missing in the ' +
          'rangeSelection object', function() {
            expect(function() {
              var rangeSelection = {
                anchor: {
                  rowIdx: 1,
                  colIdx: 1
                },
                bottomRight: {
                  rowIdx: 1,
                  colIdx: 1
                }
              };
              pasteCellRange.create(rangeSelection);
            }).toThrow('ERROR: PasteCellRange requires valid topleft and ' +
                'bottomright object to be defined');
         });
      it('constructor should throw if bottomRight is missing in the ' +
          'rangeSelection object', function() {
            expect(function() {
              var rangeSelection = {
                anchor: {
                  rowIdx: 1,
                  colIdx: 1
                },
                topLeft: {
                  rowIdx: 1,
                  colIdx: 1
                }
              };
              pasteCellRange.create(rangeSelection);
            }).toThrow('ERROR: PasteCellRange requires valid topleft and ' +
                'bottomright object to be defined');
         });
      it('constructor should create a command if a valid parameters ' +
          'are specified', function() {

            var selection = {
              anchor: {
                rowIdx: 1,
                colIdx: 1
              },
              topLeft: {
                rowIdx: 1,
                colIdx: 1
              },
              bottomRight: {
                rowIdx: 1,
                colIdx: 1
              }
            };
            var cmd = pasteCellRange.create(selection);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('PasteCellRange');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.onSuccess).toBeDefined();
            expect(cmd.dcpData().name).toBe('pcr');
            expect(cmd.dcpData().si).toBe(1);
            expect(cmd.dcpData().r1).toBe(selection.topLeft.rowIdx);
            expect(cmd.dcpData().c1).toBe(selection.topLeft.colIdx);
            expect(cmd.dcpData().r2).toBe(selection.bottomRight.rowIdx);
            expect(cmd.dcpData().c2).toBe(selection.bottomRight.colIdx);
            expect(cmd.dcpData().bs).
                toBe(SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
          });
      it('inverse should create an UndoCommand', function() {
        var selection = {
          anchor: {
            rowIdx: 1,
            colIdx: 1
          },
          topLeft: {
            rowIdx: 1,
            colIdx: 1
          },
          bottomRight: {
            rowIdx: 1,
            colIdx: 1
          }
        };
        var cmd = pasteCellRange.create(selection);
        var inverse = cmd.getInverse();
        expect(inverse.name).toBe('UndoCommand');
      });
    });
  });
});

