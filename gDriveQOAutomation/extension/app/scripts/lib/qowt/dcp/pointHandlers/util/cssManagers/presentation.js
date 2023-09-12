/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * CSS manager for presentation section. Responsible to create CSS and provide
 * them to client
 */
/**
 * JsDoc description
 */
define([
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(CssManager, UnitConversionUtils) {

  'use strict';


  var _cx = 0; // cache value for slide width in points. It is used while
  // applying left margin for paragraphs having center /right alignment and wrap
  // is disabled.
  var _slideX, _slideY;

  var _api = {
    /*
     * Slide size class for DIV element representing slide in HTML
     */
    createSlideSize: function(cx, cy) {
      _slideX = cx;
      _slideY = cy;
      // cx specifies the length of the extents rectangle in EMUs. Convert it to
      // points before usage.
      var x = UnitConversionUtils.convertEmuToPoint(cx);
      _cx = x ? x : 0;

      //cy specifies the width of the extents rectangle in EMUs. Convert it to
      // points before usage.
      var y = UnitConversionUtils.convertEmuToPoint(cy);

      CssManager.addRule(".slideSize", {
        "width": x + "pt",
        "height": y + "pt"
      });

      // class for text center align effect and when wrap is off
      // This CSS class generation is here because we are deriving it's contents
      // according to slide width
      // Here left margin and right margin are applied negatively and 10 times
      // the slide size, assuming that total paragraph text total width (when
      // wrap is off) can occupy maximum 20 times the width of slide
      CssManager.addRule(".alignCenterNoWrap", {
        "text-align": "center",
        "margin-left": "-" + (x * 10) + "pt",
        "margin-right": "-" + (x * 10) + "pt"
      });


      // class for text right align effect and when wrap is off
      // This CSS class generation is here because we are deriving it's contents
      // according to slide width
      // Here left margin is applied negatively and 10 times the slide size,
      //assuming that total paragraph text total width (when wrap is off) can
      // occupy maximum 10 times the width of slide
      CssManager.addRule(".alignRightNoWrap", {
        "text-align": "center",
        "margin-left": "-" + (x * 10) + "pt"
      });
    },

    /**
     * Get slide width in EMU
     */
    getX: function() {
      return _slideX;
    },

    /**
     * Get slide height in EMU
     */
    getY: function() {
      return _slideY;
    },

    /**
     * Get adjusted margin value for alignments.
     * Used while applying left margin for paragraphs having center /right
     * alignment and wrap is disabled.
     */
    getAdjustedMarginValueForAlign: function() {
      return (_cx * -10);
    }
  };

  return _api;
});
