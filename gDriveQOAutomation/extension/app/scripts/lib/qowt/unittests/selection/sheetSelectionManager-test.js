define([
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/toolManager',
  'qowtRoot/tools/sheet/sheetCellTool',
  'qowtRoot/tools/sheet/sheetTextTool',
  'qowtRoot/tools/sheet/sheetImageTool',
  'qowtRoot/tools/sheet/sheetChartTool'
], function(
    SheetSelectionManager,
    SheetModel,
    PubSub,
    ToolsManager,
    SheetCellTool,
    SheetTextTool,
    SheetImageTool,
    SheetChartTool) {

  'use strict';

  describe('The sheet selection manager', function() {

    describe('storing and retrieving selections', function() {

      beforeEach(function() {
        SheetSelectionManager.init();
        SheetModel.activeSheetIndex = 2;
        spyOn(SheetCellTool, 'activate').andCallFake(function() {});
        spyOn(SheetTextTool, 'activate').andCallFake(function() {});
        spyOn(SheetImageTool, 'activate').andCallFake(function() {});
        spyOn(SheetChartTool, 'activate').andCallFake(function() {});
        spyOn(SheetCellTool, 'deactivate').andCallFake(function() {});
        spyOn(SheetTextTool, 'deactivate').andCallFake(function() {});
        spyOn(SheetImageTool, 'deactivate').andCallFake(function() {});
        spyOn(SheetChartTool, 'deactivate').andCallFake(function() {});
      });

      afterEach(function() {
        PubSub.publish('qowt:tool:requestDeactivate', undefined);
      });

      it('should add the new selection object to the top of its stack when ' +
          'it receives a "qowt:sheet:requestFocus" signal', function() {
            var sel = {
              anchor: {rowIdx: 18, colIdx: 3},
              topLeft: {rowIdx: 18, colIdx: 3},
              bottomRight: {rowIdx: 18, colIdx: 3},
              contentType: 'sheetCell'
            };
            PubSub.publish('qowt:sheet:requestFocus', sel);

            // check that the new selection is returned as the current selection
            var retrievedSel = SheetSelectionManager.getCurrentSelection();
            expect(retrievedSel).toBeDefined();
            expect(retrievedSel.anchor).toBeDefined();
            expect(retrievedSel.anchor.rowIdx).toBe(18);
            expect(retrievedSel.anchor.colIdx).toBe(3);
            expect(retrievedSel.topLeft.rowIdx).toBe(18);
            expect(retrievedSel.topLeft.colIdx).toBe(3);
            expect(retrievedSel.bottomRight.rowIdx).toBe(18);
            expect(retrievedSel.bottomRight.colIdx).toBe(3);
          });

      it('should broadcast a "qowt:selectionChanged" signal when it receives ' +
          'a "qowt:sheet:requestFocus" signal', function() {
            var firstSel = {
              anchor: {rowIdx: 24, colIdx: 13},
              topLeft: {rowIdx: 24, colIdx: 13},
              bottomRight: {rowIdx: 24, colIdx: 13},
              contentType: 'sheetCell'
            };
            PubSub.publish('qowt:sheet:requestFocus', firstSel);

            spyOn(PubSub, 'publish').andCallThrough();

            var secondSel = {
              anchor: {rowIdx: 6, colIdx: 22},
              topLeft: {rowIdx: 6, colIdx: 22},
              bottomRight: {rowIdx: 6, colIdx: 22}
            };
            PubSub.publish('qowt:sheet:requestFocus', secondSel);

            expect(PubSub.publish.calls[1].args[0]).toBe(
                'qowt:selectionChanged');
          });

      it('should activate the Sheet Cell Tool when it receives ' +
          'a "qowt:sheet:requestFocus" signal with contentType of "sheetCell"',
          function() {
            var sel = {
              contentType: 'sheetCell'
            };
            PubSub.publish('qowt:sheet:requestFocus', sel);

            expect(ToolsManager.activeTool).toBe('sheetCell');
          });

      it('should activate the Sheet Text Tool when it receives ' +
          'a "qowt:sheet:requestFocus" signal with contentType of "sheetText"',
          function() {
            var sel = {
              contentType: 'sheetText'
            };
            PubSub.publish('qowt:sheet:requestFocus', sel);

            expect(ToolsManager.activeTool).toBe('sheetText');
          });

      it('should activate the Sheet Image Tool when it receives ' +
          'a "qowt:sheet:requestFocus" signal with contentType ' +
          'of "sheetFloaterImage"', function() {
            var sel = {
              contentType: 'sheetFloaterImage'
            };
            PubSub.publish('qowt:sheet:requestFocus', sel);

            expect(ToolsManager.activeTool).toBe('sheetFloaterImage');
          });

      it('should activate the Sheet Chart Tool when it receives ' +
          'a "qowt:sheet:requestFocus" signal with contentType ' +
          'of "sheetFloaterChart"', function() {
            var sel = {
              contentType: 'sheetFloaterChart'
            };
            PubSub.publish('qowt:sheet:requestFocus', sel);

            expect(ToolsManager.activeTool).toBe('sheetFloaterChart');
          });

      it('should remove the topmost selection object from its stack when it ' +
          'receives a "qowt:sheet:requestFocusLost" signal', function() {
            // add a couple of selection objects to the stack
            var firstSel = {
              anchor: {rowIdx: 21, colIdx: 5},
              topLeft: {rowIdx: 21, colIdx: 5},
              bottomRight: {rowIdx: 21, colIdx: 5},
              contentType: 'sheetCell'
            };
            PubSub.publish('qowt:sheet:requestFocus', firstSel);
            var secondSel = {
              contentType: 'sheetText'
            };
            PubSub.publish('qowt:sheet:requestFocus', secondSel);

            // check that secondSel is returned as the current selection
            var retrievedSel = SheetSelectionManager.getCurrentSelection();
            expect(retrievedSel).toBeDefined();
            expect(retrievedSel.contentType).toBe('sheetText');

            // publish a requestFocusLost signal
            PubSub.publish('qowt:sheet:requestFocusLost');

            // check that firstSel is now returned as the current selection
            retrievedSel = SheetSelectionManager.getCurrentSelection();
            expect(retrievedSel).toBeDefined();
            expect(retrievedSel.contentType).toBe('sheetCell');
            expect(retrievedSel.anchor).toBeDefined();
            expect(retrievedSel.anchor.rowIdx).toBe(21);
            expect(retrievedSel.anchor.colIdx).toBe(5);
            expect(retrievedSel.topLeft.rowIdx).toBe(21);
            expect(retrievedSel.topLeft.colIdx).toBe(5);
            expect(retrievedSel.bottomRight.rowIdx).toBe(21);
            expect(retrievedSel.bottomRight.colIdx).toBe(5);
          });

      it('should broadcast a "qowt:selectionChanged" signal when it receives ' +
          'a "qowt:sheet:requestFocusLost" signal', function() {
            var firstSel = {
              anchor: {rowIdx: 24, colIdx: 13},
              topLeft: {rowIdx: 24, colIdx: 13},
              bottomRight: {rowIdx: 24, colIdx: 13},
              contentType: 'sheetCell'
            };
            PubSub.publish('qowt:sheet:requestFocus', firstSel);
            var secondSel = {
              anchor: {rowIdx: 6, colIdx: 22},
              topLeft: {rowIdx: 6, colIdx: 22},
              bottomRight: {rowIdx: 6, colIdx: 22}
            };
            PubSub.publish('qowt:sheet:requestFocus', secondSel);

            spyOn(PubSub, 'publish').andCallThrough();

            PubSub.publish('qowt:sheet:requestFocusLost', secondSel);

            expect(PubSub.publish.calls[1].args[0]).toBe(
                'qowt:selectionChanged');
          });

      it('should activate the Sheet Cell Tool when it receives ' +
          'a "qowt:sheet:requestFocusLost" signal and the stack\'s second-top' +
          ' object has a contentType of "sheetCell"', function() {
            var firstSel = {
              contentType: 'sheetCell'
            };
            PubSub.publish('qowt:sheet:requestFocus', firstSel);
            var secondSel = {
              contentType: 'sheetText'
            };
            PubSub.publish('qowt:sheet:requestFocus', secondSel);

            PubSub.publish('qowt:sheet:requestFocusLost');

            expect(ToolsManager.activeTool).toBe('sheetCell');
          });

      it('should activate the Sheet Image Tool when it receives ' +
          'a "qowt:sheet:requestFocusLost" signal and the stack\'s second-top' +
          ' object has a contentType of "sheetFloaterImage"', function() {
            var firstSel = {
              contentType: 'sheetFloaterImage'
            };
            PubSub.publish('qowt:sheet:requestFocus', firstSel);
            var secondSel = {
              contentType: 'sheetText'
            };
            PubSub.publish('qowt:sheet:requestFocus', secondSel);

            PubSub.publish('qowt:sheet:requestFocusLost');

            expect(ToolsManager.activeTool).toBe('sheetFloaterImage');
          });

      it('should activate the Sheet Chart Tool when it receives ' +
          'a "qowt:sheet:requestFocusLost" signal and the stack\'s second-top' +
          ' object has a contentType of "sheetFloaterChart"', function() {
            var firstSel = {
              contentType: 'sheetFloaterChart'
            };
            PubSub.publish('qowt:sheet:requestFocus', firstSel);
            var secondSel = {
              contentType: 'sheetText'
            };
            PubSub.publish('qowt:sheet:requestFocus', secondSel);

            PubSub.publish('qowt:sheet:requestFocusLost');

            expect(ToolsManager.activeTool).toBe('sheetFloaterChart');
          });

      it('should be able to retrieve the current selection for the active ' +
          'sheet', function() {
            SheetModel.activeSheetIndex = 7;

            var sel = {};
            sel.anchor = {};
            sel.anchor.rowIdx = 5;
            sel.anchor.colIdx = 6;
            PubSub.publish('qowt:sheet:requestFocus', sel);

            var retrievedSel = SheetSelectionManager.getCurrentSelection();
            expect(retrievedSel).toBeDefined();
            expect(retrievedSel.anchor).toBeDefined();
            expect(retrievedSel.anchor.rowIdx).toBe(5);
            expect(retrievedSel.anchor.colIdx).toBe(6);
          });

      it('should broadcast a "qowt:selectionChanged" signal when it is reset',
          function() {
            var sheetIdx = 99;
            spyOn(PubSub, 'publish').andCallThrough();
            SheetSelectionManager.reset(sheetIdx);
            expect(PubSub.publish.calls[0].args[0]).toBe(
                'qowt:selectionChanged');
          });

      it('should deactivate the Sheet Cell Tool when it is reset', function() {
        var sheetIdx = 99;
        SheetSelectionManager.reset(sheetIdx);
        expect(ToolsManager.activeTool).toBeUndefined();
      });

      it('should throw if SheetSelectionManager.init() called multiple times',
          function() {
            expect(SheetSelectionManager.init).toThrow(
                'sheetSelectionManager.init() called multiple times.');
          });
    });
  });
});





