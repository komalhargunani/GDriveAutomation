//
// Copyright Google, Inc, 2013
//
define([
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager'
], function(
    ColHeaderContainer,
    SheetModel,
    PubSub,
    SheetSelectionManager) {

  'use strict';

  describe('The sheet col header container widget', function() {
    var rootNode, selection;

    var reqEvent = 'qowt:sheet:requestColumnFocus';
    var cont = 'qowt-sheet-col-header-container';
    var frozenCont = 'qowt-sheet-frozen-col-header-container';

    selection = {};
    selection.anchor = {};
    selection.anchor.rowIdx = 5;
    selection.anchor.colIdx = 1;
    selection.topLeft = {};
    selection.topLeft.rowIdx = 5;
    selection.topLeft.colIdx = 1;
    selection.bottomRight = {};
    selection.bottomRight.rowIdx = 5;
    selection.bottomRight.colIdx = 1;
    selection.contentType = 'sheetCell';

    beforeEach(function() {
      rootNode = document.createElement('div');
      ColHeaderContainer.init();
      SheetSelectionManager.init();


      SheetModel.activeSheetIndex = 0;

      SheetModel.ColPos = [0, 50, 100, 150, 200];
      SheetModel.ColWidths = [50, 50, 50, 50, 50];
      // We are now considering the scroll information to choose the anchor
      // when column header is clicked. However for the unit-tests we abstain
      // from considering the scroll information since it would induce
      // dependencies on other modules. For the UT's to succeed at least the
      // default position(left most) '0' should be available.
      SheetModel.RowPos = [0];
    });

    afterEach(function() {
      var evt = document.createEvent('Event');
      evt.initEvent('mouseup', true, false);
      rootNode.classList.add('qowt-sheet-col-header-container');
      rootNode.dispatchEvent(evt);

      rootNode = undefined;
      SheetModel.ColPos = undefined;
      SheetModel.ColWidths = undefined;
      SheetModel.activeSheetIndex = undefined;
    });

    it('should exist with the correct classes after construction', function() {
      ColHeaderContainer.appendTo(rootNode);
      expect(rootNode.getElementsByClassName(cont).length).toBe(1);
      expect(rootNode.getElementsByClassName(frozenCont).length).toBe(1);
    });

    it('should send correct sel when clicked', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(SheetSelectionManager, 'getCurrentSelection').andCallFake(
          function() {
            return selection;
          });

      var evt = document.createEvent('Event');
      evt.initEvent('mousedown', true, false);
      evt.zoomedX = 75;
      var colHeaderContainer = ColHeaderContainer.container();
      colHeaderContainer.classList.add('qowt-sheet-col-header-container');
      colHeaderContainer.dispatchEvent(evt);

      var sel = { };
      sel.anchor = { };
      sel.topLeft = { };
      sel.bottomRight = { };
      sel.contentType = 'sheetCell';

      //when clicked on the column header 1st cell becomes the anchor cell.
      sel.anchor.rowIdx = 0;
      sel.anchor.colIdx = 1;
      sel.topLeft.colIdx = 1;
      sel.bottomRight.colIdx = 1;

      expect(PubSub.publish.callCount).toEqual(1);
      expect(PubSub.publish).toHaveBeenCalledWith(reqEvent, sel);
    });

    it('should send correct sel when clicked and mouse moved', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(SheetSelectionManager, 'getCurrentSelection').andCallFake(
          function() {
            return selection;
          });

      var evt = document.createEvent('Event');
      evt.initEvent('mousedown', true, false);
      evt.zoomedX = 75;

      var colHeaderContainer = ColHeaderContainer.container();
      colHeaderContainer.classList.add('qowt-sheet-col-header-container');
      colHeaderContainer.dispatchEvent(evt);

      var sel = { };
      sel.anchor = { };
      sel.topLeft = { };
      sel.bottomRight = { };
      sel.contentType = 'sheetCell';

      //when clicked on the column header 1st cell becomes the anchor cell
      sel.anchor.rowIdx = 0;
      sel.anchor.colIdx = 1;
      sel.topLeft.colIdx = 1;
      sel.bottomRight.colIdx = 1;

      expect(PubSub.publish).toHaveBeenCalledWith(reqEvent, sel);

      // And move mouse
      var evt2 = document.createEvent('Event');
      evt2.initEvent('mousemove', true, false);
      evt2.zoomedX = 125;
      document.dispatchEvent(evt2);

      expect(PubSub.publish.callCount).toEqual(2);
      expect(PubSub.publish.calls[1].args[0]).toBe(reqEvent);
      expect(PubSub.publish.calls[1].args[1].anchor.rowIdx).toBe(5);
      expect(PubSub.publish.calls[1].args[1].anchor.colIdx).toBe(1);
      expect(PubSub.publish.calls[1].args[1].topLeft.rolIdx).toBe(undefined);
      expect(PubSub.publish.calls[1].args[1].topLeft.colIdx).toBe(1);
      expect(PubSub.publish.calls[1].args[1].bottomRight.rolIdx).toBe(
          undefined);
      expect(PubSub.publish.calls[1].args[1].bottomRight.colIdx).toBe(2);
    });

    it('should not send selection if clicked close to border', function() {
      spyOn(PubSub, 'publish').andCallThrough();

      // First hover on top of the container
      var evt = document.createEvent('Event');
      evt.initEvent('mousemove', true, false);
      evt.zoomedX = 48;
      var colHeaderContainer = ColHeaderContainer.container();
      colHeaderContainer.classList.add('qowt-sheet-col-header-container');
      colHeaderContainer.dispatchEvent(evt);

      // Then click on it
      var evt2 = document.createEvent('Event');
      evt2.initEvent('mousedown', true, false);
      evt2.zoomedX = 48;
      document.dispatchEvent(evt2);

      expect(PubSub.publish.callCount).toEqual(0);
    });

    it('should select column range when single column is selected and shift +' +
        ' click is performed on another column header', function() {
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(SheetSelectionManager, 'getCurrentSelection').andCallFake(
              function() {
                return selection;
              });

          var evt = document.createEvent('Event');
          evt.initEvent('mousedown', true, false);
          evt.zoomedX = 75;
          var colHeaderContainer = ColHeaderContainer.container();
          colHeaderContainer.classList.add('qowt-sheet-col-header-container');
          colHeaderContainer.dispatchEvent(evt);

          var evt2 = document.createEvent('Event');
          evt2.initEvent('mouseup', true, false);
          document.dispatchEvent(evt2);


          var sel = { };
          sel.anchor = { };
          sel.topLeft = { };
          sel.bottomRight = { };
          sel.contentType = 'sheetCell';

          sel.anchor.rowIdx = 5;
          sel.anchor.colIdx = 1;
          sel.topLeft.colIdx = 1;
          sel.bottomRight.colIdx = 1;

          selection = sel;
          var evt3 = document.createEvent('Event');
          evt3.initEvent('mousedown', true, false);
          evt3.zoomedX = 175;
          evt3.shiftKey = true;
          colHeaderContainer.dispatchEvent(evt3);

          var columnRangeSelection = { };
          columnRangeSelection.anchor = { };
          columnRangeSelection.topLeft = { };
          columnRangeSelection.bottomRight = { };
          columnRangeSelection.contentType = 'sheetCell';

          columnRangeSelection.anchor.rowIdx = 5;
          columnRangeSelection.anchor.colIdx = 1;
          columnRangeSelection.topLeft.colIdx = 1;
          columnRangeSelection.bottomRight.colIdx = 3;

          expect(PubSub.publish.callCount).toEqual(2);
          expect(PubSub.publish).toHaveBeenCalledWith(reqEvent,
              columnRangeSelection);
        });


    it('should not publish selection if selection is not defined',
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

    it('should calculate column header index if it is null', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      ColHeaderContainer.setColHeaderIndex(null);

      var evt2 = document.createEvent('Event');
      evt2.initEvent('mousedown', true, false);
      evt2.zoomedX = 48;
      var colHeaderContainer = ColHeaderContainer.container();
      colHeaderContainer.classList.add('qowt-sheet-col-header-container');
      colHeaderContainer.dispatchEvent(evt2);

      expect(ColHeaderContainer.mouseTargetHeaderIndex()).toBeDefined();
    });

    it('should select 0th column if clicked on left grid line of 0th column',
      function() {
        spyOn(PubSub, 'publish').andCallThrough();
        ColHeaderContainer.setColHeaderIndex(0);
        var evt2 = document.createEvent('Event');
        evt2.initEvent('mousedown', true, false);
        evt2.zoomedX = 0;
        var colHeaderContainer = ColHeaderContainer.container();
        colHeaderContainer.classList.add('qowt-sheet-col-header-container');
        colHeaderContainer.dispatchEvent(evt2);

        expect(ColHeaderContainer.mouseTargetHeaderIndex()).toBe(0);
      });

    it('should throw if ColHeaderContainer.init() called multiple times',
       function() {
         expect(ColHeaderContainer.init).
             toThrow('colHeaderContainer.init() called multiple times.');
       });
  });

});
