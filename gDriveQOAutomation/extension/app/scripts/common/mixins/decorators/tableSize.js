define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter'
], function(
    DecoratorBase,
    MixinUtils,
    Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['cgr'],

    observers: [
      'tableSizeChanged_(model.tableProperties.cgr)'
    ],

    /**
     * @return {Array<number>|undefined} The column grid array, contains the
     *     columns in twips.
     */
    get cgr() {
      return this.model &&
             this.model.tableProperties &&
             this.model.tableProperties.cgr;
    },


    /**
     * Set the column grid array in the model, columns are in twips.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {Array<number>} value the column grid array.
     */
    set cgr(value) {
      this.setInModel_('tableProperties.cgr', value);
    },


    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {Array<number>} current the current value of column grid array.
     */
    tableSizeChanged_: function(current) {
      if (this.previousCgr_ !== current) {
        if (current !== undefined) {
          // Setting the table size.
          this.setTableSize_(current);
        } else {
          // Unset the table size.
          this.unsetTableSize_();
        }
        this.previousCgr_ = current;
      }
    },


    /**
     * @return {Array<number>|undefined} return the column grid "Decoration"
     *     in twips for a given computed css style. Called by the
     *     DecoratorBase module.
     */
    computedDecorations_: {
      cgr: function(/* computedStyles */) {
        // If this element has the value in it's model then we do not need to
        // look in to the computed style at all, otherwise use computedStyles.
        // Note: computedStyle is ALWAYS in px, but there are rounding issues
        // Thus the pt value we get back can be a float, which should be
        // rounded as needed by the client calling this function. See:
        // http://jsbin.com/cikamibapi/1/edit?html,css,js,console,output
        var computedVal = this.cgr || this.cgrFromColumns_();
        return computedVal;
      }
    },


    /**
     * Sets the table size for a given column grid array. Sets the table width
     * and creates table columns and set its widths.
     *
     * @param columnGridArray column grid array.
     */
    setTableSize_: function(columnGridArray) {
      function totalSize_() {
        // Return total size of the column widths.
        return columnGridArray.reduce(function(sumSoFar, colWidth) {
          return sumSoFar + colWidth;
        });
      }

      // Set the table width.
      this.style.width = Converter.twip2pt(totalSize_()) + 'pt';

      // Create table columns and set the column widths.
      columnGridArray.forEach(function(columnGrid) {
        var col = document.createElement('col');
        var columnGridInPoints = Converter.twip2pt(columnGrid) + 'pt';
        col.style.width = columnGridInPoints;
        col.style.maxWidth = columnGridInPoints;
        col.style.minWidth = columnGridInPoints;
        this.$.columns.appendChild(col);
      }.bind(this));
    },


    /**
     * Unset the table size and removes all the table columns.
     */
    unsetTableSize_: function() {
      // Unset the table width.
      this.style.width = 0;
      // Delete the table columns.
      while (this.$.columns.firstChild) {
        this.$.columns.removeChild(this.$.columns.firstChild);
      }
    },


    /**
     * @return {Array<Number>} column grid array.
     */
    cgrFromColumns_: function() {
      var columns = this.$.columns;
      var cgr = [];
      for (var i = 0; i < columns.length; ++i) {
        cgr.push(Converter.pt2twip(Converter.cssSize2pt(columns[i].width)));
      }
      return cgr;
    }

  });

  return api_;

});
