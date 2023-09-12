// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The 'normal' text helper of the Sheet Text Tool.
 * This helper is used by the Sheet Text Tool when normal text -
 * e.g. 'Expenses' - is being edited in a text editor (i.e. in the
 * formula bar or in the floating editor). It manages the
 * manipulation of normal text.
 *
 * This helper is a subclass of the 'base' helper.
 *
 * @see BaseHelper
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/sheet/textHelpers/baseHelper',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/utils/domListener',
  'qowtRoot/controls/grid/autocompleteHandler'],
  function(
    BaseHelper,
    PubSub,
    SheetSelectionManager,
    DomListener,
    AutocompleteHandler) {

  'use strict';

    var contentType_ = 'sheetText',
        kSignal_DoAction_ = "qowt:doAction",
        kAction_DisplayAutocomplete_ = "displayAutocomplete";

    // Extend the BaseHelper API
    var api_ = BaseHelper.create();

    api_.mode = 'normal';

    api_.init = function() {
      AutocompleteHandler.generateCandidateList();
      DomListener.add(api_.mode,
        document.getElementById("qowt-autocomplete-menu"),
        'mousedown',
        onMouseDownAutocompleteMenu_,
        true);
    };

    api_.reset = function() {
      DomListener.removeGroup(api_.mode);
      AutocompleteHandler.clearCandidateList();
    };

    api_.onMouseDownOnPane = function(event) {
      api_.doCommitCellEdit(event);
    };

    api_.onMutationEvent = function() {
      // display auto-complete suggestions if the
      // edit is occuring in the floating editor
      var selectionObj = SheetSelectionManager.getCurrentSelection();
      if(selectionObj && selectionObj.contentType === contentType_ &&
        selectionObj.textWidget && selectionObj.textWidget.isInline()) {
        PubSub.publish(kSignal_DoAction_, {
          'action': kAction_DisplayAutocomplete_,
          'context': {
            contentType: contentType_,
            textWidget: selectionObj.textWidget
          }
        });
      }
    };

    api_.onInjectAutocompleteText = function(text) {
      // inject the chosen text into the active text editor and commit
      var selectionObj = SheetSelectionManager.getCurrentSelection();
      if(selectionObj &&
        (selectionObj.contentType === contentType_) &&
        selectionObj.textWidget) {
        selectionObj.textWidget.setDisplayText(text);
        api_.doCommitCellEdit();
      }
    };

    // VVVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVVV

    var onMouseDownAutocompleteMenu_ = function(event) {
      // prevent the default behaviour of mousedown events on the
      // auto-complete menu which would cause the active text editor
      // to receive a 'blur' event and the Sheet Text Tool to be deactivated
      if(event.preventDefault) {
        event.preventDefault();
      }
    };

    return api_;
});
