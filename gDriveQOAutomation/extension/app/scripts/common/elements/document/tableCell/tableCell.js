/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview table cell polymer element.
 *
 * This element overrides behviour from the standard FlowChildren mixin
 * to ensure we never accidetnally remove a table cell from a flow if
 * it's peer table cells are not empty.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/flowChildren',

  'common/mixins/decorators/backgroundColor',
  'common/mixins/decorators/cellBorders',
  'common/mixins/decorators/cellColSpan',
  'common/mixins/decorators/cellRowSpan',
  'common/mixins/decorators/verticalAlign'

], function(
    MixinUtils,
    QowtElement,
    FlowChildren,

    BackgroundColorDecorator,
    CellBordersDecorator,
    CellColSpan,
    CellRowSpan,
    VerticalAlignDecorator) {

  'use strict';

  var api_ = {
    is: 'qowt-table-cell',
    extends: 'td',

    // the DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it
    etp: 'cll',

    /**
     * Override the default removeFrom flow functionality.
     * TableCells THEMSELVEs should never just be
     * removed from a flow since that could cause
     * us to have fewer cells in one row than another.
     * So we dont do anything for this function, BUT
     * we provide a forceRemoveFromFlow so that the parent
     * table row can call (since it knows when the entire
     * row is empty and thus we can be removed safely)
     */
    removeFromFlow: function() {
      return;
    },

    /**
     * Provide forceRemoveFromFlow so that the parent table row
     * can clear out the cells when needed
     */
    forceRemoveFromFlow: function() {
      return FlowChildren.removeFromFlow.call(this);
    },

    /**
     * @return {number} return the height of our actual content
     */
    contentHeight: function() {
      return this.$.contents.offsetHeight;
    }
  };


  /* jshint newcap: false */
  window.QowtTableCell = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      FlowChildren,

      // Decorator mixin.
      BackgroundColorDecorator,
      CellBordersDecorator,
      CellColSpan,
      CellRowSpan,
      VerticalAlignDecorator,

      api_));
  /* jshint newcap: true */

  return {};
});
