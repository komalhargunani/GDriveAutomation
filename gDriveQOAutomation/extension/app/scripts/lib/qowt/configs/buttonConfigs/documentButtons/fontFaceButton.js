// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'font face' button for Word by extending
 * the generic font face button to include app-specific signal subscriptions.
 * Returns a button configuration.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */
define([
  'qowtRoot/configs/buttonConfigs/fontFaceButton',
  'qowtRoot/models/model',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/fontManager'],
  function(
    FontFaceButton,
    Model,
    ArrayUtils,
    FontManager) {

  'use strict';

  FontFaceButton.subscribe = FontFaceButton.subscribe || {};

  /**
   * Update our font list model as the underlying data has been updated.
   *
   * @param {string} signal The signal name.
   * @param {string} signalData Contextual information about selection.
   */
  FontFaceButton.subscribe['qowt:modelUpdate'] =
    function(signal, signalData) {
      signal = signal || '';
      if(signalData &&
        signalData.dataSet === 'fontList') {
        var fontList = Model.get('fontList', 'names');
        fontList = ArrayUtils.unique(fontList);
        fontList.sort();
        this.setItems(fontList, FontFaceButton.styleFunc);
      }
    };

  /**
    * Custom styling function to decorate the contained menu item
    * widgets in the drop down list. Called for each item that is set
    * in the drop down.
    *
    * @param {Element} elm The element to decorate
    * @param {string} name The font family to apply to elm.
    */
  FontFaceButton.styleFunc =
    function(elm, name) {
      // We do not want to style the symbol fonts correctly otherwise they
      // become unreadable in the dropdown/button label.
      if(FontManager.isSymbolFont(name)) {
        elm.style.fontFamily = FontManager.family('Arial');
      }
      else {
        elm.style.fontFamily = FontManager.family(name);
      }
    };

  return FontFaceButton;
});
