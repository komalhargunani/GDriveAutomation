define([
  'qowtRoot/controls/grid/selectionGestureHandler',
  'qowtRoot/pubsub/pubsub'
], function(
    SelectionGestureHandler,
    PubSub) {

  'use strict';


  var unifiedSheetSelectionObj = {
    topLeft: {rowIdx: undefined, colIdx: undefined},
    bottomRight: {rowIdx: undefined, colIdx: undefined},
    contentType: 'sheetCell'
  };

  describe('Selection gesture handler test', function() {
    var sandbox_;
    var rootNode, paneNode;

    beforeEach(function() {
      rootNode = document.createElement('div');
      paneNode = document.createElement('div');

      var stubbedPane = {
        getNumOfRows: function() {
          return 300;
        },
        getNumOfCols: function() {
          return 256;
        },
        getPaneNode: function() {
          return paneNode;
        }
      };

      var panes = [stubbedPane, stubbedPane, stubbedPane, stubbedPane];
      sandbox_ = sinon.sandbox.create();
      SelectionGestureHandler.init(panes, rootNode);
      sandbox_.spy(PubSub, 'publish');
    });


    afterEach(function() {
      PubSub.publish.restore();
      sandbox_.restore();
      SelectionGestureHandler.reset();

    });

    describe('test createUniformSelectionObject() function', function() {
      it('should create unified selection object for entire sheet selection, ' +
          'if all rows in a sheet are selected.', function() {
        var fromRowIdx = 0, toRowIdx = 299;
        publishRowSelection_(fromRowIdx, toRowIdx, undefined, undefined);
        verifyUnifiedObjForRowSelection_(unifiedSheetSelectionObj);
      });

      it('should create unified selection object for row selection, if ' +
          'multiple rows(but not all) in a sheet are selected.', function() {
        var fromRowIdx = 3, toRowIdx = 9;
        publishRowSelection_(fromRowIdx, toRowIdx, undefined, undefined);
        var unifiedRowObject = {
          topLeft: {rowIdx: fromRowIdx, colIdx: undefined},
          bottomRight: {rowIdx: toRowIdx, colIdx: undefined},
          contentType: 'sheetCell'
        };
        verifyUnifiedObjForRowSelection_(unifiedRowObject);
      });

      it('should create unified selection object for entire sheet selection, ' +
          'if all columns in a sheet are selected.', function() {
        var fromColIdx = 0, toColIdx = 255;
        publishColumnSelection_(undefined, undefined, fromColIdx, toColIdx);
        verifyUnifiedObjForColumnSelection_(unifiedSheetSelectionObj);
      });

      it('should create unified selection object for column selection, if ' +
          'multiple columns(but not all) in a sheet are selected.', function() {
        var fromColIdx = 5, toColIdx = 9;
        publishColumnSelection_(undefined, undefined, fromColIdx, toColIdx);
        var unifiedColumnObject = {
          topLeft: {rowIdx: undefined, colIdx: fromColIdx},
          bottomRight: {rowIdx: undefined, colIdx: toColIdx},
          contentType: 'sheetCell'
        };
        verifyUnifiedObjForColumnSelection_(unifiedColumnObject);
      });

      var publishRowSelection_ = function(fromRowIdx, toRowIdx, fromColIdx,
                                          toColIdx) {
        var selection = {
          topLeft: {rowIdx: fromRowIdx, colIdx: fromColIdx},
          bottomRight: {rowIdx: toRowIdx, colIdx: toColIdx},
          contentType: 'sheetCell'
        };
        PubSub.publish('qowt:sheet:requestRowFocus', selection);
      };

      var publishColumnSelection_ = function(fromRowIdx, toRowIdx, fromColIdx,
                                             toColIdx) {
        var selection = {
          topLeft: {rowIdx: fromRowIdx, colIdx: fromColIdx},
          bottomRight: {rowIdx: toRowIdx, colIdx: toColIdx},
          contentType: 'sheetCell'
        };
        PubSub.publish('qowt:sheet:requestColumnFocus', selection);
      };

      var verifyUnifiedObjForRowSelection_ = function(unifiedObject) {
        assert.isTrue(PubSub.publish.calledTwice);
        assert.strictEqual(PubSub.publish.getCall(0).args[0],
            'qowt:sheet:requestRowFocus');
        assert.strictEqual(PubSub.publish.getCall(1).args[0],
            'qowt:sheet:requestFocus');
        assert.deepEqual(PubSub.publish.getCall(1).args[1], unifiedObject,
            'requestFocus signal called with unified object.');
      };

      var verifyUnifiedObjForColumnSelection_ = function(unifiedObject) {
        assert.isTrue(PubSub.publish.calledTwice);
        assert.strictEqual(PubSub.publish.getCall(0).args[0],
            'qowt:sheet:requestColumnFocus');
        assert.strictEqual(PubSub.publish.getCall(1).args[0],
            'qowt:sheet:requestFocus');
        assert.deepEqual(PubSub.publish.getCall(1).args[1], unifiedObject,
            'requestFocus signal called with unified object.');
      };
    });
  });
});

