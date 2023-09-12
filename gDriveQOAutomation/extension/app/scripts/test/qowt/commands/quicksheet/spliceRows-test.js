define([
  'test/qowt/commands/commandTestUtils',
  'qowtRoot/commands/quicksheet/spliceRows',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub'
], function(
    CommandTestUtils,
    SpliceRows,
    PaneManager,
    SheetModel,
    PubSub) {

  'use strict';

  describe('Sheet; "SpliceRows" command creation', function() {
    it('should not throw error during creation when correct input parameters ' +
        'are passed', function() {
         assert.doesNotThrow(function() {
           SpliceRows.create(3, 4);
         }, Error, 'should not throw error during creation');
       });

    it('should not throw error during creation when numOfRows parameter is ' +
        'missing', function() {
         assert.doesNotThrow(function() {
           SpliceRows.create(2);
         }, Error, 'should not throw error during creation');
       });

    it('should not throw error during creation when all the parameters are ' +
        'passed', function() {
         assert.doesNotThrow(function() {
           SpliceRows.create(2, 4, true);
         }, Error, 'should not throw error during creation');
       });

    it('should throw error during command creation when rowIndex is ' +
        'undefined in input parameters', function() {
         assert.throws(function() {
            SpliceRows.create(undefined, 2);
          }, undefined, 'ERROR: SpliceRows requires index');
       });
  });


  describe('Sheet; "SpliceRows" command properties.', function() {
    var cmd_, rowIndex_, numRows_, opt_isDelete, sandbox_;

    beforeEach(function() {
      SheetModel.activeSheetIndex = 1;
      rowIndex_ = 2;
      numRows_ = 1;
      opt_isDelete = false;
      cmd_ = SpliceRows.create(rowIndex_, numRows_, opt_isDelete);
      sandbox_ = sinon.sandbox.create();
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
      rowIndex_ = undefined;
      numRows_ = undefined;
      opt_isDelete = undefined;
      cmd_ = undefined;
      sandbox_.restore();
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        CommandTestUtils.expectIsCmdNameAsExpected(cmd_, 'SpliceRows');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        CommandTestUtils.expectIsOptimistic(cmd_, true);
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        CommandTestUtils.expectCallsService(cmd_, true);
      });
    });

    describe('id:', function() {
      it('Should provide id', function() {
        CommandTestUtils.expectCommandId(cmd_);
      });
    });

    describe('doOptimistic:', function() {
      beforeEach(function() {
        sandbox_.stub(PaneManager, 'insertRows');
        sandbox_.stub(PaneManager, 'deleteRows');
      });

      it('Should override doOptimistic', function() {
        assert.isFunction(cmd_.doOptimistic,
            cmd_.name + '.doOptimistic() should be of type function');
      });

      it('doOptimistic() method should call PaneManager.insertRows when ' +
          'command is created for insertion of rows', function() {
           cmd_.doOptimistic();
           assert.isTrue(PaneManager.insertRows.calledWith(rowIndex_, numRows_),
               'PaneManager.insertRows should be called');
           assert.isFalse(PaneManager.deleteRows.called,
               'PaneManager.deleteRows should not be called');
         });

      it('doOptimistic() method should call PaneManager.deleteRows when ' +
          'command is created for deletion of rows', function() {
           opt_isDelete = true;
           cmd_ = SpliceRows.create(rowIndex_, numRows_, opt_isDelete);
           cmd_.doOptimistic();
           assert.isTrue(PaneManager.deleteRows.calledWith(rowIndex_, numRows_),
               'PaneManager.deleteRows should be called');
           assert.isFalse(PaneManager.insertRows.called,
               'PaneManager.insertRows should not be called');
         });
    });

    describe('doRevert:', function() {
      beforeEach(function() {
        sandbox_.stub(PaneManager, 'insertRows');
        sandbox_.stub(PaneManager, 'deleteRows');
      });

      it('Should override doRevert', function() {
        CommandTestUtils.expectIsRevertible(cmd_, true);
      });

      it('doRevert() method should call PaneManager.deleteRows when ' +
          'command is created for insertion of rows', function() {
           cmd_.doRevert();
           assert.isTrue(PaneManager.deleteRows.calledWith(rowIndex_, numRows_),
               'PaneManager.deleteRows should be called');
           assert.isFalse(PaneManager.insertRows.called,
               'PaneManager.insertRows should not be called');
         });

      it('doRevert() method should call PaneManager.insertRows when ' +
          'command is created for deletion of rows', function() {
           opt_isDelete = true;
           cmd_ = SpliceRows.create(rowIndex_, numRows_, opt_isDelete);
           cmd_.doRevert();
           assert.isTrue(PaneManager.insertRows.calledWith(rowIndex_, numRows_),
               'PaneManager.insertRows should be called');
           assert.isFalse(PaneManager.deleteRows.called,
               'PaneManager.deleteRows should not be called');
         });
    });

    describe('doOptimistic and doRevert executed sequentially ', function() {
      beforeEach(function() {
        sandbox_.stub(PaneManager, 'insertRows');
        sandbox_.stub(PaneManager, 'deleteRows');
      });

      it('Should call paneManagers\'s insertRows & deleteRows methods when ' +
          'command is for insertRows', function() {
           cmd_.doOptimistic();
           cmd_.doRevert();
           assert.isTrue(PaneManager.insertRows.calledWith(rowIndex_, numRows_),
               'PaneManager.insertRows should be called');
           assert.isTrue(PaneManager.deleteRows.calledWith(rowIndex_, numRows_),
               'PaneManager.deleteRows should be called');
         });

      it('Should call paneManagers\'s insertRows & deleteRows methods when ' +
          'command is for deleteRows', function() {
           opt_isDelete = true;
           cmd_ = SpliceRows.create(rowIndex_, numRows_, opt_isDelete);
           cmd_.doOptimistic();
           cmd_.doRevert();
           assert.isTrue(PaneManager.deleteRows.calledWith(rowIndex_, numRows_),
               'PaneManager.deleteRows should be called');
           assert.isTrue(PaneManager.insertRows.calledWith(rowIndex_, numRows_),
               'PaneManager.insertRows should be called');
         });
    });

    describe('canInvert:', function() {
      it('Should provide canInvert property', function() {
        assert.isTrue(cmd_.canInvert, 'canInvert should be true');
      });
    });

    describe('getInverse:', function() {
      it('Should override getInverse', function() {
        CommandTestUtils.expectIsRevertible(cmd_, true);
      });

      it('Should get correct inverse', function() {
        CommandTestUtils.generatesExpectedInverse(cmd_, 'UndoCommand');
      });
    });

    describe('dcpData:', function() {
      it('Should provide dcpData', function() {
        assert.isFunction(cmd_.dcpData,
            cmd_.name + '.dcpData() should be of type function');
      });

      it('Should return insert payload data for insert rows command',
         function() {
           var expectedPayload = {
             name: 'spr',
             ri: 2,
             nu: 1,
             de: false,
             si: 1,
             bs: 500
           };
           var payload = cmd_.dcpData();
           assert.deepEqual(payload, expectedPayload, 'incorrect payload');
         });

      it('Should return delete payload data for delete rows command',
         function() {
           opt_isDelete = true;
           cmd_ = SpliceRows.create(rowIndex_, numRows_, opt_isDelete);
           var expectedPayload = {
             name: 'spr',
             ri: 2,
             nu: 1,
             de: true,
             si: 1,
             bs: 500
           };
           var payload = cmd_.dcpData();
           assert.deepEqual(payload, expectedPayload, 'incorrect payload');
         });

      it('Should lock the screen', function() {
        sandbox_.stub(PubSub, 'publish');
        cmd_.dcpData();

        assert.strictEqual(PubSub.publish.firstCall.args[0], 'qowt:lockScreen',
            'PubSub.publish should called with correct event type');
        assert.deepEqual(PubSub.publish.firstCall.args[1], {},
            'PubSub.publish should called with correct event data');
      });
    });
  });
});
