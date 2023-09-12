/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview DCP Handler for paragraph elements
 *
 * @author jelte@google.com (Jelte Liebrand)
 *         dtilley@google.com (Dan Tilley)
 */
define(['qowtRoot/utils/converters/converter',
  'qowtRoot/utils/typeUtils'], function(Converter, TypeUtils) {

  'use strict';

  var api_ = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'par',

    /**
     * Construct a widget from the DCP data and return the root node.
     * @param {object} dcp
     * @return {HTML Element}
     */
    visit: function(dcp) {
      if (dcp && dcp.el && dcp.el.etp &&
         (dcp.el.etp === api_.etp) &&
          dcp.el.eid) {

        var element = document.getElementById(dcp.el.eid);

        // The paragraph might already be present in the DOM eg. when para
        // contains a text box whose contents are spread across multiple gDC
        // responses, the continued response for remaining textbox content comes
        // with the complete DOM hierarchy data. If the paragraph does not
        // exists in the DOM, create a new one and add it to the dcp.node
        if (!element) {
          element = new QowtWordPara();
          element.setEid(dcp.el.eid);
          element.setModel(dcp.el);
          paragraphs_.push(element);
        }

        // do not add this element to the DOM; we do that in the postTraverse
        return element;
      }
    },

    /**
     * There are two reasons we MUST use postTraverse for top
     * level elements such as paragraphs and tables:
     *
     * 1- The main reason is the fact that the dcp manager can
     *    and WILL reschedule the handling of a dcp response at
     *    *any* point within that response. Once it reschedules,
     *    we will reflow the document, meaning half finished
     *    paragraphs or tables could get paginated. When the dcp
     *    manager resumes, it's breadcrumb would then point to wrong
     *    elements. So we MUST only ever add top level items to
     *    the page when all their children have been added.
     * 2- By adding these elements only once all the children are
     *    added, we limit the hits on the DOM and increase performance
     */
    postTraverse: function(dcp) {
      var paragraph = paragraphs_.pop();
      if (paragraph) {
        // Remove if there is any page-break in table cell.This is inline
        // with Google docs.
        if (dcp.node.nodeName === 'TD') {
          _removePageBreakFromTable(paragraph);
        }
        Polymer.dom(dcp.node).appendChild(paragraph);
        Polymer.dom(dcp.node).flush();
        _applyLeftPaddingToDrawing(paragraph);
        paragraph.formatParaWithRunProp();
        paragraph.reorderAsolutelyPositionedDrawings();
      }
    }
  };

  // ---------------------------- PRIVATE --------------------------
  /**
   * private
   * We support nested paragraphs, as is the case with text boxes, so use a
   * stack to track nesting.
   */
  var paragraphs_ = [];

  /**
   * This function checks if any left margin/padding is applied to paragraph.
   * If paragraph has drawing elements then there left position need to be
   * updated according to paragraph's left margin/padding value.
   *
   * @param {object} paragraph - Drawing element
   */
  function _applyLeftPaddingToDrawing(paragraph) {
    var drawings = paragraph.querySelectorAll('qowt-drawing');
    var paraLeftIndent = _getParagraphLeftIndentation(paragraph);
    if (drawings.length > 0 && paraLeftIndent) {
      _.forEach(drawings, function(drawing) {
        _setLeftMarginPadding(drawing, paraLeftIndent);
      });
    }
  }


  /**
   * Function to remove page break from table.
   *
   * @param {object} paragraph - Paragraph element
   */
  function _removePageBreakFromTable(paragraph) {
    if (paragraph.hasAttribute('break-before')) {
      paragraph.removeAttribute('break-before');
    }
    var spanCount = paragraph.children ? paragraph.children.length : 0;
    for (var i = 0; i < spanCount; i++) {
      if (paragraph.children[i].getAttribute('qowt-divtype') ===
          'qowt-pagebreak')
      {
        paragraph.children[i].removeAttribute('break-after');
      }
    }
  }


  /**
   *  Returns paragraph left indent value.
   *
   * @param {object} paragraph - paragraph element
   */
  function _getParagraphLeftIndentation(paragraph) {
    var indent = parseInt((window.getComputedStyle(paragraph).marginLeft ||
        window.getComputedStyle(paragraph).paddingLeft), 10);
    if (TypeUtils.isNumber(indent)) {
      return Converter.px2pt(indent);
    }
  }


  /**
   * Apply left margin/padding to text box/drawing element.
   *
   * @param {object} drawingElm - Drawing element
   * @param {object} paraLeftIndent - paragraph left indent value
   */
  function _setLeftMarginPadding(drawingElm, paraLeftIndent) {
    var leftMarginPadding = parseInt(drawingElm.leftPos, 10) - paraLeftIndent;
    switch (drawingElm.wrappingStyle) {
      case 'inFrontOfText':
      case 'behindText':
        drawingElm.children[0].style.left = leftMarginPadding + 'pt';
        break;

      case 'through':
      case 'tight':
      case 'square':
       drawingElm.style.paddingLeft = leftMarginPadding + 'pt';
        break;
    }
  }

  return api_;

});
