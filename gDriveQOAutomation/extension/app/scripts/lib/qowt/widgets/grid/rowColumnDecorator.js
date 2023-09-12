// Copyright 2014 Google Inc. All Rights Reserved.

/**
 *
 * RowColumnDecorator
 * ===================
 *
 * A Row column decorator is responsible for applying the formatting to
 * row/column.
 *
 * @author sidharam.teli@synerzip.com (Sidharam Teli)
 */

define([], function() {

  'use strict';

  // The public API of this component
  var _api = {

    /**
     * Applies formatting properties that has been received for a
     * column/row widget.
     *
     *  @param rowColumnWidget {Object} - A row/column widget
     *  @param formattingProperties {Object} - Formatting properties.
     *  @param delfm {boolean} - flag which tells if previous formatting
     *                           properties applied to row/column should be
     *                           reset.
     */
    decorate: function(rowColumnWidget, formattingProperties, delfm) {
      if (rowColumnWidget) {
        if (delfm) {
          rowColumnWidget.resetFormatting();
        }
        if (formattingProperties) {
          rowColumnWidget.setFormatting(formattingProperties);
          rowColumnWidget.applyBackgroundAndBorders(formattingProperties.bg,
              formattingProperties.borders);
        }
      }
    }
  };
  return _api;

});




