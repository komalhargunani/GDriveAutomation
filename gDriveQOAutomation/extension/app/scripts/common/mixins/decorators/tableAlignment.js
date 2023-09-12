define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'
], function(
  DecoratorBase,
  MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['align'],

    observers: [
      'alignChanged_(model.tableProperties.align)'
    ],

    /**
     * @return {string} The alignment of the table: 'left' | 'center' | 'right'.
     */
    get align() {
      return (this.model &&
              this.model.tableProperties &&
              this.model.tableProperties.align);
    },

    /**
     * Set the alignment in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {string} value the alignment.
     */
    set align(value) {
      this.setInModel_('tableProperties.align', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {number} current value of alignment.
     */
    alignChanged_: function(current) {
      if ( this.previousAlign_ !== current) {
        if (current !== undefined) {
          // Set the alignment.
          switch (current) {
            case 'left':
              this.style.marginRight = 'auto';
              break;
            case 'center':
              this.style.marginRight = 'auto';
              this.style.marginLeft = 'auto';
              break;
            case 'right':
              this.style.marginLeft = 'auto';
              break;
          }
        } else {
          // Unset the alignment.
          this.style.marginLeft = 0;
          this.style.marginRight = 0;
        }
        this.previousAlign_ = current;
      }
    },

    /**
     * @return {string|undefined} return the align "Decoration" for a given
     *   computed css style. Called by the DecoratorBase module.
     */
    computedDecorations_: {
      align: function(computedStyles) {
        // if this element has the value in it's model then we do not need to
        // look in to the computed style at all, otherwise use computedStyles.
        var computedVal = this.align;
        if (!computedVal && computedVal !== '') {
          var marginLeft = computedStyles.marginLeft;
          var marginRight = computedStyles.marginRight;
          if (marginLeft === 'auto' && marginRight === 'auto') {
            computedVal = 'center';
          }
          else if (marginLeft === 'auto') {
            computedVal = 'right';
          }
          else {
            computedVal = 'left';
          }
        }

        return computedVal;
      }
    }

  });

  return api_;

});
