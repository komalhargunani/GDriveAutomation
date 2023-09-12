define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/decorators/borderUtils',
  'common/mixins/mixinUtils'
], function(
  DecoratorBase,
  BorderUtils,
  MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['borders'],

    observers: [
      'bordersChanged_(model.ppr.borders)'
    ],

    get borders() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.borders);
    },

    set borders(value) {
      this.setInModel_('ppr.borders', value);
    },

    attached: function() {
      this.updateNeighbors_();
      this.updateParagraphBorders_();
    },

    detached: function() {
      if (this.prevParagraph) {
        this.prevParagraph.nextParagraph = this.nextParagraph;
      }
      if (this.nextParagraph) {
        this.nextParagraph.prevParagraph = this.prevParagraph;
      }
      this.updateParagraphBorders_();
    },

    /**
     * Sets the paragraph borders for the paragraph. This sets the
     * correct CSS styling depending on the border model of this paragraph
     * and neighboring paragraphs.
     */
    updateBorderDisplay: function() {
      var borders = this.model.ppr && this.model.ppr.borders;
      if (borders) {
        BorderUtils.setBorderSide(this, 'left', borders.left);
        BorderUtils.setBorderSide(this, 'right', borders.right);

        // When two adjacent paragraphs have identical borders in the model,
        // the top and bottom border that goes between them is removed and
        // replaced by the 'between' border, which we set as the top border
        // of the lower paragraph.
        if (this.prevParagraph && this.prevParagraph.nodeName !== "TEMPLATE" &&
        this.prevParagraph.model.ppr &&
            _.isEqual(this.prevParagraph.model.ppr.borders, borders)) {
          if (borders.between) {
            BorderUtils.setBorderSide(this, 'top', borders.between);
          } else {
            BorderUtils.unsetBorderSide(this, 'top');
          }
        } else {
          BorderUtils.setBorderSide(this, 'top', borders.top);
        }

        if (!(this.nextParagraph && this.nextParagraph.model.ppr &&
              _.isEqual(this.nextParagraph.model.ppr.borders, borders))) {
          BorderUtils.setBorderSide(this, 'bottom', borders.bottom);
        } else {
          BorderUtils.unsetBorderSide(this, 'bottom');
        }
      }
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {object} current the current value of table borders.
     */
    bordersChanged_: function(current) {
      if (current !== undefined) {
        this.updateNeighbors_();
        this.updateParagraphBorders_();
      } else {
        BorderUtils.unsetBorders(this);
      }
    },

    /*
     * Update all necessary paragraph borders (for this element and adjacent).
     * When the borders of a paragraph are changed, the surrounding
     * paragraphs also need to update the rendering of their paragraph borders
     */
    updateParagraphBorders_: function() {
      this.updateBorderDisplay();
      if (this.prevParagraph && this.prevParagraph.updateBorderDisplay) {
        this.prevParagraph.updateBorderDisplay();
      }
      if (this.nextParagraph && this.nextParagraph.updateBorderDisplay) {
        this.nextParagraph.updateBorderDisplay();
      }
    },

    /*
     * Updates nextParagraph and prevParagraph members to reflect
     * the neighbors of this paragraph.  Note: This method should not be
     * used when the paragraph is not attached to the DOM.
     */
    updateNeighbors_: function() {
      this.nextParagraph = this.flowEnd().nextElementSibling;
      this.prevParagraph = this.flowStart().previousElementSibling;
      if (this.prevParagraph) {
        this.prevParagraph.nextParagraph = this.flowStart();
      }
      if (this.nextParagraph) {
        this.nextParagraph.prevParagraph = this.flowEnd();
      }
    }
  });

  return api_;

});
