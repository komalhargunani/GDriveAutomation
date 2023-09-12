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

    'id': 'gridCell',

    /**
     * simple grid cell element without any styling.
     *
     * See qowt/comms/schema/elements/gridCell-schema.js
     *
     */
    'gridCellElement': function(cellIndex, displayText, fontIndex, fontSize,
                                editText) {
      if(cellIndex !== undefined && cellIndex !== null) {
        FIXTURES.gridCellColIdx = cellIndex;
      } else if(FIXTURES.gridCellColIdx === undefined) {
        FIXTURES.gridCellColIdx = 0;
      } else {
        FIXTURES.gridCellColIdx++;
      }
      displayText = displayText || (FIXTURES.gridRowIdx + "," +
        FIXTURES.gridCellColIdx);
      editText = editText || "editing...";
      fontIndex = fontIndex || 0;
      fontSize = fontSize || 20;
      var el = {
        etp: 'gcl',
        addChild: FIXTURES.addChild,
        c: FIXTURES.gridCellColIdx,
        fi: fontIndex,
        fs: fontSize,
        x: displayText,
        xe: editText
      };
      return el;
    },

    /**
     * text-wrapped grid cell element without any styling.
     *
     * See qowt/comms/schema/elements/gridCell-schema.js
     *
     */
    'gridCellElementWrapped': function(cellIndex, displayText, fontIndex,
                                       fontSize, editText) {
      if(cellIndex !== undefined && cellIndex !== null) {
        FIXTURES.gridCellColIdx = cellIndex;
      } else if(FIXTURES.gridCellColIdx === undefined) {
        FIXTURES.gridCellColIdx = 0;
      } else {
        FIXTURES.gridCellColIdx++;
      }
      displayText = displayText || (FIXTURES.gridRowIdx + "," +
        FIXTURES.gridCellColIdx);
      editText = editText || "editing...";
      fontIndex = fontIndex || 0;
      fontSize = fontSize || 20;
      var el = {
        etp: 'gcl',
        addChild: FIXTURES.addChild,
        c: FIXTURES.gridCellColIdx,
        fi: fontIndex,
        fs: fontSize,
        x: displayText,
        xe: editText,
        wr: 1
      };
      return el;
    },

    /**
     * grid cell element with cell, text and font styling. Applies values for
     * display text, background color and text styling if they are not set.
     *
     * See qowt/comms/schema/elements/gridCell-schema.js
     *
     * textStyling:
     *  fontIndex
     *  fontSize
     *  fontColor,
     *  isBold
     *  isItalic
     *  isUnderline
     *  isStrikeThr
     *  isSuperScr
     *  isSubScr
     *  wrapText
     *
     * alignment
     *  h
     *  v
     *
     * borders:
     *  bottom
     *  top
     *  left
     *  right
     */
    'gridCellElementStyled': function(cellIndex, displayText, bkColor,
                                      textStyling, alignment, borders) {
      if(cellIndex !== undefined && cellIndex !== null) {
        FIXTURES.gridCellColIdx = cellIndex;
      } else if(FIXTURES.gridCellColIdx === undefined) {
        FIXTURES.gridCellColIdx = 0;
      } else {
        FIXTURES.gridCellColIdx++;
      }
      displayText = displayText || (FIXTURES.gridRowIdx + "," +
        FIXTURES.gridCellColIdx);
      bkColor = bkColor || "FFFFFF";
      textStyling = textStyling || {};
      textStyling.fontIndex = textStyling.fontIndex || 0;
      textStyling.fontSize = textStyling.fontSize || 20;
      textStyling.fontColor = textStyling.fontColor || "000000";
      return FIXTURES.gridCellElementStyledNoDefaults(cellIndex, displayText,
        bkColor, textStyling, alignment, borders);
    },

    /**
     * simple grid cell element with cell, text and font styling.
     *
     * See qowt/comms/schema/elements/gridCell-schema.js
     *
     * textStyling:
     *  fontIndex
     *  fontSize
     *  fontColor,
     *  isBold
     *  isItalic
     *  isUnderline
     *  isStrikeThr
     *  isSuperScr
     *  isSubScr
     *  wrapText
     *
     * alignment
     *  h
     *  v
     *
     * borders:
     *  bottom
     *  top
     *  left
     *  right
     */
    'gridCellElementStyledNoDefaults': function(cellIndex, displayText, bkColor,
                                                textStyling, alignment, borders)
    {
      if(cellIndex !== undefined && cellIndex !== null) {
        FIXTURES.gridCellColIdx = cellIndex;
      } else if(FIXTURES.gridCellColIdx === undefined) {
        FIXTURES.gridCellColIdx = 0;
      } else {
        FIXTURES.gridCellColIdx++;
      }
      textStyling = textStyling || {};
      alignment = alignment || {};
      var alignProps = 0;
      switch(alignment.v) {
        case 't':
          alignProps += 1;
          break;
        case 'c':
          alignProps += 2;
          break;
        default:  // 'b'
          break;
      }
      alignProps = alignProps << 2;
      switch(alignment.h) {
        case 'r':
          alignProps += 1;
          break;
        case 'c':
          alignProps += 2;
          break;
        case 'j':
          alignProps += 3;
          break;
        default:  // 'l'
          break;
      }
      borders = borders || {};
      borders.bottom = borders.bottom || {};
      borders.top = borders.top || {};
      borders.left = borders.left || {};
      borders.right = borders.right || {};
      var textProps = 0;
      if(textStyling.isSubScr) {
        textProps += 1;
      }
      textProps = textProps << 1;
      if(textStyling.isSuperScr) {
        textProps += 1;
      }
      textProps = textProps << 1;
      if(textStyling.isStrikeThr) {
        textProps += 1;
      }
      textProps = textProps << 1;
      if(textStyling.isUnderline) {
        textProps += 1;
      }
      textProps = textProps << 1;
      if(textStyling.isItalic) {
        textProps += 1;
      }
      textProps = textProps << 1;
      if(textStyling.isBold) {
        textProps += 1;
      }
      var el = {
        etp: 'gcl',
        addChild: FIXTURES.addChild,
        c: FIXTURES.gridCellColIdx,
        fi: textStyling.fontIndex,
        fs: textStyling.fontSize,
        x: displayText,
        t: textProps,
        fg: textStyling.fontColor,
        bg: bkColor,
        a: alignProps,
        bc: borders.bottom.color,
        tc: borders.top.color,
        lc: borders.left.color,
        rc: borders.right.color,
        bb: borders.bottom.style,
        tb: borders.top.style,
        lb: borders.left.style,
        rb: borders.right.style,
        bw: borders.bottom.width,
        tw: borders.top.width,
        lw: borders.left.width,
        rw: borders.right.width,
        wr: textStyling.wrapText
      };
      return el;
    },

    /**
     * Aligned grid cell element.
     *
     * See qowt/comms/schema/elements/gridCell-schema.js
     *
     */
    'gridCellElementAligned': function(cellIndex, displayText, hAlign, vAlign) {
      if(cellIndex !== undefined && cellIndex !== null) {
        FIXTURES.gridCellColIdx = cellIndex;
      } else if(FIXTURES.gridCellColIdx === undefined) {
        FIXTURES.gridCellColIdx = 0;
      } else {
        FIXTURES.gridCellColIdx++;
      }
      displayText = displayText || (FIXTURES.gridRowIdx + "," +
        FIXTURES.gridCellColIdx);
      var alignProps = 0;
      switch(vAlign) {
        case 't':
          alignProps += 1;
          break;
        case 'c':
          alignProps += 2;
          break;
        default:  // 'b'
          break;
      }
      alignProps = alignProps << 2;
      switch(hAlign) {
        case 'r':
          alignProps += 1;
          break;
        case 'c':
          alignProps += 2;
          break;
        case 'j':
          alignProps += 3;
          break;
        default:  // 'l'
          break;
      }
      var el = {
        etp: 'gcl',
        addChild: FIXTURES.addChild,
        c: FIXTURES.gridCellColIdx,
        x: displayText,
        a: alignProps
      };
      return el;
    },

    /**
     * A grid cell element with a border.
     *
     * See qowt/comms/schema/elements/gridCell-schema.js
     * borderBottom, borderTop, borderLeft and borderRight can contain color,
     * width and style information.
     * e.g. {color:'green', style:'solid, width:'thick'}
     *
     */
    'gridCellElementBordered': function(cellIndex, displayText, borderBottom,
                                        borderTop, borderLeft, borderRight) {
      if(cellIndex !== undefined && cellIndex !== null) {
        FIXTURES.gridCellColIdx = cellIndex;
      } else if(FIXTURES.gridCellColIdx === undefined) {
        FIXTURES.gridCellColIdx = 0;
      } else {
        FIXTURES.gridCellColIdx++;
      }
      borderBottom = borderBottom || {};
      borderTop = borderTop || {};
      borderLeft = borderLeft || {};
      borderRight = borderRight || {};
      displayText = displayText || (FIXTURES.gridRowIdx + "," +
        FIXTURES.gridCellColIdx);
      var el = {
        etp: 'gcl',
        addChild: FIXTURES.addChild,
        c: FIXTURES.gridCellColIdx,
        x: displayText,
        bc: borderBottom.color,
        tc: borderTop.color,
        lc: borderLeft.color,
        rc: borderRight.color,
        bb: borderBottom.style,
        tb: borderTop.style,
        lb: borderLeft.style,
        rb: borderRight.style,
        bw: borderBottom.width,
        tw: borderTop.width,
        lw: borderLeft.width,
        rw: borderRight.width
      };
      return el;
    }

  };

});
