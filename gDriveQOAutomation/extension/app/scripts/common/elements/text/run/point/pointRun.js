define([
  'common/mixins/decorators/boldText',
  'common/mixins/decorators/fontFace',
  'common/mixins/decorators/fontSize',
  'common/mixins/decorators/italicText',
  'common/mixins/decorators/fontFill',
  'common/mixins/decorators/point/baselineText',
  'common/mixins/decorators/point/capText',
  'common/mixins/decorators/point/hyperlinkText',
  'common/mixins/decorators/point/outerShadowText',
  'common/mixins/decorators/point/strikethroughText',
  'common/mixins/decorators/underlineText',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/stringUtils',
  'common/elements/text/run/run'], function(
    BoldText,
    FontFace,
    FontSize,
    ItalicText,
    FontFill,
    PointBaselineText,
    PointCapText,
    PointHyperlinkText,
    PointOuterShadowText,
    PointStrikethroughText,

    UnderlineText,
    MixinUtils,
    DomTextSelection,
    StringUtils,
    QowtRun) {

  'use strict';

  var api_ = {
    is: 'qowt-point-run',
    extends: 'span',

    // The DCP definition for this element; used by QowtElement on construction
    // and set in our model so any new element will have it
    etp: 'txrun',

    /**
     * Gets relative offset
     * @param {Number} absOffset an absolute offset within this element
     * @return {Number} the relative offset within this element
     */
    relativeOffset: function(absOffset) {
      // note: offset can be EQUAL to text length, because the offset
      // could be a dom position at the END of our text.
      if (absOffset >= 0 && absOffset <= this.textContent.length) {
        return absOffset;
      }
      return undefined;
    },

    /**
     * Gets offset node
     * @param {Number} absOffset an absolute offset within this element
     * @return {HTMLElement} the node within this that contains the requested
     *                       absOffset
     */
    offsetNode: function(/*absOffset*/) {
      return this;
    },

    /**
     * Insert text at the given offset
     * @param {number} offset the offset at which to insert text
     * @param {String} text the text to insert
     */
    insertText: function(offset, text) {
      var relOffset = this.relativeOffset(offset);
      if (relOffset === undefined) {
        var offsetNode = this.offsetNode();
        if (offsetNode === undefined) {
          throw new Error(
              'TextRun Error: no node in flow at absolute offset ' + offset);
        }
        offsetNode.insertText(offset, text);
      }
      else {
        if (relOffset > this.textContent.length) {
          throw new Error('TextRun Error: inserting text beyond run size');
        }
        // If we already have text, make sure we dont just set textContent or
        // innerText, but instead "do the right thing" by inserting text nodes
        // and normalizing. This ensures the right DOM Mutations are sent to the
        // DOM Mutation observer
        if (this.textContent.length === 0) {
          this.textContent = text;
        } else {
          relOffset = StringUtils.astralCorrections(this.textContent,
            relOffset);
          // Make sure our span starts with ONE text node
          this.normalize();
          // Now split the node at the given relOffset
          this.firstChild.splitText(relOffset);
          // Create a new text node with our text
          var newTextNode = document.createTextNode(text);
          // Insert it infront of our last (second) child
          this.insertBefore(newTextNode, this.lastChild);
          // Normalize to get back to one single textnode
          this.normalize();
        }
        DomTextSelection.setCaret(
            this.firstChild, relOffset + text.length);

        this.scrollIntoView();
      }
    },


    /**
     * Remove text content from this widget. Can leave empty spans
     * @param {Number} offset The offset at which to remove content
     * @param {Number} length The number of characters to remove
     */
    removeText: function(offset, length) {
      var relOffset = this.relativeOffset(offset);
      if (relOffset === undefined) {
        var offsetNode = this.offsetNode();
        if (offsetNode === undefined) {
          throw new Error(
              'TextRun Error: no node at absolute offset ' + offset);
        }
        offsetNode.removeText(offset, length);
      }
      else {
        relOffset = StringUtils.astralCorrections(this.textContent, relOffset);
        length = StringUtils.astralCorrections(
          this.textContent.substring(relOffset), length);
        // Now delete our own bits make sure we "do the right thing" by
        // splitting text nodes and normalizing. This ensures the right DOM
        // Mutations are sent to the DOM Mutation observer
        // Make sure we starts with ONE text node
        this.normalize();
        var textNode = this.firstChild;
        if (textNode === undefined) {
          throw new Error('run has no text node, cannot removeText');
        }
        // Now split the node at the given relOffset
        var rightTextNode = textNode.splitText(relOffset);
        // Now split this guy at the toDeleteInThis we want to cut
        rightTextNode.splitText(length);
        // RightTextNode is now the guy we want to get rid of
        this.removeChild(rightTextNode);
        // Normalize to get back to one single textnode
        this.normalize();
        if (this.firstChild &&
            relOffset <= this.firstChild.textContent.length) {
          DomTextSelection.setCaret(this.firstChild, relOffset);
        } else {
          // In the case where we've set textContent to '', this will have no
          // children. The call below will move the cursor to the empty this
          DomTextSelection.setCaret(this, 0);
        }

        this.scrollIntoView();
      }
    }
  };


  /* jshint newcap: false */
  window.QowtPointRun = Polymer(MixinUtils.mergeMixin(
      QowtRun,
      // decorator mixins:
      BoldText,
      FontFace,
      FontSize,
      ItalicText,
      FontFill,
      PointBaselineText,
      PointCapText,
      PointHyperlinkText,
      PointOuterShadowText,
      PointStrikethroughText,
      UnderlineText,
      api_));
  /* jshint newcap: true */

  return {};
});
