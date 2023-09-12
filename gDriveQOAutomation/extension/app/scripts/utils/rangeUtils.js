/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview utility module to compare node positions to ranges and
 * provide a range iterator.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';
  var _api = {

    RANGE_BEFORE: 0,
    RANGE_AFTER: 1,
    RANGE_BEFORE_INTERSECTS: 2,
    RANGE_AFTER_INTERSECTS: 3,
    RANGE_AROUND: 4,
    RANGE_INSIDE: 5,
    RANGE_IDENTICAL: 6,
    RANGE_TOUCHING_LEFT: 7,
    RANGE_TOUCHING_RIGHT: 8,

    /**
     * Compare the node to the given range and return either:
     *
     *  RANGE_BEFORE: the range is entirely before the node
     *  RANGE_AFTER:  the range is entirely after the node
     *  RANGE_BEFORE_INTERSECTS: the range starts before but intersects the node
     *  RANGE_AFTER_INTERSECTS: the range ends after but it intersects the node
     *  RANGE_AROUND: the range contains the node
     *  RANGE_INSIDE: the range is inside the node
     *  RANGE_IDENTICAL: the range equals the node
     *
     * See rangeUtils-test.js for graphical representation of the differences
     *
     * @param {Range} range the range to compare with
     * @param {HTML Node} the node to compare to
     * @return {number} Will return one of the above comparison codes, eg
     *                  RANGE_BEFORE, RANGE_INSIDE, etc.
     */
    compareNode: function(range, node) {
      var result;
      if (!range || !node) {
        throw new Error('missing arguments.');
      }

      // create a range around the node, so we can use it to compare
      var nRange = document.createRange();
      nRange.selectNodeContents(node);


      // NOTE: compareBoundaryPoints API is very misleading and the
      // documentation on the web is incorrect.
      //
      // rangeA.compareBoundaryPoints(Range.START_TO_END, rangeB);
      //
      // actually means "compares end of rangeA to start of rangeB"

      var startOfRange_to_startOfNode =
          range.compareBoundaryPoints(Range.START_TO_START, nRange);

      var endOfRange_to_endOfNode =
          range.compareBoundaryPoints(Range.END_TO_END, nRange);

      var endOfRange_to_startOfNode =
          range.compareBoundaryPoints(Range.START_TO_END, nRange);

      var startOfRange_to_endOfNode =
          range.compareBoundaryPoints(Range.END_TO_START, nRange);

      if (startOfRange_to_startOfNode === 0 && endOfRange_to_endOfNode ===0) {
        result = this.RANGE_IDENTICAL;
      }
      else if (startOfRange_to_endOfNode === 0) {
        result = this.RANGE_TOUCHING_RIGHT;
      }
      else if (endOfRange_to_startOfNode === 0) {
        result = this.RANGE_TOUCHING_LEFT;
      }
      else if (startOfRange_to_startOfNode > 0 && endOfRange_to_endOfNode < 0) {
        result = this.RANGE_INSIDE;
      }
      else if (startOfRange_to_startOfNode < 0) {
        if (endOfRange_to_startOfNode < 0) {
          result = this.RANGE_BEFORE;
        }
        else if (endOfRange_to_startOfNode > 0 && endOfRange_to_endOfNode<= 0) {
          result = this.RANGE_BEFORE_INTERSECTS;
        }
        else if (endOfRange_to_endOfNode > 0) {
          result = this.RANGE_AROUND;
        }
      }
      else if (endOfRange_to_endOfNode > 0) {
        if (startOfRange_to_endOfNode > 0) {
          result = this.RANGE_AFTER;
        }
        else if (startOfRange_to_endOfNode < 0 &&
                 startOfRange_to_startOfNode >= 0) {
          result = this.RANGE_AFTER_INTERSECTS;
        }
        else if (startOfRange_to_startOfNode < 0) {
          result = this.RANGE_AROUND;
        }
      }

      return result;
    },

    /**
     * Create an iterator over a range allowing the client to provide
     * an optional filter. The filter defaults to iterating over both
     * elements and text nodes.
     *
     * @param {Range} range the range object to iterate over
     * @param {NodeFilter} opt_filter optional NodeFilter to use, defaults to
     *     (SHOW_ELEMENT || SHOW_TEXT)
     * @param {Boolean} opt_inclTouching optionally include nodes which are
     *     touching the range on either side. Defaults to false
     * @param {Boolean=} opt_skipNonSelectableElm Optional exclude nodes which
     *     are non selectable if true. False otherwise. Default false
     * @return {NodeIterator} returns the node iterator
     */
    createIterator: function(range, opt_filter, opt_inclTouching,
                             opt_skipNonSelectableElm) {
      var iter;
      var ancestor = range.commonAncestorContainer;
      if (!(opt_filter & NodeFilter.SHOW_TEXT) &&
            ancestor.nodeType === Node.TEXT_NODE) {
        ancestor = ancestor.parentNode;
      }
      var filter = opt_filter ||
        (NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      opt_skipNonSelectableElm = opt_skipNonSelectableElm || false;
      // Iterate through the children of the common ancestor.
      iter = document.createNodeIterator(ancestor, filter, {
          acceptNode: function(node) {

          if (opt_skipNonSelectableElm) {
            // If element has applied -webkit-user-select property as 'none'
            // and -webkit-user-modify property as 'read-write' then user can
            // select as well as edit that element (though selection is set as
            // none). This means -webkit-user-modify property overrides the
            // -webkit-user-select property.
            // So we used -webkit-user-modify property to check element's
            // selection ability.
            var userModifyStyle =
                window.getComputedStyle(node)['-webkit-user-modify'];
            if (userModifyStyle === 'read-only') {
              return NodeFilter.FILTER_SKIP;
            }
          }

            var comparison = _api.compareNode(range, node);

            var nodeIsOutside = (comparison === _api.RANGE_BEFORE ||
                comparison === _api.RANGE_AFTER);

            var nodeIsTouching = (comparison === _api.RANGE_TOUCHING_LEFT ||
                comparison === _api.RANGE_TOUCHING_RIGHT);

            if (nodeIsOutside) {
              return NodeFilter.FILTER_SKIP;
            }
            else {
              return (!opt_inclTouching && nodeIsTouching) ?
                  NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
            }
          }
        },
        false);

      return iter;
    }

  };

  return _api;
});