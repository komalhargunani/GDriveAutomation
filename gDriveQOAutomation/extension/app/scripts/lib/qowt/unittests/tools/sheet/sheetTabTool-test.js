// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview Unit test suite for the sheet tab tool
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/toolManager',
  'qowtRoot/tools/sheet/sheetTabTool',
  'qowtRoot/utils/domListener',
  'qowtRoot/features/pack',
  'qowtRoot/models/sheet',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/widgets/grid/sheetSelector',
  'qowtRoot/widgets/ui/modalDialog',
  'qowtRoot/unittests/utils/fakeEvents'
  ],
  function(
    PubSub,
    ToolsManager,
    SheetTabTool,
    DomListener,
    FeaturePack,
    SheetModel,
    SheetSelectionManager,
    SheetSelector,
    ModalDialog,
    FakeEvents) {

  'use strict';

    var kSheetTabToolName_ = "sheetTab";
    var kTabKeyCode_ = 9;
    var kEnterKeyCode_ = 13;
    var kEscapeKeyCode_ = 27;
    var kSemiColonKeyCode_ = 59;
    var kAlphabetAKeyCode_ = 65;

  describe('The sheet tab tool', function() {

    beforeEach(function() {
      SheetSelectionManager.init();
      ToolsManager.setActiveTool();
    });

    it('should be able to be activated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(kSheetTabToolName_);
      expect(ToolsManager.activeTool).toBe(kSheetTabToolName_);
      expect(SheetTabTool.isActive()).toBe(true);

    });

    it('should be able to be deactivated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(kSheetTabToolName_);
      expect(ToolsManager.activeTool).toBe(kSheetTabToolName_);
      ToolsManager.setActiveTool();
      expect(ToolsManager.activeTool).not.toBe(kSheetTabToolName_);
      expect(SheetTabTool.isActive()).toBe(false);
    });

    it('should initiate changing the sheet when activated with an ' +
        'event that is not a double-click, in the Viewer product', function() {
          FeaturePack.edit = false;
          _verifySheetChanged();
        });

    it('should initiate changing the sheet when activated with an ' +
        'event that is not a double-click, in the Editor product', function() {
          FeaturePack.edit = true;
          _verifySheetChanged();
        });

    it('should initiate changing the sheet when activated with a ' +
        'double-click event, in the Viewer product', function() {
          FeaturePack.edit = false;
          _verifySheetChanged(true);
        });

      it("should initiate a sheet name edit when activated with a " +
        "double-click event, in the Editor product", function() {
        FeaturePack.edit = true;
        var newSheetIdx = 3;
        var newSheetName = 'Sheet1';
        _verifyInitNameEdit(newSheetIdx, newSheetName);
      });

    it('should handle a sheet index of 0', function() {
      FeaturePack.edit = true;
      _verifySheetChanged(false, 0);
    });

    it('should be able to cancel a sheet name edit using the Escape key',
        function() {
          FeaturePack.edit = true;
          _verifyCancelNameEdit();
        });

    it('should be able to commit a sheet name edit using the Tab key',
        function() {
          FeaturePack.edit = true;
          var commitEvent = document.createEvent('Event');
          commitEvent.initEvent('keydown');
          commitEvent.keyCode = kTabKeyCode_;
          _verifyCommitNameEdit(commitEvent);
        });

    it('should be able to commit a sheet name edit using the Enter key',
        function() {
          FeaturePack.edit = true;
          var commitEvent = document.createEvent('Event');
          commitEvent.initEvent('keydown');
          commitEvent.keyCode = kEnterKeyCode_;
          _verifyCommitNameEdit(commitEvent);
        });

      it("should be able to commit a sheet name edit by clicking outside " +
        "of the tab", function() {
        FeaturePack.edit = true;
        var commitEvent = document.createEvent("Event");
        commitEvent.initEvent('keydown');

        _verifyCommitNameEdit();
      });

      it("should pop up a modal window whenever an attempt to commit a " +
        "duplicate sheet name is made",function(){
        FeaturePack.edit = true;
        _verifyModalWindowPopUpForDuplicateName();
      });

      it("should pop up a modal window whenever an attempt to enter a non " +
        "permissible character is made",function(){
        FeaturePack.edit = true;
        _verifyModalWindowPopUpForNPChar();
      });

      it("should pop up a modal window whenever an attempt to enter a sheet " +
        "name with more than 30 characters is made",function(){
        FeaturePack.edit = true;
        _verifyModalWindowPopUpForLength();
      });

      it("should handle qowt error and cancel sheet name update", function(){
        FeaturePack.edit = true;
        _verifyHandlingQOWTError();
      });

      it("should call trySeedSelection() in its deactivate() method",
        function() {
          spyOn(window, 'setTimeout');
          SheetTabTool.deactivate();
          expect(window.setTimeout).toHaveBeenCalledWith(
              SheetSelectionManager.trySeedSelection, 0);
      });

      it("should pop up a modal window whenever an attempt to commit a blank " +
        "sheet name is made", function(){
        FeaturePack.edit = true;
        _verifyModalWindowPopUpForBlankName();
      });

  });

  // VVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVV

  var _verifySheetChanged = function(isDblClick, newSheetIdx) {
    expect(ToolsManager.activeTool).toBeUndefined();

    spyOn(SheetSelector, 'changeActiveTab');
    spyOn(PubSub, 'publish').andCallThrough();

    SheetModel.activeSheetIndex = 0;
    if (newSheetIdx === undefined) {
      newSheetIdx = 3;
    }
    var evt = document.createEvent('Event');
    if (isDblClick) {
      evt.initEvent('dblclick', true, false);
    }
    else {
      evt.initEvent('click', true, false);
    }
    var obj = {
      sheetIndex: newSheetIdx,
      selectionEvent: evt,
      contentType: 'sheetTab'
    };
    PubSub.publish('qowt:sheet:requestFocus', obj);

    expect(SheetSelector.changeActiveTab).toHaveBeenCalledWith(newSheetIdx);
    expect(PubSub.publish).toHaveBeenCalledWith('qowt:doAction', {
      'action': 'changeSheet',
      'context': {
        contentType: 'sheet',
        newSheetIndex: newSheetIdx
      }
    });
  };

  var _verifyInitNameEdit = function(newSheetIdx, newSheetName) {
    expect(ToolsManager.activeTool).toBeUndefined();
    spyOn(SheetSelector, 'changeActiveTab');
    spyOn(SheetSelector, 'getSheetName').andReturn(newSheetName);
    spyOn(SheetSelector, 'focusTab');
    spyOn(DomListener, 'add').andCallThrough();
    spyOn(PubSub, 'publish').andCallThrough();
    spyOn(SheetSelector, 'resizeSelector');

    SheetModel.activeSheetIndex = 0;
    var evt = document.createEvent('Event');
    evt.initEvent('dblclick', true, false);
    var obj = {
      sheetIndex: newSheetIdx,
      selectionEvent: evt,
      contentType: 'sheetTab'
    };
    PubSub.publish('qowt:sheet:requestFocus', obj);

    var evt2 = document.createEvent('Event');
    evt2.initEvent('input', true, false);
    window.dispatchEvent(evt2);

    expect(SheetSelector.changeActiveTab).not.toHaveBeenCalled();
    expect(PubSub.publish.mostRecentCall.args[0]).not.toBe('qowt:doAction');
    expect(SheetSelector.getSheetName).toHaveBeenCalledWith(newSheetIdx);
    expect(SheetSelector.focusTab).toHaveBeenCalledWith(newSheetIdx);
    expect(DomListener.add).toHaveBeenCalled();
    expect(SheetSelector.resizeSelector).toHaveBeenCalled();
  };

  var _verifyCancelNameEdit = function() {
    var newSheetIdx = 3;
    var newSheetName = "Sheet1";
    _verifyInitNameEdit(newSheetIdx, newSheetName);

    spyOn(SheetSelector, 'setSheetName').andCallThrough();
    spyOn(DomListener, 'removeGroup');
    spyOn(SheetSelector, 'blurTab');
    var originalName = SheetSelector.getSheetName();

    // generate an 'Escape' keydown event
    var evt = document.createEvent('Event');
    evt.initEvent('keydown', true, false);
    evt.keyCode = kEscapeKeyCode_;
    window.dispatchEvent(evt);

    expect(SheetSelector.setSheetName).toHaveBeenCalledWith(newSheetIdx,
        originalName);
    expect(DomListener.removeGroup).toHaveBeenCalled();
    expect(SheetSelector.blurTab).toHaveBeenCalledWith(newSheetIdx, true);
  };

  var _verifyCommitNameEdit = function(commitEvent) {
    var newSheetIdx = 4;
    var newSheetName = 'Sheet2';

    _verifyInitNameEdit(newSheetIdx, newSheetName);

    spyOn(DomListener, 'removeGroup');
    spyOn(SheetSelector, 'blurTab');

    if (commitEvent) {
      // generate the event
      window.dispatchEvent(commitEvent);
    }
    else {
      FakeEvents.simulate(window, 'mousedown');
    }

    expect(PubSub.publish).toHaveBeenCalledWith('qowt:doAction',
      {
        'action': 'renameSheet',
        'context': {
          sheetIndex: newSheetIdx,
          newSheetName: SheetSelector.getSheetName(newSheetIdx),
          oldSheetName: newSheetName,
          contentType: 'sheet'
      }
    });
    expect(DomListener.removeGroup).toHaveBeenCalled();
    expect(SheetSelector.blurTab).toHaveBeenCalledWith(newSheetIdx, true);
  };

  var _verifyModalWindowPopUpForNPChar = function() {
    SheetModel.activeSheetIndex = 0;
    _prepareDummyTabForEdit('SheetAny');

    spyOn(ModalDialog,'show');
    spyOn(SheetSelector, 'blurTab');

    // generate a keypress event for semi colon which is non permissible
    // character

    var evt = document.createEvent("Event");
    evt.initEvent('keypress', true, false);
    evt.keyCode = kSemiColonKeyCode_;
    SheetSelector.getTab(SheetModel.activeSheetIndex).dispatchEvent(evt);

    expect(ModalDialog.show).toHaveBeenCalled();
    expect(SheetSelector.blurTab).toHaveBeenCalledWith(SheetModel.
      activeSheetIndex, false);
  };

  var _verifyModalWindowPopUpForLength = function() {
    SheetModel.activeSheetIndex = 1;
    _prepareDummyTabForEdit('ABCDEFGHIJKLMNOPQRSTUVWXYZ12345');

    spyOn(ModalDialog, 'show');
    spyOn(SheetSelector, 'blurTab');
      var evt = document.createEvent("Event");
      evt.initEvent('keypress', true, false);
      evt.keyCode = kAlphabetAKeyCode_;
      SheetSelector.getTab(SheetModel.activeSheetIndex).dispatchEvent(evt);

    expect(ModalDialog.show).toHaveBeenCalled();
    expect(SheetSelector.blurTab).toHaveBeenCalledWith(SheetModel.
      activeSheetIndex, false);
};

  var _verifyModalWindowPopUpForDuplicateName = function(commitEvent) {
    var newSheetIdx = 3;
    var newSheetName = 'Sheet2';
    _verifyInitNameEdit(newSheetIdx, newSheetName);

    spyOn(ModalDialog,'show');
    spyOn(SheetSelector,'isDuplicateTabName').andReturn(true);

    if(commitEvent) {
      // generate the event
      window.dispatchEvent(commitEvent);
    }
    else {
      FakeEvents.simulate(window, 'mousedown');
    }

    expect(SheetSelector.isDuplicateTabName).toHaveBeenCalled();
    expect(ModalDialog.show).toHaveBeenCalled();
  };

  var _verifyModalWindowPopUpForBlankName = function(commitEvent) {
    var newSheetIdx = 3;
    var newSheetName = '';
    _verifyInitNameEdit(newSheetIdx, newSheetName);

    spyOn(ModalDialog,'show');

    if(commitEvent) {
      // generate the event
      window.dispatchEvent(commitEvent);
    }
    else {
      FakeEvents.simulate(window, 'mousedown');
    }
    expect(ModalDialog.show).toHaveBeenCalled();
  };

  var _verifyHandlingQOWTError = function(commitEvent) {
    var newSheetIdx = 3;
    var newSheetName = 'NextSheet';

    _verifyInitNameEdit(newSheetIdx, newSheetName);

    spyOn(DomListener, 'removeGroup');
    spyOn(SheetSelector, 'blurTab');

    if(commitEvent) {
      // generate the event
      window.dispatchEvent(commitEvent);
    }
    else {
      FakeEvents.simulate(window, 'mousedown');
    }

    var kSignal_CancelSheetNameUpdate_ = "cancelSheetNameUpdate";
    PubSub.publish(kSignal_CancelSheetNameUpdate_);

    expect(DomListener.removeGroup).toHaveBeenCalled();
    expect(SheetSelector.blurTab).toHaveBeenCalledWith(newSheetIdx, true);

  };

  var _prepareDummyTabForEdit = function (tabName) {
    var _dummyTab = SheetSelector.createTab(tabName);
    SheetSelector.setActiveTab(SheetModel.activeSheetIndex);

    // simulating double click event to activate edit mode
    var doubleClickEvent = document.createEvent('Event');
    doubleClickEvent.initEvent('dblclick', true, false);
    _dummyTab.dispatchEvent(doubleClickEvent);
  };

});
