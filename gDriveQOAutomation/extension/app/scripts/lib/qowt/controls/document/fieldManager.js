/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview JELTE TODO WRITE ME
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/text/textTool',
  'qowtRoot/widgets/fields/dateTime',
  'qowtRoot/widgets/fields/pageNum'], function(
    PubSub,
    TextTool,
    DateTimeWidget,
    PageNumberWidget) {

  'use strict';

  var _api = {
    /**
     * Note: This function is used only in E2E
     * @return {boolean} true if the field manger has attempted to update the
     *                    fields(irrespective of their existence) false
     *                    otherwise.
     */
    hasUpdatedFields: function() {
      // Once we start updating the date and time fields this will be
      // return _pageCountFieldsUpdated && _dateFieldsUpdated
      //   && _timeFieldsUpdated;
      return _pageCountFieldsUpdated;
    },

    /**
     * Creates and return the field widget.
     *
     * @param {Object} config
     * @param {String} config.newFieldId
     * @param {String} config.fieldType
     * @param {String | undefined} config.format
     * @param {String | undefined} config.lang
     * @return {Object | undefined} PageNumberWidget| DateTimeWidget.
     */
    getWidgetForConfig: function(config) {
      // legacy dcp sends number format as
      // "\* ALPHABETIC\* alphabetic\* ROMAN \* MERGEFORMAT"
      // So in that case take the last format listed. Or else
      // take the format as given.
      // Note: the only four strings that we want to filter
      // out from the total field string are:
      //   ALPHABETIC
      //   alphabetic
      //   ROMAN
      //   roman
      // JELTE TODO: remove this once all dcp is fixed
      var format = config.format || 'Arabic';
      if (format.indexOf('\\*') !== -1) {
        // dealing with old format
        var match = format.match(/.*(ALPHABETIC|ROMAN|alphabetic|roman).*/);
        format = (match && match.length >= 2) ? match[1] : 'Arabic';
      }

      // update the config accordingly
      config.format = format;
      config.fieldType = config.fieldType.toLowerCase();

      var fieldWidget;
      switch (config.fieldType) {
        case 'pagenum':
        case 'numpages':
          fieldWidget = PageNumberWidget.create(config);
          break;
        case 'date':
        case 'time':
          fieldWidget = DateTimeWidget.create(config);
          break;
        default:
          break;
      }

      return fieldWidget;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv
  var _contentCompleteToken, _disableToken, _pageCountToken;
  // required for E2E's to know if document is ready to test.
  var _pageCountFieldsUpdated = false;


  function _onLoad() {
    _disableToken = PubSub.subscribe('qowt:disable', _unsubscribeAll);
    _contentCompleteToken =
        PubSub.subscribe('qowt:contentComplete', _listenAndUpdatePageCount);
  }


  function _listenAndUpdatePageCount() {
    _pageCountToken =
        PubSub.subscribe('qowt:pageCountChanged', _updatePageCounts);
    PubSub.unsubscribe(_contentCompleteToken);
    _contentCompleteToken = undefined;
    _updatePageCounts(); // if any.
  }


  function _unsubscribeAll() {
    PubSub.unsubscribe(_pageCountToken);
    PubSub.unsubscribe(_disableToken);
    // we have already un-subscribed from content-complete. This is just so that
    // karma UT's pass
    PubSub.unsubscribe(_contentCompleteToken);
    _disableToken = _contentCompleteToken = _pageCountToken = undefined;
  }


  function _updatePageCounts() {
    // There could be possibilities where page counts might get updated when
    // the text tool is suppressed/in-active. Such updates will not be
    // communicated to core. So we delay any such updates.
    if (!TextTool.isUnsuppressed()) {
      window.setTimeout(_updatePageCounts, 50);
      _pageCountFieldsUpdated = false;
      return;
    }
    // new pages could have been added, which could
    // have had their headers/footers cloned. So although
    // it's somewhat counter intuitive, we need to update
    // both the qowt-field-numpages as well as qowt-field-pagenum
    // note: it's also not overly efficient :-(
    var fieldsToUpdate = [], page;
    var pageNumSel = 'span.qowt-field-pagenum';
    var numPageSel = 'span.qowt-field-numpages';
    var pages = document.querySelectorAll('qowt-page');
    for (var i = 0; i < pages.length; i++) {
      page = pages[i];
      var pageNumFlds = page.querySelectorAll(pageNumSel);
      pageNumFlds = pageNumFlds.length ? pageNumFlds :
          Polymer.dom(page.root).querySelectorAll(pageNumSel);
      var numPagesFlds = page.querySelectorAll(numPageSel);
      numPagesFlds = numPagesFlds.length ? numPagesFlds :
        Polymer.dom(page.root).querySelectorAll(numPageSel);

      // convert to an array for easier handling than nodeLists.
      fieldsToUpdate = Array.prototype.slice.call(fieldsToUpdate).concat(
          Array.prototype.slice.call(pageNumFlds).concat(
          Array.prototype.slice.call(numPagesFlds)));
    }

    var widget;
    fieldsToUpdate.forEach(function(fld) {
      widget = PageNumberWidget.create({
        fromNode: fld
      });
      if (widget) {
        widget.update();
      }
    });
    // Irrespective of the presence of pageNum/ numPage fields we consider them
    // to be updated at this point of time (by the fieldManger).
    _pageCountFieldsUpdated = true;
  }

  _onLoad();
  return _api;
});
