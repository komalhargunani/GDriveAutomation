define([
  'qowtRoot/commands/quicksheet/setFreezePanes',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/models/sheet'
], function(
    SetFreezePanes,
    PaneManager,
    Workbook,
    SheetModel) {

  'use strict';

  describe('SetFreezePanes command', function() {
    var sandbox_;
    beforeEach(function() {
      SheetModel.activeSheetIndex = 3;
      sandbox_ = sinon.sandbox.create();
      sandbox_.stub(Workbook, 'findContainingFloater');
    });


    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
      sandbox_.restore();
    });


    describe('Invalid Creation', function() {
      it('constructor should throw error if rowIndex is undefined', function() {
        assert.throws(function() {
          SetFreezePanes.create();
        }, 'ERROR: FreezePanes requires a row index');
      });


      it('constructor should throw error if colIndex is undefined', function() {
        assert.throws(function() {
          SetFreezePanes.create(10);
        }, 'ERROR: FreezePanes requires a column index');
      });
    });


    describe('Valid Creation', function() {
      it('constructor should create a command if a valid parameters are ' +
          'specified', function() {
        var rowIndex = 10, colIndex = 10;
        var cmd = SetFreezePanes.create(rowIndex, colIndex);
        assert.isDefined(cmd, 'SetFreezePanes command should be defined');
        assert.strictEqual(cmd.name, 'SetFreezePanes');
        assert.isDefined(cmd.id(), 'ID for SetFreezePanes command should be' +
            ' defined');
        assert.isTrue(cmd.isOptimistic(), 'SetFreezePanes command should be' +
            ' an optimistic command');
        assert.isTrue(cmd.callsService(), 'SetFreezePanes should be able to' +
            ' call services');
        assert.isDefined(cmd.doRevert, 'SetFreezePanes command should know to' +
            ' revert itself in case of failure');
        assert.isDefined(cmd.onFailure, 'onFailure function for' +
            ' SetFreezePanes command should be defined');
        assert.strictEqual(cmd.dcpData().name, 'sfp');
        assert.strictEqual(cmd.dcpData().si, 3);
        assert.strictEqual(cmd.dcpData().ri, rowIndex);
        assert.strictEqual(cmd.dcpData().ci, colIndex);
        assert.isDefined(cmd.getInverse, 'SetFreezePanes command should have' +
            ' an inverse method defined');
        assert.isTrue(cmd.canInvert, 'SetFreezePanes command should be' +
            ' invertible');
      });
    });


    describe('Optimism, Reversal and Inverse of SetFreezePanes command',
      function() {
        var anchor = {rowIdx: 10, colIdx: 12};

        describe('freezePanes', function() {
          beforeEach(function() {
            sandbox_.stub(Workbook, 'freezePanes');
            sandbox_.stub(Workbook, 'unfreezePanes');
            sandbox_.stub(Workbook, 'isFrozen', function() {
              return false;
            });
          });


          it('doDirtyOptimistic should call freezePanes if panes are not ' +
              'frozen', function() {
                var cmd = SetFreezePanes.create(anchor.rowIdx, anchor.colIdx);
                cmd.doDirtyOptimistic();
                assert(Workbook.freezePanes.calledWith(anchor.rowIdx,
                    anchor.colIdx));
                assert(Workbook.unfreezePanes.notCalled);
          });


          it('doRevert should call unfreezePanes for freezePane action',
            function() {
              var cmd = SetFreezePanes.create(anchor.rowIdx, anchor.colIdx);
              cmd.doDirtyOptimistic();
              assert(Workbook.unfreezePanes.notCalled);

              cmd.doRevert();
              assert(Workbook.unfreezePanes.called);
          });


          it('should set the row, col Idx of dcp data to that of an anchor ' +
              'cell and its inverse should have the row, col Idx of dcp data ' +
              'set to 0, 0', function() {
                var cmd = SetFreezePanes.create(anchor.rowIdx, anchor.colIdx);
                var inverseCmd = cmd.getInverse();

                var cmdDcpData = cmd.dcpData();
                var inverseCmdDcpData = inverseCmd.dcpData();

                assert.strictEqual(cmdDcpData.ri, anchor.rowIdx);
                assert.strictEqual(cmdDcpData.ci, anchor.colIdx);
                assert.strictEqual(inverseCmdDcpData.ri, 0);
                assert.strictEqual(inverseCmdDcpData.ci, 0);
          });
        });


        describe('unfreezePanes', function() {
          var panesFrozen = false;

          beforeEach(function() {
            sandbox_.stub(Workbook, 'freezePanes', function(rowIdx, colIdx) {
              PaneManager.setFrozenRowIndex(rowIdx);
              PaneManager.setFrozenColumnIndex(colIdx);
              panesFrozen = true;
            });
            sandbox_.stub(Workbook, 'unfreezePanes', function() {
              panesFrozen = false;
            });
            sandbox_.stub(Workbook, 'isFrozen', function() {
              return panesFrozen;
            });
          });


          afterEach(function() {
            panesFrozen = false;
          });


          it('doDirtyOptimistic should call unfreezePanes if panes are frozen',
            function() {
              var freezeCmd =
                    SetFreezePanes.create(anchor.rowIdx, anchor.colIdx);
              //freeze panes
              freezeCmd.doDirtyOptimistic();
              assert(Workbook.freezePanes.called);
              assert(Workbook.unfreezePanes.notCalled);

              var unfreezeCmd =
                    SetFreezePanes.create(anchor.rowIdx, anchor.colIdx);
              //unfreeze panes
              unfreezeCmd.doDirtyOptimistic();

              assert(Workbook.unfreezePanes.called);
              assert(Workbook.freezePanes.calledOnce);
          });


          it('doRevert should call freezePanes for unfreezePanes action',
            function() {
              var freezeCmd =
                    SetFreezePanes.create(anchor.rowIdx, anchor.colIdx);
              //freeze panes
              freezeCmd.doDirtyOptimistic();

              var unfreezeCmd =
                    SetFreezePanes.create(anchor.rowIdx, anchor.colIdx);
              //unfreeze panes
              unfreezeCmd.doDirtyOptimistic();
              assert(Workbook.freezePanes.calledOnce);

              unfreezeCmd.doRevert();
              assert(Workbook.freezePanes.calledTwice);
              assert(Workbook.freezePanes.alwaysCalledWith(anchor.rowIdx,
                  anchor.colIdx));
          });


          it('should set the row, col Idx of dcp data to 0, 0 and its inverse' +
              ' should have the row, col Idx of dcp data set to that of the' +
              ' anchor cell on which freeze was applied', function() {
                var freezeCmd =
                      SetFreezePanes.create(anchor.rowIdx, anchor.colIdx);
                //freeze panes
                freezeCmd.doDirtyOptimistic();

                var cellA1 = {rowIdx: 0, colIdx: 0};
                var unfreezeCmd =
                      SetFreezePanes.create(cellA1.rowIdx, cellA1.colIdx);
                var inverseCmd = unfreezeCmd.getInverse();

                var unfreezeCmdDcpData = unfreezeCmd.dcpData();
                var inverseCmdDcpData = inverseCmd.dcpData();

                assert.strictEqual(unfreezeCmdDcpData.ri, cellA1.rowIdx);
                assert.strictEqual(unfreezeCmdDcpData.ci, cellA1.colIdx);
                assert.strictEqual(inverseCmdDcpData.ri, anchor.rowIdx);
                assert.strictEqual(inverseCmdDcpData.ci, anchor.colIdx);
          });
        });
      });
  });
});
