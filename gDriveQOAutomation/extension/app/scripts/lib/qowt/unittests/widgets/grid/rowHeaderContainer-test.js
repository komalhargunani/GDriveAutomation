//
// Copyright Google, Inc, 2013
//
define([
  'qowtRoot/widgets/grid/rowHeaderContainer',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager'
], function(
    RowHeaderContainer,
    SheetModel,
    PubSub,
    SheetSelectionManager) {

  'use strict';

  describe('The sheet row header container widget', function() {
    var rootNode, selection;

    var reqEvent = 'qowt:sheet:requestRowFocus';
    var cont = 'qowt-sheet-row-header-container';
    var frozenCont = 'qowt-sheet-frozen-row-header-container';

    selection = {};
    selection.anchor = {};
    selection.anchor.rowIdx = 1;
    selection.anchor.colIdx = 5;
    selection.topLeft = {};
    selection.topLeft.rowIdx = 1;
    selection.topLeft.colIdx = 5;
    selection.bottomRight = {};
    selection.bottomRight.rowIdx = 1;
    selection.bottomRight.colIdx = 5;
    selection.contentType = 'sheetCell';

    beforeEach(function() {
      rootNode = document.createElement('div');
      SheetSelectionManager.init();
      RowHeaderContainer.init();
      SheetModel.activeSheetIndex = 0;

      SheetModel.RowPos = [0, 50, 100, 150, 200];
      SheetModel.RowHeights = [50, 50, 50, 50, 50];
      // We are now considering the scroll information to choose the anchor
      // when row header is clicked. However for the unit-tests we abstain from
      // considering the scroll information since it would induce dependencies
      // on other modules. For the UT's to succeed at least the default
      // position(left most) '0' should be available.
      SheetModel.ColPos = [0];
    });

    afterEach(function() {
      var evt = document.createEvent('Event');
      evt.initEvent('mouseup', true, false);
      document.dispatchEvent(evt);

      rootNode = undefined;
      SheetModel.RowPos = undefined;
      SheetModel.RowHeights = undefined;
      SheetModel.activeSheetIndex = undefined;
    });

    it('should exist with the correct classes after construction', function() {

      RowHeaderContainer.appendTo(rootNode);
      expect(rootNode.getElementsByClassName(cont).length).toBe(1);
      expect(rootNode.getElementsByClassName(frozenCont).length).toBe(1);
    });

    it('should send correct sel when clicked', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(SheetSelectionManager, 'getCurrentSelection').
          andCallFake(function() {
            return selection;
          });

      var evt = document.createEvent('Event');
      evt.initEvent('mousedown', true, false);
      evt.zoomedY = 75;
      var rowHeaderContainer = RowHeaderContainer.container();
      rowHeaderContainer.classList.add('qowt-sheet-row-header-container');
      rowHeaderContainer.dispatchEvent(evt);

      var sel = { };
      sel.anchor = { };
      sel.topLeft = { };
      sel.bottomRight = { };
      sel.contentType = 'sheetCell';

      //when clicked on the row header 1st cell becomes the anchor cell
      sel.anchor.colIdx = 0;
      sel.anchor.rowIdx = 1;
      sel.topLeft.rowIdx = 1;
      sel.bottomRight.rowIdx = 1;

      expect(PubSub.publish.callCount).toEqual(1);
      expect(PubSub.publish).toHaveBeenCalledWith(reqEvent, sel);
    });

    it('should send correct sel when clicked and mouse moved', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(SheetSelectionManager, 'getCurrentSelection').
          andCallFake(function() {
            return selection;
          });

      // Then click on it
      var evt = document.createEvent('Event');
      evt.initEvent('mousedown', true, false);
      evt.zoomedY = 75;
      var rowHeaderContainer = RowHeaderContainer.container();
      rowHeaderContainer.classList.add('qowt-sheet-row-header-container');
      rowHeaderContainer.dispatchEvent(evt);

      var sel = { };
      sel.anchor = { };
      sel.topLeft = { };
      sel.bottomRight = { };
      sel.contentType = 'sheetCell';

      //when clicked on the row header 1st cell becomes the anchor cell
      sel.anchor.colIdx = 0;
      sel.anchor.rowIdx = 1;
      sel.topLeft.rowIdx = 1;
      sel.bottomRight.rowIdx = 1;

      expect(PubSub.publish).toHaveBeenCalledWith(reqEvent, sel);

      // And move mouse
      var evt3 = document.createEvent('Event');
      evt3.initEvent('mousemove', true, false);
      evt3.zoomedY = 125;
      document.dispatchEvent(evt3);

      expect(PubSub.publish.callCount).toEqual(2);
      expect(PubSub.publish.calls[1].args[0]).toBe(reqEvent);
      expect(PubSub.publish.calls[1].args[1].anchor.colIdx).toBe(5);
      expect(PubSub.publish.calls[1].args[1].anchor.rowIdx).toBe(1);
      expect(PubSub.publish.calls[1].args[1].topLeft.colIdx).toBe(undefined);
      expect(PubSub.publish.calls[1].args[1].topLeft.rowIdx).toBe(1);
      expect(PubSub.publish.calls[1].args[1].bottomRight.colIdx).toBe(
          undefined);
      expect(PubSub.publish.calls[1].args[1].bottomRight.rowIdx).toBe(2);
    });

    it('should not send selection if clicked close to border', function() {
      spyOn(PubSub, 'publish').andCallThrough();

      var evt = document.createEvent('Event');
      evt.initEvent('mousedown', true, false);
      evt.zoomedY = 48;
      var rowHeaderContainer = RowHeaderContainer.container();
      rowHeaderContainer.classList.add('qowt-sheet-row-header-container');
      rowHeaderContainer.dispatchEvent(evt);

      expect(PubSub.publish.callCount).toEqual(0);
    });

    it('should select row range when single row is selected ' +
        'and shift + click is performed on another row header', function() {
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(SheetSelectionManager, 'getCurrentSelection').andCallFake(
              function() {
                return selection;
              });

          var evt = document.createEvent('Event');
          evt.initEvent('mousedown', true, false);
          evt.zoomedX = 75;
          var rowHeaderContainer = RowHeaderContainer.container();
          rowHeaderContainer.classList.add('qowt-sheet-row-header-container');
          rowHeaderContainer.dispatchEvent(evt);

          var evt2 = document.createEvent('Event');
          evt2.initEvent('mouseup', true, false);
          document.dispatchEvent(evt2);


          var sel = { };
          sel.anchor = { };
          sel.topLeft = { };
          sel.bottomRight = { };
          sel.contentType = 'sheetCell';

          sel.anchor.rowIdx = 1;
          sel.anchor.colIdx = 5;
          sel.topLeft.rowIdx = 1;
          sel.bottomRight.rowIdx = 1;


          selection = sel;

          var evt3 = document.createEvent('Event');
          evt3.initEvent('mousedown', true, false);
          evt3.shiftKey = true;
          evt3.zoomedY = 175;
          rowHeaderContainer.dispatchEvent(evt3);

          var columnRangeSelection = { };
          columnRangeSelection.anchor = { };
          columnRangeSelection.topLeft = { };
          columnRangeSelection.bottomRight = { };
          columnRangeSelection.contentType = 'sheetCell';

          columnRangeSelection.anchor.rowIdx = 1;
          columnRangeSelection.anchor.colIdx = 5;
          columnRangeSelection.topLeft.rowIdx = 1;
          columnRangeSelection.bottomRight.rowIdx = 3;

          expect(PubSub.publish.callCount).toEqual(2);
          expect(PubSub.publish).toHaveBeenCalledWith(reqEvent,
              columnRangeSelection);
        });

    it('should not publish selection, if selection is not defined',
      function () {
        spyOn(PubSub, 'publish').andCallThrough();
        spyOn(SheetSelectionManager, 'getCurrentSelection').andCallFake(
          function () {
            return undefined;
          });

        var event = document.createEvent('Event');
        event.initEvent('mousemove', true, false);
        event.zoomedX = 125;
        document.dispatchEvent(event);

        expect(PubSub.publish.callCount).toEqual(0);
        expect(PubSub.publish).not.toHaveBeenCalled();
      });

    it('should not publish selection if contentType is not sheetCell',
      function () {
        var sel = selection;
        sel.contentType = undefined;
        spyOn(PubSub, 'publish').andCallThrough();
        spyOn(SheetSelectionManager, 'getCurrentSelection').andCallFake(
          function () {
            return sel;
          });

        var event = document.createEvent('Event');
        event.initEvent('mousemove', true, false);
        event.zoomedX = 125;
        document.dispatchEvent(event);

        expect(PubSub.publish.callCount).toEqual(0);
        expect(PubSub.publish).not.toHaveBeenCalled();
      });

    it('should calculate row header index if it is null', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      RowHeaderContainer.setRowHeaderIndex(null);

      var evt = document.createEvent('Event');
      evt.initEvent('mousedown', true, false);
      evt.zoomedY = 148;
      var rowHeaderContainer = RowHeaderContainer.container();
      rowHeaderContainer.classList.add('qowt-sheet-row-header-container');
      rowHeaderContainer.dispatchEvent(evt);

      expect(RowHeaderContainer.mouseTargetHeaderIndex()).toBeDefined();
    });

    it('should select 0th row if clicked on top grid line of 0th row',
      function() {
      spyOn(PubSub, 'publish').andCallThrough();
      RowHeaderContainer.setRowHeaderIndex(0);
      var evt2 = document.createEvent('Event');
      evt2.initEvent('mousedown', true, false);
      evt2.zoomedY = 0;
      var rowHeaderContainer = RowHeaderContainer.container();
      rowHeaderContainer.classList.add('qowt-sheet-row-header-container');
      rowHeaderContainer.dispatchEvent(evt2);

      expect(RowHeaderContainer.mouseTargetHeaderIndex()).toBe(0);
    });

    it('should throw error when rowHeaderContainer.init() called multiple' +
        ' times', function() {
          expect(RowHeaderContainer.init).toThrow(
              'rowHeaderContainer.init() called multiple times.');
        });
  });

});
