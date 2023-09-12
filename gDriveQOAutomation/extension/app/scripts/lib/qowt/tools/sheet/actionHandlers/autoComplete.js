// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview An action handler which handles a 'qowt:requestAction'
 * signal that indicates that the user has selected an item from the
 * auto-complete menu in Quicksheet.
 * This action handler is used by the Sheet Text Tool to process
 * this signal.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/sheet/sheetTextTool'],
  function(
    SheetTextTool) {

  'use strict';

  function onLoad_() {
    SheetTextTool.registerActionHandler([
      'injectAutocomplete'], handleInjectAutoComplete_);
  }

  function handleInjectAutoComplete_(actionData) {
    if(actionData.helper) {
      actionData.helper.onInjectAutocompleteText(actionData.context.value);
    }
  }

  onLoad_();
  return {};
});
