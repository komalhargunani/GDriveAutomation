/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'sheetFormatting',

      'createSparseColumnObject': function(index, width, format) {
        return {
          ci: index,
          cw: width,
          fm: format
        };
      },

      'createSheetDefaults': function(rowHeight, colWidth, format) {
        return {
          rh: rowHeight,
          cw: colWidth,
          fm: format
        };
      },

      // USE BELOW METHODS FOR CREATING AN 'fm' FORMAT OBJECT (see the FIXTURES.SHEET.mergedFormattingObject method for an amalgamation)

      'backgroundFormattingObject': function(backgroundColor) {
        return { bg: backgroundColor };
      },

      'textFormattingObject': function(bold, italic, underline, strikethrough) {
        return {
          bld: bold,
          itl: italic,
          udl: underline,
          strikethrough: strikethrough
        };
      },

      'fontFormattingObject': function(fontIndex, fontSize, fontColor) {
        return {
          fi: fontIndex,
          siz: fontSize,
          clr: fontColor
        };
      },

      'alignmentFormattingObject': function(hAlign, vAlign, subscript, superscript) {
        return {
          ha: hAlign,
          va: vAlign,
          sb: subscript,
          sp: superscript
        };
      },

      'wrappedTextFormattingObject': function() {
        return {
          wrapText: 1
        };
      },

      'bordersFormatting': function(top, right, bottom, left) {
        return {
          top: top,
          right: right,
          bottom: bottom,
          left: left
        };
      },

      'borderFormatting': function(style, width, color) {
        return {
          style: style,
          width: width,
          color: color
        };
      },

      // Use this method to amalgamate of the above sub-formatting fixtures

      'mergedFormattingObject': function(backgroundFormattingObject, textFormattingObject, fontFormattingObject, alignmentFormattingObject, borderFormattingObject) {
        var mergedFormatting = {};
        var argsLength = arguments.length;
        for(var ii = 0; ii < argsLength; ii++) {
          var arg = arguments[ii];
          if(typeof arg == 'object') {
            for(var prop in arg) {
              if(arg.hasOwnProperty(prop)) {
                mergedFormatting[prop] = arg[prop];
              }
            }
          }
        }
        return mergedFormatting;
      }

  };

});
