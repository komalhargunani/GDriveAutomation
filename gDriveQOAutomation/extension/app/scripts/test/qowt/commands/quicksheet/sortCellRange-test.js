define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/quicksheet/sortCellRange',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet'
], function(
    CommandManager,
    SortCellRange,
    SheetModel,
    SheetConfig) {

  'use strict';

  describe('Sheet; Sort command', function() {
    beforeEach(function() {
      SheetModel.activeSheetIndex = 3;
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
    });

    describe('invalid creation', function() {
      it('constructor should throw if no range selection is given as ' +
          'an argument', function() {
        assert.throws(function() {
          SortCellRange.create();
        }, 'sort command failed: no selection');
      });

      it('constructor should throw if no ascending property is given as ' +
          'an argument', function() {
        assert.throws(function() {
          SortCellRange.create({});
        }, 'sort command failed: no ascending');
      });

      it('constructor should throw if an invalid range selection object is ' +
          'given as an argument', function() {
        assert.throws(function() {
          SortCellRange.create({}, true);
        }, 'sort command failed: no topLeft/bottomRight');
      });
    });

    describe('valid construction of command', function() {
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

      it('constructor should create a command if a valid parameters are ' +
          'specified', function() {
        var ascending = false;
        var cmd = SortCellRange.create(selection, ascending);
        assert.isDefined(cmd, 'sort command has been defined');
        assert.strictEqual(cmd.name, 'SortCellRange', 'Command name');
        assert.isDefined(cmd.id(), 'sort command id has been defined');
        assert.isTrue(cmd.isOptimistic(), 'sort is optimistic');
        assert.isTrue(cmd.callsService(), 'sort calls service');
        assert.isDefined(cmd.onFailure, 'sort.onFailure()');
        assert.isDefined(cmd.onSuccess, 'sort.onSuccess()');
        assert.isDefined(cmd.getInverse, 'sort.getInverse()');
        assert.isTrue(cmd.canInvert, 'sort command should be invertible');
        assert.strictEqual(cmd.dcpData().name, 'sort');
        assert.strictEqual(cmd.dcpData().si, 3, 'sort sheet index');
        assert.strictEqual(cmd.dcpData().r1, selection.topLeft.rowIdx,
            'sort start row');
        assert.strictEqual(cmd.dcpData().c1, selection.topLeft.colIdx,
            'sort start column');
        assert.strictEqual(cmd.dcpData().r2, selection.bottomRight.rowIdx,
            'sort end row');
        assert.strictEqual(cmd.dcpData().c2, selection.bottomRight.colIdx,
            'sort end column');
        assert.isDefined(cmd.dcpData().criteria, 'sort criteria');
        assert.isDefined(cmd.dcpData().criteria[0], 'sort criteria[0]');
        assert.strictEqual(cmd.dcpData().criteria[0].sortCol,
            selection.topLeft.colIdx, 'sort column');
        assert.strictEqual(cmd.dcpData().criteria[0].ascending, ascending,
            'sort ascending');
        assert.strictEqual(cmd.dcpData().criteria[0].sortBy, 'value',
            'sort value');
        assert.strictEqual(cmd.dcpData().bs,
            SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE,
            'sort bucket size');
      });

      it('Inverse operation should create an UndoCommand', function() {
        var ascending = true;
        var cmd = SortCellRange.create(selection, ascending);
        CommandManager.addCommand(cmd);

        var inverse = cmd.getInverse();
        assert.strictEqual(inverse.name, 'UndoCommand');
      });
    });
  });
});
