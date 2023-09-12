/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview table row polymer element
 *
 * Together with the table cell element, this row element ensures that we
 * only ever remove cells from a flow IF (and only if) the entire row is
 * empty.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/flowCells',

  'common/mixins/decorators/rowHeight'
], function(
    MixinUtils,
    QowtElement,
    FlowCells,

    RowHeightDecorator) {

  'use strict';

  var api_ = {
    is: 'qowt-table-row',
    extends: 'tr',

    // the DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it
    etp: 'row',


    /**
     * We override the default removeFromFlow function because our child
     * table cells never remove themselves. That responsibility is left
     * for the table row, as it is the only one that knows when ALL cells
     * are empty. Thus we "forceRemoveFromFlow" our cells if needed, and
     * then base call the default removeFromFlow for ourselves
     * See TableCell for more details
     */
    removeFromFlow: function() {

      // first remove all our cells from THEIR flows
      // and clear those named flows if needed
      var count = this.children.length;
      for (var i = 0; i < count; i++) {
        var cell = this.firstElementChild;
        var cellFlowName = cell.namedFlow();
        cell.forceRemoveFromFlow();
        // now check if the cell flow is left with only
        // one node, then clear its flow
        var cellFlowSelector = '[named-flow="' + cellFlowName + '"]';
        var cellChain = document.querySelectorAll(cellFlowSelector);
        if (cellChain.length === 1) {
          cellChain[0].clearNamedFlow();
        }
      }

      // now remove ourselves by base calling
      return FlowCells.removeFromFlow.call(this);
    },

    /**
     * Override default isEmpty: we are only empty if ALL our cells are empty
     */
    isEmpty: function() {
      // if all our cells our empty, then we are empty
      // (and can be removed during a normalize phase)
      for (var i = 0; i < this.childElementCount; i++) {
        var cell = this.children[i];
        if (!cell.isEmpty()) {
          return false;
        }
      }
      return true;
    }

  };


  /* jshint newcap: false */
  window.QowtTableRow = Polymer(MixinUtils.mergeMixin(
      QowtElement, FlowCells,

      // Decorator mixin.
      RowHeightDecorator,

      api_));
  /* jshint newcap: true */

  return {};
});
