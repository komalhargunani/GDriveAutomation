// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The sheet tab tool is activated by the sheet selection
 * manager when the user clicks - or double-clicks - on a tab in the sheet
 * selector widget at the bottom of the grid.
 *
 * The sheet tab tool is responsible for translating user gestures on the
 * tabs into the intended operation that the user is wishing to perform
 * and then initiate the execution of that operation.
 * For example, when the user clicks on a tab the tool should change
 * the styling of the tab to indicate that it is the active tab and
 * initiate the cycle of fetching the content of the sheet.
 * When the user double-clicks on a tab the tool should allow the
 * user to edit the name of the sheet.
 * Ultimately the sheet tab tool translates the user's intentions
 * into various 'qowt:doAction' signals, which the tool publishes.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/features/utils',
  'qowtRoot/widgets/grid/sheetSelector',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/ui/modalDialog'],
  function(
    PubSub,
    SheetSelectionManager,
    Features,
    SheetSelector,
    DomListener,
    I18n,
    ModalDialog) {

  'use strict';

    var contentType_ = 'sheetTab',
        active_ = false,
        sheetIdx_,
        sheetName_,
        hasValidSheetName_ = true,
        // Keys that may impact the current operation
        kTabKeyCode_ = 9,
        kEnterKeyCode_ = 13,
        kEscapeKeyCode_ = 27,
        // Signals that are published
        kSignal_DoAction_ = "qowt:doAction",
        activeSelectionB4ErrorDialog_;

    var api_ = {

      /**
       * Must specify a name to identify this tool
       */
      name: contentType_,

      /**
       * Called by the Tools Manager when this tool is made the active tool
       */
      activate: function() {
        active_ = true;
        doActivationTask_();
      },

      /**
       * Called by the Tools Manager when this tool is made non-active
       */
      deactivate: function() {
        active_ = false;
        doDeactivationTask_();
      },

      /**
       * Query if the tool is active
       *
       * @returns {boolean} True if active, otherwise false
       */
      isActive: function() {
        return active_;
      }
  };

  // VVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVV

  var doActivationTask_ = function() {
    var currentSelection = SheetSelectionManager.getCurrentSelection();
    if(currentSelection &&
      (currentSelection.sheetIndex >= 0) &&
      hasValidSheetName_) {
      sheetIdx_ = currentSelection.sheetIndex;
      // If this tool was activated due to a double-click event
      // then we only want to initiate an edit - we don't need
      // to initiate a 'change sheet' command as that would have
      // occurred for the first click of the double-click
      if(currentSelection.selectionEvent &&
        (currentSelection.selectionEvent.type === 'dblclick') &&
        Features.isEnabled('edit')) {
        initiateSheetNameEdit_();
      }
      else {
        initiateChangeSheet_();
      }
    }
  };

  var initiateChangeSheet_ = function() {
    SheetSelector.changeActiveTab(sheetIdx_);
    PubSub.publish(kSignal_DoAction_, {
      'action': 'changeSheet',
      'context': {
        contentType: 'sheet',
        newSheetIndex: sheetIdx_
      }
    });
  };

  var initiateSheetNameEdit_ = function() {
    sheetName_ = SheetSelector.getSheetName(sheetIdx_);
    SheetSelector.focusTab(sheetIdx_);
    addEventListenersToDOM_();
  };

  var onKeyDownEvent_ = function(event){
    switch (event.keyCode) {
      case kEnterKeyCode_:
      case kTabKeyCode_:
        commitSheetNameEdit_();
        break;
      case kEscapeKeyCode_:
        cancelSheetNameEdit_();
        break;
      default:
        break;
    }
  };

  var onKeyPressEvent_ = function(evt) {
    verifySheetNameEdit_(evt);
  };


  /**
   * Sheet name is valid if:-
   * It does not have an illegal character.
   * It does not exceed 31 characters.
   *
   * @param {String} enteredText - text to be validated for sheet name.
   * @return {boolean} - true if sheet name is valid, false otherwise.
   * @private
   */
  var isValidSheetName_ = function(enteredText) {
    var lengthOfSheetName = SheetSelector.getSheetName(sheetIdx_).length;
    var selection = window.getSelection();
    var noOfCharSelected =
      Math.abs(selection.anchorOffset - selection.focusOffset);
    var noOfCharEntered = enteredText.length;
    var lengthAfterUpdating = lengthOfSheetName - noOfCharSelected +
      noOfCharEntered;
    var validName = true;

    if ((/[\\\/\*\?\[\]';:]/g).test(enteredText) || lengthAfterUpdating > 31) {
      validName = false;
    }
    return validName;
  };


  var onPasteEvent_ = function (evt) {
    if (evt.clipboardData && evt.clipboardData.getData) {
      var plainText = evt.clipboardData.getData('text/plain');
      plainText = plainText.replace(/\n/g, '').trim();
      if (plainText) {
        if (isValidSheetName_(plainText)) {
          document.execCommand('insertText', false, plainText);
        }
        else {
          _showInvalidSheetNameMessageBox();
        }
      }
    }
    evt.preventDefault();
  };

    /**
   * Re-sizes the SheetSelector on occurrence of input event.
   * This is required since the character is only added when the input
   * event occurs.
   */
  var onInputEvent_ = function() {
    SheetSelector.resizeSelector();
  };

    var verifySheetNameEdit_ = function (evt) {
      var newChar = String.fromCharCode(evt.keyCode);
      if (!isValidSheetName_(newChar)) {
        // prevent this character from being added to the sheet name
        // and show the dialog about invalid character name
        evt.preventDefault();
        _showInvalidSheetNameMessageBox();
      }
    };

  var onMouseDownEvent_ = function(evt) {
    processEvent_(evt);
  };

  var onDblClickEvent_ = function(evt) {
    processEvent_(evt);
  };

  var processEvent_ = function(evt) {
    if (evt && evt.target && evt.target.classList &&
      evt.target.classList.contains('qowt-sheet-active-label')) {
      // the evt occurred in the tab being edited so prevent
      // the evt from being received and processed by the
      // sheet selector widget (otherwise it may try to
      // activate the sheet tab tool again for a double-click)
      if(evt.stopPropagation) {
        evt.stopPropagation();
      }
    }
    else {
      // the event occurred somewhere other than in
      // the tab being edited, so commit the edit
      commitSheetNameEdit_();
    }
  };

    /**
    * API serves following purpose
    * 1) Validates the content
    * 2) In case validation succeeds, event to rename the sheet
    *    is published.
    * 3) In case validation fails, cancel sheet name edit
    * @private
    */
  var commitSheetNameEdit_ = function() {

    var sheetName = SheetSelector.getSheetName(sheetIdx_);

    if(SheetSelector.isDuplicateTabName(sheetIdx_,sheetName)) {
      ModalDialog.show(
        I18n.getMessage('duplicate_sheet_name_title'),
        I18n.getMessage('duplicate_sheet_name_message'),[{
          'text': I18n.getMessage('qowt_modal_info_dialog_affirmative_button'),
          'callback': function(){},
          'affirmative': true
        }]);
      cancelSheetNameEdit_();
    }
    else if(sheetName.length === 0) {
      hasValidSheetName_ = false;
      _showInvalidSheetNameMessageBox();
      cancelSheetNameEdit_();
    }
    else {
      PubSub.publish(kSignal_DoAction_, {
        'action': 'renameSheet',
        'context': {
          sheetIndex: sheetIdx_,
          newSheetName: sheetName,
          oldSheetName: sheetName_,
          contentType: 'sheet'
        }
      });
      completeSheetNameEdit_();
    }
  };

      /**
       * Reverts the sheet name to the initial one and
       * sheet selector to previous size.
       * @private
       */
  var cancelSheetNameEdit_ = function() {
    SheetSelector.setSheetName(sheetIdx_, sheetName_);
    completeSheetNameEdit_();

  };

  var completeSheetNameEdit_ = function() {
    DomListener.removeGroup(contentType_);
    //blur tab and end editing.
    SheetSelector.blurTab(sheetIdx_, true);
    SheetSelector.resizeSelector();
  };

  var doDeactivationTask_ = function() {
    // handle the case where the sheet tab tool was active during the
    // fetching of a sheet's content, in which case trySeedSelection()
    // would not have been called. We will call it now.
    // NOTE: We must allow the sheet tab tool to finish deactivating
    // before we call trySeedSelection(), so we wrap the call in a
    // setTimeout. This removes the trySeedSelection() call from the
    // current execution queue and it is executed when the browser is
    // not busy (i.e. when the deactivation code chain completes).
    // It is important to 'delay' the call to trySeedSelection() in this
    // way because the method will deactivate the currently active tool
    // and if the sheet tab tool were still to be active at this point
    // then it would result in another call to deactivate(), and we
    // would end up in a recursive loop and eventually blow the JS stack
    window.setTimeout(SheetSelectionManager.trySeedSelection, 0);
  };

  var addEventListenersToDOM_ = function() {
    DomListener.add(contentType_, SheetSelector.getTab(sheetIdx_),
        'keypress', onKeyPressEvent_);
    DomListener.add(contentType_, window, 'keydown', onKeyDownEvent_);
    DomListener.add(contentType_, window, 'mousedown', onMouseDownEvent_, true);
    DomListener.add(contentType_, window, 'dblclick', onDblClickEvent_, true);
    DomListener.add(contentType_, window, 'input', onInputEvent_, true);
    DomListener.add(contentType_, SheetSelector.getTab(sheetIdx_),
        'paste', onPasteEvent_, true);
  };

  /**
   * Called by the callback function of a modal dialog when an erroneous
   * sheet name is entered that needs to be corrected.
   * @private
   */
  var reactivateTab_ = function() {
    SheetSelector.refocusTab(sheetIdx_, activeSelectionB4ErrorDialog_);
    addEventListenersToDOM_();
    if (!hasValidSheetName_) {
      var obj = {
        sheetIndex: sheetIdx_,
        selectionEvent: activeSelectionB4ErrorDialog_,
        contentType: 'sheetTab'
      };
      // activate the appropriate tool
      PubSub.publish("qowt:tool:requestActivate", obj);
      document.execCommand('selectAll', false, null);
    }
    hasValidSheetName_ = true;
    activeSelectionB4ErrorDialog_ = undefined;
  };


  /**
   * This method displays message box of id length exceeds 31 or
   * any non-permissible character is entered.
   * @private
   */
  var _showInvalidSheetNameMessageBox = function () {
    //save the selection, blur the tab and remove the event listeners.
    //Note: we do not want to call deactivate here.
    DomListener.removeGroup(contentType_);
    var sel = window.getSelection();
    activeSelectionB4ErrorDialog_ = {
      anchorNode: sel.anchorNode,
      anchorOffset: sel.anchorOffset,
      baseNode: sel.baseNode,
      baseOffset: sel.baseOffset,
      extentNode: sel.extentNode,
      extentOffset: sel.extentOffset,
      focusNode: sel.focusNode,
      focusOffset: sel.focusOffset,
      isCollapsed: sel.isCollapsed,
      rangeCount: sel.rangeCount,
      type: sel.type
    };

    //blur tab but do not end editing.
    SheetSelector.blurTab(sheetIdx_, false);
    ModalDialog.show(
      I18n.getMessage('non_permissible_sheet_name_title'),
      I18n.getMessage('non_permissible_sheet_name_details'), [{
        'text': I18n.getMessage('qowt_modal_info_dialog_affirmative_button'),
        'callback': reactivateTab_,
        'affirmative': true,
        'useSameCallbackForCancel': true
      }]);
  };

  return api_;
});
