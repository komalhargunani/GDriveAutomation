// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the CopyCutCellRangeCommandBase command
 */

define([
  'qowtRoot/commands/quicksheet/copyCutCellRangeCommandBase',
  'qowtRoot/widgets/grid/sysClipboard',
  'qowtRoot/controls/grid/workbook'],
function(
    CopyCutCellRangeCommandBase,
    SysClipboard,
    Workbook) {

  'use strict';

  describe('CopyCutCellRangeCommandBase command', function() {

    describe('creation', function() {

      beforeEach(function() {
        Workbook.init();
      });

      afterEach(function() {
        Workbook.reset();
      });

      it('constructor should throw if a rangeSelection object is not given ' +
          'as an argument', function() {
            expect(function() {
              var rangeSelection;
              CopyCutCellRangeCommandBase.create(rangeSelection);
            }).toThrow('create - CopyCutCellRangeCommandBase requires a ' +
                'range selection to be defined');
          });

      it('constructor should throw if anchor is missing in the ' +
          'rangeSelection object', function() {
            var rangeSelection = {
              topLeft: {
                rowIdx: 1,
                colIdx: 1
              },
              bottomRight: {
                rowIdx: 1,
                colIdx: 1
              }
            };
            expect(function() {
              CopyCutCellRangeCommandBase.create(rangeSelection);
            }).toThrow('create - CopyCutCellRangeCommandBase requires valid ' +
                'anchor, topLeft and bottomRight object to be defined');
          });

      it('constructor should throw if topleft is missing in the ' +
          'rangeSelection object', function() {
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
            expect(function() {
              CopyCutCellRangeCommandBase.create(rangeSelection);
            }).toThrow('create - CopyCutCellRangeCommandBase requires valid ' +
                'anchor, topLeft and bottomRight object to be defined');
          });

      it('constructor should throw if bottomRight is missing in the ' +
          'rangeSelection object', function() {
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
            expect(function() {
              CopyCutCellRangeCommandBase.create(rangeSelection);
            }).toThrow('create - CopyCutCellRangeCommandBase requires valid ' +
                'anchor, topLeft and bottomRight object to be defined');
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
                rowIdx: 16,
                colIdx: 31
              }
            };
            var cmdName = 'blah';
            var optimistic = false;
            var cmd = CopyCutCellRangeCommandBase.create(selection, cmdName,
                optimistic);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe(cmdName);
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(false);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onSuccess).toBeDefined();
          });

      it('onSuccess() method should copy the copied cell content to the ' +
          'system clipboard', function() {
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
                rowIdx: 16,
                colIdx: 31
              }
            };
            var cmdName;
            var optimistic;
            var cmd = CopyCutCellRangeCommandBase.create(selection, cmdName,
                optimistic);

            spyOn(SysClipboard, 'copyCellContent');
            cmd.onSuccess();
            expect(SysClipboard.copyCellContent).toHaveBeenCalled();
          });

      it('onSuccess() method should not be able to be overwritten',
         function() {
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
               rowIdx: 16,
               colIdx: 31
             }
            };
           var cmdName;
           var optimistic;
           var cmd = CopyCutCellRangeCommandBase.create(selection, cmdName,
               optimistic);

           var errorThrown;
           try {
             cmd.onSuccess = function() {};
           }
           catch (e) {
             errorThrown = e;
           }

           expect(errorThrown).toBeDefined();
           expect(errorThrown.message.indexOf('Cannot assign to read only ' +
               'property')).not.toBe(-1);
         });
    });
  });
});

