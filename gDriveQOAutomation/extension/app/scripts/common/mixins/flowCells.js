/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview algorithm to flow cells within a row.
 * This is actually really easy because we now flow based on a boundingbox.
 * And since all child cells support flow themselves, we merely have to
 * iterate over the children and call flow on each.
 *
 * For more details on flow algorithms for pagination:
 * http://goto.google.com/qowt-flow-algorithms
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/flowingElement',
  'qowtRoot/utils/domUtils',
  'common/mixins/mixinUtils'
  ], function(
    FlowingElement,
    DomUtils,
    MixinUtils) {

  "use strict";

  // merge in the FlowingElement mixin
  return MixinUtils.mergeMixin(FlowingElement, {

    supports_: ['flow-cells'],

    flow: function(page) {
      if (!this.flowInto) {
        throw new Error(this.nodeName +
            ' tried to flow without having a flowInto');
      }
      if (this.onFlowStart) {
        this.onFlowStart();
      }

      var repeat;
      do {
        // make sure all cells have their own 'flowInto's
        this.constructFlowIntos_();

        // if this row has a specific (eg explicit) height, and that
        // height is larger than the available space left on the page
        // then this height should take up all the space it can, and
        // flow accordingly...
        if (this.style.height) {
          // TODO(jliebrand): the explicit height is in pt but by
          // splitting this up, it'll turn out to be px...
          // Not sure that loss of information is a problem, since we
          // never create new tables and dont support resize etc...
          // so we never send it back to the core... should be ok?
          this.explicitHeight = this.offsetHeight;
          this.style.height = '';
        }

        // flow the actual cells
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].flow(page);
        }

        // if our flowInto is now empty, then remove it and see if we have a new
        // flowInto that has content we should be looking at.
        repeat = false;
        if (this.flowInto && this.flowInto.isEmpty()) {
          this.flowInto.removeFromFlow();
          if (this.flowInto && !this.flowInto.isEmpty()) {
            repeat = true;
          }
        }
      } while (repeat);

      // normalize in case this or flowInto have ONLY empty cells
      this.normalizeFlow();

      if (this.flowInto && this.explicitHeight) {
        this.flowInto.style.height = this.explicitHeight - this.offsetHeight;
        // TODO(jliebrand): need to also reset things when
        // you normalise flows?! and unflow? Right now that info will
        // be lost! This shouldn't be an issue since we don't support
        // adding of tables (as per above TODO). So leaving this and the
        // other todo in the code for now.
      }

      if (this.onFlowEnd) {
        this.onFlowEnd();
      }
    },

    unflow: function() {

      // make sure we start at the beginning
      var start = this.flowStart();
      if (start !== this) {
        return start.unflow();
      }

      if (this.onUnflowStart) {
        this.onUnflowStart();
      }

      // unflow for as long as we have a flowInto
      if (this.flowInto) {

        // unflow all cells
        for (var i = 0; i < this.children.length; i++) {
          if (this.children[i].isFlowing()) {
            this.children[i].unflow();
          }
        }

        // normalize flow
        this.normalizeFlow();
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
        absOffset += iter.flowFrom.children.length;
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
      var relOffset = absOffset;
      var iter = this;
      while (iter.flowFrom && (iter = iter.flowFrom)) {
        relOffset -= iter.children.length;
      }
      // only return the relative offset if it's actually within this
      // children length.
      return (relOffset >= 0 && relOffset <= this.children.length) ?
          relOffset : undefined;
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
      var lengthSoFar = iter.children.length;
      while (absOffset > lengthSoFar) {
        iter = iter.flowInto;
        lengthSoFar += iter.children.length;
      }
      return iter;
    },



    // ----------------------- PRIVATE ------------------

    constructFlowIntos_: function() {
      var missingFlowIntoCount = 0;
      for (var i = 0; i < this.children.length; i++) {
        var cell = this.children[i];
        if (cell.flowInto === undefined) {
          missingFlowIntoCount++;
          var cellFlowInto = cell.createFlowInto();
          DomUtils.insertAtEnd(cellFlowInto, this.flowInto /*reference node*/);
        }
      }
      if (missingFlowIntoCount !== 0 &&
          missingFlowIntoCount !== this.childElementCount) {
        throw new Error('Either all cells should be flowing or none should be');
      }
    }


  });

});
