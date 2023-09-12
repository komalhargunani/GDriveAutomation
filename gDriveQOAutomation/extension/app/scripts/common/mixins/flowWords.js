/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview algorithm to flow words within an element
 *
 * We create a range object over our text and compare it's
 * getBoundingClientRect with our bounding box. We bisect the
 * range position to find the character offset that no longer
 * fits on the page, and then move those words out in to the flowInto
 *
 * For more details on flow algorithms for pagination:
 * http://goto.google.com/qowt-flow-algorithms
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/flowingElement',
  'qowtRoot/utils/search',
  'common/mixins/mixinUtils'
  ], function(FlowingElement, SearchUtils, MixinUtils) {

  "use strict";

  // merge in the FlowingElement mixin
  return MixinUtils.mergeMixin(FlowingElement, {

    supports_: ['flow-words'],

    flow: function(page) {
      var repeat;

      if (!this.flowInto) {
        throw new Error(this.nodeName +
            ' tried to flow without having a flowInto');
      }
      if (this.textContent === '') {
        // nothing to do
        return;
      }
      if (this.onFlowStart) {
        this.onFlowStart();
      }

      do {
        repeat = false;
        var originalFlowIntoLength = this.flowInto.textContent.length;

        // step 1 - put all text in this
        var allText = this.textContent + this.flowInto.textContent;
        // Only pull up content if we are not already overflowing.
        // This comes into play in a multi column section because adding
        // content to the page will cause the columns to rebalance
        if (this.getBoundingClientRect().bottom < page.boundingBox().bottom) {
          this.textContent = this.textContent + this.flowInto.textContent;
          this.flowInto.textContent = '';
        } else {
          // This looks like a noop, but it merges the text nodes into
          // one so that we can set the range properly in our binary
          // search
          this.textContent = this.textContent;
        }

        // step 2 - use a range to find the character that bursts over
        // our boundingBox. Use binary search to find the nearest char
        var range = document.createRange();
        var boundingBox = page.boundingBox().bottom;
        var charOffset = SearchUtils.binSearch({
          precision: 'low',
          searchValue: boundingBox,
          itemCount: this.textContent.length,
          getItem: function(index) {
            // use a Range at the character at 'index' and get it's Bounding
            // rect. Note: bounding rects of space characters are zero sized!
            // so if we're dealing with a space character, then try the previous
            // character (if it's there).
            while (index > 0 &&
                this.textContent.substring(index, index + 1) === ' ') {
              index--;
            }

            try {
              range.setStart(this.firstChild, index);
              range.setEnd(this.firstChild, index + 1);
            } catch (e) {
              throw new Error('FlowWords binSearch algorithm out of bounds');
            }
            var charBox = range.getBoundingClientRect();
            return charBox.bottom;
          }.bind(this)
        });

        // step 3 - the nearest char might or might not itself burst
        // over the boundingBox. If it does not, then move everything
        // AFTER the charOffset to flowInto
        try {
          range.setStart(this.firstChild, charOffset);
          range.setEnd(this.firstChild, charOffset + 1);
        } catch (e) {
          throw new Error('FlowWords algorithm out of bounds');
        }
        var charBox = range.getBoundingClientRect();
        if (charBox.bottom < page.boundingBox().bottom) {
          // move everything AFTER charoffset
          charOffset++;
        }

        // step 4 - move the text
        this.flowInto.textContent = allText.substring(charOffset);
        this.textContent = allText.substring(0, charOffset);

        // step 5 - decide if we have to "go again" in case we pulled in all
        // data from our flowInto or if we are still overflowing (multi col)
        if ((this.flowInto.isEmpty() && originalFlowIntoLength > 0) ||
            (this.getBoundingClientRect().bottom >=
            page.boundingBox().bottom)) {
          repeat = true;
        }

        // step 6 - normalize in case we moved all content into this or flowInto
        this.normalizeFlow();
      } while (repeat && this.flowInto);

      if (this.onFlowEnd) {
        this.onFlowEnd();
      }
    },


    unflow: function() {
      if (!this.isFlowing()) {
        throw new Error(this.nodeName +
            ' tried to unflow but its not currently flowing');
      }
      // step 1 - make sure we start at the beginning
      var start = this.flowStart();
      if (start !== this) {
        return start.unflow();
      }

      if (this.onUnflowStart) {
        this.onUnflowStart();
      }

      // unflow for as long as we have a flowInto
      var iter = this.flowInto;
      while (iter) {
        // pull the text back
        this.textContent = this.textContent + iter.textContent;
        iter.textContent = '';

        iter = iter.flowInto;
      }

      // Normalize this flow. Then check all parents if they need normalizing
      iter = this.flowStart();
      while (iter && iter.normalizeFlow) {
        iter.normalizeFlow();
        iter = iter.parentNode;
      }

      if (this.onUnflowEnd) {
        this.onUnflowEnd();
      }
    },

    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} relOffset an offset within THIS element
     * @return {Number} the absolute offset within this FLOW
     */
    absoluteOffsetWithinFlow: function(relOffset) {
      var absOffset = relOffset;
      var iter = this;
      while (iter.flowFrom) {
        absOffset += iter.flowFrom.textContent.length;
        iter = iter.flowFrom;
      }
      return absOffset;
    },

    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} absOffset an absolute offset within this flow
     * @return {Number} the relative offset within this element
     */
    relativeOffset: function(absOffset) {
      var iter = this;
      while (iter.flowFrom && (iter = iter.flowFrom)) {
        absOffset -= Array.from(iter.textContent).length;
      }
      // note: offset can be EQUAL to text length, because the offset
      // could be a dom position at the END of our text.
      if (absOffset >= 0 && absOffset <= this.textContent.length) {
        return absOffset;
      }
      return undefined;
    },

    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} absOffset an absolute offset within this flow
     * @return {HTMLElement} the flow node within this flow that contains
     *                       the requested absOffset
     */
    flowNodeAtOffset: function(absOffset) {
      var iter = this.flowStart();
      var lengthSoFar = iter.textContent.length;
      while (iter && absOffset > lengthSoFar) {
        iter = iter.flowInto;
        if (iter) {
          lengthSoFar += iter.textContent.length;
        }
      }
      return iter;
    }


  });

});
