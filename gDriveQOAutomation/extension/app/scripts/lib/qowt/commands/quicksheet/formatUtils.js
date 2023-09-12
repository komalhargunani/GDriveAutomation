// Copyright 2013 Google Inc. All Rights Reserved.

define([], function() {

  'use strict';

  // TODO(ganetsky): Unit tests.
  var _api = {
    /**
     * Maps horizontal alignment values returned by WidgetAccessor to DCP
     * representations.
     * TODO(ganetsky): the reverse of this map exists in cell.js
     * _mapHorizontalAlignment. Consolidate the code with that.
     * @param cssHorizAlign {String} horizontal alignment returned by cell
     *     accessor.
     * @return {String} DCP for that horizontal alignment.
     */
    translateCssHorizAlignToDcp: function(cssHorizAlign) {
      switch (cssHorizAlign) {
      case 'centre':
        return 'c';
      case 'left':
        return 'l';
      case 'right':
        return 'r';
      case 'l':
      case 'r':
      case 'c':
        return cssHorizAlign;
      default:
        throw new Error('Unknown css horizontal alignment: ' + cssHorizAlign);
      }
    },

    /**
     * Maps vertical alignment values returned by WidgetAccessor to DCP
     * representations.
     * TODO(ganetsky): the reverse of this map exists in cell.js
     * _mapVerticalAlignment. Consolidate the code with that.
     * @param cssVerticalAlign {String} vertical alignment returned by cell
     *     accessor.
     * @return {String} DCP for that vertical alignment.
     */
    translateCssVerticalAlignToDcp: function(cssVerticalAlign) {
      switch (cssVerticalAlign) {
      case 'centre':
        return 'c';
      case 'bottom':
        return 'b';
      case 'top':
        return 't';
      case 'c':
      case 'b':
      case 't':
        return cssVerticalAlign;
      default:
        throw new Error('Unknown css vertical alignment: ' + cssVerticalAlign);
      }
    },

    /**
     * DCP input for colors is a little broken. Here, we correct for some of
     * those problems:
     *
     * 1. DCP outputs colors in the format #RRGGBB, but the input expects RRGGBB
     * 2. To unset a color, DCP input expects the string "NONE"
     */
    fixupColorDcp: function(colorDcp) {
      if (colorDcp === undefined) {
        return "NONE";
      } else {
        return (colorDcp.charAt(0) === "#") ? colorDcp.substring(1) : colorDcp;
      }
    }
  };

  return _api;
});