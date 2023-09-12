define([
  'common/mixins/decorators/boldText',
  'common/mixins/decorators/fontFace',
  'common/mixins/decorators/fontSize',
  'common/mixins/decorators/italicText',
  'common/mixins/decorators/allCapsText',
  'common/mixins/decorators/blinkText',
  'common/mixins/decorators/embossText',
  'common/mixins/decorators/engraveText',
  'common/mixins/decorators/fontBackground',
  'common/mixins/decorators/fontColor',
  'common/mixins/decorators/hiddenText',
  'common/mixins/decorators/outlineText',
  'common/mixins/decorators/overlineText',
  'common/mixins/decorators/runStyle',
  'common/mixins/decorators/shadowText',
  'common/mixins/decorators/smallCapsText',
  'common/mixins/decorators/strikethroughText',
  'common/mixins/decorators/subscriptText',
  'common/mixins/decorators/superscriptText',
  'common/mixins/decorators/underlineText',
  'common/mixins/flowWords',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/stringUtils',
  'qowtRoot/utils/navigationUtils',
  'common/elements/text/run/run'], function(
    BoldText,
    FontFace,
    FontSize,
    ItalicText,
    AllCapsText,
    BlinkText,
    EmbossText,
    EngraveText,
    FontBackground,
    FontColor,
    HiddenText,
    OutlineText,
    OverlineText,
    RunStyle,
    ShadowText,
    SmallCapsText,
    StrikethroughText,
    SubscriptText,
    SuperscriptText,
    UnderlineText,
    FlowWords,
    MixinUtils,
    DomTextSelection,
    StringUtils,
    NavigationUtils,
    QowtRun) {

  'use strict';

  var api_ = {
    is: 'qowt-word-run',
    extends: 'span',

    // The DCP definition for this element; used by QowtElement on construction
    // and set in our model so any new element will have it
    etp: 'ncr',

    /**
     * Insert text at the given offset
     * @param {number} offset the offset at which to insert text
     * @param {String} text the text to insert
     */
    insertText: function(offset, text) {
      var relOffset = this.relativeOffset(offset);
      if (relOffset === undefined) {
        var offsetNode = this.flowNodeAtOffset(offset);
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
          relOffset = StringUtils.astralCorrections(
            this.textContent, relOffset);
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
            this.firstChild, relOffset + Array.from(text).length);

        this.scrollIntoView();
      }
    },


    /**
     * Remove text content from this widget. Can leave empty spans
     * @param {integer} offset The offset at which to remove content
     * @param {integer} length The number of characters to remove
     */
    removeText: function(offset, length) {
      var relOffset = this.relativeOffset(offset);
      if (relOffset === undefined) {
        var offsetNode = this.flowNodeAtOffset(offset);
        if (offsetNode === undefined) {
          throw new Error(
              'TextRun Error: no node in flow at absolute offset ' + offset);
        }
        offsetNode.removeText(offset, length);
      }
      else {
        var removalLengthInThis = length;
        // We made need to delete text in some later nodes in the flow chain
        var textLength = Array.from(this.textContent).length;
        var parent = this.parentNode;
        if(parent && parent.getAttribute &&
          (parent.getAttribute('qowt-divtype') === 'qowt-field-pagenum') &&
          parent.parentNode.getAttribute('qowt-paratype') === 'hf-para') {
          removalLengthInThis = textLength;
        }

        if ((relOffset + removalLengthInThis) > textLength) {
          // We need to remove all remaining characters in this
          removalLengthInThis = textLength - relOffset;
          // absOffset should be at the start of flowInto
          var absOffset = offset + removalLengthInThis;
          var removalLengthInFlowInto = length - removalLengthInThis;
          this.flowInto.removeText(absOffset, removalLengthInFlowInto);
        }
        relOffset = StringUtils.astralCorrections(
          this.textContent, relOffset);
        removalLengthInThis = StringUtils.astralCorrections(
          this.textContent.substring(relOffset),
           removalLengthInThis);

        // Now delete our own bits make sure we "do the right thing" by
        // splitting text nodes and normalizing. This ensures the right DOM
        // Mutations are sent to the DOM Mutation observer
        // Make sure we starts with ONE text node
        this.normalize();
        var textNode = this.firstChild instanceof HTMLBRElement ?
          this.childNodes[1] : this.firstChild;
        if (textNode === undefined) {
          throw new Error('run has no text node, cannot removeText');
        }
        // Now split the node at the given relOffset
        var rightTextNode = textNode.splitText(relOffset);
        // Now split this guy at the toDeleteInThis we want to cut
        rightTextNode.splitText(removalLengthInThis);
        // RightTextNode is now the guy we want to get rid of
        this.removeChild(rightTextNode);
        // Normalize to get back to one single textnode
        this.normalize();
        if (this.firstChild &&
            relOffset <= this.firstChild.textContent.length) {
          if (!NavigationUtils.undoRedoUsingTBButton(document.activeElement)) {
            DomTextSelection.setCaret(this.firstChild, relOffset);
          }
        } else {
          // In the case where we've set textContent to '', this will have no
          // children. The call below will move the cursor to the empty this
          if (!NavigationUtils.undoRedoUsingTBButton(document.activeElement)) {
            DomTextSelection.setCaret(this, 0);
          }
        }

        this.scrollIntoView();
      }
    },

    /***
     * Return the height of the box that will be occupied by a single
     * character in this run.
     * @return {number}
     */
    minHeight: function() {
      var minHeight;
      if (this.isEmpty()) {
        // There is no text node.
        minHeight = this.offsetHeight;
      } else {
        // Get the height of the bounding box of the first character
        var range = document.createRange();
        range.setStart(this.firstChild, 0);
        range.setEnd(this.firstChild, 1);
        minHeight = range.getBoundingClientRect().height;
      }
      return minHeight;
    }
  };


  /* jshint newcap: false */
  window.QowtWordRun = Polymer(MixinUtils.mergeMixin(
      QowtRun,
      // decorator mixins:
      BoldText,
      FontFace,
      FontSize,
      ItalicText,
      AllCapsText,
      BlinkText,
      EmbossText,
      EngraveText,
      FontColor,
      FontBackground,
      HiddenText,
      OutlineText,
      OverlineText,
      RunStyle,
      ShadowText,
      SmallCapsText,
      StrikethroughText,
      SubscriptText,
      SuperscriptText,
      UnderlineText,
      FlowWords,
      api_));
  /* jshint newcap: true */

  return {};
});
