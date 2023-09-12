// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * Test suite for SetCellContent command
 */

define([
  'qowtRoot/commands/quicksheet/setCellContent',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/commands/commandManager',
  'qowtRoot/variants/comms/transport',
  'qowtRoot/pubsub/pubsub'
], function(
    SetCellContent,
    SheetModel,
    SheetConfig,
    CommandManager,
    Transport,
    PubSub) {

  'use strict';

  describe('SetCellContent command', function() {
    beforeEach(function() {
      SheetModel.activeSheetIndex = 3;
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
    });

    describe('creation', function() {
      it('constructor should throw if no column index is given as an argument',
          function() {
           expect(function() {
             var colIndex;
             var colIndex2 = 2;
             var rowIndex = 2;
             var cellText = 'Hello';
             SetCellContent.create(colIndex, rowIndex, colIndex2,
                 rowIndex, cellText);
           }).toThrow('ERROR: SetCellContent: either the rows or columns' +
               ' need to be defined');
         });
      it('constructor should throw if no row index is given as an argument',
          function() {
           expect(function() {
             var colIndex = 3;
             var rowIndex;
             var rowIndex2 = 2;
             var cellText = 'World';
             SetCellContent.create(colIndex, rowIndex, colIndex,
                 rowIndex2, cellText);
           }).toThrow('ERROR: SetCellContent: either the rows or columns' +
               ' need to be defined');
         });
      it('constructor should throw if no cell text is given as an argument',
          function() {
           expect(function() {
             var colIndex = 2;
             var rowIndex = 3;
             var cellText;
             SetCellContent.create(colIndex, rowIndex, colIndex,
                 rowIndex, cellText);
           }).toThrow('ERROR: SetCellContent requires an updated cell text');
         });
      describe('valid construction', function() {
        var _colIndex = 2;
        var _rowIndex = 3;
        var _newText = 'Hello World';
        var _checkCommand = function(cmd, cellText) {
          expect(cmd).toBeDefined();
          expect(cmd.name).toBe('SetCellContent');
          expect(cmd.id()).toBeDefined();
          expect(cmd.isOptimistic()).toBe(true);
          expect(cmd.callsService()).toBe(true);
          expect(cmd.onFailure).toBeDefined();
          expect(cmd.onSuccess).toBeDefined();
          expect(cmd.dcpData().name).toBe('scc');
          expect(cmd.dcpData().si).toBe(3);
          expect(cmd.dcpData().r1).toBe(_rowIndex);
          expect(cmd.dcpData().c1).toBe(_colIndex);
          expect(cmd.dcpData().r2).toBe(_rowIndex);
          expect(cmd.dcpData().c2).toBe(_colIndex);
          expect(cmd.dcpData().t).toBe(cellText);
          expect(cmd.dcpData().bs).
              toBe(SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
        };
        it('constructor should create a command if a valid parameters are' +
            ' specified', function() {
             var cmd = SetCellContent.create(_colIndex, _rowIndex, _colIndex,
                 _rowIndex, _newText);
             _checkCommand(cmd, _newText);
           });
        describe('inverse', function() {
          var _dcpProcessed;
          beforeEach(function() {
            jasmine.Clock.useMock();
            jasmine.Clock.reset();
            _dcpProcessed = false;
            spyOn(Transport, 'sendMessage').andCallFake(
                function(payload, callback) {
                  payload = payload || {};
                  callback({});
                });
            PubSub.subscribe('qowt:stateChange', function(eventType,
                eventData) {
                  eventType = eventType || '';
                  if ((eventData.module === 'dcpManager') &&
                      (eventData.state === 'processing')) {
                    if (_dcpProcessed) {
                      throw new Error('DCP processed twice in the same test');
                    }
                    _dcpProcessed = true;
                  }
                });
          });
          afterEach(function() {
            PubSub.clear();
          });
          it('inverse should create an UndoCommand', function() {
            var cmd = SetCellContent.create(_colIndex, _rowIndex, _colIndex,
                _rowIndex, _newText);
            CommandManager.addCommand(cmd);
            jasmine.Clock.tick(0);
            var inverse = cmd.getInverse();
            expect(inverse.name).toBe('UndoCommand');
          });
        });
      });
    });
  });
});
