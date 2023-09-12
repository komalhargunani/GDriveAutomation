define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter'], function(
    DecoratorBase,
    MixinUtils,
    Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['wrapText'],

    get wrapText() {
      return (this.model && this.model.wrapText);
    },

    set wrapText(value) {
      this.setInModel_('wrapText', value, ['bothSides', 'leftOnly', 'rightOnly',
        'largestOnly']);
    },

    wrapTextChanged_: function(current) {
      if (current !== undefined) {
        this.setFloat_(current);
      }
    },

    computedDecorations_: {
      wrapText: function(computedStyles) {
        var dcpVal;
        if (computedStyles && computedStyles['float']) {
          dcpVal = wrapTextCssToDcp_[computedStyles['float']];
        }
        return dcpVal || this.wrapText;
      }
    },

    /**
     * According to wrapText data, set float property.
     *
     * @param {string} wrapText - one of the 'leftOnly', 'rightOnly',
     *                            'bothSides' or 'largestOnly'.
     * @private
     */
    get float() {
      var floatDirection = '';
      switch (this.wrapText) {
        case 'rightOnly':
          // wrapText 'rightOnly' means allow the text to flow on right side, so
          // float of drawing elm should be 'left'.
          floatDirection = 'left';
          break;

        case 'leftOnly':
          // wrapText 'leftOnly' means allow the text to flow on left side, so
          // float of drawing elm should be right.
          floatDirection = 'right';
          break;

        case 'bothSides':
        // falling back to largestOnly. Both sides can not be supported now

        case 'largestOnly':
          // largestOnly specifies that text shall only wrap around the largest
          // available side, either left or right.
          var side = this.findLargestAvailableSide_();
          if (side === 'left') {
            floatDirection = 'right';
          } else {
            floatDirection = 'left';
          }
      }
      return floatDirection;
    },

    /**
     * Finds the largest available area side, it could be  either left or right.
     *
     * <-------------------------parents width------------------------------->
     *  ---------------------------------------------------------------------
     * |                                                                     |
     * |                                          ------------------         |
     * |                                         |                  |        |
     * |<-----------largest available area --->  |  TextBox (child) |        |
     * |                                          ------------------         |
     *  ---------------------------------------------------------------------
     *  @private
     */
    findLargestAvailableSide_: function() {
      var result = 'left';
      if (this.firstElementChild && Polymer.dom(this).parentNode) {
        var childBoundingRect = this.firstElementChild.getBoundingClientRect();
        var childWidth = childBoundingRect.width;
        var parentWidth =
          Polymer.dom(this).parentNode.getBoundingClientRect().width;
        var parentsMiddle = parentWidth / 2;
        var childLeftPos = Converter.pt2px(parseInt(this.leftPos));

        // childMiddle = child's left position + (child width / 2)
        var childMiddle = childLeftPos + (childWidth / 2);

        if (childMiddle < parentsMiddle) {
          result = 'right';
        }
      }
      return result;
    }

  });

  var wrapTextCssToDcp_ = {
    'left': 'rightOnly',
    'right': 'leftOnly'
  };
  return api_;

});
